# HandSaid — Sign Language Studio

**HandSaid** is an interactive Progressive Web App (PWA) for learning sign languages with live webcam hand-follow coaching, built with React 19, TypeScript, Vite, and MediaPipe.

## Features

- **Interactive 3D Signing Character & Hand Coach**
  - Sleek stylized Three.js upper-body coach with anatomical 2-bone IK, physiological joint/wrist/anti-clipping limits, articulated dorsal/palm hand rigs, facial cues, 3D amber motion trails, and 4 orbitable camera presets (*Character*, *Hand close-up*, *Side 45°*, *Your POV*).
  - Side-by-side **3D + Camera Split View** with on-device two-hand MediaPipe tracking (`HandLandmarker`), per-finger match/adjust feedback, hold-progress ring, `0–100%` scrubber, and `0.5× / 1×` speed toggle.
- **Built-in Bilingual Sign Packs (152 Signs)**
  - **Malaysian Sign Language (BIM):** 76 signs (`A–Z`, `0–9`, 24 Everyday, 8 Family & People, 8 Feelings & Needs).
  - **American Sign Language (ASL):** 76 signs (`A–Z`, `0–9`, 24 Everyday, 8 Family & People, 8 Feelings & Needs).
  - Full **English & Bahasa Melayu (EN / BM)** interface, descriptions, coaching hints, and facial/posture cues.
- **World Sign Language Atlas**
  - Searchable directory of **32 world sign languages** across 7 regions with ISO codes, native names, alphabet-system metadata, and direct links to practice or record.
- **Studio Recorder**
  - Record custom 1- or 2-hand **static** or **dynamic** signs straight from your webcam after a 3-second countdown.
  - Live-test recognition against recorded drafts, persist custom signs in `localStorage`, and export/import shareable `handsaid-pack-v1` JSON packs.
- **Offline-Ready PWA**
  - Configured with `vite-plugin-pwa` (Workbox) for installability and offline caching of app assets, MediaPipe WASM, and downloaded models.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.7, Vite 6, Lucide React
- **Hand Tracking & Recognition:** `@mediapipe/tasks-vision`, custom 3D pose synthesizer, rule-based static evaluator, and DTW motion path tracker
- **PWA:** `vite-plugin-pwa` / Workbox
- **Testing:** Vitest

## Getting Started

```bash
npm install
npm run dev
```

> **Note:** `npm install` (`postinstall`) and `npm run build` (`prebuild`) automatically run `scripts/copy-mediapipe-wasm.mjs` to copy the MediaPipe WASM runtime files from `node_modules/@mediapipe/tasks-vision/wasm` into `public/mediapipe/wasm/`.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Copy WASM, run TypeScript build, and bundle production PWA to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run Vitest unit tests |

## Project Structure

```text
├── public/               # Static icons, favicon, and copied MediaPipe WASM
├── scripts/              # WASM copy and PNG/SVG icon generator scripts
├── src/
│   ├── components/       # Header, CameraCoachStage, LessonRail, WorldAtlasView, StudioRecorderView
│   ├── data/             # BIM/ASL sign definitions, 32-language World Atlas, EN/BM i18n, types
│   ├── engine/           # MediaPipe tracker, hand feature extractor, pose synthesizer, recognizer, canvas renderer, tests
│   ├── styles/           # CSS design tokens and layout styles
│   └── utils/            # localStorage persistence, pack import/export, Web Audio chime
├── index.html
└── vite.config.ts
```
