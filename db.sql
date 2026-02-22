SET FOREIGN_KEY_CHECKS = 0;

-- Create the database
CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS equipment_records;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS trainer_session;
DROP TABLE IF EXISTS trainer_service;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS membership;

-- 1. MEMBERSHIP (Parent Table for Members)
CREATE TABLE membership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membership_type ENUM('30-day', '90-day', 'annual') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_paused BOOLEAN DEFAULT FALSE,
    membership_status ENUM('active', 'paused', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER (Central Identity Table - Merged with Staff and Member)
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role ENUM('staff', 'member', 'guest') NOT NULL DEFAULT 'guest',
    date_of_birth DATE,
    password VARCHAR(255), -- Staff specific
    staff_role ENUM('admin', 'trainer', 'receptionist', 'janitor') DEFAULT NULL, -- Staff specific
    emergency_contact VARCHAR(255), -- Member specific
    membership_id INT, -- Member specific
    is_suspended BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES membership(id) ON DELETE SET NULL
);

-- 3. TRAINER_SERVICE (Independent Table)
CREATE TABLE trainer_service (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TRAINER_SESSION (Links User, User, and Service)
CREATE TABLE trainer_session (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL, -- References user(id)
    staff_id INT NOT NULL, -- References user(id)
    service_id INT NOT NULL,
    session_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (member_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES trainer_service(id) ON DELETE CASCADE
);

-- 5. EQUIPMENT (Managed by Staff)
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL, -- References user(id)
    name VARCHAR(100) NOT NULL,
    type ENUM('Machine', 'Free Weight', 'Cardio', 'Accessory') NOT NULL,
    amount INT NOT NULL DEFAULT 1,
    brand VARCHAR(100),
    serial_num VARCHAR(50) NOT NULL,
    warranty_expiry DATE,
    purchased_on DATETIME NOT NULL,
    purchase_cost DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES user(id)
);

-- 6. EQUIPMENT_RECORDS (Maintenance logs)
CREATE TABLE equipment_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    staff_id INT NOT NULL, -- References user(id)
    status ENUM('Good', 'Fair', 'Damaged', 'Out of Service') DEFAULT 'Good',
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES user(id)
);

-- 7. ATTENDANCE (Links Users)
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    staff_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (staff_id) REFERENCES user(id)
);

-- 8. PAYMENT (Financial Transactions)
CREATE TABLE payment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_type ENUM('registration', 'renewal', 'one-time', 'service') NOT NULL,
    user_id INT,
    membership_id INT, -- Nullable (could be a guest paying for water)
    attendance_id INT, -- Nullable
    staff_id INT NOT NULL, -- References user(id)
    method ENUM('cash', 'gcash', 'card') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tendered DECIMAL(10, 2) NULL,
    change_amount DECIMAL(10, 2) NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (membership_id) REFERENCES membership(id),
    FOREIGN KEY (attendance_id) REFERENCES attendance(id),
    FOREIGN KEY (staff_id) REFERENCES user(id)
);

-- Default Receptionist Account (Password: admin123)
-- Note: In a real application, ensure the backend hashes this password before checking.
INSERT INTO user (id, first_name, last_name, email, phone, role, password, staff_role) VALUES 
(1, 'Reception', 'Desk', 'admin@gym.com', '000-000-0000', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'receptionist');

