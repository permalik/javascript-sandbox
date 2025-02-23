import readline from "node:readline";
import { exit, stdin, stdout } from "node:process";
import timedLog from "./utils/log";
//
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

  timedLog("Created Directory: ", name, 1000);
  resolution = true;

  return new Promise((res) => {
    res(resolution);
  });
}

async function readOperation() {
  rl.question("Input a file operation:\n", async (input) => {
    console.log(input.trim().toLowerCase());
    if (input.trim().toLowerCase() === "exit") {
      rl.close();
    }

    try {
      const res = await createDirectory(input.trim());
      if (res) {
        console.log("Created Directory.");
        readOperation();
      } else {
        console.log("Failed to Create Directory.");
        readOperation();
      }
    } catch (err) {
      console.error("Failed createDirectory: ", err);
    }
  });
}

function run() {
  console.clear();
  setTimeout(() => console.log("Booting FS.."), 1000);
  setTimeout(() => initFS(), 2000);
  setTimeout(() => console.clear(), 3000);
  setTimeout(() => readOperation(), 4000);
}

run();

rl.on("close", () => {
  console.log("Received Close Signal. Exiting..");
  exit(0);
});
