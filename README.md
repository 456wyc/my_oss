# oss_pages · 开源项目集中展示页

把分散在 GitHub 上的开源项目汇总成一个 GitHub Pages 站点：[https://456wyc.github.io/oss_pages/](https://456wyc.github.io/oss_pages/)

纯静态、零依赖、零构建：只有 `index.html` + `assets/` + `data/`，数据由 GitHub REST API 生成。

## 目录结构

```
.
├── index.html                 # 页面
├── assets/
│   ├── css/style.css
│   └── js/app.js
├── data/
│   ├── projects.config.json   # 人工维护：仓库清单、分类、标签、主题色
│   ├── projects.json          # 自动生成：完整元数据
│   └── projects.js            # 自动生成：页面直接读取（支持 file:// 直开）
├── scripts/
│   ├── sync.mjs               # 拉 GitHub 数据 -> data/projects.*
│   └── serve.mjs              # 零依赖本地静态服务
└── .github/workflows/
    ├── deploy.yml             # 推送即部署 Pages
    └── sync-data.yml          # 每天定时刷新 star / 更新时间
```

## 本地使用

```bash
npm run sync     # 拉取最新仓库数据（需要 gh auth login 或设置 GITHUB_TOKEN）
npm run dev      # 本地预览 http://localhost:4321
```

也可以直接双击 `index.html` 打开（数据通过 `data/projects.js` 注入，不依赖 fetch）。

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
3. `deploy.yml` 会在每次推送后自动构建并发布；`sync-data.yml` 每天凌晨刷新一次数据。

## 交互特性

- 关键词搜索（按 `/` 聚焦）、分类 / 标签筛选、四种排序
- 深浅色主题自动跟随系统，可手动切换并记忆
- 卡片直接跳转「项目主页」（各项目自己的 Pages 站点）与源码
- `apps.html`：所有 GitHub Pages 站点的入口页（Launchpad 风格）
- 详情弹窗：star/fork/issue、许可证、语言占比、一键复制 clone 命令
