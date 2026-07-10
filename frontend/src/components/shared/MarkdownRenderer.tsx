import ReactMarkdown from 'react-markdown'

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mb-3 mt-5 font-heading text-2xl font-bold text-dark first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 border-l-4 border-lavender pl-3 font-heading text-2xl font-semibold text-dark first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 font-heading text-lg font-semibold text-dark first:mt-0">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-3 font-body text-[15px] leading-relaxed text-dark">{children}</p>,
        strong: ({ children }) => <strong className="font-bold text-dark">{children}</strong>,
        ul: ({ children }) => <ul className="mb-3 flex flex-col gap-1.5 pl-1">{children}</ul>,
        ol: ({ children }) => (
          <ol className="mb-3 flex list-decimal flex-col gap-1.5 pl-6 font-body text-[15px] text-dark">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 font-body text-[15px] leading-relaxed text-dark">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
            <span className="min-w-0">{children}</span>
          </li>
        ),
        code: ({ children, className }) =>
          className ? (
            <code className="block overflow-x-auto rounded-2xl bg-cream p-4 font-mono text-sm text-dark">
              {children}
            </code>
          ) : (
            <code className="rounded-md bg-cream px-1.5 py-0.5 font-mono text-[13px] text-dark">{children}</code>
          ),
        pre: ({ children }) => <pre className="mb-3">{children}</pre>,
        blockquote: ({ children }) => (
          <blockquote className="mb-3 rounded-r-2xl border-l-4 border-rose bg-cream/60 py-2 pl-4 pr-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
