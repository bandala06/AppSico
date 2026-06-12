const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verificar que el encabezado de autorización exista
    if (!authHeader) {
        return res.status(403).json({
            success: false,
            message: 'No se proporcionó el token.'
        });
    }

    // Extraer el token del encabezado
    const token = authHeader.split(' ')[1]; // Extrae el token después de 'Bearer'

    // Verificar el token JWT usando la clave secreta desde la variable de entorno
    jwt.verify(token, process.env.JWT_SECRET || 'hT7gHJfdfK83hL9hsTgFgk98JHjL7lgfsdKJfgh98Ddf7g3dFdfgdfgH', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Fallo la autenticación del token.'
            });
        }

        // Guardar la información decodificada en req.user
        req.user = decoded;
        next();
    });
};

// Middleware para verificar si el usuario es administrador
const authorizeAdmin = (req, res, next) => {
    // Asegurarse de que el campo 'rol' coincide con la estructura de los tokens generados
    if (req.user.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción.'
        });
    }
    next();
};

module.exports = { verifyToken, authorizeAdmin };