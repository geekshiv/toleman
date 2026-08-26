---
sidebar_position: 5
---

# Webhooks

GitHub webhook deliveries (push, PR events, installation changes) land on `POST /api/webhooks/github`.

- Verified by **HMAC signature** against the webhook secret, not session auth
- Rotate the secret without recreating the App via `PATCH /api/github-app/webhook-secret`
- Delivery failures/retries are visible in GitHub's own App settings (**Advanced → Recent Deliveries**) — Toleman doesn't re-implement a delivery-retry UI

Org-wide activity fed by these deliveries is visible in the **GitHub Org Logs** page — real commit activity pulled live from every connected repo, filterable by repo and date range:

![GitHub Org Logs page](/img/screenshots/github-org-logs.png)
