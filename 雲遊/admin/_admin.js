/* _admin.js — 雲遊後台共用模組
 * 提供：Supabase client、auth 守衛、sidebar 注入、共用工具函式
 * 每個後台頁面在 <body> 最前面載入此檔案。
 */

const SUPABASE_URL = 'https://ayadandlvszhnvnciofv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_b6-9r7xQHwYADms1ZU4WuQ_uFe1q3-g';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Auth 守衛 ──────────────────────────────────────────────────────────────
// 呼叫此函式的頁面（非 index.html）若無登入 session 則跳回登入頁
async function requireAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    location.href = 'index.html';
    return null;
  }
  return session;
}

// ── Sidebar ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: 'dashboard.html',  icon: '🏠', label: '總覽' },
  { href: 'countries.html',  icon: '🌏', label: '國家管理' },
  { href: 'cities.html',     icon: '🏙️', label: '城市管理' },
  { href: 'categories.html', icon: '📂', label: '分類 / 商家' },
  { href: 'services.html',   icon: '🛎️', label: '服務卡' },
  { href: 'faqs.html',       icon: '❓', label: '常見問題' },
  { href: 'steps.html',      icon: '👣', label: '出行流程' },
  { href: 'currencies.html', icon: '💱', label: '匯率' },
  { href: 'marquee.html',    icon: '📢', label: '跑馬燈' },
  { href: 'settings.html',   icon: '⚙️', label: '站台設定' },
];

function injectSidebar(session) {
  const current = location.pathname.split('/').pop();
  const email = session?.user?.email ?? '';

  const el = document.createElement('aside');
  el.id = 'admin-sidebar';
  el.innerHTML = `
    <div class="sb-logo">雲遊<span>後台</span></div>
    <nav class="sb-nav">
      ${NAV_ITEMS.map(n => `
        <a href="${n.href}" class="sb-link${current === n.href ? ' active' : ''}">
          <span class="sb-icon">${n.icon}</span>${n.label}
        </a>`).join('')}
    </nav>
    <div class="sb-footer">
      <div class="sb-user">${email}</div>
      <button class="sb-logout" onclick="adminLogout()">登出</button>
    </div>`;
  document.body.prepend(el);
}

async function adminLogout() {
  await sb.auth.signOut();
  location.href = 'index.html';
}

// ── 共用工具 ───────────────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `admin-toast toast-${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function confirm2(msg) {
  return window.confirm(msg);
}

// 星星 UI：產生可點擊星星，回傳 {el, getValue}
function starRating(initial = 0, readonly = false) {
  const el = document.createElement('div');
  el.className = 'star-rating';
  let value = Number(initial) || 0;

  function render() {
    el.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const s = document.createElement('span');
      s.className = 'star' + (i <= value ? ' on' : '');
      s.textContent = '★';
      if (!readonly) {
        s.style.cursor = 'pointer';
        s.addEventListener('click', () => { value = i; render(); });
      }
      el.appendChild(s);
    }
    const num = document.createElement('span');
    num.className = 'star-num';
    num.textContent = value ? ` ${value.toFixed(1)}` : '';
    el.appendChild(num);
  }
  render();
  return { el, getValue: () => value, setValue: (v) => { value = Number(v); render(); } };
}

// 動態列表（字串陣列）
function stringList(items = []) {
  const el = document.createElement('div');
  el.className = 'str-list';
  let arr = [...items];

  function render() {
    el.innerHTML = '';
    arr.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'str-list-row';
      const inp = document.createElement('input');
      inp.type = 'text'; inp.value = item; inp.className = 'adm-input';
      inp.addEventListener('input', e => arr[i] = e.target.value);
      const del = document.createElement('button');
      del.textContent = '✕'; del.className = 'btn-icon';
      del.addEventListener('click', () => { arr.splice(i, 1); render(); });
      row.append(inp, del);
      el.appendChild(row);
    });
    const add = document.createElement('button');
    add.textContent = '＋ 新增'; add.className = 'btn-ghost';
    add.addEventListener('click', () => { arr.push(''); render(); });
    el.appendChild(add);
  }
  render();
  return { el, getValue: () => arr.filter(s => s.trim()) };
}

