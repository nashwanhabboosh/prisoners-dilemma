const strategies = require('./simulate');
const express = require('express');

const app = express();
const port = 3000;

// Route for root page
app.get('/', (req, res) => {
    res.send('Root page');
});

// Route for strategies page
app.get('/strategies', (req, res) => {
    res.send('This is the strategies page');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});