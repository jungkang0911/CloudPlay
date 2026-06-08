# CloudPlay — System Overview

## VPS

| 項目 | 值 |
|---|---|
| IP | 165.154.243.84 |
| OS | Ubuntu 24.04 (Linux 6.8.0-31) |
| RAM | 1.9 GB |
| Disk | 38 GB total |
| SSH User | ubuntu |
| SSH Port | 22 |

---

## Web Server — Nginx

設定檔：`/etc/nginx/sites-enabled/stock-lottery-api`

| Server Block | Port | Root / Upstream |
|---|---|---|
| `api-site.ddns.net` | 80 → redirect 443 | — |
| `api-site.ddns.net` | 443 SSL (Let's Encrypt) | proxy to :3000 / :3001 |
| demo-site | 8080 | `/var/www/demo-site/` |
| elfmodels-site | 8081 | `/var/www/elfmodels-site/` |

### 計畫中：Supabase 反向代理

為避免前端暴露 Supabase URL 及 key，計畫在 nginx 加代理層：

| 路徑 | 代理目標 | 說明 |
|---|---|---|
| `api-site.ddns.net/api/yunyu/` | 雲遊 Supabase | 雲遊資料層 |
| `api-site.ddns.net/api/elf/` | elfmodels Supabase | elfmodels 資料層 |

> 兩站之後會各自綁定獨立 domain，屆時 nginx server_name 和代理路徑一併更新。

---

## Docker Containers

| Container | Image | Port | 說明 |
|---|---|---|---|
| stock-lottery-api | stock-lottery-api:latest | 127.0.0.1:3000 | — |
| shared-platform-api | shared-platform-api:latest | 127.0.0.1:3001 | — |
| taiwan-id-card-yolo-api | taiwan-id-card-yolo-api | 0.0.0.0:8000 | — |
| n8n | n8nio/n8n:latest | 0.0.0.0:5678 | 工作流程自動化 |

### n8n 設定

| 項目 | 值 |
|---|---|
| 對外埠 | 5678（尚未接 nginx） |
| 目前 WEBHOOK_URL | `http://165.154.243.84:5678/` |
| 計畫 WEBHOOK_URL | `https://api-site.ddns.net/n8n/`（待設定） |
| Data Volume | `n8n_n8n_data:/home/node/.n8n` |

> ⚠️ n8n 的固定 WEBHOOK_URL 尚未設定，待 nginx `/n8n/` proxy 完成後需重建 container。

---

## Cloudflare Tunnel（雲遊對外臨時網址）

```bash
nohup cloudflared tunnel --url http://localhost:8080 > /tmp/cloudflared.log 2>&1 &
```

> ⚠️ 每次重啟 cloudflared 會產生新 URL，需從 `/tmp/cloudflared.log` 重新取得。

---

## 目錄結構

**本機：** `D:\Document\My Dev\CloudPlay\`  
**VPS：** 雲遊 → `/var/www/demo-site/`（:8080）／elfmodels → `/var/www/elfmodels-site/`（:8081）

```
CloudPlay/
├── 雲遊/
│   ├── *.html                   ← 前台頁面
│   ├── admin/                   ← 後台管理
│   ├── js/                      ← _db.js / _shell.js / _items.js
│   ├── css/                     ← _shell.css
│   ├── docs/
│   │   ├── SYSTEM.md            ← 此文件（可 commit）
│   │   ├── SECRETS.md           ← 敏感資料（僅本機，已 .gitignore）
│   │   └── sql/supabase-schema.sql
│   └── uploads/
│
└── elfmodels/                   ← 站台二（獨立 git repo）
```

---

## Supabase — 雲遊（cloud-play）

| 項目 | 值 |
|---|---|
| Project Name | cloud-play |
| Project Ref | `ayadandlvszhnvnciofv` |
| Project URL | `https://ayadandlvszhnvnciofv.supabase.co` |
| Region | Southeast Asia (Singapore) |
| 金鑰 / 密碼 | 見 `SECRETS.md` |

> ⚠️ Supabase 免費方案閒置 1 週後自動暫停，需到 Dashboard 手動 Restore。

## Supabase — elfmodels

| 項目 | 值 |
|---|---|
| Project Name | elf-models |
| Project Ref | `dhvhajgjlptigfbpuorp` |
| Project URL | `https://dhvhajgjlptigfbpuorp.supabase.co` |
| Region | Northeast Asia (Seoul) |
| 金鑰 / 密碼 | 見 elfmodels repo 的 SECRETS.md |

---

## Supabase CLI

| 項目 | 值 |
|---|---|
| 安裝路徑 | `C:\Users\jungk\scoop\shims\supabase.exe` |
| PAT | 見 `SECRETS.md` |
| 雲遊 linked | ✅（`ayadandlvszhnvnciofv`） |

---

## 後台管理

規格書：`admin/ADMIN-SPEC.md`

| 項目 | 說明 |
|---|---|
| 類型 | 純靜態 HTML，CDN Supabase JS |
| Auth | Supabase Auth（email/password，無公開註冊） |
| 部署位置 | VPS `/var/www/demo-site/admin/` |
| 狀態 | ✅ 完成（11 頁面） |

---

## 待辦事項

- [ ] 設定 nginx Supabase 反向代理（雲遊 + elfmodels）
- [ ] 設定 n8n nginx proxy（`/n8n/`）並重建 container 更新 WEBHOOK_URL
- [ ] elfmodels 模特資料接 Supabase DB
- [ ] 兩站各自綁定獨立 domain
- [ ] 圖片上傳決策（Supabase Storage vs VPS uploads/）
