function coalesce(value, defaultValue) {
  if (value != undefined) {
    return value;
  }
  return defaultValue;
}

module.exports = { coalesce };
