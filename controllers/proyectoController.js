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

        await proyecto.save();

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}

exports.obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }

}

exports.actualizarProyecto = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }

    const id = req.params.id;

    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        let proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        proyecto = await Proyecto.findByIdAndUpdate(id, { $set: nuevoProyecto }, { new: true });

        res.json({ proyecto })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }

}

exports.eliminarProyecto = async (req, res) => {
    const id = req.params.id;

    try {
        let proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        proyecto = await Proyecto.findByIdAndDelete(id);

        res.json({
            msg: 'Proyecto eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}