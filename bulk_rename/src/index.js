import { copyFile, constants, readdir, stat, mkdir } from "node:fs/promises";

const SOURCEDIRECTORY = "data";
const DESTDIRECTORY = "";

try {
  let files = [];

  createDir().catch((err) => console.err(err));

  if (sourceDir && sourceDir.isDirectory()) {
    files = await readdir(SOURCEDIRECTORY).catch((err) => {
      throw new Error(`Failed to read directory.\n${err.message}`);
    });
  } else {
    console.log(`Directory does not exist.\n${SOURCEDIRECTORY}`);
  }

  if (files.length > 0) {
    for (const file of files) {
      console.log(file);
    }
  } else {
    console.log(`No files found in directory.\n${SOURCEDIRECTORY}`);
  }
} catch (err) {
  console.error(`Error.\n${err.message}`);
}

async function createDir() {
  let sourceDir;
  try {
    sourceDir = await stat(SOURCEDIRECTORY);
  } catch (err) {
    if (err.code === "ENOENT") {
      await mkdir(SOURCEDIRECTORY);
      console.log(`Directory created.\n${SOURCEDIRECTORY}`);
    } else {
      throw new Error(`Failed to access sourceDir.\n${err.message}`);
    }
  }
}
