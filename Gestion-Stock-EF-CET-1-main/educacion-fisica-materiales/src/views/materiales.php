<?php
// Este archivo es una vista. Asume que $materials es provisto por index.php
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

    <form id="material-form" method="POST" action="?action=add">
        <input type="hidden" name="id" value="">
        <input type="text" name="name" placeholder="Nombre del material" required>
        <textarea name="description" placeholder="Descripción del material" required></textarea>
        <button type="submit">Agregar Material</button>
    </form>

    <h2>Lista de Materiales</h2>
    <ul>
        <?php foreach ($materials as $material): ?>
            <li>
                <strong><?php echo htmlspecialchars($material['name']); ?></strong>: <?php echo htmlspecialchars($material['description']); ?>
                <form method="POST" action="?action=delete&id=<?php echo $material['id']; ?>" style="display:inline;">
                    <button type="submit">Eliminar</button>
                </form>
                <button onclick="editMaterial(<?php echo (int)$material['id']; ?>, '<?php echo htmlspecialchars($material['name'], ENT_QUOTES); ?>', '<?php echo htmlspecialchars($material['description'], ENT_QUOTES); ?>')">Editar</button>
            </li>
        <?php endforeach; ?>
    </ul>

    <script>
        function editMaterial(id, name, description) {
            const form = document.getElementById('material-form');
            form.action = '?action=edit';
            form.querySelector('input[name="id"]').value = id;
            form.querySelector('input[name="name"]').value = name;
            form.querySelector('textarea[name="description"]').value = description;
            form.querySelector('button[type="submit"]').innerText = 'Actualizar Material';
        }
    </script>
</body>
</html>