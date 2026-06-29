############################################################
# PUBLIC ROUTE TABLE
############################################################

resource "aws_route_table" "public" {

  vpc_id = aws_vpc.main.id

  route {

    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id

  }

  tags = {

    Name = "${var.project_name}-public-rt"

    Environment = var.environment

  }

}

############################################################
# PRIVATE ROUTE TABLE
############################################################

resource "aws_route_table" "private" {

  vpc_id = aws_vpc.main.id

  tags = {

    Name = "${var.project_name}-private-rt"

    Environment = var.environment

  }

}

############################################################
# PUBLIC ROUTE TABLE ASSOCIATION
############################################################

resource "aws_route_table_association" "public" {

  subnet_id = aws_subnet.public.id

  route_table_id = aws_route_table.public.id

}

############################################################
# PRIVATE ROUTE TABLE ASSOCIATION
############################################################

resource "aws_route_table_association" "private" {

  subnet_id = aws_subnet.private.id

  route_table_id = aws_route_table.private.id

}