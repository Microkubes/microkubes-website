/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
  return siteConfig.baseUrl + "img/" + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self"
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
      <div className="heroSection">
        <div className="featureFirst"><img src={'/img/microkubes-stack.png'}/></div>
        <div className="featureSecond"><img src={'/img/microkubes-assemble.png'}/></div>
        <div className="FeatureThird"><img src={'/img/microkubes-box.png'}/></div>
      </div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
        </div>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container
    padding={["bottom", "top"]}
    id={props.id}
    background={props.background}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Block layout="threeColumn">
    {[
      {
        content:
          "One of the primary challenges with microservices architectures is allowing services to discover and interact with each other. Microkubes automatically detects where the services reside so they can interact with each other. The framework helps to control the interaction between services by providing fault tolerance and latency tolerance.",
        image: imgUrl("Service_Discovery.svg"),
        imageAlign: "top",
        title: "Service Discovery"
      },
      {
        content:
          "Microkubes decouples security from the microservice implementation so service developers are not responsible for implementing security correctly. The framework provides capabilities for managing public/private keys, certificates and authentication and authorization by leveraging a role-based access control model.",
        image: imgUrl("Security.svg"),
        imageAlign: "top",
        title: "Security"
      },
      {
        content:
          "The Microkubes framework is driven by efficiency. You can scale each microservice with the entire system, without facing any performance issues.As your services scale and the number of requests grows, Microkubes has the capacity to handle increases in traffic intelligently.",
        image: imgUrl("High Scalability_and_Availability.svg"),
        imageAlign: "top",
        title: "High Scalability and Availability"
      },
      {
        content:
          "Our integrated user management ensures integrity of data by using OAuth2, JWT and SAML for user authentication and authorization. It increases security by eliminating the risk of passwords theft or reuse.",
        image: imgUrl("Integrated_User_Management.svg"),
        imageAlign: "top",
        title: "Integrated User Management"
      },
      {
        content:
          "Includes the ability for monitoring and alerting allowing to the IT operations to figure out where any problem resides, what’s failing, what’s working well and what’s not in a way that doesn’t require any instrumentation to be put into the microservice itself by developers.",
        image: imgUrl("Monitoring.svg"),
        imageAlign: "top",
        title: "Monitoring"
      },
      {
        content:
          "Microkubes is language agnostic framework which means it doesn’t force developers to use particular language. By using multi-stage docker builds we make sure that the containers are lightweight and dynamic. The platform has multicontainer capabilities where a single instance can host native code, Go, Python, Java, etc.",
        image: imgUrl("Polyglot_Programming .svg"),
        imageAlign: "top",
        title: "Polyglot Programming<br>Environment with Lightweight Containers"
      }
    ]}
  </Block>
);

const FeatureCallout = props => (
  <div
    className="productShowcaseSection paddingBottom"
    style={{ textAlign: "center" }}
  >
    <h1 className="section-title">Out-Of-Box Complete Microservices</h1>
    <MarkdownBlock className="section-desc">
      Microkubes is built to maximize developers` happiness. It works on any
      cloud, is easy to set up and simple to use at any scale. It provides a
      completely integrated open source Microservices framework, which works out
      of the box on Kubernetes. The framework is easy to use, can be deployed on
      any infrastructure and it is 100% open source.
    </MarkdownBlock>
    <PromoSection>
      <Button className="buton-dark" href="/docs/installation-and-setup.html">
        Get Started
      </Button>
    </PromoSection>
  </div>
);

const FeatureCalloutDownload = props => (
  <div
    className="productShowcaseSection paddingBottom downloadSection"
    style={{ textAlign: "center" }}
  >
    <h1 className="section-title">About The Framework</h1>
    <MarkdownBlock className="section-desc">
      Microkubes is an open source framework, for building data management
      platforms by using microservices.It is based on proven technologies, that
      are in production in some of the most demanding applications. Microkubes’
      open source framework helps you to develop projects faster and easier than
      ever before
    </MarkdownBlock>
    <PromoSection>
      <Button
        className="buton-dark"
        href="https://github.com/Microkubes/microkubes/releases"
      >
        Download now
      </Button>
    </PromoSection>
  </div>
);

const LearnHow = props => (
  <Block background="light">
    {[
      {
        content: "Talk about learning how to use this",
        image: imgUrl("microkubes-logo.svg"),
        imageAlign: "right",
        title: "Learn How"
      }
    ]}
  </Block>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl("users.html", props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
          <FeatureCallout />
          <Features />
          <FeatureCalloutDownload />
          <Showcase language={language} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
