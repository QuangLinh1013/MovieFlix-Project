const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    console.log("check views folder:", path.join(__dirname, '..', 'views'));

    // Đúng đường dẫn đến views/
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');

    // Public folder
    app.use(express.static(path.join(__dirname, '..', 'public')));
};

module.exports = configViewEngine;
