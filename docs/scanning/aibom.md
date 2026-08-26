---
sidebar_position: 5
---

# AIBOM (AI Bill of Materials)

An ordinary SBOM inventories **packages**. An AIBOM inventories the parts a package SBOM is blind to: **models, datasets, and their lineage**.

Toleman emits **CycloneDX 1.6**, which added first-class machine-learning component types. That format was chosen over SPDX 3.0's AI profile for a practical reason: Toleman already produces CycloneDX for its SBOM, so the AIBOM extends an existing pipeline rather than introducing a second format.

## How it is generated

Extraction runs during the existing SBOM generation for a target — the checkout is already there, so an AIBOM costs no extra clone and no extra tooling. Generate an SBOM for a target and its AIBOM is populated alongside it.

Detected references include Hugging Face models (`from_pretrained`, `hf_hub_download`), hosted API models (`model="gpt-5"`), and datasets (`load_dataset`).

## Viewing and exporting

**SBOM & OSS Vulns** → select a target → **AI Bill of Materials** tab. Export produces a CycloneDX 1.6 document validated against the published schema.

![SBOM page](/img/screenshots/sbom.png)

## Unknown provenance is stated, never assumed

This is the most important thing to understand about the output.

Model and dataset lineage frequently **cannot** be determined from source. A repository calling `openai.chat.completions.create(model="gpt-5")` has a real model dependency with no accessible training-data provenance and no version to pin.

Toleman records those facts as an explicit `unknown` rather than omitting them:

- An absent `modelCard` reads as *"not applicable"*.
- An explicit `unknown` reads as *"we looked and could not tell"*.

Those are materially different claims, and only the second is true. A compliance artifact that silently implies full provenance is a liability rather than a feature.

The same distinction applies to the view itself: a target whose AIBOM has never been generated shows *"No AIBOM generated yet"*, not an empty list. A repository nobody has analysed is unknown, not clean.

Components with no pinned revision are flagged `unpinned` — the referenced weights can change after you review them, which is the model-supply-chain equivalent of an unpinned dependency.
