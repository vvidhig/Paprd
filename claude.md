Build "Paprd" — an AI-powered document study platform.
Tagline: "Feed it docs. Understand everything."

You have access to these MCP servers — USE THEM:

- Higgsfield MCP: generate all illustrations,
  hero graphics, page backgrounds, animated visuals,
  flashcard decorative elements, and any imagery
  the app needs. Generate assets and save them
  directly into the project's public/assets folder.
- Pinterest MCP: search for UI design inspiration
  before building each page. Search terms like
  "study app UI design", "flashcard app interface",
  "pastel education dashboard", "modern notes app UI"
  to get visual references before coding each section.
- Chrome DevTools MCP: after building each page,
  inspect it in the browser, check spacing, colors,
  alignment, and iterate until it looks premium.

WORKFLOW FOR EACH PAGE:

1. Search Pinterest for design inspiration for
   that specific page type
2. Generate any needed illustrations/graphics
   via Higgsfield (save to public/assets/)
3. Build the page in React
4. Check via Chrome DevTools
5. Iterate until it looks premium

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COLOR PALETTE (use ONLY these 5 colors +
a dark text color derived from them):

  Lavender:    #E8C0FC  — primary accent, sidebar
                          active states, flashcard
                          borders, selected states,
                          gradient start
  Sky Blue:    #A8DEFA  — secondary accent, buttons,
                          links, citation pills,
                          progress bars, hover states
  Mint:        #D0F4E0  — success states, "Got it"
                          buttons, completed badges,
                          quiz correct answers,
                          document ready indicators
  Cream:       #FCF5BF  — warning/highlight states,
                          flashcard front background,
                          quiz score cards,
                          note callout boxes
  Rose Pink:   #FF99C8  — primary CTA buttons,
                          important badges, delete
                          confirmations, error states,
                          active recording, brand accent

  Text Dark:   #2D2640  — derived purple-dark for all
                          primary text, headings, labels
                          (this is the only non-palette
                          color allowed, needed for
                          readability)
  Text Light:  #FFFFFF  — text on dark/colored backgrounds

  Background:  #FAFAFE  — very light off-white with
                          the faintest lavender tint
                          for page backgrounds

  Card/Surface: #FFFFFF — white cards with subtle
                          shadows using rgba of
                          the palette colors
                          e.g. box-shadow:
                          0 4px 20px rgba(232,192,252,0.2)

TEXT COLOR RULES:
  On Lavender background:  #2D2640 text
  On Sky Blue background:  #2D2640 text
  On Mint background:      #2D2640 text
  On Cream background:     #2D2640 text
  On Rose Pink background: #FFFFFF text
  On white/light bg:       #2D2640 text
  Never use pure black — always #2D2640

GRADIENT USAGE:
  Use soft gradients combining palette colors:

- Hero/header gradients: #E8C0FC → #A8DEFA
    (lavender to sky blue)
- CTA button gradients: #FF99C8 → #E8C0FC
    (rose to lavender)
- Card hover glow: rgba(168,222,250,0.3)
    (sky blue glow)
- Flashcard backgrounds: #FCF5BF → #D0F4E0
    (cream to mint, subtle)
- Sidebar gradient: #E8C0FC → #A8DEFA vertical

SHADOW RULES:
  All shadows use palette colors, never grey:

