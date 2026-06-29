############################################################
# PUBLIC SUBNET
############################################################

resource "aws_subnet" "public" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.public_subnet_cidr

  availability_zone = "${var.aws_region}a"

  map_public_ip_on_launch = true

  tags = {

    Name = "${var.project_name}-public-subnet"

    Environment = var.environment

  }

}

############################################################
# PRIVATE SUBNET
############################################################

resource "aws_subnet" "private" {

  vpc_id = aws_vpc.main.id

  cidr_block = var.private_subnet_cidr

  availability_zone = "${var.aws_region}a"

  tags = {

    Name = "${var.project_name}-private-subnet"

    Environment = var.environment

  }

}