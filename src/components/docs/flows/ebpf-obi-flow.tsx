'use client'

import React, { useState } from 'react'
import { Cpu, Radio, Flame, ShieldAlert, Activity, Sparkles } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function EbpfObiFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setActiveStep(1)
    setTimeout(() => setActiveStep(2), 900)
    setTimeout(() => setActiveStep(3), 1800)
    setTimeout(() => {
      setActiveStep(null)
      setIsSimulating(false)
    }, 3200)
  }

  return (
    <ExcalidrawCanvas
      title="Linux eBPF Kernel Probe & Socket Telemetry Flow"
      subtitle="Capturing kernel socket drops (kfree_skb) and correlating them with application latency"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeStep === 1
          ? 'Kernel Drop Hooked'
          : activeStep === 2
          ? 'OTel Collector Aggregated'
          : activeStep === 3
          ? 'Network Cause Correlated'
          : ''
      }
    >
      {/* Horizontal Flow Pipeline with minimum width to prevent card clipping */}
      <div className="min-w-[940px] flex items-stretch justify-between gap-2 p-1">
        {/* Step 1: Linux Kernel */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kernel Space
            </span>
            <StickyNote text="RingBuffer Zero Copy" color="#00CC66" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="kernel"
            title="Linux Kernel (OBI)"
            subtitle="BPF Tracepoints & Kprobes"
            stepNumber="01"
            badge="RingBuffer"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={Cpu}
            roughType="highlight"
            roughColor="#00CC66"
            seed={101}
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              protocol: 'tracepoint/skb/kfree_skb',
              note: 'Instruments socket buffer destruction and TCP window collapse.',
              schema: `// Kernel probe metrics:
obi_stat_tcp_rtt_seconds
obi_stat_tcp_retransmits_total
obi_stat_skb_drop_reason`,
            }}
          >
            <div className="space-y-1.5 mt-2 text-xs font-mono text-muted-foreground">
              <div className="p-2 rounded bg-muted/50 border border-border/80">
                • <span className="text-foreground font-semibold">kfree_skb: </span>
                Socket drop tracer
              </div>
              <div className="p-2 rounded bg-muted/50 border border-border/80">
                • <span className="text-foreground font-semibold">tcp_retransmit: </span>
                Network congestion
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ⤹ zero-overhead kernel hook
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 1 -> 2 */}
        <HandDrawnArrow
          direction="right"
          label="OTLP / gRPC"
          sublabel="DaemonSet Port 4317"
          color="#38BDF8"
          isActive={activeStep === 1 || activeStep === 2}
          length={44}
        />

        {/* Step 2: SigNoz OTel Collector */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              User Space OTel
            </span>
            <StickyNote text="ClickHouse Metrics" color="#F43F5E" rotation={1.5} />
          </div>

          <ExcalidrawCard
            id="signoz-obi"
            title="SigNoz Collector"
            subtitle="DaemonSet on Port 4317"
            stepNumber="02"
            badge="ClickHouse Store"
            badgeColor="#F43F5E"
            accentColor="#F43F5E"
            icon={Flame}
            roughType="highlight"
            roughColor="#F43F5E"
            seed={202}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'OTLP Receiver over gRPC',
              endpoint: 'signoz-otel-collector.signoz:4317',
              note: 'Stores OBI time-series metrics directly in ClickHouse.',
            }}
          >
            <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs font-mono text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">Metric Name:</span>
              <br />
              <span className="text-rose-400">obi_stat_tcp_rtt_seconds</span>
              <br />
              <span className="text-foreground font-semibold">Granularity:</span> 10s buckets
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-rose-400">
              ⤷ OLAP timeseries indexed
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 2 -> 3 */}
        <HandDrawnArrow
          direction="right"
          label="Query API v5"
          sublabel="Temporal Correlation"
          color="#00CC66"
          isActive={activeStep === 2 || activeStep === 3}
          length={44}
        />

        {/* Step 3: Evolvex Engine */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Incident OS
            </span>
            <StickyNote text="Infrastructure RCA" color="#00CC66" rotation={-1} />
          </div>

          <ExcalidrawCard
            id="evolvex-kernel"
            title="Evolvex Correlation"
            subtitle="Kernel vs App Disambiguation"
            stepNumber="03"
            badge="RCA Verified"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="highlight"
            roughColor="#00CC66"
            seed={303}
            isActive={activeStep === 3}
            isSimulated={activeStep === 3}
            details={{
              note: 'Distinguishes between application code deadlocks and AWS/GCP underlying network packet drops.',
            }}
          >
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono mt-1">
              <span className="font-bold text-emerald-400">Diagnosis: </span>
              <span className="text-foreground">Underlying VPC Socket Drop</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Zero app code fault; AWS NAT gateway port exhaustion detected.
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ✓ Automated RCA in &lt;60s
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
