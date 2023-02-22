const { showLadder } = require("./ladderPrinting.js");
const { BOT_UPDATE_INTERVAL } = require("../data/config.js");
const { update, updateAllSummonerData } = require("./ladderUpdate.js");
const { UPDATE_CHANNELS } = process.env;

const updateChannels = UPDATE_CHANNELS.split(",");

global.nextUpdate = BOT_UPDATE_INTERVAL;

let mainLadder = [
    {
        name: "Ragequiiit",
        role: "SUPPORT",
        id: "dboTfFslWypjc5OmV7CJSvt_AdBDx0E1vBkxDef1wlkv6Vo",
        puuid: "VRqZmntlzXz12-YKQA44vnaYdns2SFpKl1-X-JSIgFLXo63dMC9WENhYY5E9pHWvKl-GbuZ7aHw73A",

        inGame: false,
        with: [],
    },
    {
        name: "Shaeee",
        role: "JUNGLE",
        id: "49MWYTk1ARBzQ1CAsXl3xzeJHSAWTYMbrWUwTQdNOMsUjKs",
        puuid: "eekK0NsvEjrEJPVOcY6AKo1fARBK0EJOB_Oz2S8LWNTYQ6NCR4Jl9C5hWlVL_3ZKaxSODEh2VUZNGQ",

        inGame: false,
        with: [],
    },
    {
        name: "PIRATE FRANK",
        role: "TOP",
        id: "hmX7qMpsIPv8t6iu2V9ao1EScbYiirlxW3Qo4LBTXG2_yUCk",
        puuid: "L1Nq_vlp55CYezkmAohP9jPkbf6SOhg7OE1PYWQt3jStbr9EPGvO6tf82rB58GRV_zJHak0tr4t1ug",

        inGame: false,
        with: [],
    },
    {
        name: "Cloud K1",
        role: "SUPPORT",

        inGame: false,
        with: [],
    },
];

let ladderLastState = [];

async function initLadderUpdateLoop() {
    await updateAllSummonerData(mainLadder);
    loopUpdateAndShowLadder(mainLadder);
}

async function loopUpdateAndShowLadder(mainLadder) {
    await updateAndShowLadder(mainLadder);
    setTimeout(() => loopUpdateAndShowLadder(mainLadder), global.nextUpdate);
    global.nextUpdate = BOT_UPDATE_INTERVAL;
}

async function updateAndShowLadder(mainLadder) {
    let updateOk = await update(mainLadder);
    let ladderLastStateString = JSON.stringify(ladderLastState);
    let ladderString = JSON.stringify(mainLadder);
    if (updateOk && ladderLastStateString !== ladderString) {
        showLadder(mainLadder, updateChannels, "Ladder Update");
    }
}

module.exports = { initLadderUpdateLoop, mainLadder };
