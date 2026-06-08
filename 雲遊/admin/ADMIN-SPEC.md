# 雲遊國際 — 後台管理規格書

**版本：** 0.1 草稿  
**日期：** 2026-06-07  
**狀態：** 待確認

---

## 一、整體架構

| 項目 | 說明 |
|---|---|
| 類型 | 純靜態 HTML，無 build step |
| 技術棧 | CDN 引入 React (Babel) + Supabase JS Client |
| 部署位置 | VPS `/var/www/demo-site/admin/` |
| 對外網址 | `https://api-site.ddns.net/admin/`（或臨時 Tunnel + /admin/） |
| 認證 | Supabase Auth（email / password 登入），無公開註冊 |
| 帳號建立 | 手動在 Supabase Dashboard > Authentication 新增 |
| RLS 保護 | 已在 Supabase schema 設定，authenticated role 才能寫入 |

---

## 二、頁面清單

| 檔案 | 頁面名稱 | 說明 |
|---|---|---|
| `index.html` | 登入頁 | 未登入時顯示，已登入自動跳轉 dashboard |
| `dashboard.html` | 總覽 | 各資料表筆數、快捷入口 |
| `countries.html` | 國家管理 | banner 圖片、樂遊 XX 標題與副標 |
| `cities.html` | 城市管理 | 依國家篩選、banner 圖片、地區列表 |
| `categories.html` | 分類管理 | 分類卡 CRUD；點進分類直接列出商家 |
| `services.html` | 服務卡管理 | 首頁服務卡（代辦簽證、機場接送…） |
| `faqs.html` | 常見問題管理 | Q&A CRUD |
| `steps.html` | 出行流程管理 | 步驟 CRUD（數字、標題、副標） |
| `currencies.html` | 匯率管理 | 幣別、符號、匯率數值 |
| `marquee.html` | 跑馬燈管理 | 多條條目 CRUD + 排序 + 整體開關 |
| `settings.html` | 站台設定 | LINE / WhatsApp |
| `_admin.js` | 共用模組 | Auth 檢查、Sidebar 注入、Supabase client |

---

## 三、各頁面規格

### 3.1 登入頁 `index.html`

- Email + Password 表單
- 呼叫 `supabase.auth.signInWithPassword()`
- 登入成功 → 跳轉 `dashboard.html`
- 登入失敗 → 顯示錯誤訊息

---

### 3.2 國家管理 `countries.html`

**列表欄位：** 旗幟、國家名稱、排序

**編輯欄位：**

| 欄位 | 說明 |
|---|---|
| `name` | 國家名稱（e.g. 越南） |
| `flag` | 旗幟 emoji |
| `banner_img` | 國家 banner 圖片（圖片上傳） |
| `feature_title` | 樂遊 XX 大卡標題（e.g. 樂遊越南） |
| `feature_sub` | 大卡副標（e.g. 盡覽南越風華） |
| `sort_order` | 排列順序 |

> **注意：** `feature` 類卡片本身不在分類管理內，只在這裡改文字。

---

### 3.3 城市管理 `cities.html`

**篩選：** 依國家

**編輯欄位：**

| 欄位 | 說明 |
|---|---|
| `name` | 城市中文名 |
| `name_en` | 城市英文名 |
| `banner_img` | 城市 banner 圖片（圖片上傳） |
| `regions` | 地區列表（可動態新增/刪除字串列） |
| `sort_order` | 排列順序 |

---

### 3.4 分類管理 `categories.html`

**篩選：** 依國家

**列表：** 顯示分類卡縮圖、名稱、排序；**不顯示 `size = 'feature'` 的卡**

**點進分類 → 直接列出該分類底下的商家列表（同頁 drill-down 或跳轉帶參數）**

**分類編輯欄位：**

| 欄位 | 說明 |
|---|---|
| `name` | 中文名稱 |
| `name_en` | 英文名稱 |
| `img` | 分類卡圖片（圖片上傳） |
| `size` | `normal` \| `tall`（不含 feature） |
| `link` | 自訂連結（選填）；填了則點卡片直接開新分頁跳該 URL，留空則 drill-down 進商家列表 |
| `sort_order` | 排列順序 |

---

### 3.5 商家 / 項目管理（從分類頁 drill-down 進入）

**麵包屑：** 國家 > 城市 > 分類 > 商家列表

**列表欄位：** 名稱、地區、價格、評分（★）、狀態開關、推薦開關

**商家編輯表單欄位：**

