var express = require('express');
var app = express();

app.get('/', (req, res) => {
	res.render('index');
});

module.exports = app;
