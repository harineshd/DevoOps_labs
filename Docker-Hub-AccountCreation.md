# Lab 01 - Docker Hub Account Creation

---

# Objective

The objective of this lab is to create and configure a Docker Hub account that will be used throughout the Docker learning journey.

By completing this lab, you will learn how to:

* Create a Docker Hub account
* Verify your email address
* Configure your Docker Hub profile
* Generate a Personal Access Token (PAT)
* Understand Docker Hub account settings
* Prepare Docker Hub for future image push and pull operations

---

# Prerequisites

Before starting this lab, ensure you have:

* Internet connectivity
* Valid email address
* Web browser (Chrome, Edge, Firefox, etc.)
* Docker Hub website access

Docker installation is NOT required for this lab.

---



In this lab, we will create an account that will later be used to store and manage Docker images.

---

# Step 1 - Navigate to Docker Hub

Open a web browser and navigate to:

https://hub.docker.com

Expected Result:

Docker Hub home page should load successfully.

<img width="2558" height="1442" alt="image" src="https://github.com/user-attachments/assets/211199e2-33fa-4e58-bc4b-3c4378767452" />


---

# Step 2 - Create Docker Hub Account

Click:

Sign Up

Fill the registration form.

Example:

Username:
yourusername

Email:
your-email@example.com

Password:
StrongPassword@123

Click:
Create Account

Expected Result:

Docker Hub account creation request is submitted.


<img width="1810" height="1229" alt="image" src="https://github.com/user-attachments/assets/6d43e1ec-3dd8-4b71-8c9b-61338f5ac608" />


---

# Step 3 - Login to Docker Hub

Navigate again to:

https://hub.docker.com

Click:

Sign In

Provide:

* Username
* Password

Expected Result:

Successful login to Docker Hub dashboard.

Screenshot:


<img width="2525" height="1286" alt="image" src="https://github.com/user-attachments/assets/4d39f843-a145-40b6-82e4-501a0e040003" />


---

# Step 5 - Configure Profile

Click profile icon.

Navigate to:
Account Settings
Update profile information:
Full Name
Your Name
Company
Personal Learning
Location
India
Bio
Click:
Save Changes
Expected Result:

Profile information updated successfully.

---

# Step 6 - Generate Personal Access Token

Navigate to:

Account Settings

→ Security

→ Personal Access Tokens

Click:

Generate New Token

<img width="2558" height="1250" alt="image" src="https://github.com/user-attachments/assets/9465e4f7-4908-4643-98ea-cd3201eb77ae" />

Provide:
Description
docker-learning-token
Permissions:
Read
Write
Delete
Expiration:
30 Days /none
Click:
Generate Token
Expected Result:
Personal Access Token generated successfully.

Example:
dckr_pat_xxxxxxxxxxxxxxxxxxxxxxxxx
IMPORTANT:
Copy and securely store the token.

Docker Hub will not display it again.


<img width="2022" height="669" alt="image" src="https://github.com/user-attachments/assets/858cb5e5-b4fe-4f1c-b24c-3d3c1968a8e0" />


---

# Verification Steps

Verify the following:

| Check                           | Status |
| ------------------------------- | ------ |
| Docker Hub account created      | ✓      |
| Email verified                  | ✓      |
| Login successful                | ✓      |
| Profile configured              | ✓      |
| Personal Access Token generated | ✓      |

---

# Expected Outputs

After successful completion of this lab:

* Docker Hub account exists
* Email verification completed
* Profile configured
* Personal Access Token available
* Account ready for Docker CLI authentication

---



# Cleanup

No cleanup is required for this lab.

The Docker Hub account created in this lab will be used in subsequent labs.

---

# Lab Summary

In this lab, a Docker Hub account was successfully created and configured. Email verification was completed, profile settings were updated, and a Personal Access Token was generated. The account is now ready for Docker CLI authentication and Docker image repository management in future labs.
