CREATE DATABASE IF NOT EXISTS warung_citut CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE warung_citut;

CREATE TABLE users (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nama VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 foto VARCHAR(255) DEFAULT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu (
 id INT AUTO_INCREMENT PRIMARY KEY,
 nama VARCHAR(100) NOT NULL,
 kategori ENUM('Makanan','Minuman') NOT NULL,
 harga DECIMAL(12,2) NOT NULL,
 deskripsi TEXT,
 emoji VARCHAR(20) DEFAULT '🍽️',
 gambar VARCHAR(255) DEFAULT NULL,
 aktif TINYINT(1) DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
 id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 total DECIMAL(12,2) NOT NULL,
 status ENUM('Diproses','Dimasak','Dikirim','Selesai','Dibatalkan') DEFAULT 'Diproses',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
 id INT AUTO_INCREMENT PRIMARY KEY,
 order_id INT NOT NULL,
 menu_id INT NOT NULL,
 qty INT NOT NULL,
 harga DECIMAL(12,2) NOT NULL,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY(menu_id) REFERENCES menu(id)
);

INSERT INTO menu(nama,kategori,harga,deskripsi,emoji) VALUES
('Nasi Goreng','Makanan',15000,'Nasi goreng gurih dengan telur dan sayuran.','🍛'),
('Mie Goreng','Makanan',12000,'Mie goreng dengan bumbu khas Waroeng CiTUT.','🍜'),
('Nasi Ayam Crispy','Makanan',18000,'Ayam crispy renyah dengan nasi hangat.','🍗'),
('Bakso','Makanan',12000,'Bakso kuah hangat dengan pelengkap.','🍲'),
('Es Teh Manis','Minuman',5000,'Es teh manis segar.','🧋'),
('Es Jeruk','Minuman',7000,'Minuman jeruk segar dan dingin.','🍊');

-- Password contoh: password
INSERT INTO users(nama,email,password) VALUES
('Ghanendra','user123@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC6W8hL6Yz3eM9x3Yk6');
