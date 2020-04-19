const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    const { email, password } = req.body;

    try {
        // Revisar que el usuario sea unico
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                msg: "El usuario ya existe"
            })
        }

        usuario = new Usuario(req.body);

        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)

        await usuario.save();

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
        console.log(error);
        res.status(400).send(`Error: ${error}`);
    }
}