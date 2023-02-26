const { nowStr } = require("../../main/utils/date");

test("should return date in expected format", () => {
    jest.useFakeTimers().setSystemTime(new Date(2023, 1, 1, 10, 37, 10));
    expect(nowStr()).toBe("01/01/2023 10:37:10");
});
