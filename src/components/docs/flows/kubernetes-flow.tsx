'use client'

import React, { useState } from 'react'
import { Box, Layers, ShieldAlert, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function KubernetesFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setActiveStep(1)
    setTimeout(() => setActiveStep(2), 1000)
    setTimeout(() => {
      setActiveStep(null)
      setIsSimulating(false)
    }, 2800)
  }

  return (
    <ExcalidrawCanvas
      title="Kubernetes Pod Lifecycle & Crash Correlation Flow"
      subtitle="Correlate OOMKilled states and CrashLoopBackOff events with SigNoz latency spikes"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeStep === 1
          ? 'Pod OOMKilled Emitted'
          : activeStep === 2
          ? 'Memory Limit Cause Verified'
          : ''
      }
    >
      <div className="min-w-[820px] flex items-stretch justify-between gap-2 p-1">
        {/* Cluster Pods */}
        <div className="flex-1 min-w-[320px] max-w-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Kubernetes Cluster
            </span>
            <StickyNote text="EKS · GKE · AKS · k3s" color="#38BDF8" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="k8s"
            title="Cluster Runtime"
            subtitle="DaemonSet Collector & API Informer"
            stepNumber="01"
            badge="Crash Detected"
            badgeColor="#F43F5E"
            accentColor="#38BDF8"
            icon={Box}
            roughType="highlight"
            roughColor="#38BDF8"
            seed={701}
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              protocol: 'Kubernetes Informer API v1',
              note: 'Captures OOMKilled exit code 137 and CrashLoopBackOff lifecycles.',
              schema: `// Pod status event:
reason: "OOMKilled"
exitCode: 137
container: "payment-worker"
limit: "512Mi"
usage: "513Mi"`,
            }}
          >
            <div className="space-y-1.5 mt-2 text-xs font-mono text-muted-foreground">
              <div className="p-2 rounded bg-muted/50 border border-border/80">
                • <span className="text-rose-400 font-semibold">OOMKilled: </span>
                Container memory limit exceeded (137)
              </div>
              <div className="p-2 rounded bg-muted/50 border border-border/80">
                • <span className="text-amber-400 font-semibold">CrashLoopBackOff: </span>
                Pod restart throttling
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-sky-400">
              ⤹ event exporter streams pod telemetry
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="Informer Event Sync"
          sublabel="Temporal Window: -5m to +5m"
          color="#00CC66"
          isActive={activeStep === 1 || activeStep === 2}
          length={44}
        />

        {/* Evolvex Incident */}
        <div className="flex-1 min-w-[320px] max-w-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Evolvex Timeline
            </span>
            <StickyNote text="Pod Lifecycle Correlator" color="#00CC66" rotation={1.5} />
          </div>

          <ExcalidrawCard
            id="k8s-evolvex"
            title="Investigation OS"
            subtitle="Automated Infrastructure Pinpoint"
            stepNumber="02"
            badge="Root Cause Verified"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="highlight"
            roughColor="#00CC66"
            seed={802}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              note: 'Pins container OOMKilled event directly above SigNoz trace waterfall drop-off.',
            }}
          >
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
              <span className="font-bold text-emerald-400">Diagnosis: </span>
              <span className="text-foreground">Payment Worker Memory Spike</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Recommend increasing memory request from 512Mi to 1Gi in Helm values.yaml.
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ✓ correlates crash with trace latency
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
