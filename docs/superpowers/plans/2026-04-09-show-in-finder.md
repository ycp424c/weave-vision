# Show In Finder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为单个资源新增“在 Finder 中显示”能力，并在右键菜单和详情面板两处提供入口，多选时禁用。

**Architecture:** 将 Finder 打开逻辑封装为主进程可测试函数，IPC handler 只负责参数接入和调用。preload 暴露最小 API，渲染层复用同一个动作函数接入两个入口并统一错误处理。通过一个纯 Node 测试覆盖核心行为，避免依赖 Electron 原生模块。

**Tech Stack:** Electron IPC、TypeScript、React 19、Node `node:test`、现有 CSS 样式系统

---

## File Structure

- Create: `src/main/media/showInFinder.ts`
- Create: `tests/showInFinder.test.ts`
- Modify: `src/main/ipcHandlers.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/preload/index.d.ts`
- Modify: `src/renderer/src/App.tsx`
- Modify: `src/renderer/src/assets/main.css`

### Task 1: Build And Test Core Show-In-Finder Action

**Files:**
- Create: `src/main/media/showInFinder.ts`
- Test: `tests/showInFinder.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import test from 'node:test'
import assert from 'node:assert/strict'
import { showMediaInFinder } from '../src/main/media/showInFinder'

test('showMediaInFinder calls finder with resolved absolute path', async () => {
  let calledPath: string | null = null
  const result = await showMediaInFinder('m1', {
    resolveOriginalAbsolutePath: (id) => (id === 'm1' ? '/tmp/a.png' : null),
    showItemInFolder: (absPath) => {
      calledPath = absPath
    }
  })

  assert.equal(result, true)
  assert.equal(calledPath, '/tmp/a.png')
})

test('showMediaInFinder throws when resource path cannot be resolved', async () => {
  await assert.rejects(
    () =>
      showMediaInFinder('missing', {
        resolveOriginalAbsolutePath: () => null,
        showItemInFolder: () => {}
      }),
    /资源文件不存在/
  )
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsc -p tsconfig.test.json && node --test .tmp-tests/tests/showInFinder.test.js`  
Expected: FAIL with `Cannot find module '../src/main/media/showInFinder'` (or equivalent missing export error)

- [ ] **Step 3: Write minimal implementation**

```ts
export type ShowInFinderDeps = {
  resolveOriginalAbsolutePath: (mediaId: string) => string | null
  showItemInFolder: (absPath: string) => void
}

export async function showMediaInFinder(mediaId: string, deps: ShowInFinderDeps): Promise<true> {
  const absPath = deps.resolveOriginalAbsolutePath(mediaId)
  if (!absPath) {
    throw new Error('资源文件不存在或无法定位')
  }
  deps.showItemInFolder(absPath)
  return true
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsc -p tsconfig.test.json && node --test .tmp-tests/tests/showInFinder.test.js`  
Expected: PASS (2 passed, 0 failed)

- [ ] **Step 5: Commit**

```bash
git add src/main/media/showInFinder.ts tests/showInFinder.test.ts
git commit -m "test(main): add show in finder core action tests"
```

### Task 2: Wire Main Process IPC And Preload API

**Files:**
- Modify: `src/main/ipcHandlers.ts`
- Modify: `src/preload/index.ts`
- Modify: `src/preload/index.d.ts`

- [ ] **Step 1: Write failing main-process call site**

```ts
// src/main/ipcHandlers.ts
ipcMain.handle('media:showInFinder', async (_event, mediaId: string) => {
  return showMediaInFinder(mediaId, {
    resolveOriginalAbsolutePath: (id) => libraryManager.resolveOriginalAbsolutePath(id),
    showItemInFolder: (absPath) => shell.showItemInFolder(absPath)
  })
})
```

Run: `npm run typecheck:node`  
Expected: FAIL with `Cannot find name 'showMediaInFinder'` (and possible missing `shell` import error)

- [ ] **Step 2: Implement main IPC and preload bridge**

`src/main/ipcHandlers.ts` snippet:

```ts
import { clipboard, dialog, ipcMain, nativeImage, shell } from 'electron'
import { showMediaInFinder } from './media/showInFinder'

ipcMain.handle('media:showInFinder', async (_event, mediaId: string) => {
  return showMediaInFinder(mediaId, {
    resolveOriginalAbsolutePath: (id) => libraryManager.resolveOriginalAbsolutePath(id),
    showItemInFolder: (absPath) => shell.showItemInFolder(absPath)
  })
})
```

`src/preload/index.ts` snippet:

```ts
media: {
  // ...
  showInFinder: (mediaId: string) => ipcRenderer.invoke('media:showInFinder', mediaId),
  copyImageToClipboard: (mediaId: string) => ipcRenderer.invoke('media:copyImageToClipboard', mediaId),
}
```

