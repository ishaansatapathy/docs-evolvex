import type { MDXComponents } from 'mdx/types'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THIS FILE IS YOURS.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Register your own components here to use them in any `.mdx` page — no core
 *  files to touch, and nothing here is overwritten when you update Thally.
 *
 *  Anything you add is merged on top of Thally's built-in components, so you can:
 *    • add brand-new components (e.g. <PricingTable/>, <Roadmap/>), and
 *    • override a built-in by using the same key (e.g. `Note`, `Card`).
 *
 *  Example — a simple component you can use as `<Highlight>text</Highlight>`:
 *
 *    import type { ReactNode } from 'react'
 *
 *    function Highlight({ children }: { children: ReactNode }) {
 *      return (
 *        <mark className="rounded bg-accent/15 px-1 text-foreground">{children}</mark>
 *      )
 *    }
 *
 *    export const customComponents: MDXComponents = {
 *      Highlight,
 *    }
 *
 *  Components can be server or client components, import anything, and take
 *  props from MDX (`<PricingTable plan="pro" />`). See
 *  `src/components/mdx/rich-content.tsx` for how the built-ins are written.
 */
import { VideoScrollHero } from '@/components/video-scroll/video-scroll-hero'
import { EvolvexLanding } from '@/components/evolvex/evolvex-landing'
import { QuickstartFlow } from '@/components/docs/flows/quickstart-flow'
import { ArchitectureFlow } from '@/components/docs/flows/architecture-flow'
import { DeployCorrelationFlow } from '@/components/docs/flows/deploy-correlation-flow'
import { EbpfObiFlow } from '@/components/docs/flows/ebpf-obi-flow'
import { KubernetesFlow } from '@/components/docs/flows/kubernetes-flow'
import { TelemetryIntelligenceFlow } from '@/components/docs/flows/telemetry-intelligence-flow'
import { CicdFlagsFlow } from '@/components/docs/flows/cicd-flags-flow'
import { SdkEventsFlow } from '@/components/docs/flows/sdk-events-flow'

import { Highlight } from '@/components/ui/highlight'
import { RoughMark } from '@/components/ui/rough-mark'

export const customComponents: MDXComponents = {
  VideoScrollHero,
  EvolvexLanding,
  QuickstartFlow,
  ArchitectureFlow,
  DeployCorrelationFlow,
  EbpfObiFlow,
  KubernetesFlow,
  TelemetryIntelligenceFlow,
  CicdFlagsFlow,
  SdkEventsFlow,
  Highlight,
  RoughMark,
}

