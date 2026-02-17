-- Create the database
CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- 1. STAFF (Independent Table)
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    role ENUM('admin', 'trainer', 'receptionist', 'janitor') NOT NULL DEFAULT 'trainer',
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. GUEST (Independent Table)
CREATE TABLE guest (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRAINER_SERVICE (Independent Table)
CREATE TABLE trainer_service (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MEMBERSHIP (Parent Table for Members)
CREATE TABLE membership (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membership_type ENUM('30-day', '90-day', 'annual') NOT NULL,
    start_date DATE NOT NULL,
    total_days INT NOT NULL,
    is_paused BOOLEAN DEFAULT FALSE,
    membership_status ENUM('active', 'paused', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. MEMBER (Dependent on Membership)
CREATE TABLE member (
    id INT PRIMARY KEY AUTO_INCREMENT,
    membership_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    emergency_contact VARCHAR(255) NOT NULL,
    member_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES membership(id) ON DELETE CASCADE
);

-- 6. TRAINER_SESSION (Links Member, Staff, and Service)
CREATE TABLE trainer_session (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT NOT NULL,
    staff_id INT NOT NULL,
    service_id INT NOT NULL,
    session_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES trainer_service(id) ON DELETE CASCADE
);

-- 7. EQUIPMENT (Managed by Staff)
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('Machine', 'Free Weight', 'Cardio', 'Accessory') NOT NULL,
    amount INT NOT NULL DEFAULT 1,
    brand VARCHAR(100),
    serial_num VARCHAR(50) NOT NULL,
    warranty_expiry DATE,
    purchased_on DATETIME NOT NULL,
    purchase_cost DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 8. EQUIPMENT_RECORDS (Maintenance logs)
CREATE TABLE equipment_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    staff_id INT NOT NULL,
    status ENUM('Good', 'Fair', 'Damaged', 'Out of Service') DEFAULT 'Good',
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 9. ATTENDANCE (Links Members/Guests and Staff)
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT, -- Nullable because it might be a guest
    guest_id INT,  -- Nullable because it might be a member
    staff_id INT NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    FOREIGN KEY (member_id) REFERENCES member(id),
    FOREIGN KEY (guest_id) REFERENCES guest(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- 10. PAYMENT (Financial Transactions)
CREATE TABLE payment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_type ENUM('registration', 'renewal', 'one-time', 'service') NOT NULL,
    membership_id INT, -- Nullable (could be a guest paying for water)
    attendance_id INT, -- Nullable
    staff_id INT NOT NULL,
    method ENUM('cash', 'gcash', 'card') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (membership_id) REFERENCES membership(id),
    FOREIGN KEY (attendance_id) REFERENCES attendance(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);