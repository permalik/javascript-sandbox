import assert from "node:assert";
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
    assert(Object.keys(inputFiles).length > 0, "inputFiles must not be empty");
    assert(
      inputFiles && typeof inputFiles === "object",
      "inputFiles must be an object",
    );
    assert(
      await initDirectory(SOURCEDIRECTORY, inputFiles),
      "Source must be initialized",
    );
    assert(await initDirectory(DESTDIRECTORY), "Directory must be initialized");
    assert(await populateSource(SOURCEDIRECTORY), "Source must be populated");
    assert(
      await sortNumbers(SOURCEDIRECTORY, DESTDIRECTORY),
      "Numbers must be sorted",
    );
  } catch (err) {
    console.error(`Error in run:\n${err.message}\n`);
  }
}

async function initDirectory(dirPath, files = null) {
  try {
    await rm(dirPath, { recursive: true, force: true }).catch((err) => {
      if (err.code !== "ENOENT") {
        throw new Error(`Failed to remove ${dirPath}:\n${err.message}\n`);
      }
    });

    await mkdir(dirPath);

    if (files) {
      for (const file of Object.values(files)) {
        const filePath = `${dirPath}/${file}`;
        try {
          const fileHandle = await open(filePath, "w");
          fileHandle.close();
        } catch (err) {
          throw new Error(`Cannot open/close ${filePath}:\n${err.message}\n`);
        }
      }
    }
    return true;
  } catch (err) {
    console.error(`Error initializing ${dirPath}:\n${err.message}\n`);
    return false;
  }
}

async function populateSource(sourceDir) {
  try {
    let sourcesPopulated = false;
    for (let [_, v] of Object.entries(inputFiles)) {
      let lineCounter = 0;
      const filePath = `${sourceDir}/${v}`;
      do {
        const numberString = randomNumberString();
        await appendFile(filePath, `${numberString}\n`).catch((err) => {
          throw new Error(`Failed write to ${filePath}\n${err.message}\n`);
        });
        const fileStat = await stat(filePath);
        assert(fileStat.size > 0, `${filePath} must contain data`);
        lineCounter++;
      } while (lineCounter < 100);
      sourcesPopulated = true;
    }
    return sourcesPopulated;
  } catch (err) {
    console.error(`Error in populateSource:\n${err.message}\n`);
    return false;
  }
}

async function sortNumbers(sourceDir, destDir) {
  try {
    let isSorted = false;
    const fileNames = await readdir(sourceDir);
    for (let i = 0; i < fileNames.length; i++) {
      const sourceFilePath = `${sourceDir}/${fileNames[i]}`;
      const fileStat = await stat(sourceFilePath);
      assert(fileStat.size > 0, `${sourceFilePath} cannot be empty.`);

      const fileStream = createReadStream(sourceFilePath);
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
        let charNums = line.split("").map(Number);
        insertionSort(charNums);
        sortedLines.push(charNums.join(""));
      }

      const date = new Date();
      const timestamp = date
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 17);
      const destFilePath = `${destDir}/${timestamp}.${fileNames[i]}`;

      try {
        const fileHandle = await open(destFilePath, "w");
        fileHandle.close();
      } catch (err) {
        throw new Error(`Cannot open/close ${destFilePath}:\n${err.message}\n`);
      }

      for (const sortedLine of sortedLines) {
        await appendFile(destFilePath, `${sortedLine}\n`).catch((err) => {
          throw new Error(`Failed write to ${destFilePath}:\n${err.message}\n`);
        });
      }

      if (i === fileNames.length - 1) {
        isSorted = true;
      }
    }
    return isSorted;
  } catch (err) {
    console.error(`Error in sortNumbers:\n${err.message}\n`);
    return false;
  }
}

await run();
