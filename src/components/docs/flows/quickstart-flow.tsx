'use client'

import React, { useState } from 'react'
import {
  Server,
  Flame,
  ShieldAlert,
  Database,
  GitPullRequest,
  Bell,
  Code2,
  Activity,
  Layers,
  Cpu,
  Radio,
  ExternalLink,
} from 'lucide-react'
import {
  ExcalidrawCanvas,
  ExcalidrawCard,
  HandDrawnArrow,
  StickyNote,
} from './shared-excalidraw'

export function QuickstartFlow() {
  const [activeCard, setActiveCard] = useState<string | null>('evolvex')
  const [simulatingStep, setSimulatingStep] = useState<number | null>(null)

  const handleSimulate = () => {
    if (simulatingStep !== null) return
    setSimulatingStep(1)
    setTimeout(() => setSimulatingStep(2), 900)
    setTimeout(() => setSimulatingStep(3), 1800)
    setTimeout(() => setSimulatingStep(4), 2700)
    setTimeout(() => setSimulatingStep(null), 4200)
  }

  const getStepProgressLabel = () => {
    switch (simulatingStep) {
      case 1:
        return 'OTLP Telemetry Sent'
      case 2:
        return 'SigNoz Alert Fired'
      case 3:
        return 'Timeline Synthesized'
      case 4:
        return 'RCA Pinpointed'
      default:
        return ''
    }
  }

  return (
    <ExcalidrawCanvas
      title="Telemetry & Alert Investigation Flow"
      subtitle="Hover components to inspect paths, or simulate the full signal flow"
      onSimulate={handleSimulate}
      isSimulating={simulatingStep !== null}
      stepProgress={getStepProgressLabel()}
    >
      <div className="flex flex-col items-center min-w-[700px] max-w-3xl mx-auto">
        {/* TIER 1: APPLICATION */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Ingestion Source
            </span>
            <StickyNote text="Node.js · Python · Go · Java · Rust" />
          </div>

          <ExcalidrawCard
            id="app"
            title="Your Application"
            subtitle="OpenTelemetry SDK → OTLP Export"
            stepNumber="01"
            badge="OTLP :4318"
            badgeColor="#6b93b8"
            accentColor="#6b93b8"
            roughType="underline"
            icon={Cpu}
            seed={111}
            isActive={activeCard === 'app'}
            isSimulated={simulatingStep === 1}
            onMouseEnter={() => setActiveCard('app')}
            details={{
              endpoint: 'https://ingest.{region}.signoz.cloud:443/v1/traces',
              credential: 'Header: signoz-ingestion-key',
              protocol: 'OTLP / HTTP or gRPC (:4317)',
              note: 'Auto-instruments HTTP, DB, and outbound RPC spans.',
              schema: `{
  "resourceSpans": [{
    "resource": {
      "attributes": [
        { "key": "service.name", "value": { "stringValue": "payment-api" } },
        { "key": "deployment.environment", "value": { "stringValue": "production" } }
      ]
    }
  }]
}`,
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/40 text-foreground/70 border border-border/40">
                @opentelemetry/sdk-node
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/40 text-foreground/70 border border-border/40">
                HTTP / gRPC Exporter
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/60">
              Your service emits traces, logs, and metrics directly to SigNoz.
            </p>
          </ExcalidrawCard>
        </div>

        {/* Arrow 1→2 */}
        <HandDrawnArrow
          direction="down"
          label="OTLP Telemetry"
          sublabel="traces, logs, metrics"
          color="#6b93b8"
          isActive={activeCard === 'app' || simulatingStep === 1 || simulatingStep === 2}
          length={38}
        />

        {/* TIER 2: SIGNOZ */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Telemetry Store & Alerting
            </span>
            <StickyNote text="ClickHouse OLAP" color="#c2716b" />
          </div>

          <ExcalidrawCard
            id="signoz"
            title="SigNoz"
            subtitle="Alert Rules Engine → Webhook Dispatch"
            stepNumber="02"
            badge="Alert Triggered"
            badgeColor="#c2716b"
            accentColor="#c2716b"
            roughType="box"
            icon={Flame}
            seed={222}
            isActive={activeCard === 'signoz'}
            isSimulated={simulatingStep === 2}
            onMouseEnter={() => setActiveCard('signoz')}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/signoz',
              credential: 'Basic Auth (Webhook Password)',
              protocol: 'HTTPS Webhook',
              note: 'Fires when P99 latency > 800ms or 5xx rate spikes.',
              schema: `{
  "receiver": "evolvex-webhook",
  "status": "firing",
  "alerts": [{
    "labels": {
      "alertname": "PaymentHighErrorRate",
      "service_name": "payment-api",
      "severity": "critical"
    }
  }]
}`,
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/40 text-foreground/70 border border-border/40">
                5xx Spikes & Latency Rules
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted/40 text-foreground/70 border border-border/40">
                Webhook + Basic Auth
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/60">
              Evaluates metric thresholds, then delivers a webhook payload to Evolvex with basic auth.
            </p>
          </ExcalidrawCard>
        </div>

        {/* Arrow 2→3 */}
        <HandDrawnArrow
          direction="down"
          label="POST /webhooks/signoz"
          sublabel="basic auth"
          color="#c2716b"
          isActive={activeCard === 'signoz' || simulatingStep === 2 || simulatingStep === 3}
          length={38}
        />

        {/* TIER 3: EVOLVEX */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Investigation Engine
            </span>
            <StickyNote text="O(1) ingestion · multi-tenant" color="#6b9e6b" />
          </div>

          <ExcalidrawCard
            id="evolvex"
            title="Evolvex"
            subtitle="Root-Cause Synthesis & Temporal Correlation"
            stepNumber="03"
            badge="Incident Case"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            roughType="circle"
            icon={ShieldAlert}
            seed={333}
            isActive={activeCard === 'evolvex'}
            isSimulated={simulatingStep === 3}
            onMouseEnter={() => setActiveCard('evolvex')}
            details={{
              endpoint: 'https://evolvex-api.ishaandev.co.in/api/v1/investigations',
              credential: 'SigNoz Query API Key (AES-256-GCM Vault)',
              protocol: 'tRPC + Express + PostgreSQL',
              note: 'Creates incident case in <120s, isolates tenant by hashed webhook secret.',
              schema: `{
  "incidentId": "inc_98f420a",
  "status": "ANALYZING",
  "correlation": {
    "tracesAnalyzed": 1420,
    "errorSpans": 87,
    "ebpfSocketDrops": 14,
    "gitDeployMatch": "commit 8ab39f"
  }
}`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 mt-2">
              <div className="p-2 rounded-md bg-muted/25 border border-border/40 text-[11px]">
                <span className="font-mono font-medium text-foreground/80 flex items-center gap-1">
                  <Activity className="w-3 h-3 opacity-60" />
                  Span Correlator
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Aggregates p99 trace waterfalls & error exceptions.
                </p>
              </div>
              <div className="p-2 rounded-md bg-muted/25 border border-border/40 text-[11px]">
                <span className="font-mono font-medium text-foreground/80 flex items-center gap-1">
                  <Radio className="w-3 h-3 opacity-60" />
                  eBPF OBI Probes
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Pinpoints kernel socket drops (kfree_skb).
                </p>
              </div>
              <div className="p-2 rounded-md bg-muted/25 border border-border/40 text-[11px]">
                <span className="font-mono font-medium text-foreground/80 flex items-center gap-1">
                  <GitPullRequest className="w-3 h-3 opacity-60" />
                  Deploy Diffs
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Matches error stacks to commit diffs.
                </p>
              </div>
            </div>
          </ExcalidrawCard>
        </div>

        {/* Arrow 3→4 */}
        <HandDrawnArrow
          direction="down"
          label="Root Cause & Fan-Out"
          sublabel="evidence dispatch"
          color="#6b9e6b"
          isActive={activeCard === 'evolvex' || simulatingStep === 3 || simulatingStep === 4}
          length={38}
        />

        {/* TIER 4: DOWNSTREAM TARGETS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <ExcalidrawCard
            id="signoz-api"
            title="SigNoz Query API"
            subtitle="ClickHouse Trace/Log RCA"
            badge="API_KEY"
            badgeColor="#6b93b8"
            accentColor="#6b93b8"
            roughType="underline"
            icon={Database}
            seed={444}
            isActive={activeCard === 'signoz-api'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('signoz-api')}
            details={{
              protocol: 'Query API v5',
              credential: 'Editor or Admin role key',
              note: 'Queries real ClickHouse spans.',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60">
              Inspects full trace waterfalls, span tags, and correlated logs to confirm causal chains.
            </p>
          </ExcalidrawCard>

          <ExcalidrawCard
            id="github-api"
            title="GitHub Deploy API"
            subtitle="Diffs & Line Pinpoint"
            badge="GITHUB_TOKEN"
            badgeColor="#9b7db8"
            accentColor="#9b7db8"
            roughType="underline"
            icon={GitPullRequest}
            seed={555}
            isActive={activeCard === 'github-api'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('github-api')}
            details={{
              protocol: 'GitHub REST / GraphQL v4',
              credential: 'PAT with repo scope',
              note: 'Pinpoints suspect code line.',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60">
              Correlates recent PRs and commit diffs pushed before the anomaly started.
            </p>
          </ExcalidrawCard>

          <ExcalidrawCard
            id="slack-jira"
            title="Slack / Jira / K8s"
            subtitle="Tickets & Rollouts"
            badge="Automated RCA"
            badgeColor="#b89b6b"
            accentColor="#b89b6b"
            roughType="underline"
            icon={Bell}
            seed={666}
            isActive={activeCard === 'slack-jira'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('slack-jira')}
            details={{
              protocol: 'Slack Webhook / Jira REST',
              credential: 'OAuth App or Webhook URL',
              note: 'Publishes RCA summary & rollback suggestions.',
            }}
          >
            <p className="text-[11px] text-muted-foreground/60">
              Delivers instant incident summaries and suggests rollback or hotfix PRs.
            </p>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
