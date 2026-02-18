<?php
/**
 * ============================================================
 *  SAMPLE ITEM MODEL — REFERENCE FILE
 * ============================================================
 *
 *  This model talks to the `guest` table as a demo.
 *  Each method shows a different type of DB operation.
 *
 *  Pattern:
 *    1. $this->db->query($sql)   — prepare the statement
 *    2. $this->db->bind()        — bind parameters (prevents SQL injection)
 *    3. $this->db->execute()     — run it (for INSERT/UPDATE/DELETE)
 *       $this->db->resultSet()   — run it and fetch all rows (for SELECT many)
 *       $this->db->single()      — run it and fetch one row  (for SELECT one)
 *    4. $this->db->rowCount()    — number of affected rows
 * ============================================================
 */

class SampleItem {

    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    // ─── GET ALL ───────────────────────────────────────────────
    public function getAll() {
        $this->db->query("SELECT id, first_name, last_name, email, phone, created_at FROM guest ORDER BY id DESC");
        return $this->db->resultSet();
    }

    // ─── GET BY ID ─────────────────────────────────────────────
    public function getById($id) {
        $this->db->query("SELECT id, first_name, last_name, email, phone, created_at FROM guest WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    // ─── CREATE ────────────────────────────────────────────────
    public function create($data) {
        $this->db->query("INSERT INTO guest (first_name, last_name, email, phone) VALUES (:first_name, :last_name, :email, :phone)");
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        return $this->db->execute();
    }

    // ─── UPDATE ────────────────────────────────────────────────
    public function update($id, $data) {
        $this->db->query("UPDATE guest SET first_name = :first_name, last_name = :last_name, email = :email, phone = :phone WHERE id = :id");
        $this->db->bind(':id', $id);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':phone', $data['phone']);
        return $this->db->execute();
    }

    // ─── DELETE ────────────────────────────────────────────────
    public function delete($id) {
        $this->db->query("DELETE FROM guest WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->execute();
    }

    // ─── FIND BY EMAIL (for duplicate checks) ─────────────────
    public function findByEmail($email) {
        $this->db->query("SELECT id FROM guest WHERE email = :email");
        $this->db->bind(':email', $email);
        return $this->db->single();
    }
}
