const { showLadder } = require("../ladder/ladderPrinting");
const { getMainLadder } = require("../ladder/ladderPersistence");
const { log } = require("../utils/log");

const syntax = /^!ladder( ((.+,)+|.+))*$/;

async function process(message) {
    log(`ladder.process(${message.content})`);

    let mainLadder = getMainLadder();

    let command = message.content.split(" ");
    if (command.length == 1) {
        showLadder(mainLadder, [message.channel.name], "Player Rankings");
    } else {
        command.splice(0, 1);
        let names = command.join(" ").toLowerCase().split(",");
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
