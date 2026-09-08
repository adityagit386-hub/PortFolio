import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, BadgeCheck, Terminal, Activity } from 'lucide-react'
import { GithubIcon, LinkedInIcon } from './BrandIcons'
import { personalInfo } from '../data/personal'
import { getResumeUrl } from '../services/resume'

const roles = personalInfo.roles

function useTypewriter(words: string[]) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!words.length) return
    const current = words[index % words.length]
    let timeout: number

    if (!deleting && subIndex === current.length) {
      timeout = window.setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && subIndex === 0) {
      timeout = window.setTimeout(() => {
        setDeleting(false)
        setIndex((prev) => (prev + 1) % words.length)
      }, 400)
    } else {
      timeout = window.setTimeout(
        () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
        deleting ? 40 : 90,
      )
    }
    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, words])

  return words[index % words.length].substring(0, subIndex)
}

function HeroPortrait() {
  return (
    <div className="relative mx-auto flex min-h-[520px] w-full max-w-[520px] items-end justify-center overflow-hidden">
      <div className="absolute bottom-8 h-[78%] w-[78%] rounded-full bg-dark-100 shadow-inner dark:bg-dark-800" />
      <div className="absolute bottom-2 h-[86%] w-[86%] rounded-full border border-accent-500/25" />
      <div className="absolute bottom-16 right-10 h-44 w-44 rounded-full bg-accent-500/20 blur-3xl dark:bg-accent-500/15" />
      <img
        src="/images/aditya-portrait-cutout.png"
        alt="Aditya Wale"
        className="relative z-10 max-h-[500px] w-auto object-contain drop-shadow-[0_28px_55px_rgba(0,0,0,0.45)]"
      />
    </div>
  )
}

export default function Hero() {
  const typed = useTypewriter(roles)
  const [resumeUrl, setResumeUrl] = useState(personalInfo.resumeUrl)

  useEffect(() => {
    let mounted = true
    getResumeUrl().then((url) => {
      if (mounted) setResumeUrl(url)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 pb-16 pt-24 sm:px-6"
      aria-label="Introduction"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            <BadgeCheck
              className="h-3.5 w-3.5 text-emerald-500"
              aria-hidden="true"
            />
            {personalInfo.openTo}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-sm font-medium uppercase tracking-widest text-dark-400 dark:text-dark-500"
          >
            Hello, I'm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 flex items-center gap-2 text-lg font-medium text-dark-500 dark:text-dark-400 sm:text-2xl"
            aria-live="polite"
          >
            <Terminal
              className="h-5 w-5 text-dark-400 dark:text-dark-500"
              aria-hidden="true"
            />
            <span className="min-h-[2.5rem] font-mono">
              {typed}
              <span className="animate-pulse">|</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-dark-500 dark:text-dark-400 sm:text-lg"
          >
            {personalInfo.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent-950/20 transition-colors hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              View My Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-5 py-2.5 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:bg-accent-50 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:bg-accent-950/30 dark:hover:text-accent-300"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 flex items-center gap-4"
          >
            <span className="text-sm text-dark-400 dark:text-dark-500">
              Find me on:
            </span>
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-sm font-medium text-dark-600 transition-colors hover:border-accent-500 hover:bg-accent-50 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:bg-accent-950/30 dark:hover:text-accent-300"
            >
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-sm font-medium text-dark-600 transition-colors hover:border-accent-500 hover:bg-accent-50 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:bg-accent-950/30 dark:hover:text-accent-300"
            >
              <LinkedInIcon className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hidden lg:block"
        >
          <HeroPortrait />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <Activity
          className="h-4 w-4 animate-bounce text-dark-300 dark:text-dark-600"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
