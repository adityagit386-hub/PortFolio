import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CertificateCard from '../components/CertificateCard'
import { CertificateCardSkeleton } from '../components/Skeletons'
import { getCertificates } from '../services/certificates'
import type { Certificate } from '../types/certificate'

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('All')

  const issuers = Array.from(
    new Set(certificates.map((c) => c.issuer).filter(Boolean)),
  )

  const filteredCertificates =
    filter === 'All'
      ? certificates
      : certificates.filter((c) => c.issuer === filter)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await getCertificates()
        if (mounted) setCertificates(data)
      } catch {
        if (mounted) setError(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-dark-400 dark:text-dark-500">
            <Link to="/" className="hover:text-dark-600 dark:hover:text-dark-300">
              Home
            </Link>{' '}
            / Certificates
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Certificates</h1>
          <p className="mt-3 max-w-2xl text-dark-500 dark:text-dark-400">
            Certifications completed to build a strong foundation in AI/ML,
            full-stack development, and more.
          </p>
        </div>

        {!loading && !error && certificates.length > 0 && issuers.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter certificates">
            <button
              onClick={() => setFilter('All')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === 'All'
                  ? 'bg-accent-500 text-white shadow-sm shadow-accent-950/20'
                  : 'border border-dark-200 text-dark-600 hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:text-accent-300'
              }`}
            >
              All
            </button>
            {issuers.map((issuer) => (
              <button
                key={issuer}
                onClick={() => setFilter(issuer)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === issuer
                    ? 'bg-accent-500 text-white shadow-sm shadow-accent-950/20'
                    : 'border border-dark-200 text-dark-600 hover:border-accent-500 hover:text-accent-700 dark:border-dark-700 dark:text-dark-300 dark:hover:border-accent-600 dark:hover:text-accent-300'
                }`}
              >
                {issuer}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
            Unable to load certificates right now.
          </p>
        ) : certificates.length === 0 ? (
          <p className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 p-6 text-sm text-dark-500 dark:text-dark-400">
            Certificates will be added soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCertificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
