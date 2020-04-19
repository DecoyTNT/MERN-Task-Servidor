const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    try {

        const proyecto = new Proyecto(req.body);

        proyecto.creador = req.usuario.id;

        proyecto.save();

        res.json({
            proyecto
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}