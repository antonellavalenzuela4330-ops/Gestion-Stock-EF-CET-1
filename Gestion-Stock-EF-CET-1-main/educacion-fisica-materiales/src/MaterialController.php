<?php

class MaterialController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function addMaterial($name, $description) {
        $stmt = $this->db->prepare("INSERT INTO materiales (name, description) VALUES (:name, :description)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        return $stmt->execute();
    }

    public function deleteMaterial($id) {
        $stmt = $this->db->prepare("DELETE FROM materiales WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function editMaterial($id, $name, $description) {
        $stmt = $this->db->prepare("UPDATE materiales SET name = :name, description = :description WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        return $stmt->execute();
    }

    public function getMaterials() {
        $stmt = $this->db->query("SELECT * FROM materiales");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}