const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');

// Iniciar sesión
router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    ],
    authController.autenticarUsuario
);

// Obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
);

module.exports = router;