---
id: setup-aws-cluster
title: Set up Kubernetes cluster on AWS
---

The [installation and setup guide](Introduction-InstallationAndSetup.md) uses minikube kubernetes cluster which is recommended only for learning and test purposes. Below are instructions for creating production ready kubernetes cluster on AWS.

# Set up Kubernetes cluster on AWS

Amazon offers managed Kubernetes clusters on AWS. There are various configuration setups available depending on your needs.

Below, we present a simple setup to get you up and running as quickly as possible. We will use [kops](https://github.com/kubernetes/kops) tool to create the cluster.

## Prerequisites

kubectl and kops should be installed on the machine on which you will run the commands.

To install kops:

```bash
wget https://github.com/kubernetes/kops/releases/download/1.10.0/kops-linux-amd64
chmod +x kops-linux-amd64
mv kops-linux-amd64 /usr/local/bin/kops
```

## Cluster Setup

There are certain preparatory steps that need to be performed before running the kops command such as creating dedicated IAM user for kops, configuring credentials, policies, permissions and access keys as well as setting up the dedicated S3 bucket storage for storing the state of the cluster, but these are beyond the scope of this document. For details on how to prepare AWS for kops see [Getting started with kops on AWS](https://github.com/kubernetes/kops/blob/master/docs/aws.md)

The below command will generate a cluster configuration, but not start building it:

```bash
kops create cluster --name CLUSTER_NAME --master-count 3 --node-count 1 \
    --node-size t2.small --master-size t2.small --zones CLUSTER_ZONE \
    --master-zones MASTER_ZONE --ssh-public-key key.pub \
    --networking kubenet
```

**Note:** CLUSTER_NAME should be a valid DNS name, and the chosen ZONES should be available to your AWS account.

After `kops create cluster` command, we can look and edit the proposed configuration with:

```bash
kops edit cluster CLUSTER_NAME
```

When we are ready, we can actually build the cluster with:

```bash
kops update cluster CLUSTER_NAME --yes
```

To ensure your cluster is working as expected:

```bash
kops validate cluster
```

kubectl is automatically configured to have access to the cluster. To check:

```bash
kubectl get nodes
```

Once you have a working cluster and kubectl is able to connect to it, you can continue following the [installation and setup guide](Introduction-InstallationAndSetup.md), just be sure you skip the `minikube start` command.