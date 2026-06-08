/* 共用 navbar / drawer / footer 注入器（vanilla JS）
   每個頁面在 <body> 開頭加入 <div data-shell></div>，並設置 data-shell-active="服務項目" 之類。
*/
(function() {
  const LANG_LABELS = {
    tc: { flag: '🇹🇼', label: '繁中' },
    vi: { flag: '🇻🇳', label: 'VI' },
    ja: { flag: '🇯🇵', label: '日本語' },
    en: { flag: '🇬🇧', label: 'EN' },
  };
  const LANG_ORDER = ['tc', 'vi', 'ja', 'en'];
  let curLang = localStorage.getItem('yy_lang') || 'tc';
  if (!LANG_LABELS[curLang]) curLang = 'tc';

  // Use DB.countries if _db.js is loaded on this page, otherwise fall back to local copy.
  const COUNTRIES = (window.DB && window.DB.countries) || [
    { code: 'vn', name: '越南', flag: '🇻🇳', cities: [
      { code: 'hcm', name: '胡志明', en: 'Ho Chi Minh' },
      { code: 'hni', name: '河內',   en: 'Ha Noi' },
      { code: 'dng', name: '峴港',   en: 'Da Nang' },
    ]},
    { code: 'jp', name: '日本', flag: '🇯🇵', cities: [
      { code: 'tky', name: '東京', en: 'Tokyo' },
      { code: 'kyt', name: '京都', en: 'Kyoto' },
      { code: 'osk', name: '大阪', en: 'Osaka' },
    ]},
  ];

  function readCurrent() {
    const urlCity = new URLSearchParams(location.search).get('city');
    const code = urlCity || localStorage.getItem('yy_city') || 'hcm';
    if (urlCity) localStorage.setItem('yy_city', urlCity);
    for (const c of COUNTRIES) for (const ci of c.cities)
      if (ci.code === code) return { country: c, city: ci };
    return { country: COUNTRIES[0], city: COUNTRIES[0].cities[0] };
  }

  function writeCurrent(code) {
    localStorage.setItem('yy_city', code);
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function renderNavbar(active) {
    const { country, city } = readCurrent();
    return `
      <div class="marquee-bar">
        <div class="marquee-track">
          <span class="marquee-item">✦ 一站式觀光，從機場到飯店全程無憂 · 24H 中文客服在線 · 客製行程量身打造 · 越南｜日本｜泰國｜台灣 ✦</span>
          <span class="marquee-item">✦ 一站式觀光，從機場到飯店全程無憂 · 24H 中文客服在線 · 客製行程量身打造 · 越南｜日本｜泰國｜台灣 ✦</span>
        </div>
      </div>
      <nav class="navbar">
        <div class="nav-left">
          <div style="position:relative" id="city-wrap">
            <button class="city-trigger" data-action="toggle-city">
              <span>${country.flag}</span>
              <span style="flex:1;text-align:left">${esc(city.name)}</span>
              <span class="city-trigger-arrow">▼</span>
            </button>
            <div class="city-menu" id="city-menu">
              ${COUNTRIES.map(c => `
                <div class="city-menu-country">${c.flag} ${esc(c.name)}</div>
                ${c.cities.map(ci => `
                  <button class="city-menu-item" data-city="${ci.code}">
                    ${esc(ci.name)}<span class="city-en">${esc(ci.en)}</span>
                    ${ci.code === city.code ? '<span style="margin-left:auto;font-size:12px">✓</span>' : ''}
                  </button>
                `).join('')}
              `).join('')}
            </div>
          </div>
        </div>
        <a class="nav-logo" href="index.html">
          <img class="nav-logo-img" src="uploads/logo-mark.png" alt="雲遊國際" />
          <span class="nav-logo-text">雲遊國際</span>
        </a>
        <div class="nav-right">
          <button class="lang-mini" data-action="cycle-lang">${LANG_LABELS[curLang].flag} ${LANG_LABELS[curLang].label}</button>
          <button class="hamburger" data-action="open-drawer" aria-label="選單">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    `;
  }

  function renderDrawer(active) {
    const isActive = (k) => k === active ? ' active' : '';
    return `
      <div class="drawer-backdrop" data-action="close-drawer"></div>
      <aside class="drawer" id="drawer">
        <div class="drawer-head">
          <div style="display:flex;align-items:center;gap:10px">
            <img src="uploads/logo-mark.png" alt="雲遊國際" style="height:36px" />
            <span style="font-family:var(--font-serif);font-size:18px;color:var(--gold);letter-spacing:0.16em">雲遊國際</span>
          </div>
          <button class="drawer-close" data-action="close-drawer">×</button>
        </div>

        <div class="drawer-section">選單</div>
        <a class="drawer-link${isActive('home')}"       href="index.html"><span class="drawer-link-icon">⌂</span>首頁</a>
        <a class="drawer-link${isActive('service')}"    href="服務項目.html"><span class="drawer-link-icon">◇</span>服務項目</a>
        <a class="drawer-link${isActive('howitworks')}" href="出行流程.html"><span class="drawer-link-icon">→</span>出行流程</a>
        <a class="drawer-link${isActive('faq')}"        href="常見問題.html"><span class="drawer-link-icon">?</span>常見問題</a>
        <a class="drawer-link${isActive('about')}"      href="about-page.html"><span class="drawer-link-icon">i</span>關於我們</a>

        <div class="drawer-section">聯絡客服</div>
        <a class="drawer-link" href="https://line.me/" target="_blank" rel="noopener noreferrer"><span class="drawer-link-icon">💬</span>LINE：@yunyou_travel</a>
        <a class="drawer-link" href="https://wa.me/" target="_blank" rel="noopener noreferrer"><span class="drawer-link-icon">📱</span>WhatsApp</a>
        <a class="drawer-link" href="tel:0800123456"><span class="drawer-link-icon">☎</span>0800-123-456</a>

        <div class="drawer-section">語言</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding:6px 24px 18px">
          ${LANG_ORDER.map(l => `<button class="drawer-lang-btn${l === curLang ? ' active' : ''}" data-lang="${l}"><span>${LANG_LABELS[l].flag}</span><span style="margin-left:6px">${LANG_LABELS[l].label}</span></button>`).join('')}
        </div>

        <div style="padding:24px;margin-top:auto;font-size:11px;color:var(--text-muted);text-align:center;border-top:1px solid rgba(200,169,110,0.08)">
          © 2026 雲遊國際 · All rights reserved.
        </div>
      </aside>
    `;
  }

  function renderFooter() {
    return `
      <footer class="footer">
        <div class="footer-logo">
          <img src="uploads/logo-mark.png" alt="雲遊國際" />
          <span class="footer-logo-text">雲遊國際</span>
        </div>
        <p class="footer-tagline">以尊貴的眼光，探索世界每一個值得被記住的角落。</p>
      </footer>
      <div class="footer-bottom">© 2026 雲遊國際 · All rights reserved.</div>
    `;
  }

  function renderCsFab() {
    return `
      <a class="cs-fab" href="https://line.me/" target="_blank" rel="noopener noreferrer" aria-label="客服">
        <div class="cs-fab-inner">
          <img class="cs-fab-face" src="uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png" alt="客服" />
        </div>
      </a>
    `;
  }

  function init() {
    const slot = document.querySelector('[data-shell-top]');
    const active = slot ? slot.dataset.shellActive : '';
    if (slot) slot.innerHTML = renderNavbar(active) + renderDrawer(active);
    const bottom = document.querySelector('[data-shell-bottom]');
    if (bottom) bottom.innerHTML = renderFooter() + renderCsFab();

    // Event delegation
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action]');
      if (t) {
        const a = t.dataset.action;
        if (a === 'open-drawer') {
          document.getElementById('drawer')?.classList.add('open');
          document.querySelector('.drawer-backdrop')?.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
        if (a === 'close-drawer') {
          document.getElementById('drawer')?.classList.remove('open');
          document.querySelector('.drawer-backdrop')?.classList.remove('open');
          document.body.style.overflow = '';
        }
        if (a === 'toggle-city') {
          const menu = document.getElementById('city-menu');
          const trig = t;
          if (menu) {
            menu.classList.toggle('open');
            trig.classList.toggle('open');
          }
        }
        if (a === 'cycle-lang') {
          const idx = LANG_ORDER.indexOf(curLang);
          const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
          localStorage.setItem('yy_lang', next);
          location.reload();
        }
      }
      // Language selection (drawer)
      const langBtn = e.target.closest('[data-lang]');
      if (langBtn) {
        localStorage.setItem('yy_lang', langBtn.dataset.lang);
        location.reload();
      }
      // City selection
      const cityBtn = e.target.closest('[data-city]');
      if (cityBtn) {
        writeCurrent(cityBtn.dataset.city);
        location.reload();
      }
      // Close city menu when clicking outside
      if (!e.target.closest('#city-wrap')) {
        document.getElementById('city-menu')?.classList.remove('open');
        document.querySelector('.city-trigger')?.classList.remove('open');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
