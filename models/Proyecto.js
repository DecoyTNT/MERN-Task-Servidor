const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const ProyectoSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    creado: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);