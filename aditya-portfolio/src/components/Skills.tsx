import { motion } from 'framer-motion'
import { Code, Brain, Layout, Server, Database, Wrench } from 'lucide-react'
import SectionHeading from './SectionHeading'
import SkillBadge from './SkillBadge'
import { skillCategories } from '../data/skills'

const iconMap: Record<string, typeof Code> = {
  code: Code,
  brain: Brain,
  layout: Layout,
  server: Server,
  database: Database,
  tools: Wrench,
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="Skills"
    >
      <SectionHeading
        title="Skills"
        subtitle="Technologies and tools I work with."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] || Code
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="text-base font-semibold text-dark-900 dark:text-white">
                  {cat.title}
                </h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <SkillBadge key={skill} name={skill} />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
