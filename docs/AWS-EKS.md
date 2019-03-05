---
id: setup-aws-eks-cluster
title: Set up Kubernetes cluster on AWS EKS
---

The [Deployments guide](Deployments.md) uses minikube kubernetes cluster which is recommended only for learning and test purposes. Below are instructions for creating production ready kubernetes cluster on AWS using Amazon's managed kubernetes offering (AWS EKS) and DynamoDB backend.

For more details about EKS please visit [Getting Started with Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html)

For more details about DynamoDB please visit [Getting Started with Amazon DynamoDB](https://aws.amazon.com/dynamodb/getting-started/)

# Set up Kubernetes cluster on AWS EKS

We will use [eksctl](https://eksctl.io/) tool for a simple kubernetes setup on EKS.

## Prerequisites

- Amazon AWS account
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
- [Amazon EKS-vended kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
- [eksctl](https://eksctl.io/)

To install the latest version of eksctl locally:

```bash
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version
```

You will also need to have AWS CLI credentials configured. To create the configuration files for AWS on your machine, invoke `aws configure` and manually enter the requested data. For example:

```bash
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

This command generates a configuration file on your machine `~/.aws/credentials` we will use later to establish communication between Microkubes and DynamoDB.

## Kubernetes cluster Setup

To get info about all available options of eksctl:

```bash
eksctl --help
```

To create kubernetes cluster with default parameters:

```bash
eksctl create cluster --name=microkubes-cluster
```

When you execute `eksctl create cluster`, it will take care of creating the initial AWS Identity and Access Management (IAM) Role used to allow the master control plane to connect to EKS. It will then create the base Amazon VPC architecture, and then the master control plane. Once the control plane is active, it will create a node group to bring up instances, then deploy the ConfigMap that allows the nodes to join the cluster, and, finally, create a pre-configured kubeconfig that will give you access to the cluster. Also, a default StorageClass (gp2 volume type provisioned by EBS) will be added automatically.

To check if kubectl can connect to the new cluster:

```bash
kubectl get nodes
```

## Backend setup

We will use Amazon DynamoDB as backend in this setup. DynamoDB is a fully managed NoSQL database service from Amazon.

Microkubes does the provisioning and configuration of the DynamoDB backend automatically. We just need to provide it with the AWS credentials file. We will do this later in this text.

## Microkubes setup using helm charts

Helm chart for Microkubes is located at <https://github.com/Microkubes/microkubes/tree/helm/kubernetes/helm/microkubes>

Examine the [values file](https://github.com/Microkubes/microkubes/blob/helm/kubernetes/helm/microkubes/values.yaml) and make modifications if neccesary. Ingress is supported if enabled there.

### Prerequisites for helm

- Kubernetes
- [Helm](https://github.com/helm/helm/releases)
  - Make sure that you have helm tiller running in your cluster, if not run `helm init`
- kubectl and kubeconfig configured correctly

#### Create keys for authorization servers

```bash
./keys/create.sh
```

#### Create secrets

If you recall, earlier we used `aws configure` to generate `~/.aws/credentials`. We need this file inside our pod to be able to connect to DynamoDB. We include it with the other keys in microkubes-secrets:

```bash
kubectl -n microkubes create secret generic microkubes-secrets \
    --from-file=keys/default \
    --from-file=keys/default.pub \
    --from-file=keys/private.pem \
    --from-file=keys/public.pub \
    --from-file=keys/service.cert \
    --from-file=keys/service.key \
    --from-file=keys/system \
    --from-file=keys/system.pub \
    --from-file=~/.aws/credentials
```

This will get it automatically mounted inside the pod together with the other secrets.

Make sure to update the values.yaml file of the helm chart and put the correct path to the newly mounted secret like:

```yaml
microkubes:
  database: dynamodb
  awsDatabaseCredentials: /run/secrets/microkubes/credentials
  ...
```

`awsDatabaseEndpoint` and `awsDatabaseRegion` don't have effect when we use credentials file and can be ignored.

### Deploy Microkubes on kubernetes cluster

To deploy Microkubes on kubernetes cluster with the release name `<release-name>` within namespace `<namespace-name>`:

```console
$ cd kubernetes/helm
$ helm dependency update microkubes/
$ helm install microkubes/ --namespace <namespace-name> --name <release-name> \
    --set postgresql.postgresUser=kong,postgresql.postgresPassword=<secretpassword>,postgresql.postgresDatabase=kong
```

**Note:** PostgreSQL user should be `kong` and database name should also be `kong`.

The platform takes about 5 minutes to start, depending on your cluster power. You can follow the progress with `kubectl -n microkubes get pods -w`.
Once all services are running, you can start using microkubes.
