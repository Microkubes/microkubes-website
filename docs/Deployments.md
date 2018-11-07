---
id: deployments
title: Deployments
---

[Microkubes](https://github.com/Microkubes/microkubes) supports [Kubernetes](https://kubernetes.io/) and [Docker Swarm](https://docs.docker.com/engine/swarm/) deployments. It works on any cloud, is easy to set up and simple to use at any scale. It provides a completely integrated open source Microservices framework, which works out of the box on Kubernetes and Swarm. The framework is easy to use, can be deployed on any infrastructure.

Each microservice has its own Dockerfile. We use multi-stage build in order reduce the size of the image. The base image for building the microservices is the ```goa-build``` image. It contains the all dependencies needed for the platform which speed up the build process. Microkubes use the ```alpine:3.7``` image for running the microservices.

![stack](/img/microkubes.png)

Kubernetes and Docker Swarm are two of the most powerful IT cloud container management platforms. Microkubes is build on top of these technologies

## Kubernetes

These instructions will let you deploy the Microkubes on Kubernetes

### Preparing

1. Run a single-node Kubernetes cluster via Minikube tool

```bash
minikube start
```

2. Create keys for authorization servers:

```bash
./keys/create.sh
```

3. Create a default microkubes namespace and service account

```bash
kubectl create -f kubernetes/namespace.yaml
kubectl create -f kubernetes/serviceaccount.yaml
```

4. Create a secret from keys generated in Step 2

```bash
kubectl -n microkubes create secret generic microkubes-secrets \
	--from-file=keys/default \
	--from-file=keys/default.pub \
	--from-file=keys/private.pem \
	--from-file=keys/public.pub \
	--from-file=keys/service.cert \
	--from-file=keys/service.key \
	--from-file=keys/system \
	--from-file=keys/system.pub
```

5. Create a secret for the mongo objects creation

```bash
kubectl -n microkubes create secret generic mongo-init-db \
        --from-file=./kubernetes/mongo/create_microkubes_db_objects.sh
```

### Deploy Microkubes

Run the following commands:
```bash
cd kubernetes/
kubectl create -f consul.yaml
kubectl create -f kube-consul-register.yaml
kubectl create -f kong.yaml
kubectl create -f mongo.yaml
kubectl create -f rabbitmq.yaml
kubectl create -f fakesmtp.yaml
kubectl create -f microkubes.yaml
```

The platform takes about 5 minutes to bring up and you can follow the progress using `kubectl -n microkubes get pods -w`.
Once all services are running, you can start using microkubes.

### Check that microkubes is up and running

The API gateway is exposed as a nodePort in kubernetes, you can get the URL and do an http GET request to check that microkubes is responding.
```bash
MICROKUBES_URL=`minikube service -n microkubes kong --url`
curl $MICROKUBES_URL/users
```

[Helm chart](https://github.com/helm/charts) will be available very soon.

## Docker Swarm

The [docker](https://github.com/Microkubes/microkubes/tree/master/docker) subdirectory of Microkubes platform contains docker compose files to run Microkubes platform on docker swarm

### Run Microkubes on Docker Swarm

First make sure your node is swarm manager. If not, initialize a swarm first:

```bash
docker swarm init
```

Then generate the keys:

```bash
cd keys
./generate-keys.sh
```

Once you have the keys in the ```keys``` directory, run the script to build all Microkubes docker
images:

```bash
cd ..
./build-docker-images.sh <build_directory> [<images_tag>]
```

This would build all Microkubes images (may take a while) in the ```build``` directory.

To deploy the full platform, run:

```bash
docker stack deploy -c docker-compose.fullstack.yml microkubes
```

Confirm that all services have been deployed by running ```docker service ls```

### Deploy the basic infrastructure only

We provide a compose file to deploy only the basic infrastructure and the build upon that stack.
You can deploy this as a docker swarm stack by running:

```bash
docker stack deploy -c docker-compose.yml microkubes
```

## Build images script

The platfrom provides a script to build all Microkubes images at once. It resides in [docker](https://github.com/Microkubes/microkubes/tree/master/docker) subdirectory.

The script syntax:

```bash
./build-docker-images.sh <build_directory> [<images_tag>]
```

where:
* ```build_directory``` is the target directory in which to checkout the source code and from which to build the docker images.
If the direcotry does not exists, it will be created. If the build directory already has the subprojects cloned with git, then
the script will not attempt to clone the repositories and will use the existing ones. Default target direcotry is the current
working directory.
* ```images_tag``` - the docker tag to append to the docker images. Default is ```latest``` (for example: ```microkubes/kong:latest```).

The example below shows the usual Dockerfile of Microkubes service:

```Dockerfile
### Multi-stage build
FROM jormungandrk/goa-build as build

RUN apk --update add ca-certificates

COPY . /go/src/github.com/Microkubes/microservice-name
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go install github.com/Microkubes/microservice-name

### Main
FROM alpine:3.7

COPY --from=build /go/src/github.com/Microkubes/microservice-name/config.json /config.json
COPY --from=build /go/bin/microservice-name /microservice-name
COPY --from=build /etc/ssl/certs /etc/ssl/certs

EXPOSE 8080

ENV API_GATEWAY_URL="http://localhost:8001"

CMD ["/microservice-name"]
```