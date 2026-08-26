---
sidebar_position: 2
---

# Public API specification

Programmatic access to targets, findings and scans, authenticated with a personal access token. Intended for scripts, CI jobs and third-party integrations; not browser sessions.

**[Download the OpenAPI 3.1 spec](/openapi/toleman-public-v1.json)**, generated from the running application, so it describes what the API actually does rather than what someone remembered it doing. Import it into Postman, Insomnia, or any OpenAPI client generator.

## Authentication

Every endpoint takes a bearer token:

```
Authorization: Bearer toleman_pat_...
```

Create one in **Settings → Workspace → API tokens**. The plaintext value is shown **once, at creation**; Toleman stores only a SHA-256 hash, so a lost token cannot be recovered and must be revoked and replaced.

### Scopes

| Scope | Allows |
|---|---|
| `read` | All `GET` endpoints |
| `read_write` | The above, plus `POST /scans` |

A `read` token calling a write endpoint gets `403`, not `401`; it authenticated fine, it simply is not permitted:

```json
{ "detail": "this token is read-only; a read_write token is required" }
```

### Failure responses

| Status | Meaning |
|---|---|
| `401` | `missing or malformed Authorization header` |
| `401` | `invalid or revoked API token` |
| `403` | Token is read-only and the endpoint writes |
| `429` | Rate limit exceeded |

## Endpoints

| Method | Path | Description | Query parameters |
|---|---|---|---|
| `GET` | `/api/public/v1/findings` | List Findings | `target_id`, `severity`, `state`, `page`, `page_size` |
| `GET` | `/api/public/v1/findings/{finding_id}` | Get Finding | — |
| `POST` | `/api/public/v1/scans` | Trigger Scan | `target_id`, `tool` |
| `GET` | `/api/public/v1/scans/{scan_id}` | Get Scan | — |
| `GET` | `/api/public/v1/targets` | List Targets | — |
| `GET` | `/api/public/v1/targets/{target_id}` | Get Target | — |

Every response is scoped to the workspaces the token's owner can access. A token never grants more than the user who created it, revoking the user's access revokes the token's reach with it.

## Examples

List open critical findings:

```bash
curl -H "Authorization: Bearer $TOLEMAN_TOKEN" \
  "https://your-toleman-host/api/public/v1/findings?severity=Critical&state=Open"
```

Trigger a scan (requires `read_write`). Note the parameters are **query string**, not a JSON body:

```bash
curl -X POST -H "Authorization: Bearer $TOLEMAN_TOKEN" \
  "https://your-toleman-host/api/public/v1/scans?target_id=1&tool=semgrep"
```

Scans are dispatched asynchronously. The response carries a scan id; poll it rather than holding the request open:

```bash
curl -H "Authorization: Bearer $TOLEMAN_TOKEN" \
  "https://your-toleman-host/api/public/v1/scans/123"
```

## Interactive reference

A running Toleman deployment serves live, interactive API docs at **`/docs`** (Swagger UI) and **`/redoc`**, covering the full internal API as well as these public endpoints. The public endpoints declare their security scheme, so Swagger UI's **Authorize** button works with a personal access token.

## Versioning

The path carries the version (`/api/public/v1`). Breaking changes will land under a new prefix rather than mutating `v1` beneath existing callers.

:::note Internal API
Everything outside `/api/public/v1` is the application's own interface, used by the Toleman UI via session cookies. It is not versioned and changes without notice. Build integrations against the public API.
:::
