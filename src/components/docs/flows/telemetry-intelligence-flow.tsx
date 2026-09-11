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
      title="Adaptive Telemetry Sampling"
      subtitle="Click to switch sampling states or simulate automated rate escalation"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeState === 'baseline'
          ? 'Baseline: 5%'
          : activeState === 'boost'
          ? 'Change Boost: 80%'
          : 'Incident Lock: 100%'
      }
    >
      <div className="space-y-3 max-w-4xl mx-auto">
        {/* State selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
          <button
            onClick={() => setActiveState('baseline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'baseline'
                ? 'bg-[#6b93b8]/15 text-[#6b93b8] border-[#6b93b8]/40'
                : 'bg-muted/30 text-muted-foreground/60 border-border/40 hover:text-foreground/70'
            }`}
          >
            1. Baseline (5-10%)
          </button>
          <button
            onClick={() => setActiveState('boost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'boost'
                ? 'bg-[#b89b6b]/15 text-[#b89b6b] border-[#b89b6b]/40'
                : 'bg-muted/30 text-muted-foreground/60 border-border/40 hover:text-foreground/70'
            }`}
          >
            2. Change Boost (50-80%)
          </button>
          <button
            onClick={() => setActiveState('lock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeState === 'lock'
                ? 'bg-[#c2716b]/15 text-[#c2716b] border-[#c2716b]/40'
                : 'bg-muted/30 text-muted-foreground/60 border-border/40 hover:text-foreground/70'
            }`}
          >
            3. Incident Lock (100%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Collector */}
          <ExcalidrawCard
            id="collector"
            title="OTel Collector"
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
                ? '#6b93b8'
                : activeState === 'boost'
                ? '#b89b6b'
                : '#c2716b'
            }
            accentColor={
              activeState === 'baseline'
                ? '#6b93b8'
                : activeState === 'boost'
                ? '#b89b6b'
                : '#c2716b'
            }
            icon={Cpu}
            details={{
              endpoint: '/telemetry-intelligence/sync',
              note: 'Updates sampling ratio without restarting the collector pod.',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60 mt-1">
              {activeState === 'baseline' &&
                'Normal: samples 5% of healthy traces, 100% of 5xx errors.'}
              {activeState === 'boost' &&
                'Deploy detected: 80% sampling for 20m post-deployment.'}
              {activeState === 'lock' &&
                'Active incident: 100% trace lock. Zero spans dropped.'}
            </p>
          </ExcalidrawCard>

          {/* ClickHouse */}
          <ExcalidrawCard
            id="signoz-store"
            title="SigNoz ClickHouse"
            subtitle="Telemetry Data Plane"
            badge="Storage"
            badgeColor="#c2716b"
            accentColor="#c2716b"
            icon={Flame}
            details={{
              note: 'Full fidelity during incidents; 70% storage savings during baseline.',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60 mt-1">
              Stores only high-value traces during calm periods, capturing 100% depth when an investigation opens.
            </p>
          </ExcalidrawCard>

          {/* Evolvex */}
          <ExcalidrawCard
            id="evolvex-ctrl"
            title="Evolvex Intelligence"
            subtitle="Policy Decision Engine"
            badge="Autonomous"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={ShieldAlert}
            details={{
              note: 'Triggers: GitHub Deploy (Change Boost) & Fired Alerts (Incident Lock).',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60 mt-1">
              Listens to GitHub releases, Helm updates, and alert webhooks. Commands collector sampling rates in realtime.
            </p>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
