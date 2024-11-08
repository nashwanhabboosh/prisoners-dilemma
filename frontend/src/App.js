import React, { useState } from 'react';

function App() {
  const [params, setParams] = useState('');
  const [strategies, setStrategies] = useState('');
  const [results, setResults] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const strategiesArray = strategies.split(',').map((s) => s.trim());

      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          params: JSON.parse(params),
          strategies: strategiesArray,
        }),
      });

      const data = await response.json();

      setResults(JSON.stringify(data.results, null, 2));
    } catch (error) {
      console.error('Error with the population simulation API', error);
      setResults('Error running simulation');
    }
  };

  return (
    <div>
      <h1>Population Simulation</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Params (JSON format):</label>
          <textarea
            rows="4"
            placeholder='e.g., {"rounds": 10, "reward_matrix": {"cooperating": [1, 1], "betrayal": [0, 3], "dissenting": [2, 2]}}'
            value={params}
            onChange={(e) => setParams(e.target.value)}
          />
        </div>
        <div>
          <label>Strategies (comma-separated list):</label>
          <input
            type="text"
            placeholder='e.g., passive, aggresive, random'
            value={strategies}
            onChange={(e) => setStrategies(e.target.value)}
          />
        </div>
        <button type="submit">Run Simulation</button>
      </form>
      {results && (
        <div>
          <h2>Simulation Results:</h2>
          <pre>{results}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
