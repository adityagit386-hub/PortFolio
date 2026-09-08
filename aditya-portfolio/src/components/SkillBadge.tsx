import { motion } from 'framer-motion'

interface SkillBadgeProps {
  name: string
  icon?: React.ReactNode
}

export default function SkillBadge({ name, icon }: SkillBadgeProps) {
  return (
    <motion.span
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="inline-flex cursor-default items-center gap-2 rounded-lg border border-dark-200 bg-white px-3 py-1.5 text-sm font-medium text-dark-700 shadow-sm transition-all duration-200 hover:border-accent-500 hover:text-accent-700 hover:shadow-md dark:border-dark-700 dark:bg-dark-900 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
    >
      {icon && <span className="text-accent-500">{icon}</span>}
      {name}
    </motion.span>
  )
}
