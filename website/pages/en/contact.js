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

class ContactForm extends React.Component {
  render() {
    return (
      // Initialize the HubSpot contact form
      <div className="contact-form">
        <script src="js/contact.js"></script>
      </div>
    );
  }
}

class Help extends React.Component {
  render() {
    const supportLinks = [
      {
        content:
          'If you are interested in finding out more about how to efficiently build your microservice architecture projects with Microkubes, please don\'t hesitate to reach out to us.',
        title: 'Contact',
      },

    ];

    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer documentContainer postContainer">
            <GridBlock contents={supportLinks} />
            <ContactForm></ContactForm>
        </Container>
      </div>
    );
  }
}

module.exports = Help;
