import { resolveRequestSiteConfig } from '@/lib/site-config'

interface ChangelogEntry {
  version: string
  date: string
  description: string
  items: Array<string>
}

// Users can extend this array with their own changelog entries.
// In a future iteration this could be read from MDX files or a JSON file.
const entries: Array<ChangelogEntry> = [
  {
    version: 'v1.0.0',
    date: '2026-09-10',
    description: 'Official production launch of Evolvex: Autonomous incident investigation OS on SigNoz.',
    items: [
      'Autonomous 6-Stage incident investigation pipeline with strict zero-fake-data policy',
      'SigNoz 3-Key operational security architecture with Query API v5',
      'Kubernetes cluster monitoring via official helm/evolvex-agent chart with 30s heartbeat',
      'Slack OAuth integration and 1-click Jira ticket creation from investigation cases',
      'GitHub Actions CI/CD webhooks and LaunchDarkly feature flag flip correlation',
      'Extensible Webhook Plugin Hub supporting Prometheus Alertmanager and Datadog',
      'Automated Markdown postmortem pack generation (pnpm signoz:postmortem-pack)',
      'SigNoz 3-widget dashboard provisioning via Dashboards API',
      'Published @evolvex/sdk TypeScript client and Model Context Protocol (MCP) server',
    ],
  },
  {
    version: 'v0.9.0',
    date: '2026-08-15',
    description: 'Initial private beta of Evolvex investigation engine.',
    items: [
      'SigNoz Query API v5 integration for ClickHouse traces and logs',
      'Multi-tenant AES-256-GCM vault with indexed SHA-256 secret_hash lookup',
      'Evidence timeline with ALERT, TRACE, LOG, DEPLOY, and METRIC events',
      'Dogfooding instrumentation exporting evolvex-api signals into SigNoz',
    ],
  },
]

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(request: Request) {
  const effectiveSite = await resolveRequestSiteConfig()
  const baseUrl = new URL(request.url).origin
  const items = entries
    .map(
      (entry) => `    <item>
      <title>${escapeXml(`${effectiveSite.name} ${entry.version}`)}</title>
      <link>${baseUrl}/changelog</link>
      <guid>${baseUrl}/changelog#${entry.version}</guid>
      <pubDate>${new Date(entry.date).toUTCString()}</pubDate>
      <description>${escapeXml(entry.description + '\n' + entry.items.map((i) => `- ${i}`).join('\n'))}</description>
    </item>`,
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(effectiveSite.name)} Changelog</title>
    <link>${baseUrl}/changelog</link>
    <description>${escapeXml(`Latest updates to ${effectiveSite.name}`)}</description>
    <language>en</language>
    <atom:link href="${baseUrl}/changelog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
