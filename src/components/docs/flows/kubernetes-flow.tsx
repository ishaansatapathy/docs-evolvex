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
      title="Kubernetes Pod Lifecycle & Crash Correlation"
      subtitle="Correlate OOMKilled states and CrashLoopBackOff with SigNoz latency spikes"
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
      <div className="min-w-[720px] flex items-stretch justify-between gap-2 p-1">
        {/* Cluster Pods */}
        <div className="flex-1 min-w-[300px] max-w-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Kubernetes Cluster
            </span>
            <StickyNote text="EKS · GKE · AKS · k3s" />
          </div>

          <ExcalidrawCard
            id="k8s"
            title="Cluster Runtime"
            subtitle="DaemonSet Collector & API Informer"
            stepNumber="01"
            badge="Crash Detected"
            badgeColor="#c2716b"
            accentColor="#6b93b8"
            icon={Box}
            seed={701}
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              protocol: 'Kubernetes Informer API v1',
              note: 'Captures OOMKilled exit code 137 and CrashLoopBackOff.',
              schema: `// Pod status event:
reason: "OOMKilled"
exitCode: 137
container: "payment-worker"
limit: "512Mi"
usage: "513Mi"`,
            }}
          >
            <div className="space-y-1 mt-1.5 text-[11px] font-mono text-muted-foreground/60">
              <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30">
                <span className="text-foreground/70 font-medium">OOMKilled:</span> memory limit exceeded (137)
              </div>
              <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30">
                <span className="text-foreground/70 font-medium">CrashLoopBackOff:</span> pod restart throttling
              </div>
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="Informer Event Sync"
          sublabel="window: ±5m"
          color="#6b9e6b"
          isActive={activeStep === 1 || activeStep === 2}
          length={40}
        />

        {/* Evolvex */}
        <div className="flex-1 min-w-[300px] max-w-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Evolvex Timeline
            </span>
            <StickyNote text="pod lifecycle correlator" />
          </div>

          <ExcalidrawCard
            id="k8s-evolvex"
            title="Investigation OS"
            subtitle="Automated Infrastructure Pinpoint"
            stepNumber="02"
            badge="Root Cause"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={ShieldAlert}
            seed={802}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              note: 'Pins OOMKilled event directly above SigNoz trace waterfall drop-off.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono">
              <span className="font-medium text-foreground/70">Diagnosis:</span>{' '}
              <span className="text-foreground/60">Payment Worker Memory Spike</span>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                Recommend increasing memory request from 512Mi to 1Gi.
              </p>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
