---
sidebar_position: 1
---

# Scanners

Toleman runs scanners **natively** as subprocesses (not by re-parsing another tool's cloud output) via `backend/app/scanners/runner.py`.

| Scanner | Type | Covers |
|---|---|---|
| **Semgrep** | SAST | Static code analysis, custom rule support |
| **Trivy** | Container/SCA | Container images, dependency vulnerabilities |
| **Gitleaks** | Secrets | Committed credentials/API keys |
| **gosec** | SAST (Go) | Go-specific security issues, auto-detected from `Finding.tool` history or GitHub's `/languages` API |
| **nuclei** | DAST | Active scanning of already-discovered API endpoints |
| **Checkov / tfsec** | IaC | Terraform, Kubernetes, CloudFormation misconfiguration |
| **ModelScan** | AI/ML | Unsafe deserialization in serialized model files |
| **semgrep-llm** | AI/ML | Toleman's OWASP LLM Top 10 ruleset, shipped in-repo |

The two AI/ML scanners only run against repositories detected as AI/ML — see [AI/ML repository security](./ai-security.md).

## Triggering a scan

```bash
POST /api/scans/run?target_id=1&tool=semgrep
```

Or from the UI: **On-Demand Scan** page → select target(s) → **Scan**. Scans dispatch async via Celery (`app.tasks.celery_app`, queue `scans`) — the request returns immediately with a tracking row; poll status rather than waiting on the request.

![On-Demand Scan page: multi-select target grid](/img/screenshots/scans.png)

A target's own detail page has one button per tool instead, for a quick one-off run:

![Target detail: per-tool scan buttons](/img/screenshots/target-detail.png)

## Tool health

`GET /api/tools/health` reports real installed versions for all four core tools, checked live inside the backend container/process — not a static capability list. Visible at **Admin → Tooling → Tools Health**:

![Admin: Tools Health tab, real installed versions](/img/screenshots/admin-tools-health.png)

## How results become Findings

Each tool's raw output is parsed (`backend/app/scanners/parsers.py`) into a common `Finding` shape, then deduplicated (`compute_dedup_hash()` fingerprints on `rule_id` + `file_path` + `tool` + normalized snippet, surviving line-shift refactors) before being persisted. See [Findings Lifecycle & Scoring](../findings/lifecycle-and-scoring.md).

## Safety

`clone_repo()` validates the repo URL (`https` + `github.com` host only), never embeds a token in the URL, and delivers the GitHub token via an `http.extraHeader` env var rather than argv — so a failed-clone error can never leak the token into a log line or API response.
