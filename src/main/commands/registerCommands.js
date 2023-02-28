const { DISCORD_SERVERS } = process.env;
const ladderCommand = require("./ladder");
const track = require("./track");
const alias = require("./alias");
const { logOk } = require("../utils/log");
const { isBotAdmin } = require("../discord/botAdmin");
const { client } = require("../discord/client");

let commands = [ladderCommand];
let adminCommands = [track, alias];

let registered = false;

let allowedServers = DISCORD_SERVERS.split(",");

function registerCommands() {
    if (registered) return;

    client.on("messageCreate", (message) => {
        if (allowedServers.includes(message.guild.name)) {
            if (message.author.bot) {
                return;
            }

            adminCommands.forEach((adminCommand) => {
                if (isBotAdmin(message.author.id)) {
                    if (adminCommand.syntax.test(message.content))
                        adminCommand.process(message);
                }
            });

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