`src/preload/index.d.ts` snippet:

```ts
media: {
  // ...
  showInFinder: (mediaId: string) => Promise<boolean>
  copyImageToClipboard: (mediaId: string) => Promise<boolean>
}
```

- [ ] **Step 3: Run type checks**

Run: `npm run typecheck:node && npm run typecheck:web`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/main/ipcHandlers.ts src/preload/index.ts src/preload/index.d.ts
git commit -m "feat(ipc): expose media show-in-finder action"
```

### Task 3: Add Renderer Entrypoints (Context Menu + Inspector)

**Files:**
- Modify: `src/renderer/src/App.tsx`

- [ ] **Step 1: Add failing UI call site**

在右键菜单中先插入调用占位，引用尚未实现的函数：

```tsx
onClick={() => {
  setContextMenu(null)
  void handleShowInFinder(contextMenu.mediaIds[0])
}}
```

Run: `npm run typecheck:web`  
Expected: FAIL with `Cannot find name 'handleShowInFinder'`

- [ ] **Step 2: Implement shared renderer action and bind two entrypoints**

新增动作函数：

```tsx
const handleShowInFinder = async (mediaId?: string): Promise<void> => {
  if (!api) return
  const targetId = mediaId ?? details?.id
  if (!targetId) return
  if (selection.length !== 1) return
  try {
    await api.media.showInFinder(targetId)
  } catch (e) {
    setError(formatError(e))
  }
}
```

右键菜单项（删除前）：

```tsx
<div
  className={contextMenu.mediaIds.length === 1 ? 'contextMenuItem' : 'contextMenuItem contextMenuItemDisabled'}
  onClick={() => {
    if (contextMenu.mediaIds.length !== 1) return
    const id = contextMenu.mediaIds[0]
    setContextMenu(null)
    void handleShowInFinder(id)
  }}
>
  <span>在 Finder 中显示</span>
</div>
```

详情按钮（图片和非图片区域均放置）：

```tsx
<button
  className="btn btnSecondary"
  style={{ width: '100%', justifyContent: 'center', height: 36 }}
  disabled={selection.length !== 1 || !details}
  onClick={() => void handleShowInFinder()}
>
  在 Finder 中显示
</button>
```

- [ ] **Step 3: Run web typecheck**

Run: `npm run typecheck:web`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/App.tsx
git commit -m "feat(renderer): add show-in-finder actions in menu and inspector"
```

### Task 4: Add Disabled Style For Context Menu Item

**Files:**
- Modify: `src/renderer/src/assets/main.css`

- [ ] **Step 1: Write failing visual selector usage**

`App.tsx` 已引用 `contextMenuItemDisabled`，当前样式文件缺失该类。

Run: `rg -n "contextMenuItemDisabled" src/renderer/src/assets/main.css`  
Expected: no match

- [ ] **Step 2: Add style rule**

```css
.contextMenuItemDisabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.contextMenuItemDisabled:hover {
  background: transparent;
  color: #ccc;
}
```

- [ ] **Step 3: Sanity check style reference**

Run: `rg -n "contextMenuItemDisabled" src/renderer/src/App.tsx src/renderer/src/assets/main.css`  
Expected: 2+ matches (component + style)

- [ ] **Step 4: Commit**

```bash
git add src/renderer/src/assets/main.css
git commit -m "style(menu): add disabled state for context menu items"
```

### Task 5: End-To-End Verification And Final Commit

**Files:**
- Modify: `src/main/media/showInFinder.ts` (if minor fixes)
- Modify: `src/main/ipcHandlers.ts` (if minor fixes)
- Modify: `src/preload/index.ts` (if minor fixes)
- Modify: `src/preload/index.d.ts` (if minor fixes)
- Modify: `src/renderer/src/App.tsx` (if minor fixes)
- Modify: `src/renderer/src/assets/main.css` (if minor fixes)

- [ ] **Step 1: Run consolidated checks**

Run:

```bash
npx tsc -p tsconfig.test.json
node --test .tmp-tests/tests/showInFinder.test.js
npm run typecheck:node
npm run typecheck:web
```

Expected: all commands PASS

- [ ] **Step 2: Manual verification in app**

Run: `npm run dev` and verify:
- 单选资源后，右键菜单“在 Finder 中显示”可点击且可打开 Finder 定位文件
- 多选资源后，右键菜单“在 Finder 中显示”为禁用态
- 详情面板按钮在单选时可点击，多选时禁用
- 人为删除库内文件后点击按钮，出现统一错误弹层

- [ ] **Step 3: Final commit**

```bash
git add src/main/media/showInFinder.ts src/main/ipcHandlers.ts src/preload/index.ts src/preload/index.d.ts src/renderer/src/App.tsx src/renderer/src/assets/main.css tests/showInFinder.test.ts
git commit -m "feat(media): support show selected resource in finder"
```
