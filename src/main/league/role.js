const { ROLE_SYNONYMS } = require("../data/roles");

function getRoleForSynonym(synonym) {
  if (!isRoleSynonym(synonym)) return "";

  return ROLE_SYNONYMS.filter((entry) => entry.synonyms.includes(synonym))[0]
    .role;
}

function isRoleSynonym(synonym) {
  return ROLE_SYNONYMS.some((entry) => entry.synonyms.includes(synonym));
}

module.exports = { getRoleForSynonym, isRoleSynonym };
