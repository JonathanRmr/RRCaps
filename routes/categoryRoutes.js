const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const { 
    getAllCategories, 
    getCategoryById, 
    getCategoryWithCaps,
    createCategory, 
    updateCategory, 
    deleteCategory,
    getCategoryStats
} = require('../controllers/categoryController');

router.get('/stats', getCategoryStats);
router.get('/', getAllCategories);
router.get('/:id/caps', getCategoryWithCaps);
router.get('/:id', getCategoryById);

router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

module.exports = router;
