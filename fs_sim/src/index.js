import { exit, stdin, stdout } from "node:process";
import readline from "node:readline/promises";
import assert from "node:assert";
// Create file: Adds a new file to a directory.
// Create directory: Adds a new directory to a directory.
// Write to file:
// Display contents: Lists files or directories within a given directory.
// Search: Find a file or directory by name.
// View file contents: Print file contents.
// Delete file: Removes a file from a directory.
// Delete directory: Removes a directory (if empty).

/**
 * Represents a Node.
 * @class
 */
class Node {
  /**
   * Creates an instance of a Node.
   * @param {string} name: The name of the node.
   * @param {Array<string>} keys: List of keys (directory names or file names);
   * @param {Array<string>} children: List of children nodes (directories or files).
   * @param {boolean} isLeaf: True if node is a leaf node (contains files).
   */
  constructor(name) {
    /**
     * @property {string} name: The name of the node.
     */
    this.name = name;
    this.keys = keys;
    this.children = children;
  }
}

/**
 * Create initial File System.
 *
 * @param {object} state File System state.
 * @returns {void}
 */
function initFS(state) {
  let rootDir = new Node("/", null, null);
  assert.strictEqual(rootDir.name, "/");
  assert.strictEqual(rootDir.keys, null);
  assert.strictEqual(rootDir.children, null);
  state.CWD = rootDir;
  console.log("Created Directory: ", rootDir.name);
}

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

function mkdir(name) {
  let resolution = false;

  resolution = true;

  if (!resolution) {
    return new Promise((_, rej) => {
      rej(new Error("Errored creating directory"));
    });
  }

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
        const res = await mkdir(splitCommands[1]);
        console.log("Created Directory: ", command.trim());
        setTimeout(() => console.clear(), 1000);
      } catch (err) {
        console.error(err.message);
        setTimeout(() => console.clear(), 1000);
      }
    } else {
      console.error("Received invalid command.");
      setTimeout(() => console.clear(), 1000);
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
