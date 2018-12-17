/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}${doc}`;
  }

  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('installation-and-setup.html', this.props.language)}>
              Getting Started
            </a>
            <a href={this.docUrl('introduction.html', this.props.language)}>
              Microkubes Manual
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href="http://stackoverflow.com/questions/tagged/microkubes"
              target="_blank">
              Stack Overflow
            </a>
          </div>
          <div>
            <h5>Social</h5>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/microkubes/microkubes/stargazers"
              data-show-count={true}
              data-count-aria-label="# stargazers on GitHub"
              aria-label="Star this project on GitHub">
              Star
            </a>
            {this.props.config.twitterUsername && (
            <div className="social">
              <a
                href={`https://twitter.com/${this.props.config.twitterUsername}`}
                className="twitter-follow-button">
                Follow @{this.props.config.twitterUsername}
              </a>
            </div>
            )}
          </div>
        </section>
        <section className="copyright">
          Copyright &copy; {currentYear} <a href="https://www.keitaro.com/">Keitaro Inc.</a>
        </section>
      </footer>
    );
  }
}

module.exports = Footer;
