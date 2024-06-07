CREATE TABLE product (
    "id" SERIAL NOT NULL,
    "codigo" varchar(255) NOT NULL,
    "nombre" varchar(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio decimal NOt NULL,
    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
) ;