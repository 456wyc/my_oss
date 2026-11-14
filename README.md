# oss_pages · 开源项目集中展示页

把分散在 GitHub 上的开源项目汇总成一个 GitHub Pages 站点：[https://456wyc.github.io/oss_pages/](https://456wyc.github.io/oss_pages/)

纯静态、零运行时依赖：页面由 `index.html` / `apps.html` / `demos.html` / `demo.html` + `assets/` + `data/` 组成，数据由 GitHub REST API 生成。发布时用一个零依赖脚本给静态资源加内容 hash 版本号（不做打包、不引入框架）。

## 目录结构

```
.
├── index.html                 # 产品官网式落地页
├── apps.html                  # 站点入口页（Launchpad）
├── demos.html                 # 实验场：Demo 清单
├── demo.html                  # Demo 查看器（站点外壳 + iframe + 沉浸模式）
├── demos/                     # 独立 Demo HTML（V8 发动机、林间猎手 3D…）
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── i18n.js            # 多语言词典（简/繁/英/法/日/韩）
│       ├── app.js
│       ├── apps.js
│       ├── demos.js           # Demo 磁贴渲染 + 查看器逻辑
│       └── stats.js           # 访问统计（仅正式域名加载）
├── data/
│   ├── projects.config.json   # 人工维护：仓库清单、分类、标签、主题色
│   ├── projects.json          # 自动生成：完整元数据
│   ├── projects.js            # 自动生成：页面直接读取（支持 file:// 直开）
│   └── demos.js               # 人工维护：Demo 清单
├── scripts/
│   ├── sync.mjs               # 拉 GitHub 数据 -> data/projects.*
│   ├── build.mjs              # 生成 dist/，静态资源按内容 hash 版本化
│   └── serve.mjs              # 零依赖本地静态服务（no-store）
└── .github/workflows/
    ├── deploy.yml             # 推送即部署 Pages（上传 dist/）
    └── sync-data.yml          # 每天定时刷新 star / 更新时间
```

## 本地使用

```bash
npm run sync     # 拉取最新仓库数据（需要 gh auth login 或设置 GITHUB_TOKEN）
npm run dev      # 本地预览 http://localhost:4321（no-store，改完即生效）
npm run build    # 生成 dist/ 发布产物，本地开发一般不需要
```

也可以直接双击 `index.html` 打开（数据通过 `data/projects.js` 注入，不依赖 fetch）。

想预览构建产物：PowerShell 用 `$env:SERVE_ROOT='dist'; npm run dev`，bash 用 `SERVE_ROOT=dist npm run dev`。

## 增删项目

编辑 `data/projects.config.json`：

```json
{
  "repo": "my-project",
  "category": "效率工具",
  "tags": ["CLI", "Go"],
  "accent": ["#0ea5e9", "#22c55e"],
  "featured": true,
  "highlights": ["一句话亮点"]
}
```

然后 `npm run sync && npm run dev` 即可。描述、语言、star、fork、许可证、语言占比等字段会自动从 GitHub 拉取。

## 部署到 GitHub Pages

1. 创建仓库（例如 `oss_pages`）并推送 `main` 分支；
2. 仓库 Settings → Pages → Source 选 **GitHub Actions**；
3. `deploy.yml` 依次执行 `sync.mjs`（刷数据）→ `build.mjs`（生成 `dist/` 并版本化资源）→ 上传 `dist/`；`sync-data.yml` 每天凌晨刷新一次数据。

## 缓存与「看不到最新改动」

三层机制，改动后无需手动清缓存或强制刷新：

| 场景 | 机制 |
| --- | --- |
| 本地预览 `npm run dev` | `serve.mjs` 对所有响应（含 404）下发 `Cache-Control: no-store`，改完文件直接刷新即可 |
| Demo 查看器 `demo.html` | iframe 与「新标签打开」的 URL 每次都带 `?v=<时间戳>`，绕过浏览器 / CDN 对独立 demo HTML 的缓存；导航栏圆形按钮可一键重载 |
| 线上 Pages 静态资源 | `build.mjs` 给每个 css/js/json 算 sha256 内容 hash，把 HTML 中的引用改写成 `?v=<hash>`；内容变了 URL 才变，既长期可缓存又能立刻更新 |

> 唯一无法从静态站点侧消除的是 GitHub Pages 对 **HTML 文档本身** 的 CDN 缓存（约 10 分钟）。已给所有 HTML 注入 `Cache-Control` meta 尽力缓解；通过「实验场 → 查看器」打开 demo 不受影响，因为 iframe URL 每次都不同。极端情况下 `Ctrl+Shift+R` 强刷一次即可。

## 交互特性

- 关键词搜索（按 `/` 聚焦）、分类 / 标签筛选、四种排序
- 深浅色主题自动跟随系统，可手动切换并记忆
- **六语种切换**：简体中文 / 繁體中文 / English / Français / 日本語 / 한국어
  - 顶部下拉选择，写入 `localStorage`；首次访问按浏览器语言自动判定
  - 支持 `?lang=ja` 这类 URL 参数覆盖；日期与「x 天前」等用 `Intl` 按语种格式化
  - 新增词条只需在 `assets/js/i18n.js` 的 `DICT` 中补齐 6 份
- 卡片直接跳转「项目主页」（各项目自己的 Pages 站点）与源码
- `apps.html`：所有 GitHub Pages 站点的入口页（Launchpad 风格）
- `demos.html`：实验场，集中展示可在线打开的独立 Demo（如 V8 发动机 3D 演示）；清单见 `data/demos.js`
- 详情弹窗：star/fork/issue、许可证、语言占比、一键复制 clone 命令
