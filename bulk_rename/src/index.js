import { readdir } from "node:fs/promises";

const SOURCEDIRECTORY = "data";

try {
  const files = await readdir(SOURCEDIRECTORY);
  for (const file of files) {
    console.log(file);
  }
} catch (err) {
  console.error("Failed to read file from directory.\n", err);
}
