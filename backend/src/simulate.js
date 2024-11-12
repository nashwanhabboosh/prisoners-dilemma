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

function distribute_strategies(num_strategies, population_size) {
        const result = new Array(num_strategies).fill(Math.floor(population_size / num_strategies));
    
        const remainder = population_size % num_strategies;

        let i = 0;
        while (true) {
            if (i == remainder) break;

            const randomIndex = Math.floor(Math.random() * num_strategies);
            if (result[randomIndex] == Math.floor(population_size / num_strategies)) {
                result[randomIndex]++;
                i++;
            }
        }
        
        return result;
}

function generate_simulation_pairs(strategy_populations, total_population) {
    let new_populations = [...strategy_populations];
    const num_strategies = strategy_populations.length;
    const num_pairs = Math.floor(total_population / 2);

    let result_pairs = [];
    
    for (let i = 0; i < num_pairs; i++) {
        let strategy_1;
        do {
            strategy_1 = Math.floor(Math.random() * (num_strategies));
        } while (new_populations[strategy_1] === 0);

        let strategy_2;
        do {
            strategy_2 = Math.floor(Math.random() * (num_strategies));
        } while (new_populations[strategy_2] === 0 || (new_populations[strategy_2] === 1 && strategy_1 === strategy_2));

        new_populations[strategy_1]--;
        new_populations[strategy_2]--;

        result_pairs.push([strategy_1, strategy_2]);
    }

    return [result_pairs, new_populations];
}

// Takes a list of strategies (as string names of the strategies)
// And information about the population simulation and runs randomized
// simulations between strategies within the population
function population_simulation(strategies, simulationParameters) {
    const strategyFunctions = strategies.map((strategy) => getStrategyByName(strategy));

    const num_strategies = strategyFunctions.length;
    const default_reward_matrix = {
        cooperation: [1, 1],
        betrayal: [0, 3],
        dissent: [2, 2]
      }

    const rounds = simulationParameters.hasOwnProperty('rounds') ? simulationParameters.rounds : 25;
    const population_size = simulationParameters.hasOwnProperty('population_size') ? simulationParameters.size : 101;
    const reward_matrix = simulationParameters.hasOwnProperty('reward_matrix') ? simulationParameters.teams : default_reward_matrix;
    const update_interval = simulationParameters.hasOwnProperty('update_interval') ? simulationParameters.teams : 10;

    const strategy_populations = distribute_strategies(num_strategies, population_size);

    let [result_pairs, new_populations] = generate_simulation_pairs(strategy_populations, population_size);

    console.log(result_pairs);
    console.log(new_populations);

    return strategyFunctions[0]("test");
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

population_simulation(["passive", "aggressive", "random"], 101)

module.exports = {
    simulate,
    population_simulation,
};