import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { GithubIcon, LinkedInIcon } from './BrandIcons'
import { navLinks, personalInfo } from '../data/personal'
import ThemeToggle from './ThemeToggle'

const sectionIds = [
  'home',
  'about',
  'skills',
  'experience',
  'projects',
  'certificates',
  'coding-profiles',
  'contact',
]
const routeLinks = [{ label: 'Admin', href: '/admin' }]

function getActiveSection() {
  if (typeof window === 'undefined') return 'home'

  const pageBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4
  if (pageBottom) return sectionIds[sectionIds.length - 1]

  let current = 'home'
  let largestVisibleArea = 0
  const viewportTop = 64
  const viewportBottom = window.innerHeight

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const visibleArea =
      Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop)

    if (visibleArea > largestVisibleArea) {
      largestVisibleArea = visibleArea
      current = id
    }
  })

  return current
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(getActiveSection)
  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (isHome) {
        setActiveSection(getActiveSection())
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    window.addEventListener('hashchange', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('hashchange', handleScroll)
    }
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? 'border-b border-dark-200/60 bg-dark-50/85 backdrop-blur-xl dark:border-dark-800/70 dark:bg-dark-950/80'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-dark-900 dark:text-white hover:opacity-80 transition-opacity"
          aria-label="Aditya Wale home"
        >
          ADITYA<span className="text-accent-500">.WALE</span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const href = link.href.replace('#', '')
            const isActive = isHome && activeSection === href
            return (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={handleNavClick}
                className={`relative rounded-md px-2 py-2 text-sm font-medium transition-colors lg:px-3 ${
                  isActive
                    ? 'text-accent-600 dark:text-accent-500'
                    : 'text-dark-500 dark:text-dark-400 hover:text-accent-600 dark:hover:text-accent-500'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent-500 lg:inset-x-3"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
          {routeLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={handleNavClick}
                className={`relative rounded-md px-2 py-2 text-sm font-medium transition-colors lg:px-3 ${
                  isActive
                    ? 'text-accent-600 dark:text-accent-500'
                    : 'text-dark-500 dark:text-dark-400 hover:text-accent-600 dark:hover:text-accent-500'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent-500 lg:inset-x-3"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex h-9 w-9 items-center justify-center text-dark-500 dark:text-dark-400 hover:text-accent-600 dark:hover:text-accent-500 transition-colors"
          >
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex h-9 w-9 items-center justify-center text-dark-500 dark:text-dark-400 hover:text-accent-600 dark:hover:text-accent-500 transition-colors"
          >
            <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-dark-700 dark:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-dark-200/60 dark:border-dark-800/70"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-dark-700 dark:text-dark-200 hover:bg-accent-50 hover:text-accent-700 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
                >
                  {link.label}
                </motion.a>
              ))}
              {routeLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navLinks.length + i) * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={handleNavClick}
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-dark-700 hover:bg-accent-50 hover:text-accent-700 dark:text-dark-200 dark:hover:bg-accent-950/40 dark:hover:text-accent-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center gap-4 px-3 pb-2 pt-4">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300"
                >
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300"
                >
                  <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