-- 1. Memberships
INSERT INTO membership (id, membership_type, start_date, end_date, membership_status) VALUES
(1, '30-day', DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'active'),
(2, '90-day', DATE_SUB(CURDATE(), INTERVAL 60 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'active'),
(3, 'annual', DATE_SUB(CURDATE(), INTERVAL 200 DAY), DATE_ADD(CURDATE(), INTERVAL 165 DAY), 'active'),
(4, '30-day', DATE_SUB(CURDATE(), INTERVAL 40 DAY), DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'expired'),
(5, '90-day', DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 85 DAY), 'active'),
(6, '30-day', DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'active'),
(7, '30-day', DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 'active'),
(8, '90-day', DATE_SUB(CURDATE(), INTERVAL 80 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'active'),
(9, 'annual', DATE_SUB(CURDATE(), INTERVAL 300 DAY), DATE_ADD(CURDATE(), INTERVAL 65 DAY), 'active'),
(10, '30-day', DATE_SUB(CURDATE(), INTERVAL 25 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'paused');

-- 2. Users (Staff)
INSERT INTO user (first_name, last_name, email, phone, role, password, staff_role) VALUES
('Juan', 'Dela Cruz', 'juan@gym.com', '09171111111', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'admin'),
('Maria', 'Santos', 'maria@gym.com', '09172222222', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'receptionist'),
('Jose', 'Rizal', 'jose@gym.com', '09173333333', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'trainer'),
('Andres', 'Bonifacio', 'andres@gym.com', '09174444444', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'trainer'),
('Emilio', 'Aguinaldo', 'emilio@gym.com', '09175555555', 'staff', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'janitor');

-- 3. Users (Members)
INSERT INTO user (first_name, last_name, email, phone, role, date_of_birth, emergency_contact, membership_id) VALUES
('Gabriela', 'Silang', 'gabriela@gmail.com', '09181111111', 'member', '1990-01-01', 'Diego Silang - 09180000000', 1),
('Melchora', 'Aquino', 'melchora@gmail.com', '09182222222', 'member', '1985-05-05', 'Son - 09182222222', 2),
('Antonio', 'Luna', 'antonio@gmail.com', '09183333333', 'member', '1992-10-10', 'Brother - 09183333333', 3),
('Gregorio', 'del Pilar', 'gregorio@gmail.com', '09184444444', 'member', '1995-12-12', 'Uncle - 09184444444', 4),
('Apolinario', 'Mabini', 'apolinario@gmail.com', '09185555555', 'member', '1988-07-07', 'Mother - 09185555555', 5),
('Marcelo', 'del Pilar', 'marcelo@gmail.com', '09186666666', 'member', '1980-08-30', 'Wife - 09186666666', 6),
('Francisco', 'Balagtas', 'francisco@gmail.com', '09187777777', 'member', '1993-04-02', 'Father - 09187777777', 7),
('Graciano', 'Lopez Jaena', 'graciano@gmail.com', '09188888888', 'member', '1989-11-30', 'Sister - 09188888888', 8),
('Juan', 'Luna', 'juanluna@gmail.com', '09189999999', 'member', '1987-10-23', 'Brother - 09189999999', 9),
('Diego', 'Silang', 'diego@gmail.com', '09180000000', 'member', '1991-03-19', 'Wife - 09180000000', 10);

-- 4. Users (Guests)
INSERT INTO user (first_name, last_name, email, phone, role) VALUES
('Lapu', 'Lapu', 'lapulapu@yahoo.com', '09191111111', 'guest'),
('Sultan', 'Kudarat', 'sultan@yahoo.com', '09192222222', 'guest'),
('Rajah', 'Sulayman', 'rajah@yahoo.com', '09193333333', 'guest'),
('Tandang', 'Sora', 'tandang@yahoo.com', '09194444444', 'guest'),
('Panday', 'Pira', 'panday@yahoo.com', '09195555555', 'guest');

-- 5. Equipment
INSERT INTO equipment (staff_id, name, type, amount, brand, serial_num, purchased_on, purchase_cost) VALUES
(2, 'Treadmill 3000', 'Cardio', 3, 'LifeFitness', 'TF-1001', NOW(), 50000.00),
(2, 'Dumbbell Set', 'Free Weight', 1, 'Rogue', 'DB-500', NOW(), 15000.00),
(2, 'Bench Press', 'Machine', 2, 'Technogym', 'BP-200', NOW(), 25000.00);

-- 6. Payments (Memberships)
INSERT INTO payment (payment_type, user_id, membership_id, staff_id, method, amount, tendered, change_amount, is_paid, payment_date) VALUES
('registration', 7, 1, 3, 'cash', 1500.00, 2000.00, 500.00, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
('registration', 8, 2, 3, 'card', 4000.00, 4000.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 60 DAY)),
('registration', 9, 3, 3, 'gcash', 15000.00, 15000.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 200 DAY)),
('registration', 10, 4, 3, 'cash', 1500.00, 1500.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 40 DAY)),
('registration', 11, 5, 3, 'cash', 4000.00, 5000.00, 1000.00, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
('registration', 12, 6, 3, 'card', 1500.00, 1500.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 15 DAY)),
('registration', 13, 7, 3, 'gcash', 1500.00, 1500.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
('registration', 14, 8, 3, 'cash', 4000.00, 4000.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 80 DAY)),
('registration', 15, 9, 3, 'card', 15000.00, 15000.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 300 DAY)),
('registration', 16, 10, 3, 'cash', 1500.00, 1500.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 25 DAY));

-- 7. Payments (Guests - One Time)
INSERT INTO payment (payment_type, user_id, staff_id, method, amount, tendered, change_amount, is_paid, payment_date) VALUES
('one-time', 17, 3, 'cash', 50.00, 100.00, 50.00, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
('one-time', 18, 3, 'cash', 50.00, 50.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
('one-time', 19, 3, 'gcash', 50.00, 50.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
('one-time', 20, 3, 'cash', 50.00, 100.00, 50.00, 1, DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
('one-time', 21, 3, 'cash', 50.00, 50.00, 0.00, 1, DATE_SUB(CURDATE(), INTERVAL 20 DAY));

-- 8. Attendance (Randomized)
-- Staff (Juan)
INSERT INTO attendance (user_id, staff_id, check_in_time, check_out_time) VALUES
(2, 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 0 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 0 DAY), ' 17:00:00')),
(2, 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 17:00:00')),
(2, 2, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 17:00:00'));

-- Members
INSERT INTO attendance (user_id, staff_id, check_in_time, check_out_time) VALUES
(7, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 09:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 11:00:00')),
(7, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 18:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 3 DAY), ' 20:00:00')),
(8, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 07:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 08:30:00')),
(9, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 16:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 17:30:00')),
(11, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 0 DAY), ' 10:00:00'), NULL), -- Currently checked in
(12, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 14:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 4 DAY), ' 16:00:00')),
(13, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 19:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 21:00:00'));

-- Guests
INSERT INTO attendance (user_id, staff_id, check_in_time, check_out_time) VALUES
(17, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 13:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 15:00:00')),
(18, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 10:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 2 DAY), ' 12:00:00')),
(19, 3, CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 15:00:00'), CONCAT(DATE_SUB(CURDATE(), INTERVAL 5 DAY), ' 17:00:00'));

SET FOREIGN_KEY_CHECKS = 1;