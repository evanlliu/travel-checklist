# Travel Checklist v1.0.1

这是购物 / 携带清单的第二个版本。本版本重点优化：**Cloudflare Worker 地址和访问密码可以直接在页面里配置，并保存到 data.json，用于多设备同步**。

## v1.0.1 新增功能

- 不再需要手动修改 `js/config.js` 才能填写 Worker 地址。
- 登录页直接填写：
  - Cloudflare Worker 地址
  - 访问密码，也就是 Worker Secret 里的 `APP_PASSWORD`
- 同步成功后，配置会写入 `data.json`：

```json
"settings": {
  "cloudflare": {
    "apiBase": "https://你的worker地址.workers.dev",
    "appPassword": "你的访问密码"
  }
}
```

- 设置页面新增 **Cloudflare 同步配置**，可以随时修改 Worker 地址和访问密码。
- 页面每次加载 / 刷新时，会优先读取配置，然后直接同步 GitHub 里的 `data.json` 最新数据。
- Service Worker 不再缓存 `data.json`，避免移动端 PWA 刷新后读取旧数据。
- 版本号已更新为 `v1.0.1`。

## 重要安全提醒

这个版本是按照你的要求，把访问密码保存到 `data.json` 里，方便多设备自动同步。

如果你的 GitHub 仓库或 GitHub Pages 是公开的，别人可能直接看到 `data.json` 里的访问密码。所以建议：

1. `APP_PASSWORD` 不要使用你常用的重要密码。
2. 只把它当作这个小工具的专用访问密码。
3. `GH_TOKEN` 仍然只放在 Cloudflare Worker Secret 里，前端和 `data.json` 不会保存 GitHub Token。

## 文件结构

```text
travel-checklist-v1.0.1/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── app.js
├── icons/
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

把下面这些文件放到你的 GitHub 仓库根目录：

```text
index.html
css/
js/
icons/
manifest.json
sw.js
data.json
```

然后开启 GitHub Pages。

### 第二步：部署 Cloudflare Worker

把 `worker/worker.js` 部署到 Cloudflare Worker。

Worker 仍然需要配置这些变量：

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
2. 在登录页填写 Cloudflare Worker 地址，例如：

```text
https://travel-checklist-api.your-name.workers.dev
```

3. 填写访问密码，也就是 Cloudflare Worker 里的 `APP_PASSWORD`。
4. 点击 **保存并同步**。
5. 同步成功后，配置会保存到 `data.json`。

之后其他设备打开时，会自动读取 `data.json` 里的配置并同步最新清单。

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

## 和 v1.0.0 的区别

v1.0.0 需要打开 `js/config.js` 修改 Worker 地址。

v1.0.1 不需要改代码：

```text
页面填写 Worker 地址和访问密码
↓
登录并同步 data.json
↓
配置保存到 data.json
↓
其他设备刷新后自动同步
```

## 下一版建议

v1.0.2 / v1.1.0 可以继续优化：

- 批量新增物品
- 多个旅行清单
- 已删除恢复入口
- 购物价格 / 购买地点
- 墨西哥出行模板一键导入
- 连接配置加密保存
