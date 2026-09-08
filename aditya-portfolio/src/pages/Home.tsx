import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import Education from '../components/Education'
import ProjectCard from '../components/ProjectCard'
import CertificateCard from '../components/CertificateCard'
import SocialProfiles from '../components/SocialProfiles'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SectionHeading from '../components/SectionHeading'
import { ProjectCardSkeleton, CertificateCardSkeleton } from '../components/Skeletons'
import { getProjects } from '../services/projects'
import { getCertificates } from '../services/certificates'
import type { Project } from '../types/project'
import type { Certificate } from '../types/certificate'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [certificatesLoading, setCertificatesLoading] = useState(true)
  const [projectsError, setProjectsError] = useState(false)
  const [certificatesError, setCertificatesError] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadProjects() {
      try {
        const all = await getProjects()
        if (!mounted) return
        const featured = all.filter((p) => p.featured)
        setFeaturedProjects(featured.length ? featured : all.slice(0, 3))
      } catch {
        if (mounted) setProjectsError(true)
      } finally {
        if (mounted) setProjectsLoading(false)
      }
    }

    async function loadCertificates() {
      try {
        const all = await getCertificates()
        if (!mounted) return
        setCertificates(all.slice(0, 4))
      } catch {
        if (mounted) setCertificatesError(true)
      } finally {
        if (mounted) setCertificatesLoading(false)
      }
    }

    loadProjects()
    loadCertificates()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <About />
        <Skills />
        <Experience />
        <Education />

        <section
          id="projects"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
          aria-label="Projects"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              title="Featured Projects"
              subtitle="A selection of projects I've built."
            />
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
            >
              All Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10">
            {projectsLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : projectsError ? (
              <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
                Unable to load projects right now.
              </p>
            ) : featuredProjects.length === 0 ? (
              <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
                Projects coming soon.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

        </section>

        <section
          id="certificates"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6"
          aria-label="Certificates"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              title="Certificates"
              subtitle="Certifications and credentials earned."
            />
            <Link
              to="/certificates"
              className="inline-flex items-center gap-1.5 rounded-lg border border-dark-200 px-4 py-2 text-sm font-semibold text-dark-700 transition-colors hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-200 dark:hover:border-accent-600 dark:hover:text-accent-300"
            >
              All Certificates
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10">
            {certificatesLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <CertificateCardSkeleton key={i} />
                ))}
              </div>
            ) : certificatesError ? (
              <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
                Unable to load certificates right now.
              </p>
            ) : certificates.length === 0 ? (
              <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
                Certificates will be added soon.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {certificates.map((cert) => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            )}
          </div>
        </section>

        <SocialProfiles />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
