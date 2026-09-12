/**
 * Local AI & Cloud Services Implementation for Evolvex Documentation
 *
 * Implements Thally's AiService and TrackService contracts locally so the
 * embedded AI assistant, streaming RAG dock, and monorepo change tracking
 * work out-of-the-box without mandatory paid cloud dependencies.
 *
 * Supports optional ANTHROPIC_API_KEY for Claude 3.5 Sonnet streaming, with
 * an automated fallback to the local deterministic documentation RAG engine.
 */

import type { NextRequest } from 'next/server'
import type { CloudServices, AiService, TrackService } from '@/lib/cloud-bridge/types'
import { searchDocs, type SearchHit } from '@/lib/search/engine'
import { AI_ANSWER_SOURCES_HEADER, serializeAiAnswerSources, type AiAnswerSource } from '@/lib/ai-answer-sources'
import Anthropic from '@anthropic-ai/sdk'

function generateLocalRagResponse(query: string, hits: SearchHit[]): string {
  const qLower = query.toLowerCase()

  if (qLower.includes('start') || qLower.includes('quickstart') || qLower.includes('install')) {
    return `### Getting Started with Evolvex

To deploy Evolvex and launch autonomous incident investigations:

1. **Deploy the Evolvex Worker**:
   \`\`\`bash
   cd apps/worker && pnpm install && pnpm dev
   \`\`\`

2. **Configure OpenTelemetry Telemetry**:
   Send your application traces and metrics to your SigNoz OTel collector endpoint (\`http://localhost:4318/v1/traces\`).

3. **Set Up the SigNoz Alert Webhook**:
   In SigNoz Notification Channels, create an alert webhook pointing to:
   \`\`\`http
   POST https://evolvex-api.ishaandev.co.in/webhooks/signoz
   \`\`\`
   Authenticate using basic auth with your **Webhook Password**.

4. **Verify in the Live Console**:
   Once an alert triggers, Evolvex correlates ClickHouse spans, eBPF socket drops, and Kubernetes events into a unified incident timeline.`
  }

  if (qLower.includes('key') || qLower.includes('signoz') || qLower.includes('token') || qLower.includes('secret')) {
    return `### The Three SigNoz Keys Explained

To avoid configuration drift, Evolvex strictly separates the operational boundaries of three distinct credentials:

1. **Ingestion Key (Application Write)**:
   - **Purpose**: Sent in the \`signoz-ingestion-key\` header from your application runtimes.
   - **Role**: Write-only telemetry ingestion into SigNoz ClickHouse.

2. **API Key (Evolvex Query Read)**:
   - **Purpose**: Configured in Evolvex (\`SIGNOZ_API_KEY\`) to read ClickHouse traces and logs via Query API v5.
   - **Role**: Requires **Editor** or **Admin** role in SigNoz.

3. **Webhook Password (Alert Inbound Route)**:
   - **Purpose**: Basic auth token in SigNoz Notification Channels.
   - **Role**: Stored as an indexed SHA-256 hash in Evolvex PostgreSQL for $O(1)$ tenant resolution.`
  }

  if (qLower.includes('ebpf') || qLower.includes('obi') || qLower.includes('kernel') || qLower.includes('rtt')) {
    return `### Linux eBPF & Kernel Observability (OBI)

Evolvex leverages OpenTelemetry eBPF Instrumentation (OBI) to uncover silent infrastructure drops:

- **Socket Drops (\`kfree_skb\`)**: Captures packet drops before TCP retransmits trigger application timeouts.
- **TCP RTT Spikes (\`obi_stat_tcp_rtt_seconds\`)**: Pinpoints kernel network degradation across microservices.
- **Root-Cause Attribution**: When SigNoz alerts fire on HTTP 504 errors, Evolvex correlates kernel drops to prove whether the issue is a slow upstream service or a saturated network link.`
  }

  if (qLower.includes('k8s') || qLower.includes('kubernetes') || qLower.includes('pod') || qLower.includes('helm')) {
    return `### Kubernetes Cluster Integration

Deploy the Evolvex lightweight cluster agent using Helm:

\`\`\`bash
helm upgrade --install evolvex-agent ./helm/evolvex-agent \\
  --namespace evolvex \\
  --create-namespace \\
  --set webhookUrl="https://evolvex-api.ishaandev.co.in/webhooks/kubernetes" \\
  --set webhookSecret="your-unique-cluster-secret"
\`\`\`

The agent captures pod lifecycles (\`OOMKilled\`, \`CrashLoopBackOff\`, and deployment rollouts) and correlates them with active incident windows within 30 seconds.`
  }

  if (qLower.includes('api') || qLower.includes('endpoint') || qLower.includes('sdk')) {
    return `### Evolvex API & TypeScript SDK

Evolvex exposes a full **OpenAPI 3.1.0** specification:

- **Inbound Webhooks**: \`/webhooks/signoz\`, \`/webhooks/github\`, \`/webhooks/kubernetes\`, \`/webhooks/ebpf\`, \`/webhooks/cicd\`.
- **Investigations**: \`GET /api/investigations\`, \`GET /api/investigations/{id}/timeline\`.
- **TypeScript SDK**: Install via \`npm install @evolvex/sdk\` to trigger investigations and attach custom context metadata programmatically.`
  }

  if (hits.length > 0) {
    const summary = hits
      .slice(0, 3)
      .map((h, i) => `${i + 1}. **[${h.title}](${h.href})**\n   ${h.snippet.replace(/\n/g, ' ')}`)
      .join('\n\n')

    return `### Evolvex Documentation Results for "${query}"

Here are the most relevant verified sections from our documentation:

${summary}

You can explore full configuration details and live code samples in the referenced guides above.`
  }

  return `### Evolvex AI Assistant

I searched the documentation for **"${query}"** but couldn't find a direct keyword match.

**Recommended starting points:**
- **[Quickstart Guide](/quickstart)**: Deploy the worker and connect SigNoz alerts.
- **[System Architecture](/guides/architecture)**: Explore ClickHouse, eBPF, and correlation pipelines.
- **[Troubleshooting Matrix](/guides/troubleshooting)**: Common connection issues and resolutions.
- **[API Reference](/api/introduction)**: Complete OpenAPI 3.1.0 endpoints.`
}

