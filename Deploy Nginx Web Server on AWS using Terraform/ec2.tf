############################################################
# EC2 INSTANCE
############################################################

resource "aws_instance" "web" {

  ami = var.ami_id

  instance_type = var.instance_type

  subnet_id = aws_subnet.public.id

  vpc_security_group_ids = [

    aws_security_group.web_sg.id

  ]

  associate_public_ip_address = true

  user_data = file("${path.module}/userdata.sh")

  tags = {

    Name = "${var.project_name}-web-server"

    Environment = var.environment

  }

}