---
title: "Malicious Packages"
description: "Checks every dependency in a target's SBOM inventory against OSV.dev's OpenSSF malicious-packages advisories."
---

Checks every dependency in a target's SBOM inventory against [OSV.dev](https://osv.dev)'s OpenSSF malicious-packages advisories, dependency confusion, typosquats, and packages compromised after publication, which a version-range vulnerability scanner doesn't cover.

```bash
POST /api/malicious-packages/scan?target_id=1
GET  /api/malicious-packages
```

![Malicious Packages overview](/toleman/img/screenshots/malicious-packages.svg)

## How a check runs

**Scan a repository** does two things in one step: pulls the target's current dependency inventory from GitHub's dependency graph (falling back to whatever SBOM is already on file if a GitHub import isn't available for that repo), then compares every package against OSV's dataset. Re-running it later is worth doing even on a repo already checked, since OSV adds malicious-package records continuously; a package clean at scan time can be flagged after the fact.

A hit is a **Critical** finding, so it's blocked by PR Guardrail the same way a critical-severity finding from any other scanner is; there's no separate malicious-package severity tier.

## Coverage, not just results

**Check coverage by repository** lists every target's last-checked timestamp and package count, independent of whether anything was found. OSV doesn't publish a dataset version to pin to, so "how recently was this repo checked" is the only freshness signal available; a target that shows **Clean** was actually compared, not skipped.

## Scope

The check runs against whatever SBOM the target already has. If the SBOM is stale, [regenerate it](/toleman/scanning/sbom/) before checking, or use **Import & Check** to pull a fresh inventory and check in one step.
