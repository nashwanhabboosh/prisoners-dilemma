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

// Initially dissents, then mirrors the most recent action
// of the other player
function suspicious_tit_for_tat(history) {
    if (history[0].length == 0) return 1;

    return history[1][history[1].length-1];
}

// Initially cooperates, if the opponent defects, defect against the opponent for each
// successive defection by the opponent. Apologizes by cooperating for the next 2 rounds
function gradual_tit_for_tat(history) {
    if (history[0].length === 0) {
        return 0;
    }

    let defectCount = 0;
    for (let i = history[1].length - 1; i >= 0; i--) {
        if (history[1][i] === 1) {
            defectCount++;
        } else {
            break;
        }
    }

    if (defectCount > 0) {
        if (history[0].length <= defectCount * 2) {
            return 1;  // Punish with defection for each defection streak
        } else if (history[0].length === defectCount * 2 + 1) {
            return 0;  // Apologize by cooperating once after punishing
        } else if (history[0].length === defectCount * 2 + 2) {
            return 0;  // Apologize again by cooperating in the second round
        } else {
            return 1;  // Keep punishing if defect streak is not broken
        }
    }

    return 0;
}

// Initially cooperates, the mirrors the most recent action
// of the other player with a small probability of 
// cooperating regardless of the opponents most recent action
function imperfect_tit_for_tat(history) {
    if (history[0].length === 0) {
        return 0;
    }

    const probability = 0.9;
    if (Math.random() < probability) {
        return history[1][history[1].length - 1];
    }
    return 0;
}

// Initiall cooperates, if the opponent dissents twice in a row,
// then the agent dissents, otherwise, cooperates
function tit_for_two_tats(history) {
    if (history[0].length === 0) {
        return 0;
    }

    if (history[1][history[1].length - 1] === 1 && history[1][history[1].length - 2] === 1) {
        return 1;
    }

    return 0;
}

// Initially cooperates, defects twice after being defected against.
// Otherwise cooperates
function two_tits_for_tat(history) {
    if (history[0].length === 0) {
        return 0;
    }

    if (history[1][history[1].length - 1] === 1 || history[1][history[1].length - 2] === 1) {
        return 1;
    }

    return 0;
}

module.exports = {
    passive,
    aggressive,
    random,
    tit_for_tat,
    suspicious_tit_for_tat,
    gradual_tit_for_tat,
    imperfect_tit_for_tat,
    tit_for_two_tats,
    two_tits_for_tat,
};