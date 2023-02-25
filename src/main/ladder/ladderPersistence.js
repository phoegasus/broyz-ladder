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

async function persistMainLadder() {
    await write(LADDER_PATH, mainLadder);
}

async function loadMainLadder() {
    mainLadder = await read(LADDER_PATH);
}

module.exports = {
    getMainLadder,
    addToMainLadder,
    getLadderLastState,
    setLadderLastState,
    persistMainLadder,
    loadMainLadder,
};
