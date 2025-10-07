const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { 
    createCap, 
    getAllCaps, 
    getCapById, 
    updateCap, 
    deleteCap,
    getCapsByCategory,
    searchCaps
} = require('../controllers/capController');

router.get('/search', searchCaps);
router.get('/', getAllCaps);
router.get('/category/:categoryId', getCapsByCategory);
router.get('/:id', getCapById);

router.post('/', requireAdmin, createCap);
router.put('/:id', requireAdmin, updateCap);
router.delete('/:id', requireAdmin, deleteCap);

module.exports = router;
