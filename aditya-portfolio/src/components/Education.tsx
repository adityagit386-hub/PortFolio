import { motion } from 'framer-motion'
import { GraduationCap, Building2, CheckCircle2 } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { educationItems } from '../data/education'

export default function Education() {
  return (
    <section
      id="education"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="Education"
    >
      <SectionHeading
        title="Education"
        subtitle="My academic journey."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {educationItems.map((edu, idx) => (
          <motion.div
            key={`${edu.degree}-${edu.institution}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className={`relative overflow-hidden rounded-xl border bg-white dark:bg-dark-900 p-6 shadow-sm transition-shadow hover:shadow-md ${
              edu.current
                ? 'border-emerald-500 dark:border-emerald-700'
                : 'border-dark-200 dark:border-dark-700'
            }`}
          >
            {edu.current && (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Current
              </span>
            )}

            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-bold text-dark-900 dark:text-white">
                  {edu.degree}
                </p>
                <p className="text-sm font-medium text-dark-600 dark:text-dark-300">
                  {edu.field}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-start gap-2 text-dark-600 dark:text-dark-300">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-dark-400 dark:text-dark-500" aria-hidden="true" />
                <span>
                  <span className="font-medium">{edu.institution}</span>
                  <span className="text-dark-400 dark:text-dark-500">
                    {' '}· {edu.location}
                  </span>
                </span>
              </p>
              <p className="text-dark-500 dark:text-dark-400">{edu.period}</p>
            </div>

            <div className="mt-5 border-t border-dark-100 dark:border-dark-800 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-dark-400 dark:text-dark-500">
                {edu.scoreLabel}
              </p>
              <p className="mt-0.5 text-xl font-bold text-dark-900 dark:text-white">
                {edu.score}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
