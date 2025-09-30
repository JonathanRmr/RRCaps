const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const capRoutes = require('./routes/capRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Configuración de variables de entorno
dotenv.config();

// Inicialización de la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/caps', capRoutes);

// Ruta de bienvenida
app.get('/api', (req, res) => {
    res.json({
        message: '🧢 API de Gorras - RRCaps',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            admin: '/api/admin',
            caps: '/api/caps',
            categories: '/api/categories'
        },
        publicEndpoints: {
            'GET /api/caps': 'Ver todas las gorras',
            'GET /api/categories': 'Ver todas las categorías'
        },
        adminEndpoints: {
            'POST /api/auth/login': 'Login de administrador',
            'POST /api/caps': 'Crear gorra (requiere admin)',
            'PUT /api/caps/:id': 'Editar gorra (requiere admin)',
            'DELETE /api/caps/:id': 'Eliminar gorra (requiere admin)'
        }
    });
});

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({
        message: '🧢 Bienvenido a RRCaps API',
        documentation: '/api'
    });
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación disponible en http://localhost:${PORT}/api`);
});

module.exports = app;