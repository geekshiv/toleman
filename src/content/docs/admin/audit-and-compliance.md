---
title: "Audit Log & Compliance Reports"
description: "Every triage decision, scan run, and API token action recorded against your data, on the Audit Log and Security Log pages."
---

## Audit log

`/api/audit/log` (login-scoped) records state changes across the platform (finding triage, role assignments, config changes) on the **Audit Log** page:

![Audit Log page](/toleman/img/screenshots/audit-log.svg)

GitHub commit activity across every connected repo has its own separate page, **GitHub Org Logs**; see [Webhooks](/toleman/github-integration/webhooks/) for what feeds it.

## Compliance reports

`/api/reports` exports your compliance posture as **CSV or PDF**, same downloadable-export pattern used by SBOM (`Content-Disposition: attachment`, fetched with credentials, downloaded as a blob). Scope to a single target, a group, or org-wide using the same "All repositories" `TargetPicker` pattern used throughout the app.

![Compliance Reports page](/toleman/img/screenshots/reports.svg)
