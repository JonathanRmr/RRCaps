const Cap = require('../models/cap');

// Obtener todas las gorras con filtros opcionales y populate de categoría
const getAllCaps = async (req, res) => {
    try {
        const { name, minPrice, maxPrice, category, size, material } = req.query;
        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (category) {
            filter.category = category; // Ahora es ObjectId
        }

        if (size) {
            filter.size = size;
        }

        if (material) {
            filter.material = { $regex: material, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const caps = await Cap.find(filter).populate('category', 'name league logo city colors');
        res.json(caps);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al obtener las gorras', error });
    }
};

// Obtener una gorra por ID con información de la categoría
const getCapById = async (req, res) => {
    try {
        const cap = await Cap.findById(req.params.id).populate('category');
        if (!cap) {
            return res.status(404).json({ message: 'Gorra no encontrada' });
        }
        res.json(cap);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al buscar la gorra', error });
    }
};

// Obtener gorras por categoría
const getCapsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const caps = await Cap.find({ category: categoryId }).populate('category');
        
        if (caps.length === 0) {
            return res.status(404).json({ message: 'No se encontraron gorras para esta categoría' });
        }
        
        res.json(caps);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al buscar gorras por categoría', error });
    }
};

// Crear una nueva gorra
const createCap = async (req, res) => {
    try {
        const newCap = new Cap(req.body);
        const savedCap = await newCap.save();
        
        // Populate la categoría en la respuesta
        const populatedCap = await Cap.findById(savedCap._id).populate('category');
        
        res.status(201).json(populatedCap);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: '❌ Error de validación', 
                error: error.message 
            });
        }
        res.status(500).json({ message: '❌ Error al agregar la gorra', error });
    }
};

// Actualizar una gorra existente
const updateCap = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCap = await Cap.findByIdAndUpdate(id, req.body, { 
            new: true,
            runValidators: true
        }).populate('category');
        
        if (!updatedCap) {
            return res.status(404).json({ message: 'Gorra no encontrada' });
        }
        
        res.json(updatedCap);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: '❌ Error de validación', 
                error: error.message 
            });
        }
        res.status(500).json({ message: 'Error al actualizar la gorra', error });
    }
};

// Eliminar una gorra
const deleteCap = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCap = await Cap.findByIdAndDelete(id);
        if (!deletedCap) {
            return res.status(404).json({ message: 'Gorra no encontrada' });
        }
        res.json({ message: 'Gorra eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la gorra', error });
    }
};

// Buscar gorras con filtros avanzados
const searchCaps = async (req, res) => {
    try {
        const { q, sortBy, order = 'asc' } = req.query;
        
        let filter = {};
        if (q) {
            filter = {
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { material: { $regex: q, $options: 'i' } }
                ]
            };
        }

        let sortOption = {};
        if (sortBy) {
            sortOption[sortBy] = order === 'desc' ? -1 : 1;
        }

        const caps = await Cap.find(filter)
            .populate('category', 'name league logo')
            .sort(sortOption);
        
        res.json({
            results: caps,
            count: caps.length,
            query: q || 'todas'
        });
    } catch (error) {
        res.status(500).json({ message: '❌ Error en la búsqueda', error });
    }
};

module.exports = {
    getAllCaps,
    getCapById,
    getCapsByCategory,
    createCap,
    updateCap,
    deleteCap,
    searchCaps
};