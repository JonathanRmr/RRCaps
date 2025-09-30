const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    registerAdmin, 
    verifyToken, 
    changePassword 
} = require('../controllers/authController');
const { requireAdmin } = require('../middleware/auth');

// Rutas públicas de autenticación
router.post('/login', loginAdmin);           // Login de admin
router.post('/register', registerAdmin);     // Registro de admin (temporal)

// Rutas protegidas (requieren token de admin)
router.get('/verify', requireAdmin, verifyToken);        // Verificar token
router.put('/change-password', requireAdmin, changePassword); // Cambiar contraseña

module.exports = router;