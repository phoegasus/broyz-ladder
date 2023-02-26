require("dotenv").config();
const { ADMINS } = process.env;

const botAdmins = ADMINS.split(",");

function isBotAdmin(id) {
    return botAdmins.includes(id);
}

module.exports = { isBotAdmin };
