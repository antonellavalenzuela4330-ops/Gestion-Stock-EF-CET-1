// Cargar XLSX desde múltiples CDNs y ejecutar callback al terminar
function loadXLSXAndThen(onReady) {
    if (typeof window.XLSX !== 'undefined') {
        onReady();
        return;
    }

    const cdnUrls = [
        'https://cdn.jsdelivr.net/npm/xlsx@0.19.3/dist/xlsx.full.min.js',
        'https://unpkg.com/xlsx@0.19.3/dist/xlsx.full.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.19.3/xlsx.full.min.js'
    ];

    let currentIndex = 0;

    const tryNext = () => {
        if (typeof window.XLSX !== 'undefined') {
            onReady();
            return;
        }
        if (currentIndex >= cdnUrls.length) {
            alert('No se pudo cargar la librería para exportar a Excel desde los CDNs disponibles.');
            return;
        }
        const url = cdnUrls[currentIndex++];
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => onReady();
        script.onerror = () => {
            if (script.parentNode) script.parentNode.removeChild(script);
            tryNext();
        };
        document.head.appendChild(script);
    };

    tryNext();
}

// Aplicación de Gestión de Stock para Educación Física
class StockManager {
    constructor() {
        this.inventory = [];
        this.currentId = 1;
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.renderInventory();
        this.updateStatistics();
        this.loadSampleData();
    }

    // Cargar datos de ejemplo si no hay datos
    loadSampleData() {
        if (this.inventory.length === 0) {
            const sampleData = [
                {
                    id: 1,
                    name: "Pelotas de Voley",
                    totalQuantity: 15,
                    goodCondition: 12,
                    badCondition: 3,
                    owner: "Colegio",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Pelotas de Futbol",
                    totalQuantity: 20,
                    goodCondition: 18,
                    badCondition: 2,
                    owner: "Prof. Juan Perez",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Conos de Entrenamiento",
                    totalQuantity: 50,
                    goodCondition: 45,
                    badCondition: 5,
                    owner: "Prof. Maria Garcia",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "Cuerdas de Salto",
                    totalQuantity: 30,
                    goodCondition: 25,
                    badCondition: 5,
                    owner: "Colegio",
                    lastUpdated: new Date().toISOString()
                },
                {
                    id: 5,
                    name: "Aros de Hula",
                    totalQuantity: 25,
                    goodCondition: 20,
                    badCondition: 5,
                    owner: "Prof. Carlos Lopez",
                    lastUpdated: new Date().toISOString()
                }
            ];
            
            this.inventory = sampleData;
            this.currentId = 6;
            this.saveToLocalStorage();
            this.renderInventory();
            this.updateStatistics();
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botón de guardar en el modal
        document.getElementById('saveItem').addEventListener('click', () => {
            this.saveItem();
        });

        // Botón de confirmar eliminación
        document.getElementById('confirmDelete').addEventListener('click', () => {
            this.deleteItem();
        });

        // Validación en tiempo real del formulario
        document.getElementById('totalQuantity').addEventListener('input', (e) => {
            this.validateQuantities();
        });

        document.getElementById('goodCondition').addEventListener('input', (e) => {
            this.validateQuantities();
        });

        document.getElementById('badCondition').addEventListener('input', (e) => {
            this.validateQuantities();
        });

        // Limpiar formulario cuando se cierra el modal
        document.getElementById('addItemModal').addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        });

