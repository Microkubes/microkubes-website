---
id: ci-cd
title: CI, CD, Code Quality
---

For all changes in the platform PR must be creating. On merging the PR to `master` branch [TravisCI](https://travis-ci.org/) is triggered. The build makes several things:

* Download all dependencies
* Install the microservice
* Run tests
* Build new image
* Push the image on [docker hub](https://hub.docker.com/)

The usual .travis.yaml file:

```yaml
sudo: required

env:
  global:
    - CC_TEST_REPORTER_ID=${CODE_CLIMATE_REPORTER_ID}
    - GIT_COMMITTED_AT=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then git log -1 --pretty=format:%ct; else git log -1 --skip 1 --pretty=format:%ct; fi)

language: go

go:
  - 1.10.x

before_install:
  - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  - sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  - sudo apt-get update
  - sudo apt-get -y install docker-ce
  - go get github.com/axw/gocov/gocov
  - go get github.com/AlekSi/gocov-xml
  - go get gopkg.in/h2non/gock.v1
  - go get -u github.com/Microkubes/microservice-tools/...
  - go get -u github.com/Microkubes/microservice-security/...
  - go get github.com/goadesign/goa/...
  - go get gopkg.in/mgo.v2

before_script:
  - curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
  - chmod +x ./cc-test-reporter

script:
  - gocov test github.com/Microkubes/microservice-name/... | gocov-xml > coverage.xml && ./cc-test-reporter format-coverage -t cobertura -o coverage.json coverage.xml
  - if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRIGGER" != "yes" ]; then
    ./cc-test-reporter upload-coverage -i coverage.json;
    fi

after_success:
  - if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
    make push;
    fi
```

Each microservice has it own Makefile for building/pushing docker images and running the service: Example:

```Makefile
VERSION := $(shell git describe --tags --exact-match 2>/dev/null || echo latest)
DOCKERHUB_NAMESPACE ?= microkubes
IMAGE := ${DOCKERHUB_NAMESPACE}/microservice-user:${VERSION}

build:
	docker build -t ${IMAGE} .

push: build
	docker push ${IMAGE}

run: build
	docker run -p 8080:8080 ${IMAGE}
```

When it building/pushing docker images it takes the latest git tag and set it as image tag. Namespace by default is `microkubes`.

For Code Quality we use [Code Climate](https://codeclimate.com/). It makes code review, report test coverage and so on. Travis build reports the test coverage to Code Climate. It supports Golang among the other programming languages. Each microservice has .codeclimate.yml file which sets the Code Climate configuration:

```yaml
---
engines:
  fixme:
    enabled: true
  gofmt:
    enabled: true
  golint:
    enabled: true
    checks:
      GoLint/Imports/ImportDot:
        enabled: false
  govet:
    enabled: true
ratings:
  paths:
    - "**.go"
exclude_paths: []
```
