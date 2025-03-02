import assert, { ok } from "node:assert";
import { createReadStream } from "node:fs";
import { readdir, stat, mkdir, rm, open, appendFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import inputFiles from "./schema.js";
import randomNumberString from "./utils.js";
import insertionSort from "../insertionSort/index.js";

const SOURCEDIRECTORY = "number_sort/data";
const DESTDIRECTORY = "number_sort/dest";

async function run() {
  try {
    const isInitSource = await initDirectory(SOURCEDIRECTORY, inputFiles);
    assert.equal(isInitSource, true, "Source must be initialized");

    const isInitDest = await initDirectory(DESTDIRECTORY, null);
    assert.equal(isInitDest, true);

    const isSourcePopulated = await populateSource();
    assert.equal(isSourcePopulated, true, "Source must be populated");

    const isNumbersSorted = await sortNumbers(SOURCEDIRECTORY, DESTDIRECTORY);
    assert.equal(isNumbersSorted, true, "Numbers must be sorted");
  } catch (err) {
    console.error(`Error.\n${err.message}\n`);
  }
}

async function initDirectory(dirPath, inputFiles) {
  try {
    const dirStat = await stat(dirPath).catch((err) => {
      if (err.code !== "ENOENT") {
        throw new Error(
          `Failed to stat stale directory before remove.\n${err.message}\n`,
        );
      }
    });

    if (dirStat) {
      await rm(dirPath, { recursive: true, force: true }).catch((err) => {
        throw new Error(`Failed to remove stale directory.\n${err.message}\n`);
      });
    }

    const dir = await mkdir(dirPath).catch((err) => {
      throw new Error(`Failed to create directory.\n${err.message}\n`);
    });

    let assetsCreated = false;
    if (inputFiles) {
      if (!dir) {
        for (let [_, v] of Object.entries(inputFiles)) {
          try {
            const fileHandle = await open(`${dirPath}/${v}`, "w");
            await fileHandle.close();
          } catch (err) {
            throw new Error(
              `Failed to create and close file ${v}.\n${err.message}\n`,
            );
          }
        }
        assetsCreated = true;
      }
    } else {
      const dirStat = await stat(dirPath).catch((err) => {
        if (err.code !== "ENOENT") {
          throw new Error(`Failed to stat DESTDIRECTORY.\n${err.message}\n`);
        }
      });

      if (dirStat) {
        assetsCreated = true;
      }
    }

    const promise = new Promise((res, rej) => {
      if (assetsCreated) {
        res(true);
      } else {
        rej(false);
      }
    });

    return promise;
  } catch (err) {
    console.error(err);
  }
}

async function populateSource() {
  let sourcesPopulated = false;
  for (let [_, v] of Object.entries(inputFiles)) {
    let lineCounter = 0;
    do {
      await appendFile(
        `${SOURCEDIRECTORY}/${v}`,
        `${randomNumberString()}\n`,
      ).catch((err) => {
        throw new Error(
          `Failed to populate line to source directory.\n${err.message}\n`,
        );
      });
      lineCounter++;
    } while (lineCounter < 100);
    sourcesPopulated = true;
  }

  const promise = await new Promise((res, rej) => {
    if (sourcesPopulated) {
      res(true);
    } else {
      rej(false);
    }
  });

  return promise;
}

async function sortNumbers(sourceDir, destDir) {
  try {
    let isSorted = false;
    const fileNames = await readdir(sourceDir);
    for (let i = 0; i < fileNames.length; i++) {
      const fileNameStat = await stat(`${sourceDir}/${fileNames[i]}`).catch(
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

      const fileStream = createReadStream(`${sourceDir}/${fileNames[i]}`);
      const readline = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      let unsortedLines = [];
      for await (const line of readline) {
        unsortedLines.push(line.trim());
      }

      let sortedLines = [];
      for (let line of unsortedLines) {
        let charStrs = line.split("");
        let charNums = charStrs.map(Number);

        insertionSort(charNums);

        let sortedLine = "";
        for (let num of charNums) {
          let newNum = num.toString();
          sortedLine = `${sortedLine}${newNum}`;
        }

        sortedLines.push(sortedLine);
      }

      const fileHandle = await open(`${destDir}/${fileNames[i]}`, "w").catch(
        (err) => {
          throw new Error(
            `Failed to open dest file${destDir}/${fileNames[i]}.\n${err.message}\n`,
          );
        },
      );
      await fileHandle.close().catch((err) => {
        throw new Error(
          `Failed to create and close dest file${v}.\n${err.message}\n`,
        );
      });

      for (const sortedLine of sortedLines) {
        await appendFile(`${destDir}/${fileNames[i]}`, `${sortedLine}\n`).catch(
          (err) => {
            throw new Error(
              `Failed to populate dest directory.\n${err.message}\n`,
            );
          },
        );
      }

      if (i === fileNames.length - 1) {
        isSorted = true;
      }
    }
    const promise = new Promise((res, rej) => {
      if (isSorted) {
        res(true);
      } else {
        rej(false);
      }
    });

    return promise;
  } catch (err) {
    console.error(err);
  }
}

await run();
