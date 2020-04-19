const express = require('express');

const app = express();

app.use('/usuarios', require('./usuarios'));
app.use('/auth', require('./auth'));
app.use('/proyectos', require('./proyectos'));

module.exports = app;