import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [rounds, setRounds] = useState(100);
    const [populationSize, setPopulationSize] = useState(100);
    const [updateInterval, setUpdateInterval] = useState(10);
    const [reproductionAlgorithm, setReproductionAlgorithm] = useState('proportional_adjustment');
    const [rewardMatrix, setRewardMatrix] = useState({
        cooperation: [1, 1],
        betrayal: [0, 3],
        dissent: [2, 2],
    });
    const [strategies, setStrategies] = useState([]);
    const [currentStrategy, setCurrentStrategy] = useState('');
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

    const handleAddStrategy = () => {
        if (currentStrategy && !strategies.includes(currentStrategy)) {
            setStrategies((prev) => [...prev, currentStrategy]);
            setCurrentStrategy('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        socket.emit('start_simulation', {
            params: {
                rounds,
                population_size: populationSize,
                update_interval: updateInterval,
                reproduction_algorithm: reproductionAlgorithm,
                reward_matrix: rewardMatrix,
            },
            strategies,
        });
        setUpdates([]);
        setStatus('Simulation started...');
    };

    return (
        <div>
            <h1>Population Simulation</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Number of Rounds:</label>
                    <input
                        type="number"
                        value={rounds}
                        onChange={(e) => setRounds(Number(e.target.value))}
                        min="1"
                    />
                </div>

                <div>
                    <label>Population Size:</label>
                    <input
                        type="number"
                        value={populationSize}
                        onChange={(e) => setPopulationSize(Number(e.target.value))}
                        min="1"
                    />
                </div>

                <div>
                    <label>Update Interval:</label>
                    <input
                        type="number"
                        value={updateInterval}
                        onChange={(e) => setUpdateInterval(Number(e.target.value))}
                        min="1"
                    />
                </div>

                <div>
                    <label>Reproduction Algorithm:</label>
                    <select
                        value={reproductionAlgorithm}
                        onChange={(e) => setReproductionAlgorithm(e.target.value)}
                    >
                        <option value="proportional_adjustment">Proportional Adjustment</option>
                        <option value="top_15_bottom_15">Top 15 Bottom 15</option>
                    </select>
                </div>

                <div>
                    <h3>Reward Matrix</h3>
                    <div>
                        <label>Cooperation (A, B):</label>
                        <input
                            type="number"
                            value={rewardMatrix.cooperation[0]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    cooperation: [
                                        Number(e.target.value),
                                        rewardMatrix.cooperation[1],
                                    ],
                                })
                            }
                        />
                        <input
                            type="number"
                            value={rewardMatrix.cooperation[1]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    cooperation: [
                                        rewardMatrix.cooperation[0],
                                        Number(e.target.value),
                                    ],
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Betrayal (A, B):</label>
                        <input
                            type="number"
                            value={rewardMatrix.betrayal[0]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    betrayal: [
                                        Number(e.target.value),
                                        rewardMatrix.betrayal[1],
                                    ],
                                })
                            }
                        />
                        <input
                            type="number"
                            value={rewardMatrix.betrayal[1]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    betrayal: [
                                        rewardMatrix.betrayal[0],
                                        Number(e.target.value),
                                    ],
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Dissent (A, B):</label>
                        <input
                            type="number"
                            value={rewardMatrix.dissent[0]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    dissent: [
                                        Number(e.target.value),
                                        rewardMatrix.dissent[1],
                                    ],
                                })
                            }
                        />
                        <input
                            type="number"
                            value={rewardMatrix.dissent[1]}
                            onChange={(e) =>
                                setRewardMatrix({
                                    ...rewardMatrix,
                                    dissent: [
                                        rewardMatrix.dissent[0],
                                        Number(e.target.value),
                                    ],
                                })
                            }
                        />
                    </div>
                </div>

                <div>
                    <h3>Strategies</h3>
                    <div>
                        <select
                            value={currentStrategy}
                            onChange={(e) => setCurrentStrategy(e.target.value)}
                        >
                            <option value="">Select a strategy</option>
                            <option value="passive">Passive</option>
                            <option value="aggressive">Aggressive</option>
                            <option value="random">Random</option>
                            <option value="tit_for_tat">Tit For Tat</option>
                            <option value="suspicious_tit_for_tat">Suspicious Tit For Tat</option>
                        </select>
                        <button type="button" onClick={handleAddStrategy}>
                            Add Strategy
                        </button>
                    </div>
                    <ul>
                        {strategies.map((strategy, idx) => (
                            <li key={idx}>{strategy}</li>
                        ))}
                    </ul>
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