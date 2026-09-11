'use client'

import React, { useState } from 'react'
import { GitPullRequest, GitCommit, ShieldAlert, ArrowRight, CheckCircle2, FileCode, Flame } from 'lucide-react'
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        {/* Step 1: GitHub Repo */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              01 • GitHub Push
            </span>
            <StickyNote text="HMAC-SHA256" color="#A855F7" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="gh"
            title="GitHub Repository"
            subtitle="ishaansatapathy/EvolveX"
            badge="commit 8f92a1"
            badgeColor="#A855F7"
            accentColor="#A855F7"
            icon={GitCommit}
            roughType="box"
            roughColor="#A855F7"
            isActive={activeStep === 1}
            isSimulated={activeStep === 1}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/github',
              credential: 'Header: X-Hub-Signature-256',
              protocol: 'Webhook JSON Payload',
              note: 'Pushed right before SigNoz alert fired.',
            }}
          >
            <div className="p-2 rounded bg-muted/50 border border-border/70 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold">Author: </span>
              ishaan@evolvex.io
              <br />
              <span className="text-foreground font-semibold">Msg: </span>
              &ldquo;Update JWT expiry validation&rdquo;
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 1 -> 2 */}
        <HandDrawnArrow
          direction="down"
          label="Push Webhook"
          sublabel="X-Hub-Signature-256"
          color="#A855F7"
          isActive={activeStep === 1 || activeStep === 2}
          length={36}
        />

        {/* Step 2: Evolvex Webhook API */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              02 • Diff Correlator
            </span>
            <StickyNote text="Temporal Match" color="#38BDF8" rotation={1} />
          </div>

          <ExcalidrawCard
            id="evolvex-hook"
            title="POST /webhooks/github"
            subtitle="Evolvex API Ingestion"
            badge="Auto-Correlator"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={GitPullRequest}
            roughType="box"
            roughColor="#38BDF8"
            isActive={activeStep === 2}
            isSimulated={activeStep === 2}
            details={{
              protocol: 'GitHub GraphQL API v4 Diff Fetch',
              credential: 'PAT: GITHUB_TOKEN (repo scope)',
              note: 'Inspects AST changes and compares error stack trace frames.',
            }}
          >
            <div className="p-2 rounded bg-muted/50 border border-border/70 text-xs font-mono text-muted-foreground">
              <span className="text-emerald-400">+ 14 lines added</span>
              <br />
              <span className="text-rose-400">- 3 lines deleted</span>
              <br />
              <span className="text-sky-400">File: src/auth/jwt.ts</span>
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 2 -> 3 */}
        <HandDrawnArrow
          direction="down"
          label="Pinpoint Match"
          sublabel="Matches stack trace: src/auth/jwt.ts:42"
          color="#00CC66"
          isActive={activeStep === 2 || activeStep === 3}
          length={36}
        />

        {/* Step 3: Investigation Case */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              03 • Evidence Timeline
            </span>
            <StickyNote text="Verified RCA" color="#00CC66" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="case"
            title="Investigation Case"
            subtitle="Case #INC-8491"
            badge="Pinpoint Found"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="box"
            roughColor="#00CC66"
            isActive={activeStep === 3}
            isSimulated={activeStep === 3}
            details={{
              note: 'Root cause isolated: Uncaught TypeError in token verification.',
              schema: `// Suspect line identified:
src/auth/jwt.ts:42
- const decoded = jwt.verify(token, secret);
+ const decoded = jwt.verify(token, secret, { complete: true });
// Fix suggested: Access decoded.payload instead of decoded`,
            }}
          >
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-xs font-mono">
              <span className="font-bold text-rose-400">Root Cause: </span>
              <span className="text-foreground">src/auth/jwt.ts:42</span>
              <p className="text-[11px] text-muted-foreground mt-1">
                Triggered 5xx spike immediately after deployment.
              </p>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
