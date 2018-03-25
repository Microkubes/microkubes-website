/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          "Learn more using the [documentation on this site.](/test-site/docs/en/doc1.html)",
        title: "Browse Docs"
      },
      {
        content:
          "Ask questions about the [documentation and project](https://github.com/Microkubes/microkubes.github.io)",
        title: "Join the community"
      }
    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
          <div className="post">
            <header className="postHeader">
              <h2>Need help?</h2>
            </header>
            <p>
              Microkubes is an open source project licensed under the Apache
              License 2.0. The source code can be found on Github. The main
              sponsor for Microkubes is Keitaro. Keitaro is a Linux and
              open-source software consultancy with strong focus in
              microservices, bleeding edge technologies and managed services. If
              you encounter any issues and need help, contact the Keitaro team
              here. We encourage contributions from the community. For issues
              and suggestions, please log them on the Microkubes repository on
              Github.
            </p>
            <GridBlock contents={supportLinks} layout="threeColumn" />
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
