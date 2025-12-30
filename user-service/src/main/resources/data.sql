-- Dữ liệu mẫu cho users
INSERT INTO users (email, password, first_name, last_name, phone_number, address, role, active, created_at, updated_at) VALUES
('admin@bookstore.com', 'admin123', 'Admin', 'User', '0901234567', '123 Admin Street', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('customer1@example.com', 'pass123', 'John', 'Doe', '0912345678', '456 Customer Ave', 'CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('customer2@example.com', 'pass123', 'Jane', 'Smith', '0923456789', '789 Buyer Road', 'CUSTOMER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
