import { copyFile, constants, readdir, stat } from "node:fs/promises";

const SOURCEDIRECTORY = "data";

try {
  let files = [];
  const sourceDir = await stat(SOURCEDIRECTORY).catch((err) => {
    throw new Error(`Failed to access sourceDir.\n${err.message}`);
  });

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
