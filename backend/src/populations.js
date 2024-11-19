// Defines the different reproduction algorithms for stragegy populations in population simulations
// General form of a function is as follows:
// The function is named after the population adjustment strategy and takes two inputs 
// strategy_populations: a list of length n where n is the number of strategies and 
// strategy_populations[i-1] indicates the population for strategy i before this iteration of the
// simulation is accounted for
// population_score_pairs: a list of length p where p is the total number of agents in the population
// each element in population_score_pairs is itself a two element long list of the form [strat, score]
// where strat is the index in strategy_populations that corresponds to the strategy that this agent uses
// and score is the total sentence for that agent for this iteration of the simulation

// The population adjustment functions take these paramaters and adjust the population of each strategy
// according to its success or failure in this iteration of the simulation. a list of length n is returned
// which holds the new populations for each of the n strategies.
// Note: Because this is modeling the prisoners dilemma, higher scores mean higher sentences and it is
// the goal of the agents to minimize their sentence

// Implements a reproduction algorithm where the top 15 percent of strategies reproduce by 1
// and the bottom 15 percent of strategies lose 1 population
function top_15_bottom_15(strategy_populations, population_score_pairs) {
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

// Adjusts the population for each strategy based on its aggregate preformance
// Calculates the proportionate sentence for each strategy relative to the total
// sentence and adjusts the populations accordingly
function proportional_adjustment(strategy_populations, population_score_pairs) {
    const total_sentence = population_score_pairs.reduce((sum, [_, sentence]) => sum + sentence, 0);

    const strategy_sentences = new Array(strategy_populations.length).fill(0);
    population_score_pairs.forEach(([strategyIndex, sentence]) => {
        strategy_sentences[strategyIndex] += sentence;
    });

    const strategy_proportions = strategy_sentences.map(sentence => sentence / total_sentence);

    const total_population = strategy_populations.reduce((sum, population) => sum + population, 0);

    const ideal_populations = strategy_proportions.map(proportion => proportion * total_population);

    const updated_strategy_populations = ideal_populations.map(Math.floor);
    const remainders = ideal_populations.map((ideal, i) => ideal - updated_strategy_populations[i]);

    // Determines if there was an error due to the rounding of each strategys
    // population individually
    const base_total_population = updated_strategy_populations.reduce((sum, pop) => sum + pop, 0);
    let discrepancy = total_population - base_total_population;

    // In the case where there was a discrepency, distribute the remainder to the
    // strategies with the largest remainders
    const sortedIndices = remainders
        .map((remainder, index) => ({ index, remainder }))
        .sort((a, b) => b.remainder - a.remainder)
        .map(item => item.index);

    for (let i = 0; i < discrepancy; i++) {
        updated_strategy_populations[sortedIndices[i]]++;
    }

    return updated_strategy_populations;
}

module.exports = {
    top_15_bottom_15,
    proportional_adjustment,
};