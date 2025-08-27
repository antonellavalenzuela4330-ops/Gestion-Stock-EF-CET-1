<?php
require_once '../db.php';
require_once '../MaterialController.php';

$materialController = new MaterialController();

// Handle form submissions for adding, editing, or deleting materials
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add'])) {
        $name = $_POST['name'];
        $description = $_POST['description'];
        $materialController->addMaterial($name, $description);
    } elseif (isset($_POST['edit'])) {
        $id = $_POST['id'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $materialController->editMaterial($id, $name, $description);
    } elseif (isset($_POST['delete'])) {
        $id = $_POST['id'];
        $materialController->deleteMaterial($id);
    }
}

// Retrieve materials to display
$materials = $materialController->getMaterials();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materiales de Educación Física</title>
</head>
<body>
    <h1>Materiales de Educación Física</h1>

    <form method="POST">
        <input type="text" name="name" placeholder="Nombre del material" required>
        <textarea name="description" placeholder="Descripción del material" required></textarea>
        <button type="submit" name="add">Agregar Material</button>
    </form>

    <h2>Lista de Materiales</h2>
    <ul>
        <?php foreach ($materials as $material): ?>
            <li>
                <strong><?php echo htmlspecialchars($material['name']); ?></strong>: <?php echo htmlspecialchars($material['description']); ?>
                <form method="POST" style="display:inline;">
                    <input type="hidden" name="id" value="<?php echo $material['id']; ?>">
                    <button type="submit" name="delete">Eliminar</button>
                </form>
                <button onclick="editMaterial(<?php echo $material['id']; ?>, '<?php echo htmlspecialchars($material['name']); ?>', '<?php echo htmlspecialchars($material['description']); ?>')">Editar</button>
            </li>
        <?php endforeach; ?>
    </ul>

    <script>
        function editMaterial(id, name, description) {
            document.querySelector('input[name="id"]').value = id;
            document.querySelector('input[name="name"]').value = name;
            document.querySelector('textarea[name="description"]').value = description;
            document.querySelector('button[name="add"]').innerText = 'Actualizar Material';
            document.querySelector('button[name="edit"]').style.display = 'inline';
        }
    </script>
</body>
</html>