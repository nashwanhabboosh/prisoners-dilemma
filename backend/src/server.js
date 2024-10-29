const express = require('express');
const strategies = require('./simulate');
const { aggressive } = require('./strategies');

const app = express();
const port = 5000;

app.use(express.json());

app.post('/api/passive', (req, res) => {
    const { history } = req.body;
    const decision = "TEST";
    res.json({ decision });
  });

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