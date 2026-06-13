Lab 01 - Kubernetes Cluster Setup Using KIND on Windows
Objective

The objective of this lab is to install and configure a local Kubernetes cluster on Windows using KIND (Kubernetes IN Docker).

By completing this lab, you will learn how to:

Install Docker Desktop
Install kubectl
Install KIND
Create a Kubernetes cluster locally
Verify cluster components
Interact with the cluster using kubectl
Deploy a test application
Access Kubernetes resources
Delete the cluster when finished
Prerequisites

Before starting this lab, ensure you have:

Requirement	Status
Windows 10/11	Required
Administrator Access	Required
Docker Desktop Installed	Required
WSL2 Enabled	Recommended
Internet Connectivity	Required
Environment Details
Component	Version
Windows	Windows 11
Docker Desktop	Latest
Kubernetes	KIND Default Version
kubectl	Latest Stable
KIND	Latest Release

Architecture
Windows Machine
        │
        ▼
Docker Desktop
        │
        ▼
KIND Cluster
        │
 ┌──────┴──────┐
 │             │
Control Plane  Worker Node(s)
        │
        ▼
Kubernetes Resources
(Pods, Services, Deployments)

Step 1 - Verify Docker Installation

Open PowerShell or CMD.

Execute:

docker version

Expected Result:

Docker Client and Server information should be displayed.

Example:

Client:
 Version: 28.x.x

Server:
 Engine:
 Version: 28.x.x