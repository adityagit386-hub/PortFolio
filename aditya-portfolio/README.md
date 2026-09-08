# Aditya Wale Portfolio

A responsive personal portfolio website for Aditya Dnyaneshwar Wale.

Static content lives in frontend data files. Projects, certificates, and the resume link are loaded from Supabase and can be managed through the protected `/admin` page using the Python backend.

## Features

- Sticky navbar with active-section highlighting and mobile menu
- Hero, About, Skills, Experience, Education, Projects, Certificates, Social Profiles, Contact
- Projects and certificates loaded from Supabase PostgreSQL and Storage
- Project detail pages with `/projects/:slug` routes
- Certificate preview modal with PDF/image support
- Admin login page for adding, editing, and deleting projects and certificates
- Admin resume manager for replacing the public resume PDF
- Python Flask backend for secure admin writes
- Resume download loaded from Supabase with a local fallback
- Dark and light mode
- Responsive layout

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| Routing | React Router |
| Admin API | Python, Flask |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |

## Supabase Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run `supabase/schema.sql`.
4. Make these storage buckets public:
   - `project-images`
   - `certificate-files`
   - `certificate-images`
   - `resume-files`

## Environment Variables

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
# Older Supabase projects may use this instead:
VITE_SUPABASE_ANON_KEY=
# Optional. Leave blank during local Vite development to use the /api proxy.
VITE_ADMIN_API_URL=
```

Create `backend/.env`:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# Newer Supabase projects may call this a secret key. Use either this
# or SUPABASE_SERVICE_ROLE_KEY for backend-only admin writes.
SUPABASE_SECRET_KEY=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-password
ADMIN_TOKEN_SECRET=change-this-long-random-secret
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
PORT=8001
```

Keep `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SECRET_KEY` only in `backend/.env`.

## Run Locally

First-time setup:

```powershell
npm install
npm run setup:backend
```

Run frontend and backend together:

```powershell
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Admin:

```text
http://127.0.0.1:5173/admin
```

## Build

```powershell
npm run build
npm run preview
```

## Deployment Notes

- The frontend can be deployed to Vercel.
- The Python backend must be deployed separately on a Python hosting service.
- Set `VITE_ADMIN_API_URL` in production to the deployed backend URL.
- Never put the Supabase secret/service-role key in frontend environment variables.
