import base64
import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import time
from functools import wraps
from pathlib import Path
from urllib.parse import quote

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv


backend_env_path = Path(__file__).with_name(".env")
project_env_path = Path(__file__).resolve().parent.parent / ".env"

load_dotenv(project_env_path)
load_dotenv(backend_env_path, override=True)
app = Flask(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174",
    ).split(",")
    if origin.strip()
]
CORS(app, origins=allowed_origins)


def env_value(name):
    fallback_names = {
        "SUPABASE_URL": ["VITE_SUPABASE_URL"],
        "SUPABASE_SERVICE_ROLE_KEY": [
            "SUPABASE_SECRET_KEY",
            "SUPABASE_SERVICE_KEY",
        ],
    }
    value = os.getenv(name)
    for fallback_name in fallback_names.get(name, []):
        value = value or os.getenv(fallback_name)
    if not value:
        raise RuntimeError(f"{name} is not configured")
    return value


def token_secret():
    return os.getenv("ADMIN_TOKEN_SECRET") or env_value("ADMIN_PASSWORD")


def base64url_encode(payload):
    return base64.urlsafe_b64encode(payload).rstrip(b"=").decode("ascii")


def base64url_decode(payload):
    padding = "=" * (-len(payload) % 4)
    return base64.urlsafe_b64decode(payload + padding)


def create_token(username):
    body = {
        "sub": username,
        "iat": int(time.time()),
        "exp": int(time.time()) + 60 * 60 * 12,
        "nonce": secrets.token_hex(8),
    }
    encoded_body = base64url_encode(json.dumps(body, separators=(",", ":")).encode())
    signature = hmac.new(
        token_secret().encode(),
        encoded_body.encode(),
        hashlib.sha256,
    ).digest()
    return f"{encoded_body}.{base64url_encode(signature)}"


def verify_token(token):
    try:
        encoded_body, encoded_signature = token.split(".", 1)
        expected_signature = hmac.new(
            token_secret().encode(),
            encoded_body.encode(),
            hashlib.sha256,
        ).digest()
        actual_signature = base64url_decode(encoded_signature)
        if not hmac.compare_digest(expected_signature, actual_signature):
            return False

        body = json.loads(base64url_decode(encoded_body))
        return int(body.get("exp", 0)) >= int(time.time())
    except Exception:
        return False


def require_admin(handler):
    @wraps(handler)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header.removeprefix("Bearer ").strip()
        if not token or not verify_token(token):
            return jsonify({"error": "Admin login required"}), 401
        return handler(*args, **kwargs)

    return wrapper


def supabase_headers(extra=None):
    service_key = env_value("SUPABASE_SERVICE_ROLE_KEY")
    if service_key.startswith("sb_publishable_"):
        raise RuntimeError(
            "Supabase admin writes need a secret/service-role key, not the publishable key"
        )
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
    }
    if extra:
        headers.update(extra)
    return headers


def supabase_url(path):
    return f"{env_value('SUPABASE_URL').rstrip('/')}{path}"


def supabase_request(method, path, **kwargs):
    try:
        return requests.request(method, supabase_url(path), **kwargs)
    except requests.RequestException as error:
        raise RuntimeError(f"Unable to reach Supabase: {error}") from error


def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or f"item-{int(time.time())}"


def split_list(value):
    return [item.strip() for item in value.split(",") if item.strip()]


def form_text(name, default=""):
    return request.form.get(name, default).strip()


def form_bool(name):
    return request.form.get(name) in {"on", "true", "1", "yes"}


def file_content_type(file_storage):
    if not file_storage or not file_storage.filename:
        return ""
    return (
        file_storage.mimetype
        or mimetypes.guess_type(file_storage.filename)[0]
        or "application/octet-stream"
    )


def public_storage_url(bucket, object_path):
    encoded_path = quote(object_path, safe="/")
    return supabase_url(f"/storage/v1/object/public/{bucket}/{encoded_path}")


def ensure_table(table):
    response = supabase_request(
        "GET",
        f"/rest/v1/{table}?select=*&limit=1",
        headers=supabase_headers(),
        timeout=15,
    )

    if response.status_code == 404:
        raise RuntimeError(
            f"Supabase table '{table}' is missing. Run supabase/schema.sql in the Supabase SQL Editor."
        )
    if not response.ok:
        raise RuntimeError(response.text or f"Unable to verify {table} table")


def ensure_storage_bucket(bucket):
    response = supabase_request(
        "GET",
        f"/storage/v1/bucket/{bucket}",
        headers=supabase_headers(),
        timeout=15,
    )
    if response.ok:
        return

    missing_bucket = response.status_code in {400, 404} and "Bucket not found" in response.text
    if not missing_bucket:
        raise RuntimeError(response.text or f"Unable to verify {bucket} bucket")

    create_response = supabase_request(
        "POST",
        "/storage/v1/bucket",
        headers=supabase_headers({"Content-Type": "application/json"}),
        json={"id": bucket, "name": bucket, "public": True},
        timeout=15,
    )

    if create_response.ok or create_response.status_code == 409:
        return

    raise RuntimeError(create_response.text or f"Unable to create {bucket} bucket")


