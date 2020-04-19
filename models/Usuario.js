const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    registro: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Usuario', UsuariosSchema);