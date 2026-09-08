import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Certificates = lazy(() => import('./pages/Certificates'))
const Admin = lazy(() => import('./pages/Admin'))

function PageFallback() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        <div className="h-10 w-2/3 animate-pulse rounded bg-dark-100 dark:bg-dark-800" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900"
            >
              <div className="aspect-[16/9] w-full bg-dark-100 dark:bg-dark-800" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded bg-dark-100 dark:bg-dark-800" />
                <div className="h-3 w-full rounded bg-dark-100 dark:bg-dark-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
