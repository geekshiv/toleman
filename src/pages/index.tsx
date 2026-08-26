import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className="hero hero--primary" style={{padding: '5rem 0 4rem'}}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link className="button button--secondary button--lg" to="/documentation/getting-started/quickstart">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{color: '#e2e8f0', borderColor: '#e2e8f0'}}
            to="https://github.com/toleman-platform/toleman-platform">
            View on GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

const PROBLEMS = [
  {
    title: 'Fragmented tooling',
    body: 'SAST, container/SCA, secrets, and Go-specific scanners each live in their own silo, with no shared UI, dedup, or prioritization across them.',
  },
  {
    title: 'Enterprise features behind a paywall',
    body: 'SSO, RBAC, and PR-level enforcement are routinely gated behind paid tiers in existing vulnerability management platforms; even for small teams.',
  },
  {
    title: 'Finding fatigue',
    body: 'The same underlying issue re-appears as a "new" finding after every refactor, and nothing tells you which of a thousand findings actually matters this week.',
  },
  {
    title: 'Aggregation without action',
    body: 'Most platforms only aggregate other tools’ output. They don’t run scanners themselves, manage tool installs, or actually block a risky PR.',
  },
];

const SOLUTIONS = [
  {
    title: 'One platform, native scanners',
    body: 'Semgrep, Trivy, Gitleaks, gosec, and nuclei run natively; Toleman manages tool installs and dispatches real scans, it doesn’t just parse someone else’s report.',
  },
  {
    title: 'Real deduplication',
    body: 'A dedup fingerprint keyed on rule + file + tool + normalized snippet survives line-shift refactors, so the same issue stays one finding.',
  },
  {
    title: 'Context-aware prioritization',
    body: 'Severity × target criticality, boosted by live EPSS exploit-prediction and CISA KEV known-exploited data; not a static severity label.',
  },
  {
    title: 'PR Guardrail, for real',
    body: 'Diff-scans a pull request for net-new findings and enforces block/alert/disabled per target, group, or workspace; with an accept-risk approval workflow.',
  },
  {
    title: '100% free, always',
    body: 'SSO, RBAC, SLA rules, policy-as-code, Slack/Jira integration; every feature ships free. No paid tier, no feature gating, ever.',
  },
  {
    title: 'Enterprise-grade polish',
    body: 'A modern, developer-first UI with dark/light themes; built to feel like a premium product, not a weekend side project.',
  },
];

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{padding: '3.5rem 0'}}>
      <div className="container">
        <p
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--ifm-color-primary)',
            marginBottom: '0.5rem',
          }}>
          {eyebrow}
        </p>
        <Heading as="h2" style={{marginBottom: '2rem'}}>
          {title}
        </Heading>
        {children}
      </div>
    </section>
  );
}

function CardGrid({items}: {items: {title: string; body: string}[]}) {
  return (
    <div className="row">
      {items.map((item) => (
        <div key={item.title} className="col col--6" style={{marginBottom: '1.5rem'}}>
          <div className="card" style={{height: '100%', padding: '1.5rem'}}>
            <Heading as="h3" style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>
              {item.title}
            </Heading>
            <p style={{marginBottom: 0, color: 'var(--ifm-color-content-secondary)'}}>{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <Section eyebrow="The problem" title="Security tooling is fragmented, gated, and noisy">
          <CardGrid items={PROBLEMS} />
        </Section>
        <Section eyebrow="How Toleman solves it" title="One free platform that actually runs the scanners">
          <CardGrid items={SOLUTIONS} />
        </Section>
        <section style={{padding: '2rem 0 5rem', textAlign: 'center'}}>
          <div className="container">
            <Heading as="h2">Ready to try it?</Heading>
            <p style={{color: 'var(--ifm-color-content-secondary)', marginBottom: '1.5rem'}}>
              Clone it, run one command, and scan your first repo in minutes. No waitlist, no gated
              access; Toleman is self-hosted and free from day one.
            </p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link className="button button--primary button--lg" to="/documentation/getting-started/quickstart">
                Read the Quickstart
              </Link>
              <Link
                className="button button--outline button--lg"
                to="https://github.com/geekshiv/toleman/discussions/1">
                Get notified about releases
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