        // Búsqueda en tiempo real
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query === '') {
                this.renderInventory();
            } else {
                this.searchMaterials(query);
            }
        });
    }

    // Validar que las cantidades sean coherentes
    validateQuantities() {
        const total = parseInt(document.getElementById('totalQuantity').value) || 0;
        const good = parseInt(document.getElementById('goodCondition').value) || 0;
        const bad = parseInt(document.getElementById('badCondition').value) || 0;

        if (good + bad > total) {
            document.getElementById('badCondition').setCustomValidity('La suma de buen y mal estado no puede exceder la cantidad total');
        } else {
            document.getElementById('badCondition').setCustomValidity('');
        }
    }

    // Agregar o editar material
    saveItem() {
        const form = document.getElementById('itemForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const itemId = document.getElementById('itemId').value;
        const item = {
            name: document.getElementById('materialName').value,
            totalQuantity: parseInt(document.getElementById('totalQuantity').value),
            goodCondition: parseInt(document.getElementById('goodCondition').value),
            badCondition: parseInt(document.getElementById('badCondition').value),
            owner: document.getElementById('owner').value,
            lastUpdated: new Date().toISOString()
        };

        if (itemId) {
            // Editar elemento existente
            const index = this.inventory.findIndex(i => i.id == itemId);
            if (index !== -1) {
                item.id = parseInt(itemId);
                this.inventory[index] = item;
            }
        } else {
            // Agregar nuevo elemento
            item.id = this.currentId++;
            this.inventory.push(item);
        }

        this.saveToLocalStorage();
        this.renderInventory();
        this.updateStatistics();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
        modal.hide();
        
        this.showNotification('Material guardado exitosamente', 'success');
    }

    // Eliminar material
    deleteItem() {
        const itemId = parseInt(document.getElementById('itemId').value);
        this.inventory = this.inventory.filter(item => item.id !== itemId);
        
        this.saveToLocalStorage();
        this.renderInventory();
        this.updateStatistics();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        this.showNotification('Material eliminado exitosamente', 'success');
    }

    // Editar material
    editItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            document.getElementById('modalTitle').textContent = 'Editar Material';
            document.getElementById('itemId').value = item.id;
            document.getElementById('materialName').value = item.name;
            document.getElementById('totalQuantity').value = item.totalQuantity;
            document.getElementById('goodCondition').value = item.goodCondition;
            document.getElementById('badCondition').value = item.badCondition;
            document.getElementById('owner').value = item.owner;
            
            const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
            modal.show();
        }
    }

    // Eliminar material (mostrar confirmación)
    showDeleteConfirmation(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            document.getElementById('itemId').value = item.id;
            const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
            modal.show();
        }
    }

    // Renderizar tabla de inventario
    renderInventory() {
        const tbody = document.getElementById('inventoryTable');
        tbody.innerHTML = '';

        this.inventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">Actualizado: ${this.formatDate(item.lastUpdated)}</small>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-primary">${item.totalQuantity}</span>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-success">${item.goodCondition}</span>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-warning">${item.badCondition}</span>
                </td>
                <td class="owner-cell">
                    <i class="fas fa-user me-1"></i>${item.owner}
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="stockManager.editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="stockManager.showDeleteConfirmation(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Actualizar estadísticas
    updateStatistics() {
        const totalMaterials = this.inventory.length;
        const totalGood = this.inventory.reduce((sum, item) => sum + item.goodCondition, 0);
        const totalBad = this.inventory.reduce((sum, item) => sum + item.badCondition, 0);
        const uniqueOwners = new Set(this.inventory.map(item => item.owner)).size;

        document.getElementById('totalMaterials').textContent = totalMaterials;
        document.getElementById('totalGood').textContent = totalGood;
        document.getElementById('totalBad').textContent = totalBad;
        document.getElementById('totalOwners').textContent = uniqueOwners;
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Resetear formulario
    resetForm() {
        document.getElementById('modalTitle').textContent = 'Agregar Material';
        document.getElementById('itemForm').reset();
        document.getElementById('itemId').value = '';
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        // Crear notificación personalizada
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Guardar en localStorage
    saveToLocalStorage() {
        localStorage.setItem('efStockInventory', JSON.stringify(this.inventory));
        localStorage.setItem('efStockCurrentId', this.currentId.toString());
    }

    // Cargar desde localStorage
    loadFromLocalStorage() {
        const savedInventory = localStorage.getItem('efStockInventory');
        const savedCurrentId = localStorage.getItem('efStockCurrentId');
        
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
        }
        
        if (savedCurrentId) {
            this.currentId = parseInt(savedCurrentId);
        }
    }

    // Buscar materiales
    searchMaterials(query) {
        const filtered = this.inventory.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.owner.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredInventory(filtered);
    }

    // Renderizar inventario filtrado
    renderFilteredInventory(filteredInventory) {
        const tbody = document.getElementById('inventoryTable');
        tbody.innerHTML = '';

        filteredInventory.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">Actualizado: ${this.formatDate(item.lastUpdated)}</small>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-primary">${item.totalQuantity}</span>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-success">${item.goodCondition}</span>
                </td>
                <td class="quantity-cell">
                    <span class="badge bg-warning">${item.badCondition}</span>
                </td>
                <td class="owner-cell">
                    <i class="fas fa-user me-1"></i>${item.owner}
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="stockManager.editItem(${item.id})">
                        <i class="btn btn-sm btn-outline-primary me-1" onclick="stockManager.editItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="stockManager.showDeleteConfirmation(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.stockManager = new StockManager();
});

// Función global para exportar
function exportInventory() {
    if (!window.stockManager) return;
    // Exportación simple y confiable a CSV
    window.stockManager.exportToCSV();
}

// Función global para exportar a Excel
function exportToExcel() {
    if (!window.stockManager) return;
    
    // Verificar si XLSX está disponible
    if (typeof XLSX === 'undefined') {
        // Intentar cargar XLSX si no está disponible
        loadXLSXAndThen(() => {
            window.stockManager.exportToXLSX();
        });
    } else {
        window.stockManager.exportToXLSX();
    }
}

// Función global para buscar
function searchInventory() {
    const query = document.getElementById('searchInput').value;
    if (window.stockManager) {
        if (query.trim() === '') {
            window.stockManager.renderInventory();
        } else {
            window.stockManager.searchMaterials(query);
        }
    }
}
