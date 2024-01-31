const { getMainLadder } = require("../ladder/ladderPersistence");
const { log, logOk } = require("../utils/log");
const { sendMessage } = require("../discord/message");
const {
  INVALID_SUMMONER_NAMES,
  INVALID_ALIAS,
  SET_ALIAS,
} = require("../data/strings");
const util = require("util");

const syntax = /^!alias .+,.+$/;

async function process(message) {
  log(`alias.process(${message.content})`);

  let command = message.content.split(" ");
  command.splice(0, 1);
  let aliasData = command.join(" ").split(",");
  const alias = aliasData[0];
  aliasData.splice(0, 1);
  const summonerNames = aliasData;
  summonerNames.forEach((summonerName) => summonerName.toLowerCase());
  if (
    !summonerNames ||
    summonerNames.length == 0 ||
    getMainLadder().filter((summoner) =>
      summonerNames.includes(summoner.name.toLowerCase()),
    ).length == 0
  ) {
    sendMessage([message.channel.name], INVALID_SUMMONER_NAMES);
    return;
  }
  if (!alias || alias.length == 0) {
    sendMessage([message.channel.name], INVALID_ALIAS);
    return;
  }

  setAliases(summonerNames, alias, message.channel.name);
}

function setAliases(summonerNames, alias, messageChannel) {
  getMainLadder()
    .filter((summoner) => summonerNames.includes(summoner.name.toLowerCase()))
    .forEach((summoner) => {
      summoner.alias = alias;
      logOk(`Set ${summoner.name} alias to ${alias}`);
    });
  sendMessage(
    [messageChannel],
    util.format(SET_ALIAS, summonerNames.join("/"), alias),
  );
}

module.exports = { process, syntax };
