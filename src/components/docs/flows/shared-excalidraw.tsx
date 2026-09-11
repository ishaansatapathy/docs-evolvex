'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  Sparkles,
  Activity,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MoveHorizontal,
} from 'lucide-react'
import { ClientRoughNotation } from '@/components/ui/client-rough-notation'
import rough from 'roughjs'

/**
 * Genuine Excalidraw-Style Hand-Drawn SVG Border via roughjs
 */
export function RoughBorder({
  color = '#00CC66',
  roughness = 1.6,
  bowing = 2,
  strokeWidth = 1.8,
  seed = 42,
  isHovered = false,
}: {
  color?: string
  roughness?: number
  bowing?: number
  strokeWidth?: number
  seed?: number
  isHovered?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !svgRef.current) return
    const svg = svgRef.current

    const draw = () => {
      while (svg.firstChild) svg.removeChild(svg.firstChild)
      const w = svg.clientWidth
      const h = svg.clientHeight
      if (w <= 0 || h <= 0) return

      const rc = rough.svg(svg)
      const rect = rc.rectangle(3, 3, w - 6, h - 6, {
        roughness: isHovered ? roughness * 1.2 : roughness,
        bowing: isHovered ? bowing * 1.2 : bowing,
        stroke: color,
        strokeWidth: isHovered ? strokeWidth + 0.6 : strokeWidth,
        seed,
        fill: isHovered ? `${color}08` : 'transparent',
        fillStyle: 'cross-hatch',
        hachureGap: 14,
      })
      svg.appendChild(rect)
    }

    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(svg)
    return () => ro.disconnect()
  }, [mounted, color, roughness, bowing, strokeWidth, seed, isHovered])

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 pointer-events-none rounded-xl border-2 border-dashed transition-all"
        style={{ borderColor: color }}
      />
    )
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
    />
  )
}

/**
 * Masking Tape Doodle for physical whiteboard aesthetic
 */
export function MaskingTape({
  className = '-top-2.5 left-6 rotate-[-2deg]',
}: {
  className?: string
}) {
  return (
    <div
      className={`absolute z-20 w-16 h-5 pointer-events-none select-none ${className}`}
      style={{
        background:
          'linear-gradient(135deg, rgba(254, 240, 138, 0.28) 0%, rgba(253, 224, 71, 0.35) 100%)',
        borderLeft: '1.5px dashed rgba(234, 179, 8, 0.4)',
        borderRight: '1.5px dashed rgba(234, 179, 8, 0.4)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(2px)',
      }}
    />
  )
}

/**
 * Excalidraw-style Hand-Drawn SVG Arrow
 */
