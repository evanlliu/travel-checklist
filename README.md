# Travel Checklist v1.0.3

这是购物 / 携带清单的第 4 个版本。本版本重点处理：**第一次加载或刷新页面时，不再自动弹出设置 / 登录页面，而是直接进入主界面**。

## v1.0.3 更新内容

- 第一次打开页面直接进入主界面。
- 刷新页面后直接进入主界面。
- 不再因为 Cloudflare 未配置就自动弹出设置页面。
- 不再显示初始登录 / 配置页，Cloudflare 配置只保留在“设置”里。
- 页面加载时会先读取 `data.json` 显示清单。
- 如果 `data.json` 或本地已有 Cloudflare Worker 地址和访问密码，会自动同步 Worker 里的最新 `data.json`。
- 如果还没有配置 Cloudflare，只在页面状态栏提示，不弹窗。
- 继续保留设置页面里的 Cloudflare Worker 地址和访问密码配置。
- 继续保留中文 / 英文切换。
- 更新前端资源版本号到 `?v=1.0.3`，减少 iOS Safari / PWA 继续读取旧 JS、旧 CSS 的概率。

## 部署说明

### GitHub 需要更新

上传并替换：

- `index.html`
- `js/app.js`
- `js/config.js`
- `sw.js`
- `data.json`
- `README.md`

建议也一起替换整个前端项目，避免版本不一致。

### Cloudflare Worker 需要更新

本版本没有修改 Worker 接口逻辑，因此：

- 不需要重新部署 `worker/worker.js`

### Cloudflare Variables 需要检查

保持原来的配置即可：

- `APP_PASSWORD`
- `GH_TOKEN`
- `GH_OWNER`
- `GH_REPO`
- `GH_BRANCH`
- `DATA_PATH`

## 使用方式

1. 打开页面后会直接进入清单主界面。
2. 点击右上角“设置”。
3. 填写 Cloudflare Worker 地址和访问密码。
4. 点击“保存配置并重新同步”。
5. 保存成功后，配置会写入 `data.json`，其他设备刷新后可自动读取并同步。

## 安全提醒

这个版本仍然按照你的要求，把访问密码保存到 `data.json` 里，方便多设备同步。

如果你的 GitHub 仓库或 GitHub Pages 是公开的，别人可能直接看到 `data.json` 里的访问密码。所以建议：

1. `APP_PASSWORD` 只作为这个小工具的专用密码。
2. 不要使用你常用的重要账号密码。
3. `GH_TOKEN` 仍然只放在 Cloudflare Worker Secret 里，前端和 `data.json` 不会保存 GitHub Token。
