const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // Revisar si haay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Datos de acceso incorrectos'
            })
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if (!passCorrecto) {
            return res.status(400).json({
                msg: 'Datos de acceso incorrectos'
            })
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            // 60 segundos,
            // 60 minutos
            expiresIn: 60 * 60
        }, (err, token) => {
            if (err) throw err;
            res.json({
                token
            })
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}

// Obtiene el usuario autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({
            usuario
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}