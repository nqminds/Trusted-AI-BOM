// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import configs from "../../config.json";
import 'dotenv/config';

// @ts-ignore
const {TITLE, PUBLIC_DOCUSAURUS_URL, TAGLINE, PROJECT_NAME, GITHUB_OWNER, GITHUB_REPO} = configs;

const config = {
  title: TITLE,
  tagline: TAGLINE,
  favicon: 'img/favicon.svg',
  customFields: {
    // Put your custom environment here
    octokitToken: process.env.OCTOKIT_TOKEN,
  },
  url: PUBLIC_DOCUSAURUS_URL,
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  organizationName: 'nqminds',
  projectName: PROJECT_NAME,
  trailingSlash: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('prism-react-renderer/themes/github').Options} */
      {
        docs: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ]
  ],
  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
  },
  plugins: [
    [
      'docusaurus-lunr-search', {},
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "docs",
        path: "./docs/working-docs",
        routeBasePath: "docs",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "schemas",
        path: "./docs/schemas",
        routeBasePath: "schemas",
      },
    ],
     [
      "@docusaurus/plugin-content-docs",
      {
        id: "sdk",
        path: "./docs/sdk",
        routeBasePath: "sdk",
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'NquiringMinds',
          src: 'img/logo.png',
          width: "500px !important"
        },
        items: [
        {
          type: 'doc',
          docId: 'intro',
          docsPluginId: "docs",
          position: 'left',
          label: 'Working docs',
        },
        {
          type: 'doc',
          docId: 'schemas',
          docsPluginId: "schemas",
          position: 'left',
          label: 'Schemas',
        },
        {
          type: 'doc',
          docId: 'sdk',
          docsPluginId: "sdk",
          position: 'left',
          label: 'SDK',
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
                label: 'Working Docs',
                to: '/docs',
              }
            ],
          },
          {
            title: 'Schemas',
            items: [{
              label: 'Data schemas',
              to: '/schemas',
          }],
          },
          {
            title: 'More',
            items: [

              {
                label: 'GitHub',
                href: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} NquiringMinds LTD. Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'light', // or 'dark' if you prefer
        disableSwitch: true, // Disables the theme switcher
      },
    }),
};

export default config;
