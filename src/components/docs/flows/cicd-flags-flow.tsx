'use client'

import React, { useState } from 'react'
import { Workflow, Sliders, ShieldAlert, GitCommit, ToggleRight } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function CicdFlagsFlow() {
  const [activeSide, setActiveSide] = useState<'cicd' | 'flags' | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setActiveSide('cicd')
    setTimeout(() => setActiveSide('flags'), 1200)
    setTimeout(() => {
      setActiveSide(null)
      setIsSimulating(false)
    }, 2800)
  }

  return (
    <ExcalidrawCanvas
      title="CI/CD & Feature Flags Correlation"
      subtitle="Pipeline failures and flag rollouts correlated with SigNoz error traces"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeSide === 'cicd'
          ? 'CI Build Failure Correlated'
          : activeSide === 'flags'
          ? 'Flag Rollout Matched'
          : ''
      }
    >
      <div className="space-y-3 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* CI/CD Card */}
          <ExcalidrawCard
            id="cicd-hook"
            title="GitHub Actions / GitLab CI"
            subtitle="Integration test failures & retries"
            badge="POST /webhooks/cicd"
            badgeColor="#7b7db8"
            accentColor="#7b7db8"
            icon={Workflow}
            isActive={activeSide === 'cicd'}
            isSimulated={activeSide === 'cicd'}
            onMouseEnter={() => setActiveSide('cicd')}
            details={{
              endpoint: 'POST /webhooks/cicd',
              credential: 'x-evolvex-cicd-secret',
              protocol: 'Webhook JSON',
              note: 'Pins test failure logs onto the incident timeline.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60 mt-1">
              <span className="text-foreground/70 font-medium">Event:</span> workflow_job.completed (failure)
              <br />
              <span className="text-foreground/70 font-medium">Job:</span> cypress-e2e-checkout
            </div>
          </ExcalidrawCard>

          {/* Flags Card */}
          <ExcalidrawCard
            id="flags-hook"
            title="LaunchDarkly / Unleash"
            subtitle="Flag toggle: new-checkout (100%)"
            badge="POST /webhooks/flags"
            badgeColor="#b89b6b"
            accentColor="#b89b6b"
            icon={Sliders}
            isActive={activeSide === 'flags'}
            isSimulated={activeSide === 'flags'}
            onMouseEnter={() => setActiveSide('flags')}
            details={{
              endpoint: 'POST /webhooks/feature-flags',
              credential: 'x-evolvex-flag-secret',
              protocol: 'Webhook JSON',
              note: 'Detects exact second flag was toggled relative to error spike.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60 mt-1">
              <span className="text-foreground/70 font-medium">Flag:</span> checkout-v2-stripe-elements
              <br />
              <span className="text-foreground/70 font-medium">Action:</span> Rollout 10% → 100%
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="Signal Ingestion"
          sublabel="org-scoped secret_hash"
          color="#6b9e6b"
          isActive={activeSide !== null}
          length={36}
        />

        {/* Evolvex Card */}
        <ExcalidrawCard
          id="evolvex-changes"
          title="Evolvex Investigation"
          subtitle="Change Event Correlation & Timeline Synthesis"
          badge="Verified Change"
          badgeColor="#6b9e6b"
          accentColor="#6b9e6b"
          icon={ShieldAlert}
          isActive={activeSide !== null}
          details={{
            note: 'Pins CHANGE event: "Turned on flag New Checkout on payments-svc".',
          }}
        >
          <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono mt-1">
            <span className="font-medium text-foreground/70">Timeline Entry:</span>{' '}
            <span className="text-foreground/60">
              CHANGE: Flag 'checkout-v2-stripe-elements' enabled 90s before 5xx spike
            </span>
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">
              Recommendation: Revert flag toggle to mitigate customer impact.
            </p>
          </div>
        </ExcalidrawCard>
      </div>
    </ExcalidrawCanvas>
  )
}
