const express = require('express');
const { simulate, population_simulation } = require('./simulate');
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

app.post('/api/simulate', async (req, res) => {
    const { params } = req.body;
    const { strategies } = req.body;

    try {
        const results = await population_simulation(strategies, params);
        res.json({ results });
    } catch (error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        res.status(500).json({ error: 'Error while running simulation' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});