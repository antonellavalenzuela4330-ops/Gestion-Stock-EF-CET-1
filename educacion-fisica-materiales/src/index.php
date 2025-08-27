<?php
require_once 'db.php';
require_once 'MaterialController.php';

$controller = new MaterialController();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'add':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = $_POST['name'];
            $description = $_POST['description'];
            $controller->addMaterial($name, $description);
        }
        break;

    case 'delete':
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $controller->deleteMaterial($id);
        }
        break;

    case 'edit':
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
            $id = $_POST['id'];
            $name = $_POST['name'];
            $description = $_POST['description'];
            $controller->editMaterial($id, $name, $description);
        }
        break;

    default:
        $materials = $controller->getMaterials();
        include 'views/materiales.php';
        break;
}
?>