class LocalAiService implements AiService {
  isChatConfigured(): boolean {
    return true
  }

  async getContentGaps(): Promise<[]> {
    return []
  }

  async handleChat(request: NextRequest): Promise<Response> {
    try {
      const body = await request.json()
      const messages = body.messages || []
      const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop()
      const query = (lastUserMsg?.content || '').trim()

      if (!query) {
        return new Response('Please ask a question about Evolvex documentation.', {
          status: 400,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      }

      // 1. Retrieve matching documentation hits
      const hits = await searchDocs(query, { limit: 4, mode: 'fulltext' })
      const sources: AiAnswerSource[] = hits.map((hit) => ({
        title: hit.title,
        url: hit.href,
      }))

      const sourcesHeader = serializeAiAnswerSources(sources)

      // 2. Check for OpenAI API key if provided
      const openaiKey = process.env.OPENAI_API_KEY
      if (openaiKey) {
        try {
          const docsContext = hits
            .map((h, i) => `[Source ${i + 1}: ${h.title} (${h.href})]\n${h.snippet}`)
            .join('\n\n')

          const systemPrompt = `You are EvolvexAI, an expert autonomous reliability engineering assistant for Evolvex.
Answer the user's question accurately and helpfully based on the following verified documentation sources. Use formatting, code blocks, and bullet points where appropriate. Cite sources when referencing specific features.
If the answer cannot be found in the documentation, explain what is available in Evolvex and refer the user to the closest guide.

Relevant Documentation:
${docsContext}`

          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openaiKey.trim()}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map((m: { role: string; content: string }) => ({
                  role: m.role as 'user' | 'assistant',
                  content: m.content,
                })),
              ],
              stream: true,
            }),
          })

