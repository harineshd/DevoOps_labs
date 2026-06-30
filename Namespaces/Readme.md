# LAB 03: Working with Kubernetes Namespaces on KIND Cluster

## Objective

The objective of this lab is to understand how Kubernetes Namespaces work by creating multiple namespaces, deploying Pods into different namespaces, and managing Kubernetes resources within isolated environments.

#### By completing this lab, you will learn how to:

- Understand what Kubernetes Namespaces are
- View the default namespaces
- Create new namespaces
- Deploy Pods into specific namespaces
- List resources inside namespaces
- Switch between namespaces
- Delete namespaces
- Understand Namespace isolation

---

## Prerequisites

Verify the cluster is running:

```bash
kubectl get nodes
```
---

# Kubernetes Namespace Overview

A Namespace is a logical partition inside a Kubernetes Cluster.

Instead of creating multiple Kubernetes clusters, multiple teams or applications can share a single cluster while remaining isolated from each other using Namespaces.

Example:

```
Kubernetes Cluster

│
├── Namespace: default
│      ├── Pod A
│      └── Service A
│
├── Namespace: development
│      ├── Pod B
│      └── Service B
│
├── Namespace: testing
│      ├── Pod C
│      └── Service C
│
└── Namespace: production
       ├── Pod D
       └── Service D
```

Each namespace has its own resources.

---

# Step 1 - View Existing Namespaces

Display all namespaces:

```bash
kubectl get namespaces
```

or

```bash
kubectl get ns
```

Expected Output:

```
NAME              STATUS   AGE
default           Active   xxm
kube-node-lease   Active   xxm
kube-public       Active   xxm
kube-system       Active   xxm
```

Explanation:

| Namespace | Purpose |
|------------|---------|
| default | Default namespace for user applications |
| kube-system | Kubernetes system components |
| kube-public | Public resources |
| kube-node-lease | Node heartbeat information |

---

# Step 2 - Create a Namespace

Create a namespace named development.

```bash
kubectl create namespace development
```

Expected Output:

```
namespace/development created
```

Verify:

```bash
kubectl get ns
```

Expected Output:

```
NAME              STATUS
default           Active
development       Active
kube-system       Active
kube-public       Active
kube-node-lease   Active
```

---

# Step 3 - Create Another Namespace

Create a namespace named production.

```bash
kubectl create namespace production
```

Verify:

```bash
kubectl get ns
```

Expected Output:

```
default
development
production
kube-system
kube-public
kube-node-lease
```

---

# Step 4 - Deploy a Pod into Development Namespace

Create a file named:

```
cake-pod-dev.yaml
```

Add the following content:

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: cake-app
  namespace: development

spec:
  containers:
  - name: cake-container
    image: cake-delivery:v1
    imagePullPolicy: Never

    ports:
    - containerPort: 80
```

Explanation:

| Property | Value |
|----------|-------|
| Namespace | development |
| Pod Name | cake-app |
| Image | cake-delivery:v1 |

Deploy:

```bash
kubectl apply -f cake-pod-dev.yaml
```

Expected Output:

```
pod/cake-app created
```

---

# Step 5 - Verify the Pod

Display Pods inside the development namespace.

```bash
kubectl get pods -n development
```

Expected Output:

```
NAME        READY   STATUS
cake-app    1/1     Running
```

Without specifying the namespace:

```bash
kubectl get pods
```

Expected Output:

```
No resources found in default namespace.
```

Observation:

The Pod exists only inside the development namespace.

---

# Step 6 - Deploy Another Pod into Production Namespace

Create a file named:

```
cake-pod-prod.yaml
```

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: cake-app
  namespace: production

spec:
  containers:
  - name: cake-container
    image: cake-delivery:v1

    imagePullPolicy: Never

    ports:
    - containerPort: 80
```

Deploy:

```bash
kubectl apply -f cake-pod-prod.yaml
```

Verify:

```bash
kubectl get pods -n production
```

Expected Output:

```
NAME
cake-app
```

---

# Step 7 - View Pods from All Namespaces

Display Pods from every namespace.

```bash
kubectl get pods --all-namespaces
```

or

```bash
kubectl get pods -A
```

Expected Output:

```
NAMESPACE      NAME
development    cake-app
production     cake-app
kube-system    coredns
kube-system    etcd
...
```

Observation:

Pods with the same name can exist in different namespaces.

---

# Step 8 - Describe the Pod

Describe the Pod in the development namespace.

```bash
kubectl describe pod cake-app -n development
```

Observe:

- Namespace
- Node
- Container
- Events
- Image

---

# Step 9 - View Logs

Display application logs.

```bash
kubectl logs cake-app -n development
```

Expected Output:

NGINX startup logs displayed successfully.

---

# Step 10 - Access the Application

Forward the Pod port.

```bash
kubectl port-forward pod/cake-app 8080:80 -n development
```

Open:

```
http://localhost:8080
```

Expected Result:

Cake Delivery application displayed successfully.

---

# Step 11 - Delete the Development Pod

Delete the Pod.

```bash
kubectl delete pod cake-app -n development
```

Verify:

```bash
kubectl get pods -n development
```

Expected Output:

```
No resources found.
```

---

# Step 12 - Delete the Namespace

Delete the namespace.

```bash
kubectl delete namespace development
```

Verify:

```bash
kubectl get ns
```

Expected Output:

```
default
production
kube-system
kube-public
kube-node-lease
```

Observation:

Deleting a namespace automatically deletes all resources inside it.

---


# Lab Summary

In this lab, Kubernetes Namespaces were used to logically separate applications within a single KIND cluster. Multiple namespaces were created, and identical Pods were deployed independently into each namespace, demonstrating resource isolation. The lab also covered viewing namespace-specific resources, accessing applications using port forwarding, inspecting Pods and logs, and understanding how deleting a namespace automatically removes all contained resources. This lab establishes the foundation for organizing applications and environments such as Development, Testing, and Production within Kubernetes.