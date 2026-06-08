/* _db.js — 雲遊國際 統一資料層
 * Exposes window.DB (async, Supabase-ready) and window.YY (backward compat).
 * To enable Supabase: call DB.init(url, anonKey) once from a config script.
 */
(function () {

  // ═══════════════════════════════════════════════════════════════
  //  SEED DATA  — local fallback used when Supabase is not configured
  // ═══════════════════════════════════════════════════════════════

  const _countries = [
    {
      code: 'vn', name: '越南', flag: '🇻🇳',
      featureTitle: '樂遊越南', featureSub: '盡覽南越風華',
      bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
      cities: [
        { code: 'hcm', name: '胡志明', en: 'Ho Chi Minh',
          bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
          regions: ['全部區域', '第一郡', '第三郡', '第五郡', '第七郡', '富潤郡', '平盛郡'] },
        { code: 'hni', name: '河內', en: 'Ha Noi',
          bannerImg: 'uploads/banner-vietnam.png',
          regions: ['全部區域', '還劍郡', '巴亭郡', '西湖郡', '東多郡'] },
        { code: 'dng', name: '峴港', en: 'Da Nang',
          bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
          regions: ['全部區域', '海珠郡', '山茶半島', '美溪海灘', '會安老街'] },
      ],
    },
    {
      code: 'jp', name: '日本', flag: '🇯🇵',
      featureTitle: '樂遊日本', featureSub: '四季詩篇之國',
      bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
      cities: [
        { code: 'tky', name: '東京', en: 'Tokyo',
          bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
          regions: ['全部區域', '新宿區', '澀谷區', '銀座中央區', '六本木', '池袋豐島'] },
        { code: 'kyt', name: '京都', en: 'Kyoto',
          bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
          regions: ['全部區域', '祇園東山', '嵐山', '伏見', '北山金閣'] },
        { code: 'osk', name: '大阪', en: 'Osaka',
          bannerImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
          regions: ['全部區域', '心齋橋', '難波', '梅田', '天王寺'] },
      ],
    },
  ];

  const _categories = {
    vn: [
      { id: 'attractions', name: '景點介紹', en: 'Attractions',      img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', size: 'tall' },
      { id: 'feature',     name: '樂遊越南', en: 'Discover Vietnam', img: '',                                                   size: 'feature' },
      { id: 'restaurants', name: '餐廳飯店', en: 'Dining',           img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png' },
      { id: 'sauna',       name: '越式桑拿', en: 'Sauna',            img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png' },
      { id: 'cafe',        name: '越式咖啡', en: 'Cafe',             img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png' },
      { id: 'salon',       name: '越式洗髮', en: 'Hair Salon',       img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png' },
      { id: 'massage',     name: '越式按摩', en: 'Massage',          img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png' },
      { id: 'bar',         name: '酒吧夜店', en: 'Bar & Club',       img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png' },
      { id: 'ktv',         name: 'KTV 酒店', en: 'KTV',              img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png' },
    ],
    jp: [
      { id: 'attractions', name: '景點介紹', en: 'Attractions',    img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png', size: 'tall' },
      { id: 'feature',     name: '樂遊日本', en: 'Discover Japan', img: '',                                                   size: 'feature' },
      { id: 'restaurants', name: '餐廳飯店', en: 'Dining',         img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png' },
      { id: 'onsen',       name: '日式溫泉', en: 'Onsen',          img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png' },
      { id: 'cafe',        name: '日式咖啡', en: 'Cafe',           img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png' },
      { id: 'salon',       name: '日式美容', en: 'Salon',          img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png' },
      { id: 'massage',     name: '日式按摩', en: 'Massage',        img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png' },
      { id: 'izakaya',     name: '居酒屋',   en: 'Izakaya',        img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png' },
      { id: 'ktv',         name: 'KTV 酒店', en: 'KTV',            img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png' },
    ],
  };

  const _catNames = {
    attractions: '景點介紹', restaurants: '餐廳飯店',
    sauna: '越式桑拿', cafe: '越式咖啡', salon: '越式洗髮', massage: '越式按摩',
    bar: '酒吧夜店', ktv: 'KTV 酒店',
    onsen: '日式溫泉', izakaya: '居酒屋',
    feature: '精品行程',
  };

  const _services = [
    { tag: 'Visa',          title: '代辦簽證', desc: '正規簽證公司代辦，免手續費，護照一拍即可辦理，急件快速處理。',                              bg: 'uploads/svc-visa.png',          link: 'service-page.html#visa' },
    { tag: 'Transfer',      title: '機場接送', desc: '專人司機舉牌接送，往返機場與飯店，附贈當地網卡一張。',                                      bg: 'uploads/svc-transfer.png',      link: 'service-page.html#transfer' },
    { tag: 'Charter',       title: '包車服務', desc: '市內市外皆可安排包車，私人導遊隨行，靈活彈性調整行程。',                                    bg: 'uploads/svc-charter.png',       link: 'service-page.html#charter' },
    { tag: 'Hotel',         title: '訂房服務', desc: '代訂各星級飯店及酒店式公寓，量身搭配預算與需求。',                                          bg: 'uploads/svc-hotel.png',         link: 'service-page.html#hotel' },
    { tag: 'Custom',        title: '客製行程', desc: '根據偏好打造獨一無二的行程，深度體驗文化與美食。',                                          bg: 'uploads/svc-custom.png',        link: 'service-page.html#custom' },
    { tag: 'Entertainment', title: '娛樂服務', desc: 'Spa、桑拿、KTV、水療、泳池Villa、員工旅遊、生日Party一站式安排。', bg: 'uploads/svc-entertainment.png', link: 'service-page.html#entertainment' },
  ];

  const _steps = [
    { num: '01', label: '了解內容', sub: '瀏覽分類與行程' },
    { num: '02', label: '選定日期', sub: '決定出發時間' },
    { num: '03', label: '聯絡客服', sub: 'LINE / WhatsApp' },
    { num: '04', label: '確認資訊', sub: '填寫報名表單' },
    { num: '05', label: '夢想啟程', sub: '開啟美好旅程' },
  ];

  const _faqs = [
    { q: '一個人可以參加嗎？', a: '當然可以！我們會為您媒合想要一同出遊的旅伴，確定成團後建立專屬群組，出發前就能和其他成員互動認識。' },
    { q: '需要帶什麼幣別？',   a: '攜帶新台幣即可，抵達當地導遊會帶您至銀樓換匯，匯率比機場更好。最低預算每天 NT$10,000 起。' },
    { q: '團費大概多少？',     a: '最低滿 3 人成團，五天四夜每人約 NT$15,000 起，含 24H 專人服務。除團費外，當地消費均由商家出帳單後自行結帳，絕不灌水。' },
    { q: '如何開始預訂？',     a: '選定出團日期後聯絡客服，確認成團後填寫報名表單即可。只需帶護照、簽證、台幣、手機充電線，其餘我們都安排好了！' },
    { q: '可以代辦簽證嗎？',   a: '可以。我們配合正規簽證公司，免手續費，只需提供護照照片即可開始申辦，急件最快 3 個工作天。' },
  ];

  const _currencies = {
    TWD: { code: 'TWD', symbol: 'NT$', label: '台幣',   rate: 1,     round: 10 },
    VND: { code: 'VND', symbol: '₫',   label: '越南盾', rate: 800,   round: 1000 },
    JPY: { code: 'JPY', symbol: '¥',   label: '日圓',   rate: 4.8,   round: 100 },
    USD: { code: 'USD', symbol: 'US$', label: '美元',   rate: 0.031, round: 1 },
  };
  const _langCcy = { tc: 'TWD', vi: 'VND', ja: 'JPY', en: 'USD' };

  const _vendors = {
    'hcm:attractions': [
      { id: 'cruise-dinner', priceTWD: 1200, priceSuffix: ' / 人起', title: '遊輪晚餐', region: '第一郡', hours: '18:00 – 21:30',
        desc: '推薦西貢河上 3 艘最著名的遊輪晚餐',
        list: ['西貢餐廳船（Nhà Hàng Tàu Sài Gòn）', '邦昌遊輪（Bonsai Cruise）', '印度支那遊輪（Indochina Junk）'],
        rating: 4.8, count: 1280, rec: true, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
        address: '西貢河 Bach Dang 碼頭', phone: '+84 28 1234 5678',
        gallery: ['uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'uploads/banner-vietnam.png'],
        intro: '在西貢河上享用浪漫的遊輪晚餐，是體驗胡志明市夜景最經典的方式。船上提供越式自助餐或精緻套餐，搭配現場樂團演奏，沿岸欣賞 Bitexco 金融塔、Landmark 81 等地標的燈火夜色。',
        highlights: [
          { t: '三大名船任選', d: '依預算與人數安排西貢餐廳船、邦昌遊輪或印度支那遊輪。' },
          { t: '現場樂團演奏', d: '航程中有越式民謠或爵士樂團演出，氣氛浪漫。' },
          { t: '無敵河岸夜景', d: '兩岸地標燈火、橫跨西貢河，是拍照打卡熱點。' },
          { t: '中文導遊陪同', d: '全程協助點餐、拍照，溝通零障礙。' },
        ] },
      { id: 'landmark81', priceTWD: 600, priceSuffix: ' / 人起', title: 'Landmark 81', region: '平盛郡', hours: '09:30 – 22:00',
        desc: 'Landmark 81 體驗娛樂活動推薦',
        list: ['Landmark 81 Skyview', '在 81 樓開放式視野下，盡覽全城新都市風光，是熱戀情侶夜遊絕佳之選'],
        rating: 4.9, count: 2340, rec: true, img: 'uploads/banner-vietnam.png',
        address: '720A Điện Biên Phủ, 平盛郡', phone: '+84 28 2345 6789',
        gallery: ['uploads/banner-vietnam.png', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png'],
        intro: 'Landmark 81 是越南第一高樓，81 樓的 Skyview 觀景台可 360 度俯瞰整座胡志明市。頂層另有空中酒吧與餐廳，是欣賞城市日落與夜景的首選。',
        highlights: [
          { t: 'Skyview 觀景台', d: '81 樓 360 度玻璃觀景台，全城盡收眼底。' },
          { t: '空中酒吧', d: '高空 Bar 享用調酒，氣氛絕佳。' },
          { t: '購物中心', d: '樓下 Vincom 購物中心，國際精品齊全。' },
        ] },
      { id: 'homay', priceTWD: 450, priceSuffix: ' / 人起', title: 'Hồ Mây Park', region: '頭頓灣', hours: '08:00 – 21:00',
        desc: '開放時間：',
        list: ['平日（週日～週四）：08:00 – 22:00', '週末（週五～週六）及假期：08:00 – 24:00'],
        rating: 4.6, count: 870, rec: false, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
        address: '頭頓市 Núi Lớn 山頂', phone: '+84 254 123 456',
        gallery: ['uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png'],
        intro: 'Hồ Mây Park 位於頭頓市山頂，搭乘纜車即可抵達，園區內有遊樂設施、動物園、山頂湖景與餐廳，適合親子同遊。',
        highlights: [
          { t: '空中纜車', d: '搭纜車上山，俯瞰頭頓海灣。' },
          { t: '山頂樂園', d: '遊樂設施與動物園，適合全家。' },
        ] },
      { id: 'bui-vien', priceTWD: 0, priceSuffix: '', title: '范老五街夜市', region: '第一郡', hours: '17:00 – 02:00',
        desc: '胡志明最熱鬧的背包客一條街',
        list: ['街頭酒吧、現場音樂、街邊小吃', '推薦：越式法國麵包、烤春卷、椰子咖啡'],
        rating: 4.5, count: 3120, rec: true, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png',
        address: 'Bùi Viện, 第一郡', phone: '—',
        gallery: ['uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png'],
        intro: '范老五街（Bùi Viện）是胡志明市最熱鬧的背包客街，入夜後整條街變身露天酒吧與派對場地，街頭小吃、現場音樂、霓虹燈光，是體驗西貢夜生活的必訪之地。',
        highlights: [
          { t: '露天酒吧', d: '整條街露天座位，啤酒調酒任選。' },
          { t: '街頭美食', d: '越式法國麵包、烤春卷、椰子咖啡。' },
          { t: '現場音樂', d: '街頭樂團與 DJ，熱鬧到凌晨。' },
        ] },
      { id: 'reunification', priceTWD: 70, priceSuffix: ' / 人起', title: '統一宮（獨立宮）', region: '第一郡', hours: '07:30 – 11:00　13:00 – 16:00',
        desc: '越戰歷史的見證地，越南近代政治的核心場域',
        list: ['可參觀總統辦公室、會議廳、地下指揮所', '建議停留時間 1.5 – 2 小時'],
        rating: 4.4, count: 1640, rec: false, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
        address: '135 Nam Kỳ Khởi Nghĩa, 第一郡', phone: '+84 28 3822 3652',
        gallery: ['uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png'],
        intro: '統一宮（前身為南越總統府）是越南近代史的重要見證地，1975 年坦克衝破鐵門象徵越戰結束。館內保留當年的總統辦公室、會議廳與地下指揮所。',
        highlights: [
          { t: '歷史建築', d: '完整保留 1960 年代的總統府原貌。' },
          { t: '地下指揮所', d: '參觀戰時地下作戰指揮中心。' },
        ] },
    ],
    'hcm:restaurants': [
      { id: 'reverie',   priceTWD: 8000, priceSuffix: ' / 晚起', title: 'Reverie Saigon',  region: '第一郡', hours: '24 小時',       desc: '胡志明市超五星級酒店，西貢河景無敵', list: ['豪華景觀客房', '頂樓 Skydeck 酒吧', '米其林餐廳 Le Royal'], rating: 4.9, count: 980,  rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', address: '22-36 Nguyễn Huệ, 第一郡',      phone: '+84 28 3823 6688', gallery: [], intro: '', highlights: [] },
      { id: 'pho2000',   priceTWD: 120,  priceSuffix: ' / 人起', title: 'Pho 2000',         region: '第一郡', hours: '06:00 – 22:00', desc: '柯林頓總統用餐過的越南河粉名店',     list: ['特色牛肉河粉', '法式越南三明治'],                         rating: 4.6, count: 4520, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', address: '1-3 Phan Chu Trinh, 第一郡',   phone: '+84 28 3822 2788', gallery: [], intro: '', highlights: [] },
      { id: 'caravelle', priceTWD: 5500, priceSuffix: ' / 晚起', title: 'Caravelle Hotel',  region: '第一郡', hours: '24 小時',       desc: '五星級飯店，鬧區步行可達',           list: ['Saigon Saigon Rooftop Bar', '近市政劇院、歌劇院'],        rating: 4.7, count: 1620, rec: false, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', address: '19-23 Lam Sơn Square, 第一郡', phone: '+84 28 3823 4999', gallery: [], intro: '', highlights: [] },
    ],
    'hcm:sauna': [
      { id: 'golden-lotus', priceTWD: 900,  priceSuffix: ' / 人起', title: 'Golden Lotus Spa', region: '第一郡', hours: '10:00 – 24:00', desc: '老字號越式三溫暖會館', list: ['乾蒸 / 濕蒸區', '冷熱泉交替池', '附贈茶點與夜宵'], rating: 4.7, count: 760, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', address: '15 Thái Văn Lung, 第一郡',        phone: '+84 28 3823 0011', gallery: [], intro: '', highlights: [] },
      { id: 'rex-spa',      priceTWD: 1100, priceSuffix: ' / 人起', title: 'Rex Spa',          region: '第三郡', hours: '11:00 – 23:00', desc: '法式裝潢，氛圍寧靜',       list: ['獨立 VIP 包廂', '專業水療師全程服務'],                  rating: 4.5, count: 540, rec: false, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', address: '141 Nguyễn Đình Chiểu, 第三郡', phone: '+84 28 3930 2222', gallery: [], intro: '', highlights: [] },
    ],
    'hcm:cafe': [
      { id: 'workshop', priceTWD: 150, priceSuffix: ' / 人起', title: 'The Workshop Coffee', region: '第一郡', hours: '08:00 – 21:00', desc: '胡志明最早的精品咖啡館之一', list: ['樓中樓挑高空間', '單品手沖 / 越式滴漏'],     rating: 4.7, count: 2230, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', address: '27 Ngô Đức Kế, 第一郡', phone: '+84 28 3824 6801', gallery: [], intro: '', highlights: [] },
      { id: 'cong',     priceTWD: 100, priceSuffix: ' / 人起', title: 'Cộng Cà Phê',          region: '第一郡', hours: '07:00 – 23:30', desc: '越南知名連鎖咖啡，軍綠復古風', list: ['必點：椰子冰沙咖啡', '多家分店可選擇'], rating: 4.6, count: 5120, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', address: '多家分店',            phone: '—',                gallery: [], intro: '', highlights: [] },
    ],
    'hcm:salon': [
      { id: 'golden-hair', priceTWD: 500, priceSuffix: ' / 人起', title: '黃金髮藝會館', region: '第一郡', hours: '10:00 – 23:00', desc: '90 分鐘越式洗髮、頭肩頸按摩', list: ['獨立躺椅包廂', '附耳燭 / 採耳體驗（選配）'], rating: 4.5, count: 410, rec: true, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', address: '第一郡市中心', phone: '+84 28 3821 7000', gallery: [], intro: '', highlights: [] },
    ],
    'hcm:massage': [
      { id: 'lapothiquaire', priceTWD: 2400, priceSuffix: ' / 人起', title: "La Maison de L'Apothiquaire", region: '第三郡', hours: '09:00 – 22:00', desc: '法式別墅 SPA，奢華高端',   list: ['Signature 全身按摩 90 分鐘', '純天然法系芳療精油'], rating: 4.9, count: 680,  rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', address: '64A Trương Định, 第三郡', phone: '+84 28 3932 5181', gallery: [], intro: '', highlights: [] },
      { id: 'miumiu',        priceTWD: 650,  priceSuffix: ' / 人起', title: 'Miu Miu Spa',                  region: '第一郡', hours: '10:00 – 23:30', desc: '高評價平價按摩連鎖', list: ['全身越式按摩 60 分鐘', '熱石療程加價選配'],            rating: 4.6, count: 2840, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', address: '多家分店',               phone: '+84 28 3636 2020', gallery: [], intro: '', highlights: [] },
    ],
    'hcm:bar': [
      { id: 'chill-skybar', priceTWD: 400, priceSuffix: ' / 人起', title: 'Chill Skybar',  region: '第一郡', hours: '17:30 – 02:00', desc: '胡志明最知名的天空酒吧之一', list: ['26 樓無遮蔽全景', '需穿著得體', '建議事先訂位'], rating: 4.7, count: 1980, rec: true,  img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', address: 'AB Tower 26F, 第一郡',      phone: '+84 93 882 2838',  gallery: [], intro: '', highlights: [] },
      { id: 'lush',         priceTWD: 300, priceSuffix: ' 低消',    title: 'Lush Saigon',  region: '第一郡', hours: '21:00 – 03:00', desc: '本地年輕人最愛 Club',         list: ["每週四 Ladies' Night", 'EDM / Hip-hop'],             rating: 4.4, count: 1430, rec: false, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', address: '2 Lý Tự Trọng, 第一郡', phone: '+84 28 3824 2496', gallery: [], intro: '', highlights: [] },
    ],
    'hcm:ktv': [
      { id: 'royal-ktv', priceTWD: 2000, priceSuffix: ' / 包廂起', title: 'Royal KTV', region: '第五郡', hours: '14:00 – 03:00', desc: '高端豪華 KTV，VIP 包廂', list: ['獨立衛浴與沙發', '中文流行歌庫齊全', '專屬服務生'], rating: 4.6, count: 320, rec: true, img: 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', address: '第五郡', phone: '+84 28 3855 9999', gallery: [], intro: '', highlights: [] },
    ],
  };

  // ═══════════════════════════════════════════════════════════════
  //  SUPABASE HELPERS
  // ═══════════════════════════════════════════════════════════════

  let _sbUrl = null, _sbKey = null;

  async function _sbFetch(table, qs) {
    if (!_sbUrl || !_sbKey) return null;
    try {
      const res = await fetch(
        `${_sbUrl}/rest/v1/${table}${qs ? '?' + qs : ''}`,
        { headers: { apikey: _sbKey, Authorization: `Bearer ${_sbKey}` } }
      );
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.warn('[DB] Supabase fetch failed:', e.message);
      return null;
    }
  }

  // Map Supabase vendor row → local format
  function _mapVendor(r) {
    const ccy = DB.currentCcy();
    const sfx = r.price_suffix || '';
    return {
      id:          r.slug || String(r.id),
      title:       r.title,
      region:      r.region || '',
      hours:       r.hours || '',
      desc:        r.description || '',
      list:        r.bullet_list || [],
      rating:      parseFloat(r.rating) || 4.5,
      count:       r.review_count || 0,
      rec:         !!r.is_recommended,
      img:         r.img || 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png',
      priceTWD:    r.price_twd,
      priceSuffix: sfx,
      price:       DB.formatPrice(r.price_twd, ccy, sfx),
      address:     r.address || '',
      phone:       r.phone || '—',
      gallery:     r.gallery || [],
      intro:       r.intro || '',
      highlights:  r.highlights || [],
    };
  }

  function _sampleItems(catCode) {
    const name = _catNames[catCode] || catCode;
    return Array.from({ length: 4 }, (_, i) => ({
      id:          `${catCode}-sample-${i + 1}`,
      title:       `${name} 範例 ${i + 1}`,
      region:      '市中心',
      hours:       '10:00 – 22:00',
      desc:        `這是 ${name} 的示範條目，實際內容由業主提供`,
      list:        ['高品質服務', '地點便利', '適合各種預算'],
      rating:      4.5 + (i % 3) * 0.1,
      count:       320 + i * 180,
      rec:         i < 2,
      img:         'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png',
      priceTWD:    null,
      priceSuffix: '',
      price:       '請洽客服',
      address:     '市中心',
      phone:       '—',
      gallery:     [],
      intro:       '',
      highlights:  [],
    }));
  }

  // ═══════════════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════════════

  const DB = {

    // Sync references — always available immediately (good for first render)
    countries: _countries,
    catNames:  _catNames,

    // Connect to Supabase; call once from a page-level config script.
    init(url, key) { _sbUrl = url; _sbKey = key; },

    // ── Async API ──────────────────────────────────────────────────

    async getCountries() {
      const rows = await _sbFetch('countries', 'select=*,cities(*)&order=sort_order');
      if (rows && rows.length) { DB.countries = rows; return rows; }
      return _countries;
    },

    async findCity(cityCode) {
      const list = await DB.getCountries();
      for (const c of list) for (const ci of c.cities)
        if (ci.code === cityCode) return { country: c, city: ci };
      return { country: list[0], city: list[0].cities[0] };
    },

    // Sync version for immediate render (no Supabase fallback)
    getCategoriesSync(countryCode) {
      return _categories[countryCode] || _categories.vn;
    },

    async getCategories(countryCode) {
      const rows = await _sbFetch('categories', `country_code=eq.${countryCode}&order=sort_order&select=*`);
      if (rows && rows.length) return rows;
      return _categories[countryCode] || _categories.vn;
    },

    async getCatName(catCode) {
      return _catNames[catCode] || catCode;
    },

    async getItems(cityCode, catCode) {
      const rows = await _sbFetch('vendors', `city_code=eq.${cityCode}&cat_code=eq.${catCode}&is_active=eq.true&order=sort_order&select=*`);
      if (rows && rows.length) return rows.map(_mapVendor);
      return _vendors[`${cityCode}:${catCode}`] || _sampleItems(catCode);
    },

    async getItem(cityCode, catCode, ref) {
      const items = await DB.getItems(cityCode, catCode);
      if (ref == null) return items[0];
      return items.find(it => it.id === ref) || items[0];
    },

    async getServices() {
      const rows = await _sbFetch('services', 'order=sort_order&select=*');
      return (rows && rows.length) ? rows : _services;
    },

    async getSteps() {
      const rows = await _sbFetch('steps', 'order=sort_order&select=*');
      return (rows && rows.length) ? rows : _steps;
    },

    async getFaqs() {
      const rows = await _sbFetch('faqs', 'order=sort_order&select=*');
      return (rows && rows.length) ? rows : _faqs;
    },

    async getCurrencies() { return _currencies; },

    async getMarqueeItems() {
      const enabled = await _sbFetch('site_config', 'key=eq.marquee_enabled&select=value');
      if (enabled && enabled.length && enabled[0].value === 'false') return [];
      const rows = await _sbFetch('marquee_items', 'order=sort_order&select=*');
      if (rows && rows.length) return rows.map(r => r.text);
      return ['✦ 一站式觀光，從機場到飯店全程無憂 · 24H 中文客服在線 · 客製行程量身打造 · 越南｜日本｜泰國｜台灣 ✦'];
    },

    async getConfig(key) {
      const rows = await _sbFetch('site_config', `key=eq.${encodeURIComponent(key)}&select=value`);
      if (rows && rows.length) return rows[0].value;
      const _cfg = {
        marqueeText: '✦ 一站式觀光，從機場到飯店全程無憂 · 24H 中文客服在線 · 客製行程量身打造 · 越南｜日本｜泰國｜台灣 ✦',
        lineUrl: 'https://line.me/', whatsappUrl: 'https://wa.me/',
        phone: '0800-123-456', csImg: 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png',
      };
      return _cfg[key] ?? null;
    },

    // ── Currency utils (always sync) ──────────────────────────────

    currentCcy() {
      return _langCcy[localStorage.getItem('yy_lang') || 'tc'] || 'TWD';
    },

    formatPrice(twd, ccyCode, suffix) {
      if (twd == null) return '請洽客服';
      if (twd === 0)   return '免費';
      const c = _currencies[ccyCode] || _currencies.TWD;
      const v = Math.round(twd * c.rate / c.round) * c.round;
      return `${c.symbol}${v.toLocaleString('en-US')}${suffix || ''}`;
    },
  };

  // Auto-connect to Supabase
  DB.init(
    'https://ayadandlvszhnvnciofv.supabase.co',
    'sb_publishable_b6-9r7xQHwYADms1ZU4WuQ_uFe1q3-g'
  );

  window.DB = DB;

  // ── Backward compat: window.YY ──────────────────────────────────
  window.YY = {
    COUNTRIES:    _countries,
    CAT_NAMES:    _catNames,
    SAMPLE_ITEMS: _vendors,
    getItems(city, cat) {
      return _vendors[`${city}:${cat}`] || _sampleItems(cat);
    },
    getItem(city, cat, ref) {
      const items = this.getItems(city, cat);
      if (ref == null) return items[0];
      return items.find(it => it.id === ref) || items[0];
    },
    findCity(code) {
      for (const c of _countries) for (const ci of c.cities)
        if (ci.code === code) return { country: c, city: ci };
      return { country: _countries[0], city: _countries[0].cities[0] };
    },
    CURRENCIES:  _currencies,
    COUNTRY_CCY: { vn: 'VND', jp: 'JPY' },
    LANG_CCY:    _langCcy,
    currentCcy:  () => DB.currentCcy(),
    formatPrice: (t, c, s) => DB.formatPrice(t, c, s),
  };

})();
