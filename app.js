const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const capRoutes = require('./routes/capRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ========== SWAGGER IMPORTS ==========
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
// =====================================

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

// ========== RUTA DE SWAGGER ==========
// Documentación interactiva de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "RRCaps API Docs"
}));
// =====================================

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
        documentation: 'http://localhost:' + PORT + '/api-docs', // ← Agregado enlace a Swagger
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
        documentation: 'http://localhost:' + PORT + '/api-docs', // ← Agregado enlace a Swagger
        apiInfo: '/api'
    });
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación API: http://localhost:${PORT}/api`);
    console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`); // ← Nuevo mensaje
});

module.exports = app;