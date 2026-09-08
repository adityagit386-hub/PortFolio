import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { ProjectCardSkeleton } from '../components/Skeletons'
import { getProjects } from '../services/projects'
import type { Project } from '../types/project'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('All')

  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean)),
  )

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.category === filter)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getProjects()
        if (mounted) setProjects(data)
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
  }, [])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-dark-400 dark:text-dark-500">
            <Link to="/" className="hover:text-dark-600 dark:hover:text-dark-300">
              Home
            </Link>{' '}
            / Projects
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Projects</h1>
          <p className="mt-3 max-w-2xl text-dark-500 dark:text-dark-400">
            A collection of projects I've built - from machine-learning
            applications to full-stack web experiences.
          </p>
        </div>

        {!loading && !error && projects.length > 0 && categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
            <button
              onClick={() => setFilter('All')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === 'All'
                  ? 'bg-accent-500 text-white shadow-sm shadow-accent-950/20'
                  : 'border border-dark-200 text-dark-600 hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:text-accent-300'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === cat
                    ? 'bg-accent-500 text-white shadow-sm shadow-accent-950/20'
                    : 'border border-dark-200 text-dark-600 hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:text-accent-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
            Unable to load projects right now.
          </p>
        ) : projects.length === 0 ? (
          <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
            Projects coming soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
