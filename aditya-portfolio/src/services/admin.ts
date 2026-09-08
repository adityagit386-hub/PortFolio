export interface AdminLoginPayload {
  username: string
  password: string
}

export interface AdminResponse<T> {
  data?: T
  error?: string
}

const adminApiUrl =
  (import.meta.env.VITE_ADMIN_API_URL as string | undefined)?.replace(/\/$/, '') ||
  ''

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<AdminResponse<T>> {
  try {
    const response = await fetch(`${adminApiUrl}${path}`, options)
    const payload = (await response.json()) as AdminResponse<T>

    if (!response.ok) {
      return { error: payload.error || 'Request failed' }
    }

    return payload
  } catch {
    return { error: 'Unable to reach the admin backend' }
  }
}

export async function loginAdmin(payload: AdminLoginPayload) {
  return request<{ token: string }>('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function createCertificate(token: string, formData: FormData) {
  return request<{ id: string }>('/api/certificates', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
}

export async function createProject(token: string, formData: FormData) {
  return request<{ id: string; slug: string }>('/api/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
}

export async function getAdminCertificates<T>(token: string) {
  return request<T[]>('/api/admin/certificates', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getAdminProjects<T>(token: string) {
  return request<T[]>('/api/admin/projects', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateCertificate(
  token: string,
  id: string,
  formData: FormData,
) {
  return request<{ id: string }>(`/api/certificates/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
}

export async function updateProject(token: string, id: string, formData: FormData) {
  return request<{ id: string; slug: string }>(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
}

export async function deleteCertificate(token: string, id: string) {
  return request<{ id: string }>(`/api/certificates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function deleteProject(token: string, id: string) {
  return request<{ id: string }>(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getAdminResume(token: string) {
  return request<{ resume_url: string | null }>('/api/admin/resume', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateResume(token: string, formData: FormData) {
  return request<{ resume_url: string }>('/api/resume', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
}
