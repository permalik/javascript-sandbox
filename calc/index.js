import { fibonacci } from "./fibonacci/fibonacci.js";

for (const i of Array(10).keys()) {
    process.stdout.write(fibonacci(i) + " ");
}
process.stdout.write("\n");
