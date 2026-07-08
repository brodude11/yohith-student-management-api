// This server.js is the entry point of this app, it loads the environment variables and starts the Express server

require('dotenv').config();

const app = require('./app');//import express app

const PORT = 3000;

app.listen(PORT, () => {//starting server
    console.log(`Server running on port ${PORT}`);
});