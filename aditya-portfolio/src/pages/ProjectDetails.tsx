import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  Folder,
  List,
  Tags,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react'
import { GithubIcon } from '../components/BrandIcons'
import { getProjectBySlug } from '../services/projects'
import type { Project } from '../types/project'

export default function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!slug) return
      try {
        const data = await getProjectBySlug(slug)
        if (!mounted) return
        if (data === null) {
          setNotFound(true)
        } else {
          setProject(data)
        }
      } catch {
        if (mounted) setError(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [slug])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-dark-500 transition-colors hover:text-accent-600 dark:text-dark-400 dark:hover:text-accent-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-dark-100 dark:bg-dark-800" />
            <div className="aspect-video w-full animate-pulse rounded-xl bg-dark-100 dark:bg-dark-800" />
          </div>
        )}

        {error && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Project Unavailable</h1>
            <p className="mt-3 text-dark-500 dark:text-dark-400">
              Unable to load this project right now.
            </p>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dark-200 px-4 py-2 text-sm font-medium text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Projects
            </Link>
          </div>
        )}

        {notFound && !loading && !error && (
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <p className="mt-3 text-dark-500 dark:text-dark-400">
              This project doesn't exist or may have been removed.
            </p>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dark-200 px-4 py-2 text-sm font-medium text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Projects
            </Link>
          </div>
        )}

        {project && !loading && (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              {project.category && (
                <span className="rounded-full bg-dark-50 dark:bg-dark-800 px-3 py-1 text-xs font-medium text-dark-600 dark:text-dark-300">
                  {project.category}
                </span>
              )}
              {project.featured && (
                <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 dark:bg-accent-950/40 dark:text-accent-300">
                  Featured
                </span>
              )}
              {project.created_at && (
                <span className="flex items-center gap-1 text-xs text-dark-400 dark:text-dark-500">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Date(project.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {project.title}
            </h1>

            <p className="mt-4 text-lg text-dark-500 dark:text-dark-400">
              {project.short_description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-950/20 transition-colors hover:bg-accent-600"
                >
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                  GitHub Repository
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-5 py-2.5 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>

            <div className="mt-10 overflow-hidden rounded-xl border border-dark-200 dark:border-dark-700 bg-dark-50 dark:bg-dark-800">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={`${project.title} screenshot`}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center">
                  <Folder
                    className="h-16 w-16 text-dark-300 dark:text-dark-600"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            {project.full_description && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <List className="h-5 w-5 text-accent-500" aria-hidden="true" />
                  About the Project
                </h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-dark-600 dark:text-dark-300">
                  {project.full_description}
                </p>
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-10">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Tags className="h-5 w-5 text-accent-500" aria-hidden="true" />
                  Technologies
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-3 py-1.5 text-sm font-medium text-dark-700 dark:text-dark-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.article>
        )}
      </div>
    </div>
  )
}
