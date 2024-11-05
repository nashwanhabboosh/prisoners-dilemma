const express = require('express');
const simulate = require('./simulate');
const cors = require('cors');
const { passive } = require('./strategies');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

app.use(express.json());

app.post('/api/passive', (req, res) => {
    const { history } = req.body;

    try {
        const decision = passive(history);
        res.json({ decision });
    } catch (error) {
        console.error('Passive algo throwing error: ', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});