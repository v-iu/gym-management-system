<?php

class Database{
    private $host = 'localhost';
    private $user = 'root';
    private $pass = '';
    private $dbName = 'gym_management';
    
    private $dbh; //handler
    private $stmt;
    private $error;

    public function __construct(){
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbName;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );

//create instance
        try {
        $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e){
            $this->error = $e->getMessage();
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $this->error]);
            exit;
        }
    }
    
    //stmt
    public function query($sql) {
        $this->stmt = $this->dbh->prepare($sql);
    }
    //bind
    public function bind($param, $value, $type = null){
        if(is_null($type)){
            switch (true){
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }
    //execute
    public function execute() {
        return $this->stmt->execute();
    }

    //result set
    public function resultSet() {
        $this->execute();
        return $this->stmt->fetchAll(PDO::FETCH_OBJ);
    }
    //single
    public function single() {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_OBJ);
    }

    // number of rows returned/affected by the last statement
    public function rowCount() {
        return $this->stmt->rowCount();
    }

    // Convenience wrappers for PDO functionality used by models
    public function lastInsertId() {
        return $this->dbh->lastInsertId();
    }

    public function beginTransaction() {
        return $this->dbh->beginTransaction();
    }

    public function commit() {
        return $this->dbh->commit();
    }

    public function rollBack() {
        return $this->dbh->rollBack();
    }
}