- Default card: 0 4px 20px rgba(232,192,252,0.15)
- Hover card: 0 8px 30px rgba(232,192,252,0.25)
- Active/focus: 0 0 0 3px rgba(168,222,250,0.4)
- CTA button: 0 4px 15px rgba(255,153,200,0.3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TECH STACK:
  Frontend: React 18 + TypeScript + Tailwind CSS + Vite
  Backend: FastAPI + Python 3.11+
  RAG: LangChain + ChromaDB (vector store)
  LLM: Groq API (llama-3.3-70b-versatile)
  Embeddings: HuggingFace sentence-transformers
              (all-MiniLM-L6-v2, free, runs locally)
  Document parsing:
    PDF: PyMuPDF (fitz)
    DOCX: python-docx
  Animations: Framer Motion + Lenis smooth scroll
  Deploy: Vercel (frontend) + Render (backend)

FONT:
  Google Font: "Outfit" for headings (rounded, modern)
  Google Font: "Inter" for body text
  Import both in index.html

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESIGN DIRECTION:
  Soft, pastel, premium study aesthetic.
  Think: Notion meets Quizlet meets a high-end
  stationery brand.
  
  Rounded corners everywhere (border-radius: 16-20px)
  Generous whitespace and padding
  Glassmorphism on overlays and modals:
    background: rgba(255,255,255,0.7)
    backdrop-filter: blur(20px)
    border: 1px solid rgba(232,192,252,0.3)
  
  Subtle noise texture on backgrounds (optional)
  
  Cards should feel soft and lifted — not flat,
  not harsh. Like pastel sticky notes floating
  above the page.
  
  Every interactive element has a smooth transition.
  Nothing should feel instant or jumpy.
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANIMATIONS (Framer Motion — EVERY page must
have meaningful animation):

GLOBAL ANIMATIONS:

- Lenis smooth scroll on entire app
- Page transitions: fade + slide up (y:20→0)
    when navigating between pages
- All cards: whileInView fade up with stagger
- Hover: all interactive elements scale(1.02)
  - shadow deepens

LIBRARY PAGE:

- Upload zone: pulsing dashed border animation
- On file drop: bounce animation on the zone
- Document cards: stagger in from bottom on load
- Processing progress: animated gradient bar
    moving left to right (like a shimmer)
- Delete: card shrinks + fades out (scale 0.9,
    opacity 0)

ASK PAGE:

- Chat messages: slide in from bottom (user)
    or left (AI) with spring physics
- Citation pills: pop in with scale animation
- Suggested questions: fade in one by one
    with 0.1s stagger
- Citation panel: slide in from right
- Typing indicator: 3 dots pulsing in sequence

NOTES PAGE:

- Generation loading: skeleton lines that
    shimmer with a lavender-to-sky-blue gradient
- Notes sections: accordion style, expand with
    spring animation
- Copy button: brief checkmark animation on click

FLASHCARDS PAGE (MOST ANIMATION-HEAVY):

- THE FLIP:
    perspective: 1200px on container
    rotateY 0→180deg, 0.6s
    cubic-bezier(0.68, -0.55, 0.265, 1.55)
    (this gives a slight overshoot bounce)
    During flip: translateZ(30px) lift
    Shadow morphs during rotation
    Front: cream background with subtle grain
    Back: mint background

- Card entry: spring bounce from below
    (scale 0.8→1.05→1, y:40→0)
- Next/Prev: card slides out left/right,
    new card slides in from opposite side
- Shuffle: all cards briefly scatter (random
    x,y,rotation) then reassemble (spring)
- "Got it": card flies up and fades with
    a green glow trail
- "Review again": card shakes briefly
    (x oscillation) with orange glow
- Progress bar: segments fill with smooth
    width transition, green for got-it,
    rose for review-again
- Deck overview grid: cards flip from
    invisible to visible with stagger

TUTOR PAGE:

- Quick action pills: hover wobble (slight
    rotation oscillation)
- Quiz questions: card deals in from top
    (like being dealt from a deck)
- Score reveal: numbers count up animation
- Stars: pop in one by one with scale bounce

SIDEBAR:

- Active page indicator: animated pill that
    slides between items (layout animation)
- Hover: item background fades in
- Collapse/expand: width transition with
    icons staying centered

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGGSFIELD ASSET GENERATION:
Generate these assets using Higgsfield MCP and
save to public/assets/:

1. hero_illustration.png
   Prompt: "Soft pastel illustration of floating
   books, documents, and flashcards in a dreamy
   cloud-like arrangement, lavender and sky blue
   tones, minimal, modern, no text, clean
   background, study aesthetic"

2. empty_library.png  
   Prompt: "Cute minimal pastel illustration of
   an empty bookshelf with soft shadows, lavender
   and mint tones, inviting, study app empty state"

3. flashcard_bg_pattern.png
   Prompt: "Subtle geometric pattern, very soft
   pastel colors, barely visible, meant as a
   background texture, lavender and cream,
   seamless tileable"

4. tutor_avatar.png
   Prompt: "Friendly cartoon owl wearing glasses,
   minimal illustration style, pastel lavender
   and sky blue colors, circular crop, study
   tutor mascot"

5. success_celebration.png
   Prompt: "Pastel confetti and stars floating,
   celebration illustration, mint green and rose
   pink and lavender, minimal, transparent
   background feel"

6. loading_books.png
   Prompt: "Stack of pastel colored books with
   one opening and pages flying out, minimal
   illustration, lavender blue mint cream palette"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE FEATURES:

1. DOCUMENT UPLOAD & MANAGEMENT (Library)
   - Drag and drop zone for PDFs and DOCX
   - Multiple file upload
   - Document cards with file type icon,
     page count, upload date, size
   - Processing pipeline: Parse → Chunk → Embed
   - Progress animation per file
   - Quick action buttons on each card:
     [💬 Ask] [📝 Notes] [🎴 Cards] [🗑️]

2. ASK ANYTHING (RAG Q&A)
   - Chat interface with document selector
   - RAG pipeline: embed question → ChromaDB
     search → Groq generates answer
   - Source citations as clickable pills
   - Citation panel showing original chunk
   - Suggested follow-up questions
   - Conversation memory within session

3. SHORT NOTES GENERATOR
   - Select documents + optional topic
   - AI generates structured study notes
   - Editable, copyable, saveable
   - Saved notes list with localStorage

4. FLASHCARD GENERATOR
   - Select documents + optional topic + count
   - AI generates front/back flashcards as JSON
   - PREMIUM 3D flip interaction
   - Got it / Review again tracking
   - Shuffle, navigation, keyboard shortcuts
   - Deck overview grid view
   - Saved decks

5. AI TUTOR MODE
   - Conversational AI tutor with personality
   - Quick actions: Explain like I'm 5,
     Give me an analogy, Test me, Summarize,
     Why does this matter, Connect topics
   - Test me mode: 3-5 questions, evaluation,
     scorecard, flashcard generation for
     weak topics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RAG PIPELINE:

Document Processing:
  Upload → Parse (PyMuPDF/python-docx)
  → Clean text
  → Chunk (RecursiveCharacterTextSplitter,
    chunk_size=1000, overlap=200)
  → Embed (all-MiniLM-L6-v2, local)
  → Store in ChromaDB with metadata:
    {doc_id, doc_name, page_number, chunk_index}

Query Pipeline:
  Question → Embed → ChromaDB top_k=5
  → Build prompt with retrieved chunks
  → Groq llama-3.3-70b-versatile → Answer
  → Extract source citations → Return

Agent Tools (LangChain):

  1. search_documents — ChromaDB similarity search
  2. get_document_summary — summarize a specific doc
  3. generate_flashcards — create flashcard JSON
  4. generate_notes — create structured notes
  5. quiz_generator — create quiz questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI PROMPTS:

NOTES GENERATION:
"You are a study notes generator. Given the
following content from academic documents,
create concise, well-structured study notes.

Structure:

## [Topic Name]

**Key Concept:** [definition]
**Important Points:**

- Point 1
- Point 2
**Formulas/Facts:** (if applicable)
**Summary:** 1-2 sentence summary

Content: {retrieved_chunks}

Rules: Be concise, use simple language,
highlight key terms in bold, don't add
information not in the source material."

FLASHCARD GENERATION:
"Generate flashcards as a JSON array:
[
  {
    \"id\": \"1\",
    \"front\": \"Topic or question\",
    \"back\": [
      \"Key recall point 1\",
      \"Key recall point 2\",
      \"Key recall point 3\"
    ],
    \"difficulty\": \"easy|medium|hard\",
    \"source_doc\": \"document name\",
    \"source_page\": page_number
  }
]

