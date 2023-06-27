const util = require("util");
const { DATE_FORMAT } = require("../data/strings");

function nowStr() {
    let currentDate = new Date(now());

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

function zero() {
    return 0;
}

function now() {
    return new Date().getTime();
}

function padDateElement(n) {
    return String(n).padStart(2, "0");
}

module.exports = { now, nowStr, zero };
