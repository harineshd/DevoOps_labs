############################################################
# VPC
############################################################

output "vpc_id" {

  description = "VPC ID"

  value = aws_vpc.main.id

}

############################################################
# PUBLIC SUBNET
############################################################

output "public_subnet_id" {

  description = "Public Subnet ID"

  value = aws_subnet.public.id

}

############################################################
# PRIVATE SUBNET
############################################################

output "private_subnet_id" {

  description = "Private Subnet ID"

  value = aws_subnet.private.id

}

############################################################
# EC2 INSTANCE
############################################################

output "instance_id" {

  description = "EC2 Instance ID"

  value = aws_instance.web.id

}

############################################################
# PUBLIC IP
############################################################

output "public_ip" {

  description = "EC2 Public IP"

  value = aws_instance.web.public_ip

}

############################################################
# PUBLIC DNS
############################################################

output "public_dns" {

  description = "EC2 Public DNS"

  value = aws_instance.web.public_dns

}