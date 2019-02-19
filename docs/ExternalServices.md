---
id: external-services
title: External Services
---

Microkubes is based on proven technologies that are in production in some of the most demanding applications.

# Kong

[Kong](https://konghq.com/) is an open-source API gateway and microservice management layer. Based on Nginx and the [lua-nginx-module](https://github.com/openresty/lua-nginx-module) (specifically [OpenResty](http://openresty.org/en/)), Kong’s pluggable architecture makes it flexible and powerful.

## Configuration

Kong is built on top of reliable technologies like NGINX and Apache Cassandra or PostgreSQL, and provides you with an easy-to-use [RESTful API](https://docs.konghq.com/0.14.x/admin-api/) to operate and configure the system.

## Client's requests

Every request made to the Microkubes's APIs will hit Kong first, and then it will be proxied to the final API. In between requests and responses Kong will execute any plugin that you decided to install, empowering your APIs. [Prometheus](https://prometheus.io/) comes out of the box with [Microkubes's docker image](https://github.com/Microkubes/microkubes/tree/master/docker/kong).

## Benefits

Kong effectively becomes the entry point for every API request and is extended through Plugins, which provide extra functionality and services beyond the core platform.
Main benefits of using Kong are:

* Scalable: It easily scales horizontally by simply adding more machines, meaning your platform can handle virtually any load while keeping latency low.
* Modular: It can be extended by adding new plugins, which are easily configured through a RESTful Admin API.
* Runs on any infrastructure: It runs anywhere. You can deploy Kong in the cloud or on-premise environments, including single or multi-datacenter setups and for public, private or invite-only APIs.

## Microkubes's services registration on Kong

Each service on the platform is self registered on Kong. Microkubes has [Golang Package](https://github.com/Microkubes/microservice-tools) and [Python library](https://github.com/Microkubes/microkubes-python) for self registration on Kong. The main logic is put in these common packages which provide APIs for self registration and unregistration of microservices.

Kong is started automatically when the Microkubes platform is deployed.

# Consul

[Consul](https://www.consul.io/) is a distributed service mesh to connect, secure, and configure services across any runtime platform and public or private cloud

Consul offers many features out of the box but Microkubes is mainly interested in **Service Discovery** and **KVStore**.

## Service Discovery

Clients of Consul can register a service and other clients can use Consul to discover providers of a given service. Using either DNS or HTTP, applications can easily find the services they depend upon.

Kong sets up Consul as a DNS server to find the IP addresses of the microservices that are registered on Kong. Consul actually translates the microservice names to the IP addresses required to access the microservice.

Each microservice should be registered on Consul as well. For that purpose Microkubes uses [Consul Registrator](https://github.com/tczekajlo/kube-consul-register), a tool to register Kubernetes Pods as Consul services. Consul registrator watches Kubernetes events and converts information about PODs to Consul Agent.

## KV Store

Applications can make use of Consul's key/value store for any number of purposes, including dynamic configuration, feature flagging, coordination, leader election, and more. The simple HTTP API makes it easy to use.

Kong migrations use Consul's KV store to flag they are done so Kong can continue with initializing. It waits until migrations are done. It executes HTTP GET request to `http://consul:8500/v1/kv/kong-migrations` every second and if response code is different than `200` it waits one second before trying again.

# RabbitMQ

RabbitMQ is the most popular open source message broker. It supports multiple messaging protocols and is lightweight and easy to deploy on premises and in the cloud.

RabbitMQ comes along with the Microkubes platform and can be used for any purpose like notification service, sending emails, etc.

Microkubes uses RabbitMQ for its verification system.