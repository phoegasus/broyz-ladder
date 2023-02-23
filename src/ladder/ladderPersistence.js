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

async function persistMainLadder() {}

async function loadMainLadder() {
    mainLadder = [
        {
            name: "Ragequiiit",
            role: "SUPPORT",
            id: "dboTfFslWypjc5OmV7CJSvt_AdBDx0E1vBkxDef1wlkv6Vo",
            puuid: "VRqZmntlzXz12-YKQA44vnaYdns2SFpKl1-X-JSIgFLXo63dMC9WENhYY5E9pHWvKl-GbuZ7aHw73A",
            tier: "DIAMOND",
            rank: "II",
            leaguePoints: 53,
            inGame: false,
            with: [],
        },
        {
            name: "Sha eee",
            role: "JUNGLE",
            id: "49MWYTk1ARBzQ1CAsXl3xzeJHSAWTYMbrWUwTQdNOMsUjKs",
            puuid: "eekK0NsvEjrEJPVOcY6AKo1fARBK0EJOB_Oz2S8LWNTYQ6NCR4Jl9C5hWlVL_3ZKaxSODEh2VUZNGQ",
            tier: "PLATINUM",
            rank: "IV",
            leaguePoints: 10,
            inGame: false,
            with: [],
        },
        {
            name: "PIRATE FRANK",
            role: "TOP",
            id: "hmX7qMpsIPv8t6iu2V9ao1EScbYiirlxW3Qo4LBTXG2_yUCk",
            puuid: "L1Nq_vlp55CYezkmAohP9jPkbf6SOhg7OE1PYWQt3jStbr9EPGvO6tf82rB58GRV_zJHak0tr4t1ug",
            tier: "PLATINUM",
            rank: "I",
            leaguePoints: 99,
            inGame: false,
            with: [],
        },
        {
            name: "Cloud K1",
            role: "SUPPORT",
            tier: "GOLD",
            rank: "IV",
            leaguePoints: 0,
            inGame: false,
            with: [],
        },
    ];
}

module.exports = {
    getMainLadder,
    addToMainLadder,
    getLadderLastState,
    setLadderLastState,
    persistMainLadder,
    loadMainLadder,
};
