const strategies = require('./strategies');

// Takes in an array of strategies and a dictionary of simulation parameters
function simulate(strategies, simulationParameters) {
    
    for (let i = 0; i < simulationParameters.rounds; i++) {
        let des_1 = strategies[0](i);
        let des_2 = strategies[1](i);

        console.log("Action of player A:", des_1);
        console.log("Action of player B:", des_2);

        console.log(sentencing(des_1, des_2, simulationParameters.reward_matrix))
    }
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

const params = {
    rounds: 10,
    reward_matrix: {
        cooperating: [1, 1],
        betrayal: [0, 3],
        dissenting: [2, 2],
    },
};

simulate([strategies.random, strategies.random], params);

module.exports = {
    simulate,
};