def upload_to_storage(bucket, file_storage, folder):
    if not file_storage or not file_storage.filename:
        return None

    ensure_storage_bucket(bucket)

    filename = file_storage.filename
    extension = os.path.splitext(filename)[1].lower()
    safe_name = slugify(os.path.splitext(filename)[0])
    object_path = f"{folder}/{int(time.time())}-{safe_name}{extension}"
    content_type = file_content_type(file_storage)

    response = supabase_request(
        "PUT",
        f"/storage/v1/object/{bucket}/{quote(object_path, safe='/')}",
        headers=supabase_headers(
            {
                "Content-Type": content_type,
                "x-upsert": "false",
            },
        ),
        data=file_storage.read(),
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or "File upload failed")

    return {
        "url": public_storage_url(bucket, object_path),
        "content_type": content_type,
    }


def insert_row(table, payload):
    response = supabase_request(
        "POST",
        f"/rest/v1/{table}",
        headers=supabase_headers(
            {
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        ),
        json=payload,
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or f"Unable to create {table} row")

    rows = response.json()
    return rows[0] if rows else {}


def select_rows(table):
    ensure_table(table)
    response = supabase_request(
        "GET",
        f"/rest/v1/{table}?select=*&order=created_at.desc",
        headers=supabase_headers(),
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or f"Unable to load {table}")

    return response.json()


def update_row(table, row_id, payload):
    ensure_table(table)
    response = supabase_request(
        "PATCH",
        f"/rest/v1/{table}?id=eq.{quote(row_id, safe='')}",
        headers=supabase_headers(
            {
                "Content-Type": "application/json",
                "Prefer": "return=representation",
            },
        ),
        json=payload,
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or f"Unable to update {table} row")

    rows = response.json()
    return rows[0] if rows else {}


def delete_row(table, row_id):
    ensure_table(table)
    response = supabase_request(
        "DELETE",
        f"/rest/v1/{table}?id=eq.{quote(row_id, safe='')}",
        headers=supabase_headers({"Prefer": "return=representation"}),
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or f"Unable to delete {table} row")

    rows = response.json()
    return rows[0] if rows else {"id": row_id}


def get_setting(key):
    response = supabase_request(
        "GET",
        f"/rest/v1/site_settings?key=eq.{quote(key, safe='')}&select=value&limit=1",
        headers=supabase_headers(),
        timeout=30,
    )

    missing_site_settings = response.status_code in {400, 404} and (
        "site_settings" in response.text
        or "Could not find the table" in response.text
        or "PGRST205" in response.text
    )
    if missing_site_settings:
        return None

    if not response.ok:
        raise RuntimeError(response.text or "Unable to load site setting")

    rows = response.json()
    return rows[0]["value"] if rows else None


def upsert_setting(key, value):
    ensure_table("site_settings")
    response = supabase_request(
        "POST",
        "/rest/v1/site_settings?on_conflict=key",
        headers=supabase_headers(
            {
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates,return=representation",
            },
        ),
        json={"key": key, "value": value},
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(response.text or "Unable to save site setting")

    rows = response.json()
    return rows[0] if rows else {"key": key, "value": value}


@app.get("/api/health")
def health():
    return jsonify({"data": {"ok": True}})


@app.get("/api/admin/status")
@require_admin
def admin_status():
    checks = {}

    for table in ("projects", "certificates", "site_settings"):
        try:
            ensure_table(table)
            checks[f"{table}_table"] = "ok"
        except RuntimeError as error:
            checks[f"{table}_table"] = str(error)

    for bucket in ("project-images", "certificate-files", "certificate-images", "resume-files"):
        try:
            ensure_storage_bucket(bucket)
            checks[f"{bucket}_bucket"] = "ok"
        except RuntimeError as error:
            checks[f"{bucket}_bucket"] = str(error)

    status_code = 200 if all(value == "ok" for value in checks.values()) else 400
    return jsonify({"data": checks}), status_code


@app.get("/api/admin/certificates")
@require_admin
def admin_certificates():
    try:
        return jsonify({"data": select_rows("certificates")})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.get("/api/admin/projects")
@require_admin
def admin_projects():
    try:
        return jsonify({"data": select_rows("projects")})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.get("/api/admin/resume")
@require_admin
def admin_resume():
    try:
        return jsonify({"data": {"resume_url": get_setting("resume_url")}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.post("/api/login")
def login():
    payload = request.get_json(silent=True) or {}
    expected_username = os.getenv("ADMIN_USERNAME", "admin")
    expected_password = env_value("ADMIN_PASSWORD")

    username_matches = hmac.compare_digest(
        str(payload.get("username", "")),
        expected_username,
    )
    password_matches = hmac.compare_digest(
        str(payload.get("password", "")),
        expected_password,
    )

    if not username_matches or not password_matches:
        return jsonify({"error": "Invalid admin username or password"}), 401

    return jsonify({"data": {"token": create_token(expected_username)}})


@app.post("/api/certificates")
@require_admin
def create_certificate():
    try:
        ensure_table("certificates")

        title = form_text("title")
        issuer = form_text("issuer")
        file_storage = request.files.get("certificate_file")

        if not title or not issuer:
            return jsonify({"error": "Certificate name and organization are required"}), 400
        if not file_storage or not file_storage.filename:
            return jsonify({"error": "Certificate PDF or image is required"}), 400

        content_type = file_content_type(file_storage)
        is_image = content_type.startswith("image/")
        bucket = "certificate-images" if is_image else "certificate-files"
        uploaded = upload_to_storage(
            bucket,
            file_storage,
            "certificates",
        )

        row = insert_row(
            "certificates",
            {
                "title": title,
                "issuer": issuer,
                "issue_date": form_text("issue_date") or None,
                "credential_url": form_text("credential_url") or None,
                "certificate_file_url": None if is_image else uploaded["url"],
                "certificate_image_url": uploaded["url"] if is_image else None,
                "category": form_text("category") or None,
                "skills": split_list(form_text("skills")),
                "featured": form_bool("featured"),
            },
        )
        return jsonify({"data": {"id": row.get("id")}}), 201
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.patch("/api/certificates/<row_id>")
@require_admin
def update_certificate(row_id):
    try:
        payload = {
            "title": form_text("title"),
            "issuer": form_text("issuer"),
            "issue_date": form_text("issue_date") or None,
            "credential_url": form_text("credential_url") or None,
            "category": form_text("category") or None,
            "skills": split_list(form_text("skills")),
            "featured": form_bool("featured"),
        }

        file_storage = request.files.get("certificate_file")
        if file_storage and file_storage.filename:
            content_type = file_content_type(file_storage)
            is_image = content_type.startswith("image/")
            bucket = "certificate-images" if is_image else "certificate-files"
            uploaded = upload_to_storage(bucket, file_storage, "certificates")
            payload["certificate_file_url"] = None if is_image else uploaded["url"]
            payload["certificate_image_url"] = uploaded["url"] if is_image else None

        row = update_row("certificates", row_id, payload)
        return jsonify({"data": {"id": row.get("id", row_id)}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.delete("/api/certificates/<row_id>")
@require_admin
def delete_certificate(row_id):
    try:
        row = delete_row("certificates", row_id)
        return jsonify({"data": {"id": row.get("id", row_id)}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.post("/api/projects")
@require_admin
def create_project():
    try:
        ensure_table("projects")

        title = form_text("title")
        if not title:
            return jsonify({"error": "Project name is required"}), 400

        slug = form_text("slug") or slugify(title)
        uploaded = upload_to_storage(
            "project-images",
            request.files.get("project_image"),
            "projects",
        )
        short_description = form_text("short_description")

        row = insert_row(
            "projects",
            {
                "title": title,
                "slug": slug,
                "short_description": short_description,
                "full_description": form_text("full_description") or short_description,
                "technologies": split_list(form_text("technologies")),
                "github_url": form_text("github_url") or None,
                "live_url": form_text("live_url") or None,
                "image_url": uploaded["url"] if uploaded else None,
                "featured": form_bool("featured"),
                "category": form_text("category"),
            },
        )
        return jsonify({"data": {"id": row.get("id"), "slug": row.get("slug")}}), 201
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.patch("/api/projects/<row_id>")
@require_admin
def update_project(row_id):
    try:
        title = form_text("title")
        if not title:
            return jsonify({"error": "Project name is required"}), 400

        payload = {
            "title": title,
            "slug": form_text("slug") or slugify(title),
            "short_description": form_text("short_description"),
            "full_description": form_text("full_description") or form_text("short_description"),
            "technologies": split_list(form_text("technologies")),
            "github_url": form_text("github_url") or None,
            "live_url": form_text("live_url") or None,
            "featured": form_bool("featured"),
            "category": form_text("category"),
        }

        file_storage = request.files.get("project_image")
        if file_storage and file_storage.filename:
            uploaded = upload_to_storage("project-images", file_storage, "projects")
            payload["image_url"] = uploaded["url"]

        row = update_row("projects", row_id, payload)
        return jsonify({"data": {"id": row.get("id", row_id), "slug": row.get("slug")}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.delete("/api/projects/<row_id>")
@require_admin
def delete_project(row_id):
    try:
        row = delete_row("projects", row_id)
        return jsonify({"data": {"id": row.get("id", row_id)}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


@app.post("/api/resume")
@require_admin
def update_resume():
    try:
        file_storage = request.files.get("resume_file")
        if not file_storage or not file_storage.filename:
            return jsonify({"error": "Resume PDF is required"}), 400

        uploaded = upload_to_storage("resume-files", file_storage, "resume")
        upsert_setting("resume_url", uploaded["url"])
        return jsonify({"data": {"resume_url": uploaded["url"]}})
    except RuntimeError as error:
        return jsonify({"error": str(error)}), 400


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "1")
