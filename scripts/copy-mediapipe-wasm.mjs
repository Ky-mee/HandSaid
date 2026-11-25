import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'node_modules', '@mediapipe', 'tasks-vision', 'wasm');
const destDir = path.join(projectRoot, 'public', 'mediapipe', 'wasm');

if (!fs.existsSync(srcDir)) {
  console.log('[copy-mediapipe-wasm] node_modules/@mediapipe/tasks-vision/wasm not found yet; skipping.');
  process.exit(0);
}

fs.mkdirSync(destDir, { recursive: true });
const entries = fs.readdirSync(srcDir, { withFileTypes: true });
let copied = 0;

for (const entry of entries) {
  if (entry.isFile()) {
    fs.copyFileSync(path.join(srcDir, entry.name), path.join(destDir, entry.name));
    copied += 1;
  }
}

console.log(`[copy-mediapipe-wasm] Copied ${copied} files to public/mediapipe/wasm.`);
