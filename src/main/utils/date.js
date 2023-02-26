const util = require("util");
const { DATE_FORMAT } = require("../data/strings");

function nowStr() {
    let currentDate = new Date();

    return util.format(
        `${DATE_FORMAT}`,
        padDateElement(currentDate.getDate()),
        padDateElement(currentDate.getMonth()),
        currentDate.getFullYear(),
        padDateElement(currentDate.getHours()),
        padDateElement(currentDate.getMinutes()),
        padDateElement(currentDate.getSeconds())
    );
}

function padDateElement(n) {
    return String(n).padStart(2, "0");
}

module.exports = { nowStr };
