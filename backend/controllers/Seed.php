<?php
class Seed extends Controller {
    private $db;

    public function __construct(){
        $this->db = new Database();
    }

    public function index(){
        try {
            // Disable FK checks to allow truncation
            $this->db->query("SET FOREIGN_KEY_CHECKS = 0");
            $this->db->execute();

            // Truncate all tables
            $tables = ['payment', 'attendance', 'equipment_records', 'equipment', 'trainer_session', 'trainer_service', 'user', 'membership'];
            foreach ($tables as $table) {
                $this->db->query("TRUNCATE TABLE `$table`");
                $this->db->execute();
            }

            // 1. Memberships
            $memberships = [
                [1, '30-day', date('Y-m-d', strtotime("-10 days")), date('Y-m-d', strtotime("+20 days")), 'active'],
                [2, '90-day', date('Y-m-d', strtotime("-60 days")), date('Y-m-d', strtotime("+30 days")), 'active'],
                [3, 'annual', date('Y-m-d', strtotime("-200 days")), date('Y-m-d', strtotime("+165 days")), 'active'],
                [4, '30-day', date('Y-m-d', strtotime("-40 days")), date('Y-m-d', strtotime("-10 days")), 'expired'],
                [5, '90-day', date('Y-m-d', strtotime("-5 days")), date('Y-m-d', strtotime("+85 days")), 'active'],
                [6, '30-day', date('Y-m-d', strtotime("-15 days")), date('Y-m-d', strtotime("+15 days")), 'active'],
                [7, 'annual', date('Y-m-d', strtotime("-300 days")), date('Y-m-d', strtotime("+65 days")), 'active'],
                [8, '90-day', date('Y-m-d', strtotime("-100 days")), date('Y-m-d', strtotime("-10 days")), 'expired'],
                [9, '30-day', date('Y-m-d', strtotime("-25 days")), date('Y-m-d', strtotime("+5 days")), 'paused'],
                [10, 'annual', date('Y-m-d', strtotime("-10 days")), date('Y-m-d', strtotime("+355 days")), 'active'],
            ];

            foreach ($memberships as $m) {
                $this->db->query("INSERT INTO membership (id, membership_type, start_date, end_date, membership_status) VALUES (:id, :type, :start, :end, :status)");
                $this->db->bind(':id', $m[0]);
                $this->db->bind(':type', $m[1]);
                $this->db->bind(':start', $m[2]);
                $this->db->bind(':end', $m[3]);
                $this->db->bind(':status', $m[4]);
                $this->db->execute();
            }

            // 2. Users (Staff & Members)
            // Generate a valid hash for the current environment
            $password = password_hash('admin123', PASSWORD_DEFAULT);

            $users = [
                // Staff
                [1, 'Reception', 'Desk', 'admin@gym.com', '000-000-0000', 'staff', $password, 'receptionist', null, null],
                [2, 'Juan', 'Dela Cruz', 'juan@gym.com', '09171111111', 'staff', $password, 'admin', null, null],
                [3, 'Maria', 'Santos', 'maria@gym.com', '09172222222', 'staff', $password, 'receptionist', null, null],
                [4, 'Jose', 'Rizal', 'jose@gym.com', '09173333333', 'staff', $password, 'trainer', null, null],
                [5, 'Andres', 'Bonifacio', 'andres@gym.com', '09174444444', 'staff', $password, 'trainer', null, null],
                [6, 'Emilio', 'Aguinaldo', 'emilio@gym.com', '09175555555', 'staff', $password, 'janitor', null, null],
                
                // Members
                [7, 'Gabriela', 'Silang', 'gabriela@gmail.com', '09181111111', 'member', null, null, 'Diego - 09180000000', 1],
                [8, 'Melchora', 'Aquino', 'melchora@gmail.com', '09182222222', 'member', null, null, 'Son - 09182222222', 2],
                [9, 'Antonio', 'Luna', 'antonio@gmail.com', '09183333333', 'member', null, null, 'Brother - 09183333333', 3],
                [10, 'Gregorio', 'del Pilar', 'gregorio@gmail.com', '09184444444', 'member', null, null, 'Uncle - 09184444444', 4],
                [11, 'Apolinario', 'Mabini', 'apolinario@gmail.com', '09185555555', 'member', null, null, 'Mother - 09185555555', 5],
                [12, 'Marcelo', 'del Pilar', 'marcelo@gmail.com', '09186666666', 'member', null, null, 'Wife - 09186666666', 6],
                [13, 'Francisco', 'Balagtas', 'francisco@gmail.com', '09187777777', 'member', null, null, 'Father - 09187777777', 7],
                [14, 'Graciano', 'Lopez Jaena', 'graciano@gmail.com', '09188888888', 'member', null, null, 'Sister - 09188888888', 8],
                [15, 'Juan', 'Luna', 'juanluna@gmail.com', '09189999999', 'member', null, null, 'Brother - 09189999999', 9],
                [16, 'Diego', 'Silang', 'diego@gmail.com', '09180000000', 'member', null, null, 'Wife - 09180000000', 10],
                
                // Guests
                [17, 'Lapu', 'Lapu', 'lapulapu@yahoo.com', '09191111111', 'guest', null, null, null, null],
                [18, 'Sultan', 'Kudarat', 'sultan@yahoo.com', '09192222222', 'guest', null, null, null, null],
                [19, 'Rajah', 'Sulayman', 'rajah@yahoo.com', '09193333333', 'guest', null, null, null, null],
                [20, 'Tandang', 'Sora', 'tandang@yahoo.com', '09194444444', 'guest', null, null, null, null],
                [21, 'Panday', 'Pira', 'panday@yahoo.com', '09195555555', 'guest', null, null, null, null],
            ];

            foreach ($users as $u) {
                $this->db->query("INSERT INTO `user` (id, first_name, last_name, email, phone, role, password, staff_role, emergency_contact, membership_id) VALUES (:id, :fname, :lname, :email, :phone, :role, :pass, :staff_role, :emergency, :mem_id)");
                $this->db->bind(':id', $u[0]);
                $this->db->bind(':fname', $u[1]);
                $this->db->bind(':lname', $u[2]);
                $this->db->bind(':email', $u[3]);
                $this->db->bind(':phone', $u[4]);
                $this->db->bind(':role', $u[5]);
                $this->db->bind(':pass', $u[6]);
                $this->db->bind(':staff_role', $u[7]);
                $this->db->bind(':emergency', $u[8]);
                $this->db->bind(':mem_id', $u[9]);
                $this->db->execute();
            }

            // 3. Equipment
            $equipment = [
                [1, 2, 'Treadmill 3000', 'Cardio', 3, 'LifeFitness', 'TF-1001', date('Y-m-d', strtotime("+1 year")), date('Y-m-d', strtotime("-6 months")), 50000.00],
                [2, 2, 'Dumbbell Set', 'Free Weight', 1, 'Rogue', 'DB-500', null, date('Y-m-d', strtotime("-1 year")), 15000.00],
                [3, 2, 'Bench Press', 'Machine', 2, 'Technogym', 'BP-200', date('Y-m-d', strtotime("+2 years")), date('Y-m-d', strtotime("-3 months")), 25000.00],
                [4, 2, 'Yoga Mats', 'Accessory', 10, 'Lululemon', 'YM-10', null, date('Y-m-d', strtotime("-1 month")), 2000.00],
                [5, 2, 'Elliptical', 'Cardio', 2, 'Precor', 'EL-500', date('Y-m-d', strtotime("+1 year")), date('Y-m-d', strtotime("-2 months")), 45000.00],
            ];

            foreach ($equipment as $e) {
                $this->db->query("INSERT INTO equipment (id, staff_id, name, type, amount, brand, serial_num, warranty_expiry, purchased_on, purchase_cost) VALUES (:id, :staff_id, :name, :type, :amount, :brand, :serial, :warranty, :purchased, :cost)");
                $this->db->bind(':id', $e[0]);
                $this->db->bind(':staff_id', $e[1]);
                $this->db->bind(':name', $e[2]);
                $this->db->bind(':type', $e[3]);
                $this->db->bind(':amount', $e[4]);
                $this->db->bind(':brand', $e[5]);
                $this->db->bind(':serial', $e[6]);
                $this->db->bind(':warranty', $e[7]);
                $this->db->bind(':purchased', $e[8]);
                $this->db->bind(':cost', $e[9]);
                $this->db->execute();
            }

            // 4. Trainer Services
            $services = [
                [1, 'Personal Training (1hr)', 500.00, 60],
                [2, 'Boxing Session', 350.00, 60],
                [3, 'Yoga Class', 200.00, 60],
                [4, 'HIIT Group', 250.00, 45],
            ];

            foreach ($services as $s) {
                $this->db->query("INSERT INTO trainer_service (id, service_name, price, duration_minutes) VALUES (:id, :name, :price, :duration)");
                $this->db->bind(':id', $s[0]);
                $this->db->bind(':name', $s[1]);
                $this->db->bind(':price', $s[2]);
                $this->db->bind(':duration', $s[3]);
                $this->db->execute();
            }

            // 5. Trainer Sessions
            $sessions = [
                [1, 7, 4, 1, date('Y-m-d H:i:s', strtotime("+1 day 10:00:00")), 'scheduled'],
                [2, 8, 4, 2, date('Y-m-d H:i:s', strtotime("-2 days 14:00:00")), 'completed'],
                [3, 9, 4, 1, date('Y-m-d H:i:s', strtotime("+2 days 09:00:00")), 'scheduled'],
                [4, 11, 5, 3, date('Y-m-d H:i:s', strtotime("-1 day 16:00:00")), 'completed'],
                [5, 12, 5, 4, date('Y-m-d H:i:s', strtotime("+3 days 18:00:00")), 'scheduled'],
            ];

            foreach ($sessions as $s) {
                $this->db->query("INSERT INTO trainer_session (id, member_id, staff_id, service_id, session_date, status) VALUES (:id, :member, :staff, :service, :date, :status)");
                $this->db->bind(':id', $s[0]);
                $this->db->bind(':member', $s[1]);
                $this->db->bind(':staff', $s[2]);
                $this->db->bind(':service', $s[3]);
                $this->db->bind(':date', $s[4]);
                $this->db->bind(':status', $s[5]);
                $this->db->execute();
            }

            // 6. Payments
            $payments = [
                ['registration', 7, 1, 3, 'cash', 1500.00, 2000.00, 500.00, 1, "-10 days"],
                ['registration', 8, 2, 3, 'card', 4000.00, 4000.00, 0.00, 1, "-60 days"],
                ['registration', 9, 3, 3, 'gcash', 15000.00, 15000.00, 0.00, 1, "-200 days"],
                ['registration', 10, 4, 3, 'cash', 1500.00, 1500.00, 0.00, 1, "-40 days"],
                ['registration', 11, 5, 3, 'cash', 4000.00, 5000.00, 1000.00, 1, "-5 days"],
                ['registration', 12, 6, 3, 'card', 1500.00, 1500.00, 0.00, 1, "-15 days"],
                ['registration', 13, 7, 3, 'gcash', 15000.00, 15000.00, 0.00, 1, "-300 days"],
                ['one-time', 17, null, 3, 'cash', 50.00, 100.00, 50.00, 1, "-1 day"],
                ['one-time', 18, null, 3, 'cash', 50.00, 50.00, 0.00, 1, "-2 days"],
                ['one-time', 19, null, 3, 'gcash', 50.00, 50.00, 0.00, 1, "-5 days"],
                ['service', 8, null, 3, 'cash', 350.00, 500.00, 150.00, 1, "-2 days"], // Boxing session payment
                ['service', 11, null, 3, 'card', 200.00, 200.00, 0.00, 1, "-1 day"], // Yoga class payment
            ];

            foreach ($payments as $p) {
                $this->db->query("INSERT INTO payment (payment_type, user_id, membership_id, staff_id, method, amount, tendered, change_amount, is_paid, payment_date) VALUES (:type, :uid, :mid, :sid, :method, :amount, :tendered, :change, :paid, :date)");
                $this->db->bind(':type', $p[0]);
                $this->db->bind(':uid', $p[1]);
                $this->db->bind(':mid', $p[2]);
                $this->db->bind(':sid', $p[3]);
                $this->db->bind(':method', $p[4]);
                $this->db->bind(':amount', $p[5]);
                $this->db->bind(':tendered', $p[6]);
                $this->db->bind(':change', $p[7]);
                $this->db->bind(':paid', $p[8]);
                $this->db->bind(':date', date('Y-m-d H:i:s', strtotime($p[9])));
                $this->db->execute();
            }

            // 7. Attendance
            $attendance = [
                [2, 2, "-0 days 08:00:00", "-0 days 17:00:00"], // Staff
                [2, 2, "-1 days 08:00:00", "-1 days 17:00:00"],
                [2, 2, "-2 days 08:00:00", "-2 days 17:00:00"],
                [7, 3, "-1 days 09:00:00", "-1 days 11:00:00"], // Member
                [7, 3, "-3 days 18:00:00", "-3 days 20:00:00"],
                [8, 3, "-2 days 07:00:00", "-2 days 08:30:00"],
                [9, 3, "-5 days 16:00:00", "-5 days 17:30:00"],
                [11, 3, "-0 days 10:00:00", null], // Currently checked in
                [12, 3, "-4 days 14:00:00", "-4 days 16:00:00"],
                [13, 3, "-1 days 19:00:00", "-1 days 21:00:00"],
                [17, 3, "-1 days 13:00:00", "-1 days 15:00:00"], // Guest
                [18, 3, "-2 days 10:00:00", "-2 days 12:00:00"],
                [19, 3, "-5 days 15:00:00", "-5 days 17:00:00"],
            ];

            foreach ($attendance as $a) {
                $this->db->query("INSERT INTO attendance (user_id, staff_id, check_in_time, check_out_time) VALUES (:uid, :sid, :in, :out)");
                $this->db->bind(':uid', $a[0]);
                $this->db->bind(':sid', $a[1]);
                $this->db->bind(':in', date('Y-m-d H:i:s', strtotime($a[2])));
                $this->db->bind(':out', $a[3] ? date('Y-m-d H:i:s', strtotime($a[3])) : null);
                $this->db->execute();
            }

            // Re-enable FK checks
            $this->db->query("SET FOREIGN_KEY_CHECKS = 1");
            $this->db->execute();

            $this->json(['success' => true, 'message' => 'Database seeded successfully. Login with admin@gym.com / admin123']);
        } catch (Exception $e) {
            $this->error($e->getMessage(), 500);
        }
    }
}