Content: {retrieved_chunks}
Topic: {topic}

Rules: Front = clear topic or question.
Back = 2-5 concise recall points.
Generate 10-15 cards. Vary difficulty.
Return ONLY valid JSON."

AI TUTOR SYSTEM:
"You are a patient, encouraging AI tutor.
Your teaching style:

- Big picture before details
- Analogies and real-world examples
- Follow-up questions to check understanding
- Reference specific documents and pages
- Celebrate understanding

Commands:

- 'ELI5': Very simple language, everyday analogies
- 'Analogy': Creative memorable analogy
- 'Test me': Ask 3-5 questions, evaluate answers
- 'Summarize': Brief overview
- 'Why matters': Real-world relevance
- 'Connect': Relationships between topics"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE STRUCTURE:

SIDEBAR (left, collapsible):
  Background: gradient #E8C0FC → #A8DEFA (vertical)
  Width: 240px expanded, 72px collapsed
  
  Top: Paprd logo (Outfit font, #2D2640)
       Small paper/document icon
  ──────────────
  Nav items (each with icon + label):
  [📚 Library]
  [💬 Ask]
  [📝 Notes]  
  [🎴 Flashcards]
  [🧑‍🏫 Tutor]
  
  Active item: white pill background with
  shadow, text stays #2D2640
  The white pill SLIDES between items using
  Framer Motion layoutId animation
  
  Hover: item gets rgba(255,255,255,0.3) bg
  
  ──────────────
  Bottom: document count
  "📄 12 documents loaded"
  
  Collapse button: chevron at bottom of sidebar
  On collapse: only icons visible, centered
  Tooltip on hover when collapsed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 1: LIBRARY (/library)

Search Pinterest: "study app library UI pastel"
before building this page.

Background: #FAFAFE

TOP SECTION:
  Left:
    "Your Library" — Outfit, 36px, #2D2640
    "Upload documents and start learning" —
    Inter, #2D2640 opacity 0.6
  Right:
    Document count badge:
    "12 docs" pill in #A8DEFA bg, #2D2640 text

UPLOAD ZONE:
  Centered, max-width 600px
  Height: 200px
  Border: 2px dashed #E8C0FC
  Background: rgba(232,192,252,0.05)
  Border-radius: 24px
  
  Center content:
    Higgsfield illustration (loading_books.png)
    height 80px
    "Drag & drop PDFs or Word docs"
    "or click to browse"
    Both in #2D2640, second line lighter
  
  On hover: border becomes solid #E8C0FC,
  bg becomes rgba(232,192,252,0.1)
  
  On file drop: border flashes #D0F4E0 (mint),
  bounce animation
  
  Processing card (appears per file):
    White card, rounded, subtle lavender shadow
    [PDF icon] [filename] [shimmer progress bar]
    Progress bar: gradient #E8C0FC → #A8DEFA
    moving left to right (shimmer effect)
    Steps: "Parsing..." → "Chunking..." →
    "Embedding..." → "✓ Ready"
    When done: card border flashes mint green

DOCUMENT GRID (3 columns):
  Each card:
    Background: white
    Border-radius: 20px
    Shadow: 0 4px 20px rgba(232,192,252,0.15)
    Padding: 24px

    Top: file type icon 
      PDF: rose pink (#FF99C8) rounded square
      DOCX: sky blue (#A8DEFA) rounded square
    Title: filename, Outfit, #2D2640, 18px
    Meta: "12 pages · 2.4 MB · Jul 4"
          Inter, #2D2640 opacity 0.5
    
    Divider: thin line, rgba(232,192,252,0.2)
    
    Quick actions row:
    [💬 Ask] [📝 Notes] [🎴 Cards] [🗑️]
    Each as small pill buttons:
      Ask: #A8DEFA bg
      Notes: #D0F4E0 bg  
      Cards: #FCF5BF bg
      Delete: #FF99C8 bg, appears on hover only
    All text: #2D2640
    
    Hover: translateY(-6px), shadow deepens,
    border: 1px solid rgba(232,192,252,0.3)

  Empty state (no docs):
    Higgsfield illustration (empty_library.png)
    centered, max height 200px
    "No documents yet"
    "Upload your first PDF or Word doc"
    [Upload Document] button:
    gradient #FF99C8 → #E8C0FC, white text,
    rounded pill, shadow

  Entry animation: cards stagger in from bottom,
  0.08s between each, spring physics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 2: ASK (/ask)

Search Pinterest: "AI chat interface pastel UI"

Split layout:

LEFT PANEL (280px, scrollable):
  Background: white card
  Border-radius: 20px
  Shadow: lavender shadow
  Margin: 16px
  
  Header: "Documents" Outfit, #2D2640
  [Select All] toggle — sky blue when active
  
  Document list (checkboxes):
  Each: checkbox + doc icon + name
  Checkbox: #A8DEFA when checked
  Selected: subtle #A8DEFA bg tint on row
  
  Bottom: "3 of 5 selected" count

RIGHT PANEL (flex 1):
  Background: #FAFAFE

  Top bar (sticky):
    "Ask anything about your docs"
    Outfit, 24px, #2D2640
    Selected doc count badge:
    #E8C0FC bg pill

  Chat area:
    User messages:
      Right-aligned
      Background: gradient #FF99C8 → #E8C0FC
      Text: white
      Border-radius: 20px 20px 4px 20px
      Entry: slide in from right, spring

    AI responses:
      Left-aligned
      Background: white
      Border: 1px solid rgba(232,192,252,0.2)
      Text: #2D2640
      Border-radius: 20px 20px 20px 4px
      Entry: slide in from left, spring
      
      Source citations (inside AI message):
        Clickable pills below the answer text
        [📄 Physics.pdf · p.12]
        Background: #A8DEFA opacity 0.2
        Text: #2D2640
        Border-radius: 50px
        Hover: bg becomes #A8DEFA opacity 0.4
        Click: opens citation panel
      
      Suggested follow-ups (after AI message):
        3 chips in a row, fade in staggered
        Background: #FCF5BF
        Text: #2D2640
        Border-radius: 50px
        Hover: bg becomes #E8C0FC
    
    Typing indicator:
      3 dots in AI bubble, pulsing sequentially
      Dots colored: #E8C0FC, #A8DEFA, #FF99C8

  Input bar (bottom, sticky):
    Background: white
    Border: 2px solid rgba(232,192,252,0.3)
    Border-radius: 50px
    Padding: 12px 20px
    Focus: border #A8DEFA,
    shadow 0 0 0 4px rgba(168,222,250,0.2)

    Placeholder cycles (fade transition):
    "What is the theory of relativity?"
    "Compare photosynthesis and respiration"
    "Explain Newton's third law"
    
    Send button: #FF99C8 circle, white arrow icon
    Hover: scale(1.1)

  Citation panel (slide from right):
    Width: 400px
    Background: white
    Shadow: large lavender shadow
    Border-left: 3px solid #A8DEFA
    Shows: doc name, page number,
    chunk text with relevant part
    highlighted in #FCF5BF yellow
    [✕ Close] top right

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 3: NOTES (/notes)

Search Pinterest: "study notes app UI minimal"

TOP SECTION:
  "Generate Study Notes" Outfit, 32px, #2D2640
  
  Row of controls:
    Document selector (multi-select dropdown):
      Rounded, #FAFAFE bg, lavender border
      Selected items as pills inside
    Topic input:
      "Focus on a specific topic (optional)"
      Same styling as document selector
    [✨ Generate Notes] button:
      Gradient #FF99C8 → #E8C0FC
      Text: white, Outfit
      Hover: shadow deepens, scale(1.02)

  Loading state:
    4-5 skeleton lines, each a rounded rectangle
    Shimmer animation: gradient
    #E8C0FC → #A8DEFA → #E8C0FC
    sweeping left to right, 1.5s loop
    "Analyzing your documents..." text pulsing

NOTES DISPLAY:
  White card, rounded 20px, lavender shadow
  Padding: 32px
  
  Markdown rendered with custom styling:
    H2: Outfit, #2D2640, 24px, with
    left border 4px solid #E8C0FC
    Bold: #2D2640, weight 700
    Bullets: custom bullet color #FF99C8
    Code blocks: #FCF5BF background,
    rounded, monospace

  Toolbar above notes (sticky):
    [✏️ Edit] — #A8DEFA pill
    [📋 Copy] — #D0F4E0 pill
    [🔄 Regenerate] — #E8C0FC pill
    [💾 Save] — #FF99C8 pill

    Copy click: brief checkmark appears,
    pill flashes mint green
    
  Accordion sections: each topic section
  can collapse/expand with spring animation

SAVED NOTES (below):
  "Saved Notes" heading
  Cards in a list:
    Title + date + source doc name
    Hover: expand preview
    Click: full view
    Delete: swipe or button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 4: FLASHCARDS (/flashcards)

Search Pinterest: "flashcard app UI design modern"
This page needs THE MOST attention to animation.

TOP SECTION:
  "Generate Flashcards" Outfit, 32px, #2D2640
  
  Row: document selector + topic input +
  card count: [10] [15] [20] as toggle pills
  (active pill: #FF99C8 bg, white text)
  
  [✨ Generate Flashcards] button:
  Same gradient as notes page CTA

THE FLASHCARD (center of page, large):
  Container: perspective 1200px
  Card size: 480px wide × 320px tall
  Border-radius: 24px
  
  FRONT:
    Background: #FCF5BF (cream)
    Border: 2px solid rgba(232,192,252,0.3)
    Shadow: 0 8px 30px rgba(232,192,252,0.2)

    Content centered:
      Topic text: Outfit, 28px, #2D2640
      Small "tap to flip" hint below
      Inter, 14px, #2D2640 opacity 0.4
    
    Bottom bar:
      Card N of M · source doc pill
      #2D2640 opacity 0.5
    
    Difficulty dot:
      Easy: #D0F4E0 · Medium: #FCF5BF · Hard: #FF99C8

  BACK:
    Background: #D0F4E0 (mint)
    Same border and shadow as front

    Content:
      "Key Points:" label, Outfit, #2D2640
      Recall points as numbered list:
        Each point: Inter, 16px, #2D2640
        Left border per point: #A8DEFA
    
    Bottom:
      Two buttons side by side:
      [✅ Got it] — #D0F4E0 border, 
      #2D2640 text, hover: bg fills mint
      [🔄 Review again] — #FF99C8 border,
      #2D2640 text, hover: bg fills rose

  THE FLIP ANIMATION:
    transform: rotateY(0deg) → rotateY(180deg)
    Duration: 0.6s
    Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55)
    This gives a slight overshoot/bounce at the end

    During flip:
      translateZ: 0px → 30px → 0px (lift arc)
      Shadow expands then contracts
      A subtle glow appears from below during 
      peak rotation (rgba of current card color)
    
    Both sides: backface-visibility: hidden
    Back side: rotateY(180deg) by default
    
    Build this FIRST. Test it. Make it perfect.
    It should feel like flipping a physical card.

  CARD TRANSITIONS:
    Next card: current slides left + fades,
    new slides in from right. Spring physics.
    Prev card: opposite direction.

    "Got it": card flies upward (y: -200, 
    opacity: 0, scale: 0.8) with a mint 
    glow trailing it. Then next card springs in.
    
    "Review again": card shakes (x oscillates 
    -10 → 10 → -5 → 5 → 0, 0.4s) with 
    brief rose glow. Stays, no advancement.
    
    Shuffle: all cards briefly scatter 
    (random x: -50→50, y: -30→30, 
    rotate: -15→15) then snap back into 
    single card. Duration: 0.8s, spring.

  CONTROLS (below card):
    [← Prev]  [Flip ↻]  [Next →]
    Rounded pill buttons, #A8DEFA bg, #2D2640 text
    Hover: scale 1.05

    Second row:
    [🔀 Shuffle] [📊 Progress] [➕ More cards]
    Smaller pills, #E8C0FC bg

  PROGRESS BAR:
    Full width below controls
    Segmented: each segment = one card
    Height: 8px, border-radius: 4px
    Default: rgba(232,192,252,0.2)
    Got it: #D0F4E0 (mint)
    Review again: #FF99C8 (rose)
    Current: #A8DEFA (sky blue)
    Segments fill with smooth width transition

  KEYBOARD SHORTCUTS (show as tooltip):
    Space = flip, ← = prev, → = next
    1 = Got it, 2 = Review again

  DECK OVERVIEW (toggle button):
    Grid of small card tiles (6 columns)
    Each: 100px × 70px, rounded 12px
    Shows front text truncated
    Color by difficulty:
      Easy: #D0F4E0 tint
      Medium: #FCF5BF tint
      Hard: #FF99C8 tint
    Hover: scale(1.1)
    Click: jumps to that card in single view
    Entry: stagger animation, 0.03s between

SAVED DECKS (below):
  Cards in a row:
    Deck name + card count + date
    Progress: "12/20 mastered"
    Mini progress bar
    Click to resume

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 5: AI TUTOR (/tutor)

Search Pinterest: "AI tutor chat interface education"

Full height chat interface, different feel
from Ask page — more warm, more personality.

TOP BAR:
  Left: 🧑‍🏫 avatar (Higgsfield tutor_avatar.png)

- "AI Tutor" Outfit, 24px, #2D2640
- "Your patient study companion"
  Inter, #2D2640 opacity 0.5
  
  Right: document selector dropdown

QUICK ACTION BUTTONS (horizontal scroll row):
  [🧒 Explain like I'm 5]
  [💡 Give me an analogy]
  [📝 Test me on this]
  [📋 Summarize this topic]
  [❓ Why does this matter?]
  [🔗 Connect to other topics]
  
  Each pill:
    Background: white
    Border: 1.5px solid rgba(232,192,252,0.4)
    Text: #2D2640, Inter, 14px
    Border-radius: 50px
    Hover: bg #E8C0FC, wobble animation
    (slight rotation oscillation ±3deg, 0.3s)
    Click: sends command as message

CHAT AREA:
  Tutor messages: left aligned
    Avatar: small tutor icon
    Background: white card, lavender border
    Styled with markdown:
      Callout boxes for analogies:
        #FCF5BF bg, left border #FF99C8
      Code/formula blocks:
        #E8C0FC bg, rounded

  Quiz mode ("Test me"):
    Question card:
      Background: gradient #E8C0FC → #A8DEFA
      Text: #2D2640
      Deals in from top (y: -100 → 0, spring)
      Border-radius: 20px

    After user answers:
      Score stars: ⭐ = #FCF5BF filled
      Correct: #D0F4E0 highlight
      Wrong: #FF99C8 highlight
    
    Final scorecard:
      Background: white
      Border-radius: 24px
      Shadow: large lavender shadow
      
      "📊 Quiz Results" Outfit heading
      Score: large number, colored by performance
        80-100%: #D0F4E0 (mint)
        60-79%: #FCF5BF (cream/yellow)
        Below 60%: #FF99C8 (rose)
      
      Per-question results:
        ✅ Green mint pill for correct
        ❌ Rose pink pill for wrong
      
      "Topics to review:" section
      [🎴 Make flashcards for weak topics]
      Button: gradient CTA

INPUT BAR:
  Same style as Ask page but with
  tutor-themed placeholder:
  "Ask your tutor anything..."
  Small hint: "Try: 'Explain quantum
  mechanics using everyday objects'"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND STRUCTURE:

backend/
├── main.py
├── requirements.txt
├── .env
├── documents/
│   ├── router.py
│   ├── parser.py
│   ├── chunker.py
│   └── schemas.py
├── rag/
│   ├── embeddings.py
│   ├── vectorstore.py
│   ├── retriever.py
│   └── chain.py
├── agents/
│   ├── study_agent.py
│   ├── tools.py
│   └── prompts.py
├── features/
│   ├── notes_router.py
│   ├── flashcards_router.py
│   ├── tutor_router.py
│   └── ask_router.py
└── storage/
    ├── chromadb/
    └── uploads/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API ENDPOINTS:

Documents:
POST   /api/documents/upload
GET    /api/documents
DELETE /api/documents/{id}
GET    /api/documents/{id}/chunks

Ask:
POST   /api/ask
  Body: { question, document_ids[], chat_history[] }
  Returns: { answer, sources[], suggested_questions[] }

Notes:
POST   /api/notes/generate
  Body: { document_ids[], topic? }
  Returns: { notes_markdown, sections[] }

Flashcards:
POST   /api/flashcards/generate
  Body: { document_ids[], topic?, count }
  Returns: { cards: FlashCard[] }

Tutor:
POST   /api/tutor/chat
  Body: { message, document_ids[],
          chat_history[], mode? }
  Returns: { response, mode, quiz_data? }

POST   /api/tutor/evaluate
  Body: { question, user_answer, correct_context }
  Returns: { score, feedback, explanation }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND STRUCTURE:

frontend/src/
  pages/
    LibraryPage.tsx
    AskPage.tsx
    NotesPage.tsx
    FlashcardsPage.tsx
    TutorPage.tsx
  components/
    layout/
      Sidebar.tsx
      PageTransition.tsx
    library/
      UploadZone.tsx
      DocumentCard.tsx
      ProcessingCard.tsx
    ask/
      ChatMessage.tsx
      CitationPill.tsx
      CitationPanel.tsx
      SuggestedQuestions.tsx
      DocumentSelector.tsx
      TypingIndicator.tsx
    notes/
      NotesGenerator.tsx
      NotesDisplay.tsx
      SavedNoteCard.tsx
      ShimmerLoading.tsx
    flashcards/
      FlashCard.tsx
      FlashCardDeck.tsx
      DeckOverview.tsx
      ProgressBar.tsx
      SavedDeckCard.tsx
      CardControls.tsx
    tutor/
      TutorChat.tsx
      QuickActions.tsx
      QuizCard.tsx
      ScoreCard.tsx
    shared/
      MarkdownRenderer.tsx
      LoadingPulse.tsx
  hooks/
    useDocuments.ts
    useRAG.ts
    useFlashcards.ts
    useNotes.ts
    useTutor.ts
  services/
    api.ts
  types/
    index.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ENVIRONMENT VARIABLES:

GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHROMA_PERSIST_DIR=./storage/chromadb
UPLOAD_DIR=./storage/uploads
MAX_FILE_SIZE_MB=20
CORS_ORIGINS=<http://localhost:5173>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BUILD ORDER:

Phase 1 — Setup + Backend Foundation:
  Create Vite + React + TS + Tailwind project
  Configure Tailwind with custom colors:
    lavender: #E8C0FC
    skyblue: #A8DEFA
    mint: #D0F4E0
    cream: #FCF5BF
    rose: #FF99C8
    dark: #2D2640
  Import Google Fonts (Outfit + Inter)
  Set up FastAPI backend
  Document upload + parsing pipeline
  ChromaDB + embeddings setup
  Test: upload PDF, verify chunks stored

Phase 2 — RAG Pipeline:
  Retriever + RAG chain + Groq integration
  POST /api/ask endpoint
  Citation extraction logic
  Test: ask question, get sourced answer

Phase 3 — Features Backend:
  Notes generation endpoint
  Flashcard generation (JSON output)
  Tutor chat + quiz mode endpoints
  Agent with 5 tools

Phase 4 — Generate Assets (Higgsfield):
  Use Higgsfield MCP to generate all 6
  illustrations listed above
  Save to public/assets/
  Verify they match the pastel aesthetic

Phase 5 — Sidebar + Library Page:
  Search Pinterest for inspiration first
  Build sidebar with sliding active indicator
  Library page with upload zone
  Document cards grid
  Processing animation
  Use Chrome DevTools to verify spacing/colors

Phase 6 — Ask Page:
  Search Pinterest for chat UI inspiration
  Chat interface
  Document selector
  Citation pills + panel
  Typing indicator
  Suggested questions
  All message animations

Phase 7 — Notes Page:
  Notes generator form
  Shimmer loading animation
  Markdown renderer with custom styles
  Copy/edit/save functionality
  Saved notes list

Phase 8 — Flashcards Page (CRITICAL):
  FIRST: Build the FlashCard flip component alone
  Get the 3D flip animation PERFECT
  Test it extensively before adding anything else
  Then: deck navigation, controls, keyboard
  Then: got-it/review-again animations
  Then: shuffle animation
  Then: progress bar
  Then: deck overview grid
  Then: saved decks
  Use Chrome DevTools to check flip on
  different screen sizes

Phase 9 — Tutor Page:
  Tutor chat with avatar
  Quick action buttons with wobble
  Quiz mode with card dealing animation
  Score card with count-up numbers
  Weak topic → flashcard generation link

Phase 10 — Polish:
  Lenis smooth scroll
  Page transition animations
  All hover effects finalized
  Mobile responsive (sidebar collapses)
  Empty states with Higgsfield illustrations
  Error handling + toast notifications
  Test entire flow end to end
  Deploy: Vercel + Render

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CRITICAL RULES:

1. Use ONLY the 5 palette colors + #2D2640
   for text + white for surfaces. Nothing else.

2. Every shadow uses rgba of palette colors,
   never grey.

3. The flashcard flip MUST feel premium.
   Build it first, polish it, then move on.

4. Search Pinterest BEFORE building each page
   for design inspiration.

5. Generate illustrations via Higgsfield
   BEFORE building the pages that use them.

6. Check every page with Chrome DevTools
   after building.

7. Animations are not optional — every page
   must have meaningful, smooth animation.

8. Gradients use palette colors only —
   lavender→skyblue, rose→lavender,
   cream→mint are the main combos.

Build phase by phase. Show me each page
after completion. Make it beautiful.
