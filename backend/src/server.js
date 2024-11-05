const express = require('express');
const simulate = require('./simulate');
const cors = require('cors');
const { passive , aggressive} = require('./strategies');

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));

app.use(express.json());

const createRouteHandler = (strategyFunction) => {
    return (req, res) => {
        const { history } = req.body;

        try {
            const decision = strategyFunction(history);
            res.json({ decision });
        } catch (error) {
            console.error(`Error in ${strategyFunction.name} strategy:`, error);
            res.status(500).json({ error: 'Error processing request' });
        }
    };
};

app.post('/api/passive', createRouteHandler(passive));

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});