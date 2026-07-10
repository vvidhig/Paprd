import { useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AuthModal, { type AuthMode } from '../components/landing/AuthModal'
import DemoFlashcard from '../components/landing/DemoFlashcard'
import { useAuth } from '../hooks/useAuth'

/* ---------- animated background blobs ---------- */
function Blobs() {
  const blobs = [
    { color: '#E8C0FC', size: 420, top: '-8%', left: '-6%', dur: 18 },
    { color: '#A8DEFA', size: 380, top: '18%', left: '72%', dur: 22 },
    { color: '#FF99C8', size: 300, top: '58%', left: '-4%', dur: 20 },
    { color: '#D0F4E0', size: 320, top: '68%', left: '68%', dur: 24 },
    { color: '#FCF5BF', size: 260, top: '36%', left: '38%', dur: 26 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30 blur-3xl"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left, backgroundColor: b.color }}
          animate={{ x: [0, 40, -30, 0], y: [0, -35, 25, 0], scale: [1, 1.12, 0.94, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ---------- floating sparkle (SVG star) ---------- */
function Sparkle({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.span
      className={`absolute ${className}`}
      animate={{ y: [0, -10, 0], rotate: [0, 20, -10, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2 L12.5 9 L19 11 L12.5 13 L11 20 L9.5 13 L3 11 L9.5 9 Z" fill="#E8C0FC" stroke="#A8DEFA" strokeWidth="0.5"/>
      </svg>
    </motion.span>
  )
}

/* ---------- floating chip used around the hero ---------- */
function FloatChip({
  children,
  className,
  delay = 0,
  duration = 5,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, type: 'spring', stiffness: 300 },
        y: { duration, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      className={`absolute ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Feature illustrations (SVG mockups) ---------- */
function UploadIllustration() {
  return (
    <svg viewBox="0 0 420 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] drop-shadow-xl">
      <rect width="420" height="290" rx="20" fill="white" fillOpacity="0.92"/>
      <rect x="20" y="18" width="380" height="136" rx="14" fill="rgba(232,192,252,0.06)" stroke="#E8C0FC" strokeWidth="1.5" strokeDasharray="7 4"/>
      <circle cx="210" cy="66" r="26" fill="rgba(232,192,252,0.18)"/>
      <path d="M210 77V57M201 66l9-9 9 9" stroke="#E8C0FC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="210" y="108" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="12.5" fontWeight="600" fill="#2D2640">Drag &amp; drop PDFs or Word docs</text>
      <text x="210" y="127" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="10.5" fill="rgba(45,38,64,0.44)">or click to browse · max 20 MB</text>
      <rect x="18" y="170" width="182" height="104" rx="14" fill="white" stroke="rgba(232,192,252,0.3)" strokeWidth="1"/>
      <rect x="34" y="186" width="34" height="34" rx="9" fill="rgba(255,153,200,0.15)"/>
      <text x="51" y="208" textAnchor="middle" fontFamily="Inter" fontSize="9.5" fontWeight="700" fill="#FF99C8">PDF</text>
      <text x="80" y="202" fontFamily="Inter" fontSize="11.5" fontWeight="600" fill="#2D2640">Physics_Notes.pdf</text>
      <text x="80" y="217" fontFamily="Inter" fontSize="10" fill="rgba(45,38,64,0.44)">24 pages · 1.8 MB</text>
      <rect x="34" y="234" width="148" height="5" rx="2.5" fill="rgba(232,192,252,0.18)"/>
      <rect x="34" y="234" width="148" height="5" rx="2.5" fill="url(#pg1)"/>
      <rect x="108" y="253" width="46" height="14" rx="7" fill="rgba(208,244,224,0.65)"/>
      <text x="131" y="263.5" textAnchor="middle" fontFamily="Inter" fontSize="8.5" fill="#2D2640">✓ Ready</text>
      <rect x="220" y="170" width="182" height="104" rx="14" fill="white" stroke="rgba(168,222,250,0.3)" strokeWidth="1"/>
      <rect x="236" y="186" width="34" height="34" rx="9" fill="rgba(168,222,250,0.15)"/>
      <text x="253" y="208" textAnchor="middle" fontFamily="Inter" fontSize="9.5" fontWeight="700" fill="#A8DEFA">DOC</text>
      <text x="282" y="202" fontFamily="Inter" fontSize="11.5" fontWeight="600" fill="#2D2640">Lecture_7_Bio.docx</text>
      <text x="282" y="217" fontFamily="Inter" fontSize="10" fill="rgba(45,38,64,0.44)">12 pages · 0.6 MB</text>
      <rect x="236" y="234" width="148" height="5" rx="2.5" fill="rgba(168,222,250,0.18)"/>
      <rect x="236" y="234" width="88" height="5" rx="2.5" fill="url(#pg2)"/>
      <text x="310" y="264" textAnchor="middle" fontFamily="Inter" fontSize="8.5" fill="rgba(45,38,64,0.44)">Embedding…</text>
      <defs>
        <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#E8C0FC"/><stop offset="1" stopColor="#A8DEFA"/></linearGradient>
        <linearGradient id="pg2" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#E8C0FC"/><stop offset="1" stopColor="#A8DEFA"/></linearGradient>
      </defs>
    </svg>
  )
}

function AskIllustration() {
  return (
    <svg viewBox="0 0 420 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] drop-shadow-xl">
      <rect width="420" height="290" rx="20" fill="white" fillOpacity="0.92"/>
      <rect x="18" y="16" width="384" height="44" rx="12" fill="rgba(168,222,250,0.12)" stroke="rgba(168,222,250,0.3)" strokeWidth="1"/>
      <circle cx="44" cy="38" r="12" fill="rgba(168,222,250,0.25)"/>
      <rect x="62" y="30" width="80" height="8" rx="4" fill="rgba(45,38,64,0.15)"/>
      <rect x="62" y="44" width="54" height="6" rx="3" fill="rgba(45,38,64,0.08)"/>
      <text x="370" y="43" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="rgba(45,38,64,0.4)">3 docs</text>
      <rect x="100" y="76" width="188" height="52" rx="14" fill="url(#usermsg)"/>
      <rect x="100" y="82" width="120" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
      <rect x="100" y="96" width="170" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
      <rect x="100" y="110" width="90" height="8" rx="4" fill="rgba(255,255,255,0.35)"/>
      <path d="M296 128 L306 118 L296 128Z" fill="url(#usermsg)"/>
      <rect x="18" y="146" width="230" height="68" rx="14" fill="white" stroke="rgba(232,192,252,0.28)" strokeWidth="1"/>
      <rect x="30" y="155" width="140" height="7" rx="3.5" fill="rgba(45,38,64,0.12)"/>
      <rect x="30" y="168" width="206" height="7" rx="3.5" fill="rgba(45,38,64,0.08)"/>
      <rect x="30" y="181" width="160" height="7" rx="3.5" fill="rgba(45,38,64,0.08)"/>
      <path d="M18 164 L8 154 L18 164Z" fill="white" stroke="rgba(232,192,252,0.28)" strokeWidth="1"/>
      <rect x="30" y="200" width="118" height="18" rx="9" fill="rgba(168,222,250,0.22)" stroke="rgba(168,222,250,0.4)" strokeWidth="1"/>
      <circle cx="44" cy="209" r="4" fill="rgba(168,222,250,0.5)"/>
      <text x="96" y="212.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Physics.pdf · p.12</text>
      <rect x="30" y="224" width="96" height="18" rx="9" fill="rgba(168,222,250,0.22)" stroke="rgba(168,222,250,0.4)" strokeWidth="1"/>
      <circle cx="44" cy="233" r="4" fill="rgba(168,222,250,0.5)"/>
      <text x="82" y="236.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Bio_Ch3.pdf · p.4</text>
      <rect x="18" y="254" width="384" height="22" rx="11" fill="rgba(232,192,252,0.08)" stroke="rgba(232,192,252,0.25)" strokeWidth="1"/>
      <text x="36" y="268.5" fontFamily="Inter" fontSize="9.5" fill="rgba(45,38,64,0.35)">Ask anything about your documents…</text>
      <circle cx="392" cy="265" r="10" fill="url(#usermsg)"/>
      <path d="M388 265 L395 265 M392 261 L396 265 L392 269" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="usermsg" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#FF99C8"/><stop offset="1" stopColor="#E8C0FC"/></linearGradient>
      </defs>
    </svg>
  )
}

function NotesIllustration() {
  return (
    <svg viewBox="0 0 420 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] drop-shadow-xl">
      <rect width="420" height="290" rx="20" fill="white" fillOpacity="0.92"/>
      <rect x="18" y="16" width="384" height="36" rx="10" fill="rgba(208,244,224,0.12)"/>
      <rect x="30" y="25" width="38" height="18" rx="9" fill="rgba(168,222,250,0.3)"/>
      <text x="49" y="37.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Edit</text>
      <rect x="76" y="25" width="44" height="18" rx="9" fill="rgba(208,244,224,0.5)"/>
      <text x="98" y="37.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Copy</text>
      <rect x="128" y="25" width="64" height="18" rx="9" fill="rgba(232,192,252,0.4)"/>
      <text x="160" y="37.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Regenerate</text>
      <rect x="354" y="25" width="40" height="18" rx="9" fill="rgba(255,153,200,0.3)"/>
      <text x="374" y="37.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="600" fill="#2D2640">Save</text>
      <rect x="18" y="62" width="4" height="22" rx="2" fill="#E8C0FC"/>
      <text x="30" y="78" fontFamily="Outfit,sans-serif" fontSize="15" fontWeight="700" fill="#2D2640">Newton's Laws of Motion</text>
      <rect x="30" y="90" width="260" height="7" rx="3.5" fill="rgba(45,38,64,0.1)"/>
      <rect x="30" y="103" width="320" height="7" rx="3.5" fill="rgba(45,38,64,0.07)"/>
      <rect x="30" y="116" width="200" height="7" rx="3.5" fill="rgba(45,38,64,0.07)"/>
      <circle cx="30" cy="140" r="3.5" fill="#FF99C8"/>
      <rect x="42" y="136.5" width="240" height="7" rx="3.5" fill="rgba(45,38,64,0.1)"/>
      <circle cx="30" cy="157" r="3.5" fill="#FF99C8"/>
      <rect x="42" y="153.5" width="200" height="7" rx="3.5" fill="rgba(45,38,64,0.07)"/>
      <circle cx="30" cy="174" r="3.5" fill="#FF99C8"/>
      <rect x="42" y="170.5" width="280" height="7" rx="3.5" fill="rgba(45,38,64,0.07)"/>
      <rect x="18" y="196" width="4" height="22" rx="2" fill="#A8DEFA"/>
      <text x="30" y="212" fontFamily="Outfit,sans-serif" fontSize="15" fontWeight="700" fill="#2D2640">Key Formulas</text>
      <rect x="18" y="225" width="384" height="46" rx="10" fill="rgba(252,245,191,0.4)"/>
      <text x="34" y="243" fontFamily="monospace" fontSize="11" fontWeight="600" fill="#2D2640">F = ma</text>
      <rect x="34" y="248" width="180" height="6" rx="3" fill="rgba(45,38,64,0.08)"/>
      <text x="240" y="243" fontFamily="monospace" fontSize="11" fontWeight="600" fill="#2D2640">v = u + at</text>
      <rect x="240" y="248" width="140" height="6" rx="3" fill="rgba(45,38,64,0.08)"/>
    </svg>
  )
}

function FlashcardsIllustration() {
  return (
    <svg viewBox="0 0 420 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] drop-shadow-xl">
      {/* Shadow card behind */}
      <rect x="40" y="38" width="340" height="190" rx="20" fill="rgba(208,244,224,0.45)" transform="rotate(-4 210 133)"/>
      <rect x="40" y="28" width="340" height="190" rx="20" fill="rgba(252,245,191,0.6)" transform="rotate(2 210 123)"/>
      {/* Main card front */}
      <rect x="30" y="22" width="360" height="200" rx="20" fill="#FCF5BF" stroke="rgba(232,192,252,0.35)" strokeWidth="1.5"/>
      <text x="210" y="86" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="13" fontWeight="600" fill="rgba(45,38,64,0.4)">QUESTION</text>
      <text x="210" y="116" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="19" fontWeight="700" fill="#2D2640">What is Newton's</text>
      <text x="210" y="140" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="19" fontWeight="700" fill="#2D2640">Second Law?</text>
      <text x="210" y="186" textAnchor="middle" fontFamily="Inter" fontSize="10.5" fill="rgba(45,38,64,0.35)">tap to flip</text>
      <rect x="44" y="28" width="46" height="16" rx="8" fill="rgba(208,244,224,0.7)"/>
      <text x="67" y="39" textAnchor="middle" fontFamily="Inter" fontSize="8.5" fontWeight="600" fill="#2D2640">Easy</text>
      <text x="354" y="39" textAnchor="end" fontFamily="Inter" fontSize="9" fill="rgba(45,38,64,0.4)">3 / 15</text>
      {/* Controls */}
      <rect x="30" y="236" width="110" height="34" rx="17" fill="rgba(208,244,224,0.5)" stroke="rgba(208,244,224,0.8)" strokeWidth="1.5"/>
      <text x="85" y="257" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="600" fill="#2D2640">Got it</text>
      <rect x="152" y="236" width="116" height="34" rx="17" fill="rgba(168,222,250,0.25)" stroke="rgba(168,222,250,0.5)" strokeWidth="1.5"/>
      <text x="210" y="257" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="600" fill="#2D2640">Flip card</text>
      <rect x="280" y="236" width="110" height="34" rx="17" fill="rgba(255,153,200,0.2)" stroke="rgba(255,153,200,0.5)" strokeWidth="1.5"/>
      <text x="335" y="257" textAnchor="middle" fontFamily="Inter" fontSize="11" fontWeight="600" fill="#2D2640">Review again</text>
    </svg>
  )
}

function TutorIllustration() {
  return (
    <svg viewBox="0 0 420 290" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[420px] drop-shadow-xl">
      <rect width="420" height="290" rx="20" fill="white" fillOpacity="0.92"/>
      {/* Tutor header */}
      <circle cx="48" cy="44" r="26" fill="rgba(232,192,252,0.3)"/>
      <image href="/assets/tutor_avatar.svg" x="26" y="22" width="44" height="44"/>
      <text x="84" y="38" fontFamily="Outfit,sans-serif" fontSize="14" fontWeight="700" fill="#2D2640">AI Tutor</text>
      <text x="84" y="54" fontFamily="Inter" fontSize="10" fill="rgba(45,38,64,0.44)">Your patient study companion</text>
      {/* Quick actions */}
      <rect x="18" y="80" width="128" height="22" rx="11" fill="white" stroke="rgba(232,192,252,0.4)" strokeWidth="1.2"/>
      <text x="82" y="94.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="500" fill="#2D2640">Explain like I'm 5</text>
      <rect x="154" y="80" width="100" height="22" rx="11" fill="white" stroke="rgba(232,192,252,0.4)" strokeWidth="1.2"/>
      <text x="204" y="94.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="500" fill="#2D2640">Give me an analogy</text>
      <rect x="262" y="80" width="80" height="22" rx="11" fill="white" stroke="rgba(232,192,252,0.4)" strokeWidth="1.2"/>
      <text x="302" y="94.5" textAnchor="middle" fontFamily="Inter" fontSize="9" fontWeight="500" fill="#2D2640">Test me</text>
      {/* Tutor message bubble */}
      <rect x="18" y="118" width="270" height="72" rx="16" fill="white" stroke="rgba(232,192,252,0.28)" strokeWidth="1"/>
      <rect x="30" y="128" width="180" height="7" rx="3.5" fill="rgba(45,38,64,0.12)"/>
      <rect x="30" y="141" width="240" height="7" rx="3.5" fill="rgba(45,38,64,0.08)"/>
      <rect x="30" y="154" width="210" height="7" rx="3.5" fill="rgba(45,38,64,0.08)"/>
      <rect x="30" y="167" width="140" height="7" rx="3.5" fill="rgba(45,38,64,0.08)"/>
      {/* Quiz card */}
      <rect x="18" y="206" width="384" height="66" rx="14" fill="url(#quiz)" />
      <text x="34" y="228" fontFamily="Outfit,sans-serif" fontSize="12" fontWeight="700" fill="#2D2640">Quiz: What is the unit of force?</text>
      <rect x="34" y="237" width="100" height="20" rx="10" fill="rgba(255,255,255,0.5)"/>
      <text x="84" y="251.5" textAnchor="middle" fontFamily="Inter" fontSize="10" fontWeight="600" fill="#2D2640">a) Newton</text>
      <rect x="144" y="237" width="90" height="20" rx="10" fill="rgba(255,255,255,0.3)"/>
      <text x="189" y="251.5" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#2D2640">b) Joule</text>
      <rect x="244" y="237" width="90" height="20" rx="10" fill="rgba(255,255,255,0.3)"/>
      <text x="289" y="251.5" textAnchor="middle" fontFamily="Inter" fontSize="10" fill="#2D2640">c) Pascal</text>
      <defs>
        <linearGradient id="quiz" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#E8C0FC"/><stop offset="1" stopColor="#A8DEFA"/></linearGradient>
      </defs>
    </svg>
  )
}

const FEATURE_SLIDES = [
  {
    bg: '#E8C0FC',
    label: 'Library',
    title: 'Upload your docs',
    desc: 'Drop in PDFs and Word files. Paprd parses, chunks, and embeds everything locally so every answer is cited to the exact page.',
    Illustration: UploadIllustration,
    flip: false,
    textColor: '#2D2640',
  },
  {
    bg: '#A8DEFA',
    label: 'Ask',
    title: 'Ask anything',
    desc: 'Chat with your documents and get sourced answers instantly. Every response links back to the exact page so you can verify it yourself.',
    Illustration: AskIllustration,
    flip: true,
    textColor: '#2D2640',
  },
  {
    bg: '#D0F4E0',
    label: 'Notes',
    title: 'Generate study notes',
    desc: 'Structured, editable notes built from your documents in seconds. Markdown-formatted, copyable, and saveable — just pick a topic and go.',
    Illustration: NotesIllustration,
    flip: false,
    textColor: '#2D2640',
  },
  {
    bg: '#FCF5BF',
    label: 'Flashcards',
    title: '3D flashcards',
    desc: 'Premium flip cards with physics-based animations, got-it tracking, shuffle mode, and decks that remember exactly where you left off.',
    Illustration: FlashcardsIllustration,
    flip: true,
    textColor: '#2D2640',
  },
  {
    bg: '#FF99C8',
    label: 'Tutor',
    title: 'AI Tutor mode',
    desc: 'A patient study companion that explains simply, builds analogies, and quizzes you on weak spots — then auto-generates flashcards for what you missed.',
    Illustration: TutorIllustration,
    flip: false,
    textColor: '#2D2640',
  },
]

const STEPS = [
  {
    n: '1',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="2" width="16" height="20" rx="3" fill="rgba(232,192,252,0.4)" stroke="#E8C0FC" strokeWidth="1.5"/><rect x="8" y="24" width="16" height="20" rx="3" fill="rgba(168,222,250,0.4)" stroke="#A8DEFA" strokeWidth="1.5" transform="rotate(-8 8 24)"/><rect x="7" y="7" width="9" height="1.5" rx="0.75" fill="#2D2640"/><rect x="7" y="11" width="7" height="1.5" rx="0.75" fill="#2D2640"/><rect x="7" y="15" width="8" height="1.5" rx="0.75" fill="#2D2640"/></svg>
    ),
    title: 'Feed it docs',
    body: 'Drag in lecture slides, papers, textbooks — anything PDF or DOCX.',
  },
  {
    n: '2',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" fill="rgba(232,192,252,0.3)" stroke="#E8C0FC" strokeWidth="1.5"/><path d="M10 14 C10 11.8 11.8 10 14 10 C16.2 10 18 11.8 18 14" stroke="#A8DEFA" strokeWidth="1.8" strokeLinecap="round"/><circle cx="14" cy="14" r="2.5" fill="#FF99C8"/><path d="M14 5 L14 3 M14 25 L14 23 M5 14 L3 14 M25 14 L23 14" stroke="#E8C0FC" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    title: 'Paprd digests',
    body: 'Everything is parsed and indexed locally so the AI can cite exact pages.',
  },
  {
    n: '3',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="8" width="14" height="10" rx="3" fill="rgba(168,222,250,0.3)" stroke="#A8DEFA" strokeWidth="1.5"/><path d="M17 13 L25 13" stroke="#A8DEFA" strokeWidth="1.5" strokeLinecap="round"/><path d="M22 10 L25 13 L22 16" stroke="#A8DEFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="6" y="11" width="5" height="1.5" rx="0.75" fill="#2D2640"/><rect x="6" y="14" width="7" height="1.5" rx="0.75" fill="#2D2640"/></svg>
    ),
    title: 'Understand everything',
    body: 'Ask, summarize, flip flashcards, and get quizzed until it sticks.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 80])

  const openApp = () => navigate('/library')
  const start = (mode: AuthMode) => (user ? openApp() : setAuthMode(mode))

  return (
    <div className="relative min-h-screen bg-page" style={{ overflowX: 'clip' }}>
      <Blobs />

      {/* ---------- NAV ---------- */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="glass sticky top-4 z-50 mx-auto mt-4 flex w-[min(1100px,92%)] items-center justify-between rounded-pill px-6 py-3 shadow-card"
      >
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo.svg" alt="Paprd" className="h-8 w-8" />
          <span className="font-heading text-xl font-bold text-dark">Paprd</span>
        </div>
        <div className="hidden items-center gap-6 font-body text-sm font-medium text-dark/70 md:flex">
          <a href="#features" className="transition-colors duration-300 hover:text-dark">Features</a>
          <a href="#how" className="transition-colors duration-300 hover:text-dark">How it works</a>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={openApp}
              className="rounded-pill px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-cta"
              style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
            >
              Open app →
            </motion.button>
          ) : (
            <>
              <button
                onClick={() => start('login')}
                className="rounded-pill px-4 py-2.5 font-body text-sm font-semibold text-dark transition-colors duration-300 hover:bg-lavender/25"
              >
                Log in
              </button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => start('signup')}
                className="rounded-pill px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-cta"
                style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
              >
                Get started
              </motion.button>
            </>
          )}
        </div>
      </motion.nav>

      {/* ---------- HERO ---------- */}
      <motion.section style={{ y: heroY }} className="relative z-10 mx-auto mt-14 w-[min(1100px,92%)] pb-10 md:mt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 rounded-pill border border-lavender/40 bg-white/70 px-4 py-1.5 font-body text-xs font-semibold text-dark shadow-card"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1 L7 5 L11 6 L7 7 L6 11 L5 7 L1 6 L5 5 Z" fill="#E8C0FC" stroke="#A8DEFA" strokeWidth="0.5"/></svg>
              Your AI-powered study companion
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 24 }}
              className="mt-5 font-heading text-5xl font-extrabold leading-[1.08] text-dark md:text-6xl"
            >
              Feed it docs.
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 45%, #A8DEFA 100%)' }}
              >
                Understand everything.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mt-5 max-w-md font-body text-lg leading-relaxed text-dark/60"
            >
              Upload your PDFs and lecture notes — then chat with them, turn them into study notes,
              flip through 3D flashcards, and get tutored until it all clicks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => start('signup')}
                className="rounded-pill px-8 py-4 font-heading text-base font-semibold text-white shadow-cta transition-shadow duration-300 hover:shadow-card-hover"
                style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
              >
                Start learning free
              </motion.button>
              <a
                href="#how"
                className="rounded-pill border-2 border-lavender/50 bg-white/70 px-7 py-[14px] font-heading text-base font-semibold text-dark transition-all duration-300 hover:border-lavender hover:bg-lavender/15"
              >
                See how it works
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex gap-8"
            >
              {[
                ['5', 'study modes'],
                ['100%', 'cited answers'],
                ['0', 'clicks to magic'],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-heading text-2xl font-extrabold text-dark">{num}</p>
                  <p className="font-body text-xs text-dark/50">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto h-[420px] w-full max-w-[460px]">
            <Sparkle className="left-2 top-4" />
            <Sparkle className="right-6 top-16" delay={1.2} />
            <Sparkle className="bottom-10 left-10" delay={2.1} />

            <FloatChip className="left-1/2 top-0 -translate-x-1/2" duration={6}>
              <img src="/assets/hero_illustration.svg" alt="" className="w-[380px] drop-shadow-lg" />
            </FloatChip>

            <FloatChip className="bottom-6 left-1/2 -translate-x-1/2" delay={0.5} duration={5}>
              <DemoFlashcard />
            </FloatChip>

            <FloatChip className="left-0 top-44" delay={0.8} duration={4.5}>
              <div className="flex items-center gap-1.5 rounded-pill bg-skyblue/90 px-3.5 py-2 font-body text-xs font-semibold text-dark shadow-card">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect width="12" height="12" rx="3" fill="rgba(45,38,64,0.15)"/><rect x="2" y="3" width="8" height="1.5" rx="0.75" fill="#2D2640"/><rect x="2" y="5.5" width="6" height="1.5" rx="0.75" fill="#2D2640"/><rect x="2" y="8" width="7" height="1.5" rx="0.75" fill="#2D2640"/></svg>
                Physics.pdf · p.12
              </div>
            </FloatChip>

            <FloatChip className="right-0 top-8" delay={1.1} duration={5.5}>
              <div className="flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2.5 shadow-card-hover">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#2D2640" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="font-body text-xs font-semibold text-dark">Deck mastered!</span>
              </div>
            </FloatChip>

            <FloatChip className="-left-6 bottom-14" delay={1.5} duration={4}>
              <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-card">
                <img src="/assets/tutor_avatar.svg" className="h-5 w-5" alt=""/>
                <span className="font-body text-xs font-medium text-dark/70">"Think of it like…"</span>
              </div>
            </FloatChip>
          </div>
        </div>
      </motion.section>

      {/* ---------- FEATURES (stacked paper panels) ---------- */}
      <section id="features" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto w-[min(1100px,92%)] py-20 text-center"
        >
          <h2 className="font-heading text-4xl font-extrabold text-dark">Everything you need to ace it</h2>
          <p className="mt-3 font-body text-dark/55">Five study modes, one pastel-soft workspace.</p>
        </motion.div>

        {/* Stacked paper panels */}
        <div style={{ height: `${FEATURE_SLIDES.length * 100}vh` }}>
          {FEATURE_SLIDES.map((slide, i) => (
            <div
              key={slide.label}
              className="sticky top-0 flex h-screen items-center overflow-hidden"
              style={{
                backgroundColor: slide.bg,
                zIndex: 10 + i,
                borderRadius: i > 0 ? '32px 32px 0 0' : undefined,
                boxShadow: i > 0 ? '0 -8px 40px rgba(45,38,64,0.10)' : undefined,
              }}
            >
              <div
                className="mx-auto grid w-full max-w-6xl items-center gap-16 px-10 md:px-16"
                style={{ gridTemplateColumns: '1fr 1fr' }}
              >
                {/* Text column */}
                <motion.div
                  initial={{ opacity: 0, x: slide.flip ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.1 }}
                  style={{ order: slide.flip ? 2 : 1 }}
                >
                  <span
                    className="inline-block rounded-full px-4 py-1.5 font-body text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: 'rgba(45,38,64,0.1)',
                      color: slide.textColor,
                    }}
                  >
                    {slide.label}
                  </span>
                  <h3
                    className="mt-4 font-heading text-4xl font-extrabold leading-tight md:text-5xl"
                    style={{ color: slide.textColor }}
                  >
                    {slide.title}
                  </h3>
                  <p
                    className="mt-5 max-w-md font-body text-lg leading-relaxed"
                    style={{ color: slide.textColor, opacity: 0.7 }}
                  >
                    {slide.desc}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => start('signup')}
                    className="mt-8 rounded-full px-8 py-3.5 font-heading text-sm font-bold transition-all duration-300"
                    style={{
                      background: 'rgba(45,38,64,0.12)',
                      color: slide.textColor,
                      border: `2px solid ${slide.textColor}30`,
                    }}
                  >
                    Try it free →
                  </motion.button>
                </motion.div>

                {/* Illustration column */}
                <motion.div
                  initial={{ opacity: 0, x: slide.flip ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-120px' }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.18 }}
                  style={{ order: slide.flip ? 1 : 2 }}
                  className="flex items-center justify-center"
                >
                  <slide.Illustration />
                </motion.div>
              </div>

              {/* Subtle page number indicator */}
              <div
                className="absolute bottom-8 right-10 font-heading text-xs font-bold opacity-30"
                style={{ color: slide.textColor }}
              >
                {String(i + 1).padStart(2, '0')} / {String(FEATURE_SLIDES.length).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="relative z-10 mx-auto w-[min(1100px,92%)] py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center"
        >
          <h2 className="font-heading text-4xl font-extrabold text-dark">Three steps to "ohhh, I get it"</h2>
        </motion.div>

        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          {/* connecting line */}
          <div className="absolute left-[16%] right-[16%] top-8 hidden h-0.5 bg-gradient-to-r from-rose via-lavender to-skyblue md:block" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 240, damping: 24 }}
              className="relative flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.12, rotate: 6 }}
                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-card-hover ring-4 ring-lavender/30"
              >
                {s.icon}
              </motion.div>
              <span className="mt-4 rounded-pill bg-lavender/25 px-3 py-1 font-heading text-xs font-bold text-dark">
                STEP {s.n}
              </span>
              <h3 className="mt-3 font-heading text-xl font-bold text-dark">{s.title}</h3>
              <p className="mt-2 max-w-[260px] font-body text-sm leading-relaxed text-dark/55">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- CTA BANNER ---------- */}
      <section className="relative z-10 mx-auto w-[min(1100px,92%)] py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          className="relative overflow-hidden rounded-[32px] px-8 py-14 text-center shadow-panel"
          style={{ background: 'linear-gradient(120deg, #E8C0FC 0%, #A8DEFA 100%)' }}
        >
          <motion.img
            src="/assets/success_celebration.svg"
            alt=""
            className="pointer-events-none absolute -top-2 left-1/2 h-28 -translate-x-1/2 opacity-70"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h2 className="relative font-heading text-4xl font-extrabold text-dark">
            Your next exam won't know what hit it.
          </h2>
          <p className="relative mt-3 font-body text-dark/60">
            Free to use. Local-first. Ridiculously pastel.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => start('signup')}
            className="relative mt-7 inline-flex items-center gap-2 rounded-pill bg-white px-9 py-4 font-heading text-base font-bold text-dark shadow-card-hover transition-shadow duration-300 hover:shadow-panel"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1 L8.2 5.8 L13 7 L8.2 8.2 L7 13 L5.8 8.2 L1 7 L5.8 5.8 Z" fill="#E8C0FC" stroke="#A8DEFA" strokeWidth="0.5"/></svg>
            Get started — it's free
          </motion.button>
        </motion.div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative z-10 mx-auto flex w-[min(1100px,92%)] flex-col items-center gap-3 pb-10 pt-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.svg" alt="" className="h-6 w-6" />
          <span className="font-heading text-base font-bold text-dark">Paprd</span>
        </div>
        <p className="font-body text-xs text-dark/40">Feed it docs. Understand everything.</p>
      </footer>

      {/* ---------- AUTH MODAL ---------- */}
      <AnimatePresence>
        {authMode && (
          <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
