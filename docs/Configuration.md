---
id: configuration
title: Configuration
---

Each microservice on the platorm has its own config file. It resides in the root directory of the service.
In different deployment systems ([Docker Swarm](https://docs.docker.com/engine/swarm/)/[Kubernetes](https://kubernetes.io/)) it is mounted under some volume path. The default path of the configuration file is `/run/secrets/microservice-name_config.json`. To change the path set the SERVICE_CONFIG_FILE environment variable.

The format of the configuration file is `JSON`. It is easy to manage and extend the configuration.

Microkubes has its own [package](https://github.com/Microkubes/microservice-tools/tree/master/config) for managing the configuration files. It is able to load the remote and local config as well. It holds the full microservice configuration:

* Configuration for registering on the API Gateway
* Security configuration
* Database configuration
* API Gateway URL
* API Admin Gateway URL
* Container Manager

**Note:** You can add new properties to the configuration by extending it.