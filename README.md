# Ham Exam Study

A web-based study guide and practice exam app for ARRL amateur radio license exams. Consumes structured JSON question pool files produced by [ham_exam_parser](../ham_exam_parser).

## Exam Pools

| Class | Years | Questions on Exam | Passing Score |
|-------|-------|-------------------|---------------|
| Technician | 2026–2030 | 35 | 26 |
| Technician | 2022–2026 | 35 | 26 |
| General | 2023–2027 | 35 | 26 |
| Extra | 2024–2028 | 50 | 37 |

## Features

- **Study Mode** — Browse questions by subelement and group, click to reveal answers. Figures displayed inline for questions that reference them.
- **Practice Exam** — Randomly selects questions following ARRL exam structure (one per group). Navigate between questions, submit, and review missed answers with corrections.

## Tech Stack

- Vite + React 18
- Tailwind CSS v4 + DaisyUI v5
- React Router v7

## Development

Requires [Nix](https://nixos.org/) and [direnv](https://direnv.net/). The flake provides Node 22.

```sh
cd ham-exam-study
direnv allow    # sets up Node via Nix
npm install
npm run dev     # starts dev server at http://localhost:5173
```

## Build & Deploy

```sh
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

The build produces a static site in `dist/` that can be deployed to any static hosting provider (GitHub Pages, Netlify, Cloudflare Pages, S3, etc.). No server-side runtime is needed — the app fetches question pool JSON files from the `data/` directory at runtime.

## Data

Question pool JSON files live in `public/data/` and are fetched at runtime. To update them, re-run `ham_exam_parser` and copy the output:

```sh
cp ../ham_exam_parser/data/<pool>/<class>_pool.json public/data/<class>_<years>.json
```
