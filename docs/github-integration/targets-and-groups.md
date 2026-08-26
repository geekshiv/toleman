---
sidebar_position: 2
---

# Targets & Repo Groups

A **Target** is a repo Toleman scans. Targets belong to a Workspace.

## Adding a target

```bash
POST /api/targets
{
  "workspace_id": 1,
  "name": "myrepo",
  "repo_url": "https://github.com/org/repo.git",
  "default_branch": "main",
  "label": "Dev",
  "criticality_weight": 2
}
```

Or use the **Targets** page in the UI, which drives the same endpoint. `criticality_weight` feeds priority scoring (see [Findings Lifecycle & Scoring](../findings/lifecycle-and-scoring.md)) and is shown per row as *Risk N/5*.

![Targets: repository inventory](/img/screenshots/targets-list.png)

Each row leads with the number that matters: open findings on the default branch, with critical (`C`) and high (`H`) counts beside it. A repository that has never been scanned shows **not scanned** rather than a zero — nobody looked, which is not the same as clean.

The list sorts by **most findings** by default, since that is the question the page exists to answer. Other orders are most-severe, least-recently-scanned (never-scanned first) and name. Rows per page is adjustable (25/50/100).

`PATCH /api/targets/{id}` updates a target — including `api_base_url`, which is the *only* source of a host for [Active API Scanning](../scanning/api-discovery-and-scanning.md); a nuclei scan can never be pointed at an arbitrary third-party URL.

## The target detail page

A target has three sub-pages, each with its own URL so it can be linked from a finding, a PR comment or a Slack alert:

| Tab | Contents |
|---|---|
| **Overview** | Open findings by severity, last scan and which tools ran, default branch, risk weight, AI/ML detection status |
| **Vulnerabilities** | This target's findings, with the same triage, filtering and bulk actions as the main Findings page |
| **Settings** | Groups, PR Guardrail enforcement, Active API Scanning, CI pipeline integration |

![Target detail page](/img/screenshots/target-detail.png)

Link directly to a tab with `?tab=overview`, `?tab=vulnerabilities` or `?tab=settings`.

## Groups & tags

Targets can be organized into **Groups** — `GET/POST/DELETE /api/targets/{id}/groups/{group_id}`. Groups let you set shared configuration (enforcement mode, SLA rules) that applies to every target in the group instead of per-repo. See [PR Guardrail](./pr-guardrail.md) for how group-level settings resolve.

## The "All repos" pattern

Wherever you see a repo dropdown (SBOM, Reports, Dashboard scoping), Toleman uses one consistent pattern: a single dropdown with an "All repositories" entry at the top, not a separate tab or toggle. This is the `TargetPicker` component's `allowAll` prop, reused across every page that needs org-wide vs. per-repo scoping.

## Workspace API key

Each target's workspace has an API key (`GET /api/targets/{id}/workspace-key`, regenerate via `POST .../workspace-key/regenerate`) used to authenticate CI/CD pushes to the [ingest endpoint](./pipeline-integration.md) — this is separate from your session login and from the GitHub App token. Manage it from **Settings → Workspace**:

![Settings: masked workspace API key with reveal/copy/rotate](/img/screenshots/settings-workspace.png)
