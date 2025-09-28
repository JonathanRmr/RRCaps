const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const capRoutes = require('./routes/capRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

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
app.use('/api/categories', categoryRoutes);
app.use('/api/caps', capRoutes);

// Ruta de bienvenida
app.get('/api', (req, res) => {
    res.json({
        message: '🧢 API de Gorras - RRCaps',
        version: '2.0.0',
        endpoints: {
            caps: '/api/caps',
            categories: '/api/categories'
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