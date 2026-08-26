---
sidebar_position: 1
---

# Public API Reference

A versioned, token-authenticated API for scripts, CI, and third-party integrations; distinct from the internal API the frontend uses (session-cookie authenticated) and from the workspace API key (CI-ingest-only, `/api/ingest/{target_id}`).

## Authentication

Create a personal access token at **Settings → Workspace → API Tokens**. The token is shown once at creation time; copy it immediately, it can't be retrieved again.

![Settings: API Tokens card](/img/screenshots/settings-workspace.png)

Send it as a Bearer token:

```bash
curl -H "Authorization: Bearer toleman_pat_..." \
  https://your-toleman-instance/api/public/v1/targets
```

## Scope

Every token is either:

- **Read-only** (default); can call every `GET` endpoint below
- **Read/write**: can also call the write endpoint (trigger a scan)

Request read/write explicitly when creating the token if you need it; the default is read-only.

## Endpoints (`/api/public/v1`)

| Method | Path | Scope | Description |
|---|---|---|---|
| GET | `/targets` | read | List targets in your accessible workspaces |
| GET | `/targets/{id}` | read | Get a single target |
| GET | `/findings` | read | List findings, filterable by `target_id`, `severity`, `state`; paginated (`page`, `page_size`) |
| GET | `/findings/{id}` | read | Get a single finding |
| GET | `/scans/{id}` | read | Get a scan's status |
| POST | `/scans?target_id=&tool=` | read/write | Trigger a native scan (same async dispatch as the UI's On-Demand Scan) |

All list endpoints are scoped to workspaces your token's owning user is a member of, the same `accessible_workspace_ids` scoping every internal endpoint uses. There's no cross-workspace visibility beyond what that user could already see in the UI.

## Versioning

`v1` in the path; a future breaking `v2` can exist alongside it rather than forcing every integration to update in lockstep.

## Managing tokens

List, name, and revoke tokens from the same **Settings → Workspace → API Tokens** card. Revoking is immediate, no grace period.
