const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');

// Ruta para registrar usuario
router.post('/register', UsersController.register);

// Ruta para login de usuario
router.post('/login', UsersController.login);

// Ruta para obtener todos los usuarios
router.get('/getAll', UsersController.getAll);

module.exports = router;