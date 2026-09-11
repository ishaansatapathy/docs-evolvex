'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Copy,
  Check,
  Activity,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { RoughNotation } from 'react-rough-notation'

/**
 * Thin pencil-stroke border — CSS only, no roughjs bulk.
 * Just a quiet rounded dashed border that tightens on hover.
 */
export function RoughBorder({
  color = 'currentColor',
  isHovered = false,
}: {
  color?: string
  roughness?: number
  bowing?: number
  strokeWidth?: number
  seed?: number
  isHovered?: boolean
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none rounded-xl transition-all duration-300"
      style={{
        border: isHovered
          ? `1.5px solid ${color}50`
          : `1px dashed ${color}25`,
        borderRadius: '0.75rem',
      }}
    />
  )
}


/**
 * MaskingTape — kept as a no-op export for backward compat.
 * Renders nothing. The tape doodles were the main AI slop culprit.
 */
export function MaskingTape({ className = '' }: { className?: string }) {
  return null
}

/**
 * Clean arrow connector — simple SVG path, no animation spam.
 */
export function HandDrawnArrow({
  direction = 'down',
  label,
  sublabel,
  color = 'currentColor',
  isActive = false,
  length = 44,
}: {
  direction?: 'down' | 'right' | 'left'
  label?: string
  sublabel?: string
  color?: string
  isActive?: boolean
  length?: number
}) {
  const isHorizontal = direction !== 'down'

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${
        isHorizontal ? 'flex-row mx-1' : 'flex-col my-2 w-full'
      }`}
    >
      {!isHorizontal ? (
        <div className="flex flex-col items-center gap-0.5">
          {label && (
            <span className="text-[10px] font-mono text-muted-foreground/70 tracking-wide">
              {label}
            </span>
          )}
          <svg
            width="20"
            height={length}
            viewBox={`0 0 20 ${length}`}
            fill="none"
            className="overflow-visible"
          >
            <line
              x1="10"
              y1="0"
              x2="10"
              y2={length - 8}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className={isActive ? '' : 'text-border dark:text-white/20'}
              strokeOpacity={isActive ? 0.7 : 0.5}
            />
            <path
              d={`M 5 ${length - 9} L 10 ${length} L 15 ${length - 9}`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={isActive ? '' : 'text-border dark:text-white/30'}
              strokeOpacity={isActive ? 0.8 : 0.5}
            />
          </svg>
          {sublabel && (
            <span className="font-handwriting text-[10px] text-muted-foreground/60 italic">
              {sublabel}
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          {label && (
            <span className="text-[10px] font-mono text-muted-foreground/60 tracking-wide whitespace-nowrap mb-0.5">
              {label}
            </span>
          )}
          <svg
            width={length}
            height="20"
            viewBox={`0 0 ${length} 20`}
            fill="none"
            className="overflow-visible"
          >
            <line
              x1="0"
              y1="10"
              x2={length - 8}
              y2="10"
              stroke={isActive ? color : 'currentColor'}
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className={isActive ? '' : 'text-border dark:text-white/20'}
              strokeOpacity={isActive ? 0.7 : 0.5}
            />
            <path
              d={`M ${length - 9} 5 L ${length} 10 L ${length - 9} 15`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={isActive ? '' : 'text-border dark:text-white/30'}
              strokeOpacity={isActive ? 0.8 : 0.5}
            />
          </svg>
          {sublabel && (
            <span className="font-handwriting text-[10px] text-muted-foreground/50 mt-0.5 whitespace-nowrap italic">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Sticky Note — charming sketchy inline annotation with subtle tilt and handwriting font.
 */
export function StickyNote({
  text,
  color = '#ef4444',
  rotation = -1.5,
  badge,
}: {
  text: string
  color?: string
  rotation?: number
  badge?: string
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-handwriting tracking-wide border border-dashed select-none transition-all duration-200 hover:scale-105 hover:rotate-0"
      style={{
        transform: `rotate(${rotation}deg)`,
        borderColor: `${color}40`,
        backgroundColor: `${color}0c`,
        color: color,
      }}
    >
      {badge && <span className="font-mono text-[9px] uppercase tracking-wider font-semibold opacity-75">{badge}:</span>}
      <span>{text}</span>
    </span>
  )
}

/**
 * Interactive Diagram Card — clean and minimal.
 * No masking tape, no roughjs SVG canvas, no cross-hatch fills.
 * Just a well-crafted bordered card with subtle hover lift.
 */
export interface ExcalidrawCardProps {
  id: string
  title: string
  subtitle?: string
  stepNumber?: string
  badge?: string
  badgeColor?: string
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  roughType?: 'box' | 'circle' | 'underline' | 'highlight' | 'bracket'
  roughColor?: string
  seed?: number
  isActive?: boolean
  isSimulated?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
  details?: {
    endpoint?: string
    credential?: string
    protocol?: string
    schema?: string
    note?: string
  }
  children?: React.ReactNode
  className?: string
  accentColor?: string
}

export function ExcalidrawCard({
  title,
  subtitle,
  stepNumber,
  badge,
  badgeColor = '#737373',
  icon: Icon,
  roughType,
  roughColor,
  isActive = false,
  isSimulated = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  details,
  children,
  className = '',
  accentColor = '#737373',
}: ExcalidrawCardProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [internalHover, setInternalHover] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const highlightState = isActive || isSimulated || internalHover

  return (
    <div
      onMouseEnter={() => {
        setInternalHover(true)
        onMouseEnter?.()
      }}
      onMouseLeave={() => {
        setInternalHover(false)
        onMouseLeave?.()
      }}
      onClick={onClick}
      className={`group relative rounded-xl transition-all duration-300 cursor-pointer ${
        highlightState
          ? 'scale-[1.008] -translate-y-0.5 z-20 shadow-[0_0_24px_rgba(239,68,68,0.12)]'
          : 'hover:scale-[1.004]'
      } ${className}`}
    >
      {/* Corner notch pins — precision blueprint style matching landing page */}
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos) => (
        <span
          key={pos}
          className={`absolute size-1.5 rounded-[1px] border pointer-events-none z-30 transition-all duration-300 ${
            highlightState
              ? 'border-[#ef4444] bg-[#ef4444]/30 scale-125'
              : 'border-foreground/20 dark:border-white/25 bg-background dark:bg-black group-hover:border-[#ef4444]/60'
          } ${pos}`}
        />
      ))}

      {/* Clean border — dashed by default, solid on hover */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
        style={{
          border: highlightState
            ? `1.5px solid ${accentColor}50`
            : '1px solid var(--border-color, rgba(128,128,128,0.15))',
        }}
      />

      {/* Card content */}
      <div className="relative rounded-xl p-4 sm:p-5 bg-card/60 dark:bg-[#0c1017]/85 overflow-hidden">
        {/* Subtle left accent bar */}
        <div
          className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-opacity duration-200"
          style={{
            backgroundColor: accentColor,
            opacity: highlightState ? 0.7 : 0.2,
          }}
        />

        {/* Header row */}
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-2 mb-2 pl-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {stepNumber && (
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold shrink-0 border transition-transform group-hover:scale-105"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  backgroundColor: `${accentColor}08`,
                }}
              >
                {stepNumber}
              </span>
            )}

            {Icon && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {mounted && (roughType || (highlightState && !subtitle)) ? (
                  <RoughNotation
                    type={roughType ?? 'underline'}
                    show={highlightState}
                    color={roughColor || accentColor || '#ef4444'}
                    strokeWidth={1.5}
                    padding={roughType === 'circle' ? 6 : [1, 3]}
                    animationDuration={500}
                  >
                    <span className="font-semibold text-sm text-foreground tracking-tight">
                      {title}
                    </span>
                  </RoughNotation>
                ) : (
                  <span className="font-semibold text-sm text-foreground tracking-tight">
                    {title}
                  </span>
                )}
                {isSimulated && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
                    Live
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[11px] text-muted-foreground/70 mt-0.5 font-mono">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && (
            <span
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded shrink-0"
              style={{
                backgroundColor: `${badgeColor}10`,
                color: badgeColor,
                border: `1px solid ${badgeColor}25`,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="relative z-10 text-xs sm:text-sm text-muted-foreground/80 leading-relaxed pl-3">
          {children}
        </div>

        {/* Detail rows — shown on hover/active */}
        {details && (
          <div
            className={`relative z-10 mt-3 pt-3 border-t border-border/40 transition-all duration-200 pl-3 ${
              highlightState ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] font-mono">
              {details.endpoint && (
                <div className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-muted-foreground/80 truncate">
                    <span className="text-foreground/70 font-medium">Endpoint:</span>{' '}
                    {details.endpoint}
                  </span>
                  <button
                    onClick={(e) => handleCopy(e, details.endpoint!)}
                    title="Copy endpoint"
                    className="p-0.5 text-muted-foreground/50 hover:text-foreground rounded transition-colors shrink-0"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}
              {details.credential && (
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-foreground/70 font-medium">Auth:</span>
                  <span className="text-muted-foreground/80 truncate">{details.credential}</span>
                </div>
              )}
              {details.protocol && (
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-muted/30 border border-border/50">
                  <span className="text-foreground/70 font-medium">Protocol:</span>
                  <span className="text-muted-foreground/80 truncate">{details.protocol}</span>
                </div>
              )}
              {details.note && (
                <div className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-muted/30 border border-border/50">
                  <span className="font-medium" style={{ color: `${accentColor}90` }}>
                    Note:
                  </span>
                  <span className="text-muted-foreground/80 truncate">{details.note}</span>
                </div>
              )}
            </div>

            {details.schema && highlightState && (
              <div className="mt-2 p-2.5 rounded-md bg-black/40 border border-border/40 overflow-x-auto text-[10px] font-mono text-foreground/60">
                <pre>{details.schema}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Canvas wrapper — clean dot-grid, minimal header, functional scroller.
 * No "Excalidraw Engine" badge, no spinning sparkles, no commentary.
 */
export function ExcalidrawCanvas({
  title,
  subtitle,
  onSimulate,
  isSimulating = false,
  stepProgress,
  children,
}: {
  title?: string
  subtitle?: string
  onSimulate?: () => void
  isSimulating?: boolean
  stepProgress?: string
  children: React.ReactNode
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [fitMode, setFitMode] = useState(false)

  // Drag-to-scroll & Swipe states
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 10) {
      setHasOverflow(true)
      setScrollProgress(Math.min(1, Math.max(0, el.scrollLeft / maxScroll)))
    } else {
      setHasOverflow(false)
    }
  }

  useEffect(() => {
    handleScroll()
    const el = scrollContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(handleScroll)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fitMode])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, [role="button"], code')) return

    isDraggingRef.current = true
    setIsDragging(true)
    startXRef.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
    scrollLeftRef.current = scrollContainerRef.current?.scrollLeft || 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0)
    const walk = (x - startXRef.current) * 1.5
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      setIsDragging(false)
    }
  }

  // Touch swipe handlers
  const touchStartXRef = useRef(0)
  const touchScrollLeftRef = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    touchStartXRef.current = e.touches[0].pageX
    touchScrollLeftRef.current = scrollContainerRef.current?.scrollLeft || 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current || e.touches.length !== 1) return
    const x = e.touches[0].pageX
    const walk = (x - touchStartXRef.current) * 1.3
    scrollContainerRef.current.scrollLeft = touchScrollLeftRef.current - walk
  }

  return (
    <div className="my-8 rounded-2xl border border-border/70 dark:border-white/10 bg-muted/20 dark:bg-[#06080c]/80 p-4 sm:p-6 relative transition-all duration-300">
      {/* Corner notch pins — landing page precision aesthetic */}
      {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos) => (
        <span
          key={pos}
          className={`absolute size-2 rounded-[1px] border border-foreground/25 dark:border-white/25 bg-background dark:bg-black pointer-events-none z-20 ${pos}`}
        />
      ))}
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(currentColor 0.5px, transparent 0.5px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Header bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-border/40 dark:border-white/6">
        <div>
          {title && (
            <h3 className="text-sm font-medium text-foreground/90 tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Fit / Expand column adjustment toggle */}
          <button
            type="button"
            onClick={() => setFitMode(!fitMode)}
            title={fitMode ? 'Expand to wide scroll' : 'Fit columns to screen'}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all ${
              fitMode
                ? 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30 shadow-sm'
                : 'bg-muted/40 text-muted-foreground/70 border-border/40 hover:text-foreground hover:border-border'
            }`}
          >
            {fitMode ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>Fit: ON</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>Adjust Width</span>
              </>
            )}
          </button>

          {onSimulate && (
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSimulating
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 cursor-wait'
                  : 'bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20 hover:border-accent/40'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? stepProgress || 'Tracing...' : 'Simulate Signal Flow'}
            </button>
          )}
        </div>
      </div>

      {/* Flow content with drag-to-scroll & touch swipe */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative z-10 pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent ${
          fitMode
            ? 'w-full overflow-x-visible'
            : 'overflow-x-auto overflow-y-hidden select-none'
        } ${hasOverflow && !fitMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      >
        <div className={fitMode ? '[&>*]:min-w-0 [&>*]:w-full [&_*]:min-w-0' : ''}>
          {children}
        </div>
      </div>

      {/* Bottom scroller — shows drag/swipe instruction & smooth scroller */}
      {hasOverflow && !fitMode && (
        <div className="relative z-10 mt-3 pt-2 border-t border-border/30 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/60 select-none">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>Swipe or drag columns to adjust ← →</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              title="Scroll left"
              className="p-1 rounded-md border border-border/50 hover:border-[#ef4444]/40 bg-transparent text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div
              className="w-20 sm:w-28 h-1.5 rounded-full bg-border/40 cursor-pointer overflow-hidden relative"
              title="Drag or click to adjust position"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const ratio = clickX / rect.width
                if (scrollContainerRef.current) {
                  const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
                  scrollContainerRef.current.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' })
                }
              }}
            >
              <div
                className="h-full rounded-full bg-[#ef4444]/70 transition-all duration-150"
                style={{
                  width: '30%',
                  marginLeft: `${scrollProgress * 70}%`,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => scroll('right')}
              title="Scroll right"
              className="p-1 rounded-md border border-border/50 hover:border-[#ef4444]/40 bg-transparent text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
