import React from 'react'

export function Highlight({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={`relative inline-block rounded-[3px] border border-foreground/15 dark:border-white/20 bg-foreground/[0.02] dark:bg-white/[0.025] px-1.5 py-0.5 font-medium transition-colors ${className}`}>
      {['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map(
        (pos) => (
          <span
            key={pos}
            className={`absolute ${pos} size-1 rounded-[1px] border border-foreground/30 dark:border-white/35 bg-background dark:bg-black pointer-events-none`}
          />
        )
      )}
      {children}
    </span>
  )
}
