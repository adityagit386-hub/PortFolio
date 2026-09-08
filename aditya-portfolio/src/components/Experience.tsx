import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { experienceItems } from '../data/experience'

export default function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="Experience"
    >
      <SectionHeading
        title="Experience"
        subtitle="Professional experience and internships."
      />

      <div className="relative mt-12 ml-2 border-l-2 border-dark-100 dark:border-dark-800 sm:ml-4">
        {experienceItems.map((item, idx) => (
          <motion.div
            key={`${item.role}-${item.company}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative pl-8 pb-10 sm:pl-10"
          >
            <span className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-accent-500 dark:border-dark-950" />

            <div className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300">
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm font-medium text-dark-600 dark:text-dark-300">
                      {item.company}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-400 dark:text-dark-500">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.duration}
                </span>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-dark-500 dark:text-dark-400">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {item.location}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-dark-600 dark:text-dark-300">
                {item.description}
              </p>

              <ul className="mt-4 space-y-2">
                {item.highlights.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-start gap-2.5 text-sm text-dark-600 dark:text-dark-300"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-dark-400 dark:bg-dark-500" />
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
