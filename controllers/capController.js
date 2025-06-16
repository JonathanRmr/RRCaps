const Cap = require('../models/cap');

// Obtener todas las gorras con filtros opcionales
const getAllCaps = async (req, res) => {
    try {
        const { name, minPrice, maxPrice } = req.query;
        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const caps = await Cap.find(filter);
        res.json(caps);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al obtener las gorras', error });
    }
};

// Obtener una gorra por ID
const getCapById = async (req, res) => {
    try {
        const cap = await Cap.findById(req.params.id);
        if (!cap) {
            return res.status(404).json({ message: 'Gorra no encontrada' });
        }
        res.json(cap);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al buscar la gorra', error });
    }
};

// Crear una nueva gorra
const createCap = async (req, res) => {
    try {
        const newCap = new Cap(req.body);
        const savedCap = await newCap.save();
        res.status(201).json(savedCap);
    } catch (error) {
        res.status(500).json({ message: '❌ Error al agregar la gorra', error });
    }
};

// Actualizar una gorra existente
const updateCap = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCap = await Cap.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCap) {
            return res.status(404).json({ message: 'Gorra no encontrada' });
        }
        res.json(updatedCap);
    } catch (error) {
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

module.exports = {
    getAllCaps,
    getCapById,
    createCap,
    updateCap,
    deleteCap,
};

