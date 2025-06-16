const express = require('express');
const router = express.Router();
const { createCap,  getAllCaps, getCapById, updateCap, deleteCap } = require('../controllers/capController');



// Ruta para agregar una nueva gorra
router.post('/', createCap);

router.get('/', getAllCaps);
router.get('/:id', getCapById);

router.put('/:id', updateCap);      // Modificar gorra
router.delete('/:id', deleteCap);   // Eliminar gorra


module.exports = router;
