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
                msg: 'El usuario no existe'
            })
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);

        if (!passCorrecto) {
            return res.status(400).json({
                msg: 'El password es incorrecto'
            })
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(payload, process.env.SECRETA, {
            // 1000 milisegundos
            // 60 segundos,
            // 60 minutos
            expiresIn: 1000 * 60 * 60
        }, (err, token) => {
            if (err) throw err;
            res.json({
                usuario,
                token
            })
        });

    } catch (error) {

    }
}