'use client'

import React, { useState } from 'react'
import {
  Flame,
  GitPullRequest,
  Box,
  Cpu,
  Sliders,
  Workflow,
  ShieldCheck,
  Database,
  Laptop,
  Lock,
  Layers,
  Zap,
} from 'lucide-react'
import {
  ExcalidrawCanvas,
  ExcalidrawCard,
  HandDrawnArrow,
  StickyNote,
} from './shared-excalidraw'

const INGESTION_SOURCES = [
  {
    id: 'signoz',
    title: 'SigNoz Telemetry',
    subtitle: 'Alerts, traces & logs',
    icon: Flame,
    color: '#F43F5E',
    badge: 'Query API v5',
    endpoint: 'POST /webhooks/signoz',
    auth: 'Basic Auth (Webhook Password)',
    desc: 'Alert notifications and live ClickHouse trace waterfall queries.',
  },
  {
    id: 'github',
    title: 'GitHub Deployments',
    subtitle: 'Commits, PRs & pushes',
    icon: GitPullRequest,
    color: '#A855F7',
    badge: 'HMAC-SHA256',
    endpoint: 'POST /webhooks/github',
    auth: 'X-Hub-Signature-256',
    desc: 'Commit diff inspection and line-by-line attribution of regressions.',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Events',
    subtitle: 'Pod & container life-cycles',
    icon: Box,
    color: '#38BDF8',
    badge: 'Informer Daemon',
    endpoint: 'DaemonSet Agent',
    auth: 'ClusterRole / Token',
    desc: 'OOMKilled events, CrashLoopBackOff states, and ReplicaSet rollouts.',
  },
  {
    id: 'ebpf',
    title: 'eBPF OBI Probes',
    subtitle: 'Kernel socket diagnostics',
    icon: Cpu,
    color: '#00CC66',
    badge: 'Kernel RingBuffer',
    endpoint: 'obi_stat_tcp_rtt',
    auth: 'eBPF BPF_PROG_TYPE_TRACEPOINT',
    desc: 'Captures TCP drops (kfree_skb) and network congestion in kernel space.',
  },
  {
    id: 'flags',
    title: 'Feature Flags',
    subtitle: 'Toggles & rollouts',
    icon: Sliders,
    color: '#F59E0B',
    badge: 'Event Webhook',
    endpoint: 'POST /webhooks/flags',
    auth: 'Bearer / Webhook Secret',
    desc: 'LaunchDarkly and Flagsmith toggle events matched to error spikes.',
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipelines',
    subtitle: 'Actions & pipeline runs',
    icon: Workflow,
    color: '#6366F1',
    badge: 'Pipeline Sync',
    endpoint: 'POST /webhooks/ci',
    auth: 'Token Auth',
    desc: 'Build triggers, image tags, and deploy pipeline lifecycle markers.',
  },
]

