# Evolvex Documentation Platform

[![Thally Hackathon Track 2](https://img.shields.io/badge/Thally%20Hackathon-Track%202%3A%20Launch%20or%20Migrate-ff3344.svg)](https://thally.io)
[![Agent Readiness](https://img.shields.io/badge/Agent%20Readiness-100%2F100%20(Grade%20A)-00ff88.svg)](http://localhost:3040/api/agent-readiness)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.1.0-blue.svg)](http://localhost:3040/openapi.yaml)
[![SigNoz](https://img.shields.io/badge/Data%20Plane-SigNoz%20OTel-orange.svg)](https://signoz.io)

> Production-grade, AI-native documentation platform for **Evolvex (Autonomous Incident Investigation OS on SigNoz)**, built on the **Thally documentation runtime** for **Hackathon Track 2: Launch or Migrate**.

---

## 🌟 Overview

Evolvex is an autonomous incident investigation operating system that turns alert noise into verified root-cause timelines. It correlates OpenTelemetry distributed traces, structured logs, Linux eBPF/OBI kernel socket anomalies, Kubernetes pod lifecycles, and CI/CD git deployments with zero fake data.

This repository powers the complete documentation platform, including:
- **Interactive OpenAPI 3.1.0 Playground:** Full specification covering all inbound webhooks, investigation APIs, SDK endpoints, and Model Context Protocol (MCP).
- **23 Authored MDX Guides:** Deep-dive integration tutorials with real code for Node.js, Python, Go, Kubernetes Helm, Slack OAuth, Jira, and GitHub.
- **AI-Native Discovery Engine:** High-performance `/llms.txt`, `/llms-full.txt`, JSON-LD schemas, and remote MCP endpoints.
- **Obsidian & Crimson Brand Aesthetics:** Bespoke dark theme (`#040704` obsidian surface, `#FF3344` vibrant crimson accent) matching Evolvex's 3D metallic folded X emblem.

---

## 🚀 Quick Start

### 1. Run Locally

```bash
# Install dependencies
npm install

# Start development server on port 3040
npm run dev
```

Open [http://localhost:3040](http://localhost:3040) in your browser.

### 2. Verify Agent Readiness & Tests

```bash
# Compile and embed runtime sources
npm run runtime-sources:build

# Verify 100/100 Agent Readiness Score
npm run check:agents

# Run static routes test suite
npx vitest run src/lib/__tests__/doc-route-static-params.test.ts
```

---

## 🗺️ Documentation Architecture

```
Documentation Navigation:
├── Get started
│   ├── Introduction (/introduction)
│   ├── Quickstart (5-minute setup workflow) (/quickstart)
│   ├── Architecture & Zero-Fake-Data Policy (/guides/architecture)
│   ├── Linux eBPF & Kernel OBI Socket Probes (/guides/ebpf-obi)
│   └── SigNoz Native MCP Server (/guides/signoz-mcp)
├── Integrations
│   ├── Telemetry & Clusters:
│   │   ├── SigNoz & OpenTelemetry Setup (/guides/signoz-setup)
│   │   └── Kubernetes Cluster Integration (/guides/kubernetes)
│   ├── Collaboration & Git:
│   │   ├── GitHub Deploy Correlation & Pinpointing (/guides/github-integration)
│   │   ├── Slack & Jira Integration (/guides/slack-jira)
│   │   └── CI/CD Pipelines & Feature Flags (/guides/cicd-and-flags)
│   └── Extensibility & Plugins:
│       └── Extensible Webhook Plugins (/guides/plugins-and-webhooks)
├── Guides
│   ├── Operations & Automation:
│   │   ├── Automated Postmortems & SigNoz Dashboards (/guides/postmortem-and-dashboards)
│   │   ├── Troubleshooting Diagnostic Matrix (/guides/troubleshooting)
│   │   ├── Telemetry Intelligence & Go Processor (/guides/telemetry-intelligence)
│   │   └── Work with the CLI (/guides/work-with-the-cli)
│   └── Developer Tools & SDK:
│       ├── TypeScript SDK & Custom Events (/guides/sdk-and-custom-events)
│       ├── Create a Site (/guides/create-a-site)
│       └── Connect AI Tools (/guides/connect-ai-tools)
├── API Reference
│   ├── Overview & Authentication (/api/introduction, /api/authentication)
│   └── Interactive OpenAPI 3.1.0 Operations Console
└── Changelog (/changelog)
```

---

## 🤖 AI & Machine Readability Endpoints

Every page on this site supports multi-format content negotiation:
- **Markdown Mirror:** Append `.md` to any URL or send `Accept: text/markdown`.
- **JSON Projection:** Append `?format=json` or send `Accept: application/json`.
- **JSON-LD Schema:** Append `?format=ldjson` or send `Accept: application/ld+json`.
- **Full LLM Digest:** [`/llms.txt`](http://localhost:3040/llms.txt) and [`/llms-full.txt`](http://localhost:3040/llms-full.txt).
- **Model Context Protocol (MCP):** Remote MCP server at [`/.well-known/mcp.json`](http://localhost:3040/.well-known/mcp.json).

---

## 🏆 Hackathon Track 2 Documentation

For judging criteria alignment, architecture overhaul details, and verification proof, review:
- **Submission Reflection:** [`REFLECTION.md`](./REFLECTION.md)
- **Visual Walkthrough:** [`walkthrough.md`](./walkthrough.md)
