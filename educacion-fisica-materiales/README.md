# Educación Física Materiales

Este proyecto tiene como objetivo gestionar la información de los materiales de Educación Física. Permite agregar, eliminar, editar y guardar materiales de manera eficiente.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
educacion-fisica-materiales
├── src
│   ├── db.php                # Conexión a la base de datos utilizando PDO
│   ├── MaterialController.php # Controlador para manejar las operaciones de materiales
│   ├── index.php             # Punto de entrada de la aplicación
│   └── views
│       └── materiales.php     # Vista para mostrar los materiales
├── sql
│   └── schema.sql            # Esquema de la base de datos
├── config
│   └── config.php            # Configuración de la aplicación
├── README.md                 # Documentación del proyecto
```

## Requisitos

- PHP 7.4 o superior
- Servidor web (Apache/Nginx)
- Base de datos MySQL

## Instalación

1. Clona el repositorio:
   ```
   git clone <URL_DEL_REPOSITORIO>
   ```

2. Navega al directorio del proyecto:
   ```
   cd educacion-fisica-materiales
   ```

3. Importa el esquema de la base de datos:
   ```sql
   -- Ejecuta el contenido de sql/schema.sql en tu base de datos
   ```

4. Configura las credenciales de la base de datos en `config/config.php`.

## Uso

- Accede a `index.php` en tu navegador para interactuar con la aplicación.
- Utiliza las funciones disponibles para agregar, eliminar, editar y listar materiales.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.