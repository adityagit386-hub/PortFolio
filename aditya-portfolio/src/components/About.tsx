import { motion } from 'framer-motion'
import { MapPin, GraduationCap, Gauge, CalendarClock } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { personalInfo } from '../data/personal'

const quickInfo = [
  {
    icon: MapPin,
    label: 'Location',
    value: personalInfo.location,
  },
  {
    icon: GraduationCap,
    label: 'Degree',
    value: 'B.Tech AI & Machine Learning',
  },
  {
    icon: Gauge,
    label: 'Current CGPA',
    value: '8.32',
  },
  {
    icon: CalendarClock,
    label: 'Graduation',
    value: 'Expected 2028',
  },
  {
    icon: null,
    label: 'Focus',
    value: 'Machine Learning & AI Engineering',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
      aria-label="About me"
    >
      <SectionHeading
        title="About Me"
        subtitle="A short introduction to who I am and what I do."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <p className="text-base leading-relaxed text-dark-600 dark:text-dark-300 sm:text-lg">
            {personalInfo.aboutDescription}
          </p>
          <p className="mt-4 text-base leading-relaxed text-dark-600 dark:text-dark-300 sm:text-lg">
            I'm currently pursuing a B.Tech in Artificial Intelligence &
            Machine Learning with a strong passion for Python development, web
            development, and building real-world intelligent systems. I enjoy
            turning ideas into working products — from machine-learning models
            to interactive web applications.
          </p>
          <p className="mt-4 text-base leading-relaxed text-dark-600 dark:text-dark-300 sm:text-lg">
            Through my internship as a Full Stack Python Developer and
            continuous project work, I've developed a solid foundation in both
            machine learning and modern full-stack development, and I'm always
            excited to learn new technologies and take on challenging problems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="grid gap-3">
            {quickInfo.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-4 shadow-sm"
                >
                  {Icon && (
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-500 dark:text-dark-400">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-dark-400 dark:text-dark-500">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-dark-800 dark:text-dark-100">
                      {item.value}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