| 欄位 | 類型 | 說明 |
|---|---|---|
| `title` | 文字 | 商家名稱 |
| `slug` | 文字 | URL 用 ID（唯一），可自動產生 |
| `region` | 文字 | 所在地區 |
| `hours` | 文字 | 營業時間 |
| `description` | 多行文字 | 簡短描述 |
| `bullet_list` | 動態列表 | 可新增/刪除/排序字串 |
| `price_twd` | 數字 | 價格（NTD），留空 = 請洽客服 |
| `price_suffix` | 文字 | 價格後綴（e.g. ` / 人起`） |
| `rating` | **星星 UI** | 1–5 星，精度 0.1，點擊設定，顯示數值 |
| `review_count` | 數字 | 評論數 |
| `is_recommended` | 開關 | 推薦標記 |
| `is_active` | 開關 | 公開顯示控制 |
| `sort_order` | 數字 | 排列順序 |
| `img` | 圖片上傳 | 主封面圖 |
| `gallery` | 多圖管理 | 上傳、預覽、刪除、拖拉排序 |
| `address` | 文字 | 地址 |
| `phone` | 文字 | 電話 |
| `intro` | 多行文字 | 詳細介紹 |
| `highlights` | 動態列表 | 每筆含標題（`t`）+ 說明（`d`） |

**評分星星 UI 規格：**
- 5 顆星，支援半星（0.5 精度）或整顆（依需求調整）
- 點擊星星即設定數值
- 旁邊顯示目前數值（e.g. ★ 4.8）

---

### 3.6 服務卡管理 `services.html`

首頁六張服務卡（代辦簽證、機場接送、包車服務…）

**編輯欄位：** `tag`、`title`、`description`、`bg_img`（圖片上傳）、`link`、`sort_order`

---

### 3.7 常見問題管理 `faqs.html`

**編輯欄位：** `question`、`answer`（多行）、`sort_order`

---

### 3.8 出行流程管理 `steps.html`

**編輯欄位：** `num`（e.g. 01）、`label`、`sub`、`sort_order`

---

### 3.9 匯率管理 `currencies.html`

**編輯欄位：** `symbol`、`label`、`rate`、`round_to`

---

### 3.10 跑馬燈管理 `marquee.html`

跑馬燈為**多筆獨立條目**，可各自新增、刪除、編輯、拖拉排序。

**頁面頂部：** 整體開關（關閉時前台不顯示跑馬燈，條目資料保留）

**每筆條目欄位：**

| 欄位 | 說明 |
|---|---|
| `text` | 顯示文字（e.g. `最新：越南五天四夜限時優惠，即刻詢問！`） |
| `sort_order` | 播放順序，可拖拉調整 |

> DB 對應：新增 `marquee_items` 資料表；整體開關存 `site_config.marquee_enabled`

---

### 3.11 站台設定 `settings.html`

以下均存入 `site_config` 表（`key` / `value` 格式）：

| Key | 說明 | 範例值 |
|---|---|---|
| `cs_line_id` | LINE 顯示 ID | `@yunyou_travel` |
| `cs_line_url` | LINE 連結 | `https://line.me/ti/p/xxx` |
| `cs_whatsapp_url` | WhatsApp 連結 | `https://wa.me/886xxxxxxxxx` |

---

## 四、圖片上傳策略

**待確認：**

| 選項 | 說明 | 優點 | 缺點 |
|---|---|---|---|
| A. Supabase Storage | 上傳至 Supabase，回傳 public URL | 管理方便，有 CDN | 免費方案有容量限制（1 GB） |
| B. VPS `uploads/` | 上傳至 VPS `/var/www/demo-site/uploads/` via API | 無容量限制 | 需要另外寫上傳 API endpoint |

---

## 五、共用 UI 規範

- **色調：** 深色系（與主站一致），金色 accent
- **Sidebar：** 固定左側，列出所有頁面連結，顯示目前頁 highlight
- **登出按鈕：** Sidebar 底部，呼叫 `supabase.auth.signOut()`
- **未登入保護：** `_admin.js` 在每頁 load 時檢查 session，無 session 跳回 `index.html`

---

## 六、前置工作確認清單

- [ ] Supabase schema 是否已部署至 Supabase SQL Editor？
- [ ] Supabase anon key（前端連線用）
- [ ] 圖片上傳策略選定（A 或 B）
- [ ] 後台對外網址確認
- [ ] Supabase Auth 帳號建立（第一個 admin 帳號）
