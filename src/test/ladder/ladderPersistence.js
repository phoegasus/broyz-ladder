const {
    addToMainLadder,
    removeFromMainLadder,
    getMainLadder,
    resetMainLadder,
} = require("../../main/ladder/ladderPersistence");

afterEach(() => {
    resetMainLadder();
});

test("should add and remove summoner from mainLadder", () => {
    let mainLadder = getMainLadder();
    addToMainLadder({ name: "Phoegasus" });
    expect(mainLadder).toStrictEqual([{ name: "Phoegasus" }]);
    expect(removeFromMainLadder("Phoegasus")).toStrictEqual([
        {
            name: "Phoegasus",
        },
    ]);
    expect(mainLadder).toStrictEqual([]);
});
