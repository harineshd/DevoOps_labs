LAB 02: Build and Deploy an Online Cake Delivery Application on KIND Kubernetes Cluster

Objective

The objective of this lab is to build a simple web application, containerize it using Docker, and deploy it on a Kubernetes Pod running inside a KIND cluster.

By completing this lab, you will learn how to:

Create a simple web application
Create a Dockerfile
Build a Docker image
Load a local image into a KIND cluster
Create a Kubernetes Pod
Run a container inside a Pod
Access the application running in Kubernetes
Understand the relationship between Application, Container, Pod, Node, and Cluster

Prerequisites

Before starting this lab, ensure you have completed:

Lab 01 - KIND Cluster Setup

Verify the cluster is running:

kubectl get nodes

Expected Output:

NAME                               STATUS   ROLES
my-first-cluster-control-plane     Ready    control-plane
my-first-cluster-worker            Ready    <none>
my-first-cluster-worker2           Ready    <none>

Architecture

![alt text](image-6.png)

Application Overview

In this lab, we will create a simple Online Cake Delivery application.

Application Features:

Display Cake Store Homepage
Show Available Cakes
Demonstrate application deployment on Kubernetes


STEPS TO SETUP THINGS

Step 1 - Create Application Directory

Create a new folder:

mkdir cake-delivery-app

cd cake-delivery-app

Application workspace created successfully.

Step 2 - Create Application File

Create a file named:

index.html

Add the following content:

Please fidn the HTMl file in Repo  : Appfiles/index.html

Open the HTML in browser:
![alt text](image.png)


Step 3 - Create Dockerfile

Create a file named:

Dockerfile

Add the following content:

```yaml
FROM nginx:latest

COPY index.html /usr/share/nginx/html/index.html
```
Explanation:

Uses NGINX as the web server
Copies the application page into the NGINX web root

Step 4 - Build Docker Image

Build the Docker image:

`docker build -t cake-delivery:v1 .`

![alt text](image-1.png)

Verify image:

`docker images`

![alt text](image-2.png)

![alt text](image-3.png)

Step 5 - Load Docker Image into KIND Cluster

Since KIND runs Kubernetes nodes as Docker containers, the image must be loaded into the cluster.

Execute:

```kind load docker-image cake-delivery:v1 --name my-first-cluster```


![alt text](image-4.png)

How to verify the image is loaded or not into containers

`docker exec -it myfirstcluster-control-plane crictl images`

![alt text](image-5.png)

Step 6 - Create Pod Manifest

Create a file named:

cake-pod.yaml

Add the following content:


```yml
apiVersion: v1
kind: Pod

metadata:
  name: cake-app

spec:
  containers:
  - name: cake-container
    image: cake-delivery:v1

    imagePullPolicy: Never

    ports:
    - containerPort: 80
```

Explanation:

- Property	                Value
- Pod Name	               cake-app
- Container Name	       cake-container
- Image	                   cake-delivery:v1
- Container Port	       80
    
   
   Step 7 - Deploy the Pod

Deploy the Pod to Kubernetes:

```kubectl apply -f cake-pod.yaml```

![alt text](image-6.png)


Step 8 - Verify Pod Status

Check Pod status:

```kubectl get pods```

![alt text](image-7.png)


Step 9 - Verify Pod Placement

Check which node is running the Pod:

```kubectl get pods -o wide```

The Kubernetes Scheduler automatically selected a worker node for the Pod.

![alt text](image-8.png)


Step 10 - Verify Container Inside Pod

View Pod details:

```kubectl describe pod cake-app```

Locate:

Containers:
  cake-container

Observation:

![alt text](image-9.png)


Step 11 - Access the Application

Forward local port to the Pod:

``` kubectl port-forward pod/cake-app 8080:80```

![alt text](image-10.png)


Expected Result:

The Cake Delivery application page should be displayed.

![alt text](image-11.png)


Step 12 - View Application Logs

Display Pod logs:

```kubectl logs cake-app```

Expected Result:

Application logs displayed successfully.

![alt text](image-12.png)

Step 13 - Connect to the Container

Open an interactive shell inside the container:

``` kubectl exec -it cake-app -- sh```


Verify application files:

ls /usr/share/nginx/html

Expected Output:

index.html

![alt text](image-13.png)



Verification Checklist:

|Verification|   Item   |    Status     |
|------------|----------|---------------|
|Application | Created  |       ✓       |
| Dockerfile | Created  |       ✓       |
|   Docker   |  Image   |    Built ✓    |
|   Image    |  Loaded  |  into KIND ✓  |
|    Pod     | Created  |       ✓       |
| Container  | Running  |       ✓       |
|    Pod     |Scheduled |Successfully ✓ |
|Application |Accessible|       ✓       |
|    Logs    | Verified |       ✓       |
| Container  |  Access  |  Verified ✓   |



Expected Outputs

After successful completion of this lab:

A web application was created.
The application was containerized using Docker.
The Docker image was loaded into the KIND cluster.
A Kubernetes Pod was created.
The application was successfully deployed inside a container.
The application was accessed through Kubernetes.
The Pod lifecycle was validated.


Lab Summary

In this lab, a simple Online Cake Delivery application was developed and containerized using Docker. The Docker image was loaded into the KIND Kubernetes cluster and deployed using a Pod manifest. Kubernetes scheduled the Pod on one of the worker nodes, and the application was successfully accessed using port forwarding. This lab demonstrated the complete workflow from application creation to deployment on Kubernetes, providing a foundational understanding of how applications are packaged, deployed, and executed within a Kubernetes environment.