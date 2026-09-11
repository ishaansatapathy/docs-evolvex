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
      title="CI/CD Pipelines & Feature Flags Correlation Flow"
      subtitle="Correlating pipeline test failures and feature flag rollouts with SigNoz error traces"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        activeSide === 'cicd'
          ? 'CI/CD Build Failure Correlated'
          : activeSide === 'flags'
          ? 'Flag Rollout Matched to Spike'
          : ''
      }
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CI/CD Card */}
          <ExcalidrawCard
            id="cicd-hook"
            title="GitHub Actions / GitLab CI"
            subtitle="Integration test failures & retries"
            badge="POST /webhooks/cicd"
            badgeColor="#6366F1"
            accentColor="#6366F1"
            icon={Workflow}
            roughType="box"
            roughColor="#6366F1"
            isActive={activeSide === 'cicd'}
            isSimulated={activeSide === 'cicd'}
            onMouseEnter={() => setActiveSide('cicd')}
            details={{
              endpoint: 'POST /webhooks/cicd',
              credential: 'Header: x-evolvex-cicd-secret',
              protocol: 'Webhook JSON Payload',
              note: 'Pins test failure logs and retry cascades onto the incident timeline.',
            }}
          >
            <div className="p-2 rounded bg-muted/40 border border-border/70 text-xs font-mono text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">Event: </span>
              workflow_job.completed (failure)
              <br />
              <span className="text-foreground font-semibold">Job: </span>
              cypress-e2e-checkout
            </div>
          </ExcalidrawCard>

          {/* Flags Card */}
          <ExcalidrawCard
            id="flags-hook"
            title="LaunchDarkly / Unleash"
            subtitle="Flag toggle: new-checkout (100%)"
            badge="POST /webhooks/feature-flags"
            badgeColor="#F59E0B"
            accentColor="#F59E0B"
            icon={Sliders}
            roughType="box"
            roughColor="#F59E0B"
            isActive={activeSide === 'flags'}
            isSimulated={activeSide === 'flags'}
            onMouseEnter={() => setActiveSide('flags')}
            details={{
              endpoint: 'POST /webhooks/feature-flags',
              credential: 'Header: x-evolvex-flag-secret',
              protocol: 'Webhook JSON Payload',
              note: 'Detects exact second flag was toggled relative to error rate spike.',
            }}
          >
            <div className="p-2 rounded bg-muted/40 border border-border/70 text-xs font-mono text-muted-foreground mt-1">
              <span className="text-foreground font-semibold">Flag: </span>
              checkout-v2-stripe-elements
              <br />
              <span className="text-foreground font-semibold">Action: </span>
              Rollout increased 10% → 100%
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="Multi-Tenant Signal Ingestion"
          sublabel="Org-scoped secret_hash lookup in O(1)"
          color="#00CC66"
          isActive={activeSide !== null}
          length={40}
        />

        {/* Evolvex Incident Card */}
        <ExcalidrawCard
          id="evolvex-changes"
          title="Evolvex Investigation OS"
          subtitle="Change Event Correlation & Evidence Timeline Synthesis"
          badge="Verified Change Cause"
          badgeColor="#00CC66"
          accentColor="#00CC66"
          icon={ShieldAlert}
          roughType="box"
          roughColor="#00CC66"
          isActive={activeSide !== null}
          details={{
            note: 'Automatically pins a CHANGE event to the timeline: "Turned on flag New Checkout on payments-svc".',
          }}
        >
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
            <span className="font-bold text-amber-400">Timeline Entry: </span>
            <span className="text-foreground">
              CHANGE: Flag &apos;checkout-v2-stripe-elements&apos; enabled 90s before 5xx error spike
            </span>
            <p className="text-[11px] text-muted-foreground mt-1">
              Recommendation: Revert flag toggle to mitigate customer impact immediately.
            </p>
          </div>
        </ExcalidrawCard>
      </div>
    </ExcalidrawCanvas>
  )
}
