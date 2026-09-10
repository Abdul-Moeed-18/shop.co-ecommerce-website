const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

// Very small in-process write queue per file so concurrent requests
// never interleave writes and corrupt a JSON file.
const queues = {};

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readJSON(name) {
  const file = filePath(name);
  if (!fs.existsSync(file)) return name === "carts" ? {} : [];
  const raw = fs.readFileSync(file, "utf-8").trim();
  if (!raw) return name === "carts" ? {} : [];
  return JSON.parse(raw);
}

function writeJSONSync(name, data) {
  const file = filePath(name);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, file);
}

function enqueue(name, task) {
  const prev = queues[name] || Promise.resolve();
  const next = prev.then(task, task);
  queues[name] = next.catch(() => {});
  return next;
}

function writeJSON(name, data) {
  return enqueue(name, () => writeJSONSync(name, data));
}

module.exports = { readJSON, writeJSON, DATA_DIR };
