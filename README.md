# Travel Checklist v1.5.6

一个适合 PC 和 iOS Safari 添加到主屏幕使用的旅行购物 / 携带清单。

## v1.5.6 更新

- 新增多个清单支持，例如：墨西哥出行、土耳其出行、伦敦转机。
- 顶部新增“当前清单”选择器。
- 新增“管理清单”页面。
- 支持新建空白清单。
- 支持复制当前清单，复制时会把物品复制到新清单，并把状态重置为待购买 / 待打包。
- 支持清单重命名。
- 支持清单归档。
- 支持归档清单恢复。
- 新增 data.json schemaVersion 2。
- 兼容旧版 trips / tripId 数据，会自动转换成 checklists / checklistId。

## 部署到 GitHub Pages

上传这些文件到你的 GitHub 仓库：

```text
index.html
css/style.css
js/app.js
js/config.js
manifest.json
sw.js
icons/apple-touch-icon.png
icons/apple-touch-icon.svg
```

如果你线上已经有自己的 data.json，不要直接覆盖 data.json。新版程序会自动把旧版 data.json 转成多清单结构。

如果你是第一次部署，可以上传：

```text
data.json
```

## 部署到 Cloudflare Worker

如果你从 v1.0.x 升级到 v1.5.6，需要更新 Worker：

```text
worker/worker.js
```

Cloudflare Variables / Secrets 继续使用：

```text
APP_PASSWORD   Secret
GH_TOKEN       Secret
DATA_PATH      Plaintext，例如 data.json
GH_BRANCH      Plaintext，例如 main
GH_OWNER       Plaintext，例如 evanlliu
GH_REPO        Plaintext，例如 travel-plan
```

## 使用方式

1. 打开页面。
2. 如果已经配置过 Cloudflare，会自动同步 data.json。
3. 顶部选择当前清单，例如“墨西哥出行清单”。
4. 点击“管理清单”可以新建、复制、重命名、归档清单。
5. 新增物品会自动加入当前选择的清单。

## 注意

页面里保存的 Cloudflare Worker 地址和访问密码会同步到 data.json。请只使用这个小工具专用密码，不要使用重要账号密码。


## v1.5.6

- 拖动排序仅对置顶物品生效。
- 普通物品继续按：必须 → 可选、待购买 → 待打包 → 已完成、物品名称排序。
