---
id: self-registration
title: Self Registration on Kong
---

Microkubes has its own [Golang Package](https://github.com/Microkubes/microservice-tools/tree/master/gateway) and [Python library](https://github.com/Microkubes/microkubes-python) for self registration on Kong. They provide the basic functionality of registering/unregistration for your own service to the API Gateway

## Python Library

The library provides the basic function of registering your own service with the API Gateway. The tools are provided in package `microkubes.gateway`.

To register your service on a gateway, you need to use a `Registrator`. `microkubes-python` comes with support for Kong Gateway.

Example:

```python
from microkubes.gateway import KongGatewayRegistrator


registrator = KongGatewayRegistrator(os.environ.get("API_GATEWAY_URL", "http://localhost:8001"))  # Use the Kong registrator for Microkubes


# Self-registration on the API Gateway must be the first thing we do when running this service.
# If the registration fails, then the whole service must terminate.
registrator.register(name="hello-service",                  # the service name.
                     paths=["/hello"],                      # URL pattern that Kong will use to redirect requests to out service
                     host="hello-service.services.consul",  # The hostname of the service.
                     port=5000)                             # Flask default port. When redirecting, Kong will call us on this port.

```

## Golang Package

The package provides the basic interface for self regstration/unregistration of microservices. It is easy to set up and easy to use. It makes sure that when service goes down it will be unregister, although it is not required.

Example:

```go

import (
  // other imports here

  // import the gateway package
  "github.com/Microkubes/microservice-tools/gateway"
)

func main(){
    // load the Gateway URL and the config file path
    gatewayAdminURL, configFile := loadGatewaySettings()

    // read the configuration from config file
	serviceConfig, err := config.LoadConfig(configFile)
	if err != nil {
		service.LogError("config", "err", err)
		return
    }

    // creates new gateway.Registration service with the service configuratipn. We pass the default http client here
	registration := gateway.NewKongGateway(gatewayAdminURL, &http.Client{}, serviceConfig.Service)

    // at this point we do a self-registration to API Gateway
	err = registration.SelfRegister()
	if err != nil {
        // if there is an error it means we failed to self-register so we panic with error
		panic(err)
	}

    // the unregistration is deferred for after main() executes. If we shut down
    // the service, it is nice to unregister, although it is not required.
    defer registration.Unregister()

    // rest of the code for main goes here
    ...
}

func loadGatewaySettings() (string, string) {
	gatewayURL := os.Getenv("API_GATEWAY_URL")
	serviceConfigFile := os.Getenv("SERVICE_CONFIG_FILE")

	if gatewayURL == "" {
		gatewayURL = "http://localhost:8001"
	}
	if serviceConfigFile == "" {
		serviceConfigFile = "/run/secrets/microservice_user_config.json"
	}

	return gatewayURL, serviceConfigFile
}
```

As you can see from the above example API gateway URL and service config are set through the enviroment variables. If they are not set then default values are used.

The service loads the `gateway` configuration config file. Here's an example of a JSON configuration file:

```
{
  "service": {
    "name": "microservice-name",
    "port": 8080,
    "paths": [
      "/service-path"
    ],
    "virtual_host": "microservice-name.service.consul",
    "weight": 10,
    "slots": 100
  },
  "gatewayUrl": "http://kong:8000",
  "gatewayAdminUrl": "http://kong:8001",

  ...
}
```

Configuration properties:
 * **name** - ```"microservice-name"``` - the name of the service.
 * **port** - ```8080``` - port on which the microservice is running.
 * **paths** - ```/service-path``` - A list of paths that match this Route
 * **virtual_host** - ```"microservice-name.services.jormugandr.org"``` domain name of the service group/cluster.
 * **hosts** - list of valid hosts. Used for proxying and load balancing of the incoming request. You need to have at least the **virtual_host** in the list.
 * **weight** - instance weight - user for load balancing.
 * **slots** - maximal number of service instances.
 * **gatewayUrl** - ```http://kong:8000``` - is Gateway proxy URL
 * **gatewayAdminUrl** - ```gatewayAdminUrl``` - is Admin Gateway URL


**Note:** The registration of the service to the gateway should be one of the first things that the service does. On Microkubes, microservices do this check first and terminate if anything goes wrong.

