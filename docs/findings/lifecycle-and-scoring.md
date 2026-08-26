---
sidebar_position: 1
---

# Findings Lifecycle & Priority Scoring

## Lifecycle / states

A `Finding` moves through a triage state machine — states include (at minimum) **Open**, **Mitigated**, **Accepted Risk**, **False Positive**, **Won't Fix**, and **Reopened**. `Reopened` still counts as "open" for SLA-violation purposes. Every state change is recorded in `FindingStateLog`, a real audit trail (used e.g. by the Security Score's week-over-week trend).

Bulk triage is available on the Findings page via checkbox selection + a bulk-action bar.

![Findings page: filterable list with risk score, severity, and state](/img/screenshots/findings.png)

## Deduplication

`compute_dedup_hash()` (`backend/app/core/dedup.py`) fingerprints a finding on `(rule_id, file_path, tool, normalized_snippet)`, so the same underlying issue survives line-shift refactors instead of re-appearing as a new finding. `file_path` must be normalized to be relative to the repo root (not the scan-scoped clone directory) before hashing — otherwise dedup silently breaks.

## Priority scoring

The full model, so you can predict and audit any score rather than take it on trust. It lives in `backend/app/core/scoring.py` and is about twenty lines — there is no machine learning here and nothing hidden.

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

`criticality_weight` is 1–5, set per target when you add or edit it. It is clamped to that range before use, so a value outside it cannot distort the scale.

A Critical on a criticality-5 target therefore scores `5 × 5 × 40 = 1000`; an Informational on a criticality-1 target scores `40`.

### The exploitability modifiers

Applied after the base, and **only one of them applies** — KEV takes precedence:

- **On CISA's KEV list** (known exploited in the wild) → the score is raised to **at least 900**. A floor, not an addition: something being actively exploited is near the top of the list regardless of how the base arithmetic came out.
- **Otherwise, EPSS > 0.5** → **+160**, capped at 1000. Roughly one severity tier at mid criticality.

EPSS between 0 and 0.5 contributes nothing. That is deliberate: below that threshold the signal is weak enough that letting it nudge scores would add movement without adding information.

### A worked example

A **High** severity CVE on a **criticality-3** target, EPSS 0.62, not KEV-listed:

```
base  = 4 × 3 × 40 = 480
EPSS  = 480 + 160  = 640
```

The same finding on the same target, once CISA adds it to KEV:

```
KEV floor → 900
```

### What it deliberately does not consider

- **Reachability.** We do not currently know whether your code actually calls the vulnerable function, so the score does not pretend to. This is the largest single source of noise in any SCA tool's ranking, and closing it is tracked as design work rather than quietly approximated.
- **Finding age.** Handled by SLA rules, which are a separate mechanism with their own configuration — see [SLA & Policy](./sla-and-policy).
- **Fixability.** Whether an upgrade exists is surfaced as its own field and filter rather than folded into one number, because "worst" and "closable today" are different questions and collapsing them serves neither.

### Where the inputs come from

- **EPSS** — `core/epss.py`
- **CISA KEV** — `core/kev.py`, cached 1 hour
- **criticality_weight** — the target's own configured criticality

## Working through a long list

Every list surface in Toleman is paginated, with a control at the top of the list as well as the bottom so the size of the result set is visible before you scroll. Rows per page is adjustable — **25, 50 or 100** — and the choice is carried in the URL, so a link to a filtered, sorted, paged view reproduces exactly what you were looking at.
