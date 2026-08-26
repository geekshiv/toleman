import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Toleman',
  tagline: 'The free, open-source DevSecOps vulnerability management platform',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: 'https://geekshiv.github.io',
  baseUrl: '/toleman/',

  organizationName: 'geekshiv',
  projectName: 'toleman',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'documentation',
          editUrl: 'https://github.com/geekshiv/toleman/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/toleman-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Toleman',
      logo: {
        alt: 'Toleman',
        src: 'img/brand-mark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/toleman-platform/toleman-platform',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Getting Started', to: '/documentation/getting-started/quickstart'},
            {label: 'GitHub Integration', to: '/documentation/github-integration/connecting-github'},
            {label: 'Scanning', to: '/documentation/scanning/scanners'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub Issues', href: 'https://github.com/toleman-platform/toleman-platform/issues'},
            {label: 'Discussions', href: 'https://github.com/toleman-platform/toleman-platform/discussions'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub Repo', href: 'https://github.com/toleman-platform/toleman-platform'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Toleman. 100% free & open-source.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
