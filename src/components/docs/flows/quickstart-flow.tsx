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
        return 'App OTLP Telemetry Sent'
      case 2:
        return 'SigNoz Alert Fired'
      case 3:
        return 'Evolvex Timeline Synthesized'
      case 4:
        return 'Downstream RCA Pinpointed'
      default:
        return ''
    }
  }

  return (
    <ExcalidrawCanvas
      title="Autonomous Telemetry & Alert Investigation Flow"
      subtitle="Click 'Simulate Signal Flow' or hover individual components to inspect telemetry paths"
      onSimulate={handleSimulate}
      isSimulating={simulatingStep !== null}
      stepProgress={getStepProgressLabel()}
    >
      <div className="flex flex-col items-center min-w-[780px] max-w-4xl mx-auto">
        {/* ================= TIER 1: APPLICATION RUNTIME ================= */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              Ingestion Source
            </span>
            <StickyNote text="Node.js · Python · Go · Java · Rust" color="#38BDF8" rotation={1} />
          </div>

          <ExcalidrawCard
            id="app"
            title="Your Application Runtime"
            subtitle="OpenTelemetry SDK & OTLP Exporter"
            stepNumber="01"
            badge="OTLP / Port 4318"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={Cpu}
            roughType="highlight"
            roughColor="#38BDF8"
            seed={111}
            isActive={activeCard === 'app'}
            isSimulated={simulatingStep === 1}
            onMouseEnter={() => setActiveCard('app')}
            details={{
              endpoint: 'https://ingest.{region}.signoz.cloud:443/v1/traces',
              credential: 'Header: signoz-ingestion-key',
              protocol: 'OTLP / HTTP or OTLP / gRPC (:4317)',
              note: 'Zero code rewrite — auto-instruments HTTP, DB, and outbound RPC spans.',
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
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/70 text-foreground border border-border/80">
                @opentelemetry/sdk-node
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/70 text-foreground border border-border/80">
                HTTP / gRPC Exporter
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                SIGNOZ_INGESTION_KEY
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your service emits traces, error logs, and metrics directly to SigNoz without passing through any third-party proxy.
            </p>
            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-sky-400">
              ⤹ direct OTLP stream to SigNoz collector
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector 1 -> 2 */}
        <HandDrawnArrow
          direction="down"
          label="OTLP Telemetry Export"
          sublabel="Traces, Logs, Metrics over HTTP/gRPC"
          color="#38BDF8"
          isActive={activeCard === 'app' || simulatingStep === 1 || simulatingStep === 2}
          length={44}
        />

        {/* ================= TIER 2: SIGNOZ PLATFORM ================= */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Telemetry Store & Alerting
            </span>
            <StickyNote text="ClickHouse OLAP Storage" color="#F43F5E" rotation={-1.5} />
          </div>

          <ExcalidrawCard
            id="signoz"
            title="SigNoz Cloud / Self-Hosted"
            subtitle="Alert Rules Engine & Notification Channels"
            stepNumber="02"
            badge="Alert Triggered"
            badgeColor="#F43F5E"
            accentColor="#F43F5E"
            icon={Flame}
            roughType="highlight"
            roughColor="#F43F5E"
            seed={222}
            isActive={activeCard === 'signoz'}
            isSimulated={simulatingStep === 2}
            onMouseEnter={() => setActiveCard('signoz')}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/signoz',
              credential: 'Basic Auth (User: tenant_id, Pass: Webhook Password)',
              protocol: 'HTTPS Webhook Notification',
              note: 'Fires instantly when P99 latency > 800ms or 5xx error rate spikes.',
              schema: `{
  "receiver": "evolvex-webhook",
  "status": "firing",
  "alerts": [{
    "labels": {
      "alertname": "PaymentHighErrorRate",
      "service_name": "payment-api",
      "severity": "critical"
    },
    "annotations": { "summary": "5xx rate exceeded 3% threshold" }
  }]
}`,
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/70 text-foreground border border-border/80">
                Rule: 5xx Spikes & Latency Anomaly
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Webhook + Basic Auth
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-muted/70 text-foreground border border-border/80">
                ClickHouse Query API v5
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Evaluates metric thresholds continuously. When an incident fires, the notification channel delivers a webhook payload to Evolvex with basic authentication.
            </p>
            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-rose-400">
              ⤷ evaluates rules in ClickHouse every 60s
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector 2 -> 3 */}
        <HandDrawnArrow
          direction="down"
          label="POST /webhooks/signoz"
          sublabel="Basic Auth with Webhook Password"
          color="#F43F5E"
          isActive={activeCard === 'signoz' || simulatingStep === 2 || simulatingStep === 3}
          length={44}
        />

        {/* ================= TIER 3: EVOLVEX INVESTIGATION OS ================= */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Autonomous Investigation Engine
            </span>
            <StickyNote text="O(1) Ingestion · Multi-Tenant Vault" color="#00CC66" rotation={1.5} />
          </div>

          <ExcalidrawCard
            id="evolvex"
            title="Evolvex Investigation OS"
            subtitle="Autonomous Root-Cause Synthesis & Temporal Correlation"
            stepNumber="03"
            badge="Live Incident Case"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldAlert}
            roughType="highlight"
            roughColor="#00CC66"
            seed={333}
            isActive={activeCard === 'evolvex'}
            isSimulated={simulatingStep === 3}
            onMouseEnter={() => setActiveCard('evolvex')}
            details={{
              endpoint: 'https://evolvex-api.ishaandev.co.in/api/v1/investigations',
              credential: 'SigNoz Query API Key (Stored in AES-256-GCM Vault)',
              protocol: 'tRPC + Express + PostgreSQL Relational Engine',
              note: 'Creates incident case in <120s and isolates tenant by hashed webhook secret.',
              schema: `{
  "incidentId": "inc_98f420a",
  "status": "ANALYZING",
  "correlation": {
    "tracesAnalyzed": 1420,
    "errorSpans": 87,
    "ebpfSocketDrops": 14,
    "gitDeployMatch": "commit 8ab39f: Add stripe payment idempotency"
  }
}`,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Span Correlator
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Aggregates p99 trace waterfalls & error exceptions.
                </p>
              </div>
              <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                  eBPF OBI Probes
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Pinpoints kernel socket drops (kfree_skb).
                </p>
              </div>
              <div className="p-2 rounded bg-muted/50 border border-border/80 text-xs">
                <span className="font-mono font-semibold text-foreground flex items-center gap-1">
                  <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
                  Deploy Diffs
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Matches error stack traces to commit diffs.
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ✓ correlates traces, kernel drops, and git commits into verified timeline
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector 3 -> Downstream */}
        <HandDrawnArrow
          direction="down"
          label="Root Cause Pinpoint & Fan-Out"
          sublabel="Automated Remediation & Evidence Dispatch"
          color="#00CC66"
          isActive={activeCard === 'evolvex' || simulatingStep === 3 || simulatingStep === 4}
          length={44}
        />

        {/* ================= TIER 4: DOWNSTREAM ACTION TARGETS ================= */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Target A */}
          <ExcalidrawCard
            id="signoz-api"
            title="SigNoz Query API"
            subtitle="ClickHouse Trace/Log RCA"
            badge="SIGNOZ_API_KEY"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={Database}
            roughType="underline"
            roughColor="#38BDF8"
            seed={444}
            isActive={activeCard === 'signoz-api'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('signoz-api')}
            details={{
              protocol: 'Query API v5',
              credential: 'Editor or Admin role key',
              note: 'Zero fake data: Queries real ClickHouse spans directly.',
            }}
          >
            <p className="text-xs text-muted-foreground">
              Evolvex inspects full trace waterfalls, span tags, and correlated application logs to confirm causal chains.
            </p>
          </ExcalidrawCard>

          {/* Target B */}
          <ExcalidrawCard
            id="github-api"
            title="GitHub Deploy API"
            subtitle="Diffs & Line Pinpoint"
            badge="GITHUB_TOKEN"
            badgeColor="#A855F7"
            accentColor="#A855F7"
            icon={GitPullRequest}
            roughType="underline"
            roughColor="#A855F7"
            seed={555}
            isActive={activeCard === 'github-api'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('github-api')}
            details={{
              protocol: 'GitHub REST / GraphQL v4',
              credential: 'PAT / Classic token with repo scope',
              note: 'Pinpoints suspect code line (e.g. src/auth.ts:42).',
            }}
          >
            <p className="text-xs text-muted-foreground">
              Correlates recent pull requests and commit diffs pushed right before the latency anomaly started.
            </p>
          </ExcalidrawCard>

          {/* Target C */}
          <ExcalidrawCard
            id="slack-jira"
            title="Slack / Jira / K8s"
            subtitle="Tickets & Rollouts"
            badge="Automated RCA"
            badgeColor="#F59E0B"
            accentColor="#F59E0B"
            icon={Bell}
            roughType="underline"
            roughColor="#F59E0B"
            seed={666}
            isActive={activeCard === 'slack-jira'}
            isSimulated={simulatingStep === 4}
            onMouseEnter={() => setActiveCard('slack-jira')}
            details={{
              protocol: 'Slack Webhook / Jira REST API',
              credential: 'OAuth App or Webhook URL',
              note: 'Publishes root-cause summary, logs snippet, and roll-back suggestions.',
            }}
          >
            <p className="text-xs text-muted-foreground">
              Delivers instant incident summaries to your on-call channel and suggests rollback or hotfix PRs.
            </p>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
