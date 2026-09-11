'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

export function VideoScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrubProgress, setScrubProgress] = useState(0)
  const [activeStage, setActiveStage] = useState(1)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isAudioActive, setIsAudioActive] = useState(false)

  useEffect(() => {
    let ctx: any
    let lenisInstance: any

    const initScrollAnimation = async () => {
      try {
        const { default: gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        const Lenis = (await import('lenis')).default

        gsap.registerPlugin(ScrollTrigger)

        // Initialize Lenis smooth scroll
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        })

        lenisInstance.on('scroll', ScrollTrigger.update)

        const tickerCallback = (time: number) => {
          lenisInstance.raf(time * 1000)
        }
        gsap.ticker.add(tickerCallback)
        gsap.ticker.lagSmoothing(0)

        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container) return

        // Ensure video metadata is loaded
        const setupScrub = () => {
          setIsVideoLoaded(true)
          const duration = video.duration || 8

          ctx = gsap.context(() => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
                onUpdate: (self) => {
                  const p = self.progress
                  setScrubProgress(Math.round(p * 100))
                  
                  // Stage mapping
                  if (p < 0.25) {
                    setActiveStage(1)
                  } else if (p < 0.52) {
                    setActiveStage(2)
                  } else if (p < 0.80) {
                    setActiveStage(3)
                  } else {
                    setActiveStage(4)
                  }

                  // Butter-smooth frame scrub
                  if (video && !isNaN(duration) && duration > 0) {
                    const targetTime = Math.min(duration - 0.05, Math.max(0, p * duration))
                    video.currentTime = targetTime
                  }
                },
              },
            })
          }, container)
        }

        if (video.readyState >= 1) {
          setupScrub()
        } else {
          video.addEventListener('loadedmetadata', setupScrub, { once: true })
        }
      } catch (err) {
        console.warn('ScrollTrigger or Lenis initialization error:', err)
      }
    }

    initScrollAnimation()

    return () => {
      if (ctx) ctx.revert()
      if (lenisInstance) lenisInstance.destroy()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030712] text-white selection:bg-emerald-500 selection:text-black font-sans"
      style={{ height: '420vh' }}
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#030712]">
          <video
            ref={videoRef}
            src="/video/hero-scroll.mp4"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            className="w-full h-full object-cover opacity-80 filter contrast-110 saturate-120"
          />
          
          {/* Cybernetic overlays and ambient gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/80 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030712_95%)] pointer-events-none" />
          
          {/* Subtle tech grid mesh */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none" 
            style={{
              backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Lusion HUD Top Header */}
        <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-emerald-500/10 backdrop-blur-md bg-[#030712]/40 text-xs font-mono tracking-wider">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-semibold uppercase tracking-widest">
              EVOLVEX // INVESTIGATION OS
            </span>
            <span className="hidden sm:inline-block text-gray-500">|</span>
            <span className="hidden sm:inline-block text-gray-400">
              SIGNOZ OTEL KERNEL LINK
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-emerald-300/80 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="text-[10px] text-gray-400">SCRUB:</span>
              <span className="font-bold">{String(scrubProgress).padStart(3, '0')}%</span>
            </div>

            <button
              type="button"
              onClick={() => setIsAudioActive(!isAudioActive)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-gray-700 hover:border-emerald-500/50 transition-colors text-gray-300 hover:text-white"
            >
              <span>AUDIO</span>
              <span className={isAudioActive ? 'text-emerald-400' : 'text-gray-500'}>
                [{isAudioActive ? 'ON' : 'MUTED'}]
              </span>
            </button>
          </div>
        </header>

        {/* Corner Reticle Brackets (Lusion.co signature look) */}
        <div className="pointer-events-none absolute inset-x-8 top-16 bottom-16 z-10 hidden sm:block">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30" />
        </div>

        {/* Main Interactive Stage Display (Controlled by Scroll Progress) */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-6">

          {/* STAGE 1: Hero Reveal (0% - 25%) */}
          <div
            className={`max-w-4xl text-center flex flex-col items-center transition-all duration-700 ease-out transform ${
              activeStage === 1
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 -translate-y-8 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Autonomous Incident Correlation Platform
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 mb-6 drop-shadow-2xl">
              EVOLVEX
            </h1>

            <p className="text-lg sm:text-2xl text-gray-300 font-light max-w-2xl leading-relaxed mb-8">
              The AI-Powered Multi-Tenant <span className="text-white font-medium">Investigation OS</span> on top of SigNoz.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400">
              <span className="bg-gray-900/80 border border-gray-800 px-3 py-1.5 rounded-md">
                ⚡ eBPF Kernel Traces
              </span>
              <span className="bg-gray-900/80 border border-gray-800 px-3 py-1.5 rounded-md">
                🔍 SigNoz Alerts & Spans
              </span>
              <span className="bg-gray-900/80 border border-gray-800 px-3 py-1.5 rounded-md">
                🤖 Autonomous Root Cause
              </span>
            </div>

            <div className="mt-12 flex items-center gap-2 text-emerald-400/70 font-mono text-xs animate-bounce">
              <span>↓</span>
              <span>SCROLL TO SCRUB TIMELINE</span>
              <span>↓</span>
            </div>
          </div>

          {/* STAGE 2: Real-time Telemetry & eBPF Signals (25% - 52%) */}
          <div
            className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ease-out transform ${
              activeStage === 2
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute'
            }`}
          >
            {/* Card 1: Alert Ingestion */}
            <div className="p-6 rounded-2xl bg-[#090d16]/85 border border-red-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-mono border-b border-l border-red-500/30">
                CRITICAL ALERT FIRED
              </div>
              <div className="text-xs font-mono text-gray-400 mb-2">SOURCE: SigNoz Webhook</div>
              <h3 className="text-xl font-bold text-white mb-2">payments-svc p99 &gt; 850ms</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Latency breached threshold across 4 Kubernetes pods. Webhook routed securely with HMAC signature verification.
              </p>
              <div className="bg-black/60 rounded p-3 font-mono text-xs text-red-400/90 border border-red-500/20">
                <code>{`{ "service": "payments-svc", "p99": "920ms", "threshold": "800ms", "tenant": "org_primary" }`}</code>
              </div>
            </div>

            {/* Card 2: eBPF Kernel Probe */}
            <div className="p-6 rounded-2xl bg-[#090d16]/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border-b border-l border-cyan-500/30">
                KERNEL TELEMETRY (OBI)
              </div>
              <div className="text-xs font-mono text-gray-400 mb-2">LAYER: Linux Kernel eBPF</div>
              <h3 className="text-xl font-bold text-white mb-2">Socket Drop & TCP Retransmit</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                Zero-code instrumentation captured TCP socket buffer exhaustion on interface <code className="text-cyan-300">eth0</code> without app restart.
              </p>
              <div className="bg-black/60 rounded p-3 font-mono text-xs text-cyan-400/90 border border-cyan-500/20">
                <code>{`{ "probe": "tcp_retransmit_skb", "interface": "eth0", "drops": 412, "process": "node" }`}</code>
              </div>
            </div>
          </div>

          {/* STAGE 3: AI Correlation & Root Cause (52% - 80%) */}
          <div
            className={`max-w-3xl w-full p-8 rounded-2xl bg-[#090d16]/90 border border-emerald-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center transition-all duration-700 ease-out transform ${
              activeStage === 3
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SYNTHESIS COMPLETE · 1.4s TOTAL CORRELATION TIME
            </div>

            <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Automated Root Cause Identified
            </h3>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Evolvex correlated the SigNoz latency alert with eBPF socket drops and GitHub commit <code className="text-emerald-400 font-mono">#8f4b2d1</code> (deployed 4m prior), which lowered Postgres pool connection timeouts.
            </p>

            <div className="w-full bg-black/60 rounded-xl p-4 border border-emerald-500/20 font-mono text-left text-xs mb-6 space-y-2">
              <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                <span>INCIDENT #INV-8492</span>
                <span className="text-emerald-400">CONFIDENCE: 98.6%</span>
              </div>
              <div className="text-gray-300">
                <span className="text-emerald-400 font-semibold">RECOMMENDED ACTION:</span> Rollback PR #142 or increase max_connections parameter to 100.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded bg-gray-800/80 text-gray-300 text-xs font-mono">
                MTTR: 45m → 90s
              </span>
              <span className="px-3 py-1 rounded bg-gray-800/80 text-gray-300 text-xs font-mono">
                Tenants Isolated: 100%
              </span>
              <span className="px-3 py-1 rounded bg-gray-800/80 text-gray-300 text-xs font-mono">
                MCP Query Ready: ✓
              </span>
            </div>
          </div>

          {/* STAGE 4: Developer Portal & Docs Handoff (80% - 100%) */}
          <div
            className={`max-w-3xl w-full text-center flex flex-col items-center transition-all duration-700 ease-out transform ${
              activeStage === 4
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 translate-y-8 scale-95 pointer-events-none absolute'
            }`}
          >
            <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3">
              KNOWLEDGE OPS READY
            </div>

            <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4">
              Agent-Ready Documentation
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl">
              Explore the complete architecture, step-by-step guides, interactive OpenAPI reference, and MCP servers.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a
                href="/quickstart"
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <span>Read Quickstart Guide</span>
                <span>→</span>
              </a>

              <a
                href="/api/introduction"
                className="px-6 py-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white font-medium text-sm transition-all flex items-center gap-2"
              >
                <span>Explore OpenAPI 3.0</span>
              </a>

              <a
                href="/guides/connecting-signoz"
                className="px-6 py-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-white font-medium text-sm transition-all flex items-center gap-2"
              >
                <span>SigNoz Webhook Setup</span>
              </a>
            </div>

            <div className="w-full max-w-lg bg-black/70 border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-400 flex items-center justify-between">
              <span>$ git clone https://github.com/thallylabs/evolvex</span>
              <span className="text-emerald-400 text-[11px]">COPIED</span>
            </div>
          </div>
        </div>

        {/* Lusion HUD Bottom Footer Bar */}
        <footer className="relative z-20 w-full px-6 py-3 flex items-center justify-between border-t border-emerald-500/10 backdrop-blur-md bg-[#030712]/40 text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-4">
            <span>STAGE: 0{activeStage} / 04</span>
            <div className="w-24 sm:w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-150"
                style={{ width: `${scrubProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block">BUILT WITH THALLY & GSAP SCROLLTRIGGER</span>
            <span className="text-emerald-400">AGENT READINESS: 100/A</span>
          </div>
        </footer>

      </div>
    </div>
  )
}
