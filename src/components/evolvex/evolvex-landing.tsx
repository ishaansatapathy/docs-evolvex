'use client'

import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Terminal,
  Shield,
  Activity,
  GitBranch,
  Cpu,
  Network,
  Sparkles,
  BookOpen,
  Layers,
  Bot,
  CheckCircle2,
  Search,
  Zap,
  ExternalLink,
  Github,
} from 'lucide-react'
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation'
import { Highlight } from '@/components/ui/highlight'
import { CinematicLogo } from '@/components/ui/cinematic-logo'
import { useSpotlight } from '@/hooks/use-spotlight'
import { FlowDottedConnectors } from '@/components/thread/thread-flow-connectors'
import '@/components/thread/thread.css'

const FLOW_STEPS = [
  {
    icon: Activity,
    num: '01',
    title: 'Alert triggers',
    desc: 'A latency threshold breach or 5xx anomaly fires via SigNoz alert webhook or PagerDuty event.',
    badge: 'SigNoz Alert',
    badgeColor: '#ef4444',
  },
  {
    icon: Cpu,
    num: '02',
    title: 'Kernel & OTel sync',
    desc: 'eBPF OBI probes capture TCP drops (kfree_skb) while SigNoz streams distributed trace spans over gRPC.',
    badge: 'Kernel Space',
    badgeColor: '#3b82f6',
  },
  {
    icon: Sparkles,
    num: '03',
    title: 'Autonomous RCA',
    desc: 'AI correlates kernel socket drops, pod evictions, and commit SHAs to isolate root cause in under 45s.',
    badge: '94.8% Confidence',
    badgeColor: '#a855f7',
  },
  {
    icon: CheckCircle2,
    num: '04',
    title: 'Verified timeline',
    desc: 'Zero-hallucination evidence graph is finalized with 1-click remediation & automated postmortem export.',
    badge: 'Timeline Ready',
    badgeColor: '#10b981',
  },
]

const BENTO_CELLS = [
  {
    title: 'eBPF Socket Probes',
    desc: 'Zero-overhead kernel observation capturing TCP drops (kfree_skb), resets, and SYN retransmits before app detection.',
    icon: Cpu,
    color: '#ef4444',
    badge: 'Kernel Space',
  },
  {
    title: 'SigNoz OTLP Stream',
    desc: 'Streams distributed trace spans & error metrics over gRPC port 4317 with automated HMAC SHA-256 ingestion.',
    icon: Activity,
    color: '#34d399',
    badge: 'p99: 1,420ms',
  },
  {
    title: 'Command Palette',
    desc: '⌘K to instantly jump anywhere — search traces, kernel drops, deployments, alert queues, and tenant vaults.',
    icon: Search,
    color: '#38bdf8',
    badge: '⌘K',
  },
  {
    title: 'Autonomous RCA',
    desc: 'Synthesizes causal graphs across traces, kernel socket drops, and Kubernetes pod evictions in under 45 seconds.',
    icon: Sparkles,
    color: '#c084fc',
    badge: '94.8% RCA',
  },
  {
    title: 'CI/CD Commit Markers',
    desc: 'Pins GitHub commit SHAs and release webhooks directly onto latency inflection points without manual coordination.',
    icon: GitBranch,
    color: '#60a5fa',
    badge: 'commit 8f3a9d2',
  },
  {
    title: 'SigNoz MCP Server',
    desc: 'Exposes live query tools (search_spans, get_incident_timeline) directly to Cursor, Claude, and local AI agents.',
    icon: Bot,
    color: '#22d3ee',
    badge: 'Agent Ready',
  },
  {
    title: 'Multi-Tenant Vault',
    desc: 'Strict tenant isolation at PostgreSQL layer with Row-Level Security and envelope encryption for API credentials.',
    icon: Shield,
    color: '#fbbf24',
    badge: 'Neon RLS',
  },
  {
    title: 'Kubernetes Watcher',
    desc: 'Correlates OOMKills, pod evictions, and deployment rollouts against telemetry anomalies automatically.',
    icon: Layers,
    color: '#f472b6',
    badge: 'K8s Events',
  },
]

