const { write, read } = require("../firebase/database");
const { logOk } = require("../utils/log");

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
    mainLadder.splice(
        mainLadder.findIndex(
            (summoner) =>
                summoner.name.toLowerCase() == summonerName.toLowerCase()
        ),
        1
    );
}

async function persistMainLadder() {
    await write(LADDER_PATH, mainLadder);
    logOk("Main ladder persisted.");
}

async function loadMainLadder() {
    let ladder = await read(LADDER_PATH);
    if (ladder) {
        mainLadder = ladder;
        logOk("Main ladder loaded.");
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
