-- 雲遊國際 · Supabase Schema
-- Run this in Supabase SQL Editor to create all tables.
-- After setup: call window.DB.init(SUPABASE_URL, PUBLISHABLE_KEY) on each page.

-- ── Countries ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS countries (
  code          TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  flag          TEXT,
  banner_img    TEXT,
  feature_title TEXT,
  feature_sub   TEXT,
  sort_order    INT  DEFAULT 0
);

-- ── Cities ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  code         TEXT PRIMARY KEY,
  country_code TEXT REFERENCES countries(code) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  name_en      TEXT,
  banner_img   TEXT,
  regions      JSONB DEFAULT '[]',
  sort_order   INT  DEFAULT 0
);

-- ── Categories (per country) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id           SERIAL PRIMARY KEY,
  country_code TEXT REFERENCES countries(code) ON DELETE CASCADE,
  code         TEXT NOT NULL,
  name         TEXT NOT NULL,
  name_en      TEXT,
  img          TEXT,
  size         TEXT DEFAULT 'normal',  -- 'normal' | 'tall' | 'feature'
  link         TEXT,                   -- custom URL; if set, card links here instead of vendor list
  sort_order   INT  DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_categories_country ON categories(country_code);

-- ── Vendors / Listings ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendors (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT         UNIQUE,
  city_code      TEXT         REFERENCES cities(code) ON DELETE CASCADE,
  cat_code       TEXT         NOT NULL,
  title          TEXT         NOT NULL,
  region         TEXT,
  hours          TEXT,
  description    TEXT,
  bullet_list    JSONB        DEFAULT '[]',   -- array of strings
  rating         NUMERIC(3,1) DEFAULT 4.5,
  review_count   INT          DEFAULT 0,
  is_recommended BOOLEAN      DEFAULT FALSE,
  img            TEXT,
  price_twd      INT,                         -- NULL = 請洽客服; 0 = 免費
  price_suffix   TEXT,                        -- e.g. ' / 人起'
  address        TEXT,
  phone          TEXT,
  gallery        JSONB        DEFAULT '[]',   -- array of image URLs
  intro          TEXT,
  highlights     JSONB        DEFAULT '[]',   -- array of {t, d}
  is_active      BOOLEAN      DEFAULT TRUE,
  sort_order     INT          DEFAULT 0,
  created_at     TIMESTAMPTZ  DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_city_cat ON vendors(city_code, cat_code);
CREATE INDEX IF NOT EXISTS idx_vendors_active   ON vendors(is_active);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_vendors_touch ON vendors;
CREATE TRIGGER trg_vendors_touch
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ── Services (homepage cards) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  tag         TEXT,
  title       TEXT NOT NULL,
  description TEXT,
  bg_img      TEXT,
  link        TEXT,
  sort_order  INT DEFAULT 0
);

-- ── How-it-works steps ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS steps (
  id         SERIAL PRIMARY KEY,
  num        TEXT,
  label      TEXT NOT NULL,
  sub        TEXT,
  sort_order INT DEFAULT 0
);

-- ── FAQs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id         SERIAL PRIMARY KEY,
  question   TEXT NOT NULL,
  answer     TEXT,
  sort_order INT DEFAULT 0
);

-- ── Currencies ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS currencies (
  code     TEXT PRIMARY KEY,
  symbol   TEXT,
  label    TEXT,
  rate     NUMERIC(10,4),
  round_to INT DEFAULT 1
);

-- ── Marquee items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marquee_items (
  id         SERIAL PRIMARY KEY,
  text       TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ── Site configuration ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- seed default site_config keys
INSERT INTO site_config (key, value) VALUES
  ('cs_line_id',       ''),
  ('cs_line_url',      ''),
  ('cs_whatsapp_url',  ''),
  ('marquee_enabled',  'true')
ON CONFLICT (key) DO NOTHING;

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE countries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE services      ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps         ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE currencies    ENABLE ROW LEVEL SECURITY;
ALTER TABLE marquee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config   ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read countries"      ON countries      FOR SELECT USING (TRUE);
CREATE POLICY "Public read cities"         ON cities         FOR SELECT USING (TRUE);
CREATE POLICY "Public read categories"     ON categories     FOR SELECT USING (TRUE);
CREATE POLICY "Public read vendors"        ON vendors        FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read services"       ON services       FOR SELECT USING (TRUE);
CREATE POLICY "Public read steps"          ON steps          FOR SELECT USING (TRUE);
CREATE POLICY "Public read faqs"           ON faqs           FOR SELECT USING (TRUE);
CREATE POLICY "Public read currencies"     ON currencies     FOR SELECT USING (TRUE);
CREATE POLICY "Public read marquee_items"  ON marquee_items  FOR SELECT USING (TRUE);
CREATE POLICY "Public read site_config"    ON site_config    FOR SELECT USING (TRUE);

-- Authenticated full access (admin panel)
CREATE POLICY "Auth write countries"      ON countries      FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write cities"         ON cities         FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write categories"     ON categories     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write vendors"        ON vendors        FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write services"       ON services       FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write steps"          ON steps          FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write faqs"           ON faqs           FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write currencies"     ON currencies     FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write marquee_items"  ON marquee_items  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_config"    ON site_config    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
