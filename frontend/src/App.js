import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [params, setParams] = useState('');
    const [strategies, setStrategies] = useState('');
    const [updates, setUpdates] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        socket.on('simulation_update', (update) => {
            setUpdates((prev) => [...prev, update]);
        });

        socket.on('simulation_complete', ({ message }) => {
            setStatus(message);
        });

        socket.on('simulation_error', ({ error }) => {
            setStatus(error);
        });

        return () => {
            socket.off('simulation_update');
            socket.off('simulation_complete');
            socket.off('simulation_error');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const strategiesArray = strategies.split(',').map((s) => s.trim());
        socket.emit('start_simulation', {
            strategies: strategiesArray,
            params: JSON.parse(params),
        });
        setUpdates([]);
        setStatus('Simulation started...');
    };

    return (
        <div>
            <h1>Population Simulation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Params (JSON format):</label>
                    <textarea
                        rows="4"
                        placeholder='e.g., {"rounds": 10, "reward_matrix": {"cooperation": [1, 1], "betrayal": [0, 3], "dissent": [2, 2]}}'
                        value={params}
                        onChange={(e) => setParams(e.target.value)}
                    />
                </div>
                <div>
                    <label>Strategies (comma-separated list):</label>
                    <input
                        type="text"
                        placeholder="e.g., passive, aggressive, random"
                        value={strategies}
                        onChange={(e) => setStrategies(e.target.value)}
                    />
                </div>
                <button type="submit">Run Simulation</button>
            </form>
            <h2>Status: {status}</h2>
            {updates.length > 0 && (
                <div>
                    <h2>Simulation Updates:</h2>
                    <ul>
                        {updates.map((update, idx) => (
                            <li key={idx}>{JSON.stringify(update)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
