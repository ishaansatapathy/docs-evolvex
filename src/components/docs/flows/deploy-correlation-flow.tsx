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
      title="Git Deploy & Root-Cause Pinpoint Flow"
      subtitle="Correlating commit pushes with incident windows to isolate regressed lines in code"
      onSimulate={handleSimulate}
      isSimulating={simulating}
      stepProgress={
        activeStep === 1
          ? 'GitHub Webhook Emitted'
          : activeStep === 2
          ? 'Evolvex Commit Diff Analyzed'
          : activeStep === 3
          ? 'Pinpoint: src/auth/jwt.ts:42'
          : ''
      }
    >
      <div className="min-w-[920px] flex items-stretch justify-between gap-2 p-1">
        {/* Step 1: GitHub Repo */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              GitHub Push
            </span>
            <StickyNote text="HMAC-SHA256" color="#A855F7" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="gh"
            title="GitHub Repository"
            subtitle="ishaansatapathy/EvolveX"
            stepNumber="01"
            badge="commit 8f92a1"
            badgeColor="#A855F7"
            accentColor="#A855F7"
            icon={GitCommit}
            roughType="highlight"
            roughColor="#A855F7"
            seed={401}
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/github',
              credential: 'Header: X-Hub-Signature-256',
              protocol: 'Webhook JSON Payload',
              note: 'Pushed right before SigNoz alert fired.',
            }}
          >
            <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">Author: </span>
              ishaan@evolvex.io
              <br />
              <span className="text-foreground font-semibold">Msg: </span>
              &ldquo;Update JWT expiry validation&rdquo;
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-purple-400">
              ⤹ triggers push webhook payload
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 1 -> 2 */}
        <HandDrawnArrow
          direction="right"
          label="Push Webhook"
          sublabel="X-Hub-Signature-256"
          color="#A855F7"
          isActive={activeStep === 1 || activeStep === 2}
          length={44}
        />

        {/* Step 2: Evolvex Webhook API */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Diff Correlator
            </span>
            <StickyNote text="Temporal Match" color="#38BDF8" rotation={1.5} />
          </div>

          <ExcalidrawCard
            id="evolvex-hook"
            title="Webhook Receiver"
            subtitle="Evolvex API Ingestion"
            stepNumber="02"
            badge="Auto-Correlator"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={GitPullRequest}
            roughType="highlight"
            roughColor="#38BDF8"
            seed={502}
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'GitHub GraphQL API v4 Diff Fetch',
              credential: 'PAT: GITHUB_TOKEN (repo scope)',
              note: 'Inspects AST changes and compares error stack trace frames.',
            }}
          >
            <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs font-mono text-muted-foreground">
              <span className="text-emerald-400">+ 14 lines added</span>
              <br />
              <span className="text-rose-400">- 3 lines deleted</span>
              <br />
              <span className="text-sky-400">File: src/auth/jwt.ts</span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-sky-400">
              ⤷ matches error stack frames
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 2 -> 3 */}
        <HandDrawnArrow
          direction="right"
          label="Pinpoint Match"
          sublabel="src/auth/jwt.ts:42"
          color="#00CC66"
          isActive={activeStep === 2 || activeStep === 3}
          length={44}
        />

        {/* Step 3: Investigation Case */}
        <div className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Evidence Timeline
            </span>
            <StickyNote text="Verified RCA" color="#00CC66" rotation={-1} />
          </div>

          <ExcalidrawCard
            id="case"
            title="Investigation Case"
            subtitle="Case #INC-8491"
            stepNumber="03"
            badge="Pinpoint Found"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="highlight"
            roughColor="#00CC66"
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
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-xs font-mono">
              <span className="font-bold text-rose-400">Root Cause: </span>
              <span className="text-foreground">src/auth/jwt.ts:42</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Triggered 5xx spike immediately after deployment.
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ✓ line-by-line attribution
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
