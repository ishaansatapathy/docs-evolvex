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
    color: '#c2716b',
    badge: 'Query API v5',
    endpoint: 'POST /webhooks/signoz',
    auth: 'Basic Auth',
    desc: 'Alert notifications and live ClickHouse trace waterfall queries.',
  },
  {
    id: 'github',
    title: 'GitHub Deployments',
    subtitle: 'Commits, PRs & pushes',
    icon: GitPullRequest,
    color: '#9b7db8',
    badge: 'HMAC-SHA256',
    endpoint: 'POST /webhooks/github',
    auth: 'X-Hub-Signature',
    desc: 'Commit diff inspection and line-by-line attribution of regressions.',
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Events',
    subtitle: 'Pod & container cycles',
    icon: Box,
    color: '#6b93b8',
    badge: 'Informer',
    endpoint: 'DaemonSet Agent',
    auth: 'ClusterRole',
    desc: 'OOMKilled events, CrashLoopBackOff states, and rollouts.',
  },
  {
    id: 'ebpf',
    title: 'eBPF OBI Probes',
    subtitle: 'Kernel diagnostics',
    icon: Cpu,
    color: '#6b9e6b',
    badge: 'RingBuffer',
    endpoint: 'obi_stat_tcp_rtt',
    auth: 'BPF_PROG',
    desc: 'Captures TCP drops (kfree_skb) and network congestion.',
  },
  {
    id: 'flags',
    title: 'Feature Flags',
    subtitle: 'Toggles & rollouts',
    icon: Sliders,
    color: '#b89b6b',
    badge: 'Webhook',
    endpoint: 'POST /webhooks/flags',
    auth: 'Bearer',
    desc: 'LaunchDarkly and Flagsmith toggle events matched to error spikes.',
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipelines',
    subtitle: 'Actions & runs',
    icon: Workflow,
    color: '#7b7db8',
    badge: 'Pipeline',
    endpoint: 'POST /webhooks/ci',
    auth: 'Token',
    desc: 'Build triggers, image tags, and deploy pipeline markers.',
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
      title="System Architecture & Multi-Source Ingestion"
      subtitle="Hover any ingestion source or tier to inspect internal architecture"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={
        simStep === 1
          ? 'Multivariate Ingestion'
          : simStep === 2
          ? 'API Vault & Queue'
          : simStep === 3
          ? 'PostgreSQL Indexing'
          : simStep === 4
          ? 'Console Synthesis'
          : ''
      }
    >
      <div className="flex flex-col items-center min-w-[860px] max-w-5xl mx-auto space-y-3 p-1">
        {/* TOP ROW: INGESTION SOURCES */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Ingestion Data Plane · 6 Telemetry Streams
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {INGESTION_SOURCES.map((source) => {
              const Icon = source.icon
              const isSelected = selectedSource === source.id
              const isSimulated = simStep === 1 && isSelected

              return (
                <div
                  key={source.id}
                  onMouseEnter={() => setSelectedSource(source.id)}
                  className={`group relative p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected || isSimulated
                      ? 'bg-card/90 border-transparent shadow-sm scale-[1.02] -translate-y-0.5'
                      : 'bg-card/40 border-border/40 dark:border-white/6 hover:bg-card/60'
                  }`}
                  style={{
                    boxShadow: isSelected || isSimulated
                      ? `0 4px 16px -4px ${source.color}25, 0 0 0 1px ${source.color}40`
                      : undefined,
                  }}
                >
                  {/* Corner notch pins — landing page precision touch */}
                  {['-top-0.5 -left-0.5', '-top-0.5 -right-0.5', '-bottom-0.5 -left-0.5', '-bottom-0.5 -right-0.5'].map((pos) => (
                    <span
                      key={pos}
                      className={`absolute size-1 rounded-[0.5px] border pointer-events-none z-20 transition-all duration-300 ${
                        isSelected || isSimulated
                          ? 'border-[#ef4444] bg-[#ef4444]/40 scale-110'
                          : 'border-foreground/15 dark:border-white/20 bg-background dark:bg-black group-hover:border-[#ef4444]/50'
                      } ${pos}`}
                    />
                  ))}
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center"
                        style={{
                          backgroundColor: `${source.color}12`,
                          color: source.color,
                        }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span
                        className="text-[8px] font-mono px-1 py-0.5 rounded"
                        style={{
                          color: `${source.color}cc`,
                          backgroundColor: `${source.color}08`,
                          border: `1px solid ${source.color}20`,
                        }}
                      >
                        {source.badge}
                      </span>
                    </div>
                    <div className="font-medium text-[11px] text-foreground/85 tracking-tight line-clamp-1">
                      {source.title}
                    </div>
                    <div className="text-[9px] text-muted-foreground/50 font-mono mt-0.5 line-clamp-1">
                      {source.subtitle}
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1.5 border-t border-border/30 text-[9px] text-muted-foreground/50 line-clamp-2">
                    {source.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Connector: Sources → API */}
        <HandDrawnArrow
          direction="down"
          label={`${activeSrc.title} → ${activeSrc.endpoint}`}
          sublabel={activeSrc.auth}
          color={activeSrc.color}
          isActive={true}
          length={36}
        />

        {/* TIER 1: API & VAULT */}
        <div className="w-full">
          <ExcalidrawCard
            id="api"
            title="Evolvex API"
            subtitle="Express + tRPC · Multi-Tenant Vault · Worker Dispatch"
            stepNumber="01"
            badge="AES-256-GCM"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            roughType="underline"
            icon={ShieldCheck}
            seed={811}
            isActive={simStep === 2}
            isSimulated={simStep === 2}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/webhooks/*',
              credential: 'O(1) indexed secret_hash lookup',
              protocol: 'tRPC for UI + REST for webhooks',
              note: 'Zero plaintext credentials. All keys encrypted with org-scoped KMS.',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <div className="p-2 rounded-md bg-muted/20 border border-border/30">
                <span className="font-mono text-[11px] font-medium text-foreground/75 flex items-center gap-1">
                  <Lock className="w-3 h-3 opacity-50" />
                  Credential Vault
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Org-scoped AES-256-GCM encryption for all API keys.
                </p>
              </div>

              <div className="p-2 rounded-md bg-muted/20 border border-border/30">
                <span className="font-mono text-[11px] font-medium text-foreground/75 flex items-center gap-1">
                  <Zap className="w-3 h-3 opacity-50" />
                  O(1) Webhook Match
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  SHA-256 indexed hash with zero cross-tenant leakage.
                </p>
              </div>

              <div className="p-2 rounded-md bg-muted/20 border border-border/30">
                <span className="font-mono text-[11px] font-medium text-foreground/75 flex items-center gap-1">
                  <Layers className="w-3 h-3 opacity-50" />
                  Correlation Workers
                </span>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                  Background pipeline queries traces, commits, and eBPF events.
                </p>
              </div>
            </div>
          </ExcalidrawCard>
        </div>

        {/* Connector: API → DB */}
        <HandDrawnArrow
          direction="down"
          label="Evidence Persistence"
          sublabel="temporal graphs & pipeline cache"
          color="#6b93b8"
          isActive={simStep === 2 || simStep === 3}
          length={36}
        />

        {/* TIER 2: POSTGRESQL */}
        <div className="w-full">
          <ExcalidrawCard
            id="database"
            title="PostgreSQL"
            subtitle="Immutable Audit Log · Temporal Evidence · Knowledge Base"
            stepNumber="02"
            badge="Relational Schema"
            badgeColor="#6b93b8"
            accentColor="#6b93b8"
            roughType="box"
            icon={Database}
            seed={822}
            isActive={simStep === 3}
            isSimulated={simStep === 3}
            details={{
              protocol: 'PostgreSQL 16 + pgpool',
              credential: 'SSL (sslmode=verify-full)',
              note: 'Stores evidence, timeline entries, change events, and incident state.',
            }}
          >
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              {[
                'organizations',
                'investigations',
                'timeline_entries',
                'change_events',
                'runtime_signals',
                'services',
                'evidence',
                'pipeline_cache',
              ].map((table) => (
                <span
                  key={table}
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-muted/25 text-muted-foreground/60 border border-border/30 hover:text-foreground/70 transition-colors"
                >
                  {table}
                </span>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground/50">
              Immutable snapshot tracking for incident reviews, SLA calculations, and audits.
            </p>
          </ExcalidrawCard>
        </div>

        {/* Connector: DB → Console */}
        <HandDrawnArrow
          direction="down"
          label="tRPC Subscriptions"
          sublabel="sub-second hydration"
          color="#9b7db8"
          isActive={simStep === 3 || simStep === 4}
          length={36}
        />

        {/* TIER 3: REACT CONSOLE */}
        <div className="w-full">
          <ExcalidrawCard
            id="console"
            title="React Console"
            subtitle="Next.js · Investigations · Trace Explorer · Service Map"
            stepNumber="03"
            badge="Customer UI"
            badgeColor="#9b7db8"
            accentColor="#9b7db8"
            roughType="circle"
            icon={Laptop}
            seed={833}
            isActive={simStep === 4}
            isSimulated={simStep === 4}
            details={{
              endpoint: 'https://evolvex.ishaandev.co.in/investigations',
              protocol: 'Next.js App Router + Tailwind CSS',
              note: 'Interactive timelines, eBPF heatmaps, one-click rollback diffs.',
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2 text-[11px]">
              {[
                { name: 'Timeline View', desc: 'Chronological evidence' },
                { name: 'Service Map', desc: 'Distributed graph' },
                { name: 'Trace Explorer', desc: 'ClickHouse spans' },
                { name: 'Settings Vault', desc: 'Encrypted keys' },
              ].map((item) => (
                <div key={item.name} className="p-1.5 rounded-md bg-muted/20 border border-border/30 font-mono">
                  <span className="font-medium text-foreground/70">{item.name}</span>
                  <p className="text-[9px] text-muted-foreground/40 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
