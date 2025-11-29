import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'HUMΛN-Ø Docs',
  tagline: 'Sustainable impact through Web3 technology',
  favicon: 'img/favicon.ico',
  clientModules: [require.resolve('./src/client')],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://human-0.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/documentation/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lstech-solutions', // Usually your GitHub org/user name.
  projectName: 'human-0.com', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Internationalization configuration - ENABLED for proper language switching
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'es', 'pt', 'fr', 'ar', 'zh'],
    localeConfigs: {
      en: {
        label: '🇺🇸 English',
        direction: 'ltr',
      },
      de: {
        label: '🇩🇪 Deutsch',
        direction: 'ltr',
      },
      es: {
        label: '🇪🇸 Español',
        direction: 'ltr',
      },
      pt: {
        label: '🇧🇷 Português',
        direction: 'ltr',
      },
      fr: {
        label: '🇫🇷 Français',
        direction: 'ltr',
      },
      ar: {
        label: '🇸🇦 العربية',
        direction: 'rtl',
      },
      zh: {
        label: '🇨🇳 中文',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/lstech-solutions/human-0.com/tree/main/apps/docs',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Configure locale persistence and navigation
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HUMΛN-Ø',
      logo: {
        alt: 'HUMΛN-Ø Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://human-0.com',
          label: '← Back to Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/lstech-solutions/human-0.com',
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
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/docs/privacy',
            },
            {
              label: 'Terms of Service',
              to: '/docs/terms',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/lstech-solutions/human-0.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'HUMΛN-Ø Main Site',
              href: 'https://human-0.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LSTS SAS. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
