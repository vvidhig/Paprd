import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocuments } from '../../hooks/useDocuments'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/library', icon: '', label: 'Library' },
  { to: '/ask', icon: '', label: 'Ask' },
  { to: '/notes', icon: '', label: 'Notes' },
  { to: '/flashcards', icon: '', label: 'Flashcards' },
  { to: '/tutor', icon: '', label: 'Tutor' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { documents } = useDocuments()
  const { user, logout } = useAuth()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E8C0FC 0%, #A8DEFA 100%)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 pb-6 pt-7 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/60 shadow-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 3h9l5 5v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
              fill="#FF99C8"
              stroke="#2D2640"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M14 3v5h5" fill="#FCF5BF" stroke="#2D2640" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 13h8M8 17h5" stroke="#2D2640" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="font-heading text-2xl font-bold text-dark">Paprd</div>
            <div className="font-body text-[10px] font-medium text-dark/60">Feed it docs.</div>
          </motion.div>
        )}
      </div>

      <div className="mx-4 mb-4 h-px bg-white/40" />

      {/* Nav */}
      <nav className="flex flex-col gap-1.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-3 font-body text-sm font-semibold text-dark transition-colors duration-300 ${collapsed ? 'justify-center px-0' : ''
                } ${active ? '' : 'hover:bg-white/30'}`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-2xl bg-white shadow-card"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 text-lg leading-none">{item.icon}</span>
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="flex-1" />

      {/* Document count */}
      <div className={`mx-4 mb-3 rounded-2xl bg-white/30 px-4 py-3 ${collapsed ? 'mx-2 px-2 text-center' : ''}`}>
        <span className="font-body text-xs font-medium text-dark">
          📄 {collapsed ? documents.length : `${documents.length} document${documents.length === 1 ? '' : 's'} loaded`}
        </span>
      </div>

      {/* User chip */}
      {user && (
        <div
          className={`mx-4 mb-3 flex items-center gap-2.5 rounded-2xl bg-white/50 px-3 py-2.5 ${collapsed ? 'mx-2 justify-center px-1' : ''
            }`}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold text-white shadow-card"
            style={{ background: 'linear-gradient(135deg, #FF99C8 0%, #E8C0FC 100%)' }}
            title={user.name}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-xs font-semibold text-dark">{user.name}</p>
                <p className="truncate font-body text-[10px] text-dark/50">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="shrink-0 rounded-full bg-white/70 p-1.5 transition-all duration-300 hover:scale-110 hover:bg-white"
                title="Log out"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                    stroke="#2D2640"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mx-4 mb-5 flex items-center justify-center rounded-2xl bg-white/40 py-2.5 text-dark transition-all duration-300 hover:bg-white/70"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <motion.svg
          animate={{ rotate: collapsed ? 180 : 0 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M10 3L5 8l5 5" stroke="#2D2640" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
    </motion.aside>
  )
}
