#########################################################
# AWS Configuration
#########################################################

variable "aws_region" {

  description = "AWS Region"

  type = string

  default = "ap-south-1"

}

#########################################################
# Project Configuration
#########################################################

variable "project_name" {

  description = "Project Name"

  type = string

  default = "terraform-nginx"

}

variable "environment" {

  description = "Environment Name"

  type = string

  default = "dev"

}

#########################################################
# Network Configuration
#########################################################

variable "vpc_cidr" {

  default = "10.0.0.0/16"

}

variable "public_subnet_cidr" {

  default = "10.0.1.0/24"

}

variable "private_subnet_cidr" {

  default = "10.0.2.0/24"

}

#########################################################
# EC2 Configuration
#########################################################

variable "instance_type" {

  default = "t3.micro"

}

variable "ami_id" {

  description = "Amazon Linux 2023 AMI"

  type = string

  # Update this AMI if AWS releases a newer one
  default = "ami-0d351f1b760a30161"

}