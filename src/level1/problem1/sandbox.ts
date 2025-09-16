import { serialize, deserialize } from "./index";

const obj = new Map([
  ["one", 1],
  ["two", 2],
]);

const serialized = serialize(obj);
console.log("Serialized:", serialized);

const deserialized = deserialize(serialized);
console.log("Deserialized:", deserialized);

// Quick check with Date
const date = new Date("2022-12-25T04:27:49.988Z");
console.log("Date test:", deserialize(serialize(date)));
