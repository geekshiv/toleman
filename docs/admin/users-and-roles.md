---
sidebar_position: 1
---

# Users & Roles

Toleman uses a two-layer role system.

## Global role

Every `User` has one global `UserRole`: `admin`, `user`, `viewer`, `developer`, or `security_engineer`. **Admins bypass all workspace scoping** — they see every workspace's data with no filtering.

Manage users: **Admin → Access → User Management**, or `/api/admin` (admin-only).

![Admin: User Management tab](/img/screenshots/admin-users.png)

## Workspace role

`WorkspaceMembership` (user_id, workspace_id, `WorkspaceRole`) layers a **workspace-scoped** role on top of the global one. Non-admin visibility on every GET/list endpoint over workspace-owned resources (targets, findings, scans, etc.) is filtered through `accessible_workspace_ids()` — a user only sees workspaces they're a member of.

Assign roles: **Admin → Access → Workspace Roles**, or `/api/admin/workspace-roles`.

![Admin: Workspace Roles tab](/img/screenshots/admin-workspace-roles.png)

## Auth

Login is pbkdf2-hashed password + HMAC-signed session cookie — no external auth service (`app/core/security.py`). Route protection on the frontend lives in `src/proxy.ts`.

The seeded admin account (`ADMIN_EMAIL`/`ADMIN_PASSWORD` in backend `.env`, default `admin@toleman.local` / `changeme123`) is created on first backend startup — **change the password before any non-local use.**
