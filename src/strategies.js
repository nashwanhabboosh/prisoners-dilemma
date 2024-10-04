// The general pattern for a strategy is as follows:
// A function named after the strategy which takes a single paramater
// "history" which is an array of the history of interactions this
// strategy has had with the other it is playing against
// the function must always return either a 1 or a 0, 0 indicating
// cooperation, 1 indicating dissent

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

module.exports = {
    passive,
    aggressive,
    random,
};