export function HandDrawnArrow({
  direction = 'down',
  label,
  sublabel,
  color = '#00CC66',
  isActive = false,
  length = 50,
}: {
  direction?: 'down' | 'right' | 'left'
  label?: string
  sublabel?: string
  color?: string
  isActive?: boolean
  length?: number
}) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-colors duration-300 ${
        direction === 'down' ? 'flex-col my-3 w-full' : 'flex-row mx-2'
      }`}
    >
      {direction === 'down' ? (
        <div className="flex flex-col items-center">
          {label && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 mb-1 rounded-full text-xs font-mono bg-muted/70 border border-border text-foreground shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          )}
          {sublabel && (
            <span className="font-handwriting text-xs text-muted-foreground/90 mb-1 -rotate-1">
              {sublabel}
            </span>
          )}
          <svg
            width="24"
            height={length}
            viewBox={`0 0 24 ${length}`}
            fill="none"
            className="overflow-visible"
          >
            <path
              d={`M 12 0 C 13.5 ${length * 0.3}, 10.5 ${length * 0.7}, 12 ${length - 8}`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '1.75'}
              strokeDasharray={isActive ? '4 3' : '3 3'}
              className={`transition-all duration-300 ${
                isActive ? 'text-primary animate-pulse' : 'text-border/90 dark:text-white/30'
              }`}
            />
            <path
              d={`M 6 ${length - 10} C 9 ${length - 7}, 11 ${length - 3}, 12 ${length} C 13 ${length - 3}, 15 ${length - 7}, 18 ${length - 10}`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isActive ? 'text-primary' : 'text-border dark:text-white/50'}
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {label && (
            <div className="flex items-center gap-1 px-2 py-0.5 mb-1 rounded-full text-[10px] font-mono bg-muted/80 border border-border text-foreground shadow-xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          )}
          <svg
            width={length}
            height="24"
            viewBox={`0 0 ${length} 24`}
            fill="none"
            className="overflow-visible"
          >
            <path
              d={`M 0 12 C ${length * 0.3} 13.5, ${length * 0.7} 10.5, ${length - 8} 12`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '1.75'}
              strokeDasharray={isActive ? '4 3' : '3 3'}
              className={isActive ? 'text-primary' : 'text-border/90 dark:text-white/30'}
            />
            <path
              d={`M ${length - 10} 6 C ${length - 7} 9, ${length - 3} 11, ${length} 12 C ${length - 3} 13, ${length - 7} 15, ${length - 10} 18`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isActive ? 'text-primary' : 'text-border dark:text-white/50'}
            />
          </svg>
          {sublabel && (
            <span className="font-handwriting text-[11px] text-muted-foreground mt-0.5 whitespace-nowrap">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Excalidraw Sticky Note / Doodle Annotation Tag
 */
export function StickyNote({
  text,
  color = '#F59E0B',
  rotation = -2,
  badge,
}: {
  text: string
  color?: string
  rotation?: number
  badge?: string
}) {
  return (
    <div
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-handwriting tracking-wide shadow-sm border border-amber-500/40 bg-amber-400/15 text-amber-200 dark:text-amber-100 select-none backdrop-blur-xs hover:rotate-0 transition-transform"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      {badge && <span className="font-mono text-[10px] font-bold uppercase opacity-90">{badge}:</span>}
      <span className="font-semibold">{text}</span>
    </div>
  )
}

/**
 * Interactive Excalidraw Diagram Card with Roughjs Hand-Drawn Frame & Rough Annotations
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
  badgeColor = '#00CC66',
  icon: Icon,
  roughType = 'highlight',
  roughColor = '#00CC66',
  seed = 42,
  isActive = false,
  isSimulated = false,
  onMouseEnter,
  onMouseLeave,
  onClick,
  details,
  children,
  className = '',
  accentColor = '#00CC66',
}: ExcalidrawCardProps) {
  const [copied, setCopied] = useState(false)
  const [internalHover, setInternalHover] = useState(false)

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
          ? 'scale-[1.015] -translate-y-1 z-20'
          : 'hover:scale-[1.008] hover:-translate-y-0.5'
      } ${className}`}
      style={{
        boxShadow: highlightState
          ? `0 14px 36px -10px ${accentColor}40`
          : '0 4px 12px rgba(0,0,0,0.06)',
      }}
    >
      {/* Masking tape doodle on the card */}
      <MaskingTape />

      {/* Genuine Roughjs Hand-Drawn Vector Border */}
      <RoughBorder
        color={highlightState ? accentColor : '#94A3B8'}
        roughness={highlightState ? 2.0 : 1.6}
        bowing={highlightState ? 2.6 : 2.0}
        strokeWidth={highlightState ? 2.2 : 1.8}
        seed={seed}
        isHovered={highlightState}
      />

      {/* Card Body with Paper/Obsidian sketch background */}
      <div className="relative rounded-xl p-4 sm:p-5 backdrop-blur-md bg-card/85 dark:bg-[#0a0f14]/90 overflow-hidden">
        {/* Top bar with icon, title, rough annotation, and status badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            {stepNumber && (
              <ClientRoughNotation
                type="circle"
                show={true}
                color={accentColor}
                strokeWidth={2}
                padding={4}
                animationDuration={400}
              >
                <span className="font-mono text-xs font-bold text-foreground px-1">
                  {stepNumber}
                </span>
              </ClientRoughNotation>
            )}

            {Icon && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-transform duration-300 group-hover:scale-110 shadow-xs"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  border: `1.5px solid ${accentColor}50`,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <ClientRoughNotation
                  type={roughType}
                  show={true}
                  color={`${roughColor}35`}
                  strokeWidth={2}
                  padding={3}
                  iterations={2}
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground tracking-tight">
                    {title}
                  </span>
                </ClientRoughNotation>

                {isSimulated && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                    Live Signal
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{subtitle}</p>
              )}
            </div>
          </div>

          {badge && (
            <ClientRoughNotation
              type="box"
              show={true}
              color={`${badgeColor}60`}
              strokeWidth={1.5}
              padding={2}
            >
              <span
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded transition-colors"
                style={{
                  backgroundColor: `${badgeColor}15`,
                  color: badgeColor,
                }}
              >
                {badge}
              </span>
            </ClientRoughNotation>
          )}
        </div>

        {/* Content body */}
        <div className="relative z-10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>

        {/* Interactive Hover / Active Payload Drawer */}
        {details && (
          <div
            className={`relative z-10 mt-3 pt-3 border-t border-border/60 transition-all duration-300 ${
              highlightState ? 'opacity-100 max-h-96' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              {details.endpoint && (
                <div className="flex items-center justify-between gap-1 p-1.5 rounded bg-muted/50 border border-border/80">
                  <span className="text-muted-foreground truncate">
                    <span className="text-foreground font-semibold">Endpoint: </span>
                    {details.endpoint}
                  </span>
                  <button
                    onClick={(e) => handleCopy(e, details.endpoint!)}
                    title="Copy endpoint"
                    className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors shrink-0"
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
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/50 border border-border/80">
                  <span className="text-foreground font-semibold">Auth: </span>
                  <span className="text-muted-foreground truncate">{details.credential}</span>
                </div>
              )}
              {details.protocol && (
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/50 border border-border/80">
                  <span className="text-foreground font-semibold">Protocol: </span>
                  <span className="text-muted-foreground truncate">{details.protocol}</span>
                </div>
              )}
              {details.note && (
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/50 border border-border/80 text-amber-300 dark:text-amber-200">
                  <span className="font-semibold text-amber-400">Note: </span>
                  <span className="truncate">{details.note}</span>
                </div>
              )}
            </div>

            {/* If schema preview is provided and card is highlighted */}
            {details.schema && highlightState && (
              <div className="mt-2 p-2 rounded bg-black/60 border border-border/80 overflow-x-auto text-[10px] font-mono text-emerald-300">
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
 * Excalidraw Canvas Outer Wrapper with Integrated Horizontal Scroller & Track Slider
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

  // Track scroll position for bottom scroller bar
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
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const amount = direction === 'left' ? -320 : 320
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="my-8 rounded-2xl border-2 border-dashed border-border/90 dark:border-white/15 bg-[#fcfcfc] dark:bg-[#070b0e] p-4 sm:p-6 relative overflow-hidden shadow-md">
      {/* Background sketch dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Banner with Excalidraw badge and Simulation Control */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-border/70 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting text-base sm:text-lg text-emerald-500 dark:text-emerald-400 font-semibold select-none flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              {title || 'Autonomous Incident Investigation Architecture'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border/80 dark:border-white/15 bg-muted/50 text-muted-foreground">
              Excalidraw Engine
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-mono mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSimulate && (
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shadow-sm ${
                isSimulating
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 cursor-wait animate-pulse'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary/50'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? `Tracing: ${stepProgress || 'Evaluating...'}` : '⚡ Simulate Signal Flow'}
            </button>
          )}
        </div>
      </div>

      {/* Main Flow Content inside Responsive Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative z-10 overflow-x-auto overflow-y-hidden pb-4 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-emerald-500/30 hover:scrollbar-thumb-emerald-500/60 scrollbar-track-transparent cursor-grab active:cursor-grabbing"
      >
        {children}
      </div>

      {/* Bottom Horizontal Scroller & Track Slider (Requested by user) */}
      <div className="relative z-10 mt-3 pt-3 border-t border-border/60 dark:border-white/8 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MoveHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="font-handwriting text-xs sm:text-sm text-emerald-400 font-medium">
            ↔ Pan / scroll horizontally to explore full architecture
          </span>
        </div>

        {/* Interactive Scroll Bar & Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-md border border-border/80 hover:border-emerald-500/50 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Scroll Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Visual Slider Track */}
          <div className="w-24 sm:w-36 h-2 rounded-full bg-muted/60 border border-border/80 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-150"
              style={{
                width: '35%',
                marginLeft: `${scrollProgress * 65}%`,
              }}
            />
          </div>

          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-md border border-border/80 hover:border-emerald-500/50 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Scroll Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="hidden sm:inline-block font-handwriting text-xs text-muted-foreground/80 ml-2">
            // Zero fake data · O(1) multi-tenant
          </span>
        </div>
      </div>
    </div>
  )
}
