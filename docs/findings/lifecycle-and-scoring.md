---
sidebar_position: 1
---

# Findings Lifecycle & Priority Scoring

## Lifecycle / states

A `Finding` moves through a triage state machine, states include (at minimum) **Open**, **Mitigated**, **Accepted Risk**, **False Positive**, **Won't Fix**, and **Reopened**. `Reopened` still counts as "open" for SLA-violation purposes. Every state change is recorded in `FindingStateLog`, a real audit trail (used e.g. by the Security Score's week-over-week trend).

Bulk triage is available on the Findings page via checkbox selection + a bulk-action bar.

![Findings page: filterable list with risk score, severity, and state](/img/screenshots/findings.png)

## Deduplication

`compute_dedup_hash()` (`backend/app/core/dedup.py`) fingerprints a finding on `(rule_id, file_path, tool, normalized_snippet)`, so the same underlying issue survives line-shift refactors instead of re-appearing as a new finding. `file_path` must be normalized to be relative to the repo root (not the scan-scoped clone directory) before hashing; otherwise dedup silently breaks.

## Priority scoring

The full model, so you can predict and audit any score rather than take it on trust. It lives in `backend/app/core/scoring.py`; every signal is a **weight**, configurable per workspace at **Guardrails → Risk Scoring**, so a scan re-scores a finding the same way each time and a target that's stopped being scanned or a finding already triaged away keeps the score it last had.

A fresh workspace scores exactly as described below, this is the shipped baseline, weight `1` (or `1×`) on. Turning a weight to `0` switches that signal off entirely; nothing here can *subtract* from a score, a signal the platform can't establish leaves a finding where it was rather than pushing it down the list.

### The base

```
score = severity_weight × criticality_weight × 40      (capped at 1000)
```

| severity | weight |
|---|---|
| Critical | 5 |
| High | 4 |
| Medium | 3 |
| Low | 2 |
| Informational | 1 |

`criticality_weight` is a target's own **Business criticality** signal, 1–5, set per target when you add or edit it, clamped to that range before use. Both **Tool severity** and **Business criticality** ship as `1×` multipliers on the base formula above.

A Critical on a criticality-5 target therefore scores `5 × 5 × 40 = 1000`; an Informational on a criticality-1 target scores `40`.

### The exploitability modifiers

Applied after the base, and **only one of them applies**; KEV takes precedence:

- **CISA KEV** (baseline on): on the KEV catalog (known exploited in the wild) → the score is raised to a **floor of 900**. A floor, not an addition: observed exploitation outranks whatever the base formula said, regardless of how the base arithmetic came out.
- **EPSS** (baseline on, up to 160 pts): otherwise, FIRST's predicted probability of exploitation in the next 30 days, applied only above 50% → **+160**, capped at 1000. Below that threshold the signal is weak enough that letting it nudge scores would add movement without adding information.
- **CVSS exploitability** (baseline **off**): Attack Vector, Attack Complexity, Privileges Required and User Interaction, decomposed from the CVE's own CVSS vector. Only CVE-backed findings carry one; a finding with no decodable vector contributes nothing rather than being treated as hard to exploit.

### The reachability modifiers

Both baseline **off**, both unlisted-is-never-penalized:

- **Internet exposure**: whether the target is reachable from the public internet, read from its label and environment. A target with nothing recorded is unknown, not "not exposed", and is never penalized for it.
- **Dependency scope** (#500): whether the vulnerable package ships to production or is only a build-time dependency. A runtime dependency is reachable by anyone who can reach the deployed service; a build-time one needs someone who can already run the build. Only a package positively recorded as runtime gets the uplift.

### Fixability (#246)

Baseline **off**. Whether an upgrade that resolves the finding is already available, raises findings someone can actually close today above ones with no fix to apply.

### A worked example (shipped baseline)

A **High** severity CVE on a **criticality-3** target, EPSS 0.62, not KEV-listed:

```
base  = 4 × 3 × 40 = 480
EPSS  = 480 + 160  = 640
```

The same finding on the same target, once CISA adds it to KEV:

```
KEV floor → 900
```

### Why three signals ship off

CVSS exploitability, internet exposure and fixability default to `0`. Switching one on changes how every finding in the workspace ranks, that's a decision for whoever owns triage there to make deliberately, not an upgrade side effect sprung on an existing ranking.

### What it still does not fold into the score

- **Finding age.** Handled by SLA rules, a separate mechanism with its own configuration; see [SLA & Policy](./sla-and-policy).
- **Fixability**, even when its weight is on, is *also* kept as its own field and filter. "Worst" and "closable today" are different questions; collapsing them into one axis serves neither.

### Where the inputs come from

- **EPSS**: `core/epss.py`
- **CISA KEV**: `core/kev.py`, cached 1 hour
- **CVSS vector, internet exposure, dependency scope**: recorded per-finding/per-target where the platform can establish them; absent when it can't
- **criticality_weight**: the target's own configured criticality

## Working through a long list

Every list surface in Toleman is paginated, with a control at the top of the list as well as the bottom so the size of the result set is visible before you scroll. Rows per page is adjustable (**25, 50 or 100**) and the choice is carried in the URL, so a link to a filtered, sorted, paged view reproduces exactly what you were looking at.
