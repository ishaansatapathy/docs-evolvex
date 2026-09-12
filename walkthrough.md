# Evolvex Thally walkthrough

Use this walkthrough to show judges the Track 2 requirements without making
them hunt through the repository.

## 1. Start with the product outcome

Open `/` and show the Evolvex landing page. The first screen explains that
Evolvex is an autonomous incident investigation OS on SigNoz, then links into
the docs workflow.

Success looks like this: a judge immediately sees the product, the audience,
and the incident investigation use case.

## 2. Run the required reader workflow

Open `/quickstart` and walk through the five-minute setup:

- distinguish the SigNoz ingestion key, Query API key, and webhook password
- instrument a service with OpenTelemetry
- connect the Evolvex workspace vault
- configure the SigNoz alert webhook
- verify a generated investigation timeline

Success looks like this: a developer can complete one meaningful task and
knows what evidence should appear in Evolvex.

## 3. Show depth beyond the quickstart

Open these pages:

- `/guides/signoz-setup`
- `/guides/kubernetes`
- `/guides/ebpf-obi`
- `/guides/github-integration`
- `/guides/troubleshooting`
- `/changelog`

Success looks like this: the site has more than ten substantive pages, clear
navigation, task guides, troubleshooting, and release history.

## 4. Verify the technical reference

Open `/api/introduction`, then use `/openapi.yaml` or `/openapi.json`.

Success looks like this: the API reference documents real Evolvex webhooks,
investigation endpoints, SDK routes, health diagnostics, and the MCP endpoint.

## 5. Prove agent readiness

Check the same guide across the required surfaces:

- HTML: `/quickstart`
- Markdown: `/quickstart.md`
- JSON: `/quickstart?format=json`
- JSON-LD: `/quickstart?format=ldjson`
- Search: `/api/search?q=quickstart`
- Agent index: `/llms.txt`
- MCP discovery: `/.well-known/mcp.json`

Then run:

```bash
npm run check:agents
```

Success looks like this: the Agent Readiness report returns `100/100` and the
quickstart is discoverable across human and machine-readable outputs.

## 6. Finish with build proof

Run:

```bash
npm run build
```

Success looks like this: the repository installs, checks, and builds cleanly
from the controlled source.
