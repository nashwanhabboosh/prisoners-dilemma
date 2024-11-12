# Prisoner's Dilemma Population Simulation Parameters

This document outlines the possible simulation parameters for running population simulations of the **Prisoner's Dilemma**.

## 1. **Rounds**
- **Type**: Integer
- **Description**: The number of rounds (iterations) that each agent will play in each 1v1 simulation.
- **Example (Default)**: `rounds: 25`

## 2. **Reward Matrix**
- **Type**: Object
- **Description**: Defines the payoffs for each possible combination of actions in the simulation.
  
  The matrix is represented as an object with keys for each combination of actions. Each key corresponds to an array of values representing the payoffs for each player:
  - `cooperation`: When both players cooperate.
  - `betrayal`: When one player betrays the other.
  - `dissent`: A scenario where the players may choose a strategy like "dissent", which can be modeled in variations of the game.

- **Example (Default)**:
  ```json
  reward_matrix: {
    cooperation: [1, 1],
    betrayal: [0, 3],
    dissent: [2, 2]
  }
## 3. **Population Size**
- **Type**: Integer
- **Description**: The total number of agents in the population.
- **Example (Default)**: `population_size: 100`

## 4. **Update Interval**
- **Type**: Integer
- **Description**: The number of the population simulation in between updates on the total simulation
- **Example (Default)**: `update_interval: 10`