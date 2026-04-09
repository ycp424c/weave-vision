# 资源新增在 Finder 中显示能力设计

## 背景

当前资源管理器已经支持资源导入、预览、复制图片、AI 分析等操作，但缺少从应用直接跳转到本地文件位置的能力。对于需要在系统层面对文件进行查看、拖拽、二次处理的场景，用户需要手动去库目录查找文件，路径成本高。

本次新增一个明确能力：对单个资源执行“在 Finder 中显示”，由 Finder 打开对应目录并选中该文件。

## 目标

- 在资源卡片右键菜单中提供“在 Finder 中显示”操作。
- 在右侧详情面板中提供“在 Finder 中显示”按钮。
- 仅支持单个资源。
- 多选时禁用该操作，不做降级执行，不自动只打开第一个文件。
- 通过 Electron 主进程执行系统能力，不向渲染层暴露本地绝对路径。

## 非目标

- 不新增“打开所在文件夹”能力。
- 不支持多选批量在 Finder 中显示。
- 不调整资源存储结构、数据库结构或导入流程。
- 不引入新的主菜单项。

## 方案对比

### 方案 A：主进程新增 `media:showInFinder` IPC

主进程通过 `LibraryManager.resolveOriginalAbsolutePath(mediaId)` 解析资源绝对路径，再调用 Electron `shell.showItemInFolder(absPath)` 触发 Finder 展示。

优点：

- 复用现有 Electron 架构，系统能力仍由主进程托管。
- 不需要修改 `MediaRow` / `MediaDetails` 数据结构。
- 不向渲染层暴露真实文件路径，边界清晰。
- 与现有 `media:copyImageToClipboard` 的组织方式一致。

缺点：

- 需要补一条新的 preload 暴露和渲染层调用链。

### 方案 B：在详情数据中增加绝对路径，渲染层请求系统打开

优点：

- 渲染层可直接复用该路径做其他能力。

缺点：

- 将本地绝对路径扩散到前端状态和类型，不符合当前最小暴露原则。
- 为一个单一能力扩大数据面，收益低。

### 方案 C：只在右键菜单提供入口

优点：

- UI 改动最小。

缺点：

- 不满足需求中“两处都加”的要求。

## 推荐方案

采用方案 A。

这是本需求的最小正确实现：系统能力放在主进程，前端只表达“对哪个资源执行显示”，不持有路径细节。这样既满足 Finder 能力，又不会把后续路径治理问题带进渲染层。

## 交互设计

### 入口 1：资源网格右键菜单

- 当右键单个资源时，菜单展示“在 Finder 中显示”，可点击。
- 当当前选区为多个资源时，菜单中该项展示为禁用态。
- 若右键对象不在当前选区中，则先将选区切为该单个资源，再打开菜单；因此此时菜单可用。

### 入口 2：右侧详情面板

- 在单资源详情区域新增一个次级按钮“在 Finder 中显示”。
- 当当前选区不是单选时，按钮禁用。
- 按钮与现有图片动作按钮并列放置，保持当前交互密度，不新增额外弹窗。

### 触发结果

- 成功时不额外弹确认框。
- Finder 打开对应目录并选中文件。
- 失败时沿用现有统一错误弹层，显示明确错误文案。

## 技术设计

### 主进程

文件：`src/main/ipcHandlers.ts`

新增 handler：

- `ipcMain.handle('media:showInFinder', async (_event, mediaId: string) => { ... })`

处理流程：

1. 通过 `libraryManager.getMediaDetails(mediaId)` 或 `resolveOriginalAbsolutePath(mediaId)` 校验资源存在。
2. 解析原文件绝对路径。
3. 若路径为空，抛出“资源不存在”或“无法定位资源文件”。
4. 调用 `shell.showItemInFolder(absPath)`。
5. 返回 `true`。

说明：

- 不直接依赖渲染层传入路径，只接受 `mediaId`。
- 不新增新的数据库访问接口，复用 `LibraryManager` 现有解析能力。

### Preload

文件：

- `src/preload/index.ts`
- `src/preload/index.d.ts`

新增 API：

- `api.media.showInFinder(mediaId: string): Promise<boolean>`

要求：

- 挂在 `media` namespace 下，与复制图片等资源动作保持一致。
- 在类型定义中补齐方法签名，保证渲染层 TypeScript 可推导。

### 渲染层

文件：`src/renderer/src/App.tsx`

新增通用方法：

- `handleShowInFinder(mediaId?: string): Promise<void>`

行为：

- 优先使用显式传入的 `mediaId`。
- 若未传入，则退回当前详情选中的 `details.id`。
- 调用前统一校验：当前必须是单选。
- 调用成功后不需要 toast。
- 调用失败后通过 `setError(formatError(e))` 走统一错误提示。

右键菜单接入：

- 在现有删除项之前新增“在 Finder 中显示”。
- `disabled` 条件为 `contextMenu.mediaIds.length !== 1`。
- 点击时关闭菜单，再调用 `handleShowInFinder(contextMenu.mediaIds[0])`。

详情面板接入：

- 在图片动作区和非图片动作区都提供同一个按钮，避免仅图片可见。
- `disabled` 条件为 `selection.length !== 1 || !details`。

## 错误处理

需要覆盖以下场景：

- 资源 ID 无效或记录不存在。
- 库未打开。
- 资源文件已被外部删除，导致绝对路径失效。
- Electron 系统调用失败。

错误文案原则：

- 面向用户，不暴露多余内部细节。
- 优先使用“无法在 Finder 中显示该资源”“资源文件不存在”等直接表述。

## 测试策略

### 自动化测试

新增主进程侧测试，优先覆盖行为边界：

1. 当 `mediaId` 可解析到绝对路径时，调用系统展示方法并返回 `true`。
2. 当资源不存在或路径解析失败时，抛出预期错误。

测试方式：

- 抽取一个小的可测试函数，或对 handler 依赖进行最小封装，避免直接测试 `ipcMain.handle` 注册本身。
- 对 `electron.shell.showItemInFolder` 做 mock。

### 手工验证

1. 单选资源，右键菜单可见且可触发“在 Finder 中显示”。
2. 单选资源，右侧详情按钮可触发“在 Finder 中显示”。
3. 多选资源，右键菜单项和详情按钮都为禁用态。
4. 人为删除库内文件后，再触发该操作，应用展示错误弹层。

## 实施步骤

1. 先补主进程测试，定义成功与失败行为。
2. 新增主进程 IPC 和 preload 暴露。
3. 接入渲染层右键菜单。
4. 接入渲染层详情按钮。
5. 执行自动化测试与手工验证。

## 风险与约束

- `shell.showItemInFolder` 的行为依赖宿主系统；当前需求明确针对 Finder，默认运行环境为 macOS。
- 若未来支持 Windows / Linux，该接口仍可工作，但文案“Finder”需要按平台抽象，否则会出现术语不一致。
- 当前需求不做平台文案适配，先按 Finder 固定文案实现。

## 验收标准

- 用户可从右键菜单和详情面板两处触发“在 Finder 中显示”。
- 仅单选可用，多选必禁用。
- 不向渲染层增加本地绝对路径字段。
- 文件不存在时能看到明确错误，而不是静默失败。
