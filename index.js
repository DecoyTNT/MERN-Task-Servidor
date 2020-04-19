const express = require('express');
const conectarDB = require('./config/db')

const app = express();

conectarDB();

// Habilitar express.json, este se usa en vez de bodyparser
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

// Importar rutas
app.use(require('./routes/index'));

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto ${PORT}`);
});