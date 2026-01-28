# WeaveVision

An Eagle-style local asset manager for creative works: import images/videos, manage tags and smart folders, and use AI to automatically **rename + tag** (OpenAI-compatible / DashScope compatible-mode, etc.).

Meaning:

- “Weave” represents careful organization and clear structure
- “Vision” covers both photography and moving images
- With AI, messy assets are woven into a coherent, curated tapestry

> 中文版： [README.md](file:///Users/justynchen/Documents/code/resource-manager/README.md)

## Contents

- [Features](#features)
- [Usage](#usage)
- [Shortcuts](#shortcuts)
- [AI Setup](#ai-setup)
- [Development](#development)
- [Build & Packaging](#build--packaging)
- [Project Layout](#project-layout)
- [App Icon](#app-icon)
- [Contributing](#contributing)
- [License](#license)

## Features

- Library
  - Create/open/switch libraries (each library stores its own SQLite DB + files)
  - Import images/videos (drag & drop supported)
  - Duplicates view
- Tags
  - Add/remove tags on media
  - Tag Library (search, bulk-add to current selection)
  - Edit/delete tags (deleting removes the tag from all media)
- Smart Folders
  - Rule-based filters (type/tag/rating/title contains)
  - Edit/delete support
- AI (rename + tag)
  - Bulk support: generate a preview for multi-selection, then confirm to apply
  - Supports OpenAI-compatible endpoints including DashScope (`/compatible-mode`)
  - Automatically handles oversized image data-urls by resizing/compressing before requests (avoids 10MB data-uri limits)

## Usage

### Create/Open a Library

- On first launch, the app prompts you to create or open a library
- Creating a library generates `library.json` and `db.sqlite` in the chosen directory
- You can open/switch to another existing library directory at any time

### Import Files

- Menu bar: File → Import Files…
- Or drag files into the window and drop to import

### Bulk Operations (AI / Tags)

- Multi-select: hold `Cmd` (macOS) or `Ctrl` (Windows/Linux) and click items to toggle selection
- Bulk add tags: use the “Tags” input on the right panel and click “Add”
  - Applies to the current multi-selection; if nothing is multi-selected, applies to the current item
- Bulk AI rename/tag: Menu bar AI → AI Rename/Tag (or Cmd/Ctrl+K)
  - Generates a preview showing before/after title and newly added tags
  - Click “Apply Changes” to write updates (existing tags are never removed)

## Shortcuts

Provided via the native application menu (`CmdOrCtrl` means `Cmd` on macOS, `Ctrl` otherwise):

- `CmdOrCtrl+N`: Create Library…
- `CmdOrCtrl+O`: Open/Switch Library…
- `CmdOrCtrl+I`: Import Files…
- `CmdOrCtrl+K`: AI Rename/Tag (bulk supported)
- `CmdOrCtrl+L`: Tag Library…

## AI Setup

### OpenAI-compatible

Menu bar: AI → AI Settings…

- Base URL: your OpenAI-compatible service URL
- Model: model name (must support image input)
- API Key: optional (required only if your service needs it)

### DashScope (Alibaba Cloud Model Studio)

Recommended Base URL (either one):

- `https://dashscope.aliyuncs.com/compatible-mode`
- `https://dashscope.aliyuncs.com/compatible-mode/v1`

If you use `https://dashscope.aliyuncs.com` directly, you will usually hit 404 (path mismatch).

## Development

### Requirements

- Node.js 18+ (newer is recommended)
- macOS / Windows / Linux

### Install

```bash
npm install
```

### Run (Dev)

```bash
npm run dev
```

### Recommended IDE

- VSCode + ESLint + Prettier

## Build & Packaging

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## Project Layout

- `src/main`: Electron main process (IPC, menu bar, AI requests, library management)
- `src/preload`: Preload bridge (exposes safe APIs to the renderer)
- `src/renderer`: React UI
- `build/`: electron-builder resources (`icon.icns/icon.ico/icon.png`, etc.)
- `resources/`: runtime resources (e.g. window icon)

## App Icon

- Packaging icons live in [build/](file:///Users/justynchen/Documents/code/resource-manager/build) (`icon.icns`, `icon.ico`, `icon.png`).
- Linux runtime window icon uses [icon.png](file:///Users/justynchen/Documents/code/resource-manager/resources/icon.png).
- Low-poly penguin source SVG:
  - [icon.svg](file:///Users/justynchen/Documents/code/resource-manager/build/icon.svg) (packaging resources)
  - [icon.svg](file:///Users/justynchen/Documents/code/resource-manager/resources/icon.svg) (runtime resources)

## Contributing

Issues and PRs are welcome. For PRs, please include:

- A clear description of changes
- Repro steps / screenshots when UI is affected
- Successful `npm run typecheck && npm run build` result

## License

MIT License. See [LICENSE](file:///Users/justynchen/Documents/code/resource-manager/LICENSE).
