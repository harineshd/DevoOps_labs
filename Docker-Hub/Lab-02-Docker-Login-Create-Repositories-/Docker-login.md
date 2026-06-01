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
<img width="872" height="78" alt="image" src="https://github.com/user-attachments/assets/c501915c-da05-4f5b-8c0c-062388dccab0" />

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

<img width="1429" height="308" alt="image" src="https://github.com/user-attachments/assets/1ff0dfd6-6a4f-4984-bec4-87c0bcd45834" />


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


<img width="1364" height="942" alt="image" src="https://github.com/user-attachments/assets/10606dda-260b-4e06-a3c3-82533135d40b" />


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

<img width="1364" height="942" alt="image" src="https://github.com/user-attachments/assets/01e9f88f-8b5f-4024-b8d5-7d56b7c42bd4" />



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
