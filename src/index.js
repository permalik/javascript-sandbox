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

function initFS(state) {
  let rootDir = new Directory("/");
  state.CWD = rootDir;
  console.log("Created Directory: ", rootDir.name);
}

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function mkdir(name) {
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

function cwd(state) {
  console.log(state.CWD.name);
}

function list() {}

async function execute(state) {
  const command = await rl.question(
    `Execute operation from ${JSON.stringify(state.CWD.name)}\n`,
  );
  const splitCommands = command.trim().split(" ");

  if (splitCommands.length === 1) {
    if (command.trim().toLowerCase() === "exit") {
      rl.close();
    } else if (command.trim().toLowerCase() === "cwd") {
      cwd(state);
      setTimeout(() => console.clear(), 1000);
    } else {
      console.error("Received invalid command.");
      setTimeout(() => console.clear(), 1000);
    }
  }

  if (splitCommands.length >= 2) {
    if (splitCommands[0] === "mkdir") {
      // TODO: accept args to create multiple dirs
      try {
        const res = await createDirectory(splitCommands[1]);
        console.log("Created Directory: ", command.trim());
        setTimeout(() => console.clear(), 1000);
      } catch (err) {
        console.error(err.message);
        setTimeout(() => console.clear(), 1000);
      }
    }
  }
  setTimeout(() => execute(state), 2000);
}

function run() {
  let fsState = {};
  console.clear();
  initFS(fsState);
  setTimeout(() => console.clear(), 1000);
  setTimeout(() => execute(fsState), 2000);
}

run();

rl.on("close", () => {
  console.log("Received Close Signal. Exiting..");
  exit(0);
});
