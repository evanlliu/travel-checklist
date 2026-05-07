# Travel Checklist v1.0.2

这是购物 / 携带清单的第三个版本。本版本重点修复设置弹窗关闭无反应的问题，并删除设置里的“退出登录”。

## v1.0.2 更新内容

- 修复设置弹窗右上角 `×` 点击后无法关闭的问题。
- 修复弹窗背景点击关闭不生效的问题。
- 删除设置页面里的 **退出登录** 按钮。
- Cloudflare Worker 地址和访问密码仍然在页面里配置。
- 保存配置后会重新同步，并把配置写入 `data.json`。
- 设置保存失败时，会在设置弹窗内直接显示错误提示，不再只显示在弹窗后面的页面上。
- 增加前端资源版本号 `?v=1.0.2`，减少 iOS Safari / PWA 继续读取旧 JS、旧 CSS 的概率。
- Token 过期后，如果 `data.json` 或本地已有访问密码，会自动重新登录并同步。

## 重要安全提醒

这个版本仍然按照你的要求，把访问密码保存到 `data.json` 里，方便多设备自动同步。

如果你的 GitHub 仓库或 GitHub Pages 是公开的，别人可能直接看到 `data.json` 里的访问密码。所以建议：

1. `APP_PASSWORD` 只作为这个小工具的专用密码。
2. 不要使用你常用的重要账号密码。
3. `GH_TOKEN` 仍然只放在 Cloudflare Worker Secret 里，前端和 `data.json` 不会保存 GitHub Token。

## 文件结构

```text
travel-checklist-v1.0.2/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── app.js
├── icons/
│   ├── apple-touch-icon.png
│   └── apple-touch-icon.svg
├── manifest.json
├── sw.js
├── data.json
└── worker/
    ├── worker.js
    └── wrangler.toml.example
```

## 部署步骤

### 第一步：上传前端文件到 GitHub

把下面这些文件放到你的 GitHub Pages 仓库根目录：

```text
index.html
css/
js/
icons/
manifest.json
sw.js
data.json
```

### 第二步：部署 Cloudflare Worker

把 `worker/worker.js` 部署到 Cloudflare Worker。

Worker 需要配置这些变量：

| Type | Name | Example |
|---|---|---|
| Secret | APP_PASSWORD | 你的访问密码 |
| Secret | GH_TOKEN | GitHub Token |
| Plaintext | GH_OWNER | evanliu |
| Plaintext | GH_REPO | travel-plan |
| Plaintext | GH_BRANCH | main |
| Plaintext | DATA_PATH | data.json |

`GH_TOKEN` 建议使用 GitHub Fine-grained token，只给当前仓库 `Contents: Read and write` 权限。

### 第三步：首次打开页面

1. 打开 GitHub Pages 页面。
2. 填写 Cloudflare Worker 地址，例如：

```text
https://travel-checklist-data-worker.xxxxxxxx.workers.dev
```

3. 填写访问密码，也就是 Worker Secret 里的 `APP_PASSWORD`。
4. 点击 **保存并同步**。
5. 同步成功后，配置会保存到 `data.json`。

之后其他设备打开时，会优先读取 `data.json` 里的配置，然后自动同步最新清单。

## 使用说明

物品类型：

```text
carry          直接携带
buy            只需购买
buy_and_carry  购买后携带
```

状态流转：

```text
直接携带：待打包 → 已打包完成
只需购买：待购买 → 已完成
购买后携带：待购买 → 已购买，待打包 → 已打包完成
```
