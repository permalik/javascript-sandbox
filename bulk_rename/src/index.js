import { copyFile, constants, readdir, stat, mkdir } from "node:fs/promises";

const SOURCEDIRECTORY = "data";
const DESTDIRECTORY = "dest";

try {
  let files = [];

  const sourceDir = await createDir(SOURCEDIRECTORY).catch((err) =>
    console.error(err),
  );
  const destDir = await createDir(DESTDIRECTORY).catch((err) =>
    console.error(err),
  );

  if (sourceDir && sourceDir.isDirectory()) {
    files = await readdir(SOURCEDIRECTORY).catch((err) => {
      throw new Error(`Failed to read directory.\n${err.message}\n`);
    });
  } else {
    console.log(`Directory does not exist.\n${SOURCEDIRECTORY}\n`);
  }

  if (files.length > 0) {
    for (const file of files) {
      console.log(file);
    }
  } else {
    console.log(`No files found in directory.\n${SOURCEDIRECTORY}\n`);
  }
} catch (err) {
  console.error(`Error.\n${err.message}\n`);
}

async function createDir(dir) {
  try {
    return await stat(dir);
  } catch (err) {
    if (err.code === "ENOENT") {
      await mkdir(dir);
      console.log(`Created newDir.\n${dir}\n`);
    } else {
      throw new Error(`Failed to access newDir.\n${err.message}\n`);
    }
  }
}
