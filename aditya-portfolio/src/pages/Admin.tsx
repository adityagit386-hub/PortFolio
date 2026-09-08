import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Award,
  Download,
  FileText,
  FolderPlus,
  LockKeyhole,
  LogOut,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  createCertificate,
  createProject,
  deleteCertificate,
  deleteProject,
  getAdminCertificates,
  getAdminProjects,
  getAdminResume,
  loginAdmin,
  updateCertificate,
  updateProject,
  updateResume,
} from '../services/admin'
import type { Certificate } from '../types/certificate'
import type { Project } from '../types/project'

type ContentType = 'certificate' | 'project'
type ActiveTab = ContentType | 'resume'
type ModalState = { type: ContentType; item?: Certificate | Project } | null
type AdminErrors = Partial<Record<ActiveTab, string>>

const contentLabels: Record<ContentType, string> = {
  certificate: 'Certificate',
  project: 'Project',
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string | null
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ''}
        className="mt-2 w-full rounded-lg border border-dark-200 bg-white px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-accent-500 dark:border-dark-700 dark:bg-dark-900 dark:text-white dark:focus:border-accent-500"
      />
    </label>
  )
}

function TextArea({
  label,
  name,
  required = false,
  placeholder,
  defaultValue,
  rows = 4,
}: {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  defaultValue?: string | null
  rows?: number
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
        {label}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ''}
        className="mt-2 w-full resize-y rounded-lg border border-dark-200 bg-white px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-accent-500 dark:border-dark-700 dark:bg-dark-900 dark:text-white dark:focus:border-accent-500"
      />
    </label>
  )
}

function FileField({
  label,
  name,
  accept,
  required = false,
  currentUrl,
}: {
  label: string
  name: string
  accept: string
  required?: boolean
  currentUrl?: string | null
}) {
  const [fileName, setFileName] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isImage, setIsImage] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsImage(file.type.startsWith('image/'))

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <label className="block">
      <span className="text-sm font-medium text-dark-700 dark:text-dark-200">
        {label}
      </span>
      <span className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-dark-300 bg-dark-50 px-4 py-5 text-center text-sm text-dark-500 transition-colors hover:border-accent-500 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-400 dark:hover:border-accent-600">
        {previewUrl && isImage ? (
          <img
            src={previewUrl}
            alt={fileName}
            className="mb-3 max-h-40 w-full rounded-lg object-contain"
          />
        ) : previewUrl ? (
          <FileText className="mb-2 h-8 w-8" aria-hidden="true" />
        ) : (
          <Upload className="mb-2 h-6 w-6" aria-hidden="true" />
        )}
        <span className="font-medium text-dark-700 dark:text-dark-200">
          {fileName || 'Upload file'}
        </span>
        {currentUrl && !fileName && (
          <span className="mt-1 text-xs text-dark-400 dark:text-dark-500">
            Current file will stay unless you upload a new one.
          </span>
        )}
        <input
          name={name}
          type="file"
          accept={accept}
          required={required}
          onChange={handleChange}
          className="sr-only"
        />
      </span>
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-xs font-medium text-dark-500 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white"
        >
          Open current file
        </a>
      )}
    </label>
  )
}

