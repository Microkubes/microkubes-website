---
id: setup-gcp-cluster
title: Set up Google Kubernetes Engine cluster
---

The [installation and setup guide](Introduction-InstallationAndSetup.md) uses minikube kubernetes cluster which is recommended only for learning and test purposes. Below are instructions for creating production ready kubernetes cluster on Google Cloud Platform.

# Set up Kubernetes cluster on GCP GKE

Google offers managed Kubernetes clusters on Google Cloud Platform. There are various configuration setups available depending on your needs.

Below, we present a simple setup to get you up and running as quickly as possible. For a more complex scenario and all available options, please see the official Google documentation.

Make sure you have the Google Kubernetes Engine API enabled in your GCP account and Cloud SDK installed on the machine where you will run gcloud commands from.

## Cluster Setup

```bash
gcloud container clusters create [CLUSTER_NAME] [--zone=[COMPUTE_ZONE]] [--region=[COMPUTE_REGION]] [--project=[PROJECT_ID]]
```

This command creates a single-zone kubernetes cluster on GCP with the default options:

- 3 n1-standard-1 nodes
- 100GB pd-standard disks each
- Container Optimized OS
- connected to the default network

For more info about this command visit <https://cloud.google.com/sdk/gcloud/reference/container/clusters/create>

For available zones and regions visit <https://cloud.google.com/compute/docs/regions-zones/#available>

## Set up kubectl

When you create a cluster using gcloud container clusters create, an entry is automatically added to the kubeconfig in your environment, and the current context changes to that cluster.

All clusters have a canonical endpoint. The endpoint is the IP address of the Kubernetes API server that kubectl and other services use to communicate with your cluster master.

```bash
gcloud container clusters get-credentials [CLUSTER_NAME] [--zone=[COMPUTE_ZONE]] [--region=[COMPUTE_REGION]] [--project=[PROJECT_ID]]
```

Once you have a working cluster and kubectl is able to connect to it, you can continue following the [installation and setup guide](Introduction-InstallationAndSetup.md), just be sure you skip the `minikube start` command.