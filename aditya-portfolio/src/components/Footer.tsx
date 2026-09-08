import { Link } from 'react-router-dom'
import { GithubIcon } from './BrandIcons'
import { personalInfo } from '../data/personal'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-dark-200 bg-dark-50 dark:border-dark-800 dark:bg-dark-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-dark-500 dark:text-dark-400">
          © {year} {personalInfo.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link
            to="/projects"
            className="text-sm text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/certificates"
            className="text-sm text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
          >
            Certificates
          </Link>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-dark-500 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white transition-colors"
          >
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
