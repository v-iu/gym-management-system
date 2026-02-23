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
(1, 'Reception', 'Desk', 'admin@gym.com', '000-000-0000', 'staff', '$2y$10$EixZaYVK1fsbw1ZfbX3OXePaWrn9IzyV1ntXR0sXRCy.baWekyZLi', 'receptionist');

SET FOREIGN_KEY_CHECKS = 1;