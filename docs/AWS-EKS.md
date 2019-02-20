---
id: setup-aws-eks-cluster
title: Set up Kubernetes cluster on AWS EKS
---

The [installation and setup guide](Introduction-InstallationAndSetup.md) uses minikube kubernetes cluster which is recommended only for learning and test purposes. Below are instructions for creating production ready kubernetes cluster on AWS using Amazon's managed kubernetes offering (AWS EKS). For more details about EKS please visit [Getting Started with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html)

# Set up Kubernetes cluster on AWS EKS

We present a simple kubernetes setup on EKS using the [eksctl](https://eksctl.io/) tool.

## Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [Amazon EKS-vended kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
- [eksctl](https://eksctl.io/)

To install the latest version of eksctl:

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```

You will need to have AWS API credentials configured. You can use ~/.aws/credentials file or environment variables. For more information read [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html).

## Cluster Setup

To get info about all available options of eksctl:

```bash
eksctl --help
```

To create kubernetes cluster with default parameters:

```bash
eksctl create cluster --name=microkubes-cluster
```

When you execute `eksctl create cluster`, it will take care of creating the initial AWS Identity and Access Management (IAM) Role used to allow the master control plane to connect to EKS. It will then create the base Amazon VPC architecture, and then the master control plane. Once the control plane is active, it will create a node group to bring up instances, then deploy the ConfigMap that allows the nodes to join the cluster, and, finally, create a pre-configured kubeconfig that will give you access to the cluster. Also, a default StorageClass (gp2 volume type provisioned by EBS) will be added automatically.

Once the cluster is created, the cluster credentials will be added in `~/.kube/config`. You can check if kubectl can connect to the cluster:

```bash
kubectl get nodes
```

Once you have a working cluster and kubectl is able to connect to it, you can continue following the [installation and setup guide](Introduction-InstallationAndSetup.md), just be sure you skip the `minikube start` command.