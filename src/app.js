// This app.js configures the Express application 
// Middleware and API routes are registered here before the application is exported for use by server.js and the tests

const express = require('express');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(express.json());

// using all routed inside studentRoutes
app.use('/api', studentRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Student Management API is running'
    });
});

module.exports = app;