export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900">
      <div className="aspect-[16/9] w-full bg-dark-100 dark:bg-dark-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-dark-100 dark:bg-dark-800" />
        <div className="h-3 w-full rounded bg-dark-100 dark:bg-dark-800" />
        <div className="h-3 w-4/5 rounded bg-dark-100 dark:bg-dark-800" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-md bg-dark-100 dark:bg-dark-800" />
          <div className="h-6 w-16 rounded-md bg-dark-100 dark:bg-dark-800" />
          <div className="h-6 w-16 rounded-md bg-dark-100 dark:bg-dark-800" />
        </div>
      </div>
    </div>
  )
}

export function CertificateCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900">
      <div className="aspect-[16/10] w-full bg-dark-100 dark:bg-dark-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-1/3 rounded bg-dark-100 dark:bg-dark-800" />
        <div className="h-4 w-3/4 rounded bg-dark-100 dark:bg-dark-800" />
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-md bg-dark-100 dark:bg-dark-800" />
          <div className="h-5 w-24 rounded-md bg-dark-100 dark:bg-dark-800" />
        </div>
      </div>
    </div>
  )
}
