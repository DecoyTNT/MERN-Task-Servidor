const express = require('express');

const app = express();

app.use('/usuarios', require('./usuarios'));
app.use('/auth', require('./auth'));
app.use('/proyectos', require('./proyectos'));
app.use('/tareas', require('./tareas'));

module.exports = app;