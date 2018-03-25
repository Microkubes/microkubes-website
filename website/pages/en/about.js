/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          'Microkubes is an open source framework, for building data management platforms by using microservices. It is based on proven technologies, that are in production in some of the most demanding applications. Microkubes’ open source framework helps you to develop projects faster and easier than ever before.Be a step ahead and save months worth of work by using our ready-to-use framework with already integrated user management (OAUTH2; JWT; SAML).',
        title: 'Framework',
      },
      {
        content: 'Its integrated development environment, allows to set the focus on solving business problems instead of wiring services together. Building a project with a single command, which starts the supporting components of your microservices, as well as the Microkubes` infrastructure.',
        title: 'Development environment',
      },
      {
        content: "High scalability and reliability\nIntegrated user management (OAUTH2; JWT; SAML)\nMicroK’s features enable you to meet demanding user expectations, faster and with less risk.",
        title: 'Main features:',
      },
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>About Microkubes</h2>
            </header>
            <p>A JavaScript framework for building data-driven React applications</p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
