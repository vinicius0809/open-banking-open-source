export function isInvalidOrEmpty(obj) {
  return (
    obj === null ||
    obj === "undefined" ||
    (Array.isArray(obj) && obj.length === 0)
  );
}

export function multiplyByIfNumber(number, multiplier) {
  return Number.isNaN(Number(number)) ? "NA" : (number * multiplier).toFixed(2);
}
