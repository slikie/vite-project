# 全能签自建软件源 / A self-hosted 全能签 source

为「全能签」做的第三方软件源：一个 JSON 清单 + 图标 + 构建/校验脚本。
A third-party source for 全能签 (an iOS signing tool): one JSON manifest, icons,
and scripts that build and validate it.

源生成的格式不是我猜的，而是从一份**在用的**第三方源里读出来的
（`leiting2327/qnq-source`），所以字段名和结构可以直接用。

## 目录结构

```
qnq-source/
├── catalog.json     # 单一真源：改这里
├── build.py         # 生成 appstore.json（把相对路径拼成绝对 https URL）
├── validate.py      # 校验清单、图标、IPA 可达性
├── appstore.json    # 产物，给全能签读的，不要手改
├── icons/           # 源图标 + 每个应用图标
└── apps/            # 可选：--mirror 时镜像 IPA 到这里
```

## 构建

```bash
./build.py --base https://<你的域名或 user.github.io/qnq-source>
```

`--base` 必填：全能签在手机上取源，**所有 URL 必须是绝对 https 地址**。
默认 `downUrl` 指向上游官方 Release（不占仓库空间、永远最新）。

想让 IPA 走自己的托管（国内访问 GitHub Release 常常很慢）：

```bash
./build.py --base https://<你的域名> --mirror
```

`--mirror` 会把 IPA 下载进 `apps/`，并用 catalog 里记录的 `ipaSha256` 校验；
校验不一致直接退出，不会产出坏源。

## 校验

```bash
./validate.py            # 结构和本地文件
./validate.py --remote   # 另外真的去请求每个图标和 IPA
```

手工检查几个全能签**不会报错**的地方：

- 图标必须是普通 PNG。直接从 IPA 里抠出来的图标是 Apple 压过的 `CgBI`，
  在手机上显示为空白方块 —— `validate.py` 会拦住它。
- `bundleId` 不能重复，否则同一台设备上装不了两个。
- `versionDate` 必须带时区的 ISO-8601。
- 相对路径一律无效。

## 加一个应用

在 `catalog.json` 的 `apps` 里加一条，然后重新 `build.py`：

```json
{
  "name": "应用名",
  "bundleId": "com.example.app",     // 从 IPA 的 Info.plist 里读，别猜
  "version": "1.2.3",
  "versionBuild": "123",
  "versionDate": "2026-10-19T12:00:00+08:00",
  "versionDescription": "说明",
  "minIos": "15.0",
  "type": "4",
  "icon": "icons/app.png",
  "ipaUrl": "https://github.com/<owner>/<repo>/releases/download/<tag>/<file>.ipa",
  "ipaMirrorName": "App-1.2.3-unsigned.ipa",
  "ipaSha256": "<sha256>",
  "ipaSize": 12345678,
  "homepage": "https://github.com/<owner>/<repo>"
}
```

`type` 的值（当前用 `"4"`）是从参考源里照抄的，语义没有文档说明；
只要照抄在用的源就能正常显示。

## 已收录

| 应用 | 版本 | Bundle ID | 说明 |
|---|---|---|---|
| PiliPlus | 2.1.6 (5472) | `com.example.piliplus` | 第三方哔哩哔哩客户端，开源（bggRGjQaUbCoE/PiliPlus），未签名 IPA，`embedded.mobileprovision` 不存在 |

注意 `com.example.piliplus` 是 Flutter 的默认界别符 —— 再收录别的 Flutter 应用
（例如同样用默认模板打包的）就会撞 ID，`validate.py` 会报重复。

## 内容原则

只收录**官方开源发布**的未签名 IPA（GitHub Releases 里作者自己发的）。
不收录破解、去广告外挂、账号多开或盗版内容 —— 那些在多数地区是侵权，
而且把这类东西挂在自己域名上风险自负。

## 发布到 GitHub Pages

仓库根目录就是站点根目录，所以：

1. 新建一个 **public** 仓库，把本目录推上去；
2. Settings → Pages → Source: `Deploy from a branch` → `main` / `/ (root)`；
3. 等一两分钟，然后 `./build.py --base https://<user>.github.io/<repo>` 重新生成；
4. 全能签 → 资源 → 软件源 → 添加第三方源，粘贴 `.../appstore.json`。
