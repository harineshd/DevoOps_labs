############################################################
# SECURITY GROUP
############################################################

resource "aws_security_group" "web_sg" {

  name = "${var.project_name}-web-sg"

  description = "Allow SSH and HTTP"

  vpc_id = aws_vpc.main.id

  ##########################################################
  # SSH
  ##########################################################

  ingress {

    description = "SSH"

    from_port = 22

    to_port = 22

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ##########################################################
  # HTTP
  ##########################################################

  ingress {

    description = "HTTP"

    from_port = 80

    to_port = 80

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ##########################################################
  # HTTPS
  ##########################################################

  ingress {

    description = "HTTPS"

    from_port = 443

    to_port = 443

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ##########################################################
  # OUTBOUND
  ##########################################################

  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

  tags = {

    Name = "${var.project_name}-web-sg"

    Environment = var.environment

  }

}