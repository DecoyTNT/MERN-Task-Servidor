const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearTarea = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array()
        })
    }


    try {

        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({
            tarea
        });


    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}

exports.obtenerTareas = async (req, res) => {


    try {
        const { proyecto } = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        const tareas = await Tarea.find({ proyecto });
        res.json({
            tareas
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}


exports.actualizarTarea = async (req, res) => {


    try {
        const id = req.params.id;

        const { nombre, estado } = req.body;

        let tarea = await Tarea.findById(id);

        if (!tarea) {
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        const existeProyecto = await Proyecto.findById(tarea.proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        const nuevaTarea = {}

        nuevaTarea.nombre = nombre;

        nuevaTarea.estado = estado;

        tarea = await Tarea.findOneAndUpdate({ _id: id }, nuevaTarea, { new: true });
        res.json({
            tarea
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}

exports.eliminarTarea = async (req, res) => {

    try {
        const id = req.params.id;

        let tarea = await Tarea.findById(id);

        if (!tarea) {
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            })
        }

        const existeProyecto = await Proyecto.findById(tarea.proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            })
        }

        // Verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado'
            })
        }

        tarea = await Tarea.findOneAndRemove({ _id: id });
        res.json({
            tarea,
            msg: 'Tarea eliminada'
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Error: ${error}`);
    }
}
