# 雲遊國際 — 前台

## 目錄結構

```
雲遊/
├── index.html          首頁
├── cat.html            分類 / 列表頁
├── about-page.html     關於我們
├── article-page.html   文章頁
├── blog.html           部落格列表
├── content-page.html   內容頁
├── service-page.html   服務詳情頁
├── tours.html          行程頁
├── 出行流程.html
├── 常見問題.html
├── 服務項目.html
│
├── js/                 前台 JavaScript
│   ├── _db.js          資料層（window.DB / window.YY，Supabase-ready）
│   ├── _shell.js       共用版型注入（Header / Footer / FAB）
│   └── _items.js       舊資料相容 shim（已轉交給 _db.js，勿直接使用）
│
├── css/                前台樣式
│   └── _shell.css      共用版型樣式
│
├── docs/               文件
│   ├── SYSTEM.md       系統架構說明（VPS、Nginx、Supabase 等）
│   └── sql/            SQL 腳本
│       └── supabase-schema.sql  Supabase 資料表建立語法
│
└── uploads/            靜態圖片資源
```

## 資料層說明

- `js/_db.js` 暴露 `window.DB`（非同步，Supabase-ready）
- 本地先用 seed data 同步渲染，`DB.init(url, key)` 接上 Supabase 後非同步刷新
- `window.YY` 為向後相容別名，新頁面請直接使用 `window.DB`
