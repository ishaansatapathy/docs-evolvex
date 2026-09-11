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
      title="eBPF Kernel Probe & Socket Telemetry"
      subtitle="Kernel socket drops (kfree_skb) correlated with application latency"
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
      <div className="min-w-[860px] flex items-stretch justify-between gap-2 p-1">
        {/* Step 1: Kernel */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Kernel Space
            </span>
            <StickyNote text="RingBuffer zero-copy" />
          </div>

          <ExcalidrawCard
            id="kernel"
            title="Linux Kernel (OBI)"
            subtitle="BPF Tracepoints & Kprobes"
            stepNumber="01"
            badge="RingBuffer"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={Cpu}
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
            <div className="space-y-1 mt-1.5 text-[11px] font-mono text-muted-foreground/60">
              <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30">
                <span className="text-foreground/70 font-medium">kfree_skb:</span> socket drop tracer
              </div>
              <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30">
                <span className="text-foreground/70 font-medium">tcp_retransmit:</span> network congestion
              </div>
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="OTLP / gRPC"
          sublabel="DaemonSet :4317"
          color="#6b93b8"
          isActive={activeStep === 1 || activeStep === 2}
          length={40}
        />

        {/* Step 2: Collector */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              User Space OTel
            </span>
            <StickyNote text="ClickHouse metrics" />
          </div>

          <ExcalidrawCard
            id="signoz-obi"
            title="SigNoz Collector"
            subtitle="DaemonSet on Port 4317"
            stepNumber="02"
            badge="ClickHouse"
            badgeColor="#c2716b"
            accentColor="#c2716b"
            icon={Flame}
            seed={202}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'OTLP Receiver over gRPC',
              endpoint: 'signoz-otel-collector.signoz:4317',
              note: 'Stores OBI time-series metrics directly in ClickHouse.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60 mt-1">
              <span className="text-foreground/70 font-medium">Metric:</span>{' '}
              obi_stat_tcp_rtt_seconds
              <br />
              <span className="text-foreground/70 font-medium">Granularity:</span> 10s buckets
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="Query API v5"
          sublabel="temporal correlation"
          color="#6b9e6b"
          isActive={activeStep === 2 || activeStep === 3}
          length={40}
        />

        {/* Step 3: Evolvex */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Incident OS
            </span>
            <StickyNote text="infrastructure RCA" />
          </div>

          <ExcalidrawCard
            id="evolvex-kernel"
            title="Evolvex Correlation"
            subtitle="Kernel vs App Disambiguation"
            stepNumber="03"
            badge="RCA Verified"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={ShieldAlert}
            seed={303}
            isActive={activeStep === 3}
            isSimulated={activeStep === 3}
            details={{
              note: 'Distinguishes between application deadlocks and underlying network packet drops.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono mt-1">
              <span className="font-medium text-foreground/70">Diagnosis:</span>{' '}
              <span className="text-foreground/60">VPC Socket Drop</span>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                AWS NAT gateway port exhaustion detected. Zero app code fault.
              </p>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
