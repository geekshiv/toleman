// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://geekshiv.github.io',
	base: '/toleman/',
	integrations: [
		starlight({
			title: 'Toleman',
			description: 'The free, open-source DevSecOps vulnerability management platform',
			logo: {
				src: './src/assets/brand-mark.svg',
				replacesTitle: false,
			},
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/toleman-platform/toleman-platform' },
			],
			editLink: {
				baseUrl: 'https://github.com/geekshiv/toleman/edit/main/',
			},
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Quickstart', slug: 'getting-started/quickstart' },
						{ label: 'Architecture Overview', slug: 'getting-started/architecture-overview' },
					],
				},
				{
					label: 'GitHub Integration',
					items: [
						{ label: 'Connecting GitHub', slug: 'github-integration/connecting-github' },
						{ label: 'Targets & Repo Groups', slug: 'github-integration/targets-and-groups' },
						{ label: 'CI/CD Pipeline Integration', slug: 'github-integration/pipeline-integration' },
						{ label: 'PR Guardrail', slug: 'github-integration/pr-guardrail' },
						{ label: 'Webhooks', slug: 'github-integration/webhooks' },
					],
				},
				{
					label: 'Scanning',
					items: [
						{ label: 'Scanners', slug: 'scanning/scanners' },
						{ label: 'API Discovery & Active Scanning', slug: 'scanning/api-discovery-and-scanning' },
						{ label: 'SBOM', slug: 'scanning/sbom' },
						{ label: 'Malicious Packages', slug: 'scanning/malicious-packages' },
						{ label: 'AI/ML Repository Security', slug: 'scanning/ai-security' },
						{ label: 'AIBOM (AI Bill of Materials)', slug: 'scanning/aibom' },
					],
				},
				{
					label: 'Findings & Triage',
					items: [
						{ label: 'Lifecycle & Priority Scoring', slug: 'findings/lifecycle-and-scoring' },
						{ label: 'Enrichment & AI Analysis', slug: 'findings/enrichment-and-ai-analysis' },
						{ label: 'SLA Rules & Policy', slug: 'findings/sla-and-policy' },
					],
				},
				{
					label: 'Admin & Management',
					items: [
						{ label: 'Users & Roles', slug: 'admin/users-and-roles' },
						{ label: 'Workspaces & API Keys', slug: 'admin/workspaces-and-api-keys' },
						{ label: 'Platform Config', slug: 'admin/platform-config' },
						{ label: 'Audit Log & Compliance Reports', slug: 'admin/audit-and-compliance' },
					],
				},
				{
					label: 'Dashboard',
					items: [
						{ label: 'Widgets & Security Score', slug: 'dashboard/widgets-and-security-score' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Public API Reference', slug: 'reference/api' },
						{ label: 'Public API Specification', slug: 'reference/public-api' },
						{ label: 'MCP Server', slug: 'reference/mcp-server' },
					],
				},
			],
		}),
	],
});
