

DROP DATABASE IF EXISTS bamazon; 

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
	price FLOAT(5,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Lawnmower", "Gardening", 100.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("50lb Grasssead", "Gardening", 20.00, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Washermachine", "Home Appliances", 250.00, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dryer", "Home Appliances", 400.00, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Playstation 4", "Videogames", 300.00, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("X-Box One", "Videogames", 349.99, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("keyboard", "Music", 99.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bass", "Music", 200.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flatscreen 50inch TV", "Entertainment", 500.00, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flascreen 30inch TV", "Entertainment", 300.00, 25);

SELECT * FROM products