export function ArchitectureFlow() {
  const [selectedSource, setSelectedSource] = useState<string>('signoz')
  const [isSimulating, setIsSimulating] = useState(false)
  const [simStep, setSimStep] = useState<number | null>(null)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setSimStep(1)
    setTimeout(() => setSimStep(2), 1000)
    setTimeout(() => setSimStep(3), 2000)
    setTimeout(() => setSimStep(4), 3000)
    setTimeout(() => {
      setIsSimulating(false)
      setSimStep(null)
    }, 4500)
  }

  const activeSrc = INGESTION_SOURCES.find((s) => s.id === selectedSource) || INGESTION_SOURCES[0]

  return (
    <ExcalidrawCanvas
      title="Evolvex System Architecture & Multi-Source Ingestion"
      subtitle="Hover any ingestion source or core tier to inspect internal architecture and security boundaries"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        simStep === 1
          ? 'Multivariate Ingestion'
          : simStep === 2
          ? 'API Vault & Queue Processing'
          : simStep === 3
          ? 'PostgreSQL Temporal Indexing'
          : simStep === 4
          ? 'Live Web Console Synthesis'
          : ''
      }
    >
      <div className="flex flex-col items-center min-w-[860px] max-w-5xl mx-auto space-y-4 p-1">
        {/* ================= TOP ROW: 6 MULTI-SIGNAL INGESTION SOURCES ================= */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Ingestion Data Plane • 6 Correlated Telemetry Streams
            </span>
            <StickyNote text="Raw Ingestion Plane · Zero Data Alteration" color="#00CC66" rotation={-1} />
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            {INGESTION_SOURCES.map((source) => {
              const Icon = source.icon
              const isSelected = selectedSource === source.id
              const isSimulated = simStep === 1 && isSelected

              return (
                <div
                  key={source.id}
                  onMouseEnter={() => setSelectedSource(source.id)}
                  className={`group p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected || isSimulated
                      ? 'bg-card border-transparent shadow-md scale-[1.02] -translate-y-1'
                      : 'bg-card/70 border-border/70 dark:border-white/10 hover:border-border hover:bg-card/90'
                  }`}
                  style={{
                    boxShadow: isSelected || isSimulated
                      ? `0 8px 24px -6px ${source.color}35, 0 0 0 1.5px ${source.color}`
                      : undefined,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold"
                        style={{
                          backgroundColor: `${source.color}20`,
                          color: source.color,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className="text-[9px] font-mono px-1 py-0.5 rounded border"
                        style={{
                          color: source.color,
                          borderColor: `${source.color}40`,
                          backgroundColor: `${source.color}10`,
                        }}
                      >
                        {source.badge}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-foreground tracking-tight line-clamp-1">
                      {source.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5 line-clamp-1">
                      {source.subtitle}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-border/50 text-[10px] text-muted-foreground line-clamp-2">
                    {source.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dynamic Connector Down */}
        <HandDrawnArrow
          direction="down"
          label={`Inbound Ingestion: ${activeSrc.title}`}
          sublabel={`Routed via ${activeSrc.endpoint} (${activeSrc.auth})`}
          color={activeSrc.color}
          isActive={true}
          length={44}
        />

        {/* ================= TIER 1: EVOLVEX API & MULTI-TENANT VAULT ================= */}
        <div className="w-full">
          <ExcalidrawCard
            id="api"
            title="Evolvex API (Express + tRPC + REST)"
            subtitle="Multi-Tenant Vault, Secret-Hash Routing & Worker Dispatch"
            stepNumber="01"
            badge="AES-256-GCM Vault"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={ShieldCheck}
            roughType="highlight"
            roughColor="#00CC66"
            seed={811}
            isActive={simStep === 2}
            isSimulated={simStep === 2}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/*',
              credential: 'Hashed tenant credentials (O(1) lookup via indexed secret_hash)',
              protocol: 'tRPC for UI + REST endpoints for automated webhooks',
              note: 'Zero plaintext credentials. All SigNoz API keys encrypted with org-scoped KMS keys.',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
              <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                <span className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Tenant Credential Vault
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Org-scoped AES-256-GCM encryption for SigNoz API keys, GitHub PATs, and webhook secrets.
                </p>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                <span className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  O(1) Webhook Resolution
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Inbound alerts match workspace instantly using SHA-256 indexed hash with zero cross-tenant leakage.
                </p>
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                <span className="font-mono text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Correlation Workers
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Background worker pipeline queries SigNoz ClickHouse traces, git commits, and eBPF socket events.
                </p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-emerald-400">
              ⤹ decrypts workspace secrets in-memory only
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector API -> Database */}
        <HandDrawnArrow
          direction="down"
          label="Immutable Evidence Persistence"
          sublabel="Relational Temporal Graphs & Pipeline Cache"
          color="#38BDF8"
          isActive={simStep === 2 || simStep === 3}
          length={40}
        />

        {/* ================= TIER 2: POSTGRESQL DATABASE ================= */}
        <div className="w-full">
          <ExcalidrawCard
            id="database"
            title="PostgreSQL (Investigation Database)"
            subtitle="Immutable Audit Log, Temporal Evidence & Incident Knowledge Base"
            stepNumber="02"
            badge="Relational Schema"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={Database}
            roughType="highlight"
            roughColor="#38BDF8"
            seed={822}
            isActive={simStep === 3}
            isSimulated={simStep === 3}
            details={{
              protocol: 'PostgreSQL 16 Connection Pool (pgpool)',
              credential: 'SSL Required (sslmode=verify-full)',
              note: 'Stores relational evidence, timeline entries, change events, and incident state machines.',
            }}
          >
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {[
                'organizations',
                'investigations',
                'timeline_entries',
                'change_events',
                'runtime_signals',
                'services',
                'evidence',
                'investigation_pipeline_cache',
              ].map((table) => (
                <span
                  key={table}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/60 hover:text-foreground transition-colors"
                >
                  {table}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Provides immutable snapshot tracking for incident reviews, SLA calculations, and audit postmortems.
            </p>
            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-sky-400">
              ⤷ temporal relational integrity
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector Database -> React UI */}
        <HandDrawnArrow
          direction="down"
          label="tRPC Realtime Subscriptions & Server Components"
          sublabel="Sub-second UI hydration with live incident updates"
          color="#A855F7"
          isActive={simStep === 3 || simStep === 4}
          length={40}
        />

        {/* ================= TIER 3: REACT CONSOLE ================= */}
        <div className="w-full">
          <ExcalidrawCard
            id="console"
            title="React UI Console (Next.js Application)"
            subtitle="Investigations, Dynamic Service Topology & Interactive Trace Explorer"
            stepNumber="03"
            badge="Customer Console"
            badgeColor="#A855F7"
            accentColor="#A855F7"
            icon={Laptop}
            roughType="highlight"
            roughColor="#A855F7"
            seed={833}
            isActive={simStep === 4}
            isSimulated={simStep === 4}
            details={{
              endpoint: 'https://evolvex.ishaandev.co.in/investigations',
              protocol: 'Next.js App Router + Tailwind CSS + Lucide Icons',
              note: 'Interactive timeline rendering, eBPF drop heatmaps, and one-click rollback diffs.',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
              <div className="p-2 rounded bg-muted/40 border border-border/60 font-mono">
                <span className="font-semibold text-foreground">Timeline View</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Chronological evidence</p>
              </div>
              <div className="p-2 rounded bg-muted/40 border border-border/60 font-mono">
                <span className="font-semibold text-foreground">Service Map</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Distributed graph</p>
              </div>
              <div className="p-2 rounded bg-muted/40 border border-border/60 font-mono">
                <span className="font-semibold text-foreground">Trace Explorer</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">ClickHouse spans</p>
              </div>
              <div className="p-2 rounded bg-muted/40 border border-border/60 font-mono">
                <span className="font-semibold text-foreground">Settings Vault</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Encrypted keys</p>
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-border/60 font-handwriting text-xs text-purple-400">
              ✓ realtime updates via websocket & tRPC
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
