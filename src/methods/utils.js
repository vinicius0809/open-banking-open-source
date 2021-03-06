export function isInvalidOrEmpty(obj) {
  return (
    obj === null ||
    obj === "undefined" ||
    obj === undefined ||
    (Array.isArray(obj) && obj.length === 0)
  );
}

export function multiplyByIfNumber(number, multiplier) {
  return number === null || Number.isNaN(Number(number))
    ? "NA"
    : (number * multiplier).toFixed(2);
}
