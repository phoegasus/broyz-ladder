const { getEmoji, getPromoEmojis } = require("../utils/discord/emoji.js");
const { sendMessage } = require("../utils/discord/message.js");
const { getLPChange, compareSummoners } = require("../utils/league/rank.js");
const { logOk } = require("../utils/log.js");

const SEPARATOR =
    "---------------------------------------------------------------------";

function showLadder(ladder, channels, message) {
    if (!ladder || ladder.length == 0) return;

    let messagesToSend = [];

    var headerStr = SEPARATOR + "\n";
    headerStr += "\t\t\t\t\t\t\t\t\t\t\t\t" + message + "\n";
    headerStr += SEPARATOR + "";
    messagesToSend.push(headerStr);

    var ladderStr = "";

    ladder
        .filter((summoner) => summoner.tier != undefined)
        .sort((summoner1, summoner2) =>
            compareSummoners(summoner1, summoner2) ? -1 : 1
        )
        .forEach((summoner, index) => {
            if (index % 10 == 0 && index != 0) {
                messagesToSend.push(ladderStr);
                ladderStr = "";
            }
            ladderStr +=
                getPositionPrefix(index) +
                summoner.name +
                " " +
                getEmoji(summoner.role.toLowerCase()) +
                " - " +
                summoner.tier;
            if (summoner.rank) {
                ladderStr += " " + summoner.rank;
            }
            ladderStr += getEmoji(
                summoner.isGM ? "grandmaster" : summoner.tier.toLowerCase()
            );
            if (summoner.leaguePoints != undefined) {
                ladderStr += " " + summoner.leaguePoints + "LP";
            }
            if (summoner.promo) {
                ladderStr += " " + getPromoEmojis(summoner.promo) + " ";
            }
            let ladderLastStateOfSummoner = ladderLastState.filter(
                (s) => s.id === summoner.id
            )[0];
            let lpChange = getLPChange(
                ladderLastStateOfSummoner ? ladderLastStateOfSummoner : {},
                summoner
            );
            if (lpChange && lpChange !== 0) {
                ladderStr +=
                    " " +
                    (lpChange < 0 ? ":arrow_down: " : ":arrow_up: +") +
                    lpChange;
            }
            if (summoner.inGame) {
                ladderStr += " -  :red_circle: IN GAME";
                if (summoner.with.length > 0) {
                    ladderStr += " with";
                    for (const name of summoner.with) {
                        ladderStr += " " + name;
                    }
                }
            }
            ladderStr += "\n";
        });

    messagesToSend.push(ladderStr);

    var footerStr = SEPARATOR;
    messagesToSend.push(footerStr);

    messagesToSend.forEach((message) => sendMessage(channels, message));

    logOk("shown ladder");
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

module.exports = { showLadder };
