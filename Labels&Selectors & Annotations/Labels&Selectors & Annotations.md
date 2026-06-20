# LAB 04: Understanding Labels, Selectors and Annotations using Cake Delivery Application

## Objective

The objective of this lab is to understand how Kubernetes uses Labels, Selectors, and Annotations to organize, identify, and manage resources.

### By completing this lab, you will learn how to:
Create Labels
Apply Labels to Pods
Understand Label Syntax
Query resources using Labels
Use Equality-Based Selectors
Use Set-Based Selectors
Create Annotations
Store metadata using Annotations
Filter Kubernetes resources using Selectors
Understand how ReplicaSets and Services use Selectors
Key Concepts
What are Labels?

Labels are key-value pairs attached to Kubernetes objects.

They help identify, organize, and group resources.

#### Example:

```yaml
labels:
  app: cake-app
  environment: dev
  team: ecommerce
```

Why Do We Use Labels?

Without labels, Kubernetes sees resources as individual objects.

Labels allow Kubernetes to:

Group resources
Select resources
Manage resources
Connect Services to Pods
Connect ReplicaSets to Pods

### Label Syntax
key: value

Example:

```yaml
app: cake-app
environment: dev
version: v1
```

### What is a Selector?

A Selector is a filtering mechanism used to find resources matching specific labels.

Think of it as:

Labels = Tags

Selectors = Search Filter

Example:

selector:
  matchLabels:
    app: cake-app

Kubernetes will select only resources containing:

app: cake-app

Why Are Selectors Important?

Selectors are used by:

ReplicaSets
Deployments
Services
Network Policies

Without selectors:

ReplicaSets cannot manage Pods
Services cannot find Pods
Deployments cannot manage ReplicaSets

### Equality-Based Selector

Matches exact label values.

Example:

kubectl get pods -l app=cake-app

Meaning:

Show Pods where:

app = cake-app

### Set-Based Selector

Matches multiple values.

Example:

kubectl get pods -l 'environment in (dev,test)'

Meaning:

Show Pods where:

environment = dev
OR
environment = test

### What are Annotations?

Annotations are metadata attached to Kubernetes objects.

Unlike Labels:

Not used for selection
Not used for filtering
Used for storing information

Example:

```yml
annotations:
  owner: devops-team
  application: cake-delivery
  created-by: harinesh
```

Why Use Annotations?

Annotations are used for:

Documentation
Build information
Deployment information
Contact details
CI/CD metadata
Monitoring metadata
Prerequisites

#### Before starting this lab, ensure you have completed:

Lab 01 - KIND Cluster Setup
Lab 02 - Cake Delivery Pod Deployment
Lab 03 - ReplicaSet Deployment

Verify cluster:

`kubectl get nodes`

Expected Output:

|             NAME             |STATUS |
|------------------------------|-------|
|my-first-cluster-control-plane| Ready |
|   my-first-cluster-worker    | Ready |
|   my-first-cluster-worker2   | Ready |

#### Application Overview

We will use the existing Cake Delivery application.

##### Additional metadata:

|   Label   |Key Value |
|-----------|----------|
|    app    | cake-app |
|environment|   dev    |
|  version  |    v1    |
|   team    |ecommerce |


#### Annotations:

|Annotation |  Key Value   |
|-----------|--------------|
|   owner   | devops-team  |
|application|cake-delivery |
|  purpose  | labels-demo  |


# STEPS TO SETUP THINGS

### Step 1 - Create Pod Manifest with Labels and Annotations

Create file:

cake-labels-pod.yaml

Add:

```yml
apiVersion: v1
kind: Pod

metadata:
  name: cake-app-pod-label

  labels:
    app: cake-app-pod-label
    environment: dev
    version: v1
    team: ecommerce

  annotations:
    owner: devops-team
    application: cake-delivery
    purpose: labels-demo

spec:
  containers:
  - name: cake-container
    image: cake-delivery:v1

    imagePullPolicy: Never

    ports:
    - containerPort: 80
```