// 動態列表（{t, d} 物件陣列，用於 highlights）
function highlightList(items = []) {
  const el = document.createElement('div');
  el.className = 'hl-list';
  let arr = items.map(i => ({ t: i.t || '', d: i.d || '' }));

  function render() {
    el.innerHTML = '';
    arr.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'hl-list-row';
      const t = document.createElement('input');
      t.type = 'text'; t.value = item.t; t.placeholder = '標題'; t.className = 'adm-input';
      t.addEventListener('input', e => arr[i].t = e.target.value);
      const d = document.createElement('input');
      d.type = 'text'; d.value = item.d; d.placeholder = '說明'; d.className = 'adm-input';
      d.addEventListener('input', e => arr[i].d = e.target.value);
      const del = document.createElement('button');
      del.textContent = '✕'; del.className = 'btn-icon';
      del.addEventListener('click', () => { arr.splice(i, 1); render(); });
      row.append(t, d, del);
      el.appendChild(row);
    });
    const add = document.createElement('button');
    add.textContent = '＋ 新增'; add.className = 'btn-ghost';
    add.addEventListener('click', () => { arr.push({ t: '', d: '' }); render(); });
    el.appendChild(add);
  }
  render();
  return { el, getValue: () => arr.filter(r => r.t.trim() || r.d.trim()) };
}

// ── SortableJS 注入 ────────────────────────────────────────────────────────
(function(){
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js';
  document.head.appendChild(s);
})();

// 拖拉排序 helper：呼叫後自動更新 DB sort_order
async function makeSortable(tbody, table, pkField) {
  const init = () => {
    if (tbody._sortable) tbody._sortable.destroy();
    tbody._sortable = Sortable.create(tbody, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'sort-ghost',
      onEnd: async () => {
        const rows = [...tbody.querySelectorAll('tr[data-id]')];
        await Promise.all(rows.map((tr, i) =>
          sb.from(table).update({ sort_order: (i + 1) * 10 }).eq(pkField, tr.dataset.id)
        ));
        toast('排序已儲存');
      }
    });
  };
  if (window.Sortable) { init(); }
  else { const t = setInterval(() => { if (window.Sortable) { clearInterval(t); init(); } }, 100); }
}

