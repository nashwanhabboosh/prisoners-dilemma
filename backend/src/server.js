const express = require('express');
const { population_simulation } = require('./simulate');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    socket.on('start_simulation', async ({ strategies, params }) => {
        try {
            const handleUpdate = (update) => {
                socket.emit('simulation_update', update);
            };

            await population_simulation(strategies, params, handleUpdate);
            socket.emit('simulation_complete', { message: 'Simulation completed successfully' });
        } catch (error) {
            console.error('Error running simulation:', error);
            socket.emit('simulation_error', { error: 'Simulation failed to start' });
        }
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});