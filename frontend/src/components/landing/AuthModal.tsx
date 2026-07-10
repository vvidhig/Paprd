import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export type AuthMode = 'login' | 'signup'

interface Props {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-2xl border-2 border-lavender/40 bg-page px-4 py-3 font-body text-sm text-dark outline-none transition-all duration-300 placeholder:text-dark/35 hover:border-lavender focus:border-skyblue focus:shadow-focus'

export default function AuthModal({ mode, onModeChange, onClose }: Props) {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signup') await signup(name, email, password)
      else await login(email, password)
      navigate('/library')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(45,38,64,0.35)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] rounded-3xl border border-lavender/30 bg-white/90 p-8 shadow-panel"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Decorative corner blobs */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-lavender/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-skyblue/40 blur-2xl" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-lavender/20 text-sm text-dark transition-all duration-300 hover:scale-110 hover:bg-lavender/40"
        >
          ✕
        </button>

        <div className="mb-1 flex items-center gap-2">
          <img src="/assets/logo.svg" alt="" className="h-7 w-7" />
          <span className="font-heading text-lg font-bold text-dark">Paprd</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-dark">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-1 font-body text-sm text-dark/50">
          {mode === 'signup' ? 'Start understanding everything in minutes.' : 'Your documents missed you.'}
        </p>

        {/* Tabs */}
        <div className="mt-5 flex rounded-pill bg-lavender/15 p-1">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                onModeChange(m)
                setError(null)
              }}
              className="relative flex-1 rounded-pill py-2 font-body text-sm font-semibold text-dark transition-colors duration-300"
            >
              {mode === m && (
                <motion.span
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 rounded-pill bg-white shadow-card"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{m === 'login' ? 'Log in' : 'Sign up'}</span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputClass}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Password (6+ characters)' : 'Password'}
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            className={inputClass}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-rose/15 px-4 py-2.5 font-body text-xs font-medium text-dark"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={busy}
            className="mt-1 rounded-pill py-3.5 font-heading text-sm font-semibold text-white shadow-cta transition-shadow duration-300 hover:shadow-card-hover disabled:opacity-60"
            style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
          >
            {busy ? 'One moment...' : mode === 'signup' ? '✨ Create account' : '📚 Log in'}
          </motion.button>
        </form>

        <p className="mt-4 text-center font-body text-[11px] text-dark/40">
          No credit card. Your documents stay on your machine.
        </p>
      </motion.div>
    </motion.div>
  )
}
