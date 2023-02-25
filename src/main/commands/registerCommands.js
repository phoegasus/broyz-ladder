const { DISCORD_SERVERS } = process.env;
const ladderCommand = require("./ladder");
const track = require("./track");
const { logOk, log } = require("../utils/log");
const { isBotAdmin } = require("../discord/botAdmin");

let commands = [ladderCommand];
let adminCommands = [track];

let registered = false;

let allowedServers = DISCORD_SERVERS.split(",");

function registerCommands() {
    if (registered) return;

    global.client.on("messageCreate", (message) => {
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