### Step 2 - Deploy the Pod
`kubectl apply -f cake-labels-pod.yaml`


Verify:

`kubectl get pods`

Expected Output:

cake-app Running
![alt text](images\image.png)


Troubelshoot:

if we keep label name as app: cake-app what will happens?
our RS have label as app: cake-app so RS think this pods belong to my label so our desired state is only 3 so it found extra then it will delete our newly created POD.

![alt text](images\image-1.png)

### Step 3 - Display Labels

Show labels:

`kubectl get pods --show-labels`

Expected Output:

![alt text](images\image-2.png)

Observation:

The Pod now contains multiple labels.

### Step 4 - View Pod Details

`kubectl describe pod cake-app`

Locate:

Labels:
Annotations:

Observation:

Both Labels and Annotations are visible.
![alt text](images\image-3.png)

### Step 5 - Use Equality-Based Selector

Filter Pods:

`kubectl get pods -l app=cake-app`

Expected Result:

![alt text](images\image-4.png)


### Step 6 - Add Another Pod

Create:

apiVersion: v1
kind: Pod

metadata:
  name: cake-app-v2

  labels:
    app: cake-app
    environment: test
    version: v2

spec:
  containers:
  - name: cake-container
    image: cake-delivery:v1

    imagePullPolicy: Never

Deploy:

kubectl apply -f cake-app-v2.yaml

Verify:

kubectl get pods --show-labels
Step 7 - Use Set-Based Selector

Select multiple environments:

kubectl get pods -l 'environment in (dev,test)'

Expected Result:

cake-app
cake-app-v2
Step 8 - Use NOT IN Selector
kubectl get pods -l 'environment notin (test)'

Expected Result:

cake-app
Step 9 - Select Pods by Version
kubectl get pods -l version=v1

Expected Result:

cake-app
Step 10 - Display Annotations

View annotations:

kubectl describe pod cake-app

Locate:

Annotations:

Expected Output:

owner=devops-team
application=cake-delivery
purpose=labels-demo

Observation:

Annotations provide additional information but are not used for selection.

Step 11 - Verify Application Access

Forward port:

kubectl port-forward pod/cake-app 8080:80

Open:

http://localhost:8080

Expected Result:

Cake Delivery application loads successfully.

Step 12 - Cleanup
kubectl delete pod cake-app
kubectl delete pod cake-app-v2

Verify:

kubectl get pods
Important Points to Remember
Labels
Labels are key-value pairs.
Used for grouping resources.
Used by Services.
Used by ReplicaSets.
Used by Deployments.

Example:

app: cake-app
Selectors
Selectors search using Labels.
Used to identify matching resources.
Services use selectors to find Pods.
ReplicaSets use selectors to manage Pods.

Example:

selector:
  matchLabels:
    app: cake-app
Annotations
Annotations are metadata.
Not used for filtering.
Not used by selectors.
Used for documentation and extra information.

Example:

annotations:
  owner: devops-team
Verification Checklist
Verification	Status
Labels Created	✓
Labels Verified	✓
Equality Selector Tested	✓
Set-Based Selector Tested	✓
NOT IN Selector Tested	✓
Annotations Added	✓
Annotations Verified	✓
Application Accessible	✓
Expected Outputs

After successful completion of this lab:

Labels were created and applied.
Label syntax was understood.
Equality selectors were tested.
Set-based selectors were tested.
Annotations were added.
Kubernetes resource filtering was verified.
Relationship between Labels and Selectors was demonstrated.

Lab Summary

In this lab, the Cake Delivery application was used to demonstrate Kubernetes Labels, Selectors, and Annotations. Labels were applied to Pods to categorize resources, while Selectors were used to filter and locate matching Pods. Equality-based and set-based selectors were tested to understand how Kubernetes identifies resources. Annotations were added to store metadata and documentation information. This lab provided a foundational understanding of how Kubernetes organizes and manages resources using metadata.