---
sidebar_position: 2
---

# Workspaces & API Keys

## Structure

`Organization` → `Workspace` → `Target`. A workspace is the unit most access control, SLA rules, and enforcement modes are scoped to.

## Bootstrapping

```bash
curl -X POST "http://localhost:8000/api/workspaces/bootstrap?org_name=myorg&workspace_name=default"
```

Creates an Org + Workspace + API key for CI push auth in one call — used for first-time setup before any admin session exists.

## API keys

Each workspace has an API key used to authenticate:

- CI/CD SARIF pushes to `/api/ingest/{target_id}`
- Generated pipeline-integration workflows (`TOLEMAN_API_KEY` secret)

Manage/rotate a target's key: `GET /api/targets/{id}/workspace-key`, `POST .../workspace-key/regenerate`. Keys are never echoed back in plaintext after creation except at generation time — the UI shows a masked value with a rotate action, not the raw key on every load, at **Settings → Workspace**:

![Settings: masked workspace API key](/img/screenshots/settings-workspace.png)

This key is separate from your session cookie and from the GitHub App's installation token — three distinct trust boundaries, each scoped to what it needs.

## Personal access tokens (public API)

Distinct again from the workspace API key above: a personal access token (created in the same **API Tokens** card, just below the workspace key) authenticates you specifically against the [Public API](../reference/api.md) — read-only by default, optionally read/write to also trigger scans. See the Public API Reference for the full endpoint list and scope model.
