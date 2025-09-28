const Category = require('../models/category');
const Cap = require('../models/cap');

// Obtener todas las categorías
const getAllCategories = async (req, res) => {
    try {
        const { league } = req.query;
        const filter = {};
        
        if (league) {
            filter.league = league;
        }

        const categories = await Category.find(filter).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al obtener las categorías', error });
    }
};

// Obtener una categoría por ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al buscar la categoría', error });
    }
};

// Obtener una categoría con sus gorras
const getCategoryWithCaps = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        const caps = await Cap.find({ category: id }).populate('category');
        
        res.json({
            category,
            caps,
            totalCaps: caps.length
        });
    } catch (error) {
        res.status(500).json({ message: '❌ Error al obtener la categoría con gorras', error });
    }
};

// Crear una nueva categoría
const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: '❌ Ya existe una categoría con ese nombre' 
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: '❌ Error de validación', 
                error: error.message 
            });
        }
        res.status(500).json({ message: '❌ Error al agregar la categoría', error });
    }
};

// Actualizar una categoría existente
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { 
            new: true,
            runValidators: true
        });
        
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        res.json(updatedCategory);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: '❌ Ya existe una categoría con ese nombre' 
            });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: '❌ Error de validación', 
                error: error.message 
            });
        }
        res.status(500).json({ message: 'Error al actualizar la categoría', error });
    }
};

// Eliminar una categoría
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si hay gorras asociadas a esta categoría
        const capsWithCategory = await Cap.countDocuments({ category: id });
        
        if (capsWithCategory > 0) {
            return res.status(400).json({ 
                message: `❌ No se puede eliminar la categoría porque tiene ${capsWithCategory} gorra(s) asociada(s)` 
            });
        }
        
        const deletedCategory = await Category.findByIdAndDelete(id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        
        res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría', error });
    }
};

// Obtener estadísticas de las categorías
const getCategoryStats = async (req, res) => {
    try {
        const stats = await Cap.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $group: {
                    _id: '$category',
                    categoryName: { $first: '$categoryInfo.name' },
                    totalCaps: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    totalStock: { $sum: '$stock' }
                }
            },
            {
                $sort: { totalCaps: -1 }
            }
        ]);
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al obtener estadísticas', error });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithCaps,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryStats
};