#!/bin/bash

yum update -y

yum install nginx -y

systemctl enable nginx

systemctl start nginx

echo "<h1>Welcome to SmartLibrary Terraform Lab</h1>" > /usr/share/nginx/html/index.html