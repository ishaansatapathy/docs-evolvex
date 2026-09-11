'use client'

import React, { useState } from 'react'
import { GitPullRequest, GitCommit, ShieldAlert, FileCode } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function DeployCorrelationFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [simulating, setSimulating] = useState(false)

  const handleSimulate = () => {
    if (simulating) return
    setSimulating(true)
    setActiveStep(1)
    setTimeout(() => setActiveStep(2), 900)
    setTimeout(() => setActiveStep(3), 1800)
    setTimeout(() => {
      setActiveStep(null)
      setSimulating(false)
    }, 3200)
  }

  return (
    <ExcalidrawCanvas
      title="Git Deploy & Root-Cause Pinpoint"
      subtitle="Correlating commit pushes with incident windows to isolate regressed code lines"
      onSimulate={handleSimulate}
      isSimulating={simulating}
      stepProgress={
        activeStep === 1
          ? 'GitHub Webhook Emitted'
          : activeStep === 2
          ? 'Commit Diff Analyzed'
          : activeStep === 3
          ? 'Pinpoint: src/auth/jwt.ts:42'
          : ''
      }
    >
      <div className="min-w-[840px] flex items-stretch justify-between gap-2 p-1">
        {/* Step 1: GitHub */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              GitHub Push
            </span>
            <StickyNote text="HMAC-SHA256" />
          </div>

          <ExcalidrawCard
            id="gh"
            title="GitHub Repository"
            subtitle="ishaansatapathy/EvolveX"
            stepNumber="01"
            badge="commit 8f92a1"
            badgeColor="#9b7db8"
            accentColor="#9b7db8"
            icon={GitCommit}
            seed={401}
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/github',
              credential: 'X-Hub-Signature-256',
              protocol: 'Webhook JSON',
              note: 'Pushed right before SigNoz alert fired.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60">
              <span className="text-foreground/70 font-medium">Author:</span> ishaan@evolvex.io
              <br />
              <span className="text-foreground/70 font-medium">Msg:</span> "Update JWT expiry validation"
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="Push Webhook"
          sublabel="X-Hub-Signature-256"
          color="#9b7db8"
          isActive={activeStep === 1 || activeStep === 2}
          length={40}
        />

        {/* Step 2: Diff Correlator */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Diff Correlator
            </span>
            <StickyNote text="temporal match" />
          </div>

          <ExcalidrawCard
            id="evolvex-hook"
            title="Webhook Receiver"
            subtitle="Evolvex API Ingestion"
            stepNumber="02"
            badge="Correlator"
            badgeColor="#6b93b8"
            accentColor="#6b93b8"
            icon={GitPullRequest}
            seed={502}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'GitHub GraphQL API v4',
              credential: 'PAT: GITHUB_TOKEN (repo scope)',
              note: 'Inspects AST changes and compares error stack trace frames.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60">
              <span className="text-emerald-500/70">+ 14 lines added</span>
              <br />
              <span className="text-rose-400/70">- 3 lines deleted</span>
              <br />
              <span className="text-foreground/60">File: src/auth/jwt.ts</span>
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="right"
          label="Pinpoint Match"
          sublabel="src/auth/jwt.ts:42"
          color="#6b9e6b"
          isActive={activeStep === 2 || activeStep === 3}
          length={40}
        />

        {/* Step 3: Investigation */}
        <div className="flex-1 min-w-[260px] max-w-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Evidence Timeline
            </span>
            <StickyNote text="verified RCA" />
          </div>

          <ExcalidrawCard
            id="case"
            title="Investigation Case"
            subtitle="Case #INC-8491"
            stepNumber="03"
            badge="Pinpoint Found"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={ShieldAlert}
            seed={603}
            isActive={activeStep === 3}
            isSimulated={activeStep === 3}
            details={{
              note: 'Root cause isolated: Uncaught TypeError in token verification.',
              schema: `// Suspect line identified:
src/auth/jwt.ts:42
- const decoded = jwt.verify(token, secret);
+ const decoded = jwt.verify(token, secret, { complete: true });`,
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono">
              <span className="font-medium text-foreground/70">Root Cause:</span>{' '}
              <span className="text-foreground/60">src/auth/jwt.ts:42</span>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                Triggered 5xx spike immediately after deployment.
              </p>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
