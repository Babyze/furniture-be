CREATE TABLE customer (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  is_agree_all_policy TINYINT(1) DEFAULT '1',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY email (email)
);

CREATE TABLE seller (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) DEFAULT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY email (email)
);

CREATE TABLE category_area (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  measurements VARCHAR(255),
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES seller(id),
  FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE product_category_area (
  product_id INT NOT NULL,
  category_area_id INT NOT NULL,
  PRIMARY KEY (product_id, category_area_id),
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (category_area_id) REFERENCES category_area(id)
);

CREATE TABLE spu (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  product_id INT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE sku (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  spu_id INT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spu_id) REFERENCES spu(id)
);

CREATE TABLE spu_attribute (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  spu_id INT NOT NULL,
  attribute_name VARCHAR(255) NOT NULL,
  attribute_value VARCHAR(255) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (spu_id) REFERENCES spu(id)
);

CREATE TABLE orders (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE order_item (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  sku_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (sku_id) REFERENCES sku(id)
);

CREATE TABLE cart (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE cart_item (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  sku_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (cart_id) REFERENCES cart(id),
  FOREIGN KEY (sku_id) REFERENCES sku(id)
);

CREATE TABLE product_image (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id)
);

INSERT INTO
  seller (
    email,
    password,
    full_name,
    created_date,
    updated_date
  )
VALUES
  (
    'seller@gmail.com',
    '$2a$10$csfhw5zUOTUPfk16zww6EeAakZSJurzIOzAioU15nhOKRnuzu1nd.',
    'Seller',
    '2025-02-27 15:00:00',
    '2025-02-27 15:00:00'
  );

INSERT INTO category_area (name, created_date, updated_date) VALUES
('Living Room', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Bed Room', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Kitchen', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Bath Room', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Outdoor', '2025-02-27 15:00:00', '2025-02-27 15:00:00');

INSERT INTO category (name, created_date, updated_date) VALUES
('Table', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Bed', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Seating', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Lighting', '2025-02-27 15:00:00', '2025-02-27 15:00:00'),
('Decor & Accessories', '2025-02-27 15:00:00', '2025-02-27 15:00:00');
