import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Sidebar from './components/layout/Sidebar'
import PageTransition from './components/layout/PageTransition'
import LandingPage from './pages/LandingPage'
import LibraryPage from './pages/LibraryPage'
import AskPage from './pages/AskPage'
import NotesPage from './pages/NotesPage'
import FlashcardsPage from './pages/FlashcardsPage'
import TutorPage from './pages/TutorPage'
import { DocumentsContext, useDocumentsState } from './hooks/useDocuments'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './components/shared/Toast'

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <motion.img
          src="/assets/logo.svg"
          alt=""
          className="h-12 w-12"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

function AppRoutes() {
  const location = useLocation()
  const documentsState = useDocumentsState()
  const isLanding = location.pathname === '/'

  const appPage = (page: ReactNode) => (
    <RequireAuth>
      <PageTransition>{page}</PageTransition>
    </RequireAuth>
  )

  return (
    <DocumentsContext.Provider value={documentsState}>
      <div className="flex min-h-screen bg-page">
        {!isLanding && <Sidebar />}
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <LandingPage />
                  </PageTransition>
                }
              />
              <Route path="/library" element={appPage(<LibraryPage />)} />
              <Route path="/ask" element={appPage(<AskPage />)} />
              <Route path="/notes" element={appPage(<NotesPage />)} />
              <Route path="/flashcards" element={appPage(<FlashcardsPage />)} />
              <Route path="/tutor" element={appPage(<TutorPage />)} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </DocumentsContext.Provider>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let rafId: number
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  )
}
