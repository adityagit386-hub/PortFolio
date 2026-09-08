import { motion } from 'framer-motion'
import { Mail, MapPin } from 'lucide-react'
import { GithubIcon, LinkedInIcon } from './BrandIcons'
import SectionHeading from './SectionHeading'
import { personalInfo } from '../data/personal'

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="Contact"
    >
      <SectionHeading
        title="Get in Touch"
        subtitle="Have a question, opportunity, or just want to say hi? My inbox is always open."
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="mt-10 flex flex-col items-center gap-8 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-8 sm:p-12 text-center"
      >
        <p className="text-2xl font-semibold text-dark-900 dark:text-white sm:text-3xl">
          Let's build something great together.
        </p>

        <div className="flex flex-col items-center gap-2 text-sm text-dark-500 dark:text-dark-400">
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-2 text-base font-medium text-dark-800 transition-colors hover:text-accent-600 dark:text-dark-100 dark:hover:text-accent-400"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {personalInfo.email}
          </a>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {personalInfo.location}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-950/20 transition-colors hover:bg-accent-600"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Send Email
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-5 py-2.5 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
          >
            <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-5 py-2.5 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
          >
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </motion.div>
    </section>
  )
}
