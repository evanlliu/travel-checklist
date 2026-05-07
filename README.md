# Travel Checklist v1.0.0

这是第一个版本：购物 / 携带清单，适合 PC 和移动端使用，也适合 iOS Safari 添加到主屏幕后作为简单 App 使用。

## 已实现功能

- 密码登录，密码来自 Cloudflare Worker 的 `APP_PASSWORD` Secret
- 通过 Cloudflare Worker 读写 GitHub 仓库里的 `data.json`
- 多设备同步
- 中文 / English 双语言切换
- 新增、编辑、删除清单物品
- 待购买、已购买待打包、待打包、已完成状态流转
- 必须 / 可选标记
- 分类筛选、状态筛选、搜索
- 已完成默认隐藏
- 移动端底部快捷操作栏
- PWA 基础支持，可添加到 iOS 主屏幕

## 文件结构

```text
travel-checklist-v1.0.0/
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

## 第一步：上传前端文件到 GitHub

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

## 第二步：部署 Cloudflare Worker

把 `worker/worker.js` 部署到 Cloudflare Worker。

你的 Worker 需要配置这些变量，和你截图里的配置一致：

| Type | Name | Example |
|---|---|---|
| Secret | APP_PASSWORD | 你的登录密码 |
| Secret | GH_TOKEN | GitHub Token |
| Plaintext | GH_OWNER | evanliu |
| Plaintext | GH_REPO | travel-plan |
| Plaintext | GH_BRANCH | main |
| Plaintext | DATA_PATH | data.json |

`GH_TOKEN` 建议使用 GitHub Fine-grained token，只给当前仓库 `Contents: Read and write` 权限。

## 第三步：修改前端 Worker 地址

打开：

```text
js/config.js
```

把：

```js
API_BASE: ""
```

改成你的 Worker 地址，例如：

```js
API_BASE: "https://travel-checklist-api.your-name.workers.dev"
```

## 第四步：使用

1. 打开 GitHub Pages 页面
2. 输入 `APP_PASSWORD`
3. 开始新增清单
4. 在 iPhone Safari 打开页面
5. 点击分享按钮
6. 选择“添加到主屏幕”

## 数据状态说明

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

## 注意事项

- 前端不会保存 GitHub Token，GitHub Token 只放在 Cloudflare Worker Secret 里。
- 多设备同时修改时，如果发现版本冲突，页面会提示重新加载最新数据。
- 删除是软删除，数据会保留在 `data.json` 中，字段为 `deleted: true`。

## 下一版建议

v1.1.0 可以继续加：

- 批量新增
- 多个旅行清单
- 已删除恢复入口
- 购物价格 / 购买地点
- 模板一键导入
