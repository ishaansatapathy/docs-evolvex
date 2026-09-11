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
      title="TypeScript SDK & Custom Timeline Events"
      subtitle="Programmatic injection of custom markers, deployment metadata, and findings"
      onSimulate={handleSimulate}
      isSimulating={isSimulating}
      stepProgress={activeCard === 'cli' ? 'SDK Initialized' : 'Timeline Event Injected'}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-4xl mx-auto">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Application / CLI
            </span>
            <StickyNote text="@evolvex/sdk" />
          </div>

          <ExcalidrawCard
            id="sdk-cli"
            title="Internal CLI / Platform"
            subtitle="import { createEvolvexClient } from '@evolvex/sdk'"
            badge="TypeScript SDK"
            badgeColor="#6b93b8"
            accentColor="#6b93b8"
            icon={Terminal}
            isActive={activeCard === 'cli'}
            isSimulated={isSimulating && activeCard === 'cli'}
            onMouseEnter={() => setActiveCard('cli')}
            details={{
              protocol: 'HTTPS REST / JSON',
              credential: 'Bearer <EVOLVEX_API_KEY>',
              note: 'Full type-safety for Node.js, Bun, and Deno.',
            }}
          >
            <div className="px-2 py-1.5 rounded-md bg-muted/20 border border-border/30 text-[11px] font-mono text-muted-foreground/60 mt-1">
              client.investigations.addTimelineEvent(&#123;
              <br />
              &nbsp;&nbsp;type: 'CHANGE',
              <br />
              &nbsp;&nbsp;title: 'Canary 10% deployed'
              <br />
              &#125;)
            </div>
          </ExcalidrawCard>
        </div>

        <HandDrawnArrow
          direction="down"
          label="Bearer Key"
          sublabel="POST /api/v1/sdk/*"
          color="#6b9e6b"
          isActive={true}
          length={36}
        />

        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              SDK Gateway
            </span>
            <StickyNote text="REST API v1" />
          </div>

          <ExcalidrawCard
            id="sdk-gateway"
            title="Evolvex SDK Gateway"
            subtitle="Programmatic Case & Timeline Mutation"
            badge="Authenticated"
            badgeColor="#6b9e6b"
            accentColor="#6b9e6b"
            icon={Database}
            isActive={activeCard === 'api'}
            isSimulated={isSimulating && activeCard === 'api'}
            onMouseEnter={() => setActiveCard('api')}
            details={{
              endpoint: 'POST https://evolvex-api.ishaandev.co.in/api/v1/sdk/timeline',
              note: 'Injects custom metrics, synthetic test findings, and AI insights.',
            }}
          >
            <div className="space-y-1 mt-1 text-[11px] font-mono text-muted-foreground/60">
              <div className="px-2 py-1 rounded-md bg-muted/20 border border-border/30">
                • List & filter open investigations
              </div>
              <div className="px-2 py-1 rounded-md bg-muted/20 border border-border/30">
                • Inject CHANGE / METRIC / AI events
              </div>
            </div>
          </ExcalidrawCard>
        </div>
      </div>
    </ExcalidrawCanvas>
  )
}
