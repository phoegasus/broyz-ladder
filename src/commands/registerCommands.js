const { DISCORD_SERVERS } = process.env;
const ladderCommand = require("./ladder.js");
const { logOk } = require("../utils/log.js");

let commands = [ladderCommand];

let registered = false;

let allowedServers = DISCORD_SERVERS.split(",");

function registerCommands() {
    if (registered) return;

    global.client.on("messageCreate", (message) => {
        if (allowedServers.includes(message.guild.name)) {
            if (message.author.bot) {
                return;
            }

            commands.forEach((command) => {
                if (command.syntax.test(message.content))
                    command.process(message);
            });
        }
    });

    registered = true;

    logOk(`Registered commands.`);
}

module.exports = { registerCommands };
