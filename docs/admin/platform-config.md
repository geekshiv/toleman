---
sidebar_position: 3
---

# Platform Config

**Admin → Global Integrations** tab (`/api/config`, admin-only) holds every cross-cutting integration setting:

- **AI provider** — Anthropic or OpenAI-compatible endpoint + key, used by [AI Analysis](../findings/enrichment-and-ai-analysis.md)
- **Slack** — incoming webhook URL for notifications
- **Jira** — base URL, API token, project key, issue type, and an auto-create severity threshold
- **SIEM export** — a generic outbound webhook URL and an auto-export severity threshold

![Admin: Global Integrations tab](/img/screenshots/admin-integrations.png)

## Secrets at rest

Secret fields (GitHub App secrets, the OpenAI-compatible provider key, Slack webhook URL, Jira API token) are encrypted with Fernet (`encrypt_secret()`/`decrypt_secret()` in `core/crypto.py`, key from `PLATFORM_ENCRYPTION_KEY`) and never echoed back in plaintext — the API returns a `*_set: boolean` instead of the value once configured.

`PlatformConfig.anthropic_api_key` is a known pre-existing plaintext exception — not a pattern to copy for new secret fields.

## Testing a connection

`POST /api/config/test-slack`, `POST /api/config/test-jira`, and `POST /api/config/test-siem` make **real outbound calls** to verify credentials — used by the "Test Connection" buttons next to each integration, not a mocked check.

## Auto-ticket creation

`jira_auto_create_severity` is a single severity threshold (e.g. "Critical" auto-creates a Jira ticket for Critical-or-above findings). It's checked once, right after a net-new finding is committed — best-effort: a Jira outage is logged, never raised, so it can't fail a scan. This is deliberately a single scalar rather than a full rule table (unlike Policy/SLA rules) — a natural next step if more granular criteria are needed later.

## SIEM export (#114)

`siem_webhook_url` + `siem_export_severity` follow the exact same shape as Jira's auto-create threshold above, checked at the same net-new-finding-committed hook point. One JSON `POST` per qualifying finding, generic field names (not CEF/LEEF) so almost any SIEM/log pipeline can ingest it directly (Splunk HTTP Event Collector, Elastic/Datadog generic webhook input) or relay it through a small middleware — deliberately not one vendor's proprietary wire format for this first version. Event shape:

```json
{
  "source": "toleman",
  "event_type": "finding",
  "finding_id": 123,
  "dedup_hash": "...",
  "severity": "Critical",
  "priority_score": 850,
  "state": "Open",
  "title": "...",
  "tool": "semgrep",
  "rule_id": "...",
  "file_path": "app/main.py",
  "line_start": 42,
  "cve_id": null,
  "epss_score": null,
  "kev_listed": false,
  "target_id": 6,
  "target_name": "my-repo",
  "repo_url": "https://github.com/org/my-repo.git",
  "branch": "main",
  "first_seen": "2026-08-15T14:00:00Z"
}
```
