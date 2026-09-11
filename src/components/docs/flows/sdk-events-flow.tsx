'use client'

import React, { useState } from 'react'
import { Terminal, ShieldAlert, Code2, Database } from 'lucide-react'
import { ExcalidrawCanvas, ExcalidrawCard, HandDrawnArrow, StickyNote } from './shared-excalidraw'

export function SdkEventsFlow() {
  const [activeCard, setActiveCard] = useState<'cli' | 'api'>('cli')
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setActiveCard('cli')
    setTimeout(() => setActiveCard('api'), 1000)
    setTimeout(() => setIsSimulating(false), 2400)
  }

  return (
    <ExcalidrawCanvas
      title="TypeScript SDK & Custom Timeline Events Architecture"
      subtitle="Programmatic injection of custom markers, deployment metadata, and AI findings"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={activeCard === 'cli' ? 'SDK Initialized' : 'Timeline Event Injected'}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              01 • Application / CLI
            </span>
            <StickyNote text="@evolvex/sdk" color="#38BDF8" rotation={-1} />
          </div>

          <ExcalidrawCard
            id="sdk-cli"
            title="Internal CLI / Platform"
            subtitle="import { createEvolvexClient } from '@evolvex/sdk'"
            badge="TypeScript SDK"
            badgeColor="#38BDF8"
            accentColor="#38BDF8"
            icon={Terminal}
            roughType="box"
            roughColor="#38BDF8"
            isActive={activeCard === 'cli'}
            isSimulated={isSimulating && activeCard === 'cli'}
            onMouseEnter={() => setActiveCard('cli')}
            details={{
              protocol: 'HTTPS REST / JSON',
              credential: 'Bearer <EVOLVEX_API_KEY>',
              note: 'Full type-safety for Node.js, Bun, and Deno.',
            }}
          >
            <div className="p-2 rounded bg-muted/40 border border-border/70 text-xs font-mono text-muted-foreground mt-1">
              client.investigations.addTimelineEvent(&#123;
              <br />
              &nbsp;&nbsp;type: &apos;CHANGE&apos;,
              <br />
              &nbsp;&nbsp;title: &apos;Canary 10% deployed&apos;
              <br />
              &#125;)
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="Authorization: Bearer Key"
          sublabel="POST /api/v1/sdk/*"
          color="#00CC66"
          isActive={true}
          length={40}
        />

        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              02 • Evolvex SDK Gateway
            </span>
            <StickyNote text="REST API v1" color="#00CC66" rotation={1} />
          </div>

          <ExcalidrawCard
            id="sdk-gateway"
            title="Evolvex SDK REST Gateway"
            subtitle="Programmatic Case & Timeline Mutation"
            badge="Authenticated API"
            badgeColor="#00CC66"
            accentColor="#00CC66"
            icon={Database}
            roughType="box"
            roughColor="#00CC66"
            isActive={activeCard === 'api'}
            isSimulated={isSimulating && activeCard === 'api'}
            onMouseEnter={() => setActiveCard('api')}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/api/v1/sdk/timeline',
              note: 'Injects custom metrics, synthetic test findings, and AI insights.',
            }}
          >
            <div className="space-y-1 mt-1 text-xs font-mono text-muted-foreground">
              <div className="p-1.5 rounded bg-muted/40 border border-border/70">
                • List & filter open investigations
              </div>
              <div className="p-1.5 rounded bg-muted/40 border border-border/70">
                • Inject CHANGE / METRIC / AI timeline events
              </div>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
