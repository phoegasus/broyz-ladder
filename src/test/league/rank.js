const {
  compareSummonersRanks,
  getLPChange,
} = require("../../main/league/rank");

test("DIAMOND > GOLD", () => {
  expect(compareSummonersRanks({ tier: "DIAMOND" }, { tier: "GOLD" })).toBe(
    true
  );
});

test("GOLD < DIAMOND", () => {
  expect(compareSummonersRanks({ tier: "GOLD" }, { tier: "DIAMOND" })).toBe(
    false
  );
});

test("GOLD I > GOLD IV", () => {
  expect(
    compareSummonersRanks(
      { tier: "GOLD", rank: "I" },
      { tier: "GOLD", rank: "IV" }
    )
  ).toBe(true);
});

test("GOLD IV < GOLD I", () => {
  expect(
    compareSummonersRanks(
      { tier: "GOLD", rank: "IV" },
      { tier: "GOLD", rank: "I" }
    )
  ).toBe(false);
});

test("GOLD I 59LP > GOLD I 2LP", () => {
  expect(
    compareSummonersRanks(
      { tier: "GOLD", rank: "I", leaguePoints: 59 },
      { tier: "GOLD", rank: "I", leaguePoints: 2 }
    )
  ).toBe(true);
});

test("GOLD I 2LP < GOLD I 59LP", () => {
  expect(
    compareSummonersRanks(
      { tier: "GOLD", rank: "I", leaguePoints: 2 },
      { tier: "GOLD", rank: "I", leaguePoints: 59 }
    )
  ).toBe(false);
});

test("LP change from two unranked states should be undefined", () => {
  expect(getLPChange({}, {})).toBe(undefined);
});

test("LP change from CHALLENGER 870LP to CHALLENGER 490LP should be -380", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "CHALLENGER",
        leaguePoints: 870,
      },
      {
        rank: "I",
        tier: "CHALLENGER",
        leaguePoints: 490,
      }
    )
  ).toBe(-380);
});

test("LP change from CHALLENGER 870LP to CHALLENGER 1000LP should be 130", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "CHALLENGER",
        leaguePoints: 870,
      },
      {
        rank: "I",
        tier: "CHALLENGER",
        leaguePoints: 1000,
      }
    )
  ).toBe(130);
});

test("LP change from DIAMOND I 70LP to MASTER 239LP should be 269", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "DIAMOND",
        leaguePoints: 70,
      },
      {
        rank: "I",
        tier: "MASTER",
        leaguePoints: 239,
      }
    )
  ).toBe(269);
});

test("LP change from DIAMOND I 70LP to DIAMOND II 20LP should be -150", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "DIAMOND",
        leaguePoints: 70,
      },
      {
        rank: "II",
        tier: "DIAMOND",
        leaguePoints: 20,
      }
    )
  ).toBe(-150);
});

test("LP change from DIAMOND III 70LP to DIAMOND I 20LP should be 150", () => {
  expect(
    getLPChange(
      {
        rank: "III",
        tier: "DIAMOND",
        leaguePoints: 70,
      },
      {
        rank: "I",
        tier: "DIAMOND",
        leaguePoints: 20,
      }
    )
  ).toBe(150);
});

test("LP change from DIAMOND III 70LP to EMERALD I 20LP should be -250", () => {
  expect(
    getLPChange(
      {
        rank: "III",
        tier: "DIAMOND",
        leaguePoints: 70,
      },
      {
        rank: "I",
        tier: "EMERALD",
        leaguePoints: 20,
      }
    )
  ).toBe(-250);
});

test("LP change from EMERALD I 10LP to DIAMOND III 70LP should be 260", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "EMERALD",
        leaguePoints: 10,
      },
      {
        rank: "III",
        tier: "DIAMOND",
        leaguePoints: 70,
      }
    )
  ).toBe(260);
});

test("LP change from MASTER 100LP to GRANDMASTER 560LP should be 460", () => {
  expect(
    getLPChange(
      {
        rank: "I",
        tier: "MASTER",
        leaguePoints: 100,
      },
      {
        rank: "I",
        tier: "GRANDMASTER",
        leaguePoints: 560,
      }
    )
  ).toBe(460);
});
