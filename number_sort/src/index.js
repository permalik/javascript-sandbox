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
  appendFile,
} from "node:fs/promises";
import inputFiles from "./schema.js";
import randomNumberString from "./utils.js";
import assert from "node:assert";
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const SOURCEDIRECTORY = "number_sort/data";
const DESTDIRECTORY = "number_sort/dest";

async function run() {
  try {
    const isInitSource = await initSource();
    assert.equal(isInitSource, true, "Source must be initialized");

    const isSourcePopulated = await populateSource();
    assert.equal(isSourcePopulated, true, "Source must be populated");

    const isNumbersSorted = await sortNumbers();
    assert.equal(isNumbersSorted, true, "Numbers must be sorted");

    const currentSourceDirStat = await stat(SOURCEDIRECTORY).catch((err) => {
      throw new Error(
        `Failed to stat sourceDir before remove.\n${err.message}\n`,
      );
    });

    if (currentSourceDirStat) {
      await rm(SOURCEDIRECTORY, { recursive: true, force: true }).catch(
        (err) => {
          throw new Error(
            `Failed to remove source directory after sorting.\n${err.message}\n`,
          );
        },
      );
    }
  } catch (err) {
    console.error(`Error.\n${err.message}\n`);
  }
}

async function initSource() {
  try {
    const sourceStat = await stat(SOURCEDIRECTORY).catch((err) => {
      if (err.code !== "ENOENT") {
        throw new Error(
          `Failed to stat sourceDir before remove.\n${err.message}\n`,
        );
      }
    });

    if (sourceStat) {
      await rm(SOURCEDIRECTORY, { recursive: true, force: true }).catch(
        (err) => {
          throw new Error(
            `Failed to remove source directory.\n${err.message}\n`,
          );
        },
      );
    }

    const sourceDir = await mkdir(SOURCEDIRECTORY).catch((err) => {
      throw new Error(`Failed to create sourceDir\n${err.message}\n`);
    });

    let assetsCreated = false;
    if (!sourceDir) {
      for (let [_, v] of Object.entries(inputFiles)) {
        try {
          const fileHandle = await open(`${SOURCEDIRECTORY}/${v}`, "w");
          await fileHandle.close();
        } catch (err) {
          throw new Error(
            `Failed to create and close file ${v}.\n${err.message}\n`,
          );
        }
      }
      assetsCreated = true;
    }

    const initSourcePromise = new Promise((res, rej) => {
      if (assetsCreated) {
        res(true);
      } else {
        rej(false);
      }
    });

    return initSourcePromise;
  } catch (err) {
    console.error(err);
  }
}

async function populateSource() {
  let sourcesPopulated = false;
  for (let [_, v] of Object.entries(inputFiles)) {
    let lineCounter = 0;
    do {
      await appendFile(`${SOURCEDIRECTORY}/${v}`, randomNumberString()).catch(
        (err) => {
          throw new Error(`Failed to write file.\n${err.message}\n`);
        },
      );
      console.log(lineCounter);
      lineCounter++;
    } while (lineCounter < 100);
    sourcesPopulated = true;
  }

  const populateSourcePromise = await new Promise((res, rej) => {
    if (sourcesPopulated) {
      res(true);
    } else {
      rej(false);
    }
  });

  return populateSourcePromise;
}

async function sortNumbers() {
  const fileNames = await readdir(SOURCEDIRECTORY);
  let isSorted = false;
  for (let i = 0; i < fileNames.length; i++) {
    const fileNameStat = await stat(`${SOURCEDIRECTORY}/${fileNames[i]}`).catch(
      (err) => {
        throw new Error(
          `Failed to stat source file ${fileNames[i]}.\n${err.message}\n`,
        );
      },
    );
    assert.notEqual(
      fileNameStat.size,
      0,
      `Source file ${fileNames[i]} cannot be empty.`,
    );

    const fileStream = createReadStream(`${SOURCEDIRECTORY}/${fileNames[i]}`);
    const readline = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of readline) {
      console.log(line);
    }

    if (i === fileNames.length - 1) {
      isSorted = true;
    }
    console.log("\n\nFileComplete\n\n");
  }

  const numbersSortedPromise = new Promise((res, rej) => {
    if (isSorted) {
      res(true);
    } else {
      rej(false);
    }
  });

  return numbersSortedPromise;
}

await run();
