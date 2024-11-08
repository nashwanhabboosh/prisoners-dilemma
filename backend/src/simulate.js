const strategies = require('./strategies');

// Takes in an array of strategies and a dictionary of simulation parameters
function simulate(strategies, simulationParameters) {

    const history = {
        playerA: [],
        playerB: []
    };

    const rewards = {
        playerA: [],
        playerB: []
    }
    
    for (let i = 0; i < simulationParameters.rounds; i++) {
        let des_1 = strategies[0]([history.playerA, history.playerB]);
        let des_2 = strategies[1]([history.playerB, history.playerA]);

        console.log("Action of player A:", des_1);
        console.log("Action of player B:", des_2);

        outcome = sentencing(des_1, des_2, simulationParameters.reward_matrix)

        console.log("Simulation round, ", i, " Result: ", outcome)

        // Update history with current actions
        history.playerA.push(des_1);
        history.playerB.push(des_2);

        // Update rewards with most recent payouts
        rewards.playerA.push(outcome[0]);
        rewards.playerB.push(outcome[1]);

        console.log("history to date:");
        console.log("Player A:", history.playerA);
        console.log("Player B:", history.playerB);
    }

    simulation_analysis(rewards);
}

function getStrategyByName(name) {
    if (strategies[name]) {
        return strategies[name];
    } else {
        console.error(`Strategy ${funcName} not found.`);
        return null;
    }
}

// Takes a list of strategies (as string names of the strategies)
// And information about the population simulation and runs randomized
// simulations between strategies within the population
function population_simulation(strategies, simulationParameters) {
    return getStrategyByName(strategies[0])("test");
}

// 0 is cooperation, 1 is dissent
// returns a 2 element array with the sentences for players A and B
function sentencing(action_A, Action_B, reward_matrix) {
    // If both actions are the same, it is either cooperation or dissent
    if (action_A == Action_B) {
        return action_A == 0 ? reward_matrix.cooperating : reward_matrix.betrayal
    }
    // betrayal
    return action_A == 0 ? reward_matrix.betrayal.slice().reverse() : reward_matrix.betrayal
}

function simulation_analysis(rewards) {
    num_rounds = rewards.playerA.length

    playerA_total_sentence = rewards.playerA.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    playerB_total_sentence = rewards.playerB.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    playerA_average_sentence = playerA_total_sentence / num_rounds;
    playerB_average_sentence = playerB_total_sentence / num_rounds;

    console.log("Total rounds: ", num_rounds);
    console.log("Total sentence");
    console.log("Player A: ", playerA_total_sentence);
    console.log("Player B: ", playerB_total_sentence);

    console.log("Average sentence");
    console.log("Player A: ", playerA_average_sentence);
    console.log("Player B: ", playerB_average_sentence);
}

// Example 1v1 simulation
// 
// const params = {
//     rounds: 10,
//     reward_matrix: {
//         cooperating: [1, 1],
//         betrayal: [0, 3],
//         dissenting: [2, 2],
//     },
// };

// simulate([strategies.aggressive, strategies.tit_for_tat], params);

module.exports = {
    simulate,
    population_simulation,
};