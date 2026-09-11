$commits = @(
    @{ Files = @("package.json", "package-lock.json"); Message = "build(deps): install framer-motion, react-rough-notation, and lucide-react" },
    @{ Files = @("tsconfig.json"); Message = "chore(config): update typescript path aliases and module resolution" },
    @{ Files = @("public/brand/default-logo-dark.svg", "public/brand/default-logo-light.svg"); Message = "style(brand): add dark and light svg brand logos" },
    @{ Files = @("public/brand/default-favicon-dark.svg", "public/brand/default-favicon-light.svg"); Message = "style(brand): add dark and light favicon svg vectors" },
    @{ Files = @("public/brand/logo.png", "public/evolvex-logo.png"); Message = "style(brand): add high-resolution png logo assets" },
    @{ Files = @("public/favicon.ico", "public/favicon.png", "public/favicon-64.png", "public/apple-icon.png"); Message = "style(brand): add multi-resolution favicons and apple touch icon" },
    @{ Files = @("public/icon.svg", "public/icon.png", "src/app/icon.png"); Message = "style(brand): configure pwa application icons" },
    @{ Files = @("public/fonts/"); Message = "style(fonts): add custom display typography assets and documentation" },
    @{ Files = @("scripts/generate-brand-assets.py"); Message = "chore(tooling): add automated brand asset generation script" },
    @{ Files = @("public/hero-bg.png", "public/images/"); Message = "style(assets): add hero background pattern and imagery" },
    @{ Files = @("public/mascot.webm", "public/thread-logo.svg"); Message = "style(assets): add mascot webm animation and thread logo illustration" },
    @{ Files = @("public/video/", "video/"); Message = "style(assets): add interactive scrub video media assets" },
    @{ Files = @("src/data/site.ts"); Message = "feat(config): configure site identity, title, and metadata in site.ts" },
    @{ Files = @("tailwind.config.ts"); Message = "style(theme): extend tailwind tokens with display fonts and custom radiuses" },
    @{ Files = @("src/app/globals.css"); Message = "style(theme): implement obsidian dark mode palette and handwriting font" },
    @{ Files = @("src/hooks/"); Message = "feat(ui): implement radial mouse spotlight hook" },
    @{ Files = @("src/components/ui/highlight.tsx"); Message = "feat(ui): add corner-marker highlight styling component" },
    @{ Files = @("src/components/ui/client-rough-notation.tsx"); Message = "feat(ui): add hydration-safe rough-notation wrapper component" },
    @{ Files = @("src/components/ui/cinematic-logo.tsx"); Message = "feat(ui): implement interactive cinematic brand logo with hover states" },
    @{ Files = @("src/components/thread/thread.css"); Message = "style(thread): add glowing thread beam animations and flow styling" },
    @{ Files = @("src/components/thread/thread-flow-connectors.tsx"); Message = "feat(thread): create animated dotted flow connector lines" },
    @{ Files = @("src/components/thread/thread-reveal.tsx"); Message = "feat(thread): add scroll reveal text effect for landing transitions" },
    @{ Files = @("src/components/video-scroll/"); Message = "feat(hero): build canvas-based video scroll hero component" },
    @{ Files = @("src/components/evolvex/"); Message = "feat(landing): build evolvex landing page with capabilities showcase" },
    @{ Files = @("src/components/layout/site-shell.tsx"); Message = "feat(layout): customize top navigation bar and console actions in site-shell" },
    @{ Files = @("src/app/providers.tsx"); Message = "feat(layout): configure global providers and client theme hydration" },
    @{ Files = @("src/app/layout.tsx"); Message = "feat(layout): configure root layout with preloaded fonts and structured json-ld" },
    @{ Files = @("src/cloud/index.ts"); Message = "feat(ai): build streaming rag ai service with source citation pills" },
    @{ Files = @("openapi.yaml"); Message = "docs(api): author openapi 3.1.0 specification for query api v5 endpoints" },
    @{ Files = @("src/content/api/introduction.mdx"); Message = "docs(api): create api reference introduction and sdk overview" },
    @{ Files = @("src/content/api/authentication.mdx"); Message = "docs(api): document multi-tenant authentication and workspace security" },
    @{ Files = @("src/components/docs/flows/shared-excalidraw.tsx"); Message = "feat(diagrams): implement shared excalidraw primitives and hand-drawn arrows" },
    @{ Files = @("src/components/docs/flows/quickstart-flow.tsx"); Message = "feat(diagrams): create quickstart interactive telemetry flow with simulation" },
    @{ Files = @("src/components/docs/flows/architecture-flow.tsx"); Message = "feat(diagrams): create 6-stream multi-signal architecture flow component" },
    @{ Files = @("src/components/docs/flows/deploy-correlation-flow.tsx"); Message = "feat(diagrams): build deploy correlation and git commit diff flow" },
    @{ Files = @("src/components/docs/flows/ebpf-obi-flow.tsx"); Message = "feat(diagrams): build linux kernel ebpf probe and socket telemetry flow" },
    @{ Files = @("src/components/docs/flows/kubernetes-flow.tsx"); Message = "feat(diagrams): build kubernetes pod lifecycle and crash correlation flow" },
    @{ Files = @("src/components/docs/flows/telemetry-intelligence-flow.tsx"); Message = "feat(diagrams): build adaptive telemetry sampling control plane flow" },
    @{ Files = @("src/components/docs/flows/cicd-flags-flow.tsx"); Message = "feat(diagrams): build ci/cd test failure and feature flag correlation flow" },
    @{ Files = @("src/components/docs/flows/sdk-events-flow.tsx"); Message = "feat(diagrams): build typescript sdk and custom timeline events flow" },
    @{ Files = @("src/mdx/custom-components.tsx"); Message = "feat(mdx): register excalidraw flow components in mdx registry" },
    @{ Files = @("src/content/introduction.mdx"); Message = "docs(core): author introduction page with value proposition and agent prompts" },
    @{ Files = @("src/content/quickstart.mdx"); Message = "docs(core): author 5-minute quickstart guide with interactive flow" },
    @{ Files = @("src/content/guides/signoz-setup.mdx"); Message = "docs(guides): author signoz integration and alert webhook setup guide" },
    @{ Files = @("src/content/guides/architecture.mdx"); Message = "docs(guides): author system architecture and multi-tenant vault guide" },
    @{ Files = @("src/content/guides/github-integration.mdx"); Message = "docs(guides): author github deploy correlation and ast diff guide" },
    @{ Files = @("src/content/guides/ebpf-obi.mdx"); Message = "docs(guides): author linux ebpf obi kernel socket observability guide" },
    @{ Files = @("src/content/guides/kubernetes.mdx"); Message = "docs(guides): author kubernetes daemonset and helm deployment guide" },
    @{ Files = @("src/content/guides/telemetry-intelligence.mdx"); Message = "docs(guides): author telemetry intelligence and dynamic sampling guide" },
    @{ Files = @("src/content/guides/cicd-and-flags.mdx"); Message = "docs(guides): author ci/cd pipelines and feature flag integration guide" },
    @{ Files = @("src/content/guides/sdk-and-custom-events.mdx"); Message = "docs(guides): author typescript sdk usage and timeline injection guide" },
    @{ Files = @("src/content/guides/slack-jira.mdx"); Message = "docs(guides): author slack and jira incident ticket automation guide" },
    @{ Files = @("src/content/guides/plugins-and-webhooks.mdx"); Message = "docs(guides): author plugins and inbound webhook resolution guide" },
    @{ Files = @("src/content/guides/postmortem-and-dashboards.mdx"); Message = "docs(guides): author automated postmortem and sla report guide" },
    @{ Files = @("src/content/guides/signoz-mcp.mdx"); Message = "docs(guides): author signoz mcp server and ai agent connectivity guide" },
    @{ Files = @("src/content/guides/troubleshooting.mdx"); Message = "docs(guides): author autonomous troubleshooting and incident runbook guide" },
    @{ Files = @("src/content/404.mdx"); Message = "docs(ui): implement custom 404 page with cardgroup navigation recovery" },
    @{ Files = @("src/content/changelog.mdx"); Message = "docs(changelog): author continuous product update changelog" },
    @{ Files = @("src/app/changelog/rss.xml/route.ts"); Message = "feat(rss): build rss 2.0 changelog syndication feed endpoint" },
    @{ Files = @("snippets/"); Message = "docs(snippets): add reusable documentation code snippets" },
    @{ Files = @("docs.json"); Message = "chore(docs): configure navigation hierarchy, banner, and tracker in docs.json" },
    @{ Files = @("AGENTS.md"); Message = "docs(agents): define autonomous agent boundaries and canonical terms in AGENTS.md" },
    @{ Files = @("REFLECTION.md"); Message = "docs(meta): author final reflection against thally hackathon criteria" },
    @{ Files = @("README.md"); Message = "docs(meta): update project readme with architecture links and quickstart" }
)

$count = 0
foreach ($c in $commits) {
    $count++
    Write-Host "[$count/$($commits.Count)] Committing: $($c.Message)"
    foreach ($f in $c.Files) {
        if (Test-Path $f) {
            git add $f
        }
    }
    git commit -m $c.Message --quiet
}

# Catch any remaining untracked helper scripts if any
$status = git status --porcelain
if ($status) {
    git add -A
    git commit -m "chore: include remaining build and test helper scripts" --quiet
}

Write-Host "Total commits created: $(git rev-list --count HEAD)"
