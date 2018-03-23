/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
];

const siteConfig = {
  title: 'Microkubes' /* title for your website */,
  tagline: 'A microservice framework',
  url: 'https://www.microkubes.com' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  projectName: 'microkubes',
  headerLinks: [
    {doc: 'introduction-to-microkubes', label: 'Docs'},
    {page: 'help', label: 'Support'},
		{
      href: 'https://github.com/microkubes/microkubes',
      label: 'GitHub',
    },
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Keitaro Inc',
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/facebook/test-site',
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
};

module.exports = siteConfig;
