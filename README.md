# Toleman Docs

📖 **[geekshiv.github.io/toleman](https://geekshiv.github.io/toleman/)**

Knowledgebase for [Toleman](https://github.com/toleman-platform/toleman-platform), a 100% free, open-source DevSecOps vulnerability management platform. It orchestrates best-of-breed OSS scanners (Semgrep, Trivy, Gitleaks, gosec) with a modern developer-first UI, intelligent deduplication, context-aware prioritization, and PR-level enforcement.

Covers setup, GitHub integration, scanning, findings & triage, admin & management, and dashboards. Visit the site above to get started.

## Stack

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev      # local dev server
npm run build    # static output in dist/
npm run preview  # serve the built output locally
```

Content lives in `src/content/docs/`, one Markdown file per page, grouped into directories that map to the sidebar (configured in `astro.config.mjs`). Screenshots in `public/img/screenshots/` are hand-built SVG illustrations rather than raw app captures, kept in sync with the real UI's data, nav, and theme by hand.
