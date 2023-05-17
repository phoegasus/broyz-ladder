const { write, read } = require("../firebase/database");

const LADDER_PATH = "/ladder";

let ladderLastState = [];

function getLadderLastState() {
    return ladderLastState;
}

function setLadderLastState(newLadderLastState) {
    ladderLastState = newLadderLastState;
}

let mainLadder = [];

function getMainLadder() {
    return mainLadder;
}

function addToMainLadder(summoner) {
    mainLadder.push(summoner);
}

function removeFromMainLadder(summonerName) {
    return mainLadder.splice(
        mainLadder.findIndex(
            (summoner) =>
                summoner.name.toLowerCase() == summonerName.toLowerCase()
        ),
        1
    );
}

async function persistMainLadder() {
    await write(LADDER_PATH, mainLadder);
}

async function loadMainLadder() {
    let ladder = await read(LADDER_PATH);
    if (ladder) {
        mainLadder = ladder;
    }
}

function resetMainLadder() {
    mainLadder = [];
}

module.exports = {
    getMainLadder,
    addToMainLadder,
    removeFromMainLadder,
    getLadderLastState,
    setLadderLastState,
    persistMainLadder,
    loadMainLadder,
    resetMainLadder,
};
