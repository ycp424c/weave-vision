# 织影（WeaveVision）

一款 Eagle 风格的本地作品资源管理工具：导入图片/视频、标签、智能文件夹，并支持 AI 自动“命名 + 打标签”（OpenAI-compatible / DashScope compatible-mode 等）。

寓意：

- “织”代表精细的整理与逻辑
- “影”涵盖了摄影与动态影像
- AI 像织布一样，将凌乱的素材编织成有条理的画卷

> English version: [README_EN.md](file:///Users/justynchen/Documents/code/resource-manager/README_EN.md)

## 目录

- [功能概览](#功能概览)
- [使用说明](#使用说明)
- [快捷键](#快捷键)
- [AI 配置](#ai-配置)
- [开发](#开发)
- [构建与打包](#构建与打包)
- [项目结构](#项目结构)
- [App Icon](#app-icon)
- [Contributing](#contributing)
- [License](#license)

## 功能概览

- 资源库
  - 创建/打开/切换库（每个库独立存储：SQLite + 文件）
  - 导入图片/视频（支持拖拽导入）
  - 重复检测视图
- 标签体系
  - 给资源添加/移除标签
  - 标签库（搜索、对选中资源批量添加）
  - 标签编辑/删除（删除会从所有资源移除该标签）
- 智能文件夹
  - 通过规则筛选（类型/标签/评分/标题包含）
  - 支持编辑/删除
- AI（命名 + 打标签）
  - 支持批量：对多选资源逐个生成预览，再确认应用
  - 支持 DashScope OpenAI-compatible（`/compatible-mode`）等接口
  - 自动处理大图 data-url 超限：请求前缩放/压缩（避免 10MB data-uri 限制）

## 使用说明

### 创建/打开资源库

- 首次进入会提示“选择或创建资源库”
- 创建库：选择一个空目录，会在目录内生成 `library.json` 与 `db.sqlite`
- 打开/切换库：选择已有资源库目录

### 导入文件

- 菜单栏：文件 → 导入文件…
- 或拖拽文件到窗口松开导入

### 批量操作（AI/标签）

- 多选方式：按住 `Cmd`（macOS）或 `Ctrl`（Windows/Linux）点击资源卡片进行加选/反选
- 批量加标签：在右侧详情的“标签”输入框输入后点击“添加”（会作用于当前选中的多项；未多选则只作用于当前资源）
- 批量 AI 命名/打标签：菜单栏 AI → AI 命名/打标签（或 Cmd/Ctrl+K）
  - 先生成“预览”，展示标题前后变化与新增标签
  - 点击“应用修改”才会写入（不会删除已有标签）

## 快捷键

以下快捷键由应用菜单栏提供（`CmdOrCtrl` 表示 macOS 用 `Cmd`，其他系统用 `Ctrl`）：

- `CmdOrCtrl+N`：创建库…
- `CmdOrCtrl+O`：打开/切换库…
- `CmdOrCtrl+I`：导入文件…
- `CmdOrCtrl+K`：AI 命名/打标签（支持对多选批量）
- `CmdOrCtrl+L`：标签库…

## AI 配置

### OpenAI-compatible

在菜单栏 AI → AI 设置… 填写：

- Base URL：你的 OpenAI-compatible 服务地址
- Model：模型名称（需要支持图像输入）
- API Key：服务需要则填写；本地服务可为空

### DashScope（阿里云百炼）

Base URL 建议填写（任选其一）：

- `https://dashscope.aliyuncs.com/compatible-mode`
- `https://dashscope.aliyuncs.com/compatible-mode/v1`

如果你填的是 `https://dashscope.aliyuncs.com`，通常会触发 404（路径不匹配）。

## 开发

### 环境要求

- Node.js 18+（建议使用更高版本）
- macOS / Windows / Linux

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 推荐 IDE

- VSCode + ESLint + Prettier

## 构建与打包

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 项目结构

- `src/main`：Electron 主进程（IPC、菜单栏、AI 请求、库管理）
- `src/preload`：Preload bridge（安全暴露 API 给 renderer）
- `src/renderer`：React UI
- `build/`：electron-builder 打包资源（`icon.icns/icon.ico/icon.png` 等）
- `resources/`：运行时资源（例如窗口 icon）

## App Icon

- 打包图标在 [build/](file:///Users/justynchen/Documents/code/resource-manager/build)（`icon.icns`, `icon.ico`, `icon.png`）。
- Linux 运行时窗口 icon 使用 [icon.png](file:///Users/justynchen/Documents/code/resource-manager/resources/icon.png)。
- Low-poly 企鹅源 SVG：
  - [icon.svg](file:///Users/justynchen/Documents/code/resource-manager/build/icon.svg)（打包资源目录）
  - [icon.svg](file:///Users/justynchen/Documents/code/resource-manager/resources/icon.svg)（运行时资源目录）

## Contributing

欢迎提 Issue / PR。建议在 PR 中包含：

- 变更说明
- 复现步骤/截图（如涉及 UI）
- `npm run typecheck && npm run build` 的通过结果

## License

MIT License，见 [LICENSE](file:///Users/justynchen/Documents/code/resource-manager/LICENSE)。