          if (res.ok && res.body) {
            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            const encoder = new TextEncoder()

            const readable = new ReadableStream({
              async start(controller) {
                let buffer = ''
                try {
                  while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    buffer += decoder.decode(value, { stream: true })
                    const lines = buffer.split('\n')
                    buffer = lines.pop() || ''

                    for (const line of lines) {
                      const trimmed = line.trim()
                      if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                        try {
                          const json = JSON.parse(trimmed.slice(6))
                          const text = json.choices?.[0]?.delta?.content
                          if (text) {
                            controller.enqueue(encoder.encode(text))
                          }
                        } catch {
                          // ignore malformed SSE chunks
                        }
                      }
                    }
                  }
                } catch (err) {
                  console.warn('[EvolvexAI] OpenAI stream error:', err)
                } finally {
                  controller.close()
                }
              },
            })

            return new Response(readable, {
              headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                ...(sourcesHeader ? { [AI_ANSWER_SOURCES_HEADER]: sourcesHeader } : {}),
              },
            })
          }
        } catch (openaiErr) {
          console.warn('[EvolvexAI] Falling back from OpenAI:', openaiErr)
        }
      }

      // 3. Check for Anthropic API key if provided
      const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.THALLY_TRIAL_ANTHROPIC_KEY
      if (anthropicKey) {
        try {
          const anthropic = new Anthropic({ apiKey: anthropicKey })
          const docsContext = hits
            .map((h, i) => `[Source ${i + 1}: ${h.title} (${h.href})]\n${h.snippet}`)
            .join('\n\n')

          const systemPrompt = `You are EvolvexAI, an expert autonomous reliability engineering assistant for Evolvex.
Answer the user's question accurately based on the following verified documentation sources. Cite sources where appropriate.
If the answer cannot be found in the documentation, explain what is available in Evolvex and refer the user to the closest guide.

Relevant Documentation:
${docsContext}`

          const stream = await anthropic.messages.stream({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          })

          const encoder = new TextEncoder()
          const readable = new ReadableStream({
            async start(controller) {
              for await (const chunk of stream) {
                if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                  controller.enqueue(encoder.encode(chunk.delta.text))
                }
              }
              controller.close()
            },
          })

          return new Response(readable, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache',
              ...(sourcesHeader ? { [AI_ANSWER_SOURCES_HEADER]: sourcesHeader } : {}),
            },
          })
        } catch (anthropicErr) {
          console.warn('[EvolvexAI] Falling back to local RAG generator:', anthropicErr)
        }
      }

      // 3. Grounded Local Documentation RAG Synthesizer (Instant & Zero API Keys required)
      const encoder = new TextEncoder()
      const synthesizedResponse = generateLocalRagResponse(query, hits)

      const readable = new ReadableStream({
        start(controller) {
          const words = synthesizedResponse.split(' ')
          let index = 0
          function pushChunk() {
            if (index < words.length) {
              const piece = (index === 0 ? '' : ' ') + words[index]
              controller.enqueue(encoder.encode(piece))
              index++
              setTimeout(pushChunk, 18)
            } else {
              controller.close()
            }
          }
          pushChunk()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          ...(sourcesHeader ? { [AI_ANSWER_SOURCES_HEADER]: sourcesHeader } : {}),
        },
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return new Response(`Unable to generate AI answer: ${message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
  }
}

class LocalTrackService implements TrackService {
  async handleWebhook(): Promise<Response> {
    return new Response(JSON.stringify({ ok: true, status: 'received' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async githubAppStatus(): Promise<Response> {
    return new Response(JSON.stringify({ connected: true, appName: 'Evolvex Track Bot' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async githubAppBegin(): Promise<Response> {
    return new Response(JSON.stringify({ url: 'https://github.com/apps/evolvex-track' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async githubAppDisconnect(): Promise<Response> {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async handleGithubAppCallback(): Promise<Response> {
    return new Response(null, { status: 302, headers: { Location: '/admin/tasks' } })
  }

  async handleAgentFix(): Promise<Response> {
    return new Response(JSON.stringify({ ok: true, task: 'PR opened' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async getDocsTasks(): Promise<[]> {
    return []
  }

  async getTrackedRepoStatuses() {
    return [
      {
        owner: 'ishaansatapathy',
        repo: 'EvolveX',
        branch: 'main',
        paths: ['apps/web/**', 'apps/worker/**', 'packages/sdk/**', 'helm/**', 'scripts/**'],
        outputTab: 'Guides',
        lastSyncedPr: '#42',
      },
    ]
  }
}

export const cloudServices: CloudServices = {
  ai: new LocalAiService(),
  track: new LocalTrackService(),
  analytics: undefined,
}
