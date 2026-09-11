'use client'

import React, { useState } from 'react'
import { Activity, Flame, Radio, Zap, ShieldAlert, Cpu } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function TelemetryIntelligenceFlow() {
  const [activeState, setActiveState] = useState<'baseline' | 'boost' | 'lock'>('boost')
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setActiveState('baseline')
    setTimeout(() => setActiveState('boost'), 1200)
    setTimeout(() => setActiveState('lock'), 2400)
    setTimeout(() => setIsSimulating(false), 3800)
  }

  return (
    <ExcalidrawCanvas
      title="Adaptive Telemetry Sampling Control Plane"
      subtitle="Click buttons to switch sampling states or click 'Simulate' to watch automated rate escalation"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeState === 'baseline'
          ? 'Baseline Mode: 5%'
          : activeState === 'boost'
          ? 'Deploy Change Boost: 80%'
          : 'Incident Lock: 100%'
      }
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* State selector pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <button
            onClick={() => setActiveState('baseline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'baseline'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm scale-105'
                : 'bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground'
            }`}
          >
            1. Baseline (5-10%)
          </button>
          <button
            onClick={() => setActiveState('boost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'boost'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm scale-105'
                : 'bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground'
            }`}
          >
            2. Change Boost (50-80%)
          </button>
          <button
            onClick={() => setActiveState('lock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'lock'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm scale-105'
                : 'bg-muted/40 text-muted-foreground border-border/70 hover:text-foreground'
            }`}
          >
            3. Incident Lock (100%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Collector */}
          <ExcalidrawCard
            id="collector"
            title="OTel Collector DaemonSet"
            subtitle="Adaptive tail-sampling processor"
            badge={
              activeState === 'baseline'
                ? 'Rate: 5%'
                : activeState === 'boost'
                ? 'Rate: 80%'
                : 'Rate: 100%'
            }
            badgeColor={
              activeState === 'baseline'
                ? '#38BDF8'
                : activeState === 'boost'
                ? '#F59E0B'
                : '#F43F5E'
            }
            accentColor={
              activeState === 'baseline'
                ? '#38BDF8'
                : activeState === 'boost'
                ? '#F59E0B'
                : '#F43F5E'
            }
            icon={Cpu}
            roughType="box"
            roughColor="#38BDF8"
            details={{
              endpoint: '/telemetry-intelligence/sync',
              note: 'Dynamically updates sampling ratio without restarting the collector pod.',
            }}
          >
            <p className="text-xs text-muted-foreground mt-1">
              {activeState === 'baseline' &&
                'Normal operation: samples 5% of healthy traces, 100% of 5xx errors to minimize network cost.'}
              {activeState === 'boost' &&
                'Deploy detected: escalated to 80% sampling for 20m post-deployment to capture early regressions.'}
              {activeState === 'lock' &&
                'Active incident: 100% trace lock enabled. Zero span dropped across all affected microservices.'}
            </p>
          </ExcalidrawCard>

          {/* Card 2: SigNoz ClickHouse */}
          <ExcalidrawCard
            id="signoz-store"
            title="SigNoz ClickHouse"
            subtitle="Telemetry Data Plane"
            badge="Storage Optimized"
            badgeColor="#F43F5E"
            accentColor="#F43F5E"
            icon={Flame}
            roughType="box"
            roughColor="#F43F5E"
            details={{
              note: 'Stores full fidelity traces during incidents; saves 70% storage cost during baseline.',
            }}
          >
            <p className="text-xs text-muted-foreground mt-1">
              ClickHouse stores only high-value traces during calm periods, while capturing 100% causal depth when an investigation opens.
            </p>
          </ExcalidrawCard>

          {/* Card 3: Evolvex Controller */}
          <ExcalidrawCard
            id="evolvex-ctrl"
            title="Evolvex Intelligence"
            subtitle="Policy Decision Engine"
            badge="Autonomous Control"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="box"
            roughColor="#00CC66"
            details={{
              note: 'Triggers: GitHub Deploy (Change Boost) & Fired Alerts (Incident Lock).',
            }}
          >
            <p className="text-xs text-muted-foreground mt-1">
              Listens to GitHub releases, Helm updates, and alert webhooks. Automatically commands collector sampling rates in realtime.
            </p>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
