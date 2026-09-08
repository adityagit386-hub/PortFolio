import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  BadgeCheck,
  ExternalLink,
  X,
  Download,
  FileText,
  Calendar,
} from 'lucide-react'
import type { Certificate } from '../types/certificate'

interface CertificateCardProps {
  certificate: Certificate
}

const issuerStyles: Record<string, string> = {
  IBM: 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
  NPTEL: 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
  EXCELR: 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
  default: 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
}

function PreviewModal({
  certificate,
  onClose,
}: {
  certificate: Certificate
  onClose: () => void
}) {
  const imageUrl =
    certificate.certificate_image_url || certificate.certificate_file_url
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${certificate.title} preview`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-xl bg-white dark:bg-dark-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-dark-900/70 text-white hover:bg-dark-900 transition-colors"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {imageUrl?.endsWith('.pdf') ? (
          <iframe
            src={imageUrl}
            title={certificate.title}
            className="h-[85vh] w-[min(90vw,60rem)] border-0"
          />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={certificate.title}
            className="max-h-[90vh] w-full object-contain"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center p-8 text-center">
            <p className="text-dark-400 dark:text-dark-500">
              No preview available for this certificate yet.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function CertificateCard({
  certificate,
}: CertificateCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const hasPreview =
    !!certificate.certificate_image_url || !!certificate.certificate_file_url
  const style =
    issuerStyles[certificate.issuer] || issuerStyles.default
  const isPdf = !!certificate.certificate_file_url

  const openPreview = () => {
    if (!hasPreview) return
    setPreviewOpen(true)
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="group flex flex-col overflow-hidden rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-dark-950/5 dark:hover:shadow-black/30"
      >
        <button
          onClick={openPreview}
          disabled={!hasPreview}
          className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-dark-50 dark:bg-dark-800 disabled:cursor-default"
          aria-label={
            hasPreview
              ? `Preview ${certificate.title}`
              : `Preview unavailable for ${certificate.title}`
          }
        >
          {certificate.certificate_image_url ? (
            <img
              src={certificate.certificate_image_url}
              alt={certificate.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : certificate.certificate_file_url ? (
            <iframe
              src={`${certificate.certificate_file_url}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
              title={`${certificate.title} PDF preview`}
              loading="lazy"
              className="pointer-events-none h-full w-full border-0 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <Award className="h-12 w-12 text-dark-300 dark:text-dark-600" aria-hidden="true" />
              <span className="text-sm text-dark-400 dark:text-dark-500">
                {isPdf ? 'PDF preview' : 'Preview coming soon'}
              </span>
            </div>
          )}
          {hasPreview && (
            <span className="absolute inset-0 flex items-center justify-center bg-dark-900/0 transition-colors duration-300 group-hover:bg-dark-900/30">
              <ExternalLink
                className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />
            </span>
          )}
        </button>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
              >
                {certificate.issuer}
              </span>
              {certificate.category && (
                <span className="inline-flex rounded-full bg-dark-50 px-2.5 py-1 text-xs font-semibold text-dark-600 dark:bg-dark-800 dark:text-dark-300">
                  {certificate.category}
                </span>
              )}
            </div>
            {certificate.issue_date && (
              <span className="flex items-center gap-1 text-xs text-dark-400 dark:text-dark-500">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {new Date(certificate.issue_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                })}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-base font-semibold leading-snug text-dark-900 dark:text-white">
            {certificate.title}
          </h3>

          {certificate.skills && certificate.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {certificate.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-dark-50 dark:bg-dark-800 px-2 py-0.5 text-xs font-medium text-dark-600 dark:text-dark-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3 border-t border-dark-100 dark:border-dark-800 pt-4">
            {hasPreview && (
              <button
                onClick={openPreview}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-700 transition-colors hover:text-accent-600 dark:text-dark-200 dark:hover:text-accent-400"
              >
                {isPdf ? (
                  <Download className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                )}
                View Certificate
              </button>
            )}
            {certificate.credential_url && (
              <a
                href={certificate.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-700 transition-colors hover:text-accent-600 dark:text-dark-200 dark:hover:text-accent-400"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Verify Credential
              </a>
            )}
            {hasPreview && !isPdf && certificate.certificate_file_url && (
              <a
                href={certificate.certificate_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-dark-700 transition-colors hover:text-accent-600 dark:text-dark-200 dark:hover:text-accent-400"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                PDF
              </a>
            )}
          </div>
        </div>
      </motion.article>

      <AnimatePresence>
        {previewOpen && (
          <PreviewModal
            certificate={certificate}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
