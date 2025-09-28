const express = require('express');
const router = express.Router();
const { 
    createCap, 
    getAllCaps, 
    getCapById, 
    updateCap, 
    deleteCap,
    getCapsByCategory,
    searchCaps
} = require('../controllers/capController');

// Rutas principales de gorras
router.get('/search', searchCaps);                    // Buscar gorras (debe ir antes que /:id)
router.post('/', createCap);                          // Crear nueva gorra
router.get('/', getAllCaps);                          // Obtener todas las gorras (con filtros)
router.get('/category/:categoryId', getCapsByCategory); // Obtener gorras por categoría
router.get('/:id', getCapById);                       // Obtener gorra por ID
router.put('/:id', updateCap);                        // Actualizar gorra
router.delete('/:id', deleteCap);                     // Eliminar gorra

module.exports = router;