// ── 共用 CSS 注入 ──────────────────────────────────────────────────────────
(function injectAdminCSS() {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:      #0d0b08;
      --bg2:     #161410;
      --bg3:     #1e1b16;
      --border:  rgba(200,169,110,0.18);
      --gold:    #c8a96e;
      --gold2:   #e8c98e;
      --text:    #e8e4dc;
      --muted:   #8a8070;
      --red:     #e05a5a;
      --green:   #5ab87a;
      --sidebar: 220px;
      --font:    'Noto Sans TC', 'Inter', sans-serif;
    }
    body { background: var(--bg); color: var(--text); font-family: var(--font); font-size: 14px; display: flex; min-height: 100vh; }

    /* Sidebar */
    #admin-sidebar { width: var(--sidebar); min-height: 100vh; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; }
    .sb-logo { padding: 24px 20px 20px; font-size: 18px; font-weight: 600; color: var(--gold); letter-spacing: 0.05em; }
    .sb-logo span { color: var(--muted); font-weight: 300; font-size: 13px; margin-left: 4px; }
    .sb-nav { flex: 1; overflow-y: auto; padding: 8px 0; }
    .sb-link { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: var(--muted); text-decoration: none; font-size: 13px; transition: all 0.15s; }
    .sb-link:hover { color: var(--text); background: var(--bg3); }
    .sb-link.active { color: var(--gold); background: var(--bg3); border-right: 2px solid var(--gold); }
    .sb-icon { font-size: 15px; width: 20px; text-align: center; }
    .sb-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
    .sb-user { font-size: 11px; color: var(--muted); margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sb-logout { width: 100%; padding: 7px; background: transparent; border: 1px solid var(--border); color: var(--muted); border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.15s; }
    .sb-logout:hover { border-color: var(--gold); color: var(--gold); }

    /* Main content */
    .admin-main { margin-left: var(--sidebar); flex: 1; padding: 32px 36px; max-width: 1100px; }
    .page-title { font-size: 22px; font-weight: 500; color: var(--text); margin-bottom: 24px; }
    .page-title small { font-size: 13px; color: var(--muted); font-weight: 300; margin-left: 10px; }

    /* Buttons */
    .btn-primary { background: var(--gold); color: #1a1200; border: none; padding: 8px 18px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.15s; }
    .btn-primary:hover { background: var(--gold2); }
    .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); padding: 7px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; transition: all 0.15s; }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
    .btn-danger { background: transparent; border: 1px solid var(--red); color: var(--red); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-danger:hover { background: var(--red); color: #fff; }
    .btn-icon { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 14px; padding: 2px 6px; }
    .btn-icon:hover { color: var(--red); }

    /* Table */
    .adm-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .adm-table th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid var(--border); }
    .adm-table td { padding: 12px 14px; border-bottom: 1px solid rgba(200,169,110,0.08); vertical-align: middle; }
    .adm-table tr:hover td { background: var(--bg2); }

    /* Form */
    .adm-input, .adm-textarea, .adm-select { width: 100%; background: var(--bg2); border: 1px solid var(--border); color: var(--text); padding: 8px 12px; border-radius: 4px; font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s; }
    .adm-input:focus, .adm-textarea:focus, .adm-select:focus { border-color: var(--gold); }
    .adm-textarea { resize: vertical; min-height: 80px; }
    .adm-select option { background: var(--bg2); }
    .form-group { margin-bottom: 16px; }
    .form-label { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* Toggle */
    .toggle { position: relative; display: inline-block; width: 36px; height: 20px; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-slider { position: absolute; inset: 0; background: var(--bg3); border-radius: 20px; cursor: pointer; transition: 0.2s; border: 1px solid var(--border); }
    .toggle input:checked + .toggle-slider { background: var(--gold); border-color: var(--gold); }
    .toggle-slider::before { content: ''; position: absolute; width: 14px; height: 14px; left: 2px; top: 2px; background: #fff; border-radius: 50%; transition: 0.2s; }
    .toggle input:checked + .toggle-slider::before { transform: translateX(16px); }

    /* Panel / Modal */
    .panel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: flex-start; justify-content: flex-end; }
    .panel { width: 480px; max-width: 96vw; height: 100vh; background: var(--bg2); border-left: 1px solid var(--border); overflow-y: auto; padding: 28px 28px 40px; }
    .panel-title { font-size: 16px; font-weight: 500; color: var(--text); margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .panel-close { background: none; border: none; color: var(--muted); font-size: 20px; cursor: pointer; }
    .panel-close:hover { color: var(--text); }
    .panel-actions { display: flex; gap: 10px; margin-top: 24px; justify-content: flex-end; }

    /* Stars */
    .star-rating { display: inline-flex; align-items: center; gap: 2px; }
    .star { font-size: 18px; color: var(--border); transition: color 0.1s; }
    .star.on { color: var(--gold); }
    .star-num { font-size: 13px; color: var(--muted); margin-left: 4px; }

    /* String / Highlight list */
    .str-list, .hl-list { display: flex; flex-direction: column; gap: 8px; }
    .str-list-row, .hl-list-row { display: flex; gap: 8px; align-items: center; }
    .hl-list-row { flex-wrap: wrap; }
    .hl-list-row .adm-input:first-child { flex: 0 0 35%; }
    .hl-list-row .adm-input:nth-child(2) { flex: 1; }

    /* Toast */
    .admin-toast { position: fixed; bottom: 28px; right: 28px; padding: 12px 20px; border-radius: 6px; font-size: 13px; z-index: 999; animation: fadeIn 0.2s; }
    .toast-success { background: var(--green); color: #fff; }
    .toast-error   { background: var(--red);   color: #fff; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    /* Badge */
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; }
    .badge-gold   { background: rgba(200,169,110,0.15); color: var(--gold); }
    .badge-green  { background: rgba(90,184,122,0.15);  color: var(--green); }
    .badge-muted  { background: var(--bg3); color: var(--muted); }

    /* Toolbar */
    .toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar-right { margin-left: auto; }

    /* Drag handle */
    .drag-handle { cursor: grab; color: var(--muted); font-size: 16px; padding: 0 6px; user-select: none; }
    .drag-handle:active { cursor: grabbing; }
    .sort-ghost { opacity: 0.4; background: rgba(200,169,110,0.1); }
  `;
  document.head.appendChild(style);
})();
