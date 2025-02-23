import readline from "node:readline/promises";
import { exit, stdin, stdout } from "node:process";
// Create file: Adds a new file to a directory.
// Create directory: Adds a new directory to a directory.
// Write to file:
// Display contents: Lists files or directories within a given directory.
// Search: Find a file or directory by name.
// View file contents: Print file contents.
// Delete file: Removes a file from a directory.
// Delete directory: Removes a directory (if empty).

let Node = class {
  constructor(name) {
    this.name = name;
  }
};

let Directory = class extends Node {
  left;
  right;
  constructor(name) {
    super(name);
    this.name = name;
  }
  // insert() {}
};

let File = class extends Node {
  constructor(name, value) {
    super(name);
    this.name = name;
    this.value = value;
  }
};

function initFS() {
  let rootDir = new Directory("/");
  console.log("Created Directory: ", rootDir.name);
}

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function createDirectory(name) {
  let resolution = false;

  if (!resolution) {
    return new Promise((_, rej) => {
      rej(new Error("Errored creating directory"));
    });
  }

  resolution = true;

  return new Promise((res) => {
    res(resolution);
  });
}

async function readOperation() {
  const input = await rl.question("Input a file operation:\n");

  if (input.trim().toLowerCase() === "exit") {
    rl.close();
  }

  try {
    const res = await createDirectory(input.trim());
    console.log("Created Directory: ", input.trim());
    setTimeout(() => console.clear(), 1000);
  } catch (err) {
    console.error(err.message);
    setTimeout(() => console.clear(), 1000);
  }
  setTimeout(() => readOperation(), 2000);
}

function run() {
  console.clear();
  console.log("Booting FS..");
  initFS();
  setTimeout(() => console.clear(), 1000);
  setTimeout(() => readOperation(), 2000);
}

run();

rl.on("close", () => {
  console.log("Received Close Signal. Exiting..");
  exit(0);
});
