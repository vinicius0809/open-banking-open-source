import { isInvalidOrEmpty, multiplyByIfNumber } from "@/methods/utils.js";

describe("Testing utils.js", () => {
  it("should multiply correctly - multiplyByIfNumber", () => {
    expect(multiplyByIfNumber(2, 10)).toBe("15.00");
    expect(multiplyByIfNumber(4, "10")).toBe("40.00");
    expect(multiplyByIfNumber("3", 9)).toBe("27.00");
    expect(multiplyByIfNumber("4.8", "20.5")).toBe("98.40");
  });
  it("should return NA with parameter NaN - multiplyByIfNumber", () => {
    const value = multiplyByIfNumber("test", 10);
    expect(value).toBe("NA");
  });
  it("should return true - isInvalidOrEmpty", () => {
    expect(isInvalidOrEmpty(null)).toBeTruthy();
    expect(isInvalidOrEmpty(undefined)).toBeTruthy();
    expect(isInvalidOrEmpty([])).toBeTruthy();
  });
  it("should return false - isInvalidOrEmpty", () => {
    expect(isInvalidOrEmpty({})).toBeFalsy();
    expect(isInvalidOrEmpty({ property: undefined })).toBeFalsy();
    expect(isInvalidOrEmpty([1, 2, 3])).toBeFalsy();
  });
});
