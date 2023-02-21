function now() {
    let currentDate = new Date();

    return `[${padDateElement(currentDate.getUTCDate())}/${padDateElement(
        currentDate.getUTCMonth()
    )}/${currentDate.getUTCFullYear()} ${padDateElement(
        currentDate.getUTCHours()
    )}:${padDateElement(currentDate.getUTCMinutes())}:${padDateElement(
        currentDate.getUTCSeconds()
    )}]`;
}

function padDateElement(n) {
    return String(n).padStart(2, "0");
}

module.exports = { now };
