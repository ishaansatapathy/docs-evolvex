'use client'

import React, { useState } from 'react'
import { Cpu, Radio, Flame, ShieldAlert, Activity } from 'lucide-react'
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        {/* Step 1: Linux Kernel */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              01 • Kernel Space
            </span>
            <StickyNote text="RingBuffer Zero Copy" color="#00CC66" rotation={-1} />
          </div>

          <ExcalidrawCard
            id="kernel"
            title="Linux Kernel (OBI Probes)"
            subtitle="BPF Tracepoints & Kprobes"
            badge="RingBuffer"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={Cpu}
            roughType="box"
            roughColor="#00CC66"
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
            <div className="space-y-1 mt-1 text-xs font-mono text-muted-foreground">
              <div className="p-1.5 rounded bg-muted/40 border border-border/70">
                • <span className="text-foreground font-semibold">kfree_skb: </span>
                Socket drop tracer
              </div>
              <div className="p-1.5 rounded bg-muted/40 border border-border/70">
                • <span className="text-foreground font-semibold">tcp_retransmit: </span>
                Network congestion
              </div>
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="OTLP / gRPC"
          sublabel="DaemonSet Port 4317"
          color="#38BDF8"
          isActive={activeStep === 1 || activeStep === 2}
          length={36}
        />

        {/* Step 2: SigNoz OTel Collector */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              02 • User Space OTel
            </span>
            <StickyNote text="ClickHouse Metrics" color="#F43F5E" rotation={1} />
          </div>

          <ExcalidrawCard
            id="signoz-obi"
            title="SigNoz OTel Collector"
            subtitle="DaemonSet on Port 4317"
            badge="ClickHouse Store"
            badgeColor="#F43F5E"
            accentColor="#F43F5E"
            icon={Flame}
            roughType="box"
            roughColor="#F43F5E"
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'OTLP Receiver over gRPC',
              endpoint: 'signoz-otel-collector.signoz:4317',
              note: 'Stores OBI time-series metrics directly in ClickHouse.',
            }}
          >
            <div className="p-2 rounded bg-muted/40 border border-border/70 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">Metric Name:</span>
              <br />
              obi_stat_tcp_rtt_seconds
              <br />
              <span className="text-foreground font-semibold">Granularity:</span> 10s buckets
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="Query API v5"
          sublabel="Temporal Correlation Query"
          color="#00CC66"
          isActive={activeStep === 2 || activeStep === 3}
          length={36}
        />

        {/* Step 3: Evolvex Engine */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              03 • Incident OS
            </span>
            <StickyNote text="Infrastructure RCA" color="#00CC66" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="evolvex-kernel"
            title="Evolvex Correlation"
            subtitle="Kernel vs App Anomaly Disambiguation"
            badge="RCA Verified"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="box"
            roughColor="#00CC66"
            isActive={activeStep === 3}
            isSimulated={activeStep === 3}
            details={{
              note: 'Distinguishes between application code deadlocks and AWS/GCP underlying network packet drops.',
            }}
          >
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
              <span className="font-bold text-emerald-400">Diagnosis: </span>
              <span className="text-foreground">Underlying VPC Socket Drop</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Zero app code fault; AWS NAT gateway port exhaustion detected.
              </p>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
