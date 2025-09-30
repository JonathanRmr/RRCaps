const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para verificar si el usuario está autenticado como admin
const requireAdmin = async (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: '❌ Acceso denegado. Token requerido'
            });
        }

        // Extraer el token
        const token = authHeader.substring(7); // Remover 'Bearer '

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar que el rol sea admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                message: '❌ Acceso denegado. Permisos de administrador requeridos'
            });
        }

        // Verificar que el usuario aún existe y está activo
        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                message: '❌ Token inválido. Usuario no encontrado o inactivo'
            });
        }

        // Adjuntar información del usuario a la request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name
        };

        next();

    } catch (error) {
        console.error('Error en middleware de auth:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: '❌ Token inválido'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: '❌ Token expirado'
            });
        }

        return res.status(500).json({
            message: '❌ Error interno del servidor'
        });
    }
};

// Middleware opcional para verificar admin (no bloquea si no hay token)
const optionalAdmin = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        // Si no hay token, continuar como usuario público
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = null;
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Si el token es válido y es admin, adjuntar info
        if (decoded.role === 'admin') {
            const user = await User.findById(decoded.userId);
            if (user && user.isActive) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role,
                    name: decoded.name
                };
            }
        }

        next();

    } catch (error) {
        // Si hay error con el token, continuar como usuario público
        req.user = null;
        next();
    }
};

// Middleware para logging de actividad de admin
const logAdminActivity = (action) => {
    return (req, res, next) => {
        // Crear log después de que la operación sea exitosa
        const originalSend = res.send;
        
        res.send = function(data) {
            // Solo loguear si la operación fue exitosa (status 2xx)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log(`📝 Admin Activity: ${req.user.name} (${req.user.email}) - ${action} - ${new Date().toISOString()}`);
                
                // Aquí podrías guardar en base de datos para audit logs más robustos
                // await AuditLog.create({ 
                //     userId: req.user.userId, 
                //     action, 
                //     timestamp: new Date() 
                // });
            }
            
            originalSend.call(this, data);
        };
        
        next();
    };
};

module.exports = {
    requireAdmin,
    optionalAdmin,
    logAdminActivity
};