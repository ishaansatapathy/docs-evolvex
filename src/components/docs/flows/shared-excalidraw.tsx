'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Info, Sparkles, ExternalLink, Activity } from 'lucide-react'
import { ClientRoughNotation } from '@/components/ui/client-rough-notation'

/**
 * Excalidraw-style Hand-Drawn SVG Arrow
 */
export function HandDrawnArrow({
  direction = 'down',
  label,
  sublabel,
  color = '#00CC66',
  isActive = false,
  length = 60,
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
      className={`relative flex items-center justify-center transition-colors duration-300 ${
        direction === 'down' ? 'flex-col my-3' : 'flex-row mx-3'
      }`}
    >
      {direction === 'down' ? (
        <div className="flex flex-col items-center">
          {label && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 mb-1 rounded-full text-xs font-mono bg-muted/60 border border-border/80 text-foreground/85 shadow-sm backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: color }} />
              <span>{label}</span>
            </div>
          )}
          {sublabel && (
            <span className="font-handwriting text-xs text-muted-foreground/80 mb-1 -rotate-1">
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
            {/* Sketchy rough line */}
            <path
              d={`M 12 0 C 13 ${length * 0.3}, 11 ${length * 0.7}, 12 ${length - 8}`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '1.75'}
              strokeDasharray={isActive ? '4 3' : '3 3'}
              className={`transition-all duration-300 ${
                isActive ? 'text-primary animate-pulse' : 'text-border/80 dark:text-white/25'
              }`}
            />
            {/* Hand-drawn arrowhead */}
            <path
              d={`M 7 ${length - 10} C 9 ${length - 7}, 11 ${length - 3}, 12 ${length} C 13 ${length - 3}, 15 ${length - 7}, 17 ${length - 10}`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isActive ? 'text-primary' : 'text-border/90 dark:text-white/40'}
            />
          </svg>
        </div>
      ) : (
        <div className="flex items-center">
          <svg
            width={length}
            height="24"
            viewBox={`0 0 ${length} 24`}
            fill="none"
            className="overflow-visible"
          >
            <path
              d={`M 0 12 C ${length * 0.3} 13, ${length * 0.7} 11, ${length - 8} 12`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '1.75'}
              strokeDasharray={isActive ? '4 3' : '3 3'}
              className={isActive ? 'text-primary' : 'text-border/80 dark:text-white/25'}
            />
            <path
              d={`M ${length - 10} 7 C ${length - 7} 9, ${length - 3} 11, ${length} 12 C ${length - 3} 13, ${length - 7} 15, ${length - 10} 17`}
              stroke={isActive ? color : 'currentColor'}
              strokeWidth={isActive ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isActive ? 'text-primary' : 'text-border/90 dark:text-white/40'}
            />
          </svg>
          {label && (
            <span className="ml-2 text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/60">
              {label}
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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-handwriting tracking-wide shadow-sm border border-amber-500/30 bg-amber-500/10 text-amber-300 dark:text-amber-200 select-none"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      {badge && <span className="font-mono text-[10px] font-bold uppercase opacity-80">{badge}:</span>}
      <span>{text}</span>
    </div>
  )
}

/**
 * Interactive Excalidraw Diagram Card with Sketch Border & Hover State
 */
export interface ExcalidrawCardProps {
  id: string
  title: string
  subtitle?: string
  badge?: string
  badgeColor?: string
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  roughType?: 'box' | 'circle' | 'underline' | 'highlight' | 'bracket'
  roughColor?: string
  isActive?: boolean
  isSimulated?: boolean
  isHovered?: boolean
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
  badge,
  badgeColor = '#00CC66',
  icon: Icon,
  roughType = 'box',
  roughColor = '#00CC66',
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

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const highlightState = isActive || isSimulated

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`group relative rounded-xl transition-all duration-300 cursor-pointer ${
        highlightState
          ? 'scale-[1.015] -translate-y-1 z-20'
          : 'hover:scale-[1.008] hover:-translate-y-0.5'
      } ${className}`}
      style={{
        boxShadow: highlightState
          ? `0 12px 35px -8px ${accentColor}40, 0 0 0 1.5px ${accentColor}`
          : undefined,
      }}
    >
      {/* Hand-drawn sketchy double outline effect */}
      <div
        className={`relative rounded-xl p-4 sm:p-5 transition-all duration-300 backdrop-blur-md ${
          highlightState
            ? 'bg-card/95 dark:bg-[#0c1218]/95 border border-transparent shadow-lg'
            : 'bg-card/75 dark:bg-[#080d11]/85 border border-border/80 dark:border-white/12 hover:border-border hover:bg-card/90'
        }`}
      >
        {/* Subtle sketch dashed inner frame */}
        <div
          className="absolute inset-1 rounded-lg pointer-events-none transition-opacity duration-300"
          style={{
            border: `1.5px dashed ${highlightState ? accentColor : 'currentColor'}`,
            opacity: highlightState ? 0.6 : 0.15,
          }}
        />

        {/* Top bar with icon, title, rough annotation, and status badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-transform duration-300 group-hover:scale-110 shadow-sm"
                style={{
                  backgroundColor: `${accentColor}18`,
                  color: accentColor,
                  border: `1px solid ${accentColor}40`,
                }}
              >
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <ClientRoughNotation
                  type={roughType}
                  show={highlightState}
                  color={roughColor}
                  strokeWidth={2}
                  padding={3}
                  animationDuration={350}
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
            <span
              className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border shadow-xs transition-colors"
              style={{
                backgroundColor: `${badgeColor}15`,
                color: badgeColor,
                borderColor: `${badgeColor}35`,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Content body */}
        <div className="relative z-10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>

        {/* Interactive Hover / Active Payload Drawer */}
        {details && (
          <div
            className={`relative z-10 mt-3 pt-3 border-t border-border/50 dark:border-white/10 transition-all duration-300 ${
              highlightState ? 'opacity-100 max-h-96' : 'opacity-85 hover:opacity-100'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
              {details.endpoint && (
                <div className="flex items-center justify-between gap-1 p-1.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground truncate">
                    <span className="text-foreground/90 font-semibold">Endpoint: </span>
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
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-foreground/90 font-semibold">Auth: </span>
                  <span className="text-muted-foreground truncate">{details.credential}</span>
                </div>
              )}
              {details.protocol && (
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/40 border border-border/60">
                  <span className="text-foreground/90 font-semibold">Protocol: </span>
                  <span className="text-muted-foreground truncate">{details.protocol}</span>
                </div>
              )}
              {details.note && (
                <div className="flex items-center gap-1 p-1.5 rounded bg-muted/40 border border-border/60 text-amber-300/90 dark:text-amber-200">
                  <span className="font-semibold text-amber-400">Note: </span>
                  <span className="truncate">{details.note}</span>
                </div>
              )}
            </div>

            {/* If schema preview is provided and card is highlighted */}
            {details.schema && highlightState && (
              <div className="mt-2 p-2 rounded bg-black/50 border border-border/80 dark:border-white/10 overflow-x-auto text-[10px] font-mono text-emerald-300/90">
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
 * Excalidraw Canvas Outer Wrapper with Controls, Canvas Grid, and Simulation Trigger
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
  return (
    <div className="my-8 rounded-2xl border-2 border-dashed border-border/90 dark:border-white/15 bg-[#fcfcfc] dark:bg-[#070b0e] p-4 sm:p-7 relative overflow-hidden shadow-md">
      {/* Background sketch dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Banner with Excalidraw badge and Simulation Control */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-border/70 dark:border-white/10">
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

      {/* Main Flow Content */}
      <div className="relative z-10">{children}</div>

      {/* Footer watermark note */}
      <div className="relative z-10 mt-5 pt-3 border-t border-border/60 dark:border-white/8 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Hover any component to inspect protocols, credentials, and live payload schemas.
        </span>
        <span className="hidden sm:inline font-handwriting text-xs text-muted-foreground/80">
          // Zero fake data · O(1) multi-tenant routing
        </span>
      </div>
    </div>
  )
}
