import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [decision, setGreeting] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the backend API using fetch
      const response = await fetch('http://localhost:5000/api/passive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      // Parse the response JSON
      const data = await response.json();

      // Set the greeting message
      setGreeting(data.decision);
    } catch (error) {
      console.error('Error calling the API', error);
    }
  };

  return (
    <div>
      <h1>Call Backend Function Example</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {<h2>{decision}</h2>}
    </div>
  );
}

export default App;
