---
id: installation-and-setup
title: Get Started with Microkubes
---

Microkubes is a ground-up scalable microservice framework.
To get you started with Microkubes, follow this guide.

# Installation and setup

Before running Microkubes, you need to install some prerequisites first.

## Prerequisite for Microkubes

You need Docker and Kubernetes running on your machine.

If you don't have Docker installed on your machine please follow these instructions [Docker Installation](https://docs.docker.com/install/).

The easiest way to have Kubernetes running on your machine is by installing Minikube version from Kubernetes following this [Minikube Install](https://kubernetes.io/docs/tasks/tools/install-minikube/) guide.

Minikube is not recommended for production use. For an example production ready cluster see [Set up Kubernetes cluster on AWS EKS with DynamoDB](AWS-EKS.md) or [Set up Google Kubernetes Engine cluster](GCP.md).

## Start Microkubes

Microkubes is an open source framework for building data management platforms using microservices. For deploying this framework you have to clone [this](https://github.com/microkubes/microkubes) repository on your local machine:

```bash
git clone https://github.com/microkubes/microkubes
cd microkubes
```

### Preparing

1. Run a single-node Kubernetes cluster via Minikube tool

```bash
minikube start
```

**Note:** If you use an existing cluster or prefer production ready cluster such as [GCP kubernetes cluster](GCP.md), then skip this command.


2. Create a default microkubes namespace and service account

```bash
kubectl create -f kubernetes/manifests/namespace.yaml
kubectl create -f kubernetes/manifests/serviceaccount.yaml
```

3. Create keys for authorization servers:

```bash
./keys/create.sh
```

4. Create a secret from keys generated in the previous step

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
        --from-file=./kubernetes/manifests/mongo/create_microkubes_db_objects.sh
```

### Deploy Microkubes

Before starting the framework, create the default `ConfigMap` for the microservices:

```bash
cd kubernetes/manifests
kubectl create -f microkubes-configmap.yaml
```

To create your first microservice, run the following commands in the same directory:

```bash
cd kubernetes/manifests
kubectl create -f consul.yaml
kubectl create -f kube-consul-register.yaml
kubectl create -f kong.yaml
kubectl create -f mongo.yaml
kubectl create -f rabbitmq.yaml
kubectl create -f fakesmtp.yaml
kubectl create -f microkubes.yaml
```

The platform takes about 5 minutes to start. You can follow the progress with `kubectl -n microkubes get pods -w`.
Once all services are running, you can start using microkubes.

### Check that microkubes is up and running

The API gateway is exposed as a nodePort in kubernetes. You can get the URL and perform an http GET request to check if microkubes is responding.

```bash
MICROKUBES_URL=`minikube service -n microkubes kong --url`
curl $MICROKUBES_URL/users
```

# Setting up your first microservice with Microkubes

We're going to use [Flask](http://flask.pocoo.org/) to implement our first service with Microkubes.

First let's set up the project structure and add our first service:

```bash
mkdir hello-service && cd hello-service
touch service.py
touch Dockerfile
touch service.yaml
```

The service will contain:

* ```service.py``` - the Flask implementation
* ```Dockerfile``` - to build the docker image for our service
* ```service.yml``` - Kubernetes deployment for our service

## Service implementation with Flask

We're going to implement a simple "hello world" action in Flask.

When running the microservice inside the platform, we need to register it to the API Gateway.
To do this, we use Microkubes own Python [library](https://github.com/Microkubes/microkubes-python).

Edit ```setup.py``` and put:

```python

import os
from flask import Flask
from microkubes.gateway import KongGatewayRegistrator


app = Flask(__name__)
registrator = KongGatewayRegistrator(os.environ.get("API_GATEWAY_URL", "http://localhost:8001"))  # Use the Kong registrator for Microkubes


# Self-registration on the API Gateway must be the first thing we do when running this service.
# If the registration fails, then the whole service must terminate.
registrator.register(name="hello-service",                  # the service name.
                     paths=["/hello"],                      # URL pattern that Kong will use to redirect requests to out service
                     host="hello-service.services.consul",  # The hostname of the service.
                     port=5000)                             # Flask default port. When redirecting, Kong will call us on this port.


@app.route("/hello")
def hello():
    return "Hello from Flask service on Microkubes"

```

Save and exit.

## Dockerize and build the image for the service

Edit the ```Dockerfile``` and put:

```Dockerfile
FROM python:3.7-slim-stretch

# Install microkubes-python
RUN pip install "git+https://github.com/Microkubes/microkubes-python#egg=microkubes-python"
# Install flask
RUN pip install Flask

# Add the service file to the container image
ADD service.py /service.py

ENV FLASK_APP=service.py

# run the service
CMD ["flask", "run"]

```

We need Python 3 (3.6 and above) and we need to install ```microkubes-python``` which is a library for integrating
microservices written in Python with Microkubes platform.
We're going to use the registrator API from the library to register our service on Kong API Gateway.

Once we have the Dockerfile implemented, we need to build image with docker:

```bash
docker build -t hello-service:latest .
```

## Kubernetes deployment

To deploy our service on Microkubes, we need to create Kubernetes deployment. This is a ```yaml``` file that describes
which docker image to use, how many instances (containers) to be started, configures environment, ports and many other things.

Edit ```service.yaml``` and put:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: hello-service
  namespace: microkubes
  labels:
    app: hello-service
    platform: microkubes
spec:
  replicas: 1
  template:
    metadata:
      name: hello-service
      labels:
        app: hello-service
        platform: microkubes
      annotations:
        consul.register/enabled: "true"
        consul.register/service.name: "hello-service"
    spec:
      containers:
        - name: hello-service
          image: hello-service:latest
          imagePullPolicy: Always
          env:
            - name: API_GATEWAY_URL
              value: "http://kong-admin:8001"
          ports:
            - containerPort: 5000
```

If you're not familiar with Kubernetes deployments, do not worry yourself, just make sure that the name of the service ("hello-service")
is the same as the name you are registering from the Python code, the image name ("hello-service:latest") is correct and you have the
correct port exposed (5000).

To deploy, execute the following command:

```bash
kubectl create -f service.yaml
```

Wait for the service to start up (this could take a couple of seconds), then try calling the service:

```bash
MICROKUBES_URL=`minikube service -n microkubes kong --url`
curl $MICROKUBES_URL/hello
```

You should see the service response:

```bash
Hello from Flask service on Microkubes
```
