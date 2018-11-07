---
id: configuration
title: Configuration
---

Each microservice on the platorm hat it own config file. It resides in the root of the service.
In different deployment systems ([Docker Swarm](https://docs.docker.com/engine/swarm/)/[Kubernetes](https://kubernetes.io/)) it is mounted under some volume path. The default path of the configuration file is `/run/secrets/microservice-name_config.json`. To change the path set the SERVICE_CONFIG_FILE enviroment variable.

The format of the configuration file is `JSON`. It is easy to manage the configuration and extend as need is growing.

Micrkubes has its own [package](https://github.com/Microkubes/microservice-tools/tree/master/config) for managing the configuration files. It is able to load the remote and local config as well. It holds the full microservice configuration:

* Configuration for registering on the API Gateway
* Security configuration
* Database configuration
* API Gateway URL
* API Admin Gateway URL
* Container Manager


**Note:** You are able to add new property to the configuration by extending it.