const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Generar JWT Token
const generateToken = (userId, email, role, name) => {
    return jwt.sign(
        { 
            userId, 
            email, 
            role, 
            name 
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: process.env.JWT_EXPIRE || '24h' 
        }
    );
};

// Login de Admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se enviaron email y password
        if (!email || !password) {
            return res.status(400).json({
                message: '❌ Email y contraseña son requeridos'
            });
        }

        // Buscar usuario por email
        const user = await User.findOne({ email, isActive: true });
        if (!user) {
            return res.status(401).json({
                message: '❌ Credenciales inválidas'
            });
        }

        // Verificar password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: '❌ Credenciales inválidas'
            });
        }

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Generar token
        const token = generateToken(user._id, user.email, user.role, user.name);

        // Responder con token e información del usuario
        res.json({
            message: '✅ Login exitoso',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            message: '❌ Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

// Registro de Admin (solo para crear el primer admin o admins adicionales)
const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({
                message: '❌ Nombre, email y contraseña son requeridos'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: '❌ La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si ya existe un usuario con ese email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: '❌ Ya existe un usuario con ese email'
            });
        }

        // Crear nuevo admin
        const newAdmin = new User({
            name,
            email,
            password,
            role: 'admin'
        });

        await newAdmin.save();

        // Generar token para el nuevo admin
        const token = generateToken(newAdmin._id, newAdmin.email, newAdmin.role, newAdmin.name);

        res.status(201).json({
            message: '✅ Admin creado exitosamente',
            token,
            user: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            message: '❌ Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

// Verificar token (para validar sesión)
const verifyToken = async (req, res) => {
    try {
        // El token ya fue verificado por el middleware
        // Solo retornamos la información del usuario
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: '❌ Usuario no encontrado o inactivo'
            });
        }

        res.json({
            message: '✅ Token válido',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Error en verificación de token:', error);
        res.status(500).json({
            message: '❌ Error interno del servidor'
        });
    }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        // Validaciones
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: '❌ Contraseña actual y nueva contraseña son requeridas'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: '❌ La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Buscar usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: '❌ Usuario no encontrado'
            });
        }

        // Verificar contraseña actual
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                message: '❌ La contraseña actual es incorrecta'
            });
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        res.json({
            message: '✅ Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            message: '❌ Error interno del servidor'
        });
    }
};

module.exports = {
    loginAdmin,
    registerAdmin,
    verifyToken,
    changePassword
};