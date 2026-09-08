import { motion } from 'framer-motion'
import { Code2, Trophy, ExternalLink } from 'lucide-react'
import { GithubIcon, LinkedInIcon } from './BrandIcons'
import SectionHeading from './SectionHeading'
import { personalInfo } from '../data/personal'

const platforms = [
  {
    name: 'GitHub',
    description: 'Code and open-source work',
    url: personalInfo.github,
    icon: GithubIcon,
  },
  {
    name: 'LeetCode',
    description: 'Data structures & algorithms',
    url: personalInfo.leetcode,
    icon: Code2,
  },
  {
    name: 'HackerRank',
    description: 'Coding challenges & certifications',
    url: personalInfo.hackerrank,
    icon: Trophy,
  },
  {
    name: 'LinkedIn',
    description: 'Professional network & updates',
    url: personalInfo.linkedin,
    icon: LinkedInIcon,
  },
]

export default function SocialProfiles() {
  return (
    <section
      id="coding-profiles"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="Coding profiles"
    >
      <SectionHeading
        title="Coding Profiles"
        subtitle="Where I write code, solve problems, and share my journey."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {platforms.map((platform, idx) => {
          const Icon = platform.icon
          return (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group flex items-center gap-4 rounded-xl border border-dark-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-lg dark:border-dark-700 dark:bg-dark-900 dark:hover:border-accent-600"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-dark-50 text-dark-600 transition-colors group-hover:bg-accent-50 group-hover:text-accent-700 dark:bg-dark-800 dark:text-dark-300 dark:group-hover:bg-accent-950/40 dark:group-hover:text-accent-300">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-semibold text-dark-900 dark:text-white">
                  {platform.name}
                  <ExternalLink
                    className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </p>
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  {platform.description}
                </p>
              </div>
            </motion.a>
          )
        })}
      </div>

    </section>
  )
}
