import React, { useState } from 'react';

function App() {
  const [history, setHistory] = useState('');
  const [decision, setDecision] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/passive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history }),
      });

      const data = await response.json();

      setDecision(data.decision);
    } catch (error) {
      console.error('Error calling the API', error);
    }
  };

  return (
    <div>
      <h1>Call Strategy API example</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {<h2>{decision}</h2>}
    </div>
  );
}

export default App;
