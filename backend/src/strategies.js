// The general pattern for a strategy is as follows:
// A function named after the strategy which takes a single paramater
// "history" which is an array of the history of interactions this
// strategy has had with the other it is playing against
// the function must always return either a 1 or a 0, 0 indicating
// cooperation, 1 indicating dissent

// The format of the "history" input is 2 arrays with length equal
// to the number of rounds completed so far. the first array is the
// history of decisions made by this agent, the second array is the 
// history of decisions made by the other agent

// Generic strategy where the prisoner always cooperates regardless
// of the actions of the other actor
function passive(history) {
    return 0
}

// Generic strategy where the prisoner always dissents regardless
// of the actions of the other actor
function aggressive(history) {
    return 1
}

// Generic strategy where the prisoner randomly dissents or 
// cooperates regardless of hte actions of the other actor
function random(history) {
    return Math.random() < 0.5 ? 0 : 1;
}

// Initially cooperates, the mirrors the most recent action
// of the other player
function tit_for_tat(history) {
    if (history[0].length == 0) return 0;

    return history[1][history[1].length-1];
}

// Initially dissents, the mirrors the most recent action
// of the other player
function suspicious_tit_for_tat(history) {
    if (history[0].length == 0) return 1;

    return history[1][history[1].length-1];
}

module.exports = {
    passive,
    aggressive,
    random,
    tit_for_tat,
    suspicious_tit_for_tat,
};