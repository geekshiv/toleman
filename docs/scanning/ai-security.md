---
sidebar_position: 4
---

# AI/ML repository security

Conventional SAST and SCA are blind to the parts of an AI repository where risk actually concentrates. Toleman adds four things for repos that build AI products or carry AI features.

## Why a separate category

- **Serialized model files.** `pickle.load()` executes code. A hostile `.pkl` or `.pt` is remote code execution at load time, with no exploit chain and no user interaction — the weights file *is* the payload. Ordinary SAST never opens binary artifacts.
- **Model and dataset lineage.** A package SBOM tells you `transformers==4.44.0`. It tells you nothing about which model is pulled at runtime, from where, or at what revision.
- **LLM-specific code patterns.** Model output reaching `eval`, a shell, or SQL is classic injection where the untrusted source happens to be a model.

## Which repos are scanned

AI-specific scanners only run on repositories detected as AI/ML. Detection is automatic, from two independent signals:

1. **Model artifacts** in the checkout — `.pkl`, `.pt`, `.safetensors`, `.h5`, `.onnx`, `.gguf` and similar.
2. **AI/ML dependencies** in the target's existing SBOM inventory — `torch`, `transformers`, `openai`, `anthropic`, `@langchain/*`, vector-store clients and so on, across npm, PyPI and Go.

An explicit per-target toggle was considered and rejected: someone has to remember to set it, and an unflagged AI repo then silently gets zero AI coverage. Detection re-runs on every scan, so a repository becomes an AI repo the day someone adds `openai` to `package.json`.

Detection records **why** it fired, visible in the tooltip on the AI/ML badge — a bare flag is not contestable. A manual override is available in both directions and wins over detection, while detection keeps updating underneath it, so "auto-detected" and "manually set" stay distinguishable.

![Targets list showing the AI/ML badge](/img/screenshots/targets-list.png)

## Model-file scanning (ModelScan)

Scans serialized models for unsafe deserialization operators.

```bash
POST /api/scans/run?target_id=1&tool=modelscan
```

Findings arrive as **Critical**, which means the existing PR Guardrail blocks them with no extra configuration — `should_block()` decides on severity alone. That severity is floored independently of what ModelScan itself reports: there is no such thing as a low-severity arbitrary-code primitive in a checked-in weights file.

The finding points at the file, not a line number. A fabricated line offset into a binary would send a reader nowhere useful.

## LLM code rules (semgrep-llm)

A curated OWASP LLM Top 10 ruleset shipped inside Toleman rather than pulled from a hosted registry, so results are reproducible and work offline.

Covers:

- LLM output flowing into `eval`/`exec`, a shell, or SQL
- `torch.load()` without `weights_only=True`
- `pickle`/`joblib`/`dill` loads of model artifacts
- Hugging Face model references with no pinned `revision`

Rules use real dataflow (taint) rather than pattern-matching the sink alone, and are deliberately kept small and high-precision. A rule that fires on every subprocess call in a file that happens to import an LLM SDK is worse than no rule.

:::note AI provider secrets are already covered
API keys for OpenAI, Anthropic, Hugging Face, Cohere and Perplexity are detected by the **Gitleaks** scanner that already runs on every repository. No AI-specific configuration is needed for secrets.
:::

## AI Bill of Materials

See [AIBOM](./aibom.md).
