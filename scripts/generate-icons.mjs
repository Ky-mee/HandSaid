import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const iconsDir = path.join(publicDir, 'icons');

fs.mkdirSync(iconsDir, { recursive: true });

// Pure Node CRC32 + PNG encoder
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0; // filter none
    rgba.copy(raw, rowStart + 1, y * stride, (y + 1) * stride);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

function distSegment(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const lenSq = vx * vx + vy * vy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / lenSq));
  return Math.hypot(px - (ax + t * vx), py - (ay + t * vy));
}

function blendPixel(buf, idx, r, g, b, alpha) {
  const inv = 1 - alpha;
  buf[idx] = Math.round(buf[idx] * inv + r * alpha);
  buf[idx + 1] = Math.round(buf[idx + 1] * inv + g * alpha);
  buf[idx + 2] = Math.round(buf[idx + 2] * inv + b * alpha);
  buf[idx + 3] = 255;
}

function renderIconPng(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const jade = [14, 107, 94];
  const deepJade = [10, 78, 69];
  const cream = [247, 249, 248];
  const amber = [224, 142, 27];

  // Hand skeleton normalized in [0..1]
  const palm = [0.49, 0.68];
  const fingers = [
    [0.29, 0.56, 0.22, 0.45], // thumb
    [0.41, 0.48, 0.36, 0.24], // index
    [0.49, 0.46, 0.49, 0.19], // middle
    [0.57, 0.48, 0.61, 0.24], // ring
    [0.64, 0.54, 0.72, 0.35]  // pinky
  ];

  // Motion arc points
  const arcPts = [];
  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    const angle = Math.PI * (1.15 - t * 0.78);
    arcPts.push([0.52 + Math.cos(angle) * 0.31, 0.52 - Math.sin(angle) * 0.32]);
  }

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = (x + 0.5) / size;
      const v = (y + 0.5) / size;
      const idx = (y * size + x) * 4;

      // Subtle vertical jade gradient background
      const grad = v;
      rgba[idx] = Math.round(jade[0] * (1 - grad * 0.35) + deepJade[0] * (grad * 0.35));
      rgba[idx + 1] = Math.round(jade[1] * (1 - grad * 0.35) + deepJade[1] * (grad * 0.35));
      rgba[idx + 2] = Math.round(jade[2] * (1 - grad * 0.35) + deepJade[2] * (grad * 0.35));
      rgba[idx + 3] = 255;

      // Subtle inner ring
      const ringDist = Math.abs(Math.hypot(u - 0.5, v - 0.5) - 0.42);
      if (ringDist < 0.008) {
        const a = Math.max(0, 1 - ringDist / 0.008) * 0.16;
        blendPixel(rgba, idx, 255, 255, 255, a);
      }

      // Amber kinetic wave arc
      let minArc = 1;
      for (let i = 0; i < arcPts.length - 1; i += 1) {
        const d = distSegment(u, v, arcPts[i][0], arcPts[i][1], arcPts[i + 1][0], arcPts[i + 1][1]);
        if (d < minArc) minArc = d;
      }
      if (minArc < 0.022) {
        const a = Math.min(1, (0.022 - minArc) / 0.009);
        blendPixel(rgba, idx, amber[0], amber[1], amber[2], a);
      }

      // Glowing bead at arc end
      const beadDist = Math.hypot(u - arcPts[arcPts.length - 1][0], v - arcPts[arcPts.length - 1][1]);
      if (beadDist < 0.042) {
        const a = Math.min(1, (0.042 - beadDist) / 0.01);
        blendPixel(rgba, idx, amber[0], amber[1], amber[2], a);
      }

      // Palm core circle + rounded wrist base
      const wristDist = distSegment(u, v, 0.49, 0.77, 0.49, 0.63);
      const palmDist = Math.hypot((u - palm[0]) * 0.9, v - 0.6);
      const handBase = Math.min(wristDist - 0.055, palmDist - 0.11);
      if (handBase < 0.008) {
        const a = Math.min(1, (0.008 - handBase) / 0.012);
        blendPixel(rgba, idx, cream[0], cream[1], cream[2], a);
      }

      // Articulated fingers
      for (const [bx, by, tx, ty] of fingers) {
        const seg1 = distSegment(u, v, palm[0], palm[1] - 0.03, bx, by);
        const seg2 = distSegment(u, v, bx, by, tx, ty);
        const d = Math.min(seg1, seg2);
        if (d < 0.026) {
          const a = Math.min(1, (0.026 - d) / 0.008);
          blendPixel(rgba, idx, cream[0], cream[1], cream[2], a);
        }
        const tipD = Math.hypot(u - tx, v - ty);
        if (tipD < 0.03) {
          const a = Math.min(1, (0.03 - tipD) / 0.008);
          blendPixel(rgba, idx, amber[0], amber[1], amber[2], a);
        }
      }
    }
  }

  return encodePng(size, size, rgba);
}

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="16" fill="#0E6B5E"/>
  <path d="M13 31C16 18 28 11 41 13C46 14 50 17 53 21" stroke="#E08E1B" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="4 3"/>
  <circle cx="53" cy="21" r="3.5" fill="#E08E1B"/>
  <path d="M31 48V38M31 40L21 31L16 26M31 38L26 27L23 16M31 38L31 25L31 13M31 38L37 27L40 17M31 40L40 33L46 24" stroke="#F7F9F8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="31" cy="42" r="6" fill="#F7F9F8"/>
  <circle cx="16" cy="26" r="2.2" fill="#E08E1B"/>
  <circle cx="23" cy="16" r="2.2" fill="#E08E1B"/>
  <circle cx="31" cy="13" r="2.2" fill="#E08E1B"/>
  <circle cx="40" cy="17" r="2.2" fill="#E08E1B"/>
  <circle cx="46" cy="24" r="2.2" fill="#E08E1B"/>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf8');
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), renderIconPng(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), renderIconPng(512));
console.log('[generate-icons] Created public/favicon.svg, public/icons/icon-192.png, public/icons/icon-512.png');
