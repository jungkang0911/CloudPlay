-- 雲遊國際 · Seed Data
-- 對應 _db.js 內的本地資料，一次寫入所有初始內容
-- 執行前請確認 supabase-schema.sql 已部署完成

-- ── Countries ──────────────────────────────────────────────────────────────────
INSERT INTO countries (code, name, flag, banner_img, feature_title, feature_sub, sort_order) VALUES
  ('vn', '越南', '🇻🇳', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', '樂遊越南', '盡覽南越風華', 1),
  ('jp', '日本', '🇯🇵', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png', '樂遊日本', '四季詩篇之國', 2)
ON CONFLICT (code) DO NOTHING;

-- ── Cities ─────────────────────────────────────────────────────────────────────
INSERT INTO cities (code, country_code, name, name_en, banner_img, regions, sort_order) VALUES
  ('hcm', 'vn', '胡志明', 'Ho Chi Minh', 'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
   '["全部區域","第一郡","第三郡","第五郡","第七郡","富潤郡","平盛郡"]', 1),
  ('hni', 'vn', '河內',   'Ha Noi',      'uploads/banner-vietnam.png',
   '["全部區域","還劍郡","巴亭郡","西湖郡","東多郡"]', 2),
  ('dng', 'vn', '峴港',   'Da Nang',     'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
   '["全部區域","海珠郡","山茶半島","美溪海灘","會安老街"]', 3),
  ('tky', 'jp', '東京',   'Tokyo',       'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
   '["全部區域","新宿區","澀谷區","銀座中央區","六本木","池袋豐島"]', 1),
  ('kyt', 'jp', '京都',   'Kyoto',       'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
   '["全部區域","祇園東山","嵐山","伏見","北山金閣"]', 2),
  ('osk', 'jp', '大阪',   'Osaka',       'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png',
   '["全部區域","心齋橋","難波","梅田","天王寺"]', 3)
ON CONFLICT (code) DO NOTHING;

-- ── Categories ─────────────────────────────────────────────────────────────────
-- Vietnam
INSERT INTO categories (country_code, code, name, name_en, img, size, sort_order) VALUES
  ('vn', 'attractions', '景點介紹', 'Attractions',      'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', 'tall',    1),
  ('vn', 'feature',     '樂玩越南', 'Discover Vietnam', '',                                                    'feature', 2),
  ('vn', 'restaurants', '餐廳飯店', 'Dining',           'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 'normal',  3),
  ('vn', 'sauna',       '越式桑拿', 'Sauna',            'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 'normal',  4),
  ('vn', 'cafe',        '越式咖啡', 'Cafe',             'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'normal',  5),
  ('vn', 'salon',       '越式洗髮', 'Hair Salon',       'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 'normal',  6),
  ('vn', 'massage',     '越式按摩', 'Massage',          'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 'normal',  7),
  ('vn', 'bar',         '酒吧夜店', 'Bar & Club',       'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'normal',  8),
  ('vn', 'ktv',         'KTV 酒店', 'KTV',              'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png', 'normal',  9);

-- Japan
INSERT INTO categories (country_code, code, name, name_en, img, size, sort_order) VALUES
  ('jp', 'attractions', '景點介紹', 'Attractions',    'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png', 'tall',    1),
  ('jp', 'feature',     '樂玩日本', 'Discover Japan', '',                                                    'feature', 2),
  ('jp', 'restaurants', '餐廳飯店', 'Dining',         'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 'normal',  3),
  ('jp', 'onsen',       '日式溫泉', 'Onsen',          'uploads/ChatGPT Image 2026年5月1日 下午08_06_39.png', 'normal',  4),
  ('jp', 'cafe',        '日式咖啡', 'Cafe',           'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 'normal',  5),
  ('jp', 'salon',       '日式美容', 'Salon',          'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'normal',  6),
  ('jp', 'massage',     '日式按摩', 'Massage',        'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 'normal',  7),
  ('jp', 'izakaya',     '居酒屋',   'Izakaya',        'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 'normal',  8),
  ('jp', 'ktv',         'KTV 酒店', 'KTV',            'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 'normal',  9);

-- ── Vendors ────────────────────────────────────────────────────────────────────
-- hcm:attractions
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, gallery, intro, highlights, sort_order) VALUES
  ('cruise-dinner', 'hcm', 'attractions', '遊輪晚餐', '第一郡', '18:00 – 21:30',
   '推薦西貢河上 3 艘最著名的遊輪晚餐',
   '["西貢餐廳船（Nhà Hàng Tàu Sài Gòn）","邦昌遊輪（Bonsai Cruise）","印度支那遊輪（Indochina Junk）"]',
   4.8, 1280, TRUE,
   'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
   1200, ' / 人起',
   '西貢河 Bach Dang 碼頭', '+84 28 1234 5678',
   '["uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png","uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png","uploads/banner-vietnam.png"]',
   '在西貢河上享用浪漫的遊輪晚餐，是體驗胡志明市夜景最經典的方式。船上提供越式自助餐或精緻套餐，搭配現場樂團演奏，沿岸欣賞 Bitexco 金融塔、Landmark 81 等地標的燈火夜色。',
   '[{"t":"三大名船任選","d":"依預算與人數安排西貢餐廳船、邦昌遊輪或印度支那遊輪。"},{"t":"現場樂團演奏","d":"航程中有越式民謠或爵士樂團演出，氣氛浪漫。"},{"t":"無敵河岸夜景","d":"兩岸地標燈火、橫跨西貢河，是拍照打卡熱點。"},{"t":"中文導遊陪同","d":"全程協助點餐、拍照，溝通零障礙。"}]',
   1),

  ('landmark81', 'hcm', 'attractions', 'Landmark 81', '平盛郡', '09:30 – 22:00',
   'Landmark 81 體驗娛樂活動推薦',
   '["Landmark 81 Skyview","在 81 樓開放式視野下，盡覽全城新都市風光，是熱戀情侶夜遊絕佳之選"]',
   4.9, 2340, TRUE,
   'uploads/banner-vietnam.png',
   600, ' / 人起',
   '720A Điện Biên Phủ, 平盛郡', '+84 28 2345 6789',
   '["uploads/banner-vietnam.png","uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png","uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png"]',
   'Landmark 81 是越南第一高樓，81 樓的 Skyview 觀景台可 360 度俯瞰整座胡志明市。頂層另有空中酒吧與餐廳，是欣賞城市日落與夜景的首選。',
   '[{"t":"Skyview 觀景台","d":"81 樓 360 度玻璃觀景台，全城盡收眼底。"},{"t":"空中酒吧","d":"高空 Bar 享用調酒，氣氛絕佳。"},{"t":"購物中心","d":"樓下 Vincom 購物中心，國際精品齊全。"}]',
   2),

  ('homay', 'hcm', 'attractions', 'Hồ Mây Park', '頭頓灣', '08:00 – 21:00',
   '開放時間：',
   '["平日（週日～週四）：08:00 – 22:00","週末（週五～週六）及假期：08:00 – 24:00"]',
   4.6, 870, FALSE,
   'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
   450, ' / 人起',
   '頭頓市 Núi Lớn 山頂', '+84 254 123 456',
   '["uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png"]',
   'Hồ Mây Park 位於頭頓市山頂，搭乘纜車即可抵達，園區內有遊樂設施、動物園、山頂湖景與餐廳，適合親子同遊。',
   '[{"t":"空中纜車","d":"搭纜車上山，俯瞰頭頓海灣。"},{"t":"山頂樂園","d":"遊樂設施與動物園，適合全家。"}]',
   3),

  ('bui-vien', 'hcm', 'attractions', '范老五街夜市', '第一郡', '17:00 – 02:00',
   '胡志明最熱鬧的背包客一條街',
   '["街頭酒吧、現場音樂、街邊小吃","推薦：越式法國麵包、烤春卷、椰子咖啡"]',
   4.5, 3120, TRUE,
   'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png',
   0, '',
   'Bùi Viện, 第一郡', '—',
   '["uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png","uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png"]',
   '范老五街（Bùi Viện）是胡志明市最熱鬧的背包客街，入夜後整條街變身露天酒吧與派對場地，街頭小吃、現場音樂、霓虹燈光，是體驗西貢夜生活的必訪之地。',
   '[{"t":"露天酒吧","d":"整條街露天座位，啤酒調酒任選。"},{"t":"街頭美食","d":"越式法國麵包、烤春卷、椰子咖啡。"},{"t":"現場音樂","d":"街頭樂團與 DJ，熱鬧到凌晨。"}]',
   4),

  ('reunification', 'hcm', 'attractions', '統一宮（獨立宮）', '第一郡', '07:30 – 11:00　13:00 – 16:00',
   '越戰歷史的見證地，越南近代政治的核心場域',
   '["可參觀總統辦公室、會議廳、地下指揮所","建議停留時間 1.5 – 2 小時"]',
   4.4, 1640, FALSE,
   'uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png',
   70, ' / 人起',
   '135 Nam Kỳ Khởi Nghĩa, 第一郡', '+84 28 3822 3652',
   '["uploads/ChatGPT Image 2026年5月1日 下午08_06_22.png"]',
   '統一宮（前身為南越總統府）是越南近代史的重要見證地，1975 年坦克衝破鐵門象徵越戰結束。館內保留當年的總統辦公室、會議廳與地下指揮所。',
   '[{"t":"歷史建築","d":"完整保留 1960 年代的總統府原貌。"},{"t":"地下指揮所","d":"參觀戰時地下作戰指揮中心。"}]',
   5);

-- hcm:restaurants
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('reverie',   'hcm', 'restaurants', 'Reverie Saigon',  '第一郡', '24 小時',       '胡志明市超五星級酒店，西貢河景無敵', '["豪華景觀客房","頂樓 Skydeck 酒吧","米其林餐廳 Le Royal"]', 4.9, 980,  TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 8000, ' / 晚起', '22-36 Nguyễn Huệ, 第一郡',      '+84 28 3823 6688', 1),
  ('pho2000',   'hcm', 'restaurants', 'Pho 2000',         '第一郡', '06:00 – 22:00', '柯林頓總統用餐過的越南河粉名店',     '["特色牛肉河粉","法式越南三明治"]',                         4.6, 4520, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 120,  ' / 人起', '1-3 Phan Chu Trinh, 第一郡',   '+84 28 3822 2788', 2),
  ('caravelle', 'hcm', 'restaurants', 'Caravelle Hotel',  '第一郡', '24 小時',       '五星級飯店，鬧區步行可達',           '["Saigon Saigon Rooftop Bar","近市政劇院、歌劇院"]',        4.7, 1620, FALSE, 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 5500, ' / 晚起', '19-23 Lam Sơn Square, 第一郡', '+84 28 3823 4999', 3);

-- hcm:sauna
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('golden-lotus', 'hcm', 'sauna', 'Golden Lotus Spa', '第一郡', '10:00 – 24:00', '老字號越式三溫暖會館', '["乾蒸 / 濕蒸區","冷熱泉交替池","附贈茶點與夜宵"]',    4.7, 760, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 900,  ' / 人起', '15 Thái Văn Lung, 第一郡',        '+84 28 3823 0011', 1),
  ('rex-spa',      'hcm', 'sauna', 'Rex Spa',          '第三郡', '11:00 – 23:00', '法式裝潢，氛圍寧靜',       '["獨立 VIP 包廂","專業水療師全程服務"]',                4.5, 540, FALSE, 'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 1100, ' / 人起', '141 Nguyễn Đình Chiểu, 第三郡', '+84 28 3930 2222', 2);

-- hcm:cafe
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('workshop', 'hcm', 'cafe', 'The Workshop Coffee', '第一郡', '08:00 – 21:00', '胡志明最早的精品咖啡館之一', '["樓中樓挑高空間","單品手沖 / 越式滴漏"]',     4.7, 2230, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 150, ' / 人起', '27 Ngô Đức Kế, 第一郡', '+84 28 3824 6801', 1),
  ('cong',     'hcm', 'cafe', 'Cộng Cà Phê',          '第一郡', '07:00 – 23:30', '越南知名連鎖咖啡，軍綠復古風', '["必點：椰子冰沙咖啡","多家分店可選擇"]', 4.6, 5120, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 100, ' / 人起', '多家分店',            '—',                1);

-- hcm:salon
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('golden-hair', 'hcm', 'salon', '黃金髮藝會館', '第一郡', '10:00 – 23:00', '90 分鐘越式洗髮、頭肩頸按摩', '["獨立躺椅包廂","附耳燭 / 採耳體驗（選配）"]', 4.5, 410, TRUE, 'uploads/ChatGPT Image 2026年5月1日 下午08_04_35.png', 500, ' / 人起', '第一郡市中心', '+84 28 3821 7000', 1);

-- hcm:massage
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('lapothiquaire', 'hcm', 'massage', 'La Maison de L''Apothiquaire', '第三郡', '09:00 – 22:00', '法式別墅 SPA，奢華高端',   '["Signature 全身按摩 90 分鐘","純天然法系芳療精油"]', 4.9, 680,  TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 2400, ' / 人起', '64A Trương Định, 第三郡', '+84 28 3932 5181', 1),
  ('miumiu',        'hcm', 'massage', 'Miu Miu Spa',                  '第一郡', '10:00 – 23:30', '高評價平價按摩連鎖', '["全身越式按摩 60 分鐘","熱石療程加價選配"]',            4.6, 2840, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_00_14.png', 650,  ' / 人起', '多家分店',               '+84 28 3636 2020', 2);

-- hcm:bar
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('chill-skybar', 'hcm', 'bar', 'Chill Skybar',  '第一郡', '17:30 – 02:00', '胡志明最知名的天空酒吧之一', '["26 樓無遮蔽全景","需穿著得體","建議事先訂位"]', 4.7, 1980, TRUE,  'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 400, ' / 人起', 'AB Tower 26F, 第一郡',      '+84 93 882 2838',  1),
  ('lush',         'hcm', 'bar', 'Lush Saigon',  '第一郡', '21:00 – 03:00', '本地年輕人最愛 Club',         '["每週四 Ladies'' Night","EDM / Hip-hop"]',             4.4, 1430, FALSE, 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 300, ' 低消',    '2 Lý Tự Trọng, 第一郡', '+84 28 3824 2496', 2);

-- hcm:ktv
INSERT INTO vendors (slug, city_code, cat_code, title, region, hours, description, bullet_list, rating, review_count, is_recommended, img, price_twd, price_suffix, address, phone, sort_order) VALUES
  ('royal-ktv', 'hcm', 'ktv', 'Royal KTV', '第五郡', '14:00 – 03:00', '高端豪華 KTV，VIP 包廂', '["獨立衛浴與沙發","中文流行歌庫齊全","專屬服務生"]', 4.6, 320, TRUE, 'uploads/ChatGPT Image 2026年5月1日 下午08_06_32.png', 2000, ' / 包廂起', '第五郡', '+84 28 3855 9999', 1);

-- ── Services ───────────────────────────────────────────────────────────────────
INSERT INTO services (tag, title, description, bg_img, link, sort_order) VALUES
  ('Visa',          '代辦簽證', '正規簽證公司代辦，免手續費，護照一拍即可辦理，急件快速處理。',                              'uploads/svc-visa.png',          'service-page.html#visa',          1),
  ('Transfer',      '機場接送', '專人司機舉牌接送，往返機場與飯店，附贈當地網卡一張。',                                      'uploads/svc-transfer.png',      'service-page.html#transfer',      2),
  ('Charter',       '包車服務', '市內市外皆可安排包車，私人導遊隨行，靈活彈性調整行程。',                                    'uploads/svc-charter.png',       'service-page.html#charter',       3),
  ('Hotel',         '訂房服務', '代訂各星級飯店及酒店式公寓，量身搭配預算與需求。',                                          'uploads/svc-hotel.png',         'service-page.html#hotel',         4),
  ('Custom',        '客製行程', '根據偏好打造獨一無二的行程，深度體驗文化與美食。',                                          'uploads/svc-custom.png',        'service-page.html#custom',        5),
  ('Entertainment', '娛樂服務', 'Spa、桑拿、KTV、水療、泳池Villa、員工旅遊、生日Party一站式安排。', 'uploads/svc-entertainment.png', 'service-page.html#entertainment', 6)
ON CONFLICT DO NOTHING;

-- ── Steps ──────────────────────────────────────────────────────────────────────
INSERT INTO steps (num, label, sub, sort_order) VALUES
  ('01', '了解內容', '瀏覽分類與行程', 1),
  ('02', '選定日期', '決定出發時間',   2),
  ('03', '聯絡客服', 'LINE / WhatsApp', 3),
  ('04', '確認資訊', '填寫報名表單',   4),
  ('05', '夢想啟程', '開啟美好旅程',  5)
ON CONFLICT DO NOTHING;

-- ── FAQs ───────────────────────────────────────────────────────────────────────
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('一個人可以參加嗎？', '當然可以！我們會為您媒合想要一同出遊的旅伴，確定成團後建立專屬群組，出發前就能和其他成員互動認識。', 1),
  ('需要帶什麼幣別？',   '攜帶新台幣即可，抵達當地導遊會帶您至銀樓換匯，匯率比機場更好。最低預算每天 NT$10,000 起。',         2),
  ('團費大概多少？',     '最低滿 3 人成團，五天四夜每人約 NT$15,000 起，含 24H 專人服務。除團費外，當地消費均由商家出帳單後自行結帳，絕不灌水。', 3),
  ('如何開始預訂？',     '選定出團日期後聯絡客服，確認成團後填寫報名表單即可。只需帶護照、簽證、台幣、手機充電線，其餘我們都安排好了！', 4),
  ('可以代辦簽證嗎？',   '可以。我們配合正規簽證公司，免手續費，只需提供護照照片即可開始申辦，急件最快 3 個工作天。',           5)
ON CONFLICT DO NOTHING;

-- ── Currencies ─────────────────────────────────────────────────────────────────
INSERT INTO currencies (code, symbol, label, rate, round_to) VALUES
  ('TWD', 'NT$', '台幣',   1,     10),
  ('VND', '₫',   '越南盾', 800,   1000),
  ('JPY', '¥',   '日圓',   4.8,   100),
  ('USD', 'US$', '美元',   0.031, 1)
ON CONFLICT (code) DO NOTHING;

-- ── Marquee items ──────────────────────────────────────────────────────────────
INSERT INTO marquee_items (text, sort_order) VALUES
  ('✦ 一站式觀光，從機場到飯店全程無憂 · 24H 中文客服在線 · 客製行程量身打造 · 越南｜日本｜泰國｜台灣 ✦', 1)
ON CONFLICT DO NOTHING;

-- ── Site config ────────────────────────────────────────────────────────────────
INSERT INTO site_config (key, value) VALUES
  ('site_name',        '雲遊國際'),
  ('site_description', '以尊貴的眼光，探索世界每一個值得被記住的角落。'),
  ('cs_line_id',       '@yunyou_travel'),
  ('cs_line_url',      'https://line.me/'),
  ('cs_whatsapp_url',  'https://wa.me/'),
  ('marquee_enabled',  'true')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
