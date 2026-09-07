import fs from 'fs';
import path from 'path';

// Shared JSON loader for the gate and tooling scripts. A corrupt or missing
// JSON file must fail the gate with a clean, file-named error, not an
// unhandled SyntaxError stack trace; gates that crash before reporting report
// health they never verified (the gate-crash-on-corrupt-json failure class in
// failures/failure-cases.md).
export function readJson(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(`missing file ${rel(file)}`);
    }
    throw new Error(`cannot read ${rel(file)}: ${e.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`invalid JSON at ${rel(file)}: ${e.message}`);
  }
}

function rel(file) {
  return path.relative(process.cwd(), file).replace(/\\/g, '/') || path.basename(file);
}

// Parse an in-memory string (for callers that rewrite a file's text and verify
// the rewrite still parses before writing it back).
export function readJsonString(raw, label = 'in-memory JSON') {
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`invalid JSON in ${label}: ${e.message}`);
  }
}
