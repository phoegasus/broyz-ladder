const { getEmoji } = require("../discord/emoji");
const { sendMessage } = require("../discord/message");
const {
    getLPChange,
    compareSummonersRanks,
    getWinrate,
} = require("../league/rank");
const { logOk } = require("../utils/log");
const { getLadderLastState } = require("./ladderPersistence");
const util = require("util");
const { WIN_LOSE_WINRATE_FORMAT } = require("../data/strings");

const SEPARATOR =
    "---------------------------------------------------------------------";

function showLadder(ladder, channels, message) {
    if (!ladder || ladder.length == 0) return;

    let messagesToSend = [];

    messagesToSend.push(buildHeaderStr(message));

    let ladderStr = "";

    ladder
        .filter((summoner) => summoner.tier != undefined)
        .sort((summoner1, summoner2) =>
            compareSummonersRanks(summoner1, summoner2) ? -1 : 1
        )
        .forEach((summoner, index) => {
            if (index % 10 == 0 && index != 0) {
                messagesToSend.push(ladderStr);
                ladderStr = "";
            }

            ladderStr += buildPlayerEntryStr(summoner, index);
            ladderStr += "\n";
        });

    messagesToSend.push(ladderStr);

    messagesToSend.push(buildFooterStr());

    messagesToSend.forEach(async function (message) {
        await sendMessage(channels, message);
    });

    logOk("shown ladder");
}

function buildHeaderStr(message) {
    let headerStr = SEPARATOR + "\n";
    headerStr += "\t\t\t\t\t\t\t\t\t\t\t\t" + message + "\n";
    headerStr += SEPARATOR + "";
    return headerStr;
}

function buildPlayerEntryStr(summoner, index) {
    let playerEntryStr = "";

    playerEntryStr +=
        getPositionPrefix(index) +
        summoner.name +
        " " +
        getEmoji(summoner.role.toLowerCase()) +
        " - " +
        summoner.tier;

    if (summoner.rank) {
        playerEntryStr += " " + summoner.rank;
    }

    playerEntryStr += getEmoji(
        summoner.isGM ? "grandmaster" : summoner.tier.toLowerCase()
    );

    if (summoner.leaguePoints != undefined) {
        playerEntryStr += " " + summoner.leaguePoints + "LP";
    }

    if (summoner.promo) {
        playerEntryStr += " " + getPromoEmojis(summoner.promo) + " ";
    }

    let ladderLastStateOfSummoner = getLadderLastState().filter(
        (s) => s.id === summoner.id
    )[0];
    let lpChange = getLPChange(
        ladderLastStateOfSummoner ? ladderLastStateOfSummoner : {},
        summoner
    );
    if (lpChange && lpChange !== 0) {
        playerEntryStr +=
            " " + (lpChange < 0 ? ":arrow_down: " : ":arrow_up: +") + lpChange;
    }

    if (summoner.wins != undefined && summoner.losses != undefined) {
        playerEntryStr += " - ";
        playerEntryStr += util.format(
            WIN_LOSE_WINRATE_FORMAT,
            summoner.wins,
            summoner.losses,
            getWinrate(summoner)
        );
    }

    if (summoner.inGame) {
        playerEntryStr += " -  :red_circle: IN GAME";
        if (summoner.with.length > 0) {
            playerEntryStr += " with";
            for (const name of summoner.with) {
                playerEntryStr += " " + name;
            }
        }
    }

    return playerEntryStr;
}

function buildFooterStr() {
    return SEPARATOR;
}

function getPositionPrefix(index) {
    switch (index) {
        case 0:
            return ":first_place: ";
        case 1:
            return ":second_place: ";
        case 2:
            return ":third_place: ";
        default:
            return "" + (index + 1) + ". ";
    }
}

function getPromoEmojis(progress) {
    if (!progress) {
        return "";
    }

    return progress
        .split("")
        .map((gameResult) => getGameResultEmoji(gameResult))
        .join("");
}

function getGameResultEmoji(gameResult) {
    if (gameResult != "W" && gameResult != "L" && gameResult != "N") {
        return "";
    }
    return getEmoji("game" + gameResult);
}

module.exports = { showLadder };
