const { showLadder } = require("../ladder/ladderPrinting.js");
const { mainLadder } = require("../ladder/ladderUpdateLoop.js");
const { log } = require("../utils/log.js");

const syntax = /^!ladder( ((.+,)+|.+))*$/;

async function process(message) {
    log(`ladder.process(${message.content})`);

    let command = message.content.split(" ", 2);
    if (command.length == 1) {
        showLadder(mainLadder, [message.channel.name], "Player Rankings");
    } else {
        let names = command[1].toLowerCase().split(",");
        showLadder(
            mainLadder.filter((summoner) =>
                names.includes(summoner.name.toLowerCase())
            ),
            [message.channel.name],
            "Player Rankings"
        );
    }
}

module.exports = { process, syntax };