function ModalForm({
  modal,
  token,
  onClose,
  onSaved,
}: {
  modal: Exclude<ModalState, null>
  token: string
  onClose: () => void
  onSaved: (message: string) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const isCertificate = modal.type === 'certificate'
  const certificate = isCertificate ? (modal.item as Certificate | undefined) : undefined
  const project = !isCertificate ? (modal.item as Project | undefined) : undefined
  const editing = Boolean(modal.item)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const result =
      isCertificate && certificate
        ? await updateCertificate(token, certificate.id, formData)
        : isCertificate
          ? await createCertificate(token, formData)
          : project
            ? await updateProject(token, project.id, formData)
            : await createProject(token, formData)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onSaved(
      `${isCertificate ? 'Certificate' : 'Project'} ${
        editing ? 'updated' : 'added'
      } successfully.`,
    )
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${editing ? 'Edit' : 'Add'} ${isCertificate ? 'certificate' : 'project'}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-dark-200 bg-white shadow-2xl dark:border-dark-700 dark:bg-dark-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-dark-200 bg-white px-5 py-4 dark:border-dark-800 dark:bg-dark-950">
          <div>
            <h2 className="text-lg font-bold">
              {editing ? 'Edit' : 'Add'} {isCertificate ? 'Certificate' : 'Project'}
            </h2>
            <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
              {isCertificate
                ? 'Upload a certificate file and manage its public details.'
                : 'Manage the project card, image, tags, and links.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-dark-100 hover:text-dark-900 dark:text-dark-400 dark:hover:bg-dark-800 dark:hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form className="space-y-5 p-5" onSubmit={handleSubmit}>
          {isCertificate ? (
            <>
              <FileField
                label="Certificate PDF or Image"
                name="certificate_file"
                accept="application/pdf,image/*"
                required={!editing}
                currentUrl={
                  certificate?.certificate_image_url ||
                  certificate?.certificate_file_url
                }
              />
              <Field label="Certificate Name" name="title" required defaultValue={certificate?.title} />
              <Field label="Date" name="issue_date" type="date" defaultValue={certificate?.issue_date} />
              <Field label="Organization" name="issuer" required defaultValue={certificate?.issuer} />
              <Field label="Category" name="category" placeholder="AI/ML, Web Development" defaultValue={certificate?.category} />
              <Field label="Credential URL" name="credential_url" type="url" defaultValue={certificate?.credential_url} />
              <Field label="Skills" name="skills" placeholder="Python, Machine Learning" defaultValue={certificate?.skills?.join(', ')} />
              <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-200">
                <input name="featured" type="checkbox" defaultChecked={certificate?.featured ?? false} className="h-4 w-4 rounded" />
                Featured
              </label>
            </>
          ) : (
            <>
              <FileField
                label="Project Image"
                name="project_image"
                accept="image/*"
                currentUrl={project?.image_url}
              />
              <Field label="Project Name" name="title" required defaultValue={project?.title} />
              <Field label="Slug" name="slug" placeholder="auto-created if empty" defaultValue={project?.slug} />
              <Field label="Category" name="category" required placeholder="Machine Learning" defaultValue={project?.category} />
              <TextArea label="Short Description" name="short_description" required rows={3} defaultValue={project?.short_description} />
              <TextArea label="Full Description" name="full_description" rows={6} defaultValue={project?.full_description} />
              <Field label="Technologies" name="technologies" placeholder="React, Python, Flask" defaultValue={project?.technologies?.join(', ')} />
              <Field label="GitHub URL" name="github_url" type="url" defaultValue={project?.github_url} />
              <Field label="Live URL" name="live_url" type="url" defaultValue={project?.live_url} />
              <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-200">
                <input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} className="h-4 w-4 rounded" />
                Featured
              </label>
            </>
          )}

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-dark-100 pt-5 dark:border-dark-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-wait disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function ContentRow({
  title,
  meta,
  imageUrl,
  fileUrl,
  deleting = false,
  onEdit,
  onDelete,
}: {
  title: string
  meta: string
  imageUrl?: string | null
  fileUrl?: string | null
  deleting?: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-dark-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-900 sm:flex-row sm:items-center">
      <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-dark-50 dark:bg-dark-800 sm:w-32">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : fileUrl ? (
          <iframe
            src={`${fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
            title={`${title} preview`}
            className="pointer-events-none h-full w-full border-0 bg-white"
          />
        ) : (
          <FileText className="h-6 w-6 text-dark-300 dark:text-dark-600" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-dark-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">{meta}</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 disabled:cursor-wait disabled:opacity-60 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:border-red-400 dark:border-red-900/60 dark:text-red-300"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

function ResumeManager({
  token,
  resumeUrl,
  onSaved,
}: {
  token: string
  resumeUrl: string | null
  onSaved: (url: string) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const result = await updateResume(token, formData)
    setSubmitting(false)

    if (result.error || !result.data?.resume_url) {
      setError(result.error || 'Unable to update resume')
      return
    }

    onSaved(result.data.resume_url)
    event.currentTarget.reset()
  }

  return (
    <div className="rounded-xl border border-dark-200 bg-white p-5 dark:border-dark-700 dark:bg-dark-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Manage Resume</h2>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            Upload a new PDF resume for the public download button.
          </p>
        </div>
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Current Resume
          </a>
        )}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <FileField label="Resume PDF" name="resume_file" accept="application/pdf" required currentUrl={resumeUrl} />
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-wait disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Uploading...' : 'Update Resume'}
        </button>
      </form>
    </div>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('portfolioAdminToken') || '')
  const [activeTab, setActiveTab] = useState<ActiveTab>('certificate')
  const [modal, setModal] = useState<ModalState>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [status, setStatus] = useState('')
  const [errors, setErrors] = useState<AdminErrors>({})
  const [loggingIn, setLoggingIn] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const loadAdminData = async (
    authToken = token,
    sections: ActiveTab[] = ['certificate', 'project', 'resume'],
  ) => {
    if (!authToken) return
    setLoading(true)

    const nextErrors: AdminErrors = {}

    await Promise.all(
      sections.map(async (section) => {
        if (section === 'certificate') {
          const result = await getAdminCertificates<Certificate>(authToken)
          if (result.data) setCertificates(result.data)
          if (result.error) nextErrors.certificate = result.error
          return
        }

        if (section === 'project') {
          const result = await getAdminProjects<Project>(authToken)
          if (result.data) setProjects(result.data)
          if (result.error) nextErrors.project = result.error
          return
        }

        const result = await getAdminResume(authToken)
        if (result.data) setResumeUrl(result.data.resume_url)
        if (result.error) nextErrors.resume = result.error
      }),
    )

    setErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors }
      sections.forEach((section) => {
        if (nextErrors[section]) {
          updatedErrors[section] = nextErrors[section]
        } else {
          delete updatedErrors[section]
        }
      })
      return updatedErrors
    })

    setLoading(false)
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadAdminData()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [token])

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoggingIn(true)
    setLoginError('')

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get('username') || '')
    const password = String(formData.get('password') || '')
    const result = await loginAdmin({ username, password })

    setLoggingIn(false)

    if (result.error || !result.data?.token) {
      setLoginError(result.error || 'Login failed')
      return
    }

    localStorage.setItem('portfolioAdminToken', result.data.token)
    setToken(result.data.token)
  }

  const handleLogout = () => {
    localStorage.removeItem('portfolioAdminToken')
    setToken('')
    setStatus('')
    setErrors({})
  }

  const handleSaved = (type: ContentType, message: string) => {
    setStatus(message)
    loadAdminData(token, [type])
  }

  const handleDelete = async (type: ContentType, id: string, title: string) => {
    if (deletingId) return
    if (!window.confirm(`Delete "${title}"?`)) return

    setDeletingId(id)
    setStatus('')
    setErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors }
      delete updatedErrors[type]
      return updatedErrors
    })

    const result =
      type === 'certificate'
        ? await deleteCertificate(token, id)
        : await deleteProject(token, id)

    setDeletingId('')

    if (result.error) {
      setErrors((currentErrors) => ({ ...currentErrors, [type]: result.error }))
      return
    }

    setStatus(`${contentLabels[type]} deleted.`)
    loadAdminData(token, [type])
  }

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'certificate', label: 'Certificates' },
    { id: 'project', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
          <div className="mb-10">
            <p className="text-sm font-medium uppercase tracking-widest text-dark-400 dark:text-dark-500">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">Portfolio Admin</h1>
            <p className="mt-3 max-w-2xl text-dark-500 dark:text-dark-400">
              Add, edit, delete, and publish portfolio content.
            </p>
          </div>

          {!token ? (
            <form
              onSubmit={handleLogin}
              className="max-w-md rounded-xl border border-dark-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-900"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500 text-white">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">Admin Login</h2>
                  <p className="text-sm text-dark-500 dark:text-dark-400">
                    Sign in to manage portfolio content.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <Field label="Username" name="username" required />
                <Field label="Password" name="password" type="password" required />
              </div>
              {loginError && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  {loginError}
                </p>
              )}
              <button
                type="submit"
                disabled={loggingIn}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-wait disabled:opacity-60"
              >
                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                {loggingIn ? 'Signing in...' : 'Login'}
              </button>
            </form>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent-500 text-white shadow-sm shadow-accent-950/20'
                          : 'border border-dark-200 text-dark-700 hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadAdminData()}
                    className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>

              {status && (
                <p className="mb-6 rounded-lg border border-dark-200 bg-white px-3 py-2 text-sm text-dark-600 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-300">
                  {status}
                </p>
              )}

              {errors[activeTab] && (
                <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                  {errors[activeTab]}
                </p>
              )}

              {activeTab === 'certificate' && (
                <div className="mb-6 max-w-xl">
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'certificate' })}
                    className="flex min-h-40 w-full flex-col items-start justify-between rounded-xl border border-dark-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-accent-500 hover:shadow-xl hover:shadow-dark-950/5 dark:border-dark-700 dark:bg-dark-900 dark:hover:border-accent-600 dark:hover:shadow-black/30"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300">
                      <Award className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xl font-bold">Add Certificate</span>
                      <span className="mt-2 block text-sm leading-relaxed text-dark-500 dark:text-dark-400">
                        Upload a certificate file with name, date, organization, and category.
                      </span>
                    </span>
                  </button>
                </div>
              )}

              {activeTab === 'project' && (
                <div className="mb-6 max-w-xl">
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'project' })}
                    className="flex min-h-40 w-full flex-col items-start justify-between rounded-xl border border-dark-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-accent-500 hover:shadow-xl hover:shadow-dark-950/5 dark:border-dark-700 dark:bg-dark-900 dark:hover:border-accent-600 dark:hover:shadow-black/30"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300">
                      <FolderPlus className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xl font-bold">Add Project</span>
                      <span className="mt-2 block text-sm leading-relaxed text-dark-500 dark:text-dark-400">
                        Add a project card with image, descriptions, tags, and links.
                      </span>
                    </span>
                  </button>
                </div>
              )}

              {loading && (
                <p className="rounded-xl border border-dark-200 bg-white p-5 text-sm text-dark-500 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-400">
                  Loading admin data...
                </p>
              )}

              {!loading && activeTab === 'certificate' && (
                <div className="space-y-3">
                  {certificates.length === 0 ? (
                    <p className="rounded-xl border border-dark-200 bg-white p-5 text-sm text-dark-500 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-400">
                      No certificates found.
                    </p>
                  ) : (
                    certificates.map((certificate) => (
                      <ContentRow
                        key={certificate.id}
                        title={certificate.title}
                        meta={`${certificate.issuer || 'No organization'}${
                          certificate.category ? ` / ${certificate.category}` : ''
                        }`}
                        imageUrl={certificate.certificate_image_url}
                        fileUrl={certificate.certificate_file_url}
                        deleting={deletingId === certificate.id}
                        onEdit={() => setModal({ type: 'certificate', item: certificate })}
                        onDelete={() => handleDelete('certificate', certificate.id, certificate.title)}
                      />
                    ))
                  )}
                </div>
              )}

              {!loading && activeTab === 'project' && (
                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <p className="rounded-xl border border-dark-200 bg-white p-5 text-sm text-dark-500 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-400">
                      No projects found.
                    </p>
                  ) : (
                    projects.map((project) => (
                      <ContentRow
                        key={project.id}
                        title={project.title}
                        meta={`${project.category || 'No category'} / ${project.slug}`}
                        imageUrl={project.image_url}
                        deleting={deletingId === project.id}
                        onEdit={() => setModal({ type: 'project', item: project })}
                        onDelete={() => handleDelete('project', project.id, project.title)}
                      />
                    ))
                  )}
                </div>
              )}

              {!loading && activeTab === 'resume' && (
                <ResumeManager
                  token={token}
                  resumeUrl={resumeUrl}
                  onSaved={(url) => {
                    setResumeUrl(url)
                    setStatus('Resume updated successfully.')
                  }}
                />
              )}
            </>
          )}
        </section>
      </main>
      <Footer />

      <AnimatePresence>
        {modal && token && (
          <ModalForm
            modal={modal}
            token={token}
            onClose={() => setModal(null)}
            onSaved={(message) => handleSaved(modal.type, message)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
