import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Folder, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import type { Project } from '../types/project'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-dark-950/5 dark:hover:shadow-black/30"
    >
      <Link
        to={`/projects/${project.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-dark-50 dark:bg-dark-800"
        aria-label={`View ${project.title}`}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Folder className="h-10 w-10 text-dark-300 dark:text-dark-600" aria-hidden="true" />
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm shadow-accent-950/20">
            Featured
          </span>
        )}
        {project.category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {project.category}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          to={`/projects/${project.slug}`}
          className="group/title inline-flex items-center gap-1 text-lg font-semibold text-dark-900 transition-colors hover:text-accent-600 dark:text-white dark:hover:text-accent-400"
        >
          {project.title}
          <ArrowUpRight
            className="h-4 w-4 opacity-0 transition-all duration-200 group-hover/title:translate-x-0.5 group-hover/title:opacity-100"
            aria-hidden="true"
          />
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-dark-500 dark:text-dark-400">
          {project.short_description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies?.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-dark-50 px-2 py-1 text-xs font-medium text-dark-600 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-accent-950/30 dark:hover:text-accent-300"
            >
              {tech}
            </span>
          ))}
          {project.technologies && project.technologies.length > 4 && (
            <span className="rounded-md px-2 py-1 text-xs text-dark-400 dark:text-dark-500">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-dark-100 dark:border-dark-800 pt-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-600 transition-colors hover:text-accent-600 dark:text-dark-300 dark:hover:text-accent-400"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-600 transition-colors hover:text-accent-600 dark:text-dark-300 dark:hover:text-accent-400"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
