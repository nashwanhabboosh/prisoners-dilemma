const strategies = require('./strategies');

// Takes in an array of strategies and a dictionary of simulation parameters
function simulate(strategies, simulationParameters, debug = false) {

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

        if (debug) {
            console.log("Action of player A:", des_1);
            console.log("Action of player B:", des_2);
        }
       
        outcome = sentencing(des_1, des_2, simulationParameters.reward_matrix);

        if (debug) console.log("Simulation round, ", i, " Result: ", outcome);

        // Update history with current actions
        history.playerA.push(des_1);
        history.playerB.push(des_2);

        // Update rewards with most recent payouts
        rewards.playerA.push(outcome[0]);
        rewards.playerB.push(outcome[1]);

        if (debug) {
            console.log("history to date:");
            console.log("Player A:", history.playerA);
            console.log("Player B:", history.playerB);
        }
    }

    if (debug) {
        console.log("Player A strategy: ", strategies[0].name);
        console.log("Player B strategy: ", strategies[1].name);
        
        simulation_analysis(rewards);
    }

    return rewards;
}

function getStrategyByName(name) {
    if (strategies[name]) {
        return strategies[name];
    } else {
        console.error(`Strategy ${funcName} not found.`);
        return null;
    }
}

// Distributes strategies over the population, assigning all strategies
// floor(population_size / num_strategies), and randomly assinging the 
// remaining population_size % num_strategies, such that no strategy has
// more than floor(population_size / num_strategies) + 1 to begin with
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

// Pairs up strategies in the population randomly to compete in the prisoners dilemma
// Returns a list of pairs to compete as well as an array indicating the position of the 
// Strategy not competing that round if there is one (only happens with odd populations
// as you cant evenly break it into pairs)
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

// Implements a reproduction algorithm where the top 15 percent of strategies reproduce by 1
// and the bottom 15 percent of strategies lose 1 population
function top_15_bottom_15(strategyFunctions, strategy_populations, population_score_pairs) {
    const total_agents = population_score_pairs.length;
    const bottom15PercentCount = Math.floor(0.15 * total_agents);
    const top15PercentCount = Math.ceil(0.15 * total_agents);

    const sorted_population = population_score_pairs.slice().sort((a, b) => a[1] - b[1]);

    const bottom15Percent = sorted_population.slice(0, bottom15PercentCount);
    const top15Percent = sorted_population.slice(-top15PercentCount);

    const updated_strategy_populations = [...strategy_populations];

    for (const [strategyIndex, _] of bottom15Percent) {
        updated_strategy_populations[strategyIndex]++;
    }

    for (const [strategyIndex, _] of top15Percent) {
        if (updated_strategy_populations[strategyIndex] > 0) {
            updated_strategy_populations[strategyIndex]--;
        }
    }

    return updated_strategy_populations;
}

// Takes a list of strategies (as string names of the strategies)
// And information about the population simulation and runs randomized
// simulations between strategies within the population
function population_simulation(strategies, population_simulation_parameters) {
    const strategyFunctions = strategies.map((strategy) => getStrategyByName(strategy));

    const num_strategies = strategyFunctions.length;
    const default_reward_matrix = {
        cooperation: [1, 1],
        betrayal: [0, 3],
        dissent: [2, 2]
      }

    const rounds = population_simulation_parameters.hasOwnProperty('rounds') ? population_simulation_parameters.rounds : 25;
    const population_size = population_simulation_parameters.hasOwnProperty('population_size') ? population_simulation_parameters.size : 101;
    const reward_matrix = population_simulation_parameters.hasOwnProperty('reward_matrix') ? population_simulation_parameters.reward_matrix : default_reward_matrix;
    const update_interval = population_simulation_parameters.hasOwnProperty('update_interval') ? population_simulation_parameters.update_interval : 10;

    let strategy_populations = distribute_strategies(num_strategies, population_size);

    console.log("strategies");
    console.log(strategies);

    console.log(strategy_populations);

    for (let i = 0; i < rounds; i++) {

        let [result_pairs, new_populations] = generate_simulation_pairs(strategy_populations, population_size);

        let simulation_paramaters = {
            rounds: rounds,
            reward_matrix: reward_matrix
        };

        let population_score_pairs = [];

        // If there is a strategy that is not competeing, assign it a sentence of 0
        if (new_populations.indexOf(1) !== -1) {
            population_score_pairs.push([new_populations.indexOf(1), 0]);
        }

        result_pairs.forEach(function(pair) {
            let rewards = simulate([strategyFunctions[pair[0]],strategyFunctions[pair[1]]], simulation_paramaters);

            const total_sentence_player_A = rewards.playerA.reduce((sum, current) => sum + current, 0);
            const total_sentence_player_B = rewards.playerB.reduce((sum, current) => sum + current, 0);

            population_score_pairs.push([pair[0], total_sentence_player_A]);
            population_score_pairs.push([pair[1], total_sentence_player_B]);
        });

        strategy_populations = updateStrategyPopulations(strategyFunctions, strategy_populations, population_score_pairs);

        console.log(strategy_populations);
    }
}

// 0 is cooperation, 1 is dissent
// returns a 2 element array with the sentences for players A and B
function sentencing(action_A, Action_B, reward_matrix) {
    // If both actions are the same, it is either cooperation or dissent
    if (action_A == Action_B) {
        return action_A == 0 ? reward_matrix.cooperation : reward_matrix.dissent
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

const params = {
    rounds: 100,
    reward_matrix: {
        cooperation: [1, 1],
        betrayal: [0, 3],
        dissent: [2, 2],
    },
};

population_simulation(["passive", "aggressive", "random", "tit_for_tat"], params)

module.exports = {
    simulate,
    population_simulation,
};