function useStageInView(threshold = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return { ref, visible }
}

function StageWatcher({
  children,
  onChange,
  threshold = 0.25,
}: {
  children: React.ReactNode
  onChange: (visible: boolean) => void
  threshold?: number
}) {
  const { ref, visible } = useStageInView(threshold)

  useEffect(() => {
    onChange(visible)
  }, [visible, onChange])

  return <div ref={ref}>{children}</div>
}

export function EvolvexLanding() {
  useSpotlight()
  const [mounted, setMounted] = useState(false)
  const [showCross, setShowCross] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activePill, setActivePill] = useState(0)
  const [boxVisible, setBoxVisible] = useState<boolean[]>([true, false, false, false])
  const [edgeVisible, setEdgeVisible] = useState<boolean[]>([false, false, false])
  const [activeNav, setActiveNav] = useState<'overview' | 'workflow' | 'capabilities'>('overview')

  const syncBox = useCallback((index: number, visible: boolean) => {
    setBoxVisible((prev) => {
      if (prev[index] === visible) return prev
      const next = [...prev]
      next[index] = visible
      return next
    })
  }, [])

  const syncEdge = useCallback((index: number, visible: boolean) => {
    setEdgeVisible((prev) => {
      if (prev[index] === visible) return prev
      const next = [...prev]
      next[index] = visible
      return next
    })
  }, [])

  const jumpToStep = useCallback((i: number) => {
    setBoxVisible((prev) => {
      const next = [...prev]
      for (let j = 0; j <= i; j++) next[j] = true
      return next
    })
    setEdgeVisible((prev) => {
      const next = [...prev]
      for (let j = 0; j < i; j++) next[j] = true
      return next
    })
    setActivePill(i)
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('evolvex-landing-active')
    const timer = setTimeout(() => {
      setShowCross(true)
    }, 1400)
    return () => {
      clearTimeout(timer)
      document.body.classList.remove('evolvex-landing-active')
    }
  }, [])

  useEffect(() => {
    const cards = cardRefs.current
    if (!cards.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLDivElement)
            if (idx !== -1) {
              setActivePill(idx)
              setBoxVisible((prev) => {
                const next = [...prev]
                for (let j = 0; j <= idx; j++) next[j] = true
                return next
              })
              setEdgeVisible((prev) => {
                const next = [...prev]
                for (let j = 0; j < idx; j++) next[j] = true
                return next
              })
            }
          }
        }
      },
      { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' },
    )

    cards.forEach((card) => card && io.observe(card))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const sections = ['overview', 'workflow', 'capabilities']
    const elements = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id as 'overview' | 'workflow' | 'capabilities')
          }
        }
      },
      { threshold: 0.25 },
    )

    elements.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main
      className="relative min-h-screen bg-[#020202] text-white selection:bg-[#ef4444] selection:text-white overflow-x-hidden font-sans thread-page"
      style={{
        '--thread-bg': '#020202',
        '--thread-surface': '#08080a',
        '--thread-surface-raised': '#111317',
        '--thread-line': 'rgba(255, 255, 255, 0.1)',
        '--thread-line-strong': 'rgba(255, 255, 255, 0.12)',
        '--thread-line-soft': 'rgba(255, 255, 255, 0.04)',
        '--thread-accent': '#ef4444',
        '--thread-accent-bright': '#ef4444',
        '--thread-accent-glow': 'rgba(239, 68, 68, 0.4)',
        '--thread-accent-soft': 'rgba(239, 68, 68, 0.12)',
        '--thread-text': '#ffffff',
        '--thread-muted': 'rgba(255, 255, 255, 0.6)',
        '--thread-dim': 'rgba(255, 255, 255, 0.4)',
        '--thread-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      } as React.CSSProperties}
    >
      {/* Instant CSS reset for Thally Docs wrapper chrome when landing page renders */}
      <style dangerouslySetInnerHTML={{ __html: `
        html:has(.thread-page) .thally-docs-topbar,
        html:has(.thread-page) .thally-docs-sidebar,
        html:has(.thread-page) .thally-ink-banner,
        body:has(.thread-page) .thally-docs-topbar,
        body:has(.thread-page) .thally-docs-sidebar,
        body:has(.thread-page) .thally-ink-banner,
        body.evolvex-landing-active .thally-docs-topbar,
        body.evolvex-landing-active .thally-docs-sidebar,
        body.evolvex-landing-active .thally-ink-banner {
          display: none !important;
        }

        html:has(.thread-page) .thally-docs-shell,
        body:has(.thread-page) .thally-docs-shell,
        body.evolvex-landing-active .thally-docs-shell {
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }

        html:has(.thread-page) .thally-docs-main,
        html:has(.thread-page) #main-content,
        body:has(.thread-page) .thally-docs-main,
        body:has(.thread-page) #main-content,
        body.evolvex-landing-active .thally-docs-main,
        body.evolvex-landing-active #main-content {
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        html:has(.thread-page) #main-content > div,
        body:has(.thread-page) #main-content > div,
        body.evolvex-landing-active #main-content > div {
          padding: 0 !important;
          margin: 0 !important;
          max-width: 100% !important;
        }
      `}} />

      {/* Background Image with Radial Vignette */}
      <div className="fixed inset-0 h-screen w-screen overflow-hidden pointer-events-none z-0">
        <img
          src="/hero-bg.png"
          alt=""
          className="h-full w-full object-cover opacity-80 grayscale contrast-110 brightness-75"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(255,255,255,0.08),rgba(0,0,0,0)_45%)]" />
        <div className="absolute inset-0 shadow-[inset_70px_0_120px_#020202,inset_-70px_0_120px_#020202,inset_0_100px_130px_#020202,inset_0_-120px_150px_#020202]" />
      </div>

      {/* Dynamic Cursor Spotlight Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-10 bg-black/80 [mask-image:radial-gradient(circle_340px_at_var(--spotlight-x)_var(--spotlight-y),transparent_0%,transparent_34%,rgba(0,0,0,0.35)_55%,#000_100%)]"
        aria-hidden="true"
      />

      {/* Fixed Navbar with floating glass pill and active section tracking */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center py-4 px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-6 py-2.5 max-w-7xl w-full rounded-full border border-white/10 bg-[#060608]/85 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
          {/* Left: Cinematic Logo with Thally Docs co-branding */}
          <div className="flex items-center gap-2.5">
            <a href="/" className="pointer-events-auto transition-opacity hover:opacity-85 flex items-center">
              <CinematicLogo size={36} showText={true} />
            </a>
            <div className="hidden sm:flex items-center gap-2 pl-2.5 border-l border-white/10 pointer-events-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Docs</span>
              <span className="text-white/25 text-xs font-mono">✕</span>
              <a
                href="https://github.com/thallylabs/thally"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 transition-all whitespace-nowrap shrink-0"
              >
                <span className="size-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 group-hover:text-white whitespace-nowrap">
                  Built on <strong className="text-white font-semibold">Thally</strong>
                </span>
                <ExternalLink className="size-2.5 text-white/40 group-hover:text-white transition-colors shrink-0" />
              </a>
            </div>
          </div>

          {/* Center: Floating Capsule */}
          <div className="hidden md:block">
            <div className="flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1">
              <a
                href="#overview"
                className={`px-5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-bold rounded-full transition-all ${
                  activeNav === 'overview'
                    ? 'text-white bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.06)]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                Overview
              </a>
              <a
                href="#workflow"
                className={`px-5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-bold rounded-full transition-all ${
                  activeNav === 'workflow'
                    ? 'text-white bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.06)]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                Workflow
              </a>
              <a
                href="#capabilities"
                className={`px-5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-bold rounded-full transition-all ${
                  activeNav === 'capabilities'
                    ? 'text-white bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.06)]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                Capabilities
              </a>
              <a
                href="/quickstart"
                className="px-5 py-1.5 text-[11px] uppercase tracking-[0.15em] font-bold text-white/40 hover:text-white/80 transition-all rounded-full hover:bg-white/[0.02]"
              >
                Docs
              </a>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="https://evolvex.ishaandev.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#ef4444] hover:text-[#ff6b6b] transition-colors"
            >
              Live Console <ExternalLink className="size-3" />
            </a>
            <a
              href="https://github.com/ishaansatapathy/EvolveX"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              <Github className="size-3.5" /> GitHub
            </a>
            <a
              href="/api/introduction"
              className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              API Reference
            </a>
            <a
              href="/quickstart"
              className="h-8 px-4 flex items-center justify-center text-[11px] uppercase tracking-[0.15em] font-bold bg-white text-black hover:bg-white/90 transition-all rounded-full shadow-lg shadow-white/10"
            >
              Start Quickstart
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="overview" className="relative z-20 grid min-h-screen place-items-center px-5 pt-28 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl"
        >
          {/* Eyebrow with Thally Co-Branding */}
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center justify-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-mono font-medium uppercase tracking-[0.18em] text-white/60 backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-[#ef4444] animate-pulse" />
              Autonomous Incident Investigation on SigNoz
            </p>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-[920px] font-display text-[clamp(3.1rem,6.4vw,5.9rem)] font-normal leading-[0.93] tracking-[-0.045em] text-white">
            Investigate <Highlight>Incidents</Highlight> That
            <br />
            Break Production Systems
          </h1>

          {/* Subtitle with Single RoughNotation Sketch Annotation for Thally */}
          <div className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg flex flex-col items-center gap-7">
            {/* Line 1: Clear problem statement */}
            <div className="text-center text-white/70">
              Diagnose production outages without wasting engineering hours in blind war rooms.
            </div>

            {/* Line 2: The official docs of EvolveX -> Thally! in sketchy hand-drawn style */}
            <div className="text-center text-sm sm:text-base text-white/55 flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
              <span>The official</span>
              <span className="relative inline-block mx-1.5">
                {mounted ? (
                  <RoughNotation
                    type="crossed-off"
                    show={showCross}
                    color="#ef4444"
                    strokeWidth={2}
                    padding={[2, 4]}
                    animationDelay={600}
                  >
                    <span className="text-white/40">docs</span>
                  </RoughNotation>
                ) : (
                  <span className="line-through text-white/40">docs</span>
                )}
                {mounted && showCross && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 6 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 1.4, duration: 0.5, type: 'spring' }}
                    className="absolute -right-6 -top-10 sm:-right-20 sm:-top-10 flex flex-col items-start"
                  >
                    <div className="relative">
                      <RoughNotation
                        type="circle"
                        show={true}
                        color="#ef4444"
                        strokeWidth={2}
                        padding={8}
                        animationDelay={1800}
                      >
                        <a
                          href="https://github.com/thallylabs/thally"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-handwriting text-2xl sm:text-3xl tracking-wide text-white hover:text-[#ef4444] transition-colors inline-block px-1 cursor-pointer"
                        >
                          Thally!
                        </a>
                      </RoughNotation>

                      {/* Curly Arrow */}
                      <svg
                        className="absolute -bottom-7 -left-8 size-10 -rotate-[15deg] pointer-events-none"
                        viewBox="0 0 50 50"
                        fill="none"
                      >
                        <motion.path
                          d="M10 40c5-15 15-25 25-25"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 1.6, duration: 0.6 }}
                        />
                        <motion.path
                          d="M30 10l5 5l-5 5"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeLinecap="round"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.1 }}
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </span>
              <span>of EvolveX.</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
            <a
              href="https://evolvex.ishaandev.co.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ef4444] px-7 text-sm font-bold text-white transition-all hover:bg-[#dc2626] hover:scale-[1.02] shadow-xl shadow-red-500/20"
            >
              Visit Live Console <ExternalLink className="size-4" />
            </a>
            <a
              href="/quickstart"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition-all hover:bg-white/90 hover:scale-[1.02] shadow-xl shadow-white/10"
            >
              Start Quickstart <ArrowRight className="size-4" />
            </a>
            <a
              href="https://github.com/ishaansatapathy/EvolveX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
            >
              <Github className="size-4" /> GitHub
            </a>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Connected Curved Flow (Image 3) */}
      <section id="workflow" className="relative z-20 bg-[#020202] py-28 px-5 md:px-12 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ef4444]">
              How it works
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-normal tracking-tight text-white mt-4">
              From anomaly alert to resolution in{' '}
              {mounted ? (
                <RoughNotation
                  type="underline"
                  color="#ef4444"
                  strokeWidth={3}
                  animationDelay={800}
                  show={true}
                >
                  four steps
                </RoughNotation>
              ) : (
                <span className="underline decoration-[#ef4444]">four steps</span>
              )}
            </h2>
            <p className="mt-4 text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Scroll — each box appears one by one, connected right → down → left → down.
            </p>

            {/* Interactive Process Rail / Pills */}
            <div className="flex flex-wrap justify-center items-center gap-2.5 mt-8">
              {FLOW_STEPS.map((step, i) => {
                const isActive = activePill === i || boxVisible[i]
                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => jumpToStep(i)}
                    className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? 'border-[#ef4444] bg-[#ef4444]/15 text-white shadow-[0_0_24px_rgba(239,68,68,0.3)]'
                        : 'border-white/10 bg-white/[0.02] text-white/50 hover:text-white hover:border-white/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full transition-all duration-300 ${
                        isActive ? 'bg-[#ef4444] scale-125' : 'bg-white/30'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">
                      {step.num}
                    </span>
                    <span>{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Connected Flow Scroll Stage with Dotted Curved Connectors */}
          <div className="thread-flow-scroll relative pt-4 pb-12">
            <FlowDottedConnectors
              cardRefs={cardRefs}
              edgeVisible={edgeVisible.map((edge, i) => edge && (boxVisible[i] ?? false))}
            />

            {FLOW_STEPS.map((step, i) => {
              const align = i % 2 === 0 ? 'left' : 'right'
              const StepIcon = step.icon

              return (
                <Fragment key={step.title}>
                  <StageWatcher onChange={(v) => syncBox(i, v)} threshold={0.3}>
                    <div className={`thread-flow-row thread-flow-row--${align}`}>
                      <div className="thread-flow-reveal" data-visible={boxVisible[i] ?? false}>
                        <div
                          ref={(el) => {
                            cardRefs.current[i] = el
                          }}
                          className={`thread-flow-step thread-flow-step--${align} group transition-all duration-300 hover:border-[#ef4444]/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.18)]`}
                          data-connect={align}
                          style={{
                            width: 'min(420px, 92vw)',
                            background:
                              'linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '16px',
                            padding: '24px',
                          }}
                        >
                          {i < FLOW_STEPS.length - 1 && (
                            <span className="thread-flow-anchor thread-flow-anchor--out" aria-hidden />
                          )}
                          {i > 0 && (
                            <span className="thread-flow-anchor thread-flow-anchor--in" aria-hidden />
                          )}

                          <div className="flex justify-between items-center mb-1">
                            <div
                              className="size-10 rounded-xl flex items-center justify-center border transition-colors"
                              style={{
                                backgroundColor: `${step.badgeColor}15`,
                                borderColor: `${step.badgeColor}35`,
                                color: step.badgeColor,
                              }}
                            >
                              <StepIcon size={20} />
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
                                style={{
                                  backgroundColor: `${step.badgeColor}10`,
                                  borderColor: `${step.badgeColor}25`,
                                  color: step.badgeColor,
                                }}
                              >
                                {step.badge}
                              </span>
                              <span className="thread-flow-num">{step.num}</span>
                            </div>
                          </div>

                          <div className="thread-flow-title text-base font-semibold text-white group-hover:text-[#ef4444] transition-colors">
                            {step.title}
                          </div>
                          <div className="thread-flow-desc text-xs leading-relaxed text-white/60">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StageWatcher>

                  {i < FLOW_STEPS.length - 1 && (
                    <StageWatcher onChange={(v) => syncEdge(i, v)} threshold={0.2}>
                      <div className="thread-flow-edge-stage h-20 w-full" aria-hidden />
                    </StageWatcher>
                  )}
                </Fragment>
              )
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-8 border-t border-white/5 text-xs text-white/40 flex flex-wrap items-center justify-center gap-2.5">
            <span className="size-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span>
              Every step runs through authentic SigNoz OTLP spans, eBPF tracepoints, and PostgreSQL RLS.
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/60">
              Engineered on <strong className="text-white font-medium">Thally Runtime Platform</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Section 3: Thread-Style Precision Capabilities Grid (Image 2) */}
      <section id="capabilities" className="relative z-20 bg-[#020202] py-28 px-5 md:px-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          {/* Bento Grid Container */}
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#030304] shadow-2xl grid grid-cols-1 lg:grid-cols-[1.15fr_1fr_1fr]">
            {/* Left Header Column (spans 4 rows on desktop) */}
            <div className="lg:row-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/10 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ef4444]">
                  Capabilities
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-normal tracking-tight text-white leading-[1.15] mt-4">
                  Everything you need for{' '}
                  {mounted ? (
                    <RoughNotation
                      type="underline"
                      color="#ef4444"
                      strokeWidth={3}
                      show={true}
                    >
                      incident workflows
                    </RoughNotation>
                  ) : (
                    <span className="underline decoration-[#ef4444]">incident workflows</span>
                  )}
                </h2>
                <p className="text-sm text-white/50 mt-5 leading-relaxed max-w-[320px]">
                  Built for Linux kernel eBPF &amp; SigNoz — not generic cloud dashboards.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-white/40">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span>Docs Core: <strong className="text-white/80">Thally v0.2.4</strong></span>
                </div>
              </div>

              <div className="mt-12 space-y-3">
                <div className="inline-block">
                  {mounted ? (
                    <RoughNotation
                      type="box"
                      color="rgba(255,255,255,0.3)"
                      strokeWidth={1}
                      padding={8}
                      show={true}
                    >
                      <span className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                        gRPC 4317 · eBPF OBI · Neon RLS
                      </span>
                    </RoughNotation>
                  ) : (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 border border-white/20 px-2 py-1">
                      gRPC 4317 · eBPF OBI · Neon RLS
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/40 font-mono">
                  ✓ 94.8% RCA confidence in &lt;45s
                </div>
              </div>
            </div>

            {/* 8 Precision Cells */}
            {BENTO_CELLS.map((cell, idx) => {
              const CellIcon = cell.icon
              const isRightCol = idx % 2 === 1
              const isLastTwo = idx >= BENTO_CELLS.length - 2
              const isVeryLast = idx === BENTO_CELLS.length - 1

              return (
                <div
                  key={cell.title}
                  className={`p-6 md:p-8 transition-all duration-200 hover:bg-white/[0.025] flex flex-col justify-between group ${
                    !isRightCol ? 'lg:border-r border-white/10' : ''
                  } ${
                    isLastTwo ? 'lg:border-b-0' : 'border-b border-white/10'
                  } ${isVeryLast ? 'border-b-0' : 'border-b lg:border-b-0'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 min-h-[32px]">
                      <div
                        className="size-8 rounded-lg flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: `${cell.color}15`,
                          borderColor: `${cell.color}35`,
                          color: cell.color,
                        }}
                      >
                        <CellIcon size={16} />
                      </div>
                      {cell.badge && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${cell.color}10`,
                            borderColor: `${cell.color}25`,
                            color: cell.color,
                          }}
                        >
                          {cell.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold tracking-[-0.02em] text-white group-hover:text-[#ef4444] transition-colors">
                      {cell.title}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed mt-2">
                      {cell.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Evolvex Typography Section */}
      <section className="relative z-20 bg-[#020202] py-48 px-5 md:px-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl text-center">
          {mounted && (
            <RoughNotationGroup show={true}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="space-y-20"
              >
                <div className="inline-block relative">
                  <RoughNotation
                    type="circle"
                    color="#ef4444"
                    strokeWidth={3}
                    padding={32}
                    animationDelay={500}
                    show={true}
                  >
                    <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.1] font-normal tracking-[-0.04em] text-white italic py-4">
                      Built for <span className="not-italic">realtime</span>{' '}
                      <span className="relative inline-block">
                        <RoughNotation
                          type="underline"
                          color="white"
                          strokeWidth={2}
                          animationDelay={1500}
                          show={true}
                        >
                          investigation.
                        </RoughNotation>
                      </span>
                    </h2>
                  </RoughNotation>
                </div>

                <h3 className="font-display text-[clamp(2.2rem,6vw,4.8rem)] leading-[1.1] font-normal tracking-[-0.04em] text-white/35">
                  Because nobody likes <br />
                  <span className="text-white line-through decoration-white/20">blind alerts &amp; endless war rooms.</span>
                </h3>

                <h3 className="font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.1] font-normal tracking-[-0.04em] text-white underline underline-offset-8 decoration-white/10">
                  Modern investigation for modern engineering teams.
                </h3>

                <div className="pt-8 flex flex-wrap justify-center items-center gap-4">
                  <a
                    href="https://evolvex.ishaandev.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#ef4444] px-8 text-sm font-bold text-white transition-all hover:bg-[#dc2626] hover:scale-[1.02] shadow-xl shadow-red-500/20"
                  >
                    Visit Live Console <ExternalLink className="size-4" />
                  </a>
                  <a
                    href="/quickstart"
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black transition-all hover:bg-white/90 hover:scale-[1.02] shadow-xl shadow-white/10"
                  >
                    Read Documentation <ArrowRight className="size-4" />
                  </a>
                  <a
                    href="https://github.com/thallylabs/thally"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
                  >
                    ⚡ Powered by Thally
                  </a>
                  <a
                    href="https://github.com/ishaansatapathy/EvolveX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/30 backdrop-blur-md"
                  >
                    <Github className="size-4" /> Star on GitHub
                  </a>
                </div>
              </motion.div>
            </RoughNotationGroup>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-20 px-5 md:px-20 border-t border-white/5 bg-[#020202]">
        <div className="mx-auto max-w-7xl flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <CinematicLogo size={32} showText={true} />
              <div className="hidden md:block h-6 w-[1px] bg-white/10" />
              <a
                href="https://github.com/thallylabs/thally"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 transition-all"
              >
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-white/70 group-hover:text-white">
                  Built on <strong className="text-white font-semibold">Thally Labs</strong>
                </span>
                <ExternalLink className="size-3 text-white/40 group-hover:text-white transition-colors" />
              </a>
              <div className="hidden md:block h-6 w-[1px] bg-white/10" />
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                <span className="text-white/40 italic font-handwriting text-2xl normal-case tracking-normal">
                  &quot;Build for the builders&quot;
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-white/50">
              <a
                href="https://evolvex.ishaandev.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ef4444] hover:text-[#ff6b6b] flex items-center gap-1 font-medium transition-colors"
              >
                Live Console <ExternalLink className="size-3" />
              </a>
              <a
                href="https://github.com/ishaansatapathy/EvolveX"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Github className="size-3" /> GitHub
              </a>
              <a
                href="https://github.com/thallylabs/thally"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-medium text-white/70"
              >
                Thally Engine
              </a>
              <a href="/quickstart" className="hover:text-white transition-colors">Quickstart</a>
              <a href="/guides/architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="/guides/signoz-setup" className="hover:text-white transition-colors">SigNoz Setup</a>
              <a href="/api/introduction" className="hover:text-white transition-colors">API Reference</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-mono">
              © 2026 Evolvex OS — Autonomous Investigation on SigNoz · Engineered on{' '}
              <a
                href="https://github.com/thallylabs/thally"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold hover:text-[#ef4444] transition-colors underline underline-offset-4 decoration-white/20"
              >
                Thally Documentation Runtime
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
