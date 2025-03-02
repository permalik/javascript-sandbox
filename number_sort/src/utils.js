import assert from "node:assert";

function randomNumberString() {
  let dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let result = "";
  while (dataset.length > 0) {
    let index = Math.floor(Math.random() * dataset.length);
    let num = dataset.splice(index, 1)[0];
    result = `${result}${num.toString()}`;
  }
  assert(typeof result === "string", "randomNumberString must return a string");
  assert(/^\d+$/.test(result), "randomNumberString must return only digits");
  return result;
}

export default randomNumberString;
