const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const Cap = require('../models/cap');
const Category = require('../models/category');

// Todas las rutas requieren autenticación de admin
router.use(requireAdmin);

// Estadísticas avanzadas para admin
router.get('/stats', async (req, res) => {
    try {
        const totalCaps = await Cap.countDocuments();
        const totalCategories = await Category.countDocuments();
        
        // Gorras por categoría
        const capsByCategory = await Cap.aggregate([
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
                    count: { $sum: 1 },
                    avgPrice: { $avg: '$price' },
                    totalStock: { $sum: '$stock' }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Gorras con stock bajo (menos de 5)
        const lowStockCaps = await Cap.find({ stock: { $lt: 5, $gte: 0 } })
            .populate('category', 'name')
            .select('name price stock category')
            .sort({ stock: 1 });

        // Gorras sin stock
        const outOfStockCaps = await Cap.find({ stock: 0 })
            .populate('category', 'name')
            .select('name price category')
            .sort({ name: 1 });

        // Precios promedio, máximo y mínimo
        const priceStats = await Cap.aggregate([
            {
                $group: {
                    _id: null,
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        res.json({
            summary: {
                totalCaps,
                totalCategories,
                lowStockItems: lowStockCaps.length,
                outOfStockItems: outOfStockCaps.length
            },
            capsByCategory,
            lowStockCaps,
            outOfStockCaps,
            priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
            lastUpdated: new Date()
        });

    } catch (error) {
        console.error('Error en estadísticas de admin:', error);
        res.status(500).json({
            message: '❌ Error al obtener estadísticas',
            error: error.message
        });
    }
});

// Dashboard de actividad reciente (simulado - en producción vendría de logs)
router.get('/dashboard', async (req, res) => {
    try {
        const recentCaps = await Cap.find()
            .populate('category', 'name')
            .sort({ updatedAt: -1 })
            .limit(5);

        const recentCategories = await Category.find()
            .sort({ updatedAt: -1 })
            .limit(3);

        res.json({
            message: '📊 Dashboard de administrador',
            admin: {
                name: req.user.name,
                email: req.user.email
            },
            recentActivity: {
                caps: recentCaps,
                categories: recentCategories
            },
            quickActions: [
                { action: 'Crear gorra', endpoint: 'POST /api/caps' },
                { action: 'Crear categoría', endpoint: 'POST /api/categories' },
                { action: 'Ver estadísticas', endpoint: 'GET /api/admin/stats' }
            ]
        });

    } catch (error) {
        console.error('Error en dashboard:', error);
        res.status(500).json({
            message: '❌ Error al cargar dashboard',
            error: error.message
        });
    }
});

// Operaciones masivas - Actualizar stock de múltiples gorras
router.put('/bulk-update-stock', async (req, res) => {
    try {
        const { updates } = req.body; // Array de { id, stock }
        
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                message: '❌ Se requiere un array de actualizaciones'
            });
        }

        const results = [];
        
        for (const update of updates) {
            if (!update.id || update.stock === undefined) {
                results.push({
                    id: update.id || 'unknown',
                    success: false,
                    error: 'ID o stock faltante'
                });
                continue;
            }

            try {
                const updatedCap = await Cap.findByIdAndUpdate(
                    update.id,
                    { stock: update.stock },
                    { new: true }
                ).populate('category', 'name');

                if (updatedCap) {
                    results.push({
                        id: update.id,
                        success: true,
                        cap: updatedCap
                    });
                } else {
                    results.push({
                        id: update.id,
                        success: false,
                        error: 'Gorra no encontrada'
                    });
                }
            } catch (err) {
                results.push({
                    id: update.id,
                    success: false,
                    error: err.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;

        res.json({
            message: `✅ Actualización masiva completada: ${successCount} exitosas, ${errorCount} fallidas`,
            results,
            summary: {
                total: updates.length,
                successful: successCount,
                failed: errorCount
            }
        });

    } catch (error) {
        console.error('Error en actualización masiva:', error);
        res.status(500).json({
            message: '❌ Error en actualización masiva',
            error: error.message
        });
    }
});

module.exports = router;