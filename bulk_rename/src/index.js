import {
  copyFile,
  constants,
  readdir,
  stat,
  mkdir,
  rm,
  writeFile,
  readFile,
  open,
} from "node:fs/promises";
import inputFiles from "./schema.js";
import { close } from "node:inspector/promises";

const SOURCEDIRECTORY = "data";
const DESTDIRECTORY = "dest";

try {
  const staleSourceDir = await stat(SOURCEDIRECTORY).catch((err) => {
    if (err.code !== "ENOENT") {
      throw new Error(
        `Failed to stat sourceDir before remove.\n${err.message}\n`,
      );
    }
  });

  if (staleSourceDir) {
    await rm(SOURCEDIRECTORY, { recursive: true, force: true }).catch((err) => {
      throw new Error(`Failed to remove source directory.\n${err.message}\n`);
    });
  }

  const sourceDir = await mkdir(SOURCEDIRECTORY).catch((err) => {
    throw new Error(`Failed to create sourceDir\n${err.message}\n`);
  });

  if (!sourceDir) {
    for (let [_, v] of Object.entries(inputFiles)) {
      try {
        const fileHandle = await open(`data/${v}`, "w");
        await fileHandle.close();
      } catch (err) {
        throw new Error(
          `Failed to create and close file ${v}.\n${err.message}\n`,
        );
      }
    }
  }

  for (let [k, v] of Object.entries(inputFiles)) {
    await writeFile(`data/${v}`, k).catch((err) => {
      throw new Error(`Failed to write file.\n${err.message}\n`);
    });
    const contents = await readFile(`data/${v}`, { encoding: "utf8" });
    console.log(contents);
  }

  const fileNames = await readdir(SOURCEDIRECTORY);
  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i].split(".")[0];
  }

  // TODO: sort and print contents

  const recreatedSourceDir = await stat(SOURCEDIRECTORY).catch((err) => {
    throw new Error(`Failed to stat sourceDir after make.\n${err.message}\n`);
  });

  if (recreatedSourceDir) {
    await rm(SOURCEDIRECTORY, { recursive: true, force: true }).catch((err) => {
      throw new Error(
        `Failed to remove source directory after sorting.\n${err.message}\n`,
      );
    });
  }
} catch (err) {
  console.error(`Error.\n${err.message}\n`);
}
