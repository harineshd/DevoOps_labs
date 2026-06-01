Lab 02 - Docker Hub Login and Repository Management

Objective

The objective of this lab is to authenticate Docker CLI with Docker Hub and learn how to create and manage Docker Hub repositories.

By completing this lab, you will learn how to:

Login to Docker Hub using Docker CLI
Verify Docker authentication
Create Public Repositories
Create Private Repositories
Configure Repository Settings
Configure Repository Permissions
Understand Public vs Private repositories

---

Prerequisites

Before starting this lab, ensure you have:

Docker installed
Docker daemon running
Docker Hub account
Personal Access Token (Optional)

---

Verify Docker Installation:

docker --version

Expected Output:

Docker version 28.x.x

In this lab we will connect Docker CLI to Docker Hub and create repositories that will later store Docker images.

Step 1 - Login to Docker Hub

Execute:

docker login

Docker prompts:

Username:
Password:

Provide your Docker Hub credentials.

Expected Result:

Login Succeeded

Screenshot:


Step 2: Verify Authentication

Check Docker configuration:

Linux:

cat ~/.docker/config.json

Result:

{
  "auths": {
    "https://index.docker.io/v1/": {}
  }
}

Step 3 - Create Public Repository
Navigate to:

https://hub.docker.com

Click:

Repositories

Then:

Create Repository

Provide:

Repository Name:

docker-hub-lab-public

Description:

Public repository for Docker learning

Visibility:

Public

Click:

Create

Expected Result:

Repository created successfully.

Repository URL:

https://hub.docker.com/r/<username>/docker-hub-lab-public

Step 4 : Create Private Repository

Click:

Create Repository

Repository Name:

docker-hub-lab-private

Visibility:

Private

Click:

Create

Expected Result:

Private repository created successfully.

Step 5:Configure Repository Permissions
Navigate:

Settings

→

Collaborators

Add collaborator:

sampleuser

Permission Options:

Read

Can:

Pull Images
View Repository

Cannot:

Push Images
Write

Can:

Pull Images
Push Images

Cannot:

Modify Repository Settings
Admin

Can:

Pull Images
Push Images
Delete Images
Manage Repository

Expected Result:

Permissions configured successfully.

Expected Outputs
After successful completion of this lab:

Docker CLI authenticated with Docker Hub
Docker Hub login verified
Public repository created
Private repository created
Repository settings understood
Repository permissions configured
Docker Hub ready for image publishing

Cleanup

No cleanup required.

The repositories created in this lab will be used in the next lab for pushing Docker images.

Lab Summary

In this lab, Docker CLI was successfully authenticated with Docker Hub. Public and private repositories were created, repository settings were reviewed, and access permissions were configured. The environment is now ready for publishing Docker images to Docker Hub.