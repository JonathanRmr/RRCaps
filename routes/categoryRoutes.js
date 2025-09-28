const express = require('express');
const router = express.Router();
const { 
    getAllCategories, 
    getCategoryById, 
    getCategoryWithCaps,
    createCategory, 
    updateCategory, 
    deleteCategory,
    getCategoryStats
} = require('../controllers/categoryController');

// Rutas de categorías (orden importante: rutas específicas antes que parámetros)
router.get('/stats', getCategoryStats);               // Obtener estadísticas de categorías
router.post('/', createCategory);                     // Crear nueva categoría
router.get('/', getAllCategories);                    // Obtener todas las categorías
router.get('/:id/caps', getCategoryWithCaps);         // Obtener categoría con sus gorras
router.get('/:id', getCategoryById);                  // Obtener categoría por ID
router.put('/:id', updateCategory);                   // Actualizar categoría
router.delete('/:id', deleteCategory);                // Eliminar categoría

module.exports = router;