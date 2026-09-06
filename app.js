/* React من CDN */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ===== src/design/tokens.js ===== */
/* ============================ L1 — DESIGN TOKENS ============================ */
/* ============================ L1 — DESIGN TOKENS ==========================
   نظام ثيم كامل: System / Light / Dark
   كل لون متغيّر CSS، فتبديل الثيم يغيّر التطبيق كله بلا إعادة رسم.
   الوضع الفاتح مُصمَّم بذاته — ليس قلباً للغامق.
   ========================================================================== */

/* أسماء الرموز — تُستخدم في كل الشاشات ولا تتغيّر */
const C = {
  black: "var(--imgbg)", bg: "var(--bg)",
  card: "var(--s1)", card2: "var(--s2)", card3: "var(--s3)",
  gold: "var(--gold)", goldHi: "var(--goldHi)", goldLo: "var(--goldLo)",
  goldDim: "var(--goldDim)", goldFaint: "var(--goldFaint)",
  red: "var(--red)", redHi: "var(--redHi)", redFaint: "var(--redFaint)",
  green: "var(--green)", greenHi: "var(--greenHi)", greenFaint: "var(--greenFaint)",
  blue: "var(--blue)", purple: "var(--purple)",
  white: "var(--text)", ink2: "var(--text2)", ink3: "var(--text3)", ink4: "var(--text4)",
  line: "var(--line)",
  goldGrad: "var(--goldGrad)",
  /* حواف وخلفيات جاهزة — تُغني عن دمج الشفافية يدوياً */
  redEdge: "var(--redEdge)", greenEdge: "var(--greenEdge)", goldEdge: "var(--goldEdge)",
  shadow: "var(--shadow)", elev: "var(--elev)",
  onGold: "var(--onGold)", onGreen: "var(--onGreen)",
  hairline: "var(--hairline)", scrim: "var(--scrim)", scrimSolid: "var(--scrimSolid)",
};

/* لهجات دلالية للفئات والحالات — لكل لهجة أساس وحافة وخلفية خافتة */
const TONES = ["green", "gold", "orange", "red", "blue", "purple", "gray", "teal", "pink"];
const tone = (t) => ({ c: `var(--a-${t})`, ce: `var(--a-${t}-e)`, cf: `var(--a-${t}-f)` });

/* ---- لوحة الوضع الغامق: فحمي عميق متدرّج، لا أسود صرف ---- */
const DARK = {
  onGold: "#241800", onGreen: "#04140A",
  hairline: "rgba(255,255,255,.055)",
  scrim: "rgba(0,0,0,.72)", scrimSolid: "rgba(11,12,14,.95)",
  bg: "#0B0C0E", s1: "#141619", s2: "#1B1E23", s3: "#242830",
  imgbg: "#08090B",
  text: "#F3F5F8", text2: "#A9AEB8", text3: "#828A97", text4: "#707886",
  line: "rgba(255,255,255,.085)",
  gold: "#E3B457", goldHi: "#F6DE9C", goldLo: "#B07E23",
  goldDim: "rgba(227,180,87,.32)", goldFaint: "rgba(154,107,18,.09)",
  goldEdge: "rgba(227,180,87,.55)",
  red: "#E8493C", redHi: "#FF6E63", redFaint: "rgba(232,73,60,.12)",
  redEdge: "rgba(232,73,60,.45)",
  green: "#2ECC71", greenHi: "#6BEBA6", greenFaint: "rgba(46,204,113,.12)",
  greenEdge: "rgba(46,204,113,.42)",
  blue: "#4AA8E0", purple: "#A276E6",
  goldGrad: "linear-gradient(150deg,#F6DE9C 0%,#E3B457 45%,#B07E23 100%)",
  shadow: "0 2px 14px rgba(0,0,0,.55)",
  elev: "0 8px 30px rgba(0,0,0,.65)",
  a: { green: "#2ECC71", gold: "#E3B457", orange: "#E8913F", red: "#E8493C",
       blue: "#4AA8E0", purple: "#A276E6", gray: "#767C88", teal: "#35C6C0",
       pink: "#E06BA8" },
};

/* ---- لوحة الوضع الفاتح: مصمّمة بذاتها، تباين مضبوط على الأبيض ---- */
const LIGHT = {
  onGold: "#FFFFFF", onGreen: "#FFFFFF",
  hairline: "rgba(17,21,27,.06)",
  scrim: "rgba(17,21,27,.42)", scrimSolid: "rgba(246,247,249,.96)",
  bg: "#F6F7F9", s1: "#FFFFFF", s2: "#F0F2F5", s3: "#E5E8ED",
  imgbg: "#E9ECF1",
  text: "#11151B", text2: "#4A5261", text3: "#5F6875", text4: "#767E8B",
  line: "rgba(17,21,27,.10)",
  /* الذهبي يُغمَّق ليقرأ على الأبيض مع الحفاظ على الهوية */
  gold: "#9A6B12", goldHi: "#B98A20", goldLo: "#7A5310",
  goldDim: "rgba(154,107,18,.34)", goldFaint: "rgba(154,107,18,.09)",
  goldEdge: "rgba(154,107,18,.5)",
  red: "#C0271C", redHi: "#9E1D14", redFaint: "rgba(192,39,28,.08)",
  redEdge: "rgba(192,39,28,.38)",
  green: "#0E7A42", greenHi: "#0A5E33", greenFaint: "rgba(14,122,66,.09)",
  greenEdge: "rgba(14,122,66,.36)",
  blue: "#1B6FA8", purple: "#6B44B0",
  goldGrad: "linear-gradient(150deg,#D9AC55 0%,#B4831F 48%,#8A5F10 100%)",
  shadow: "0 1px 3px rgba(17,21,27,.08), 0 4px 14px rgba(17,21,27,.06)",
  elev: "0 10px 34px rgba(17,21,27,.14)",
  a: { green: "#0E7A42", gold: "#9A6B12", orange: "#B65B12", red: "#C0271C",
       blue: "#1B6FA8", purple: "#6B44B0", gray: "#5C6472", teal: "#0E7B76",
       pink: "#B03672" },
};

/* يبني نص متغيّرات CSS للوحة واحدة */
function themeVars(P) {
  const rows = [
    `--bg:${P.bg}`, `--s1:${P.s1}`, `--s2:${P.s2}`, `--s3:${P.s3}`, `--imgbg:${P.imgbg}`,
    `--text:${P.text}`, `--text2:${P.text2}`, `--text3:${P.text3}`, `--text4:${P.text4}`,
    `--line:${P.line}`,
    `--gold:${P.gold}`, `--goldHi:${P.goldHi}`, `--goldLo:${P.goldLo}`,
    `--goldDim:${P.goldDim}`, `--goldFaint:${P.goldFaint}`, `--goldEdge:${P.goldEdge}`,
    `--red:${P.red}`, `--redHi:${P.redHi}`, `--redFaint:${P.redFaint}`, `--redEdge:${P.redEdge}`,
    `--green:${P.green}`, `--greenHi:${P.greenHi}`, `--greenFaint:${P.greenFaint}`,
    `--greenEdge:${P.greenEdge}`,
    `--blue:${P.blue}`, `--purple:${P.purple}`,
    `--goldGrad:${P.goldGrad}`, `--shadow:${P.shadow}`, `--elev:${P.elev}`,
    `--onGold:${P.onGold}`, `--onGreen:${P.onGreen}`, `--hairline:${P.hairline}`,
    `--scrim:${P.scrim}`, `--scrimSolid:${P.scrimSolid}`,
  ];
  TONES.forEach((t) => {
    const h = P.a[t];
    rows.push(`--a-${t}:${h}`);
    rows.push(`--a-${t}-e:${hexA(h, 0.42)}`);
    rows.push(`--a-${t}-f:${hexA(h, 0.11)}`);
  });
  return rows.join(";");
}

/* hex → rgba بشفافية */
function hexA(h, a) {
  const x = String(h).replace("#", "");
  const r = parseInt(x.slice(0, 2), 16), g = parseInt(x.slice(2, 4), 16),
    b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const THEMES = { dark: DARK, light: LIGHT };

const RD = { sm: 12, md: 16, lg: 20, xl: 26, pill: 999 };
const SPACE = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 26 };
const FS = { cap: 9.5, xs: 10.5, sm: 12, md: 13.5, lg: 15, xl: 17, h3: 20, h2: 24, num: 22 };
const ICON = { sm: 14, md: 17, lg: 20, xl: 25 };

/* ---- عملات: كل عملة ودقتها العشرية (البند 30) ---- */
const CURRENCIES = {
  BHD: { code: "BHD", ar: "د.ب", en: "BHD", dp: 3 },
  KWD: { code: "KWD", ar: "د.ك", en: "KWD", dp: 3 },
  OMR: { code: "OMR", ar: "ر.ع", en: "OMR", dp: 3 },
  SAR: { code: "SAR", ar: "ر.س", en: "SAR", dp: 2 },
  AED: { code: "AED", ar: "د.إ", en: "AED", dp: 2 },
  QAR: { code: "QAR", ar: "ر.ق", en: "QAR", dp: 2 },
  USD: { code: "USD", ar: "$", en: "USD", dp: 2 },
  EUR: { code: "EUR", ar: "€", en: "EUR", dp: 2 },
};

/* ---- أدوات عامة ---- */
const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const uid = (p = "id") => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const nowISO = () => new Date().toISOString();
const todayISO = () => new Date().toISOString().slice(0, 10);
const buzz = (ms = 8) => {
  try { navigator.vibrate?.(ms); } catch {}
  try { Sfx.tap(); } catch {}
};
const daysBetween = (a, b) => {
  if (!a || !b) return 0;
  const t1 = new Date(a).getTime(), t2 = new Date(b).getTime();
  if (!Number.isFinite(t1) || !Number.isFinite(t2)) return 0;
  return Math.max(0, Math.round((t2 - t1) / 864e5));
};

/* تنسيق نقدي يحترم دقة العملة */
const money = (v, ccy = "BHD", opts = {}) => {
  const dp = CURRENCIES[ccy]?.dp ?? 2;
  const x = isFinite(v) ? v : 0;
  if (!opts.exact) return x.toLocaleString("en-US", { maximumFractionDigits: 0 });
  /* fixed: دقة العملة الكاملة دائماً (٣ منازل للدينار) */
  if (opts.fixed) return x.toLocaleString("en-US",
    { minimumFractionDigits: dp, maximumFractionDigits: dp });
  /* تنسيق ذكي: بلا كسور إن كان الرقم صحيحاً */
  const hasFraction = Math.abs(x - Math.round(x)) > 1e-9;
  return x.toLocaleString("en-US",
    { minimumFractionDigits: 0, maximumFractionDigits: hasFraction ? dp : 0 });
};
const f0 = (v) => (isFinite(v) ? v : 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
const signed = (v) => `${v >= 0 ? "+" : "−"}${f0(Math.abs(v))}`;
const pct = (v, d = 2) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(d)}%`;


/* ==================== L1c — THEME ENGINE =================================
   System / Light / Dark · الافتراضي System
   عند System يتبع prefers-color-scheme بمستمع حيّ — يتبدّل فوراً بلا إعادة تحميل.
   اختيار المستخدم يتغلّب ويُحفظ ضمن الإعدادات.
   ========================================================================== */
const THEME_MODES = ["system", "light", "dark"];

function systemPrefersDark() {
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches; }
  catch { return true; }
}

function useTheme(pref = "system") {
  const mode = THEME_MODES.includes(pref) ? pref : "system";
  const [sysDark, setSysDark] = useState(systemPrefersDark);

  useEffect(() => {
    let mq;
    try { mq = window.matchMedia("(prefers-color-scheme: dark)"); } catch { return; }
    const on = (e) => setSysDark(e.matches);
    /* addEventListener الحديث مع بديل للمتصفحات الأقدم */
    if (mq.addEventListener) mq.addEventListener("change", on);
    else if (mq.addListener) mq.addListener(on);
    setSysDark(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", on);
      else if (mq.removeListener) mq.removeListener(on);
    };
  }, []);

  const resolved = mode === "system" ? (sysDark ? "dark" : "light") : mode;
  const P = THEMES[resolved] || THEMES.dark;

  /* لون شريط المتصفح ونظام الألوان الأصلي */
  useEffect(() => {
    try {
      document.documentElement.style.colorScheme = resolved;
      let m = document.querySelector('meta[name="theme-color"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "theme-color");
        document.head.appendChild(m);
      }
      m.setAttribute("content", P.bg);
    } catch {}
  }, [resolved, P.bg]);

  return { mode, resolved, palette: P, vars: themeVars(P) };
}

/* ===== src/auth/users.js ===== */
/* ==================== L0b — نظام المستخدمين ====================
   المالك يضيف مستخدمين ويحذفهم ويغيّر كلمات مرورهم.
   المستخدمون محفوظون في هذا الجهاز فقط — لا خادم ولا رفع.
   ============================================================== */
const AUTH_KEY    = "hcd_users_v1";
const SESSION_KEY = "hcd_session_v1";

const OWNER = { u: "HAYDER", p: "295h", name: "حيدر", role: "owner" };

/* تجزئة بسيطة — تمنع قراءة كلمة المرور بالعين من التخزين */
function hashPw(p) {
  let h = 5381;
  for (let i = 0; i < String(p).length; i++) h = ((h << 5) + h + String(p).charCodeAt(i)) >>> 0;
  return "h" + h.toString(36);
}

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return [];
    const a = JSON.parse(raw);
    return Array.isArray(a) ? a : [];
  } catch { return []; }
}

function saveUsers(list) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(list)); return true; }
  catch { return false; }
}

/* يتحقق من المالك أولاً ثم من المستخدمين المضافين */
function authenticate(user, pass) {
  const u = String(user || "").trim().toUpperCase();
  const p = String(pass || "");
  if (u === OWNER.u && p === OWNER.p) {
    return { u: OWNER.u, name: OWNER.name, role: "owner" };
  }
  const found = loadUsers().find((x) => x.u === u && x.p === hashPw(p));
  return found ? { u: found.u, name: found.name, role: "user" } : null;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s2 = JSON.parse(raw);
    if (!s2 || !s2.u) return null;
    if (s2.u === OWNER.u) return { u: OWNER.u, name: OWNER.name, role: "owner" };
    const found = loadUsers().find((x) => x.u === s2.u);
    return found ? { u: found.u, name: found.name, role: "user" } : null;
  } catch { return null; }
}

const saveSession = (s2) => { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s2)); } catch {} };
const clearSession = () => { try { localStorage.removeItem(SESSION_KEY); } catch {} };

/* تحية حسب الساعة */
function greetOf(lang) {
  const h = new Date().getHours();
  if (lang === "ar") {
    if (h < 5)  return "مساء الخير";
    if (h < 12) return "صباح الخير";
    if (h < 17) return "مساء الخير";
    return "مساء الخير";
  }
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ===== src/data/assets.js ===== */
/* ---- الأصول المضمّنة (تنتقل لملفات assets عند نقل المشروع) ---- */
const LOGO_SRC = "data:image/webp;base64,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";
const IMG_CHARGER_2024 = "data:image/jpeg;base64,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";

/* ===== src/storage/store.js ===== */
/* ==================== L0 — STORAGE ADAPTER =================================
   طبقة تخزين واحدة تعمل في كل البيئات:
     ١) window.storage      ← معاينة Claude
     ٢) IndexedDB           ← WebView داخل iOS (بلا حد عملي، مناسب للصور)
     ٣) localStorage        ← احتياطي (~5MB)
     ٤) الذاكرة             ← آخر حل حتى لا ينهار التطبيق
   كل الدوال ترجع قيمة ولا ترمي استثناء. get لمفتاح غير موجود ترجع null.
   ========================================================================== */
const Store = (() => {
  const MEM = new Map();
  const DB_NAME = "hcardeal";
  const DB_STORE = "kv";
  let mode = "memory";
  let dbp = null;

  const hasHost = () => typeof window !== "undefined" && window.storage
    && typeof window.storage.get === "function";

  const openDB = () => {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
        };
        req.onsuccess = () => {
          const db = req.result;
          /* إن أُغلقت القاعدة من تبويب آخر نسمح بإعادة الفتح */
          db.onclose = () => { dbp = null; };
          db.onversionchange = () => { try { db.close(); } catch {} dbp = null; };
          res(db);
        };
        req.onerror = () => { dbp = null; rej(req.error); };
        req.onblocked = () => { dbp = null; rej(new Error("blocked")); };
      } catch (e) { dbp = null; rej(e); }
    });
    /* الوعد المرفوض لا يُخزَّن — وإلا تعطّل IndexedDB للأبد */
    dbp.catch(() => { dbp = null; });
    return dbp;
  };

  const idb = async (fn, rw = false, retried = false) => {
    let db;
    try { db = await openDB(); }
    catch (e) {
      if (retried) throw e;
      await new Promise((r) => setTimeout(r, 120));
      return idb(fn, rw, true);
    }
    return new Promise((res, rej) => {
      const tx = db.transaction(DB_STORE, rw ? "readwrite" : "readonly");
      const st = tx.objectStore(DB_STORE);
      const r = fn(st);
      tx.oncomplete = () => res(r?.result);
      tx.onerror = () => rej(tx.error);
      tx.onabort = () => rej(tx.error);
    });
  };

  const ls = () => { try { return window.localStorage; } catch { return null; } };

  /* يحدَّد مرة واحدة عند الإقلاع */
  async function init() {
    if (hasHost()) { mode = "host"; return mode; }
    try {
      if (typeof indexedDB !== "undefined") {
        await idb((st) => st.put("1", "__probe"), true);
        await idb((st) => st.get("__probe"));
        await idb((st) => st.delete("__probe"), true);
        mode = "idb"; return mode;
      }
    } catch {}
    try {
      const L = ls();
      if (L) { L.setItem("__probe", "1"); L.removeItem("__probe"); mode = "local"; return mode; }
    } catch {}
    mode = "memory";
    return mode;
  }

  return {
    init,
    get mode() { return mode; },

    async get(key) {
      try {
        if (mode === "host") {
          const r = await Store.get(key);
          return r && r.value !== undefined ? { key, value: r.value } : null;
        }
        if (mode === "idb") {
          const v = await idb((st) => st.get(key));
          return v === undefined ? null : { key, value: v };
        }
        if (mode === "local") {
          const v = ls()?.getItem(key);
          return v === null || v === undefined ? null : { key, value: v };
        }
        return MEM.has(key) ? { key, value: MEM.get(key) } : null;
      } catch { return null; }
    },

    /* ترجع كائناً عند النجاح و null عند الفشل */
    async set(key, value) {
      try {
        if (mode === "host") {
          const r = await Store.set(key, value);
          if (r === null) return null;
          MEM.set(key, value);
          return { key };
        }
        if (mode === "idb") { await idb((st) => st.put(value, key), true); MEM.set(key, value); return { key }; }
        if (mode === "local") { ls().setItem(key, value); MEM.set(key, value); return { key }; }
        MEM.set(key, value);
        return { key };
      } catch { return null; }
    },

    async delete(key) {
      try {
        if (mode === "host") await Store.delete(key);
        else if (mode === "idb") await idb((st) => st.delete(key), true);
        else if (mode === "local") ls().removeItem(key);
        MEM.delete(key);
        return true;
      } catch { return false; }
    },

    async list(prefix = "") {
      try {
        if (mode === "host") {
          const r = await Store.list(prefix);
          return { keys: (r?.keys || []).map((k) => (typeof k === "string" ? k : k?.key)) };
        }
        if (mode === "idb") {
          const all = await idb((st) => st.getAllKeys());
          return { keys: (all || []).filter((k) => String(k).startsWith(prefix)) };
        }
        if (mode === "local") {
          const L = ls(); const out = [];
          for (let i = 0; i < L.length; i++) {
            const k = L.key(i);
            if (k && k.startsWith(prefix)) out.push(k);
          }
          return { keys: out };
        }
        return { keys: [...MEM.keys()].filter((k) => k.startsWith(prefix)) };
      } catch { return { keys: [] }; }
    },
  };
})();

/* ===== src/sound/engine.js ===== */
/* ==================== L1b — SOUND ENGINE =================================
   أصوات مركّبة بـ Web Audio — بدون أي ملفات صوت.
   قصيرة وخافتة، تُبنى عند أول لمسة (شرط المتصفحات).
   ========================================================================== */
const Sfx = {
  ctx: null, on: true, master: null,

  init() {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    } catch { this.ctx = null; }
    if (this.ctx?.state === "suspended") { try { this.ctx.resume(); } catch {} }
    return this.ctx;
  },

  /* نغمة واحدة بمنحنى صعود/هبوط ناعم حتى لا يطقطق */
  tone({ f = 440, to, dur = 0.09, type = "sine", vol = 0.06, at = 0, cut }) {
    const ctx = this.init(); if (!ctx || !this.on) return;
    const t0 = ctx.currentTime + at;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    let node = osc;
    if (cut) {
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = cut;
      osc.connect(lp); node = lp;
    }
    node.connect(g); g.connect(this.master);
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  },

  /* ضجيج مُرشَّح — للسحب */
  noise({ dur = 0.16, vol = 0.035, from = 900, to = 2600 }) {
    const ctx = this.init(); if (!ctx || !this.on) return;
    const t0 = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(from, t0);
    bp.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp); bp.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + dur);
  },

  tap() { this.tone({ f: 1250, to: 820, dur: 0.045, type: "triangle", vol: 0.05, cut: 2600 }); },
  nav() { this.tone({ f: 560, to: 780, dur: 0.08, type: "sine", vol: 0.055 }); },
  toggle(on) {
    this.tone({ f: on ? 640 : 460, to: on ? 900 : 340, dur: 0.07, type: "triangle", vol: 0.055 });
  },
  success() {
    this.tone({ f: 660, dur: 0.1, type: "sine", vol: 0.06 });
    this.tone({ f: 880, dur: 0.13, type: "sine", vol: 0.055, at: 0.08 });
    this.tone({ f: 1320, dur: 0.16, type: "sine", vol: 0.035, at: 0.16 });
  },
  /* ---- تيربو ----
     الصوت الحقيقي أساسه هواء: ضجيج أبيض عبر مرشّح نطاقي عالي الحدّة
     يصعد تردده، فوقه نغمة توافقية خفيفة، وتحته هدير محرك نابض،
     وينتهي بتنفيس Blow-off مرتعش. */
  turbo() {
    const ctx = this.init(); if (!ctx || !this.on) return;
    if (ctx.state === "suspended") { try { ctx.resume(); } catch {} }
    const t0 = ctx.currentTime;
    const SPOOL = 1.15;

    /* مولّد ضجيج مشترك */
    const mkNoise = (dur, shape = 1) => {
      const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, shape);
      const src = ctx.createBufferSource(); src.buffer = buf; return src;
    };

    /* ١ — صفير الهواء: هذا هو التيربو */
    const air = mkNoise(SPOOL + 0.1, 0.15);
    const bp1 = ctx.createBiquadFilter();
    bp1.type = "bandpass"; bp1.Q.value = 16;
    bp1.frequency.setValueAtTime(700, t0);
    bp1.frequency.exponentialRampToValueAtTime(6400, t0 + SPOOL);
    const bp2 = ctx.createBiquadFilter();          // رنين ثانٍ يعطي سماكة
    bp2.type = "bandpass"; bp2.Q.value = 9;
    bp2.frequency.setValueAtTime(1400, t0);
    bp2.frequency.exponentialRampToValueAtTime(9200, t0 + SPOOL);
    const ga = ctx.createGain();
    ga.gain.setValueAtTime(0.0001, t0);
    ga.gain.exponentialRampToValueAtTime(0.16, t0 + SPOOL * 0.72);
    ga.gain.exponentialRampToValueAtTime(0.19, t0 + SPOOL);
    ga.gain.exponentialRampToValueAtTime(0.001, t0 + SPOOL + 0.06);
    air.connect(bp1); bp1.connect(bp2); bp2.connect(ga); ga.connect(this.master);
    air.start(t0); air.stop(t0 + SPOOL + 0.12);

    /* ٢ — نغمة توافقية خفيفة تعطي «الأزيز» */
    [1, 2].forEach((mult, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(820 * mult, t0);
      o.frequency.exponentialRampToValueAtTime(5200 * mult, t0 + SPOOL);
      const g = ctx.createGain();
      const peak = i === 0 ? 0.05 : 0.018;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + SPOOL * 0.8);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + SPOOL + 0.05);
      o.connect(g); g.connect(this.master);
      o.start(t0); o.stop(t0 + SPOOL + 0.1);
    });

    /* ٣ — هدير المحرك مع نبض الاشتعال */
    const eng = ctx.createOscillator();
    eng.type = "sawtooth";
    eng.frequency.setValueAtTime(52, t0);
    eng.frequency.exponentialRampToValueAtTime(128, t0 + SPOOL);
    const elp = ctx.createBiquadFilter();
    elp.type = "lowpass"; elp.frequency.value = 320;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, t0);
    eg.gain.exponentialRampToValueAtTime(0.085, t0 + 0.3);
    eg.gain.exponentialRampToValueAtTime(0.0001, t0 + SPOOL + 0.15);
    /* النبض */
    const lfo = ctx.createOscillator(); lfo.type = "square";
    lfo.frequency.setValueAtTime(22, t0);
    lfo.frequency.exponentialRampToValueAtTime(60, t0 + SPOOL);
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.03;
    lfo.connect(lfoG); lfoG.connect(eg.gain);
    eng.connect(elp); elp.connect(eg); eg.connect(this.master);
    eng.start(t0); eng.stop(t0 + SPOOL + 0.2);
    lfo.start(t0); lfo.stop(t0 + SPOOL + 0.2);

    /* ٤ — التنفيس Blow-off: انفجار هواء مرتعش */
    const bt = t0 + SPOOL + 0.02, bDur = 0.5;
    const bov = mkNoise(bDur, 1.5);
    const bhp = ctx.createBiquadFilter();
    bhp.type = "highpass"; bhp.frequency.value = 1500;
    const bbp = ctx.createBiquadFilter();
    bbp.type = "bandpass"; bbp.Q.value = 1.4;
    bbp.frequency.setValueAtTime(7000, bt);
    bbp.frequency.exponentialRampToValueAtTime(900, bt + bDur);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, bt);
    bg.gain.exponentialRampToValueAtTime(0.38, bt + 0.006);
    bg.gain.exponentialRampToValueAtTime(0.0001, bt + bDur);
    /* الرفرفة المميزة */
    const flut = ctx.createOscillator(); flut.type = "sine";
    flut.frequency.setValueAtTime(46, bt);
    flut.frequency.exponentialRampToValueAtTime(16, bt + bDur);
    const flutG = ctx.createGain(); flutG.gain.value = 0.09;
    flut.connect(flutG); flutG.connect(bg.gain);
    bov.connect(bhp); bhp.connect(bbp); bbp.connect(bg); bg.connect(this.master);
    bov.start(bt); bov.stop(bt + bDur);
    flut.start(bt); flut.stop(bt + bDur);
  },

  /* ---- قزوز: فتح قارورة غاز ----
     نفخة ضغط حادة، ثم هسيس يخفت، ثم فقاعات عشوائية. */
  fizz() {
    const ctx = this.init(); if (!ctx || !this.on) return;
    if (ctx.state === "suspended") { try { ctx.resume(); } catch {} }
    const t0 = ctx.currentTime;

    const mkNoise = (dur, shape = 1) => {
      const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, shape);
      const src = ctx.createBufferSource(); src.buffer = buf; return src;
    };

    /* ١ — الطقة: كسر الضغط */
    const pop = ctx.createOscillator();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(720, t0);
    pop.frequency.exponentialRampToValueAtTime(160, t0 + 0.05);
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0.11, t0);
    pg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
    pop.connect(pg); pg.connect(this.master);
    pop.start(t0); pop.stop(t0 + 0.09);

    /* ٢ — الهسيس: pssssst */
    const hiss = mkNoise(0.75, 1.9);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 1800;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(6800, t0 + 0.01);
    bp.frequency.exponentialRampToValueAtTime(2200, t0 + 0.7);
    const hg = ctx.createGain();
    hg.gain.setValueAtTime(0.0001, t0);
    hg.gain.exponentialRampToValueAtTime(0.26, t0 + 0.012);
    hg.gain.exponentialRampToValueAtTime(0.05, t0 + 0.3);
    hg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.75);
    hiss.connect(hp); hp.connect(bp); bp.connect(hg); hg.connect(this.master);
    hiss.start(t0); hiss.stop(t0 + 0.78);

    /* ٣ — الفقاعات */
    for (let i = 0; i < 26; i++) {
      const at = 0.06 + Math.random() * 0.8;
      const f = 240 + Math.random() * 900;
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(f, t0 + at);
      o.frequency.exponentialRampToValueAtTime(f * 1.9, t0 + at + 0.035);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(0.03 + Math.random() * 0.02, t0 + at + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 0.045);
      o.connect(g); g.connect(this.master);
      o.start(t0 + at); o.stop(t0 + at + 0.06);
    }
  },

  /* ---- فلوس: درج الكاشير ثم رنين عملات معدنية ---- */
  money() {
    const ctx = this.init(); if (!ctx || !this.on) return;
    const t0 = ctx.currentTime;

    /* ضربة الدرج */
    const thud = ctx.createOscillator();
    thud.type = "sine";
    thud.frequency.setValueAtTime(150, t0);
    thud.frequency.exponentialRampToValueAtTime(58, t0 + 0.13);
    const gt = ctx.createGain();
    gt.gain.setValueAtTime(0.09, t0);
    gt.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15);
    thud.connect(gt); gt.connect(this.master);
    thud.start(t0); thud.stop(t0 + 0.17);

    /* رشّة معدنية قصيرة */
    const nlen = Math.floor(ctx.sampleRate * 0.3);
    const nbuf = ctx.createBuffer(1, nlen, ctx.sampleRate);
    const nd = nbuf.getChannelData(0);
    for (let i = 0; i < nlen; i++) nd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nlen, 2.4);
    const nsrc = ctx.createBufferSource(); nsrc.buffer = nbuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 2600;
    const gnn = ctx.createGain(); gnn.gain.value = 0.05;
    nsrc.connect(hp); hp.connect(gnn); gnn.connect(this.master);
    nsrc.start(t0 + 0.03); nsrc.stop(t0 + 0.33);

    /* عملات تتخبّط — نغمات معدنية بترددات غير منتظمة */
    const coins = [
      [2650, 0.05], [3480, 0.10], [2180, 0.15], [4120, 0.19],
      [2960, 0.24], [3720, 0.29], [2420, 0.34], [3160, 0.40],
    ];
    coins.forEach(([f, at], i) => {
      const jitter = f * (0.94 + Math.random() * 0.12);
      const o = ctx.createOscillator();
      o.type = i % 2 ? "triangle" : "square";
      o.frequency.setValueAtTime(jitter, t0 + at);
      o.frequency.exponentialRampToValueAtTime(jitter * 0.82, t0 + at + 0.16);
      const bpf = ctx.createBiquadFilter();
      bpf.type = "bandpass"; bpf.Q.value = 9; bpf.frequency.value = jitter;
      const g = ctx.createGain();
      const v = 0.05 - i * 0.004;
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(Math.max(0.012, v), t0 + at + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + 0.18);
      o.connect(bpf); bpf.connect(g); g.connect(this.master);
      o.start(t0 + at); o.stop(t0 + at + 0.2);
    });
  },

  cash() { this.money(); },
  error() {
    this.tone({ f: 220, to: 150, dur: 0.16, type: "sawtooth", vol: 0.05, cut: 800 });
  },
  warn() { this.tone({ f: 420, to: 360, dur: 0.12, type: "triangle", vol: 0.05, cut: 1400 }); },
  swipe() { this.noise({ dur: 0.14, vol: 0.03 }); },
  boot() {
    this.tone({ f: 300, to: 720, dur: 0.35, type: "sine", vol: 0.05 });
    this.tone({ f: 900, dur: 0.3, type: "sine", vol: 0.03, at: 0.2 });
  },
};

/* ===== src/i18n/strings.js ===== */
/* ============================ L2 — i18n / STRINGS ============================
   كل نص في التطبيق يمر من هنا. لا نصوص مكتوبة داخل الشاشات.
   ========================================================================== */
const STRINGS = {
  ar: {
    welcomeIn: "مرحبًا بك في", start: "ابدأ",
    tagline: "احسب تكلفة وربح كل صفقة سيارة بثقة واحترافية",
    footNote: "حسابات دقيقة • قرارات ذكية • أرباح أكبر",
    purchasePrice: "سعر الشراء", totalExp: "إجمالي المصاريف", totalCost: "إجمالي التكلفة",
    sellPrice: "سعر البيع", netProfit: "صافي الربح", roi: "العائد على الاستثمار",
    roiShort: "ROI", margin: "هامش الربح",
    yourDeal: "صفقتك الحالية", currentSell: "سعر البيع الحالي", showAll: "عرض كل التفاصيل",
    profitTarget: "هدف الربح", targetProfit: "الربح المستهدف", requiredPrice: "السعر المطلوب للهدف",
    breakEven: "نقطة التعادل", currentPrice: "السعر الحالي", targetPrice: "سعر الهدف",
    remainToTarget: "المتبقي للوصول للهدف", reachedTarget: "تجاوزت الهدف بـ",
    strategy: "استراتيجية البيع", quickSale: "بيع سريع", profitWord: "الربح",
    fullCompare: "عرض مقارنة كاملة", bePrice: "سعر نقطة التعادل",
    aboveIs: "أي سعر بيع أعلى من", isProfit: "هو ربح لك.",
    belowIs: "وأي سعر بيع أقل من", isLoss: "هو خسارة.",
    quickCalc: "حاسبة الربح السريع", enterPrice: "أدخل سعر البيع",
    navHome: "الرئيسية", navGarage: "الكراج", navAdd: "إضافة صفقة",
    navAnalytics: "التحليلات", navSettings: "الإعدادات",
    garage: "الكراج", garageSub: "إدارة ومتابعة جميع سياراتك",
    totalInvest: "إجمالي الاستثمار", realizedProfit: "الأرباح المحققة",
    expectedProfit: "الأرباح المتوقعة",
    activeCars: "السيارات النشطة", soldCars: "السيارات المباعة", carUnit: "سيارة",
    showDetails: "عرض التفاصيل", addCar: "أضف سيارة",
    addCarSub: "قم بإضافة سيارة جديدة إلى كراجك", addCarTitle: "إضافة سيارة",
    addPhotos: "إضافة صور", addPhotosSub: "أضف صور السيارة من الأمام، الخلف، الجانبين",
    photoLimits: "الحد الأدنى 3 صور • الحد الأقصى 10 صور",
    brand: "العلامة التجارية", model: "الموديل", year: "سنة الصنع", trim: "الفئة / النسخة",
    mileage: "المسافة المقطوعة (كم)", vin: "رقم الهيكل (VIN)", color: "اللون",
    purchaseDate: "تاريخ الشراء", purchaseSource: "مصدر الشراء",
    saveCar: "حفظ السيارة", cancel: "إلغاء", save: "حفظ", del: "حذف", edit: "تعديل",
    costsTitle: "تكاليف السيارة", expList: "قائمة المصاريف", expCount: "مصروفات",
    addExpense: "إضافة مصروف", pasteExpenses: "لصق المصاريف من الملاحظات", paidLabel: "مدفوع", dueLabel: "باقي",
    sellTitle: "البيع والتسعير", sellSub: "حدد أفضل سعر بيع لتحقيق أقصى ربح",
    suggestPrice: "سعر البيع المقترح", recommendations: "توصيات التسعير",
    currentTag: "الحالي", targetTag: "السعر المستهدف", quickTag: "سعر البيع السريع",
    diffTarget: "الفرق عن الهدف", profitAnalysis: "تحليل الربح",
    lossZone: "منطقة الخسارة", profitZone: "منطقة الربح",
    analytics: "التحليلات", period: "تصفية الفترة",
    carsBought: "السيارات المشتراة", totalSales: "إجمالي المبيعات", totalProfit: "إجمالي الربح",
    avgProfit: "متوسط الربح", avgRoi: "متوسط العائد", avgDays: "متوسط أيام البيع",
    bestDeal: "أفضل صفقة", worstDeal: "أضعف صفقة", topBrand: "الأكثر ربحاً",
    totalWord: "إجمالي", nowWord: "حاليا", avgWord: "متوسط", dayUnit: "يوم",
    monthlyProfit: "الربح الشهري", roiTrend: "اتجاه العائد على الاستثمار (ROI)",
    dealDist: "توزيع الصفقات", dealUnit: "صفقة", cancelledLbl: "ملغاة",
    settings: "الإعدادات", language: "اللغة", currency: "العملة",
    appearance: "المظهر", dark: "داكن", defaultTarget: "هدف الربح الافتراضي",
    quickSalePct: "نسبة البيع السريع", notifications: "الإشعارات", enabled: "مفعلة",
    backup: "نسخ احتياطي للبيانات", exportData: "تصدير البيانات",
    importLib: "استيراد مكتبة سيارات", about: "عن H CAR DEAL",
    calcTests: "فحص الحسابات", signOut: "مسح البيانات", premium: "Premium Member",
    desc: "الوصف", amount: "المبلغ", date: "التاريخ", category: "الفئة",
    supplier: "الورشة / المورد", notes: "ملاحظات", receipt: "صورة الفاتورة",
    customCat: "فئة جديدة",
    details: "تفاصيل السيارة", timeline: "سجل الصفقة", vehicleInfo: "بيانات السيارة",
    markSold: "تسجيل البيع", soldPrice: "سعر البيع النهائي", soldDate: "تاريخ البيع",
    buyerName: "اسم المشتري", buyerPhone: "هاتف المشتري", daysHeld: "أيام الاحتفاظ",
    deleteDeal: "حذف الصفقة", editVehicle: "تعديل بيانات السيارة",
    search: "اكتب عربي أو إنجليزي — مثال: جي إم سي سييرا", recent: "المستخدمة مؤخراً",
    favorites: "المفضلة", chooseModel: "اختر موديل السيارة", specs: "المواصفات",
    filters: "تصفية", sort: "ترتيب",
    sortNewest: "الأحدث", sortOldest: "الأقدم", sortProfitHi: "الأعلى ربحاً",
    sortProfitLo: "الأقل ربحاً", sortInvestHi: "الأعلى استثماراً",
    sortInvestLo: "الأقل استثماراً", sortMake: "الوكالة", sortStatus: "الحالة",
    sortYear: "السنة",
    all: "الكل",
    emptyCars: "لا توجد سيارات في الكراج", emptyExp: "لا توجد مصاريف بعد",
    emptySold: "لم يتم بيع أي سيارة حتى الآن", emptyResults: "ما فيه نتائج",
    emptyAnalytics: "لا توجد بيانات كافية حتى الآن",
    confirmTitle: "تأكيد", confirmDeleteCar: "حذف هذه الصفقة؟ تقدر تسترجعها من سلة المحذوفات.",
    confirmDeleteExp: "حذف هذا المصروف؟", confirmReset: "مسح كل البيانات والرجوع للبيانات الأصلية؟",
    yes: "نعم", no: "لا", undo: "تراجع", undone: "تم الاسترجاع",
    errSave: "تعذر حفظ البيانات، حاول مرة أخرى.",
    errPhotos: "الصور كبيرة على مساحة التخزين. احذف صورة أو اثنتين.",
    errPhotoRead: "تعذّر قراءة صورة. جرّب صيغة JPG أو PNG.",
    storageCheck: "فحص التخزين", running: "يفحص…",
    stWrite: "كتابة سجل صغير", stRead: "قراءة", stList: "قائمة المفاتيح",
    stBig: "كتابة صورة (100 كيلوبايت)", stDelete: "حذف",
    stOk: "يعمل", stFail: "فشل", stAll: "التخزين يعمل بشكل كامل",
    stNone: "التخزين غير متاح على هذا الجهاز — بياناتك في الذاكرة فقط. صدّر نسخة احتياطية.",
    copyBackup: "انسخ نسخة احتياطية", pasteBackup: "استرجع من نسخة",
    backupCopied: "تم النسخ", backupRestored: "تم الاسترجاع", backupBad: "النص غير صالح",
    retry: "أعد المحاولة", savedOk: "تم الحفظ", typeReset: "اكتب RESET للتأكيد",
    exportBackup: "تصدير نسخة احتياطية", importBackup: "استيراد نسخة احتياطية",
    backupCenter: "مركز البيانات والنسخ", backupCenterSub: "نسخة كاملة قابلة للاستعادة",
    lastBackup: "آخر نسخة", neverBackedUp: "ما أخذت نسخة بعد",
    backupSize: "الحجم", backupSchema: "إصدار النسخة", backupDate: "التاريخ",
    exportFull: "تصدير نسخة كاملة", importRestore: "استيراد / استعادة",
    verifyBackup: "فحص ملف نسخة", restoreAuto: "استرجاع النسخة التلقائية",
    autoBackupNote: "تُؤخذ نسخة تلقائية قبل أي استعادة",
    verifying: "يفحص الملف…", fileValid: "الملف سليم", fileInvalid: "الملف غير صالح",
    errBadJson: "الملف ليس JSON صالحاً", errNotApp: "الملف لا يخص H CAR DEAL",
    errCorrupt: "الملف تالف أو ناقص",
    confirmRestore: "الاستعادة تستبدل كل بياناتك الحالية. أخذنا نسخة تلقائية قبلها. تكمل؟",
    restored: "تمت الاستعادة", restoreReport: "تقرير الاستعادة",
    cDeals: "صفقات", cActive: "نشطة", cModels: "موديلات", cPhotos: "صور",
    cExpenses: "مصاريف", cReceipts: "فواتير", cLeads: "مشترون", cEvents: "أحداث",
    cLibrary: "صور المكتبة", cLogos: "شعارات", cReserve: "حركات احتياطي",
    fromSchema: "من إصدار", schemaCurrent: "الإصدار الحالي",
    installApp: "أضف إلى الشاشة الرئيسية", installHint:
      "افتح قائمة المشاركة في المتصفح ثم اختر «إضافة إلى الشاشة الرئيسية».",
    capital: "رأس المال والسيولة", capitalSub: "نقدك ورأس مالك وحقوق ملكيتك",
    openLedger: "افتح الدفتر", openingCash: "النقد الموجود معك الآن",
    openingDate: "تاريخ الافتتاح", openingNote:
      "الصفقات المؤرَّخة قبل هذا التاريخ لا تُنشأ لها حركات نقدية — تُدرَج ضمن المركز الافتتاحي.",
    openingPosition: "المركز الافتتاحي", openingEquity: "حقوق الملكية الافتتاحية",
    availableCash: "النقد المتاح", spendableCash: "القابل للصرف",
    capitalContributed: "رأس المال المُدخل", ownerDraws: "المسحوبات",
    netCapital: "صافي رأس المال", ownerEquity: "حقوق الملكية",
    inventoryCost: "تكلفة المخزون", cashInInventory: "النقد المحتجز",
    payables: "ذمم دائنة", askingValue: "قيمة الطلب",
    potentialProfit: "ربح محتمل", inventoryCount: "سيارات بالمخزون",
    realizedAcc: "الربح المحقق المحاسبي",
    profitInCash: "الربح المسترد نقداً",
    capitalToRecover: "المتبقي من رأس المال",
    capitalRecovered: "رأس مال مسترد نقداً", receivables: "ذمم مدينة",
    cashCollected: "المقبوض", unrealized: "ربح غير محقق",
    bizExpenses: "مصاريف النشاط", netBizProfit: "صافي ربح النشاط",
    ledger: "دفتر الحركات", noEntries: "ما فيه حركات",
    addCapital: "ضخ رأس مال", drawCapital: "سحب", addBiz: "مصروف نشاط",
    autoEntry: "تلقائي", manualEntry: "يدوي",
    balanced: "الحسابات متوازنة", unbalanced: "فرق في التوازن",
    invariantNote: "حقوق الملكية = الافتتاحية + صافي رأس المال + الربح المحقق + دخل المصادرة − مصاريف النشاط",
    atAGlance: "نظرة سريعة", moneyIn: "الداخل", moneyOut: "الخارج",
    costLabel: "التكلفة", profitLabel: "الربح", quickActions: "اختصارات",
    theme: "المظهر", themeSystem: "حسب النظام", themeLight: "فاتح", themeDark: "غامق",
    themeNote: "«حسب النظام» يتبع إعداد جهازك ويتبدّل معه فوراً، حتى لو بدّل تلقائياً حسب الوقت.",
    themeNow: "الوضع الحالي",
    compare: "مقارنة السيارات", compareSub: "أي سيارة كانت أفضل صفقة",
    selectCars: "اختر السيارات", noSelection: "اختر سيارتين على الأقل",
    portfolio: "ملخّص النشاط", carsPurchased: "سيارات اشتريتها",
    currentInventory: "بالمخزون الآن", carsSold: "سيارات بعتها",
    spentOnVehicles: "صرفته على السيارات", totalSalesAmt: "إجمالي المبيعات",
    avgProfitPer: "متوسط ربح السيارة",
    avgHolding: "متوسط مدة الاحتفاظ",
    mostExpensive: "أغلى سيارة", highestExpenses: "أكثر سيارة مصاريف",
    avgDaily: "ربح يومي وسطي", expectedOnly: "متوقع",
    globalExpenses: "مصاريفي عبر كل السيارات", acrossCars: "سيارة",
    largestCat: "أكبر فئة", largestCatPct: "نسبتها",
    importCalc: "حاسبة الاستيراد", importSub: "احسب تكلفة السيارة حتى البحرين",
    country: "بلد الشراء", exchangeRate: "سعر الصرف", buyCurrency: "عملة الشراء",
    purchaseCostBHD: "ثمن السيارة بالدينار", importCosts: "تكاليف الاستيراد",
    landedCost: "التكلفة حتى البحرين", expectedRepairs: "الإصلاح المتوقع",
    newImport: "حساب استيراد جديد", noImports: "ما فيه حسابات",
    rateNote: "سعر الصرف يُدخل يدوياً — لا يوجد تحديث تلقائي",
    convertImportNote: "سيُنشئ صفقة بثمن السيارة، وكل بند استيراد يصير مصروفاً غير مدفوع، والإصلاح المتوقع مصروفاً مخططاً.",
    aging: "مدة البقاء", agingSettings: "حدود مدة البقاء",
    daysIn: "يوم في المخزون", sinceListed: "منذ العرض", holdingDays: "مدة الاحتفاظ",
    agingFresh: "جديدة حتى", agingNormal: "عادية حتى", agingOld: "متقادمة حتى",
    adGen: "مولّد الإعلان", adMode: "نمط الإعلان", adLang: "لغة الإعلان",
    copyAd: "انسخ الإعلان", adCopied: "تم نسخ الإعلان",
    adNote: "الإعلان يُبنى من بياناتك المسجّلة فقط. الحقل الفارغ لا يظهر.",
    interiorColor: "اللون الداخلي", featuresLabel: "المواصفات المهمة",
    myLocation: "الموقع", myContact: "رقم التواصل",
    cImports: "حسابات استيراد",
    partsCost: "تكلفة القطع", laborCost: "أجرة اليد", itemName: "القطعة / البند",
    workshop: "الورشة", odoAt: "عداد السيارة",
    expStatus: "حالة العمل", expTotal: "إجمالي المصروف",
    autoTotal: "يُحسب تلقائياً: قطع + أجرة",
    plannedNote: "المخطط لا يدخل التكلفة حتى يصير منفَّذاً",
    plannedTotal: "مصاريف مخططة",
    breakdown: "أين ذهبت المصاريف", topCategory: "أكبر فئة",
    noBreakdown: "ما فيه مصاريف بعد", ofExpenses: "من إجمالي المصاريف",
    partsVsLabor: "قطع مقابل أجرة", extraPhotos: "صور إضافية",
    priceHistory: "سجل الأسعار", originalAsking: "السعر الأصلي",
    currentAsking: "السعر الحالي", lowestAsking: "أدنى سعر",
    priceChanges: "مرات التغيير", heldFor: "بقي", changeReason: "سبب التغيير",
    noPriceChanges: "ما تغيّر السعر بعد",
    minAcceptable: "أقل سعر مقبول", minAcceptableNote: "رقم داخلي — لا يظهر في الإعلان",
    ifSoldAt: "لو بعتها بهذا السعر",
    offers: "العروض", addOffer: "سجّل عرضاً", offerAmount: "قيمة العرض",
    firstOffer: "أول عرض", lastOffer: "آخر عرض", highestOffer: "أعلى عرض",
    quotedPrice: "السعر اللي عرضته عليه", minTold: "أقل سعر أخبرته به",
    lastContact: "آخر تواصل", highestActive: "أعلى عرض قائم",
    vsAsking: "الفرق عن سعرك", vsMin: "الفرق عن أقل سعر",
    noOffers: "ما فيه عروض",
    deposit: "العربون", deposits: "العرابين", addDeposit: "سجّل عربون",
    refundable: "مسترد", nonRefundable: "غير مسترد",
    depHeld: "محتجز", depApplied: "احتُسب في البيع", depRefunded: "أُرجع",
    depForfeited: "مُصادَر", forfeitDeposit: "صادر العربون",
    depositLiability: "التزام العرابين", forfeitedIncome: "دخل عرابين مصادَرة",
    forfeitNote: "المصادرة تنقل المبلغ من التزام إلى دخل مستقل. النقد لا يتغيّر، ولا تتأثر تكلفة السيارة ولا ربحها.",
    refundDeposit: "أرجع العربون", noDeposits: "ما فيه عرابين",
    depositNote: "العربون يزيد النقد ولا يجعل السيارة مباعة، ولا يُحسب مرتين عند الإغلاق.",
    closeSale: "إتمام البيع", closingReview: "مراجعة أخيرة",
    depositReceived: "العربون المستلم", receivedAtClosing: "المستلم عند الإغلاق",
    totalCollected: "إجمالي المقبوض", outstandingPayables: "ذمم السيارة المستحقة",
    paymentMethod: "طريقة الدفع", confirmSale: "أكّد البيع",
    soldArchive: "أرشيف المبيعات", daysInInventory: "أيام في المخزون",
    finalBuyer: "المشتري النهائي", saleDetails: "تفاصيل البيع",
    cOffers: "عروض", cDeposits: "عرابين", cPrices: "تغييرات سعر",
    inspection: "الفحص قبل الشراء", inspectionSub: "قيّم السيارة قبل ما تشتري",
    inspList: "التقييمات", newInspection: "تقييم جديد", noInspections: "ما فيه تقييمات",
    vehicleInfo2: "بيانات السيارة", origin: "المصدر", gcc: "خليجي", imported: "مستورد",
    askingPrice2: "السعر المطلوب", sellerFinal: "آخر سعر من البائع",
    expectedSelling: "سعر البيع المتوقع", expectedDays: "أيام البيع المتوقعة",
    checklist: "قائمة الفحص", repairCost: "تكلفة الإصلاح",
    otherCosts: "تكاليف اقتناء أخرى", estRepairs: "إجمالي الإصلاحات",
    totalInvestment2: "إجمالي الاستثمار المتوقع", expectedProfit2: "الربح المتوقع",
    maxBuyPrice: "أقصى سعر شراء آمن", desiredBy: "احسبه على أساس",
    byProfit: "ربح مطلوب", byRoi: "عائد مطلوب",
    headroom: "الفرق عن السقف", aboveCeiling: "فوق السقف بـ", belowCeiling: "تحت السقف بـ",
    decision: "التقييم", recommendationOnly: "توصية فقط — القرار قرارك",
    factors: "عوامل التقييم", fRoi: "العائد", fMargin: "الهامش",
    fCritical: "بنود حرجة", fRepair: "بنود تحتاج إصلاح", fRisk: "نسبة الإصلاح",
    fDays: "مدة البيع", fHeadroom: "السقف", fCoverage: "تغطية الفحص",
    checkedItems: "بنود مفحوصة", saveAsPotential: "احفظه صفقة محتملة",
    convertToDeal: "حوّله لصفقة", converted: "تحوّل لصفقة",
    convertNote: "سيُنشئ صفقة بسعر البائع، وكل بند له تكلفة يصير مصروفاً غير مدفوع.",
    cInsp: "تقييمات",
    grpCapital: "رأس المال", grpCash: "النقد", grpInventory: "المخزون",
    grpLiabilities: "الالتزامات", grpSales: "المبيعات", grpBusiness: "النشاط",
    openingCapital: "رأس المال الافتتاحي",
    ownerContributions: "مساهمات المالك", ownerWithdrawals: "مسحوبات المالك",
    vehiclePayables: "ذمم السيارات", businessPayables: "ذمم النشاط",
    totalPayables: "إجمالي الالتزامات",
    editBiz: "تعديل مصروف نشاط", bizPayableNote:
      "المصروف غير المدفوع لا ينقص النقد — يظهر التزاماً حتى تعلّمه مدفوعاً.",
    diffAmount: "مقدار الفرق",
    cashRecovery: "الاسترداد النقدي",
    cashRecoveryNote: "رأس المال يُسترد أولاً. الربح المسترد نقداً يبقى صفراً حتى تتجاوز المقبوضات التكلفة — وهذا لا يغيّر الربح المحاسبي أعلاه.",
    preOpening: "قبل الافتتاح", cCash: "حركات نقد", cBiz: "مصاريف نشاط",
    method: "وسيلة الدفع", mCash: "كاش", mBank: "بنك", mCheque: "شيك", mTransfer: "تحويل",
    bizList: "قائمة مصاريف النشاط", addBizExpense: "أضف مصروف نشاط",
    reserve: "الاحتياطي", reserveSub: "يُحجز من ربح كل صفقة",
    reserveOn: "تفعيل الاحتياطي", reserveMode: "طريقة الحجز",
    modePercent: "نسبة من الربح", modeFixed: "مبلغ ثابت",
    reservePct: "النسبة %", reserveFixed: "المبلغ", reserveTarget: "هدف الاحتياطي",
    reserveBalance: "رصيد الاحتياطي", willReserve: "يُحجز من هذي الصفقة",
    reserveLeft: "باقي للهدف", reserveDone: "وصلت هدف الاحتياطي",
    withdraw: "سحب", depositIn: "إيداع", addManual: "إضافة يدوية",
    reserveLog: "الحركات", noMoves: "ما فيه حركات",
    reserveHint: "يُحسب من الصفقات المباعة فقط. الصفقة الخاسرة لا يُحجز منها شيء.",
    markPaid: "علّمها مدفوعة", markUnpaid: "علّمها غير مدفوعة",
    notPaidYet: "ما دفعتها بعد",
    dueHint: "المربع الأحمر يعني ما دفعتها بعد. اضغطه لما تدفعها فيصير أخضر.",
    devTools: "أدوات المطوّر", devHint: "اضغط سبع مرات لفتح أدوات المطوّر",
    devOn: "أدوات المطوّر مفتوحة", devOff: "أغلقت أدوات المطوّر",
    memoryOnly: "غير محفوظ — الذاكرة فقط",
    unsaved: "فيه تعديل ما انحفظ", saveNow: "احفظ الآن",
    sound: "الأصوات", soundOn: "مفعّلة", soundOff: "مطفأة",
    buyCalc: "قبل ما تشتري", buyCalcSub: "اعرف سقف سعر الشراء قبل ما تفاوض",
    expectSell: "بكم بتبيعها؟", expectExp: "كم بتصرف عليها؟", wantProfit: "كم تبي تربح؟",
    maxPay: "لا تدفع أكثر من", askedPrice: "السعر المطلوب", verdict: "الحكم",
    good: "اشترِ — داخل سقفك", tight: "على الحد", bad: "لا تشتري بهالسعر",
    roomDown: "لازم ينزّل", roomUp: "عندك مجال",
    ifBuyAt: "لو اشتريتها بـ", resultProfit: "ربحك", resultRoi: "عائدك",
    saveAsDeal: "احفظها كصفقة", presets: "قوالب المصاريف", applyPreset: "طبّق القالب",
    presetHint: "علّم البنود اللي تتوقعها وحط مبالغها", cash: "كاش", instalment: "أقساط", months: "عدد الأشهر", monthly: "القسط الشهري", collected: "المحصّل", remaining: "المتبقي", payments: "الدفعات", noPayments: "ما فيه دفعات", addPartner: "أضف شريك", partnerName: "اسم الشريك", capitalShare: "رأس ماله", profitShare: "نصيبه من الربح", myShare: "حصتي",
    leads: "المشترون المحتملون", addLead: "أضف مشتري", leadName: "الاسم",
    leadPhone: "الهاتف", offer: "عرضه", viewDate: "موعد المعاينة",
    leadNew: "جديد", leadViewed: "عاين", leadNego: "يفاوض", leadLost: "انسحب",
    leadWon: "اشترى", noLeads: "ما فيه مشترين مسجلين", call: "اتصل",
    report: "تقرير الصفقة", printReport: "اطبع / PDF", reportBy: "صادر من",
    alerts: "التنبيهات", noAlerts: "ما فيه تنبيهات", alertListed: "معروضة من",
    alertTarget: "وصلت سعر الهدف", alertInsurance: "التأمين ينتهي",
    alertReg: "الاستمارة تنتهي", alertDue: "مصاريف غير مدفوعة", insuranceExpiry: "انتهاء التأمين",
    regExpiry: "انتهاء الاستمارة", daysWord: "يوم",
    errPrice: "سعر الشراء لازم يكون أكبر من صفر.",
    errYear: "سنة الصنع غير منطقية.", errMileage: "الممشى ما يكون سالباً.",
    errAmount: "المبلغ لازم يكون أكبر من صفر.", errVin: "رقم الهيكل لازم يكون 17 خانة.",
    errBrand: "اكتب الوكالة والموديل.",
    draftFound: "فيه مسودة محفوظة، نكملها؟", draftResume: "أكمل", draftDiscard: "ابدأ من جديد",
    passed: "ناجح", failed: "فاشل",
    imgLib: "مكتبة صور السيارات", imgLibSub: "صورة افتراضية لكل موديل",
    imgHave: "لها صورة", imgMissing: "بدون صورة",
    uploadImg: "ارفع صورة", replaceImg: "استبدل", removeImg: "شيل الصورة",
    catalogTitle: "كتالوج السيارات", brands: "وكالة", modelsWord: "موديل",
    brandLogos: "شعارات الوكالات", brandLogosSub:
      "الشعارات الرسمية علامات مسجّلة. ارفع الشعار بنفسك إن كنت تملك حق استخدامه.",
    uploadLogo: "ارفع شعار", removeLogo: "شيل",
    bulkUpload: "ارفع دفعة", bulkLogosHint:
      "اختر كل ملفات الشعارات مرة وحدة. سمّها باسم الوكالة: toyota.png · bmw.png · land_rover.png",
    bulkCarsHint:
      "اختر كل صور السيارات مرة وحدة. سمّها: brand_model_year — مثال: dodge_charger_2024.jpg",
    matched: "طوبق", unmatched: "ما انطابق", bulkDone: "تم الرفع",
    pickBrand: "اختر الوكالة", pickModel: "اختر الموديل", pickYear: "اختر السنة",
    pickTrim: "اختر الفئة", skipTrim: "بدون فئة",
    imageBase: "رابط مكتبة الصور", imageBaseHint:
      "استضف صورك على أي CDN بهذا الشكل: {الرابط}/{الوكالة}/{الموديل}/{السنة}/front_3_4.webp",
    swipeHint: "اسحب لتشوف باقي الصور", photosTitle: "صور السيارة", takePhoto: "التقط صورة", fromGallery: "من الاستديو",
    mainPhoto: "الصورة الرئيسية", setMain: "اجعلها الرئيسية", movePrev: "قدّم",
    moveNext: "أخّر", noPhotos: "ما فيه صور بعد", photoCount: "صورة",
    myPhotos: "صوري", useForModel: "استخدمها لكل سيارات هذا الموديل",
    imgPath: "المسار", imgNote: "الصورة تنطبق على كل صفقة لهذا الموديل ما لم يرفع المستخدم صوره الخاصة.",
  },
  en: {
    welcomeIn: "Welcome to", start: "Start",
    tagline: "Calculate cost and profit for every car deal with confidence",
    footNote: "Accurate numbers • Smart decisions • Bigger profit",
    purchasePrice: "Purchase Price", totalExp: "Total Expenses", totalCost: "Total Cost",
    sellPrice: "Selling Price", netProfit: "Net Profit", roi: "Return on Investment",
    roiShort: "ROI", margin: "Profit Margin",
    yourDeal: "Your Current Deal", currentSell: "Current Selling Price", showAll: "View all details",
    profitTarget: "Profit Target", targetProfit: "Target Profit", requiredPrice: "Required Price",
    breakEven: "Break-even", currentPrice: "Current Price", targetPrice: "Target Price",
    remainToTarget: "Remaining to target", reachedTarget: "Above target by",
    strategy: "Selling Strategy", quickSale: "Quick Sale", profitWord: "Profit",
    fullCompare: "Full comparison", bePrice: "Break-even Price",
    aboveIs: "Any price above", isProfit: "is profit.",
    belowIs: "And any price below", isLoss: "is a loss.",
    quickCalc: "Quick Profit Calculator", enterPrice: "Enter selling price",
    navHome: "Home", navGarage: "Garage", navAdd: "Add Deal",
    navAnalytics: "Analytics", navSettings: "Settings",
    garage: "Garage", garageSub: "Manage and track all your cars",
    totalInvest: "Total Investment", realizedProfit: "Realized Profit",
    expectedProfit: "Expected Profit",
    activeCars: "Active Cars", soldCars: "Sold Cars", carUnit: "cars",
    showDetails: "View Details", addCar: "Add Car",
    addCarSub: "Add a new car to your garage", addCarTitle: "Add Car",
    addPhotos: "Add Photos", addPhotosSub: "Front, rear and side photos",
    photoLimits: "Minimum 3 • Maximum 10",
    brand: "Brand", model: "Model", year: "Year", trim: "Trim",
    mileage: "Mileage (km)", vin: "VIN", color: "Color",
    purchaseDate: "Purchase Date", purchaseSource: "Purchase Source",
    saveCar: "Save Car", cancel: "Cancel", save: "Save", del: "Delete", edit: "Edit",
    costsTitle: "Car Costs", expList: "Expense List", expCount: "expenses",
    addExpense: "Add Expense", pasteExpenses: "Paste from notes", paidLabel: "Paid", dueLabel: "Due",
    sellTitle: "Sell & Pricing", sellSub: "Find the best price for maximum profit",
    suggestPrice: "Suggested price", recommendations: "Pricing Recommendations",
    currentTag: "Current", targetTag: "Target Price", quickTag: "Quick Sale Price",
    diffTarget: "Target difference", profitAnalysis: "Profit Analysis",
    lossZone: "Loss zone", profitZone: "Profit zone",
    analytics: "Analytics", period: "Period",
    carsBought: "Cars Purchased", totalSales: "Total Sales", totalProfit: "Total Profit",
    avgProfit: "Avg Profit", avgRoi: "Average ROI", avgDays: "Avg Days to Sell",
    bestDeal: "Best Deal", worstDeal: "Worst Deal", topBrand: "Top Brand",
    totalWord: "Total", nowWord: "Now", avgWord: "Average", dayUnit: "days",
    monthlyProfit: "Monthly Profit", roiTrend: "ROI Trend",
    dealDist: "Deal Distribution", dealUnit: "deals", cancelledLbl: "Cancelled",
    settings: "Settings", language: "Language", currency: "Currency",
    appearance: "Appearance", dark: "Dark", defaultTarget: "Default Profit Target",
    quickSalePct: "Quick Sale Margin", notifications: "Notifications", enabled: "Enabled",
    backup: "Data Backup", exportData: "Export Data",
    importLib: "Import Car Library", about: "About H CAR DEAL",
    calcTests: "Calculation Tests", signOut: "Reset Data", premium: "Premium Member",
    desc: "Description", amount: "Amount", date: "Date", category: "Category",
    supplier: "Supplier / Garage", notes: "Notes", receipt: "Receipt Photo",
    customCat: "New category",
    details: "Vehicle Details", timeline: "Deal Timeline", vehicleInfo: "Vehicle Info",
    markSold: "Mark as Sold", soldPrice: "Final Sold Price", soldDate: "Sold Date",
    buyerName: "Buyer Name", buyerPhone: "Buyer Phone", daysHeld: "Days Held",
    deleteDeal: "Delete Deal", editVehicle: "Edit Vehicle",
    search: "Search make, model or year", recent: "Recently used",
    favorites: "Favorites", chooseModel: "Choose a vehicle model", specs: "Specs",
    filters: "Filter", sort: "Sort",
    sortNewest: "Newest", sortOldest: "Oldest", sortProfitHi: "Highest profit",
    sortProfitLo: "Lowest profit", sortInvestHi: "Highest investment",
    sortInvestLo: "Lowest investment", sortMake: "Make", sortStatus: "Status",
    sortYear: "Year",
    all: "All",
    emptyCars: "No cars in the garage", emptyExp: "No expenses yet",
    emptySold: "Nothing sold yet", emptyResults: "No results",
    emptyAnalytics: "Not enough data yet",
    confirmTitle: "Confirm", confirmDeleteCar: "Delete this deal? You can restore it from trash.",
    confirmDeleteExp: "Delete this expense?", confirmReset: "Erase all data and restore samples?",
    yes: "Yes", no: "No", undo: "Undo", undone: "Restored",
    errSave: "Could not save. Please try again.",
    errPhotos: "Photos exceed the storage limit. Remove one or two.",
    errPhotoRead: "Could not read an image. Try JPG or PNG.",
    storageCheck: "Storage Check", running: "Checking…",
    stWrite: "Write small record", stRead: "Read", stList: "List keys",
    stBig: "Write image (100 KB)", stDelete: "Delete",
    stOk: "OK", stFail: "Failed", stAll: "Storage is fully working",
    stNone: "Storage unavailable on this device — data is in memory only. Export a backup.",
    copyBackup: "Copy backup", pasteBackup: "Restore from backup",
    backupCopied: "Copied", backupRestored: "Restored", backupBad: "Invalid text",
    retry: "Retry", savedOk: "Saved", typeReset: "Type RESET to confirm",
    exportBackup: "Export backup", importBackup: "Import backup",
    backupCenter: "Data & Backup Center", backupCenterSub: "A complete restorable backup",
    lastBackup: "Last backup", neverBackedUp: "No backup taken yet",
    backupSize: "Size", backupSchema: "Backup version", backupDate: "Date",
    exportFull: "Export Full Backup", importRestore: "Import / Restore",
    verifyBackup: "Verify Backup", restoreAuto: "Restore auto-backup",
    autoBackupNote: "An automatic backup is taken before any restore",
    verifying: "Verifying…", fileValid: "File is valid", fileInvalid: "File is not valid",
    errBadJson: "Not valid JSON", errNotApp: "This file is not from H CAR DEAL",
    errCorrupt: "File is corrupt or incomplete",
    confirmRestore: "Restoring replaces all current data. An automatic backup was taken. Continue?",
    restored: "Restored", restoreReport: "Restore report",
    cDeals: "deals", cActive: "active", cModels: "models", cPhotos: "photos",
    cExpenses: "expenses", cReceipts: "receipts", cLeads: "leads", cEvents: "events",
    cLibrary: "library images", cLogos: "logos", cReserve: "reserve moves",
    fromSchema: "from version", schemaCurrent: "current version",
    installApp: "Add to Home Screen", installHint:
      "Open the browser share menu and choose Add to Home Screen.",
    capital: "Capital & Cash Flow", capitalSub: "Cash, capital and owner equity",
    openLedger: "Open the ledger", openingCash: "Cash you hold right now",
    openingDate: "Opening date", openingNote:
      "Deals dated before this date generate no cash movements — they sit in the opening position.",
    openingPosition: "Opening position", openingEquity: "Opening equity",
    availableCash: "Available cash", spendableCash: "Spendable",
    capitalContributed: "Capital contributed", ownerDraws: "Owner draws",
    netCapital: "Net capital", ownerEquity: "Owner equity",
    inventoryCost: "Inventory cost", cashInInventory: "Cash in inventory",
    payables: "Payables", askingValue: "Asking value",
    potentialProfit: "Potential profit", inventoryCount: "Cars in inventory",
    realizedAcc: "Accounting Realized Profit",
    profitInCash: "Profit Recovered in Cash",
    capitalToRecover: "Remaining Capital to Recover",
    capitalRecovered: "Capital recovered in cash", receivables: "Receivables",
    cashCollected: "Collected", unrealized: "Unrealized profit",
    bizExpenses: "Business expenses", netBizProfit: "Net business profit",
    ledger: "Cash ledger", noEntries: "No movements",
    addCapital: "Add capital", drawCapital: "Draw", addBiz: "Business expense",
    autoEntry: "auto", manualEntry: "manual",
    balanced: "Books balance", unbalanced: "Out of balance",
    invariantNote: "Equity = Opening + Net capital + Realized profit + Forfeited income − Business expenses",
    atAGlance: "At a glance", moneyIn: "In", moneyOut: "Out",
    costLabel: "Cost", profitLabel: "Profit", quickActions: "Shortcuts",
    theme: "Appearance", themeSystem: "System", themeLight: "Light", themeDark: "Dark",
    themeNote: "System follows your device and switches instantly with it, even on automatic day/night.",
    themeNow: "Currently",
    compare: "Vehicle Comparison", compareSub: "Which car was the better deal",
    selectCars: "Select cars", noSelection: "Select at least two cars",
    portfolio: "Portfolio summary", carsPurchased: "Cars purchased",
    currentInventory: "In inventory", carsSold: "Cars sold",
    spentOnVehicles: "Spent on vehicles", totalSalesAmt: "Total sales",
    avgProfitPer: "Avg profit per car",
    avgHolding: "Avg holding days",
    mostExpensive: "Most expensive car", highestExpenses: "Highest expenses",
    avgDaily: "Avg daily profit", expectedOnly: "expected",
    globalExpenses: "Expenses across all cars", acrossCars: "cars",
    largestCat: "Largest category", largestCatPct: "Share",
    importCalc: "Import Calculator", importSub: "Cost of a car landed in Bahrain",
    country: "Country", exchangeRate: "Exchange rate", buyCurrency: "Purchase currency",
    purchaseCostBHD: "Purchase cost in BHD", importCosts: "Import costs",
    landedCost: "Landed cost Bahrain", expectedRepairs: "Expected repairs",
    newImport: "New import calculation", noImports: "No calculations",
    rateNote: "Exchange rate is entered manually — no automatic updates",
    convertImportNote: "Creates a deal at the vehicle price; each import item becomes an unpaid expense and expected repairs become a planned expense.",
    aging: "Inventory aging", agingSettings: "Aging thresholds",
    daysIn: "days in inventory", sinceListed: "since listed", holdingDays: "Holding days",
    agingFresh: "Fresh up to", agingNormal: "Normal up to", agingOld: "Aging up to",
    adGen: "Ad Generator", adMode: "Ad style", adLang: "Ad language",
    copyAd: "Copy ad", adCopied: "Ad copied",
    adNote: "The ad is built only from your saved data. Empty fields never appear.",
    interiorColor: "Interior color", featuresLabel: "Key features",
    myLocation: "Location", myContact: "Contact number",
    cImports: "import calcs",
    partsCost: "Parts cost", laborCost: "Labor cost", itemName: "Part / Item",
    workshop: "Workshop", odoAt: "Mileage",
    expStatus: "Work status", expTotal: "Total expense",
    autoTotal: "Auto: parts + labor",
    plannedNote: "Planned work does not enter cost until completed",
    plannedTotal: "Planned expenses",
    breakdown: "Where the money went", topCategory: "Top category",
    noBreakdown: "No expenses yet", ofExpenses: "of total expenses",
    partsVsLabor: "Parts vs labor", extraPhotos: "More photos",
    priceHistory: "Price History", originalAsking: "Original asking",
    currentAsking: "Current asking", lowestAsking: "Lowest asking",
    priceChanges: "Price changes", heldFor: "held", changeReason: "Reason",
    noPriceChanges: "Price has not changed",
    minAcceptable: "Minimum acceptable price", minAcceptableNote: "Internal — never shown in ads",
    ifSoldAt: "If sold at this price",
    offers: "Offers", addOffer: "Record offer", offerAmount: "Offer amount",
    firstOffer: "First offer", lastOffer: "Last offer", highestOffer: "Highest offer",
    quotedPrice: "Price quoted to buyer", minTold: "Lowest price told",
    lastContact: "Last contact", highestActive: "Highest active offer",
    vsAsking: "vs your price", vsMin: "vs minimum",
    noOffers: "No offers",
    deposit: "Deposit", deposits: "Deposits", addDeposit: "Record deposit",
    refundable: "Refundable", nonRefundable: "Non-refundable",
    depHeld: "Held", depApplied: "Applied to sale", depRefunded: "Refunded",
    depForfeited: "Forfeited", forfeitDeposit: "Forfeit deposit",
    depositLiability: "Customer Deposit Liabilities", forfeitedIncome: "Forfeited Deposit Income",
    forfeitNote: "Forfeiting moves the amount from a liability to separate income. Cash is unchanged, and neither vehicle cost nor vehicle profit is affected.",
    refundDeposit: "Refund deposit", noDeposits: "No deposits",
    depositNote: "A deposit increases cash, does not mark the car sold, and is never counted twice at closing.",
    closeSale: "Close Sale", closingReview: "Final review",
    depositReceived: "Deposit received", receivedAtClosing: "Received at closing",
    totalCollected: "Total cash collected", outstandingPayables: "Outstanding vehicle payables",
    paymentMethod: "Payment method", confirmSale: "Confirm sale",
    soldArchive: "Sold Archive", daysInInventory: "Days in inventory",
    finalBuyer: "Final buyer", saleDetails: "Sale details",
    cOffers: "offers", cDeposits: "deposits", cPrices: "price changes",
    inspection: "Pre-Purchase Inspection", inspectionSub: "Assess the car before you buy",
    inspList: "Inspections", newInspection: "New inspection", noInspections: "No inspections",
    vehicleInfo2: "Vehicle", origin: "Origin", gcc: "GCC", imported: "Import",
    askingPrice2: "Asking price", sellerFinal: "Seller final price",
    expectedSelling: "Expected selling price", expectedDays: "Expected days to sell",
    checklist: "Inspection checklist", repairCost: "Repair cost",
    otherCosts: "Other acquisition costs", estRepairs: "Estimated repairs",
    totalInvestment2: "Total expected investment", expectedProfit2: "Expected profit",
    maxBuyPrice: "Maximum safe purchase price", desiredBy: "Base it on",
    byProfit: "Minimum profit", byRoi: "Minimum ROI",
    headroom: "Difference from ceiling", aboveCeiling: "Above ceiling by",
    belowCeiling: "Below ceiling by",
    decision: "Assessment", recommendationOnly: "Recommendation only — the decision is yours",
    factors: "Scoring factors", fRoi: "ROI", fMargin: "Margin",
    fCritical: "Critical items", fRepair: "Items needing repair", fRisk: "Repair share",
    fDays: "Days to sell", fHeadroom: "Ceiling", fCoverage: "Inspection coverage",
    checkedItems: "Items checked", saveAsPotential: "Save as potential deal",
    convertToDeal: "Convert to deal", converted: "Converted",
    convertNote: "Creates a deal at the seller price; every costed item becomes an unpaid expense.",
    cInsp: "inspections",
    grpCapital: "Capital", grpCash: "Cash", grpInventory: "Inventory",
    grpLiabilities: "Liabilities", grpSales: "Sales", grpBusiness: "Business",
    openingCapital: "Opening Capital",
    ownerContributions: "Owner Contributions", ownerWithdrawals: "Owner Withdrawals",
    vehiclePayables: "Vehicle Payables", businessPayables: "Business Payables",
    totalPayables: "Total Payables",
    editBiz: "Edit business expense", bizPayableNote:
      "An unpaid expense does not reduce cash — it shows as a liability until marked paid.",
    diffAmount: "Difference",
    cashRecovery: "Cash Recovery",
    cashRecoveryNote: "Capital is recovered first. Profit Recovered in Cash stays zero until collections exceed cost — this does not change the accounting profit above.",
    preOpening: "pre-opening", cCash: "cash entries", cBiz: "business expenses",
    method: "Method", mCash: "Cash", mBank: "Bank", mCheque: "Cheque", mTransfer: "Transfer",
    bizList: "Business expenses", addBizExpense: "Add business expense",
    reserve: "Reserve", reserveSub: "Set aside from each sale",
    reserveOn: "Enable reserve", reserveMode: "Method",
    modePercent: "Percent of profit", modeFixed: "Fixed amount",
    reservePct: "Percent %", reserveFixed: "Amount", reserveTarget: "Reserve goal",
    reserveBalance: "Reserve balance", willReserve: "Set aside from this deal",
    reserveLeft: "Left to goal", reserveDone: "Reserve goal reached",
    withdraw: "Withdraw", depositIn: "Deposit", addManual: "Manual entry",
    reserveLog: "Movements", noMoves: "No movements",
    reserveHint: "Calculated from sold deals only. A losing deal sets aside nothing.",
    markPaid: "Mark as paid", markUnpaid: "Mark as unpaid",
    notPaidYet: "Not paid yet",
    dueHint: "A red box means it is not paid yet. Tap it once you pay and it turns green.",
    devTools: "Developer Tools", devHint: "Tap seven times to unlock developer tools",
    devOn: "Developer tools unlocked", devOff: "Developer tools locked",
    memoryOnly: "Not saved — memory only",
    unsaved: "Unsaved changes", saveNow: "Save now",
    sound: "Sound", soundOn: "On", soundOff: "Off",
    buyCalc: "Before you buy", buyCalcSub: "Know your ceiling before you negotiate",
    expectSell: "Expected selling price", expectExp: "Expected expenses", wantProfit: "Target profit",
    maxPay: "Do not pay more than", askedPrice: "Asking price", verdict: "Verdict",
    good: "Buy — within your ceiling", tight: "Right on the limit", bad: "Do not buy at this price",
    roomDown: "They must come down", roomUp: "You have room",
    ifBuyAt: "If you buy at", resultProfit: "Your profit", resultRoi: "Your ROI",
    saveAsDeal: "Save as a deal", presets: "Expense presets", applyPreset: "Apply preset",
    presetHint: "Tick the items you expect and set the amounts", cash: "Cash", instalment: "Instalments", months: "Months", monthly: "Monthly instalment", collected: "Collected", remaining: "Remaining", payments: "Payments", noPayments: "No payments", addPartner: "Add partner", partnerName: "Partner name", capitalShare: "Capital", profitShare: "Profit share", myShare: "My share",
    leads: "Buyer leads", addLead: "Add buyer", leadName: "Name",
    leadPhone: "Phone", offer: "Offer", viewDate: "Viewing date",
    leadNew: "New", leadViewed: "Viewed", leadNego: "Negotiating", leadLost: "Lost",
    leadWon: "Bought", noLeads: "No buyers recorded", call: "Call",
    report: "Deal Report", printReport: "Print / PDF", reportBy: "Issued by",
    alerts: "Alerts", noAlerts: "No alerts", alertListed: "Listed for",
    alertTarget: "Target price reached", alertInsurance: "Insurance expires",
    alertReg: "Registration expires", alertDue: "Unpaid expenses", insuranceExpiry: "Insurance expiry",
    regExpiry: "Registration expiry", daysWord: "days",
    errPrice: "Purchase price must be greater than zero.",
    errYear: "Year looks invalid.", errMileage: "Mileage cannot be negative.",
    errAmount: "Amount must be greater than zero.", errVin: "VIN must be 17 characters.",
    errBrand: "Enter brand and model.",
    draftFound: "You have an unsaved draft. Continue?", draftResume: "Continue",
    draftDiscard: "Start over",
    passed: "passed", failed: "failed",
    imgLib: "Car Image Library", imgLibSub: "A default image per model",
    imgHave: "Has image", imgMissing: "No image",
    uploadImg: "Upload image", replaceImg: "Replace", removeImg: "Remove",
    catalogTitle: "Car Catalog", brands: "brands", modelsWord: "models",
    brandLogos: "Brand Logos", brandLogosSub:
      "Official logos are trademarks. Upload your own if you hold the rights.",
    uploadLogo: "Upload logo", removeLogo: "Remove",
    bulkUpload: "Bulk upload", bulkLogosHint:
      "Select all logo files at once. Name them after the brand: toyota.png · bmw.png · land_rover.png",
    bulkCarsHint:
      "Select all car photos at once. Name them: brand_model_year — e.g. dodge_charger_2024.jpg",
    matched: "matched", unmatched: "unmatched", bulkDone: "Uploaded",
    pickBrand: "Choose brand", pickModel: "Choose model", pickYear: "Choose year",
    pickTrim: "Choose trim", skipTrim: "No trim",
    imageBase: "Image library base URL", imageBaseHint:
      "Host images on any CDN as: {base}/{brand}/{model}/{year}/front_3_4.webp",
    swipeHint: "Swipe to browse photos", photosTitle: "Car Photos", takePhoto: "Take Photo", fromGallery: "From Gallery",
    mainPhoto: "Main photo", setMain: "Set as main", movePrev: "Move up",
    moveNext: "Move down", noPhotos: "No photos yet", photoCount: "photos",
    myPhotos: "My photos", useForModel: "Use for all cars of this model",
    imgPath: "Path", imgNote: "Applies to every deal of this model unless the user uploads their own photos.",
  },
};
const makeT = (lang) => (k) => STRINGS[lang]?.[k] ?? STRINGS.ar[k] ?? k;

/* ---- حالات الصفقة (البند 13) ---- */
const STATUS = {
  purchased: { ar: "تم الشراء", en: "Purchased", c: C.ink2 },
  repair: { ar: "قيد الإصلاح", en: "In Repair", c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)" },
  ready: { ar: "جاهزة للبيع", en: "Ready For Sale", c: C.blue },
  listed: { ar: "معروضة للبيع", en: "Listed", c: C.gold },
  reserved: { ar: "محجوزة", en: "Reserved", c: C.purple },
  sold: { ar: "مباعة", en: "Sold", c: C.green },
  cancelled: { ar: "ملغاة", en: "Cancelled", c: C.red },
};
const STATUS_FLOW = ["purchased", "repair", "ready", "listed", "reserved", "sold"];
const OPEN_STATUSES = ["purchased", "repair", "ready", "listed", "reserved"];

/* ---- فئات المصاريف (البند 15) ---- */
const EXPENSE_CATS = {
  bodywork: { ar: "سمكرة", en: "Bodywork", c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)", icon: "engine" },
  paint: { ar: "الدهان", en: "Paint", c: "var(--a-red)", ce: "var(--a-red-e)", cf: "var(--a-red-f)", icon: "brush" },
  mechanical: { ar: "إصلاح ميكانيكي", en: "Mechanical Repair", c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)", icon: "engine" },
  electrical: { ar: "إصلاح كهربائي", en: "Electrical Repair", c: "var(--a-gold)", ce: "var(--a-gold-e)", cf: "var(--a-gold-f)", icon: "spark" },
  parts: { ar: "قطع غيار", en: "Spare Parts", c: "var(--a-purple)", ce: "var(--a-purple-e)", cf: "var(--a-purple-f)", icon: "engine" },
  oil: { ar: "زيت وفلاتر", en: "Oil & Filters", c: "var(--a-gold)", ce: "var(--a-gold-e)", cf: "var(--a-gold-f)", icon: "fuelP" },
  tires: { ar: "الإطارات", en: "Tires", c: "var(--a-purple)", ce: "var(--a-purple-e)", cf: "var(--a-purple-f)", icon: "refresh" },
  battery: { ar: "البطارية", en: "Battery", c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)", icon: "spark" },
  ac: { ar: "تكييف", en: "AC Repair", c: "var(--a-blue)", ce: "var(--a-blue-e)", cf: "var(--a-blue-f)", icon: "refresh" },
  inspection: { ar: "الفحص", en: "Inspection", c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)", icon: "clipboard" },
  insurance: { ar: "التأمين", en: "Insurance", c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)", icon: "scale" },
  registration: { ar: "التسجيل والمرور", en: "Registration", c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)", icon: "clipboard" },
  transport: { ar: "النقل", en: "Transportation", c: "var(--a-teal)", ce: "var(--a-teal-e)", cf: "var(--a-teal-f)", icon: "ship" },
  fuel: { ar: "الوقود", en: "Fuel", c: "var(--a-teal)", ce: "var(--a-teal-e)", cf: "var(--a-teal-f)", icon: "fuelP" },
  cleaning: { ar: "التنظيف", en: "Cleaning", c: "var(--a-blue)", ce: "var(--a-blue-e)", cf: "var(--a-blue-f)", icon: "spark" },
  detailing: { ar: "التلميع", en: "Detailing", c: "var(--a-blue)", ce: "var(--a-blue-e)", cf: "var(--a-blue-f)", icon: "spark" },
  auction: { ar: "رسوم المزاد", en: "Auction Fees", c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)", icon: "gavel" },
  commission: { ar: "عمولة", en: "Commission", c: "var(--a-pink)", ce: "var(--a-pink-e)", cf: "var(--a-pink-f)", icon: "tag" },
  importFees: { ar: "رسوم الاستيراد", en: "Import Fees", c: "var(--a-blue)", ce: "var(--a-blue-e)", cf: "var(--a-blue-f)", icon: "ship" },
  customs: { ar: "الجمارك", en: "Customs", c: "var(--a-blue)", ce: "var(--a-blue-e)", cf: "var(--a-blue-f)", icon: "scale" },
  other: { ar: "أخرى", en: "Other", c: "var(--a-gray)", ce: "var(--a-gray-e)", cf: "var(--a-gray-f)", icon: "clipboard" },
};

const SOURCES = {
  auction: { ar: "مزاد", en: "Auction", icon: "gavel" },
  individual: { ar: "فرد", en: "Individual", icon: "person" },
  dealer: { ar: "تاجر", en: "Dealer", icon: "garage" },
  import: { ar: "استيراد", en: "Import", icon: "ship" },
};

/* ============================ L4 — IMAGE LIBRARY ============================
   Manifest يربط كل صورة ببياناتها (البند 44). إضافة صورة = سطر واحد هنا،
   أو استيراد دفعة كاملة عبر importImageManifest (البندان 42/43).
   المسار المقترح على القرص:
     car_images/<brand>/<model>/<year>/<trim>/<view>.webp
   ========================================================================== */
const VIEWS = ["front_3_4", "rear_3_4", "front", "rear", "side", "thumbnail", "default"];

const BUILTIN_MANIFEST = [
  { imageId: "img_charger_2024_rt_f34", brand: "Dodge", model: "Charger", year: "2024",
    trim: "R/T Scat Pack", view: "front_3_4",
    file: "car_images/dodge/charger/2024/rt/front_3_4.webp", src: IMG_CHARGER_2024 },
];
let IMAGE_MANIFEST = [...BUILTIN_MANIFEST];

const norm = (v) => String(v ?? "").trim().toLowerCase().replace(/[\s_-]+/g, " ");
const imgKey = (b, m, y, t) => [norm(b), norm(m), norm(y), norm(t)].filter(Boolean).join("/");

/* فهرس يُبنى مرة واحدة ويعاد بناؤه عند الاستيراد (البند 57) */
let IMAGE_INDEX = new Map();
function rebuildImageIndex() {
  IMAGE_INDEX = new Map();
  for (const r of IMAGE_MANIFEST) {
    const src = r.src || r.file;
    if (!src) continue;
    const levels = [
      imgKey(r.brand, r.model, r.year, r.trim),
      imgKey(r.brand, r.model, r.year),
      imgKey(r.brand, r.model),
      norm(r.brand),
    ];
    for (const k of levels) {
      if (!k) continue;
      if (!IMAGE_INDEX.has(k)) IMAGE_INDEX.set(k, []);
      IMAGE_INDEX.get(k).push({ ...r, src });
    }
  }
}
rebuildImageIndex();

/* البند 42/43: استيراد دفعة صور بـ JSON بدون تعديل أي شاشة */
/* يستبدل صور المستخدم فوق الصور المدمجة ثم يعيد بناء الفهرس */
function setUserImages(rows) {
  IMAGE_MANIFEST = [...BUILTIN_MANIFEST, ...(rows || [])];
  rebuildImageIndex();
}

/* تصغير الصورة قبل الحفظ — البند 7 */
function downscale(file, maxW = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const im = new Image();
      im.onerror = reject;
      im.onload = () => {
        const scale = Math.min(1, maxW / im.width);
        const cv = document.createElement("canvas");
        cv.width = Math.round(im.width * scale);
        cv.height = Math.round(im.height * scale);
        cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
        try { resolve(cv.toDataURL("image/jpeg", quality)); }
        catch { resolve(r.result); }
      };
      im.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

function importImageManifest(rows) {
  const add = rows.filter((r) => r && r.brand && r.model && (r.src || r.file))
    .map((r) => ({ imageId: r.imageId || uid("img"), view: r.view || "default", ...r }));
  IMAGE_MANIFEST = [...IMAGE_MANIFEST, ...add];
  rebuildImageIndex();
  return add.length;
}

/* البند 4: البحث الهرمي بخمس مراحل — لا Broken Image أبداً */
function resolveModelImage(model, view = "front_3_4") {
  if (!model) return null;
  const levels = [
    imgKey(model.brand, model.model, model.year, model.trim),
    imgKey(model.brand, model.model, model.year),
    imgKey(model.brand, model.model),
    norm(model.brand),
  ];
  for (const k of levels) {
    const hits = IMAGE_INDEX.get(k);
    if (hits?.length) {
      return (hits.find((h) => h.view === view)
        || hits.find((h) => h.view === "front_3_4")
        || hits.find((h) => h.view === "default")
        || hits[0]).src;
    }
  }
  const remote = remoteImageUrl(model, view);   // ← CDN بالاصطلاح
  return remote || null;                        // ← وإلا Placeholder
}

/* البند 5: أولوية العرض — صورة المستخدم ثم المكتبة ثم Placeholder */
function resolveDealImage(dealRec, model) {
  if (dealRec?.photos?.length) {
    const i = Math.min(dealRec.mainPhoto || 0, dealRec.photos.length - 1);
    return dealRec.photos[i];
  }
  return resolveModelImage(model);
}

/* ===== src/data/arabic.js ===== */
/* ==================== L3c — البحث بالعربي ================================
   المستخدم يكتب "جي إم سي سييرا" أو "لاندكروزر ٢٠٢٤" فيلاقي النتيجة.
   نطبّع الحروف والأرقام ثم نترجم الكلمات العربية لأسماء الكتالوج.
   ========================================================================== */
const AR_DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6",
  "۷": "7", "۸": "8", "۹": "9" };

/* توحيد الهمزات والتاء المربوطة والألف المقصورة وحذف التشكيل */
function arNorm(v) {
  return String(v || "")
    .replace(/[٠-٩۰-۹]/g, (d) => AR_DIGITS[d] || d)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/ؤ/g, "و").replace(/ئ/g, "ي")
    .replace(/\s+/g, " ").trim().toLowerCase();
}

const AR_BRAND = {
  "تويوتا": "Toyota", "لكزس": "Lexus", "لكسز": "Lexus", "لكسس": "Lexus",
  "نيسان": "Nissan", "انفنيتي": "Infiniti", "انفينيتي": "Infiniti",
  "جي ام سي": "GMC", "جمس": "GMC", "جي إم سي": "GMC", "جيمس": "GMC",
  "شيفروليه": "Chevrolet", "شفروليه": "Chevrolet", "شيفرليه": "Chevrolet", "شفر": "Chevrolet",
  "كاديلاك": "Cadillac", "كادلاك": "Cadillac",
  "فورد": "Ford", "دودج": "Dodge", "دوج": "Dodge", "جيب": "Jeep",
  "بي ام دبليو": "BMW", "بي إم دبليو": "BMW", "بامو": "BMW", "بي ام": "BMW",
  "مرسيدس": "Mercedes-Benz", "مرسيدس بنز": "Mercedes-Benz", "مرسدس": "Mercedes-Benz",
  "اودي": "Audi", "بورش": "Porsche", "بورشه": "Porsche",
  "لاند روفر": "Land Rover", "لاندروفر": "Land Rover", "رنج روفر": "Land Rover",
  "جاكوار": "Jaguar", "هوندا": "Honda", "هيونداي": "Hyundai", "هونداي": "Hyundai",
  "كيا": "Kia", "جينيسيس": "Genesis", "جنسز": "Genesis",
  "ميتسوبيشي": "Mitsubishi", "متسوبيشي": "Mitsubishi",
  "مازدا": "Mazda", "سوبارو": "Subaru", "سوزوكي": "Suzuki",
  "فولكس فاجن": "Volkswagen", "فولكسفاجن": "Volkswagen", "فوكس فاجن": "Volkswagen",
  "فولفو": "Volvo", "تسلا": "Tesla", "بيجو": "Peugeot", "رينو": "Renault",
  "شيري": "Chery", "ام جي": "MG", "إم جي": "MG", "هافال": "Haval",
  "شانجان": "Changan", "تشانجان": "Changan", "جيلي": "Geely",
  "بي واي دي": "BYD", "ايسوزو": "Isuzu", "ميني": "Mini", "بنتلي": "Bentley",
  "رولز رويس": "Rolls-Royce", "فيراري": "Ferrari",
  "لامبورغيني": "Lamborghini", "لمبرغيني": "Lamborghini", "لامبورجيني": "Lamborghini",
  "مكلارين": "McLaren", "استون مارتن": "Aston Martin", "مازيراتي": "Maserati",
  "الفا روميو": "Alfa Romeo", "لينكولن": "Lincoln", "كرايسلر": "Chrysler",
  "سكودا": "Skoda", "ستروين": "Citroen", "سيتروين": "Citroen", "فيات": "Fiat",
  "اوبل": "Opel", "جيتور": "Jetour", "اكسيد": "Exeed", "جي ايه سي": "GAC",
  "جريت وول": "Great Wall", "هونشي": "Hongqi", "بستون": "Bestune",
  "جاك": "JAC", "داتسون": "Datsun", "دايهاتسو": "Daihatsu",
};

const AR_MODEL = {
  "سييرا": "Sierra", "سيرا": "Sierra", "يوكن": "Yukon", "اكاديا": "Acadia",
  "تاهو": "Tahoe", "سلفرادو": "Silverado", "سيلفرادو": "Silverado",
  "سوبربان": "Suburban", "كامارو": "Camaro", "كورفيت": "Corvette", "ماليبو": "Malibu",
  "تشارجر": "Charger", "شارجر": "Charger", "تشالنجر": "Challenger",
  "تشالينجر": "Challenger", "دورانجو": "Durango", "رام": "RAM",
  "لاندكروزر": "Land Cruiser", "لاند كروزر": "Land Cruiser", "لاندكروز": "Land Cruiser",
  "برادو": "Prado", "هايلكس": "Hilux", "كامري": "Camry", "كورولا": "Corolla",
  "افالون": "Avalon", "راف فور": "RAV4", "فورتشنر": "Fortuner",
  "اف جي": "FJ", "تندرا": "Tundra", "تاكوما": "Tacoma", "سيكويا": "Sequoia",
  "هايلاندر": "Highlander", "يارس": "Yaris", "هايس": "Hiace", "كوستر": "Coaster",
  "باترول": "Patrol", "التيما": "Altima", "مكسيما": "Maxima", "صني": "Sunny",
  "اكستريل": "X-Trail", "باثفايندر": "Pathfinder", "ارمادا": "Armada",
  "نافارا": "Navara", "جي تي ار": "GT-R", "جي تي آر": "GT-R", "كيكس": "Kicks",
  "اكورد": "Accord", "سيفيك": "Civic", "بايلوت": "Pilot", "سي ار في": "CR-V",
  "النترا": "Elantra", "سوناتا": "Sonata", "اكسنت": "Accent", "توسان": "Tucson",
  "سنتافي": "Santa Fe", "سانتافي": "Santa Fe", "باليسيد": "Palisade", "ازيرا": "Azera",
  "سبورتاج": "Sportage", "سورينتو": "Sorento", "تيلورايد": "Telluride",
  "كارنيفال": "Carnival", "سيراتو": "Cerato", "اوبتيما": "Optima",
  "باجيرو": "Pajero", "لانسر": "Lancer", "اوتلاندر": "Outlander",
  "مونتيرو": "Montero Sport", "رنج روفر": "Range Rover", "ديفندر": "Defender",
  "ديسكفري": "Discovery", "ايفوك": "Evoque",
  "موستنج": "Mustang", "موستانج": "Mustang", "اكسبديشن": "Expedition",
  "اكسبيدشن": "Expedition", "اكسبلورر": "Explorer", "رانجر": "Ranger",
  "برونكو": "Bronco", "اسكيب": "Escape", "ايدج": "Edge",
  "اسكاليد": "Escalade", "رانجلر": "Wrangler", "جراند شيروكي": "Grand Cherokee",
  "شيروكي": "Cherokee", "جلادييتور": "Gladiator",
  "جي كلاس": "G-Class", "اس كلاس": "S-Class", "اي كلاس": "E-Class",
  "سي كلاس": "C-Class", "جي ال اي": "GLE", "جي ال سي": "GLC", "جي ال اس": "GLS",
  "كايين": "Cayenne", "ماكان": "Macan", "باناميرا": "Panamera",
  "سويفت": "Swift", "فيتارا": "Vitara", "جيمني": "Jimny",
  "جولف": "Golf", "باسات": "Passat", "تيغوان": "Tiguan", "طوارق": "Touareg",
  "تيجو": "Tiggo", "جوليون": "Jolion", "كوبري": "Coolray",
  /* الموديلات الحرفية — الناس تكتبها بالعربي */
  "اكس 1": "X1", "اكس 3": "X3", "اكس 5": "X5", "اكس 6": "X6", "اكس 7": "X7",
  "ام 3": "M3", "ام 4": "M4", "ام 5": "M5", "ام 2": "M2",
  "ال اكس": "LX", "جي اكس": "GX", "ار اكس": "RX", "ان اكس": "NX",
  "اي اس": "ES", "اي بي اس": "IS", "ال اس": "LS", "جي اس": "GS",
  "كيو اكس 80": "QX80", "كيو اكس 70": "QX70", "كيو اكس 60": "QX60",
  "كيو 50": "Q50", "كيو 70": "Q70",
  "كيو 5": "Q5", "كيو 7": "Q7", "كيو 8": "Q8",
  "اي 4": "A4", "اي 6": "A6", "اي 8": "A8",
  "اف 150": "F-150", "ال 200": "L200", "٣٠٠ سي": "300C",
  "سي تي 5": "CT5", "اكس تي 5": "XT5",
  "موديل 3": "Model 3", "موديل واي": "Model Y", "موديل اس": "Model S",
  "موديل اكس": "Model X",
  "9 11": "911", "بي ار زد": "BRZ", "دي ماكس": "D-Max",
};

/* أطول تطابق أولاً حتى لا تبتلع "جي" كلمة "جي إم سي" */
const AR_KEYS = [...Object.keys(AR_BRAND), ...Object.keys(AR_MODEL)]
  .map(arNorm).sort((a, b) => b.length - a.length);
const AR_LOOKUP = {};
Object.entries(AR_BRAND).forEach(([k, v]) => { AR_LOOKUP[arNorm(k)] = v; });
Object.entries(AR_MODEL).forEach(([k, v]) => { AR_LOOKUP[arNorm(k)] = v; });

/* يحوّل الاستعلام العربي إلى مصطلحات الكتالوج الإنجليزية */
function translateQuery(q) {
  let out = arNorm(q);
  if (!/[\u0600-\u06FF]/.test(out)) return out;
  for (const key of AR_KEYS) {
    if (!key) continue;
    if (out.includes(key)) out = out.split(key).join(` ${AR_LOOKUP[key]} `);
  }
  return out.replace(/\s+/g, " ").trim();
}

/* الاسم العربي للعرض تحت النتيجة */
const EN_TO_AR_BRAND = {};
Object.entries(AR_BRAND).forEach(([a, e]) => { if (!EN_TO_AR_BRAND[e]) EN_TO_AR_BRAND[e] = a; });
const EN_TO_AR_MODEL = {};
Object.entries(AR_MODEL).forEach(([a, e]) => { if (!EN_TO_AR_MODEL[e]) EN_TO_AR_MODEL[e] = a; });
const arLabel = (brand, model) => {
  const b = EN_TO_AR_BRAND[brand], m = EN_TO_AR_MODEL[model];
  return b || m ? `${b || brand} ${m || model}` : "";
};

/* ===== src/h_car_deal.jsx ===== */




/* ============================================================================
   H CAR DEAL — BUY • COST • SELL • PROFIT
   ============================================================================
   ARCHITECTURE (كل قسم أدناه = ملف مستقل عند نقل المشروع لمستودع حقيقي)

     L1  design/tokens.js        — Design System
     L2  i18n/strings.js         — كل النصوص، لا نص مكتوب داخل الشاشات
     L3  data/vehicleModels.js   — قاعدة موديلات السيارات (مستقلة عن الصفقات)
     L4  data/imageLibrary.js    — مكتبة الصور + Manifest + Resolver
     L5  data/dealsRepository.js — تخزين الصفقات + CRUD + Soft delete
     L6  domain/profitEngine.js  — محرك الحسابات (مصدر وحيد للمعادلات)
     L7  domain/analytics.js     — التجميع والتحليلات
     L8  domain/validation.js    — التحقق من المدخلات
     L9  ui/components/*         — مكوّنات قابلة لإعادة الاستخدام
     L10 ui/screens/*            — الشاشات

   قاعدة: الشاشات لا تحسب شيئاً ولا تخزّن شيئاً — تستهلك L6/L7 وترسل عبر L5.
   ============================================================================ */

/* ← نُقل إلى src/design/tokens.js */

/* ← نُقل إلى src/auth/users.js */

/* ← نُقل إلى src/data/assets.js */

/* ← نُقل إلى src/storage/store.js */

/* ← نُقل إلى src/sound/engine.js */

/* ← نُقل إلى src/i18n/strings.js */

/* ← نُقل إلى src/data/arabic.js */

/* ==================== لوحة لصق المصاريف ==================== */
function PasteExpensesSheet({ deal, A, t, lang, ccy, onClose, flash }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [skipped, setSkipped] = useState([]);

  const run = () => {
    const r = parseExpenseNotes(text);
    setParsed(r.items); setSkipped(r.skipped);
    buzz(12);
  };

  const patch = (id, k, v) =>
    setParsed((a) => a.map((x) => (x.id === id ? { ...x, [k]: v } : x)));

  const chosen = (parsed || []).filter((x) => x.include);
  const total = chosen.reduce((s2, x) => s2 + num(x.amount), 0);

  const commit = () => {
    const rows = chosen.map((x) => mkExpense({
      category: x.cat,
      description: x.desc,
      amount: num(x.amount),
      status: x.done ? "completed" : "planned",
      paid: !!x.done,
      paidAt: x.done ? todayISO() : "",
      date: todayISO(),
      notes: "أُضيف بلصق الملاحظات",
    }));
    A.patchDeal(deal.dealId, { expenses: [...(deal.expenses || []), ...rows] });
    buzz(16); Sfx.money && Sfx.money();
    flash(`أُضيف ${rows.length} بند`);
    onClose();
  };

  const box = {
    width: "100%", minHeight: 190, borderRadius: RD.md, padding: 14,
    background: C.card2, border: `1px solid ${C.line}`, color: C.white,
    fontSize: 15, fontFamily: "inherit", outline: "none", resize: "vertical",
    lineHeight: 1.9, boxSizing: "border-box", textAlign: "start",
  };

  return (
    <BottomSheet onClose={onClose} title="لصق المصاريف من الملاحظات">
      {!parsed && (
        <>
          <p style={{ fontSize: 12.5, color: C.ink3, lineHeight: 1.9,
            marginBottom: 12, textAlign: "start" }}>
            الصق ملاحظاتك كما هي. يقرأ التطبيق كل سطر ويستخرج الوصف والمبلغ
            ويخمّن الفئة — ثم تراجعها قبل الإضافة.
          </p>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder={"- [x] تلميع ( 50 )\n- [x] الإطارات ( 50 )\nبترول 17"}
            style={box} />
          <ActionButton kind="primary" onClick={run}
            disabled={!text.trim()} style={{ marginTop: 14 }}>
            تحليل
          </ActionButton>
        </>
      )}

      {parsed && (
        <>
          <div style={{ display: "flex", alignItems: "baseline",
            marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, color: C.ink3 }}>
              {chosen.length} من {parsed.length} بنداً</span>
            <span style={{ flex: 1 }} />
            <span className="num" style={{ fontSize: 19, fontWeight: 800,
              color: C.gold }}>{money(total, ccy, { exact: true, fixed: true })}</span>
          </div>

          {parsed.map((x) => (
            <div key={x.id} className="card" style={{ padding: 12, marginBottom: 9,
              borderColor: x.warn ? C.redEdge : C.line,
              opacity: x.include ? 1 : 0.45 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span onClick={() => patch(x.id, "include", !x.include)}
                  role="button" style={{ width: 24, height: 24, borderRadius: 8,
                    flexShrink: 0, cursor: "pointer",
                    border: `1px solid ${x.include ? C.gold : C.line}`,
                    background: x.include ? C.gold : "transparent",
                    display: "grid", placeItems: "center" }}>
                  {x.include && <span style={{ color: C.onGold, fontSize: 14,
                    fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </span>
                <input value={x.desc}
                  onChange={(e) => patch(x.id, "desc", e.target.value)}
                  style={{ flex: 1, minWidth: 0, background: "transparent",
                    border: 0, color: C.white, fontSize: 13.5, fontWeight: 700,
                    fontFamily: "inherit", outline: "none", textAlign: "start" }} />
                <input value={x.amount} inputMode="decimal"
                  onChange={(e) => patch(x.id, "amount", e.target.value)}
                  className="num" style={{ width: 82, background: C.card2,
                    border: `1px solid ${C.line}`, borderRadius: 8, padding: "6px 8px",
                    color: C.gold, fontSize: 13.5, fontWeight: 800,
                    fontFamily: "inherit", outline: "none", textAlign: "center" }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8,
                marginTop: 9 }}>
                <select value={x.cat}
                  onChange={(e) => patch(x.id, "cat", e.target.value)}
                  style={{ flex: 1, minWidth: 0, background: C.card2,
                    border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 9px",
                    color: C.ink2, fontSize: 11.5, fontFamily: "inherit",
                    outline: "none" }}>
                  {Object.keys(EXPENSE_CATS).map((k) => (
                    <option key={k} value={k}>
                      {lang === "ar" ? EXPENSE_CATS[k].ar : EXPENSE_CATS[k].en}
                    </option>
                  ))}
                </select>
                <span onClick={() => patch(x.id, "done", !x.done)} role="button"
                  style={{ fontSize: 11, fontWeight: 700, cursor: "pointer",
                    padding: "7px 11px", borderRadius: 8,
                    border: `1px solid ${x.done ? C.greenEdge : C.line}`,
                    color: x.done ? C.green : C.ink3 }}>
                  {x.done ? "مدفوع" : "مخطط"}
                </span>
              </div>

              {x.warn && (
                <p style={{ fontSize: 11, color: C.red, marginTop: 9,
                  textAlign: "start", lineHeight: 1.7 }}>⚠️ {x.warn}</p>
              )}
            </div>
          ))}

          {skipped.length > 0 && (
            <div className="card" style={{ padding: 12, marginTop: 12,
              marginBottom: 12 }}>
              <div style={{ fontSize: 11.5, color: C.ink3, marginBottom: 8,
                textAlign: "start" }}>لم تُضف — {skipped.length}</div>
              {skipped.map((sk, i2) => (
                <p key={i2} style={{ fontSize: 11, color: C.ink4, lineHeight: 1.8,
                  textAlign: "start" }}>· {sk.line} — {sk.why}</p>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <ActionButton kind="quiet" onClick={() => { setParsed(null); }}
              style={{ flex: 1 }}>رجوع</ActionButton>
            <ActionButton kind="primary" onClick={commit}
              disabled={chosen.length === 0} style={{ flex: 2 }}>
              إضافة {chosen.length} بند
            </ActionButton>
          </div>
        </>
      )}
    </BottomSheet>
  );
}

/* ==================== L4d — لصق المصاريف من الملاحظات ====================
   يقرأ ملاحظاتك ويستخرج الوصف والمبلغ ويخمّن الفئة.
   لا يضيف شيئاً بلا مراجعتك — يعرض جدولاً تصححه أولاً.
   ======================================================================== */

/* كلمات تدل على سيارات أخرى — تُعلَّم ولا تُضاف تلقائياً */
const OTHER_CAR_WORDS = ["اتيما", "التيما", "ألتيما", "الاتيما", "كامري", "لكزس",
  "تشارجر", "شارجر", "شاحن", "موستانج", "باترول", "لاندكروزر", "لاند كروزر"];

/* تخمين الفئة من الوصف */
const CAT_HINTS = [
  ["bodywork",     ["سمكرة", "حكاك", "تسكير", "رفرف", "رفارف", "حوض", "بودي", "دعمية",
                    "بامبر", "صدر", "تصليح"]],
  ["paint",        ["صبغ", "دهان", "اندر سيل", "أندر سيل", "بوية"]],
  ["mechanical",   ["مقص", "مكينة", "محرك", "قير", "ماطور", "دينمو", "سير", "طرمبة",
                    "رديتر", "تبريد", "مساعد", "شوز", "بريك", "فرامل", "عفشة", "كلتش"]],
  ["electrical",   ["كهرب", "وايرات", "بلك", "بلكات", "فحمات", "دينمو", "سلف", "كمبيوتر"]],
  ["ac",           ["تكييف", "كمبريسر", "كندنسر", "فريون", "ايسي", "أيسي"]],
  ["tires",        ["اطار", "إطار", "تاير", "كفر", "بنشر"]],
  ["battery",      ["بطارية", "بطاريه"]],
  ["oil",          ["زيت", "ايل", "فلتر", "فلاتر"]],
  ["parts",        ["قطع", "كور", "مفتاح", "ليت", "عنبر", "رايبون", "قطعة", "غيار"]],
  ["detailing",    ["تلميع", "بوليش"]],
  ["cleaning",     ["غسيل", "تنظيف", "شامبو"]],
  ["inspection",   ["فحص", "كشف"]],
  ["insurance",    ["تامين", "تأمين"]],
  ["registration", ["مرور", "لوحات", "استمارة", "مخلص", "تحويل", "ملكية", "تسجيل"]],
  ["fuel",         ["بترول", "بنزين", "وقود", "ديزل"]],
  ["transport",    ["رايح", "راجع", "جسر", "توصيل", "نقل", "ونش", "سطحة"]],
  ["commission",   ["عمولة", "سعي"]],
  ["auction",      ["مزاد", "حراج"]],
  ["customs",      ["جمارك", "جمرك"]],
  ["importFees",   ["استيراد", "شحن"]],
];

function guessCat(desc) {
  const t = String(desc || "");
  for (const [cat, words] of CAT_HINTS) {
    for (const w of words) if (t.includes(w)) return cat;
  }
  return "other";
}

/* المحلّل — يقبل صيغاً متعددة */
function parseExpenseNotes(text) {
  const items = [];
  const skipped = [];
  const lines = String(text || "").split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    /* سعر الشراء — لا يُضاف كمصروف */
    const buy = line.match(/^\s*(?:الشراء|سعر الشراء|شراء)\s*[:：]?\s*(\d+(?:[.,]\d+)?)/);
    if (buy) {
      skipped.push({ line, why: "سعر الشراء — يُضبط من شاشة السيارة" });
      continue;
    }

    /* نزع علامات القوائم: - [x]  ·  -  ·  •  ·  1. */
    let body = line
      .replace(/^\s*[-*•]\s*\[\s*[xX✓ ]?\s*\]\s*/, "")
      .replace(/^\s*[-*•]\s+/, "")
      .replace(/^\s*\d+[.)]\s+/, "")
      .trim();

    const done = /\[\s*[xX✓]\s*\]/.test(line);

    /* المبلغ: داخل قوسين أولاً، وإلا آخر رقم في السطر */
    let amt = null;
    const inParens = body.match(/\(\s*(-?\d+(?:[.,]\d+)?)\s*-?\s*\)/g);
    if (inParens && inParens.length) {
      const last = inParens[inParens.length - 1];
      amt = parseFloat(last.replace(/[()\s-]/g, "").replace(",", "."));
      body = body.replace(new RegExp(last.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "");
    } else {
      const tail = body.match(/(-?\d+(?:[.,]\d+)?)\s*(?:د\.?ب?|ريال|درهم)?\s*$/);
      if (tail) {
        amt = parseFloat(tail[1].replace(",", "."));
        body = body.slice(0, tail.index);
      }
    }

    let desc = body.replace(/\s+/g, " ").trim().replace(/^[.،,\-–—:]+|[.،,\-–—:()]+$/g, "").trim();

    if (amt === null || !isFinite(amt)) {
      if (desc) skipped.push({ line: desc, why: "لا يوجد مبلغ" });
      continue;
    }
    if (!desc) desc = "بند";

    const flag = OTHER_CAR_WORDS.find((w) => desc.includes(w));
    items.push({
      id: uid(), desc, amount: Math.abs(amt), cat: guessCat(desc),
      done, include: !flag,
      warn: flag ? `يذكر «${flag}» — سيارة أخرى؟` : null,
    });
  }
  return { items, skipped };
}

/* ==================== L4c — BRAND BADGES ==================================
   الشعارات الرسمية للوكالات علامات تجارية مسجّلة ولا تُستنسخ داخل التطبيق.
   نعرض بدلها شارة بحروف الوكالة بلونها المميز، ويمكن للمستخدم رفع
   الشعار الرسمي بنفسه (إن كان يملك حق استخدامه) فيحل محل الشارة.
   ========================================================================== */
const BRAND_COLORS = {
  Toyota: "#D8232A", Lexus: "#8B9096", Nissan: "#C3002F", Infiniti: "#4A4F55",
  GMC: "#C8102E", Chevrolet: "#D1A64B", Cadillac: "#9B1B30", Ford: "#1B57A5",
  Dodge: "#B4121B", Jeep: "#3E5F3A", BMW: "#2E6DB4", "Mercedes-Benz": "#A6AAAE",
  Audi: "#BB0A30", Porsche: "#C9A227", "Land Rover": "#2E5B33", Jaguar: "#2E5C8A",
  Honda: "#CC0000", Hyundai: "#1F4E8C", Kia: "#B31B34", Genesis: "#8C7B5A",
  Mitsubishi: "#D01029", Mazda: "#1F3A6E", Subaru: "#2A4E9B", Suzuki: "#123A75",
  Volkswagen: "#1B58A5", Volvo: "#2A3D57", Tesla: "#CC0000", Peugeot: "#1F3D6B",
  Renault: "#D6B60C", Chery: "#C41E2B", MG: "#B01B2E", Haval: "#B8231F",
  Changan: "#2F5FA8", Geely: "#2B6BB0", BYD: "#C21E28", Isuzu: "#B01C25",
  Mini: "#2B2B2B", Bentley: "#20493C", "Rolls-Royce": "#4A1F2E", Ferrari: "#D40000",
  Lamborghini: "#C8A415", McLaren: "#F26522", "Aston Martin": "#1F6B5A",
  Maserati: "#1B3A6B", "Alfa Romeo": "#8E1B2E", Lincoln: "#3A4750",
  Chrysler: "#2B4C7E", Skoda: "#1B7A54", Citroen: "#B01C25", Fiat: "#8E1B2E",
  Opel: "#C8A415", Jetour: "#2F7A8C", Exeed: "#4A5B8C", GAC: "#1F4E8C",
  "Great Wall": "#A8232B", Hongqi: "#C1121F", Bestune: "#2B5FA8", JAC: "#1F5FA8",
  Datsun: "#1B4F8C", Daihatsu: "#C41E2B",
};

function brandInitials(name) {
  const n = String(name || "").trim();
  if (!n) return "?";
  if (/^[A-Z]{2,4}$/.test(n.replace(/[^A-Za-z]/g, ""))
      && n.replace(/[^A-Za-z]/g, "").length <= 3) return n.replace(/[^A-Za-z]/g, "");
  const parts = n.split(/[\s-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return n.slice(0, 2).toUpperCase();
}

/* يطابق اسم الملف بوكالة من الكتالوج */
function matchBrandByFile(fileName) {
  const base = norm(String(fileName).replace(/\.[^.]+$/, "")).replace(/[^a-z0-9 ]+/g, " ").trim();
  if (!base) return null;
  const brands = Object.keys(CATALOG);
  let best = null;
  for (const b of brands) {
    const nb = norm(b).replace(/[^a-z0-9 ]+/g, " ").trim();
    if (base === nb) return b;
    if (base.startsWith(nb) || nb.startsWith(base)) {
      if (!best || nb.length > norm(best).length) best = b;
    }
  }
  return best;
}

/* يطابق اسم الملف بموديل: brand_model_year */
function matchModelByFile(fileName) {
  const base = norm(String(fileName).replace(/\.[^.]+$/, "")).replace(/[^a-z0-9 ]+/g, " ").trim();
  if (!base) return null;
  const yearM = base.match(/\b(19|20)\d{2}\b/);
  const year = yearM ? yearM[0] : null;
  const text = base.replace(/\b(19|20)\d{2}\b/g, " ").replace(/\s+/g, " ").trim();
  let best = null, bestLen = 0;
  for (const r of CATALOG_ROWS) {
    const nb = norm(r.brand).replace(/[^a-z0-9 ]+/g, " ").trim();
    const nm = norm(r.model).replace(/[^a-z0-9 ]+/g, " ").trim();
    if (!text.includes(nb) || !text.includes(nm)) continue;
    if (year && (+year < r.from || +year > r.to)) continue;
    const score = nb.length + nm.length;
    if (score > bestLen) { bestLen = score; best = { row: r, year: year || String(r.to) }; }
  }
  return best;
}

function BrandBadge({ brand, size = 38, logos }) {
  const url = logos?.[brand];
  const col = BRAND_COLORS[brand] || C.ink3;
  if (url) {
    return (
      <span style={{ width: size, height: size, borderRadius: 26, flexShrink: 0,
        background: "#fff", display: "grid", placeItems: "center", overflow: "hidden",
        border: `1px solid ${C.line}` }}>
        <img src={url} alt="" style={{ width: "78%", height: "78%", objectFit: "contain" }} />
      </span>
    );
  }
  return (
    <span style={{ width: size, height: size, borderRadius: 26, flexShrink: 0,
      display: "grid", placeItems: "center", position: "relative",
      background: `linear-gradient(150deg,${col}, ${col}88)`,
      border: `1px solid ${C.line}`,
      boxShadow: `0 2px 10px ${col}44, inset 0 1px 0 ${C.hairline}` }}>
      <span style={{ font: `800 ${Math.round(size * 0.36)}px 'Inter',sans-serif`,
        color: "#fff", letterSpacing: ".02em", direction: "ltr" }}>
        {brandInitials(brand)}
      </span>
    </span>
  );
}

/* ==================== L3b — GLOBAL CAR CATALOG ============================
   بدل تخزين مئات الآلاف من السجلات، نخزّن الكتالوج مضغوطاً ونولّد
   VehicleModel عند الاختيار فقط (البندان 57 و58).
   الصيغة: "Model|body|cylinders|drive|yearFrom-yearTo"
   ========================================================================== */
const CATALOG = {"Toyota":"Land Cruiser|suv|6|4WD|1990-2026;Prado|suv|6|4WD|1996-2026;Hilux|pickup|4|4WD|1990-2026;Camry|sedan|4|FWD|1990-2026;Corolla|sedan|4|FWD|1990-2026;Yaris|hatch|4|FWD|2000-2026;Avalon|sedan|6|FWD|1995-2022;RAV4|suv|4|AWD|1996-2026;Fortuner|suv|4|4WD|2005-2026;FJ Cruiser|suv|6|4WD|2007-2023;Highlander|suv|6|AWD|2001-2026;Sequoia|suv|8|4WD|2001-2026;Tundra|pickup|8|4WD|2000-2026;Tacoma|pickup|6|4WD|1995-2026;Supra|coupe|6|RWD|1993-2026;GR86|coupe|4|RWD|2022-2026;Previa|van|4|FWD|1990-2019;Hiace|van|4|RWD|1990-2026;Coaster|van|4|RWD|1993-2026;Rush|suv|4|RWD|2006-2026;Raize|suv|3|FWD|2019-2026;Crown|sedan|6|RWD|1995-2026;bZ4X|suv|0|AWD|2022-2026","Lexus":"LX|suv|8|4WD|1996-2026;GX|suv|8|4WD|2003-2026;LS|sedan|8|RWD|1990-2026;ES|sedan|6|FWD|1992-2026;IS|sedan|6|RWD|1999-2026;GS|sedan|6|RWD|1993-2020;RX|suv|6|AWD|1998-2026;NX|suv|4|AWD|2014-2026;UX|suv|4|FWD|2018-2026;RC|coupe|6|RWD|2014-2026;LC|coupe|8|RWD|2017-2026;RZ|suv|0|AWD|2022-2026","Nissan":"Patrol|suv|8|4WD|1990-2026;GT-R|coupe|6|AWD|2008-2024;Altima|sedan|4|FWD|1993-2026;Maxima|sedan|6|FWD|1990-2023;Sunny|sedan|4|FWD|1990-2026;Sentra|sedan|4|FWD|1990-2026;X-Trail|suv|4|AWD|2001-2026;Pathfinder|suv|6|4WD|1990-2026;Armada|suv|8|4WD|2004-2026;Navara|pickup|4|4WD|1997-2026;Kicks|suv|4|FWD|2016-2026;Juke|suv|4|FWD|2010-2026;Murano|suv|6|AWD|2003-2026;370Z|coupe|6|RWD|2009-2020;Z|coupe|6|RWD|2023-2026;Urvan|van|4|RWD|1990-2026;Ariya|suv|0|AWD|2022-2026","Infiniti":"QX80|suv|8|4WD|2014-2026;QX70|suv|6|AWD|2013-2017;QX60|suv|6|AWD|2013-2026;QX56|suv|8|4WD|2004-2013;QX50|suv|4|AWD|2019-2026;Q50|sedan|6|RWD|2014-2026;Q60|coupe|6|RWD|2017-2022;Q70|sedan|6|RWD|2014-2019;FX35|suv|6|AWD|2003-2013","GMC":"Sierra|pickup|8|4WD|1990-2026;Yukon|suv|8|4WD|1992-2026;Yukon XL|suv|8|4WD|1992-2026;Acadia|suv|6|AWD|2007-2026;Terrain|suv|4|AWD|2010-2026;Canyon|pickup|6|4WD|2004-2026;Savana|van|8|RWD|1996-2026;Hummer EV|pickup|0|AWD|2022-2026","Chevrolet":"Tahoe|suv|8|4WD|1995-2026;Suburban|suv|8|4WD|1990-2026;Silverado|pickup|8|4WD|1999-2026;Camaro|coupe|8|RWD|1993-2024;Corvette|coupe|8|RWD|1990-2026;Malibu|sedan|4|FWD|1997-2025;Impala|sedan|6|FWD|1994-2020;Traverse|suv|6|AWD|2009-2026;Blazer|suv|6|AWD|1995-2026;Captiva|suv|4|FWD|2006-2026;Cruze|sedan|4|FWD|2009-2023;Trailblazer|suv|3|FWD|2002-2026;Groove|suv|4|FWD|2020-2026","Cadillac":"Escalade|suv|8|4WD|1999-2026;CT5|sedan|4|RWD|2020-2026;CT4|sedan|4|RWD|2020-2026;XT5|suv|6|AWD|2017-2026;XT6|suv|6|AWD|2020-2026;SRX|suv|6|AWD|2004-2016;CTS|sedan|6|RWD|2003-2019;Lyriq|suv|0|AWD|2023-2026","Ford":"F-150|pickup|8|4WD|1990-2026;Ranger|pickup|4|4WD|1998-2026;Expedition|suv|8|4WD|1997-2026;Explorer|suv|6|4WD|1991-2026;Edge|suv|6|AWD|2007-2024;Escape|suv|4|AWD|2001-2026;Mustang|coupe|8|RWD|1990-2026;Bronco|suv|6|4WD|2021-2026;Taurus|sedan|6|FWD|1990-2026;Focus|hatch|4|FWD|2000-2025;Fusion|sedan|4|FWD|2006-2020;Territory|suv|4|FWD|2019-2026;Transit|van|4|RWD|1990-2026","Dodge":"Charger|sedan|8|RWD|2006-2026;Challenger|coupe|8|RWD|2008-2024;Durango|suv|8|4WD|1998-2026;RAM 1500|pickup|8|4WD|1994-2026;Journey|suv|6|FWD|2009-2020;Neon|sedan|4|FWD|2016-2023","Jeep":"Wrangler|suv|6|4WD|1990-2026;Grand Cherokee|suv|8|4WD|1993-2026;Cherokee|suv|6|4WD|1990-2026;Compass|suv|4|4WD|2007-2026;Gladiator|pickup|6|4WD|2020-2026;Renegade|suv|4|4WD|2015-2026;Wagoneer|suv|8|4WD|2022-2026","BMW":"M4|coupe|6|RWD|2015-2026;M3|sedan|6|RWD|1992-2026;M5|sedan|8|AWD|1990-2026;M2|coupe|6|RWD|2016-2026;3 Series|sedan|4|RWD|1990-2026;5 Series|sedan|6|RWD|1990-2026;7 Series|sedan|8|RWD|1990-2026;8 Series|coupe|8|AWD|2019-2026;X1|suv|4|AWD|2010-2026;X3|suv|4|AWD|2004-2026;X5|suv|6|AWD|1999-2026;X6|suv|6|AWD|2008-2026;X7|suv|6|AWD|2019-2026;i4|sedan|0|RWD|2022-2026;iX|suv|0|AWD|2022-2026;Z4|convertible|4|RWD|2003-2026","Mercedes-Benz":"C-Class|sedan|4|RWD|1993-2026;E-Class|sedan|6|RWD|1990-2026;S-Class|sedan|8|RWD|1990-2026;G-Class|suv|8|4WD|1990-2026;A-Class|hatch|4|FWD|2013-2026;CLA|sedan|4|FWD|2013-2026;CLS|sedan|6|RWD|2005-2023;GLA|suv|4|AWD|2014-2026;GLC|suv|4|AWD|2016-2026;GLE|suv|6|AWD|2016-2026;GLS|suv|8|AWD|2017-2026;ML|suv|6|AWD|1998-2015;AMG GT|coupe|8|RWD|2015-2026;EQS|sedan|0|AWD|2022-2026;V-Class|van|4|RWD|2015-2026;Sprinter|van|4|RWD|1995-2026","Audi":"A3|hatch|4|FWD|1997-2026;A4|sedan|4|AWD|1995-2026;A5|coupe|4|AWD|2008-2026;A6|sedan|6|AWD|1995-2026;A7|sedan|6|AWD|2011-2026;A8|sedan|8|AWD|1995-2026;Q3|suv|4|AWD|2012-2026;Q5|suv|4|AWD|2009-2026;Q7|suv|6|AWD|2006-2026;Q8|suv|6|AWD|2019-2026;RS6|wagon|8|AWD|2003-2026;RS7|sedan|8|AWD|2014-2026;TT|coupe|4|AWD|1999-2023;e-tron|suv|0|AWD|2019-2026","Porsche":"911|coupe|6|RWD|1990-2026;Cayenne|suv|6|AWD|2003-2026;Macan|suv|4|AWD|2015-2026;Panamera|sedan|6|AWD|2010-2026;Taycan|sedan|0|AWD|2020-2026;Boxster|convertible|6|RWD|1997-2026;Cayman|coupe|6|RWD|2006-2026","Land Rover":"Range Rover|suv|8|4WD|1990-2026;Range Rover Sport|suv|6|4WD|2006-2026;Range Rover Velar|suv|4|4WD|2018-2026;Evoque|suv|4|4WD|2012-2026;Discovery|suv|6|4WD|1990-2026;Defender|suv|6|4WD|1990-2026","Jaguar":"F-Pace|suv|4|AWD|2017-2026;XF|sedan|4|RWD|2008-2026;XE|sedan|4|RWD|2015-2024;F-Type|coupe|6|RWD|2014-2024;I-Pace|suv|0|AWD|2019-2026","Honda":"Accord|sedan|4|FWD|1990-2026;Civic|sedan|4|FWD|1990-2026;CR-V|suv|4|AWD|1997-2026;Pilot|suv|6|AWD|2003-2026;Odyssey|van|6|FWD|1995-2026;HR-V|suv|4|FWD|2016-2026;City|sedan|4|FWD|1996-2026;Ridgeline|pickup|6|AWD|2006-2026;ZR-V|suv|4|AWD|2023-2026","Hyundai":"Elantra|sedan|4|FWD|1990-2026;Sonata|sedan|4|FWD|1990-2026;Accent|sedan|4|FWD|1995-2026;Tucson|suv|4|AWD|2005-2026;Santa Fe|suv|4|AWD|2001-2026;Palisade|suv|6|AWD|2019-2026;Creta|suv|4|FWD|2015-2026;Azera|sedan|6|FWD|2006-2022;Genesis|sedan|6|RWD|2009-2016;Staria|van|4|FWD|2021-2026;Ioniq 5|suv|0|AWD|2022-2026;Venue|suv|4|FWD|2020-2026","Kia":"Optima|sedan|4|FWD|2001-2020;K5|sedan|4|FWD|2021-2026;Cerato|sedan|4|FWD|2004-2026;Sportage|suv|4|AWD|1995-2026;Sorento|suv|4|AWD|2003-2026;Telluride|suv|6|AWD|2020-2026;Carnival|van|6|FWD|1999-2026;Rio|sedan|4|FWD|2000-2026;Seltos|suv|4|FWD|2020-2026;Stinger|sedan|6|RWD|2018-2023;EV6|suv|0|AWD|2022-2026;Pegas|sedan|4|FWD|2018-2026","Genesis":"G70|sedan|4|RWD|2019-2026;G80|sedan|6|RWD|2017-2026;G90|sedan|6|RWD|2017-2026;GV70|suv|4|AWD|2021-2026;GV80|suv|6|AWD|2021-2026","Mitsubishi":"Pajero|suv|6|4WD|1990-2026;Montero Sport|suv|6|4WD|2016-2026;L200|pickup|4|4WD|1990-2026;Lancer|sedan|4|FWD|1990-2026;Outlander|suv|4|AWD|2003-2026;Attrage|sedan|3|FWD|2014-2026;Eclipse Cross|suv|4|AWD|2018-2026;Xpander|van|4|FWD|2018-2026","Mazda":"3|sedan|4|FWD|2004-2026;6|sedan|4|FWD|2003-2026;CX-3|suv|4|FWD|2016-2026;CX-5|suv|4|AWD|2013-2026;CX-9|suv|4|AWD|2007-2023;CX-60|suv|6|AWD|2023-2026;CX-90|suv|6|AWD|2024-2026;MX-5|convertible|4|RWD|1990-2026","Subaru":"Impreza|sedan|4|AWD|1993-2026;WRX|sedan|4|AWD|2002-2026;Forester|suv|4|AWD|1998-2026;Outback|wagon|4|AWD|1996-2026;XV|suv|4|AWD|2012-2026;BRZ|coupe|4|RWD|2013-2026","Suzuki":"Swift|hatch|4|FWD|1990-2026;Vitara|suv|4|AWD|1990-2026;Grand Vitara|suv|4|AWD|1998-2026;Jimny|suv|4|4WD|1990-2026;Baleno|hatch|4|FWD|1995-2026;Ertiga|van|4|FWD|2012-2026;Dzire|sedan|4|FWD|2008-2026","Volkswagen":"Golf|hatch|4|FWD|1990-2026;Jetta|sedan|4|FWD|1990-2026;Passat|sedan|4|FWD|1990-2026;Tiguan|suv|4|AWD|2008-2026;Touareg|suv|6|AWD|2003-2026;Teramont|suv|6|AWD|2018-2026;Polo|hatch|4|FWD|1994-2026;ID.4|suv|0|AWD|2021-2026","Volvo":"XC40|suv|4|AWD|2018-2026;XC60|suv|4|AWD|2009-2026;XC90|suv|4|AWD|2003-2026;S60|sedan|4|AWD|2001-2026;S90|sedan|4|AWD|2017-2026;EX30|suv|0|AWD|2024-2026","Tesla":"Model 3|sedan|0|AWD|2018-2026;Model Y|suv|0|AWD|2020-2026;Model S|sedan|0|AWD|2013-2026;Model X|suv|0|AWD|2016-2026;Cybertruck|pickup|0|AWD|2024-2026","Peugeot":"208|hatch|4|FWD|2013-2026;308|hatch|4|FWD|2008-2026;3008|suv|4|FWD|2010-2026;5008|suv|4|FWD|2010-2026;301|sedan|4|FWD|2013-2026;508|sedan|4|FWD|2011-2026","Renault":"Duster|suv|4|4WD|2012-2026;Koleos|suv|4|AWD|2009-2026;Megane|hatch|4|FWD|1996-2026;Symbol|sedan|4|FWD|2000-2026;Captur|suv|4|FWD|2014-2026;Talisman|sedan|4|FWD|2016-2023","Chery":"Tiggo 4|suv|4|FWD|2018-2026;Tiggo 7|suv|4|FWD|2017-2026;Tiggo 8|suv|4|AWD|2019-2026;Arrizo 5|sedan|4|FWD|2017-2026;Arrizo 6|sedan|4|FWD|2019-2026;Tiggo 2|suv|4|FWD|2017-2026","MG":"MG5|sedan|4|FWD|2020-2026;MG6|sedan|4|FWD|2018-2026;ZS|suv|4|FWD|2018-2026;HS|suv|4|AWD|2019-2026;RX5|suv|4|FWD|2017-2026;RX8|suv|4|4WD|2019-2026;GT|sedan|4|FWD|2022-2026;Marvel R|suv|0|AWD|2022-2026","Haval":"Jolion|suv|4|FWD|2021-2026;H6|suv|4|AWD|2012-2026;H9|suv|4|4WD|2015-2026;Dargo|suv|4|AWD|2021-2026","Changan":"CS35|suv|4|FWD|2013-2026;CS75|suv|4|AWD|2014-2026;CS85|suv|4|AWD|2019-2026;Eado|sedan|4|FWD|2012-2026;Alsvin|sedan|4|FWD|2019-2026;UNI-T|suv|4|FWD|2021-2026","Geely":"Coolray|suv|3|FWD|2019-2026;Azkarra|suv|4|AWD|2020-2026;Emgrand|sedan|4|FWD|2010-2026;Okavango|suv|3|FWD|2021-2026;Tugella|suv|4|AWD|2020-2026","BYD":"Song|suv|0|AWD|2020-2026;Han|sedan|0|AWD|2021-2026;Tang|suv|0|AWD|2019-2026;Atto 3|suv|0|FWD|2022-2026;Seal|sedan|0|AWD|2023-2026;Dolphin|hatch|0|FWD|2022-2026","Isuzu":"D-Max|pickup|4|4WD|2003-2026;MU-X|suv|4|4WD|2014-2026;NPR|van|4|RWD|1990-2026","Mini":"Cooper|hatch|4|FWD|2002-2026;Countryman|suv|4|AWD|2011-2026;Clubman|wagon|4|AWD|2008-2024","Bentley":"Continental GT|coupe|8|AWD|2004-2026;Bentayga|suv|8|AWD|2016-2026;Flying Spur|sedan|8|AWD|2006-2026","Rolls-Royce":"Ghost|sedan|12|AWD|2010-2026;Phantom|sedan|12|RWD|2003-2026;Cullinan|suv|12|AWD|2019-2026;Wraith|coupe|12|RWD|2014-2023","Ferrari":"488|coupe|8|RWD|2016-2020;F8|coupe|8|RWD|2020-2023;296|coupe|6|RWD|2022-2026;Roma|coupe|8|RWD|2021-2026;Purosangue|suv|12|AWD|2023-2026;812|coupe|12|RWD|2018-2024","Lamborghini":"Huracan|coupe|10|AWD|2015-2026;Aventador|coupe|12|AWD|2012-2022;Urus|suv|8|AWD|2019-2026;Revuelto|coupe|12|AWD|2024-2026","McLaren":"720S|coupe|8|RWD|2018-2023;570S|coupe|8|RWD|2016-2021;Artura|coupe|6|RWD|2022-2026;750S|coupe|8|RWD|2024-2026","Aston Martin":"DB11|coupe|8|RWD|2017-2023;DBX|suv|8|AWD|2020-2026;Vantage|coupe|8|RWD|2019-2026;DB12|coupe|8|RWD|2024-2026","Maserati":"Ghibli|sedan|6|RWD|2014-2024;Levante|suv|6|AWD|2017-2026;Quattroporte|sedan|8|RWD|2013-2026;Grecale|suv|4|AWD|2023-2026","Alfa Romeo":"Giulia|sedan|4|RWD|2017-2026;Stelvio|suv|4|AWD|2018-2026;Tonale|suv|4|AWD|2023-2026","Lincoln":"Navigator|suv|6|4WD|1998-2026;Aviator|suv|6|AWD|2020-2026;Nautilus|suv|4|AWD|2019-2026;MKZ|sedan|4|FWD|2007-2020","Chrysler":"300C|sedan|8|RWD|2005-2023;Pacifica|van|6|AWD|2017-2026","Skoda":"Octavia|sedan|4|FWD|1998-2026;Superb|sedan|4|AWD|2002-2026;Kodiaq|suv|4|AWD|2017-2026;Karoq|suv|4|AWD|2018-2026","Citroen":"C3|hatch|4|FWD|2002-2026;C4|hatch|4|FWD|2005-2026;C5 Aircross|suv|4|FWD|2019-2026","Fiat":"500|hatch|4|FWD|2008-2026;Tipo|sedan|4|FWD|2016-2026","Opel":"Astra|hatch|4|FWD|1991-2026;Insignia|sedan|4|FWD|2009-2022;Grandland|suv|4|FWD|2018-2026","Jetour":"X70|suv|4|FWD|2019-2026;X90|suv|4|AWD|2020-2026;Dashing|suv|4|FWD|2023-2026;T2|suv|4|4WD|2024-2026","Exeed":"TXL|suv|4|AWD|2021-2026;VX|suv|4|AWD|2022-2026;LX|suv|4|FWD|2021-2026","GAC":"GS3|suv|4|FWD|2018-2026;GS4|suv|4|FWD|2016-2026;GS8|suv|4|AWD|2018-2026;Empow|sedan|4|FWD|2022-2026","Great Wall":"Poer|pickup|4|4WD|2021-2026;Wingle|pickup|4|4WD|2010-2026","Hongqi":"H9|sedan|4|RWD|2021-2026;HS5|suv|4|AWD|2021-2026;E-HS9|suv|0|AWD|2022-2026","Bestune":"T77|suv|4|FWD|2020-2026;T99|suv|4|AWD|2021-2026","JAC":"S4|suv|4|FWD|2019-2026;T8|pickup|4|4WD|2020-2026","Datsun":"Go|hatch|4|FWD|2014-2022","Daihatsu":"Terios|suv|4|4WD|1997-2026;Gran Max|van|4|RWD|2008-2026"};

const BODY_AR = { sedan: "صالون", suv: "دفع رباعي", pickup: "بيك أب", coupe: "كوبيه",
  hatch: "هاتشباك", van: "فان", wagon: "ستيشن", convertible: "مكشوفة" };
const BODY_EN = { sedan: "Sedan", suv: "SUV", pickup: "Pickup", coupe: "Coupe",
  hatch: "Hatchback", van: "Van", wagon: "Wagon", convertible: "Convertible" };

const TRIMS = ["Base", "Mid", "Full Option", "Sport", "GT", "Limited", "Platinum",
  "Luxury", "Premium", "Titanium", "Denali", "AMG", "M Sport", "S-Line", "TRD",
  "Nismo", "SRT", "R/T", "Type-S", "LE", "SE", "XLE", "VXR", "GXR"];

/* يفك الكتالوج مرة واحدة إلى صفوف قابلة للبحث */
const CATALOG_ROWS = (() => {
  const out = [];
  for (const brand of Object.keys(CATALOG)) {
    for (const raw of CATALOG[brand].split(";")) {
      const [model, body, cyl, drive, span] = raw.split("|");
      const [from, to] = (span || "").split("-").map((x) => parseInt(x, 10));
      out.push({ brand, model, body, cylinders: cyl === "0" ? "" : cyl,
        fuel: cyl === "0" ? "Electric" : "Petrol", drive,
        from: from || 1990, to: to || new Date().getFullYear() });
    }
  }
  return out;
})();

/* البند 8: بحث على الوكالة والموديل والسنة */
function searchCatalog(q, limit = 60) {
  const s = norm(translateQuery(q));
  if (!s) return CATALOG_ROWS.slice(0, limit);
  const words = s.split(" ").filter(Boolean);
  const yearWord = words.find((w) => /^(19|20)\d{2}$/.test(w));
  const textWords = words.filter((w) => w !== yearWord);
  const hits = CATALOG_ROWS.filter((r) => {
    const hay = norm(`${r.brand} ${r.model}`);
    const textOk = textWords.every((w) => hay.includes(w));
    const yearOk = !yearWord || (+yearWord >= r.from && +yearWord <= r.to);
    return textOk && yearOk;
  });
  return hits.slice(0, limit).map((r) => (yearWord ? { ...r, pickYear: +yearWord } : r));
}

const yearsOf = (row) => {
  const out = [];
  for (let y = row.to; y >= row.from; y--) out.push(String(y));
  return out;
};

/* يبني VehicleModel من صف الكتالوج عند الاختيار — ويعيد استخدام الموجود */
function materializeModel(row, year, trim, existing) {
  const found = existing.find((m) => norm(m.brand) === norm(row.brand)
    && norm(m.model) === norm(row.model) && String(m.year) === String(year)
    && norm(m.trim || "") === norm(trim || ""));
  if (found) return found;
  return mkModel({
    brand: row.brand, model: row.model, year: String(year), trim: trim || "",
    bodyType: row.body, cylinders: row.cylinders, fuel: row.fuel, drive: row.drive,
    transmission: "Automatic",
    engine: row.cylinders ? `${row.cylinders}-cyl` : "Electric",
  });
}

/* ==================== L4b — REMOTE IMAGE RESOLUTION =======================
   لمكتبة صور بحجم آلاف السيارات: استضفها على CDN بالاصطلاح التالي
     {BASE}/{brand}/{model}/{year}/front_3_4.webp
   وحدّد BASE من الإعدادات. لا تعديل على أي شاشة.
   ========================================================================== */
let IMAGE_BASE = "";
const setImageBase = (v) => { IMAGE_BASE = String(v || "").replace(/\/+$/, ""); };
const slugPart = (v) => norm(v).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

function remoteImageUrl(m, view = "front_3_4") {
  if (!IMAGE_BASE || !m?.brand || !m?.model) return "";
  const seg = [slugPart(m.brand), slugPart(m.model), m.year && String(m.year)].filter(Boolean);
  return `${IMAGE_BASE}/${seg.join("/")}/${view}.webp`;
}

/* ========================= L3 — VEHICLE MODEL DATABASE =====================
   موديلات السيارات مستقلة تماماً عن الصفقات (البند 1 و2).
   شراء نفس الموديل مرتين = صفقتان تشيران لنفس vehicleModelId.
   ========================================================================== */
const mkModel = (o = {}) => ({
  vehicleModelId: o.vehicleModelId || uid("vm"),
  brand: "", model: "", year: "", trim: "",
  bodyType: "", engine: "", engineSize: "", cylinders: "",
  transmission: "", fuel: "", drive: "", horsepower: "", doors: "", seats: "",
  region: "GCC", createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

const SEED_MODELS = () => [
  mkModel({ vehicleModelId: "vm_dodge_charger_2024_rt", brand: "Dodge", model: "Charger",
    year: "2024", trim: "R/T Scat Pack", bodyType: "Sedan", engine: "6.4L V8",
    engineSize: "6.4L", cylinders: "8", transmission: "Automatic", fuel: "Petrol",
    drive: "RWD", horsepower: "485", doors: "4", seats: "5" }),
  mkModel({ vehicleModelId: "vm_gmc_sierra_2014_sle", brand: "GMC", model: "Sierra",
    year: "2014", trim: "SLE", bodyType: "Pickup", engine: "5.3L V8", engineSize: "5.3L",
    cylinders: "8", transmission: "Automatic", fuel: "Petrol", drive: "4WD",
    horsepower: "355", doors: "4", seats: "5" }),
  mkModel({ vehicleModelId: "vm_nissan_gtr_2013", brand: "Nissan", model: "GT-R",
    year: "2013", trim: "Premium", bodyType: "Coupe", engine: "3.8L V6 Twin-Turbo",
    engineSize: "3.8L", cylinders: "6", transmission: "Automatic", fuel: "Petrol",
    drive: "AWD", horsepower: "545", doors: "2", seats: "4" }),
  mkModel({ vehicleModelId: "vm_toyota_lc_2025_vxr", brand: "Toyota", model: "Land Cruiser",
    year: "2025", trim: "VXR", bodyType: "SUV", engine: "3.5L V6 Twin-Turbo",
    engineSize: "3.5L", cylinders: "6", transmission: "Automatic", fuel: "Petrol",
    drive: "4WD", horsepower: "409", doors: "5", seats: "7" }),
  mkModel({ vehicleModelId: "vm_bmw_m4_2024", brand: "BMW", model: "M4", year: "2024",
    trim: "Competition", bodyType: "Coupe", engine: "3.0L I6 Twin-Turbo", engineSize: "3.0L",
    cylinders: "6", transmission: "Automatic", fuel: "Petrol", drive: "RWD",
    horsepower: "503", doors: "2", seats: "4" }),
  mkModel({ vehicleModelId: "vm_lexus_lx600_2025", brand: "Lexus", model: "LX600",
    year: "2025", trim: "Luxury", bodyType: "SUV", engine: "3.5L V6 Twin-Turbo",
    engineSize: "3.5L", cylinders: "6", transmission: "Automatic", fuel: "Petrol",
    drive: "4WD", horsepower: "409", doors: "5", seats: "7" }),
  mkModel({ vehicleModelId: "vm_nissan_patrol_2024", brand: "Nissan", model: "Patrol",
    year: "2024", trim: "LE Platinum", bodyType: "SUV", engine: "5.6L V8", engineSize: "5.6L",
    cylinders: "8", transmission: "Automatic", fuel: "Petrol", drive: "4WD",
    horsepower: "400", doors: "5", seats: "7" }),
  mkModel({ vehicleModelId: "vm_toyota_camry_2023", brand: "Toyota", model: "Camry",
    year: "2023", trim: "GLE", bodyType: "Sedan", engine: "2.5L I4", engineSize: "2.5L",
    cylinders: "4", transmission: "Automatic", fuel: "Petrol", drive: "FWD",
    horsepower: "203", doors: "4", seats: "5" }),
  mkModel({ vehicleModelId: "vm_ford_mustang_2024", brand: "Ford", model: "Mustang",
    year: "2024", trim: "GT", bodyType: "Coupe", engine: "5.0L V8", engineSize: "5.0L",
    cylinders: "8", transmission: "Automatic", fuel: "Petrol", drive: "RWD",
    horsepower: "486", doors: "2", seats: "4" }),
  mkModel({ vehicleModelId: "vm_chevy_camaro_2023", brand: "Chevrolet", model: "Camaro",
    year: "2023", trim: "SS", bodyType: "Coupe", engine: "6.2L V8", engineSize: "6.2L",
    cylinders: "8", transmission: "Automatic", fuel: "Petrol", drive: "RWD",
    horsepower: "455", doors: "2", seats: "4" }),
];

/* البند 8: بحث يغطي Brand + Model + Year + Trim */
function searchModels(models, q) {
  const s = norm(translateQuery(q));
  if (!s) return models;
  const words = s.split(" ").filter(Boolean);
  return models.filter((m) => {
    const hay = norm(`${m.brand} ${m.model} ${m.year} ${m.trim} ${m.engine}`);
    return words.every((w) => hay.includes(w));
  });
}

/* البند 42: استيراد موديلات دفعة واحدة من CSV أو JSON */
function parseModelsCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const head = lines[0].split(",").map((h) => norm(h).replace(/ /g, ""));
  return lines.slice(1).filter(Boolean).map((ln) => {
    const cells = ln.split(",");
    const o = {};
    head.forEach((h, i) => { o[h] = (cells[i] || "").trim(); });
    return mkModel({
      brand: o.brand, model: o.model, year: o.year, trim: o.trim,
      engine: o.engine, transmission: o.transmission, fuel: o.fuel,
      drive: o.drive, cylinders: o.cylinders, bodyType: o.bodytype,
    });
  }).filter((m) => m.brand && m.model);
}

/* ============================= L5 — DEAL RECORDS ===========================
   الصفقة منفصلة عن الموديل، وتشير إليه بـ vehicleModelId (البند 2).
   ========================================================================== */
/* المصروف = المصدر الوحيد لتكلفة السيارة.
   المبلغ = قطع + أجرة يد إن أُدخلا، وإلا مبلغ يدوي واحد — فلا يُسجَّل بند مرتين. */
const EXP_STATES = {
  completed: { ar: "منفَّذ", en: "Completed" },
  planned:   { ar: "مخطط",  en: "Planned" },
  cancelled: { ar: "ملغى",  en: "Cancelled" },
};

const mkExpense = (o = {}) => ({
  expenseId: o.expenseId || uid("exp"),
  category: "other", customCategory: "", description: "", item: "",
  partsCost: 0, laborCost: 0, amount: 0,
  date: todayISO(), supplier: "", workshop: "", mileage: "",
  status: "completed",
  paid: true, paidAt: "", method: "cash",
  notes: "", receipt: "", photos: [],
  createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

/* المبلغ المعتمد للمصروف */
const expAmount = (e) => {
  const parts = num(e.partsCost), labor = num(e.laborCost);
  return (parts > 0 || labor > 0) ? parts + labor : num(e.amount);
};
/* يدخل التكلفة والنقد فقط إذا كان منفَّذاً — القديم بلا حالة يُعد منفَّذاً */
const expCounts = (e) => (e.status || "completed") === "completed";

const mkDeal = (o = {}) => ({
  dealId: o.dealId || uid("deal"),
  vehicleModelId: "",
  purchasePrice: 0, purchaseDate: todayISO(), purchaseSource: "individual",
  mileage: "", vin: "", color: "",
  photos: [], mainPhoto: 0,
  expenses: [],
  askingPrice: 0, targetProfit: 300,
  status: "purchased",
  soldPrice: 0, soldDate: "", buyerName: "", buyerPhone: "",
  notes: "", history: [], deleted: false,
  /* المشترون المحتملون */
  leads: [],
  /* المرحلة ٥ — دورة البيع */
  priceHistory: [],        // كل تغيير في سعر العرض
  minAcceptable: 0,        // أقل سعر مقبول — داخلي لا يظهر في الإعلان
  colorInterior: "",       // المرحلة ٩
  features: "",
  listedAt: "",            // المرحلة ٨ — تاريخ العرض
  importRef: null,         // المرحلة ٧
  deposits: [],            // العرابين
  closing: null,           // تفاصيل الإغلاق
  /* تواريخ للتنبيهات */
  insuranceExpiry: "", regExpiry: "",
  createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

const mkLead = (o = {}) => ({ leadId: uid("lead"), name: "", phone: "",
  offers: [], quotedPrice: 0, minToldPrice: 0, lastContact: todayISO(),
  viewDate: "", status: "new", notes: "", createdAt: nowISO(), ...o });

/* ثماني حالات للمشتري */
const LEAD_STATES = {
  new:        { ar: "جديد",        en: "New" },
  contacted:  { ar: "تم التواصل",  en: "Contacted" },
  interested: { ar: "مهتم",        en: "Interested" },
  nego:       { ar: "يفاوض",       en: "Negotiating" },
  serious:    { ar: "جاد",         en: "Serious" },
  deposit:    { ar: "دفع عربون",   en: "Deposit Paid" },
  rejected:   { ar: "رفض",         en: "Rejected" },
  sold:       { ar: "اشترى",       en: "Sold" },
};

/* توافق رجعي: عرض واحد قديم → مصفوفة عروض */
function normalizeLead(l) {
  const out = { ...mkLead(), ...l };
  if (!Array.isArray(out.offers)) out.offers = [];
  if (!out.offers.length && num(l?.offer) > 0) {
    out.offers = [{ id: uid("of"), at: l.createdAt || nowISO(), amount: num(l.offer), note: "" }];
  }
  const map = { viewed: "contacted", won: "sold", lost: "rejected" };
  if (map[out.status]) out.status = map[out.status];
  if (!LEAD_STATES[out.status]) out.status = "new";
  return out;
}

const leadStats = (l) => {
  const L = normalizeLead(l);
  const amts = L.offers.map((o) => num(o.amount)).filter((x) => x > 0);
  return { ...L, first: amts[0] || 0, last: amts[amts.length - 1] || 0,
    highest: amts.length ? Math.max(...amts) : 0, count: amts.length };
};

const mkDeposit = (o = {}) => ({
  depositId: uid("dep"), leadId: null, name: "", amount: 0, date: todayISO(),
  method: "cash", refundable: true, notes: "",
  status: "held",           // held | applied | refunded | forfeited
  refundDate: "", forfeitDate: "", createdAt: nowISO(), ...o,
});

/* التزام قائم: عربون محتجز لم يُحتسب ولم يُرجع ولم يُصادَر */
const heldDeposits = (d) => (d.deposits || [])
  .filter((x) => x.status === "held" && d.status !== "sold");

/* المستلم الذي يُحتسب ضمن تسوية البيع — المصادَر والمُرجَع خارجه */
const depositsReceived = (d) => (d.deposits || [])
  .filter((x) => x.status === "held" || x.status === "applied")
  .reduce((a, x) => a + num(x.amount), 0);

/* دخل مستقل من العرابين المصادَرة — ليس ربح سيارة */
const forfeitedDeposits = (d) => (d.deposits || [])
  .filter((x) => x.status === "forfeited")
  .reduce((a, x) => a + num(x.amount), 0);

/* البند 14: سجل دورة حياة الصفقة */
const logEvent = (dealRec, type, meta = {}) => ({
  ...dealRec,
  updatedAt: nowISO(),
  history: [...(dealRec.history || []), { id: uid("ev"), type, at: nowISO(), ...meta }],
});

/* ========================= L6 — PROFIT ENGINE (مصدر وحيد) ==================
   البند 18: كل المعادلات هنا فقط. أي تغيير مستقبلي يتم في هذا المكان.
   ========================================================================== */
function computeDeal(dealRec, settings = {}) {
  const quickPct = settings.quickSalePct ?? 5;

  /* المرحلة ٦: المخطط والملغى خارج التكلفة. المصروف القديم بلا حالة = منفَّذ */
  const allExp = dealRec.expenses || [];
  const active = allExp.filter(expCounts);
  const totalExpenses = active.reduce((s, e) => s + expAmount(e), 0);
  const paidExpenses = active.filter((e) => e.paid !== false)
    .reduce((s, e) => s + expAmount(e), 0);
  const plannedExpenses = allExp.filter((e) => e.status === "planned")
    .reduce((s, e) => s + expAmount(e), 0);
  const partsTotal = active.reduce((s, e) => s + num(e.partsCost), 0);
  const laborTotal = active.reduce((s, e) => s + num(e.laborCost), 0);

  const purchasePrice = num(dealRec.purchasePrice);
  const totalCost = purchasePrice + totalExpenses;
  const isSold = dealRec.status === "sold";
  const sellingPrice = isSold ? num(dealRec.soldPrice) : num(dealRec.askingPrice);

  const profit = sellingPrice - totalCost;
  const breakEven = totalCost;
  const roi = totalCost > 0 && Number.isFinite(profit / totalCost)
    ? (profit / totalCost) * 100 : 0;
  const margin = sellingPrice > 0 && Number.isFinite(profit / sellingPrice)
    ? (profit / sellingPrice) * 100 : 0;
  const targetSellingPrice = totalCost + num(dealRec.targetProfit);
  const quickSalePrice = Math.round(totalCost * (1 + quickPct / 100));

  const daysHeld = isSold
    ? daysBetween(dealRec.purchaseDate, dealRec.soldDate || todayISO())
    : daysBetween(dealRec.purchaseDate, todayISO());

  return {
    totalExpenses, paidExpenses, dueExpenses: totalExpenses - paidExpenses,
    purchasePrice, totalCost, sellingPrice, profit, breakEven, roi, margin,
    targetSellingPrice, targetDiff: targetSellingPrice - sellingPrice,
    quickSalePrice, quickSaleProfit: quickSalePrice - totalCost,
    isSold, daysHeld,
  };
}

/* ---- حاسبة ما قبل الشراء: عكس معادلة الربح ----
   Profit  = Selling - (Purchase + Expenses)
   إذن:  MaxPurchase = Selling - Expenses - TargetProfit
   وكل النتائج تمر من نفس محرك computeDeal للاتساق. */
function buyCeiling({ expectedSelling, expectedExpenses, targetProfit, askingPrice }) {
  const sell = num(expectedSelling), exp = num(expectedExpenses);
  const want = num(targetProfit), asked = num(askingPrice);
  const maxPurchase = sell - exp - want;
  const breakEvenPurchase = sell - exp;              // فوقه خسارة مؤكدة
  const gap = asked - maxPurchase;                   // موجب = لازم ينزّل

  const atAsked = computeDeal(mkDeal({
    purchasePrice: asked, askingPrice: sell, targetProfit: want,
    expenses: exp > 0 ? [mkExpense({ amount: exp })] : [],
  }));

  let verdict = "good";
  if (asked > breakEvenPurchase) verdict = "bad";
  else if (gap > 0) verdict = maxPurchase > 0 && gap / Math.max(1, maxPurchase) < 0.05
    ? "tight" : "bad";

  return { maxPurchase, breakEvenPurchase, gap, verdict,
    profitAtAsked: atAsked.profit, roiAtAsked: atAsked.roi, costAtAsked: atAsked.totalCost };
}

/* ---- قوالب المصاريف المتوقعة ---- */
const EXPENSE_PRESETS = [
  { key: "paint", ar: "صبغ وسمكرة", en: "Paint & bodywork", amount: 250 },
  { key: "tires", ar: "إطارات", en: "Tires", amount: 120 },
  { key: "oil", ar: "أويل وفلاتر", en: "Oil & filters", amount: 35 },
  { key: "detailing", ar: "تلميع وتنظيف", en: "Detailing", amount: 45 },
  { key: "mechanical", ar: "ميكانيكا", en: "Mechanical", amount: 150 },
  { key: "parts", ar: "قطع غيار", en: "Spare parts", amount: 200 },
  { key: "registration", ar: "مرور ولوحات", en: "Registration & plates", amount: 30 },
  { key: "insurance", ar: "تأمين", en: "Insurance", amount: 140 },
  { key: "transport", ar: "نقل ومخلّص", en: "Transport & clearing", amount: 70 },
  { key: "fuel", ar: "بترول", en: "Fuel", amount: 25 },
];

/* ---- أين ذهبت مصاريف السيارة ---- */
function expenseBreakdown(deal, lang = "ar") {
  const active = (deal.expenses || []).filter(expCounts);
  const total = active.reduce((a, e) => a + expAmount(e), 0);
  const map = new Map();
  active.forEach((e) => {
    const key = e.category === "custom" && e.customCategory ? e.customCategory : e.category;
    const cur = map.get(key) || { key, amount: 0, count: 0 };
    cur.amount += expAmount(e); cur.count += 1;
    map.set(key, cur);
  });
  const rows = [...map.values()]
    .map((r) => ({ ...r, pct: total > 0 ? (r.amount / total) * 100 : 0,
      label: (EXPENSE_CATS[r.key] || { ar: r.key, en: r.key })[lang] || r.key,
      color: (EXPENSE_CATS[r.key] || {}).c || C.gold }))
    .sort((a, b) => b.amount - a.amount);
  return { total, rows, top: rows[0] || null, count: active.length };
}

/* ---- الاحتياطي: كم يُحجز من ربح صفقة ---- */
function reserveFor(profit, settings = {}) {
  if (settings.reserveOn === false) return 0;
  const p = num(profit);
  if (p <= 0) return 0;                       // الخسارة لا يُحجز منها
  if (settings.reserveMode === "fixed") {
    return Math.min(num(settings.reserveFixed ?? 500), p);
  }
  const pct2 = num(settings.reservePct ?? 25);
  return Math.max(0, Math.round(p * pct2 / 100));
}

function reserveSummary(state) {
  const moves = state.reserve?.entries || [];
  const balance = moves.reduce((a, m) => a + (m.type === "withdraw" ? -num(m.amount) : num(m.amount)), 0);
  const goal = num(state.settings?.reserveTarget ?? 5000);
  return { moves, balance, goal, left: Math.max(0, goal - balance),
    pct: goal > 0 ? Math.min(100, (balance / goal) * 100) : 0 };
}

/* ---- التنبيهات المشتقة من البيانات ---- */
function buildAlerts(deals, models, settings) {
  const out = [];
  const today = new Date();
  deals.filter((d) => !d.deleted && d.status !== "sold" && d.status !== "cancelled")
    .forEach((d) => {
      const m = models.find((x) => x.vehicleModelId === d.vehicleModelId);
      const name = m ? `${m.brand} ${m.model} ${m.year}` : "";
      const k = computeDeal(d, settings);
      const days = daysBetween(d.purchaseDate, todayISO());
      if (d.status === "listed" && days >= 45)
        out.push({ id: d.dealId + "_listed", dealId: d.dealId, key: "alertListed",
          val: `${days}`, tone: "warn", name });
      if (k.sellingPrice >= k.targetSellingPrice && k.targetSellingPrice > 0)
        out.push({ id: d.dealId + "_target", dealId: d.dealId, key: "alertTarget",
          val: "", tone: "good", name });
      if (k.dueExpenses > 0)
        out.push({ id: d.dealId + "_due", dealId: d.dealId, key: "alertDue",
          val: f0(k.dueExpenses), tone: "bad", name });
      [["insuranceExpiry", "alertInsurance"], ["regExpiry", "alertReg"]].forEach(([f, key]) => {
        if (!d[f]) return;
        const left = Math.round((new Date(d[f]) - today) / 864e5);
        if (left <= 30) out.push({ id: d.dealId + "_" + f, dealId: d.dealId, key,
          val: `${left}`, tone: left < 0 ? "bad" : "warn", name });
      });
    });
  return out;
}

/* البند 20: استراتيجية البيع مشتقة من نفس المحرك */
function sellingStrategy(dealRec, settings) {
  const k = computeDeal(dealRec, settings);
  return [
    { key: "breakEven", price: Math.round(k.breakEven), profit: 0 },
    { key: "quick", price: k.quickSalePrice, profit: k.quickSaleProfit },
    { key: "current", price: Math.round(k.sellingPrice), profit: k.profit, isCurrent: true },
    { key: "target", price: Math.round(k.targetSellingPrice), profit: num(dealRec.targetProfit) },
  ];
}

/* البند 61: اختبارات المعادلات */
function runCalcTests() {
  const t = [];
  const d = mkDeal({
    purchasePrice: 1800, askingPrice: 2600, targetProfit: 300,
    expenses: [mkExpense({ amount: 150 }), mkExpense({ amount: 120 }), mkExpense({ amount: 35 }),
      mkExpense({ amount: 120 }), mkExpense({ amount: 40 }), mkExpense({ amount: 90 }),
      mkExpense({ amount: 20 })],
  });
  const k = computeDeal(d);
  const chk = (name, got, want, tol = 0.01) =>
    t.push({ name, got, want, ok: Math.abs(got - want) <= tol });
  chk("Total Expenses", k.totalExpenses, 575);
  chk("Total Cost", k.totalCost, 2375);
  chk("Profit", k.profit, 225);
  chk("Break-even", k.breakEven, 2375);
  chk("ROI %", k.roi, 9.47, 0.01);
  chk("Margin %", k.margin, 8.65, 0.01);
  chk("Target Price", k.targetSellingPrice, 2675);

  const d2 = mkDeal({ purchasePrice: 3600, askingPrice: 7000, targetProfit: 2500,
    expenses: [mkExpense({ amount: 1327.405 })] });
  const k2 = computeDeal(d2);
  chk("Sierra Total Cost", k2.totalCost, 4927.405);
  chk("Sierra Profit", k2.profit, 2072.595);
  chk("Sierra ROI %", k2.roi, 42.06, 0.02);
  return t;
}


/* ==================== L6b — CAPITAL & CASH FLOW ==========================
   المرحلة ٢ — نظام رأس المال والسيولة.

   مبدآن حاكمان:
     ١) ربحية السيارة استحقاقية ولا تُمسّ:  الربح = سعر البيع − التكلفة عند البيع
     ٢) النقد قبض وصرف، ويُعرض منفصلاً عن الربح

   قرار تصميمي مهم: الحركات التلقائية **تُشتق** من الصفقات ولا تُخزَّن.
   المخزَّن هو الحركات اليدوية فقط. بهذا يستحيل التكرار أو الانحراف،
   ولا حاجة لإعادة توليد أو مطابقة بصمات.
   ========================================================================== */

const CASH_TYPES = {
  capital_in:       { dir: "in",  auto: false, ar: "ضخ رأس مال",     en: "Capital in" },
  capital_out:      { dir: "out", auto: false, ar: "سحب",             en: "Owner draw" },
  purchase:         { dir: "out", auto: true,  ar: "شراء سيارة",      en: "Purchase" },
  deal_expense:     { dir: "out", auto: true,  ar: "مصروف سيارة",     en: "Deal expense" },
  expense_refund:   { dir: "in",  auto: true,  ar: "استرداد مصروف",   en: "Expense refund" },
  sale_proceeds:    { dir: "in",  auto: true,  ar: "متحصّل بيع",      en: "Sale proceeds" },
  deposit_in:       { dir: "in",  auto: false, ar: "عربون",           en: "Deposit" },
  deposit_refund:   { dir: "out", auto: false, ar: "إرجاع عربون",     en: "Deposit refund" },
  instalment_in:    { dir: "in",  auto: false, ar: "قسط",             en: "Instalment" },
  business_expense: { dir: "out", auto: true,  ar: "مصروف نشاط",      en: "Business expense" },
  partner_in:       { dir: "in",  auto: false, ar: "مساهمة شريك",     en: "Partner in" },
  partner_out:      { dir: "out", auto: false, ar: "مستحق شريك",      en: "Partner out" },
  adjustment_in:    { dir: "in",  auto: false, ar: "تسوية زيادة",     en: "Adjustment +" },
  adjustment_out:   { dir: "out", auto: false, ar: "تسوية نقص",       en: "Adjustment −" },
};

const BIZ_CATS = {
  fuel:      { ar: "بنزين",     en: "Fuel" },
  transport: { ar: "نقل",        en: "Transport" },
  ads:       { ar: "إعلانات",    en: "Advertising" },
  subs:      { ar: "اشتراكات",   en: "Subscriptions" },
  tools:     { ar: "أدوات",      en: "Tools" },
  rent:      { ar: "إيجار",      en: "Rent" },
  fees:      { ar: "رسوم",       en: "Fees" },
  travel:    { ar: "سفر",        en: "Travel" },
  other:     { ar: "أخرى",       en: "Other" },
};

const mkCashEntry = (o = {}) => ({
  entryId: uid("ce"), date: todayISO(), type: "capital_in", amount: 0,
  dealId: null, refId: null, method: "cash", note: "",
  createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

const mkBizExpense = (o = {}) => ({
  bizId: uid("bz"), category: "other", description: "", amount: 0,
  date: todayISO(), method: "cash", supplier: "", notes: "", receipt: "", paid: true,
  paidAt: "", createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

/* تاريخ الحدث ≥ تاريخ افتتاح الدفتر؟ بلا افتتاح = كل شيء داخل الدفتر */
const inLedger = (date, openDate) => !openDate || (date && String(date) >= String(openDate));

/* تاريخ دفع المصروف: paidAt إن وُجد، وإلا تاريخ المصروف */
const paidOn = (e) => e.paidAt || e.date;

/* ---- اشتقاق الحركات التلقائية من الصفقات ومصاريف النشاط ---- */
function derivedEntries(st) {
  const openDate = st.capital?.opened ? st.capital.openingDate : null;
  const out = [];
  (st.deals || []).filter((d) => !d.deleted).forEach((d) => {
    const k = computeDeal(d, st.settings);

    if (num(d.purchasePrice) > 0 && inLedger(d.purchaseDate, openDate)) {
      out.push({ entryId: `auto:${d.dealId}:purchase`, date: d.purchaseDate,
        type: "purchase", amount: num(d.purchasePrice), dealId: d.dealId,
        auto: true, note: "" });
    }

    (d.expenses || []).forEach((e) => {
      if (!expCounts(e)) return;                    // مخطط أو ملغى = لا تكلفة ولا نقد
      if (e.paid === false) return;                 // غير مدفوع = التزام لا نقد
      const when = paidOn(e);
      if (!inLedger(when, openDate)) return;
      const amt = expAmount(e);
      if (amt === 0) return;
      out.push({ entryId: `auto:${d.dealId}:exp:${e.expenseId}`, date: when,
        type: amt < 0 ? "expense_refund" : "deal_expense", amount: Math.abs(amt),
        dealId: d.dealId, refId: e.expenseId, auto: true,
        note: e.description || "" });
    });

    /* العرابين — نقد حقيقي يدخل يوم استلامه */
    (d.deposits || []).forEach((dep) => {
      const amt = num(dep.amount);
      if (amt <= 0) return;
      if (inLedger(dep.date, openDate)) {
        out.push({ entryId: `auto:${d.dealId}:dep:${dep.depositId}`, date: dep.date,
          type: "deposit_in", amount: amt, dealId: d.dealId, refId: dep.depositId,
          auto: true, method: dep.method || "cash", note: dep.name || "" });
      }
      if (dep.status === "refunded" && inLedger(dep.refundDate || dep.date, openDate)) {
        out.push({ entryId: `auto:${d.dealId}:depref:${dep.depositId}`,
          date: dep.refundDate || dep.date, type: "deposit_refund", amount: amt,
          dealId: d.dealId, refId: dep.depositId, auto: true, note: dep.name || "" });
      }
    });

    if (d.status === "sold" && inLedger(d.soldDate, openDate)) {
      /* المقبوض كاملاً ناقص ما دخل عربوناً — حتى لا يُحسب مرتين */
      const collected = d.collectedAmount !== undefined
        ? num(d.collectedAmount) : num(d.soldPrice);
      const alreadyIn = depositsReceived(d);
      const atClosing = collected - alreadyIn;
      if (Math.abs(atClosing) > 0.0005) {
        out.push({ entryId: `auto:${d.dealId}:sale`, date: d.soldDate,
          type: atClosing > 0 ? "sale_proceeds" : "deposit_refund",
          amount: Math.abs(atClosing), dealId: d.dealId, auto: true, note: "" });
      }
    }
  });

  (st.businessExpenses || []).forEach((b) => {
    if (b.paid === false) return;                    // غير مدفوع = التزام لا نقد
    const when = b.paidAt || b.date;
    if (!inLedger(when, openDate)) return;
    if (num(b.amount) === 0) return;
    out.push({ entryId: `auto:biz:${b.bizId}`, date: when, type: "business_expense",
      amount: Math.abs(num(b.amount)), refId: b.bizId, auto: true,
      method: b.method || "cash",
      note: b.description || (BIZ_CATS[b.category] || BIZ_CATS.other).ar });
  });

  return out;
}

/* كل الحركات: مشتقة + يدوية، مرتبة زمنياً */
function allEntries(st) {
  const manual = (st.cashLedger || []).map((e) => ({ ...e, auto: false }));
  return [...derivedEntries(st), ...manual]
    .sort((a, b) => String(a.date).localeCompare(String(b.date))
      || String(a.entryId).localeCompare(String(b.entryId)));
}

/* ================= المحرك المالي — مصدر وحيد لكل مؤشرات النقد ============= */
function cashEngine(st) {
  const S = st.settings || {};
  const cap = st.capital || {};
  const openDate = cap.opened ? cap.openingDate : null;
  const openCash = cap.opened ? num(cap.openingCash) : 0;
  const deals = (st.deals || []).filter((d) => !d.deleted);

  /* ---- المركز الافتتاحي: كل ما هو مؤرَّخ قبل تاريخ الافتتاح ---- */
  let openInventory = 0, openPayables = 0;
  if (openDate) {
    deals.forEach((d) => {
      const before = String(d.purchaseDate || "") < String(openDate);
      const stillHeld = d.status !== "sold" || String(d.soldDate || "") >= String(openDate);
      if (!before || !stillHeld) return;
      openInventory += num(d.purchasePrice);
      (d.expenses || []).forEach((e) => {
        if (String(e.date || "") >= String(openDate)) return;
        openInventory += num(e.amount);
        if (e.paid === false) openPayables += num(e.amount);
      });
    });
  }
  const openingEquity = openCash + openInventory - openPayables;

  /* ---- الحركات ---- */
  const entries = allEntries(st);
  const sum = (pred) => entries.filter(pred)
    .reduce((a, e) => a + Math.abs(num(e.amount)), 0);
  const dirOf = (e) => CASH_TYPES[e.type]?.dir || "out";

  const cashIn  = sum((e) => dirOf(e) === "in");
  const cashOut = sum((e) => dirOf(e) === "out");
  const availableCash = openCash + cashIn - cashOut;

  const capitalIn  = sum((e) => e.type === "capital_in");
  const capitalOut = sum((e) => e.type === "capital_out");
  const netCapital = capitalIn - capitalOut;

  /* العرابين المحتجزة: مشتقة من الصفقات (المحتجزة فقط) + أي حركة يدوية */
  const dealDepositsHeld = deals.reduce((a, d) =>
    a + heldDeposits(d).reduce((x, dep) => x + num(dep.amount), 0), 0);
  const manualDeposits = entries.filter((e) => !e.auto)
    .reduce((a, e) => a + (e.type === "deposit_in" ? num(e.amount)
      : e.type === "deposit_refund" ? -num(e.amount) : 0), 0);
  const depositsHeld = dealDepositsHeld + manualDeposits;
  const partnerHeld  = sum((e) => e.type === "partner_in") - sum((e) => e.type === "partner_out");

  /* ---- المخزون ---- */
  const open = deals.filter((d) => OPEN_STATUSES.includes(d.status));
  let inventoryCost = 0, cashInInventory = 0, payables = 0, askingValue = 0;
  open.forEach((d) => {
    const k = computeDeal(d, S);
    inventoryCost += k.totalCost;
    cashInInventory += k.purchasePrice + k.paidExpenses;
    payables += k.dueExpenses;
    askingValue += num(d.askingPrice);
  });
  const potentialGrossProfit = askingValue - inventoryCost;

  /* ---- المبيعات ---- */
  const soldAll = deals.filter((d) => d.status === "sold");
  const soldLedger = soldAll.filter((d) => inLedger(d.soldDate, openDate));
  const soldPre = soldAll.filter((d) => !inLedger(d.soldDate, openDate));

  const acc = (list) => list.reduce((a, d) => a + computeDeal(d, S).profit, 0);
  const realizedProfitLedger = acc(soldLedger);   // يدخل الهوية المحاسبية
  const realizedProfitPre = acc(soldPre);          // قبل الافتتاح — معلومة فقط
  const realizedProfitAll = realizedProfitLedger + realizedProfitPre;

  let realizedRevenue = 0, cashCollected = 0, capitalRecovered = 0;
  let profitRecoveredInCash = 0, capitalToRecover = 0;
  soldLedger.forEach((d) => {
    const k = computeDeal(d, S);
    const collected = d.collectedAmount !== undefined ? num(d.collectedAmount) : num(d.soldPrice);
    realizedRevenue += num(d.soldPrice);
    cashCollected += collected;
    /* رأس المال يُسترد أولاً، والفائض فوقه ربح مسترد نقداً */
    capitalRecovered += Math.min(collected, k.totalCost);
    capitalToRecover += Math.max(0, k.totalCost - collected);
    profitRecoveredInCash += Math.max(0, collected - k.totalCost);
  });
  const receivables = realizedRevenue - cashCollected;

  /* ---- دخل العرابين المصادَرة: التزام تحوّل إلى دخل ----
     النقد لا يتغيّر (دخل وقت الاستلام) · الالتزام يزول · الحقوق ترتفع بالمبلغ */
  const forfeitedIncome = deals.reduce((a, d) => {
    const rows = (d.deposits || []).filter((x) => x.status === "forfeited"
      && inLedger(x.forfeitDate || x.date, openDate));
    return a + rows.reduce((x, dep) => x + num(dep.amount), 0);
  }, 0);

  /* ---- مصاريف النشاط ---- */
  const bizAll = (st.businessExpenses || []);
  const bizLedger = bizAll.filter((b) => inLedger(b.date, openDate));
  const businessExpenses = bizLedger.reduce((a, b) => a + num(b.amount), 0);
  const businessUnpaid = bizLedger.filter((b) => b.paid === false)
    .reduce((a, b) => a + num(b.amount), 0);

  /* ---- الربح ---- */
  const unrealizedProfit = open.reduce((a, d) => a + computeDeal(d, S).profit, 0);
  /* صافي ربح النشاط = ربح السيارات + دخل المصادرة − مصاريف النشاط */
  const netBusinessProfit = realizedProfitLedger + forfeitedIncome - businessExpenses;

  /* ---- الاحتياطي: تخصيص دفتري لا حركة نقدية ---- */
  const reserveBalance = reserveSummary(st).balance;

  /* ---- الالتزامات: مفصولة بالتسمية، ونفس الأرقام السابقة ---- */
  const vehiclePayables = payables;              // ذمم مصاريف السيارات
  const businessPayables = businessUnpaid;        // ذمم مصاريف النشاط
  const totalPayables = vehiclePayables + businessPayables;

  /* ---- رأس المال: تسميات لوحة التحكم ---- */
  const openingCapital = openCash;
  const ownerContributions = capitalIn;
  const ownerWithdrawals = capitalOut;

  /* ---- حقوق الملكية والسيولة ---- */
  const ownerEquity = availableCash + inventoryCost + receivables
    - payables - businessUnpaid - depositsHeld - partnerHeld;
  const spendableCash = availableCash - payables - businessUnpaid
    - reserveBalance - depositsHeld - partnerHeld;

  /* ---- معادلة التحقق ---- */
  const expectedEquity = openingEquity + netCapital + realizedProfitLedger
    + forfeitedIncome - businessExpenses;
  const invariantDiff = ownerEquity - expectedEquity;

  return {
    opened: !!cap.opened, openDate, openCash, openInventory, openPayables, openingEquity,
    entries, cashIn, cashOut, availableCash, spendableCash,
    capitalIn, capitalOut, netCapital, depositsHeld, partnerHeld,
    inventoryCost, cashInInventory, payables, askingValue, potentialGrossProfit,
    inventoryCount: open.length,
    realizedRevenue, cashCollected, capitalRecovered, capitalToRecover,
    profitRecoveredInCash, receivables,
    realizedProfitLedger, realizedProfitPre, realizedProfitAll,
    unrealizedProfit, businessExpenses, businessUnpaid, netBusinessProfit,
    vehiclePayables, businessPayables, totalPayables,
    openingCapital, ownerContributions, ownerWithdrawals,
    forfeitedIncome,
    reserveBalance, ownerEquity, expectedEquity, invariantDiff,
    balanced: Math.abs(invariantDiff) < 0.005,
  };
}


/* ==================== L6c — PRE-PURCHASE INSPECTION ======================
   المرحلة ٤ — تقييم السيارة قبل الشراء.
   مستقل تماماً: لا يلمس أي صفقة قائمة ولا معادلة مالية.
   كل التكاليف يدخلها المستخدم يدوياً — لا تخمين ولا بيانات سوق.
   ========================================================================== */

const INSP_STATUS = {
  notChecked: { ar: "لم يُفحص",    en: "Not Checked",    c: "var(--a-gray)", ce: "var(--a-gray-e)", cf: "var(--a-gray-f)", w: 0 },
  good:       { ar: "سليم",        en: "Good",           c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)", w: 0 },
  attention:  { ar: "يحتاج متابعة", en: "Needs Attention", c: "var(--a-gold)", ce: "var(--a-gold-e)", cf: "var(--a-gold-f)", w: 1 },
  repair:     { ar: "يحتاج إصلاح",  en: "Needs Repair",   c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)", w: 2 },
  critical:   { ar: "حرج",         en: "Critical",       c: "var(--a-red)", ce: "var(--a-red-e)", cf: "var(--a-red-f)", w: 4 },
};
const INSP_ORDER = ["notChecked", "good", "attention", "repair", "critical"];

/* الأقسام التسعة — المفتاح · العربي · الإنجليزي · فئة المصروف عند التحويل */
const INSP_SECTIONS = [
  { key: "engine", ar: "المحرك", en: "Engine", icon: "engine", cat: "mechanical", items: [
    ["oilLeak", "تسريب زيت", "Oil leaks"], ["coolantLeak", "تسريب مبرد", "Coolant leaks"],
    ["smoke", "دخان", "Smoke"], ["noise", "أصوات المحرك", "Engine noise"],
    ["misfire", "تقطيع", "Misfire"], ["mounts", "كراسي المحرك", "Mounts"],
    ["compression", "الضغط والحالة", "Compression / condition"],
    ["engLights", "لمبات التحذير", "Warning lights"]] },

  { key: "trans", ar: "ناقل الحركة", en: "Transmission", icon: "gears", cat: "mechanical", items: [
    ["shifting", "نقل السرعات", "Shifting"], ["delay", "تأخير", "Delay"],
    ["slipping", "انزلاق", "Slipping"], ["transLeak", "تسريب زيت", "Oil leaks"],
    ["transNoise", "أصوات", "Noise"]] },

  { key: "cooling", ar: "التبريد والتكييف", en: "Cooling / AC", icon: "refresh", cat: "ac", items: [
    ["acCool", "تبريد التكييف", "AC cooling"], ["compressor", "الكمبروسر", "Compressor"],
    ["condenser", "المكثّف", "Condenser"], ["radiator", "الردياتير", "Radiator"],
    ["fans", "المراوح", "Fans"], ["coolSystem", "دورة التبريد", "Coolant system"]] },

  { key: "susp", ar: "التعليق والمقود", en: "Suspension / Steering", icon: "drive", cat: "mechanical", items: [
    ["shocks", "المساعدات", "Shocks"], ["bushings", "الجلب", "Bushings"],
    ["arms", "المقصات", "Arms"], ["ballJoints", "البصمات", "Ball joints"],
    ["rack", "طقم المقود", "Steering rack"], ["bearings", "الرمانات", "Wheel bearings"]] },

  { key: "brakes", ar: "الفرامل والإطارات", en: "Brakes / Tires", icon: "refresh", cat: "tires", items: [
    ["pads", "الفحمات", "Pads"], ["discs", "الديسكات", "Discs"],
    ["tires", "الإطارات", "Tires"], ["abs", "تحذير ABS", "ABS warnings"]] },

  { key: "elec", ar: "الكهرباء", en: "Electrical", icon: "spark", cat: "electrical", items: [
    ["battery", "البطارية", "Battery"], ["alternator", "الدينمو", "Alternator"],
    ["lights", "الإضاءة", "Lights"], ["windows", "الزجاج الكهربائي", "Windows"],
    ["sensors", "الحساسات", "Sensors"], ["multimedia", "الشاشة والصوتيات", "Multimedia"],
    ["dashLights", "لمبات الطبلون", "Dashboard warnings"]] },

  { key: "body", ar: "الهيكل والبودي", en: "Body", icon: "car", cat: "bodywork", items: [
    ["paint", "الصبغ", "Paint"], ["accident", "آثار حوادث", "Accident signs"],
    ["chassis", "الشاصي", "Chassis"], ["rust", "الصدأ", "Rust"],
    ["panels", "الرفارف والأبواب", "Panels"], ["bumpers", "الصدامات", "Bumpers"],
    ["bodyLights", "الأنوار", "Lights"], ["glass", "الزجاج", "Glass"]] },

  { key: "interior", ar: "الداخلية", en: "Interior", icon: "user", cat: "detailing", items: [
    ["seats", "المقاعد", "Seats"], ["dashboard", "الطبلون", "Dashboard"],
    ["acControls", "مفاتيح التكييف", "AC controls"], ["trim", "التطعيم", "Trim"],
    ["headliner", "السقف الداخلي", "Headliner"],
    ["odor", "روائح أو أثر ماء", "Odor / water damage"]] },

  { key: "docs", ar: "الأوراق", en: "Documents", icon: "clipboard", cat: "registration", items: [
    ["registration", "الاستمارة", "Registration"], ["insurance", "التأمين", "Insurance"],
    ["inspection", "الفحص الفني", "Inspection"], ["ownership", "الملكية", "Ownership"],
    ["finance", "التزامات أو تمويل قائم", "Outstanding finance"]] },
];

const INSP_ITEM_COUNT = INSP_SECTIONS.reduce((a, s) => a + s.items.length, 0);

const mkInspection = (o = {}) => ({
  inspectionId: uid("insp"),
  brand: "", model: "", year: "", trim: "", mileage: "",
  origin: "gcc",                       // gcc | import
  askingPrice: 0, sellerFinalPrice: 0,
  expectedSellingPrice: 0, expectedDays: 30,
  otherCosts: 0,
  desiredMode: "profit",               // profit | roi
  desiredProfit: 2000, desiredRoi: 20,
  items: {},                           // itemKey → { status, cost, notes, photo }
  status: "draft",                     // draft | potential | converted
  dealId: null, notes: "",
  createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

const inspItem = (insp, key) => insp.items?.[key]
  || { status: "notChecked", cost: 0, notes: "", photo: "" };

/* ---- محرك التقييم — مستقل عن computeDeal ---- */
function inspectionEngine(insp) {
  let repairsTotal = 0, checked = 0, critical = 0, needsRepair = 0, attention = 0, riskWeight = 0;
  INSP_SECTIONS.forEach((sec) => sec.items.forEach(([key]) => {
    const it = inspItem(insp, key);
    repairsTotal += num(it.cost);
    riskWeight += INSP_STATUS[it.status]?.w || 0;
    if (it.status !== "notChecked") checked += 1;
    if (it.status === "critical") critical += 1;
    if (it.status === "repair") needsRepair += 1;
    if (it.status === "attention") attention += 1;
  }));

  const asking = num(insp.askingPrice);
  const negotiated = num(insp.sellerFinalPrice) > 0 ? num(insp.sellerFinalPrice) : asking;
  const other = num(insp.otherCosts);
  const selling = num(insp.expectedSellingPrice);
  const addedCosts = repairsTotal + other;

  const totalInvestment = negotiated + addedCosts;
  const expectedProfit = selling - totalInvestment;
  const roi = totalInvestment > 0 ? (expectedProfit / totalInvestment) * 100 : 0;
  const margin = selling > 0 ? (expectedProfit / selling) * 100 : 0;

  /* أقصى سعر شراء آمن — طريقتان */
  let maxBuy;
  if (insp.desiredMode === "roi") {
    const r = num(insp.desiredRoi) / 100;
    /* (S − (P+A)) ÷ (P+A) = r  →  P = S ÷ (1+r) − A */
    maxBuy = (1 + r) !== 0 ? selling / (1 + r) - addedCosts : 0;
  } else {
    /* S − A − الربح المطلوب */
    maxBuy = selling - addedCosts - num(insp.desiredProfit);
  }
  const headroom = maxBuy - negotiated;          // موجب = ضمن السقف

  /* نسبة تكلفة الإصلاح من الاستثمار */
  const repairRisk = totalInvestment > 0 ? repairsTotal / totalInvestment : 0;
  const coverage = INSP_ITEM_COUNT ? checked / INSP_ITEM_COUNT : 0;
  const days = num(insp.expectedDays);

  /* ---- التقييم: نقاط شفافة قابلة للمراجعة ---- */
  const factors = [];
  const add = (key, pts, detail) => { factors.push({ key, pts, detail }); };

  add("roi", roi >= 25 ? 3 : roi >= 15 ? 2 : roi >= 8 ? 1 : roi >= 0 ? 0 : -3,
    `${roi.toFixed(1)}%`);
  add("margin", margin >= 20 ? 2 : margin >= 12 ? 1 : margin >= 0 ? 0 : -2,
    `${margin.toFixed(1)}%`);
  add("critical", critical === 0 ? 1 : critical === 1 ? -1 : -3, `${critical}`);
  add("needsRepair", needsRepair <= 2 ? 1 : needsRepair >= 5 ? -1 : 0, `${needsRepair}`);
  add("repairRisk", repairRisk <= 0.10 ? 1 : repairRisk > 0.30 ? -2 : 0,
    `${(repairRisk * 100).toFixed(0)}%`);
  add("days", days > 0 && days <= 30 ? 1 : days > 60 ? -1 : 0, `${days}`);
  add("headroom", headroom >= 0 ? 2 : -2, f0(headroom));
  add("coverage", coverage >= 0.7 ? 1 : coverage < 0.3 ? -1 : 0,
    `${(coverage * 100).toFixed(0)}%`);

  const score = factors.reduce((a, x) => a + x.pts, 0);
  const verdict = score >= 6 ? "strong" : score >= 3 ? "acceptable"
    : score >= 0 ? "weak" : "avoid";

  return { repairsTotal, other, addedCosts, asking, negotiated, selling,
    totalInvestment, expectedProfit, roi, margin, maxBuy, headroom,
    checked, coverage, critical, needsRepair, attention, riskWeight, repairRisk,
    days, factors, score, verdict, itemCount: INSP_ITEM_COUNT };
}

const VERDICTS = {
  strong:     { ar: "صفقة قوية",  en: "Strong Deal", c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)" },
  acceptable: { ar: "مقبولة",     en: "Acceptable",  c: "var(--a-gold)", ce: "var(--a-gold-e)", cf: "var(--a-gold-f)" },
  weak:       { ar: "ضعيفة",      en: "Weak Deal",   c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)" },
  avoid:      { ar: "تجنّبها",    en: "Avoid",       c: "var(--a-red)", ce: "var(--a-red-e)", cf: "var(--a-red-f)" },
};

/* ---- تحويل تقييم إلى صفقة حقيقية بلا إعادة إدخال ---- */
function inspectionToDeal(insp, models) {
  const k = inspectionEngine(insp);
  const model = mkModel({ brand: insp.brand || "—", model: insp.model || "—",
    year: insp.year || "", trim: insp.trim || "",
    region: insp.origin === "import" ? "Import" : "GCC" });
  const found = models.find((m) => norm(m.brand) === norm(insp.brand)
    && norm(m.model) === norm(insp.model) && String(m.year) === String(insp.year)
    && norm(m.trim || "") === norm(insp.trim || ""));
  const vm = found || model;

  /* كل بند له تكلفة يصير مصروفاً غير مدفوع — لا يُخترع شيء */
  const expenses = [];
  INSP_SECTIONS.forEach((sec) => sec.items.forEach(([key, ar, en]) => {
    const it = inspItem(insp, key);
    if (num(it.cost) > 0) {
      expenses.push(mkExpense({ category: sec.cat, amount: num(it.cost), paid: false,
        description: ar, notes: it.notes || "", receipt: it.photo || "" }));
    }
  }));
  if (num(insp.otherCosts) > 0) {
    expenses.push(mkExpense({ category: "other", amount: num(insp.otherCosts),
      paid: false, description: "تكاليف اقتناء أخرى" }));
  }

  const deal = mkDeal({
    vehicleModelId: vm.vehicleModelId,
    purchasePrice: k.negotiated,
    askingPrice: k.selling,
    targetProfit: insp.desiredMode === "roi"
      ? Math.round(k.totalInvestment * num(insp.desiredRoi) / 100)
      : num(insp.desiredProfit),
    mileage: insp.mileage, status: "purchased", expenses,
    notes: insp.notes || "",
  });
  return { deal, model: found ? null : model };
}


/* ==================== L6d — BAHRAIN IMPORT CALCULATOR ====================
   المرحلة ٧ — كل الأرقام من إدخال المستخدم. لا تقديرات سوق ولا إنترنت.
   ========================================================================== */
const IMPORT_CCY = ["BHD", "AED", "SAR", "USD", "KWD"];

/* بنود تكلفة الاستيراد — المفتاح · العربي · الإنجليزي · فئة المصروف عند التحويل */
const IMPORT_ITEMS = [
  ["auctionFees",  "رسوم المزاد",       "Auction fees",       "auction"],
  ["inland",       "النقل الداخلي",     "Inland transport",   "transport"],
  ["shipping",     "الشحن",             "Shipping",           "importFees"],
  ["shipInsurance","تأمين الشحن",       "Shipping insurance", "importFees"],
  ["customs",      "الجمارك",           "Customs",            "customs"],
  ["vat",          "الضريبة",           "VAT / Tax",          "customs"],
  ["clearance",    "التخليص",           "Clearance",          "importFees"],
  ["inspectionFee","الفحص",             "Inspection",         "inspection"],
  ["registration", "التسجيل",           "Registration",       "registration"],
  ["bhInsurance",  "التأمين في البحرين","Bahrain insurance",  "insurance"],
  ["otherCosts",   "تكاليف أخرى",       "Other costs",        "other"],
];

const mkImport = (o = {}) => ({
  importId: uid("imp"),
  country: "", currency: "AED", purchasePrice: 0, rate: 1,
  brand: "", model: "", year: "", trim: "", mileage: "",
  auctionFees: 0, inland: 0, shipping: 0, shipInsurance: 0,
  customs: 0, vat: 0, clearance: 0, inspectionFee: 0,
  registration: 0, bhInsurance: 0, otherCosts: 0,
  expectedRepairs: 0, expectedSellingPrice: 0,
  desiredMode: "profit", desiredProfit: 2000, desiredRoi: 20,
  status: "draft", dealId: null, notes: "",
  createdAt: nowISO(), updatedAt: nowISO(), ...o,
});

function importEngine(imp) {
  const rate = num(imp.rate) || 1;
  const purchaseForeign = num(imp.purchasePrice);
  const purchaseBHD = purchaseForeign * rate;

  const rows = IMPORT_ITEMS.map(([key, ar, en, cat]) =>
    ({ key, ar, en, cat, amount: num(imp[key]) })).filter((r) => r.amount !== 0);
  const importCosts = rows.reduce((a, r) => a + r.amount, 0);

  const landedCost = purchaseBHD + importCosts;
  const repairs = num(imp.expectedRepairs);
  const totalInvestment = landedCost + repairs;
  const selling = num(imp.expectedSellingPrice);

  const expectedProfit = selling - totalInvestment;
  const roi = totalInvestment > 0 ? (expectedProfit / totalInvestment) * 100 : 0;
  const margin = selling > 0 ? (expectedProfit / selling) * 100 : 0;

  /* أقصى سعر شراء آمن — بالدينار وبعملة الشراء */
  const addedCosts = importCosts + repairs;
  let maxBuyBHD;
  if (imp.desiredMode === "roi") {
    const r = num(imp.desiredRoi) / 100;
    maxBuyBHD = selling / (1 + r) - addedCosts;
  } else {
    maxBuyBHD = selling - addedCosts - num(imp.desiredProfit);
  }
  const maxBuyForeign = rate > 0 ? maxBuyBHD / rate : 0;
  const headroom = maxBuyBHD - purchaseBHD;

  return { rate, purchaseForeign, purchaseBHD, rows, importCosts, landedCost,
    repairs, totalInvestment, selling, expectedProfit, roi, margin,
    addedCosts, maxBuyBHD, maxBuyForeign, headroom };
}

/* تحويل حساب استيراد إلى صفقة — بلا احتساب مزدوج */
function importToDeal(imp, models) {
  const k = importEngine(imp);
  const found = models.find((m) => norm(m.brand) === norm(imp.brand)
    && norm(m.model) === norm(imp.model) && String(m.year) === String(imp.year));
  const model = found || mkModel({ brand: imp.brand || "—", model: imp.model || "—",
    year: imp.year || "", trim: imp.trim || "", region: "Import" });

  /* سعر الشراء = ثمن السيارة بالدينار فقط.
     كل بند استيراد يصير مصروفاً منفصلاً — فلا يُحسب مبلغ مرتين. */
  const expenses = k.rows.map((r) => mkExpense({
    category: r.cat, amount: r.amount, paid: false, status: "completed",
    description: r.ar, date: todayISO(),
  }));
  /* الإصلاح المتوقع لم يحدث بعد → مصروف مخطط لا يدخل التكلفة حتى يُنفَّذ */
  if (k.repairs > 0) {
    expenses.push(mkExpense({ category: "mechanical", amount: k.repairs, paid: false,
      status: "planned", description: "إصلاح متوقع", date: todayISO() }));
  }

  const deal = mkDeal({
    vehicleModelId: model.vehicleModelId,
    purchasePrice: k.purchaseBHD,
    askingPrice: k.selling,
    targetProfit: imp.desiredMode === "roi"
      ? Math.round(k.totalInvestment * num(imp.desiredRoi) / 100)
      : num(imp.desiredProfit),
    mileage: imp.mileage, purchaseSource: "import", status: "purchased",
    expenses, notes: imp.notes || "",
    importRef: { importId: imp.importId, country: imp.country,
      currency: imp.currency, rate: k.rate, purchaseForeign: k.purchaseForeign,
      importCosts: k.importCosts, landedCost: k.landedCost },
  });
  return { deal, model: found ? null : model };
}

/* ==================== L6e — INVENTORY AGING =============================== */
const AGING_DEFAULT = { fresh: 30, normal: 60, aging: 90 };

const AGING_BUCKETS = {
  fresh:  { ar: "جديدة",     en: "Fresh",     c: "var(--a-green)", ce: "var(--a-green-e)", cf: "var(--a-green-f)" },
  normal: { ar: "عادية",     en: "Normal",    c: "var(--a-gold)", ce: "var(--a-gold-e)", cf: "var(--a-gold-f)" },
  aging:  { ar: "متقادمة",   en: "Aging",     c: "var(--a-orange)", ce: "var(--a-orange-e)", cf: "var(--a-orange-f)" },
  old:    { ar: "راكدة",     en: "Old Stock", c: "var(--a-red)", ce: "var(--a-red-e)", cf: "var(--a-red-f)" },
};

function agingOf(deal, settings = {}) {
  const th = { ...AGING_DEFAULT, ...(settings.aging || {}) };
  const sold = deal.status === "sold" && deal.soldDate;
  /* المباعة تتجمّد عند تاريخ البيع ولا تستمر بالزيادة */
  const days = sold
    ? daysBetween(deal.purchaseDate, deal.soldDate)
    : daysBetween(deal.purchaseDate, todayISO());
  const sinceListed = deal.listedAt
    ? daysBetween(deal.listedAt, sold ? deal.soldDate : todayISO())
    : null;
  const bucket = days <= num(th.fresh) ? "fresh"
    : days <= num(th.normal) ? "normal"
    : days <= num(th.aging) ? "aging" : "old";
  return { days, sinceListed, bucket, sold, thresholds: th,
    label: AGING_BUCKETS[bucket], holdingDays: sold ? days : null };
}

/* ==================== L6f — AD GENERATOR ==================================
   المرحلة ٩ — يبني الإعلان من بيانات السيارة المسجّلة فقط.
   لا إنترنت ولا ذكاء اصطناعي ولا عبارات تسويقية غير مسجّلة.
   الحقل الفارغ لا يظهر إطلاقاً.
   ========================================================================== */
const AD_MODES = { short: { ar: "مختصر", en: "Short" },
  normal: { ar: "عادي", en: "Normal" }, detailed: { ar: "مفصّل", en: "Detailed" } };
const AD_LANGS = { ar: { ar: "عربي", en: "Arabic" }, en: { ar: "إنجليزي", en: "English" },
  both: { ar: "عربي + إنجليزي", en: "Arabic + English" } };

function buildAd(deal, model, mode, lang, settings = {}, ccy = "BHD") {
  const L = (a, e) => (lang === "en" ? e : a);
  const U = lang === "en" ? CURRENCIES[ccy].en : CURRENCIES[ccy].ar;
  const out = [];
  const push = (v) => { if (v) out.push(v); };

  /* العنوان — من الموديل المسجّل */
  const title = [model?.brand, model?.model, model?.year, model?.trim]
    .filter(Boolean).join(" ");
  push(title);

  const line = (label, value) => (value ? `${label}: ${value}` : "");

  /* الأساسيات */
  if (deal.mileage) push(line(L("الممشى", "Mileage"),
    `${Number(num(deal.mileage)).toLocaleString("en-US")} ${L("كم", "km")}`));
  if (model?.engine || model?.engineSize) {
    push(line(L("المحرك", "Engine"), [model.engine, model.engineSize].filter(Boolean).join(" ")));
  }
  if (model?.transmission) push(line(L("ناقل الحركة", "Transmission"), model.transmission));
  if (model?.drive) push(line(L("الدفع", "Drive"), model.drive));
  if (model?.region) push(line(L("المصدر", "Origin"),
    /import/i.test(model.region) ? L("مستورد", "Import") : L("خليجي", "GCC")));
  if (deal.color) push(line(L("اللون الخارجي", "Exterior"), deal.color));
  if (deal.colorInterior) push(line(L("اللون الداخلي", "Interior"), deal.colorInterior));

  /* الصيانة — من المصاريف المنفَّذة فقط، بلا تأليف */
  if (mode !== "short") {
    const done = (deal.expenses || []).filter(expCounts)
      .filter((e) => ["mechanical", "electrical", "bodywork", "paint", "parts",
        "oil", "tires", "battery", "ac"].includes(e.category));
    if (done.length) {
      const names = [...new Set(done.map((e) => {
        const cat = EXPENSE_CATS[e.category];
        return e.description || (cat ? cat[lang === "en" ? "en" : "ar"] : "");
      }).filter(Boolean))];
      if (names.length) push(`${L("الصيانة المنفَّذة", "Work done")}: ${names.join(" · ")}`);
    }
  }

  if (deal.features) push(line(L("المواصفات", "Features"), deal.features));
  if (mode === "detailed" && deal.notes) push(line(L("ملاحظات", "Notes"), deal.notes));

  /* السعر والموقع */
  const price = deal.status === "sold" ? num(deal.soldPrice) : num(deal.askingPrice);
  if (price > 0) push(`${L("السعر", "Price")}: ${Number(price).toLocaleString("en-US")} ${U}`);
  if (settings.location) push(line(L("الموقع", "Location"), settings.location));
  if (settings.contact) push(line(L("للتواصل", "Contact"), settings.contact));

  if (mode === "short") {
    /* المختصر: العنوان + الممشى + السعر + الموقع فقط */
    const keep = out.filter((l, i) => i === 0
      || l.startsWith(L("الممشى", "Mileage"))
      || l.startsWith(L("السعر", "Price"))
      || l.startsWith(L("الموقع", "Location")));
    return keep.join("\n");
  }
  return out.join("\n");
}

function buildAdBoth(deal, model, mode, settings, ccy) {
  const a = buildAd(deal, model, mode, "ar", settings, ccy);
  const e = buildAd(deal, model, mode, "en", settings, ccy);
  return `${a}\n\n———\n\n${e}`;
}


/* رقمان بارزان: التكلفة والربح — أهم رقمين في التطبيق */
function HeroPair({ cost, profit, ccy, t, up }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      <div className="card" style={{ padding: "14px 12px" }}>
        <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 6 }}>{t("totalCost")}</div>
        <Counter value={cost} format={(v) => money(v, ccy, { exact: true, fixed: true })}
          style={{ fontSize: 24, fontWeight: 800, color: C.gold,
          display: "block", lineHeight: 1.1, letterSpacing: "-.02em" }} />
        <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 4 }}>{CURRENCIES[ccy].ar}</div>
      </div>
      <div className="card" style={{ padding: "14px 12px" }}>
        <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 6 }}>{t("netProfit")}</div>
        <Counter value={profit}
          format={(v) => (v >= 0 ? "+" : "−") + money(Math.abs(v), ccy, { exact: true, fixed: true })}
          style={{ fontSize: 24, fontWeight: 800,
          color: up ? C.green : C.red, display: "block", lineHeight: 1.1,
          letterSpacing: "-.02em" }} />
        <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 4 }}>{CURRENCIES[ccy].ar}</div>
      </div>
    </div>
  );
}

/* صف ثانوي: ثلاثة أرقام أخف وزناً بصرياً */
function MiniStats({ items }) {
  return (
    <div className="card" style={{ display: "flex", padding: "12px 0", marginBottom: 12 }}>
      {items.map(([l, v, col], i) => (
        <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center",
          borderInlineEnd: i < items.length - 1 ? `1px solid ${C.line}` : 0 }}>
          <div className="num" style={{ fontSize: 15, fontWeight: 800,
            color: col || C.white }}>{v}</div>
          <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 3, padding: "0 4px" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* شريط تقدّم نحو الهدف */
function GoalBar({ label, value, target, ccy, t }) {
  const pct2 = target > 0 ? Math.max(0, Math.min(100, (value / target) * 100)) : 0;
  const done = value >= target && target > 0;
  return (
    <div className="card" style={{ padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: 9 }}>
        <span className="num" style={{ fontSize: 15, fontWeight: 800,
          color: done ? C.green : C.gold }}>{pct2.toFixed(0)}%</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: C.ink2 }}>{label}</span>
      </div>
      <div style={{ height: 8, borderRadius: 26, background: C.s3 || C.card2,
        overflow: "hidden" }}>
        <div className="grow" style={{ height: "100%", width: `${pct2}%`, borderRadius: 26,
          background: done ? C.green : C.goldGrad }} />
      </div>
      <div style={{ display: "flex", marginTop: 8 }}>
        <span className="num" style={{ fontSize: 10.5, color: C.ink3 }}>
          {money(value, ccy, { exact: true, fixed: true })}</span>
        <span style={{ flex: 1 }} />
        <span className="num" style={{ fontSize: 10.5, color: C.ink3 }}>
          {money(target, ccy, { exact: true, fixed: true })}</span>
      </div>
    </div>
  );
}

/* اختصار سريع */
function QuickTile({ icon, label, onClick, accent }) {
  return (
    <button onClick={() => { buzz(); onClick?.(); }} className="card"
      style={{ padding: "14px 6px", cursor: "pointer", display: "grid", justifyItems: "center",
        gap: 8, color: "inherit", fontFamily: "inherit",
        border: `1px solid ${accent ? C.line : C.line}`, borderRadius: RD.md }}>
      <Ic n={icon} c={C.gold} s={20} />
      <span style={{ fontSize: 10.5, fontWeight: 700, color: C.ink2, textAlign: "center",
        lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}

/* ==================== L9a — DESIGN SYSTEM COMPONENTS ====================
   مكوّنات قابلة لإعادة الاستخدام. كل شاشة تستخدمها بدل تكرار الأنماط.
   ========================================================================== */

/* رأس صفحة موحّد: رجوع · عنوان · وصف · إجراء */
function PageHeader({ title, sub, onBack, lang, right, center = true }) {
  return (
    <div style={{ marginBottom: sub ? 14 : 12 }}>
      <div style={{ display: "flex", alignItems: "center", minHeight: 40 }}>
        {onBack ? (
          <button onClick={() => { buzz(); onBack(); }} aria-label="back"
            style={{ background: "none", border: 0, cursor: "pointer", padding: 4,
              width: 36, display: "grid", placeItems: "center" }}>
            <Ic n={lang === "ar" ? "chevR" : "chev"} c={C.white} s={20} />
          </button>
        ) : <span style={{ width: right ? 36 : 0 }} />}
        <h2 style={{ flex: 1, fontSize: 20, fontWeight: 800, color: C.white,
          textAlign: center ? "center" : "start" }}>{title}</h2>
        <span style={{ width: 36, display: "grid", placeItems: "center" }}>{right}</span>
      </div>
      {sub && (
        <p style={{ fontSize: 11.5, color: C.ink3, textAlign: center ? "center" : "start",
          marginTop: 4, lineHeight: 1.7 }}>{sub}</p>
      )}
    </div>
  );
}

/* زر إجراء موحّد */
function ActionButton({ children, onClick, kind = "primary", disabled, full = true,
  icon, style, sound }) {
  const base = {
    width: full ? "100%" : undefined, minHeight: 52, borderRadius: RD.md,
    cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
    font: "700 13.5px inherit", display: "inline-flex", alignItems: "center",
    justifyContent: "center", gap: 8, padding: "0 16px",
    opacity: disabled ? 0.42 : 1, transition: "transform .12s ease, opacity .12s ease",
  };
  const kinds = {
    primary: { background: C.goldGrad, color: C.onGold, border: 0 },
    outline: { background: "transparent", color: C.gold, border: `1px solid ${C.line}` },
    quiet:   { background: C.card2, color: C.ink2, border: `1px solid ${C.line}` },
    danger:  { background: "transparent", color: C.redHi, border: `1px solid ${C.redEdge}` },
    success: { background: C.green, color: C.onGreen, border: 0 },
  };
  return (
    <button disabled={disabled} onClick={() => { if (disabled) return; buzz(12);
      if (sound && Sfx[sound]) Sfx[sound](); onClick?.(); }}
      style={{ ...base, ...(kinds[kind] || kinds.primary), ...style }}>
      {icon && <Ic n={icon} c={kind === "primary" ? C.onGold : C.gold} s={17} />}
      {children}
    </button>
  );
}

/* مبدّل مقطعي موحّد */
function SegmentedControl({ value, onChange, options, size = "md" }) {
  const h = size === "sm" ? 36 : 42;
  return (
    <div style={{ display: "flex", gap: 4, background: C.card2, borderRadius: 12,
      padding: 4, border: `1px solid ${C.line}` }}>
      {options.map(([k, label]) => {
        const on = value === k;
        return (
          <button key={k} onClick={() => { buzz(); onChange(k); }}
            style={{ flex: 1, border: 0, borderRadius: 8, minHeight: h, cursor: "pointer",
              font: `700 ${size === "sm" ? 11.5 : 12.5}px inherit`, padding: "0 6px",
              background: on ? C.goldGrad : "transparent",
              color: on ? C.onGold : C.ink3, transition: "background .15s ease" }}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* بطاقة قسم موحّدة */
function SectionCard({ title, icon, children, accent, action, style }) {
  return (
    <div className={accent ? "cardG" : "card"} style={{ padding: 14, marginBottom: 12, ...style }}>
      {(title || icon) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          {icon && <Ic n={icon} c={accent ? C.gold : C.ink2} s={17} />}
          <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800,
            color: accent ? C.gold : C.white }}>{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* نافذة مركزية موحّدة */
function Modal({ title, children, onClose, actions }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 120,
      background: C.scrim, display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="in"
        style={{ width: "100%", maxWidth: 340, background: C.card, borderRadius: RD.lg,
          border: `1px solid ${C.line}`, boxShadow: C.elev, padding: 20 }}>
        {title && (
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 12,
            textAlign: "center" }}>{title}</h3>
        )}
        {children}
        {actions && <div style={{ display: "flex", gap: 10, marginTop: 18 }}>{actions}</div>}
      </div>
    </div>
  );
}

/* ============================= L7 — ANALYTICS ============================== */
const PERIODS = {
  month: { ar: "هذا الشهر", en: "This Month", days: 30 },
  m3: { ar: "٣ أشهر", en: "3 Months", days: 90 },
  m6: { ar: "٦ أشهر", en: "6 Months", days: 180 },
  year: { ar: "هذي السنة", en: "This Year", days: 365 },
  all: { ar: "كل الفترات", en: "All Time", days: null },
};

function analytics(deals, models, settings, period = "all") {
  const live = deals.filter((d) => !d.deleted);
  const cutoff = PERIODS[period]?.days
    ? new Date(Date.now() - PERIODS[period].days * 864e5) : null;
  const inRange = (d) => !cutoff || new Date(d.soldDate || d.purchaseDate) >= cutoff;
  const rows = live.filter(inRange).map((d) => ({ d, k: computeDeal(d, settings) }));

  const sold = rows.filter((r) => r.d.status === "sold");
  const open = rows.filter((r) => OPEN_STATUSES.includes(r.d.status));
  const cancelled = rows.filter((r) => r.d.status === "cancelled");

  const totalInvestment = rows.reduce((s, r) => s + r.k.totalCost, 0);
  const totalExpenses = rows.reduce((s, r) => s + r.k.totalExpenses, 0);
  const totalSales = sold.reduce((s, r) => s + r.k.sellingPrice, 0);
  /* البند 27: فصل المحقق عن المتوقع */
  const realizedProfit = sold.reduce((s, r) => s + r.k.profit, 0);
  const expectedProfit = open.reduce((s, r) => s + r.k.profit, 0);

  const avgProfit = sold.length ? realizedProfit / sold.length : 0;
  const avgRoi = sold.length ? sold.reduce((s, r) => s + r.k.roi, 0) / sold.length : 0;
  const avgDays = sold.length ? sold.reduce((s, r) => s + r.k.daysHeld, 0) / sold.length : 0;

  const ranked = [...sold].sort((a, b) => b.k.profit - a.k.profit);
  const brandAgg = {};
  sold.forEach((r) => {
    const m = models.find((x) => x.vehicleModelId === r.d.vehicleModelId);
    const b = m?.brand || "—";
    brandAgg[b] = (brandAgg[b] || 0) + r.k.profit;
  });
  const topBrand = Object.entries(brandAgg).sort((a, b) => b[1] - a[1])[0] || null;

  const monthlyProfit = Array(12).fill(0);
  const monthlyRoi = Array(12).fill(0);
  const monthlyCount = Array(12).fill(0);
  sold.forEach((r) => {
    const m = new Date(r.d.soldDate || r.d.purchaseDate).getMonth();
    if (m >= 0 && m < 12) {
      monthlyProfit[m] += r.k.profit;
      monthlyRoi[m] += r.k.roi; monthlyCount[m] += 1;
    }
  });
  const roiTrend = monthlyRoi.map((v, i) => (monthlyCount[i] ? v / monthlyCount[i] : 0));

  return { rows, sold, open, cancelled, totalInvestment, totalExpenses, totalSales,
    realizedProfit, expectedProfit, avgProfit, avgRoi, avgDays,
    best: ranked[0] || null, worst: ranked[ranked.length - 1] || null, topBrand,
    monthlyProfit, roiTrend, totalDeals: rows.length };
}


/* ==================== L7b — PORTFOLIO & COMPARISON ======================
   المرحلة ١٠ — كل الأرقام من الدوال القائمة: computeDeal · expenseBreakdown · agingOf
   لا محرك حساب جديد ولا سعر طلب في الربح المحقق.
   ========================================================================== */
const safeDiv = (a, b) => (num(b) !== 0 && Number.isFinite(num(a) / num(b))
  ? num(a) / num(b) : 0);

/* صف مقارنة لسيارة واحدة */
function vehicleRow(deal, model, settings = {}) {
  const k = computeDeal(deal, settings);
  const b = expenseBreakdown(deal, settings.lang === "en" ? "en" : "ar");
  const a = agingOf(deal, settings);
  const isSold = deal.status === "sold";

  /* الربح المحقق للمباعة فقط. المفتوحة تُعرض بربح متوقع بعلامة صريحة */
  const realizedProfit = isSold ? k.profit : null;
  const holdingDays = isSold ? a.holdingDays : null;

  return {
    dealId: deal.dealId, deal, model, k, aging: a,
    name: [model?.brand, model?.model, model?.year].filter(Boolean).join(" ") || "—",
    isSold,
    purchasePrice: k.purchasePrice,
    totalExpenses: k.totalExpenses,
    totalCost: k.totalCost,
    sellingPrice: isSold ? num(deal.soldPrice) : null,
    askingPrice: num(deal.askingPrice),
    realizedProfit,
    expectedProfit: isSold ? null : k.profit,
    roi: isSold ? k.roi : null,
    margin: isSold ? k.margin : null,
    days: a.days, holdingDays,
    partsCost: k.partsTotal, laborCost: k.laborTotal,
    paidExpenses: k.paidExpenses, unpaidExpenses: k.dueExpenses,
    plannedExpenses: k.plannedExpenses,
    topCategory: b.top ? b.top.label : null,
    topCategoryPct: b.top ? b.top.pct : 0,
    topCategoryAmount: b.top ? b.top.amount : 0,
    /* متوسط الربح اليومي — للمباعة فقط */
    avgDailyProfit: isSold && a.holdingDays > 0
      ? safeDiv(k.profit, a.holdingDays) : null,
  };
}

/* ملخّص المحفظة — كله من الصفقات الفعلية */
function portfolioStats(st) {
  const S = st.settings || {};
  const live = (st.deals || []).filter((d) => !d.deleted);
  const rows = live.map((d) => vehicleRow(d, (st.models || [])
    .find((m) => m.vehicleModelId === d.vehicleModelId), S));

  const inventory = rows.filter((r) => OPEN_STATUSES.includes(r.deal.status));
  const sold = rows.filter((r) => r.isSold);

  const totalSpentOnVehicles = rows.reduce((a, r) => a + r.purchasePrice, 0);
  const totalExpenses = rows.reduce((a, r) => a + r.totalExpenses, 0);
  const totalSales = sold.reduce((a, r) => a + num(r.sellingPrice), 0);
  const realizedProfit = sold.reduce((a, r) => a + num(r.realizedProfit), 0);

  const avgProfitPerSold = safeDiv(realizedProfit, sold.length);
  const avgROI = sold.length
    ? safeDiv(sold.reduce((a, r) => a + num(r.roi), 0), sold.length) : 0;
  const avgHoldingDays = sold.length
    ? safeDiv(sold.reduce((a, r) => a + num(r.holdingDays), 0), sold.length) : 0;

  const byProfit = [...sold].sort((a, b) => num(b.realizedProfit) - num(a.realizedProfit));
  const best = byProfit[0] || null;
  const worst = byProfit.length > 1 ? byProfit[byProfit.length - 1] : null;
  const mostExpensive = [...rows].sort((a, b) => b.purchasePrice - a.purchasePrice)[0] || null;
  const highestExpenses = [...rows].sort((a, b) => b.totalExpenses - a.totalExpenses)[0] || null;

  const inventoryCost = inventory.reduce((a, r) => a + r.totalCost, 0);

  return { rows, inventory, sold,
    purchased: rows.length, inventoryCount: inventory.length, soldCount: sold.length,
    totalSpentOnVehicles, totalExpenses, totalSales, realizedProfit,
    avgProfitPerSold, avgROI, avgHoldingDays,
    best, worst, mostExpensive, highestExpenses, inventoryCost };
}

/* أين تذهب المصاريف عبر كل السيارات */
function globalExpenseStats(st, lang = "ar") {
  const live = (st.deals || []).filter((d) => !d.deleted);
  const map = new Map();
  let total = 0;
  live.forEach((d) => {
    (d.expenses || []).filter(expCounts).forEach((e) => {
      const key = e.category === "custom" && e.customCategory ? e.customCategory : e.category;
      const amt = expAmount(e);
      total += amt;
      const cur = map.get(key) || { key, amount: 0, count: 0, cars: new Set() };
      cur.amount += amt; cur.count += 1; cur.cars.add(d.dealId);
      map.set(key, cur);
    });
  });
  const rows = [...map.values()].map((r) => ({
    key: r.key, amount: r.amount, count: r.count, cars: r.cars.size,
    pct: total > 0 ? (r.amount / total) * 100 : 0,
    label: (EXPENSE_CATS[r.key] || { ar: r.key, en: r.key })[lang] || r.key,
    color: (EXPENSE_CATS[r.key] || {}).c || C.gold,
  })).sort((a, b) => b.amount - a.amount);
  return { total, rows, top: rows[0] || null };
}

/* ============================ L8 — VALIDATION ============================== */
function validateDeal(v, t) {
  const errs = {};
  if (!v.brand?.trim() || !v.model?.trim()) errs.brand = t("errBrand");
  if (num(v.purchasePrice) <= 0) errs.purchasePrice = t("errPrice");
  const y = parseInt(v.year, 10);
  if (v.year && (!isFinite(y) || y < 1950 || y > new Date().getFullYear() + 2)) errs.year = t("errYear");
  if (v.mileage && num(v.mileage) < 0) errs.mileage = t("errMileage");
  if (v.vin && v.vin.trim().length !== 17) errs.vin = t("errVin");
  return errs;
}
const validateExpense = (e, t) => (expAmount(e) > 0 ? {} : { amount: t("errAmount") });

/* ======================= L5b — REPOSITORY (Data Layer) =====================
   الشاشات لا تلمس التخزين مباشرة. كل شيء يمر من Repo ← Store.
   ========================================================================== */
const STORE_KEY = "hcardeal_v6";
const DRAFT_KEY = "hcardeal_draft_v1";
const LIB_KEY = "hcd_lib_all";
const PHOTO_PREFIX = "hcd_photos:";
const photoKey = (dealId) => PHOTO_PREFIX + dealId;
const MAX_KEY_BYTES = 4_400_000;

/* ---------------------------------------------------------------------------
   قواعد التخزين هنا:
     • كل مفتاح أقل من 5MB  → الصور لا توضع مع السجل الرئيسي
     • عدد الطلبات محدود    → لا نكتب إلا المفتاح الذي تغيّر فعلاً
     • القراءة من مفتاح غير موجود ترمي خطأ → نسأل list() أولاً
   التخطيط:
     hcardeal_v6        السجل الرئيسي (نص فقط، خفيف)
     hcd_lib_all        كل صور المكتبة في مفتاح واحد
     hcd_photos:<id>    صور كل صفقة، تُكتب فقط عند تغيّرها
--------------------------------------------------------------------------- */
/* فحص فعلي لقدرات التخزين — يقول أين تفشل بالضبط */
async function storageSelfTest() {
  const K = "hcd_test_key";
  const out = [];
  const step = async (name, fn) => {
    try { const r = await fn(); out.push({ name, ok: r !== false }); }
    catch (e) { out.push({ name, ok: false, why: String(e?.message || e).slice(0, 90) }); }
  };
  await step("write", async () => {
    if (Store.mode === "memory") throw new Error("no persistent storage");
    const r = await Store.set(K, JSON.stringify({ t: Date.now() }));
    return r !== null;
  });
  await step("read", async () => {
    const r = await Store.get(K);
    return !!r?.value;
  });
  await step("list", async () => {
    const r = await Store.list("hcd_");
    return !!r;
  });
  await step("big", async () => {
    const blob = "x".repeat(100_000);
    const r = await Store.set(K + "_big", blob);
    return r !== null;
  });
  await step("delete", async () => {
    await Store.delete(K);
    await Store.delete(K + "_big");
    return true;
  });
  return out;
}

const Repo = {
  _lastPhotos: new Map(),
  _lastLib: null,
  _lastMain: null,
  ok: null,               // نتيجة فحص التخزين عند الإقلاع

  /* فحص حقيقي: نكتب ونقرأ ونحذف. يحدَّد مرة واحدة عند الإقلاع. */
  async probe() {
    try {
      if (Store.mode === "memory") { Repo.ok = false; return false; }
      const K = "hcd_probe";
      const w = await Store.set(K, "1");
      if (w === null) { Repo.ok = false; return false; }
      const r = await Store.get(K);
      Repo.ok = !!r && r.value === "1";
      try { await Store.delete(K); } catch {}
      return Repo.ok;
    } catch { Repo.ok = false; return false; }
  },

  async load() {
    let main = null;
    try {
      const r = await Store.get(STORE_KEY);
      main = r ? JSON.parse(r.value) : null;
    } catch { main = null; }
    if (!main?.deals?.length) {
      /* نسخة الإغلاق المفاجئ */
      try {
        const f = window.localStorage?.getItem(STORE_KEY + "_flush");
        if (f) main = JSON.parse(f);
      } catch {}
    }
    if (!main?.deals?.length) return null;

    let keys = new Set();
    try {
      const l = await Store.list("hcd_");
      (l?.keys || []).forEach((k) => keys.add(typeof k === "string" ? k : k?.key));
    } catch {}

    let lib = [];
    if (keys.has(LIB_KEY)) {
      try {
        const r = await Store.get(LIB_KEY);
        lib = r ? JSON.parse(r.value) : [];
        Repo._lastLib = r ? r.value : null;
      } catch {}
    }
    const libById = new Map(lib.map((x) => [x.imageId, x.src]));
    const imageLibrary = (main.imageLibrary || [])
      .map((im) => ({ ...im, src: libById.get(im.imageId) || "" }))
      .filter((im) => im.src);

    const deals = [];
    for (const d of main.deals) {
      let photos = [];
      const k = photoKey(d.dealId);
      if (keys.has(k)) {
        try {
          const r = await Store.get(k);
          photos = r ? JSON.parse(r.value) : [];
          Repo._lastPhotos.set(d.dealId, r ? r.value : "[]");
        } catch {}
      }
      deals.push({ ...d, photos });
    }

    Repo._lastMain = null;
    return { ...main, deals, imageLibrary };
  },

  /* السجل الرئيسي أولاً — هو بيانات المستخدم الفعلية.
     فشل الصور لا يُفشل الحفظ كله، ويُبلَّغ عنه على حدة. */
  async save(state) {
    const light = JSON.stringify({
      ...state,
      deals: state.deals.map(({ photos, ...rest }) => ({ ...rest, photoCount: photos?.length || 0 })),
      imageLibrary: (state.imageLibrary || []).map(({ src, ...rest }) => rest),
    });
    if (light !== Repo._lastMain) {
      const res = await Store.set(STORE_KEY, light);
      if (res === null) throw new Error("save-failed");
      Repo._lastMain = light;
    }

    let mediaFailed = 0;
    for (const d of state.deals) {
      const body = JSON.stringify(d.photos || []);
      if (body === Repo._lastPhotos.get(d.dealId)) continue;
      try {
        if (body.length > MAX_KEY_BYTES) throw new Error("too-large");
        const r = await Store.set(photoKey(d.dealId), body);
        if (r === null) throw new Error("null");
        Repo._lastPhotos.set(d.dealId, body);
      } catch { mediaFailed++; }
    }

    const libBody = JSON.stringify((state.imageLibrary || [])
      .filter((im) => im.src).map((im) => ({ imageId: im.imageId, src: im.src })));
    if (libBody !== Repo._lastLib) {
      try {
        if (libBody.length > MAX_KEY_BYTES) throw new Error("too-large");
        const r = await Store.set(LIB_KEY, libBody);
        if (r === null) throw new Error("null");
        Repo._lastLib = libBody;
      } catch { mediaFailed++; }
    }

    return { mediaFailed };
  },

  async dropPhotos(dealId) {
    try { await Store.delete(photoKey(dealId)); } catch {}
    Repo._lastPhotos.delete(dealId);
  },
  async dropLibImage() { Repo._lastLib = null; },

  async saveDraft(draft) {
    try { await Store.set(DRAFT_KEY, JSON.stringify(draft)); } catch {}
  },
  async loadDraft() {
    try { const r = await Store.get(DRAFT_KEY); return r ? JSON.parse(r.value) : null; }
    catch { return null; }
  },
  async clearDraft() { try { await Store.delete(DRAFT_KEY); } catch {} },
};


/* ==================== L5c — BACKUP / RESTORE ENGINE ======================
   نسخة احتياطية كاملة قابلة للاستعادة، مع توافق رجعي مع كل الصيغ السابقة.
   ========================================================================== */
const APP_VERSION = "1.0.0";
const BACKUP_SCHEMA = 3;           // ٣ = الصيغة الحالية (المرحلة ١١)
const META_KEY = "hcd_backup_meta";
const AUTO_KEY = "hcd_autobackup";

/* كل مفاتيح التطبيق — مرجع واحد حتى لا يُنسى شيء */
const APP_STATE_KEYS = ["models", "deals", "activeDealId", "imageLibrary", "brandLogos",
  "reserve", "recentModels", "favouriteModels", "settings",
  "cashLedger", "businessExpenses", "capital", "inspections", "imports"];

function countBackup(d) {
  const deals = d?.deals || [];
  const live = deals.filter((x) => !x.deleted);
  let photos = 0, expenses = 0, receipts = 0, leads = 0, events = 0;
  let offers = 0, deposits = 0, priceChanges = 0;
  deals.forEach((x) => {
    photos += (x.photos || []).length;
    expenses += (x.expenses || []).length;
    receipts += (x.expenses || []).filter((e) => e.receipt).length;
    leads += (x.leads || []).length;
    offers += (x.leads || []).reduce((a, l) => a + (Array.isArray(l.offers) ? l.offers.length : 0), 0);
    deposits += (x.deposits || []).length;
    priceChanges += (x.priceHistory || []).length;
    events += (x.history || []).length;
  });
  return { deals: deals.length, activeDeals: live.length, models: (d?.models || []).length,
    photos, expenses, receipts, leads, events,
    libraryImages: (d?.imageLibrary || []).length,
    brandLogos: Object.keys(d?.brandLogos || {}).length,
    reserveEntries: (d?.reserve?.entries || []).length,
    cashEntries: (d?.cashLedger || []).length,
    inspections: (d?.inspections || []).length,
    imports: (d?.imports || []).length,
    offers, deposits, priceChanges,
    bizExpenses: (d?.businessExpenses || []).length };
}

/* يبني ملف النسخة الكامل */
function buildBackup(st) {
  const data = {};
  APP_STATE_KEYS.forEach((k) => { data[k] = st[k]; });
  return {
    app: "H CAR DEAL",
    schema: BACKUP_SCHEMA,
    appVersion: APP_VERSION,
    createdAt: nowISO(),
    device: (typeof navigator !== "undefined" ? navigator.userAgent : "").slice(0, 140),
    counts: countBackup(data),
    data,
  };
}

/* ---- التحقق: يرفض الملف التالف أو غير التابع للتطبيق ---- */
function validateBackup(raw) {
  const errs = [];
  let obj = raw;
  if (typeof raw === "string") {
    try { obj = JSON.parse(raw); }
    catch { return { ok: false, errs: ["bad-json"], schema: null, data: null }; }
  }
  if (!obj || typeof obj !== "object") return { ok: false, errs: ["not-object"], schema: null, data: null };

  /* كشف الصيغة */
  let schema = null, data = null;
  if (Number.isInteger(obj.schema) && obj.data) { schema = obj.schema; data = obj.data; }
  else if (obj.app === "H CAR DEAL" && obj.data) { schema = 1; data = obj.data; }
  else if (Array.isArray(obj.deals)) { schema = 0; data = obj; }
  else if (obj.data && Array.isArray(obj.data.deals)) { schema = 1; data = obj.data; }
  else return { ok: false, errs: ["not-hcardeal"], schema: null, data: null };

  if (!Array.isArray(data.deals)) errs.push("no-deals");
  else {
    const bad = data.deals.filter((d) => !d || typeof d !== "object" || !d.dealId);
    if (bad.length) errs.push("bad-deal-records");
    const badExp = data.deals.some((d) => d.expenses && !Array.isArray(d.expenses));
    if (badExp) errs.push("bad-expenses");
  }
  if (data.models && !Array.isArray(data.models)) errs.push("bad-models");
  if (data.settings && typeof data.settings !== "object") errs.push("bad-settings");

  return { ok: errs.length === 0, errs, schema, data, counts: countBackup(data) };
}

/* ---- الترقية: يجعل أي صيغة قديمة صالحة للنسخة الحالية ---- */
function migrateBackup(data, schema) {
  const base = initialState();
  const out = { ...base };
  APP_STATE_KEYS.forEach((k) => { if (data[k] !== undefined) out[k] = data[k]; });
  out.settings = { ...base.settings, ...(data.settings || {}) };
  out.settings.aging = { ...AGING_DEFAULT, ...(data.settings?.aging || {}) };
  out.reserve = data.reserve && Array.isArray(data.reserve.entries)
    ? data.reserve : { entries: [] };
  /* المرحلة ٢: نسخة قديمة بلا دفتر نقدي تُقبل ويُبنى دفترها اشتقاقاً */
  out.cashLedger = Array.isArray(data.cashLedger) ? data.cashLedger : [];
  out.businessExpenses = Array.isArray(data.businessExpenses) ? data.businessExpenses : [];
  out.inspections = Array.isArray(data.inspections) ? data.inspections : [];
  out.imports = Array.isArray(data.imports) ? data.imports : [];
  out.capital = data.capital && typeof data.capital === "object"
    ? { opened: !!data.capital.opened, openingCash: num(data.capital.openingCash),
        openingDate: data.capital.openingDate || "" }
    : { opened: false, openingCash: 0, openingDate: "" };
  out.brandLogos = data.brandLogos && typeof data.brandLogos === "object" ? data.brandLogos : {};
  out.imageLibrary = Array.isArray(data.imageLibrary) ? data.imageLibrary : [];
  out.recentModels = Array.isArray(data.recentModels) ? data.recentModels : [];
  out.favouriteModels = Array.isArray(data.favouriteModels) ? data.favouriteModels : [];
  out.models = Array.isArray(data.models) && data.models.length ? data.models : base.models;

  /* كل صفقة تُكمَّل بالحقول التي أُضيفت بعد إنشائها */
  out.deals = (data.deals || []).map((d) => {
    const seed = mkDeal();
    const deal = { ...seed, ...d };
    deal.expenses = (d.expenses || []).map((e) => ({ ...mkExpense(), ...e }));
    deal.photos = Array.isArray(d.photos) ? d.photos : [];
    deal.leads = (Array.isArray(d.leads) ? d.leads : []).map(normalizeLead);
    deal.priceHistory = Array.isArray(d.priceHistory) ? d.priceHistory : [];
    deal.deposits = Array.isArray(d.deposits) ? d.deposits : [];
    deal.minAcceptable = num(d.minAcceptable);
    deal.colorInterior = d.colorInterior || "";
    deal.features = d.features || "";
    deal.listedAt = d.listedAt || "";
    deal.importRef = d.importRef || null;
    /* المرحلة ٦: حقول المصروف الجديدة تُكمَّل بأمان */
    deal.expenses = deal.expenses.map((e) => ({
      ...e,
      partsCost: num(e.partsCost), laborCost: num(e.laborCost),
      status: e.status || "completed",
      method: e.method || "cash", paidAt: e.paidAt || "",
      item: e.item || "", workshop: e.workshop || "", mileage: e.mileage || "",
      photos: Array.isArray(e.photos) ? e.photos : [],
    }));
    /* المرحلة ٥: حالات العرابين */
    deal.deposits = deal.deposits.map((x) => ({ ...mkDeposit(), ...x,
      status: ["held", "applied", "refunded", "forfeited"].includes(x.status)
        ? x.status : "held" }));
    deal.closing = d.closing || null;
    deal.history = Array.isArray(d.history) ? d.history : [];
    deal.mainPhoto = Number.isInteger(d.mainPhoto) ? d.mainPhoto : 0;
    deal.deleted = d.deleted === true;
    if (!deal.dealId) deal.dealId = uid("deal");
    return deal;
  });

  /* الموديل المفقود يُبنى من الصفقة حتى لا تظهر سيارة بلا اسم */
  const have = new Set(out.models.map((m) => m.vehicleModelId));
  out.deals.forEach((d) => {
    if (d.vehicleModelId && !have.has(d.vehicleModelId)) {
      out.models.push(mkModel({ vehicleModelId: d.vehicleModelId,
        brand: d.brand || "—", model: d.model || "—", year: d.year || "" }));
      have.add(d.vehicleModelId);
    }
  });

  const live = out.deals.filter((d) => !d.deleted);
  if (!live.find((d) => d.dealId === out.activeDealId)) {
    out.activeDealId = live[0]?.dealId || out.deals[0]?.dealId || null;
  }
  out.settings.welcomed = true;
  out._migratedFrom = schema;
  return out;
}

/* ---- بيانات آخر نسخة ---- */
async function readBackupMeta() {
  try { const r = await Store.get(META_KEY); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function writeBackupMeta(meta) {
  try { await Store.set(META_KEY, JSON.stringify(meta)); } catch {}
}

/* ---- نسخة تلقائية قبل أي استعادة ---- */
async function saveAutoBackup(st) {
  try {
    const payload = JSON.stringify(buildBackup(st));
    await Store.set(AUTO_KEY, payload);
    return true;
  } catch { return false; }
}
async function readAutoBackup() {
  try { const r = await Store.get(AUTO_KEY); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}

const humanSize = (bytes) => {
  const b = Number(bytes) || 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

/* بذرة البيانات: صفقة السيرا الحقيقية محفوظة كما هي (البند 62) */
const SEED_DEALS = () => {
  const rows = [
    ["registration", "المرور", "Traffic Dept.", 15, false],
    ["registration", "لوحات جديدة", "New Plates", 10, false],
    ["insurance", "التأمين", "Insurance", 137.9, false],
    ["mechanical", "العنبر — اليمنت", "Alignment", 15, true],
    ["detailing", "تلميع مع ليتات", "Polish + Lights", 50, true],
    ["detailing", "تلميع", "Polish", 50, true],
    ["paint", "الصبغ مع التصليح والحكاك وأندر سيل", "Paint + Repair + Undercoat", 90, true],
    ["parts", "المقصات العلوي مع التركيب", "Upper Arms + Fitting", 65, true],
    ["parts", "رايبون", "Ribbon", 10, true],
    ["fuel", "بترول", "Fuel", 17, true],
    ["fuel", "بترول", "Fuel", 21, true],
    ["mechanical", "التركيب", "Fitting", 10, true],
    ["parts", "شوزات الالتيما", "Altima Shocks", 30, true],
    ["fuel", "بترول", "Fuel", 3, true],
    ["cleaning", "غسيل", "Wash", 4, true],
    ["insurance", "تأمين الجسر", "Causeway Insurance", 1.9, true],
    ["transport", "رايح راجع", "Round Trip", 7, true],
    ["other", "خسارة الأغراض", "Items Loss", 50, true],
    ["parts", "ليتات خلفي يسار", "Rear Left Lights", 33, true],
    ["tires", "الإطارات", "Tires", 50, true],
    ["bodywork", "تركيب الصدر", "Front End Fitting", 107, true],
    ["paint", "تسكير الحوض مع الرفارف", "Bed + Fenders", 175, true],
    ["oil", "أويل مع الفلتر", "Oil + Filter", 33, true],
    ["parts", "المفتاح والكور", "Key + Core", 10, true],
    ["parts", "الصدر كامل مع إيسي فلتر والبلكات والوايرات والفحمات",
      "Full Front End + AC Filter + Plugs + Wires", 267.605, true],
    ["registration", "المخلص والتحويل", "Clearance + Transfer", 65, true],
  ];
  const sierra = mkDeal({
    dealId: "deal_sierra_01", vehicleModelId: "vm_gmc_sierra_2014_sle",
    purchasePrice: 3600, askingPrice: 7000, targetProfit: 2500,
    purchaseDate: "2026-06-20", purchaseSource: "individual", status: "ready",
    mileage: "182000", color: "أبيض",
    expenses: rows.map(([category, ar, en, amount, paid]) =>
      mkExpense({ category, description: ar, descriptionEn: en, amount, paid,
        date: "2026-07-02" })),
    history: [
      { id: uid("ev"), type: "purchased", at: "2026-06-20T09:00:00.000Z" },
      { id: uid("ev"), type: "repair", at: "2026-07-02T09:00:00.000Z" },
      { id: uid("ev"), type: "ready", at: "2026-08-14T09:00:00.000Z" },
    ],
  });
  return [sierra];
};

const initialState = () => ({
  models: SEED_MODELS(),
  deals: SEED_DEALS(),
  activeDealId: "deal_sierra_01",
  imageLibrary: [],
  brandLogos: {},
  reserve: { entries: [] },
  cashLedger: [],
  inspections: [],
  imports: [],
  businessExpenses: [],
  capital: { opened: false, openingCash: 0, openingDate: "" },
  recentModels: ["vm_gmc_sierra_2014_sle"],
  favouriteModels: [],
  settings: { lang: "ar", currency: "BHD", defaultTarget: 300, quickSalePct: 5,
    imageBase: "", sound: true, welcomed: false,
    reserveOn: true, reserveMode: "percent", reservePct: 25,
    reserveFixed: 500, reserveTarget: 5000,
    aging: { fresh: 30, normal: 60, aging: 90 },
    location: "", contact: "",
    theme: "system" },
});

/* ============================= L9 — UI STYLES ============================== */
const Styles = ({ rtl, vars }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800;900&display=swap');
    .hcd{${vars};
      font-family:${rtl ? "'Cairo'," : ""}'Inter',system-ui,sans-serif;
      direction:${rtl ? "rtl" : "ltr"};background:${C.bg};color:${C.white};
      font-variant-numeric:tabular-nums lining-nums;-webkit-font-smoothing:antialiased;
      padding-top:env(safe-area-inset-top)}
    .hcd *{box-sizing:border-box}
    /* 100vh على iOS لا يطرح شريط Safari — dvh يصحّحه */
    .minh{min-height:100vh;min-height:100dvh}

    /* الغلاف: هاتف 520 · لوحي 640 · سطح مكتب 760 */
    .shell{width:100%;max-width:520px;margin:0 auto}
    @media (min-width:760px){
      .shell{max-width:660px}
      .hcd{background:radial-gradient(120% 80% at 50% 0%,${C.card} 0%,${C.bg} 62%)}
    }
    @media (min-width:1100px){
      .shell{max-width:760px}
    }
    /* على الشاشات الكبيرة نعطي الغلاف إطاراً خفيفاً بدل التمدد */
    @media (min-width:900px){
      .shellFrame{border-inline:1px solid ${C.hairline};padding-inline:6px}
    }
    /* الشريط السفلي يبقى بعرض الغلاف لا بعرض الشاشة */
    .navWrap{position:fixed;bottom:0;inset-inline:0;z-index:60;display:flex;justify-content:center;
      pointer-events:none}
    .navWrap > .nav{position:static;pointer-events:auto;width:100%;max-width:520px}
    @media (min-width:760px){ .navWrap > .nav{max-width:660px} }
    @media (min-width:1100px){ .navWrap > .nav{max-width:760px} }
    .hcd h1,.hcd h2,.hcd h3{margin:0;line-height:1.25;letter-spacing:-.01em}
    .hcd p{margin:0}
    .num{direction:ltr;display:inline-block;font-family:'Inter',sans-serif}
    .card{background:${C.card};border:1px solid ${C.line};border-radius:${RD.lg}px}
    .cardG{background:linear-gradient(165deg,${C.card3},${C.card});border:1px solid ${C.line};
      border-radius:${RD.lg}px}
    .btnG{border:0;border-radius:${RD.md}px;padding:16px;width:100%;min-height:54px;cursor:pointer;
      font:800 16px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif;color:${C.onGold};background:${C.goldGrad};
      box-shadow:0 6px 22px rgba(227,180,87,.24),inset 0 1px 0 rgba(255,255,255,.45)}
    .btnG:active{transform:translateY(1px)}
    .btnG:disabled{opacity:.4;box-shadow:none;cursor:not-allowed}
    .btnO{border:1px solid ${C.goldDim};border-radius:${RD.md}px;padding:15px;width:100%;min-height:54px;
      cursor:pointer;background:transparent;color:${C.gold};
      font:700 15px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif}
    .btnR{border:1px solid ${C.redEdge};border-radius:${RD.md}px;padding:15px;width:100%;min-height:54px;
      cursor:pointer;background:${C.redFaint};color:${C.red};
      font:700 15px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif}
    .inp{width:100%;min-height:48px;border:1px solid ${C.line};background:${C.card2};
      border-radius:${RD.sm}px;padding:13px 14px;color:${C.white};outline:none;
      font:600 16px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif;-webkit-appearance:none}
    /* Safari على iOS يكبّر الصفحة إذا كان خط الحقل أقل من 16px */
    .hcd input,.hcd textarea,.hcd select{font-size:16px}
    @media (min-width:760px){ .hcd input,.hcd textarea,.hcd select{font-size:15px} }
    .hcd{-webkit-text-size-adjust:100%;text-size-adjust:100%}

    /* عند فتح لوحة المفاتيح نخفي الشريط السفلي بدل أن يقفز مع المنطقة المرئية */
    body.kb-open .navWrap{opacity:0;pointer-events:none;transform:translateY(100%)}
    .navWrap{transition:transform .18s ease,opacity .18s ease}
    /* اللوحات السفلية تتبع ارتفاع المنطقة المرئية الفعلي */
    .sheetWrap{height:var(--vvh,100dvh)}
    .inp[type="date"]{min-height:48px}
    .inp::placeholder{color:${C.ink4}}
    .inp:focus{border-color:${C.gold}}
    .inp[data-err="1"]{border-color:${C.red}}
    .ltr{direction:ltr;text-align:left;font-family:'Inter',sans-serif}
    .rng{-webkit-appearance:none;appearance:none;width:100%;height:26px;background:transparent;direction:ltr}
    .rng::-webkit-slider-runnable-track{height:8px;border-radius:99px;
      background:linear-gradient(90deg,${C.red} 0%,${C.gold} 48%,${C.green} 100%)}
    .rng::-moz-range-track{height:8px;border-radius:99px;
      background:linear-gradient(90deg,${C.red},${C.gold},${C.green})}
    .rng::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;margin-top:-8px;
      border-radius:50%;background:${C.goldGrad};border:2px solid ${C.goldLo};cursor:grab;
      box-shadow:0 2px 10px rgba(0,0,0,.7)}
    .rng::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:${C.gold};
      border:2px solid ${C.goldLo};cursor:grab}
    .chip{border:1px solid ${C.line};background:${C.card2};color:${C.ink2};border-radius:${RD.pill}px;
      padding:0 14px;min-height:38px;display:inline-flex;align-items:center;justify-content:center;
      cursor:pointer;flex-shrink:0;white-space:nowrap;
      font:700 12px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif}
    .chip[data-on="1"]{border-color:${C.gold};background:${C.goldFaint};color:${C.gold}}
    .nav{display:flex;align-items:flex-end;
      background:${C.card};border-top:1px solid ${C.line};
      border-radius:${RD.xl}px ${RD.xl}px 0 0;
      padding:12px 6px calc(10px + env(safe-area-inset-bottom))}
    .navb{flex:1;background:none;border:0;cursor:pointer;display:grid;justify-items:center;gap:5px;
      padding:3px 2px;color:${C.ink3};font:700 10px ${rtl ? "'Cairo'" : "'Inter'"},sans-serif}
    .navb[data-on="1"]{color:${C.gold}}
    .fab{width:56px;height:56px;border-radius:50%;border:0;cursor:pointer;margin:-26px 4px 0;
      background:${C.goldGrad};color:${C.onGold};font-size:30px;line-height:1;flex-shrink:0;
      box-shadow:0 8px 24px rgba(227,180,87,.4),inset 0 1px 0 rgba(255,255,255,.5)}
    .fab:active{transform:scale(.94)}
    .sheetBox{max-width:520px}
    @media (min-width:760px){ .sheetBox{max-width:660px} }
    @media (min-width:1100px){ .sheetBox{max-width:760px} }
    .scroll-x{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 8px;
      -webkit-overflow-scrolling:touch;scroll-padding-inline:2px}
    .scroll-x::-webkit-scrollbar{display:none}
    .scroll-x > *:last-child{margin-inline-end:2px}
    .wrap-x{display:flex;gap:8px;flex-wrap:wrap}
    @keyframes hIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
    @keyframes hFade{from{opacity:0}to{opacity:1}}
    @keyframes hPop{0%{opacity:0;transform:scale(.8)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
    @keyframes hGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes hSheet{from{transform:translateY(30px);opacity:.3}to{transform:none;opacity:1}}
    @media print{
      body{background:#fff!important}
      body *{visibility:hidden!important}
      .printArea,.printArea *{visibility:visible!important}
      .printArea{position:absolute!important;inset:0!important;margin:0!important;
        border-radius:0!important;box-shadow:none!important;max-width:none!important}
      .noPrint,.nav{display:none!important}
    }
    @keyframes hShine{0%{transform:translateX(-160%) skewX(-18deg)}
      100%{transform:translateX(320%) skewX(-18deg)}}
    @keyframes hPulse{0%{box-shadow:0 0 0 0 var(--pc)}70%{box-shadow:0 0 0 12px transparent}
      100%{box-shadow:0 0 0 0 transparent}}
    @keyframes hFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
    @keyframes hSheen{0%{background-position:220% 0}100%{background-position:-120% 0}}
    @keyframes hBlink{0%{opacity:.35}100%{opacity:1}}

    @media (prefers-reduced-motion:no-preference){
      /* دخول متدرّج لعناصر الشاشة */
      .in > *{animation:hIn .42s cubic-bezier(.22,.85,.28,1) both}
      .in > *:nth-child(1){animation-delay:.02s}
      .in > *:nth-child(2){animation-delay:.06s}
      .in > *:nth-child(3){animation-delay:.10s}
      .in > *:nth-child(4){animation-delay:.14s}
      .in > *:nth-child(5){animation-delay:.18s}
      .in > *:nth-child(6){animation-delay:.22s}
      .in > *:nth-child(n+7){animation-delay:.26s}

      /* استجابة اللمس */
      .card,.btnG,.btnO,.btnR,.chip{transition:transform .16s cubic-bezier(.3,.8,.3,1),
        border-color .2s ease,background .2s ease}
      /* :active ينتقل للعناصر الأب في Safari — نقصره على البطاقات القابلة للضغط
         حتى لا تتحرك البطاقة عند لمس حقل بداخلها */
      button.card:active,.chip:active{transform:scale(.985)}
      .card:has(input:focus),.card:has(textarea:focus){transform:none!important}
      .btnG:active,.btnO:active,.btnR:active{transform:scale(.98) translateY(1px)}

      /* لمعة معدنية تمر على البطاقات الذهبية */
      .cardG{position:relative;overflow:hidden}
      .cardG::after{content:"";position:absolute;top:0;bottom:0;width:38%;
        pointer-events:none;z-index:3;
        background:linear-gradient(90deg,transparent,${C.line},transparent);
        animation:hShine 5.5s ease-in-out infinite}

      /* الشريط السفلي */
      .navb svg{transition:transform .24s cubic-bezier(.2,1.1,.3,1)}
      .navb[data-on="1"] svg{transform:translateY(-3px) scale(1.12)}
      .fab{transition:transform .18s cubic-bezier(.2,1.1,.3,1),box-shadow .25s ease}
      .fab:hover{animation:hFloat 2.4s ease-in-out infinite}

      /* نبضة عند تغيّر النتيجة */
      .pulse{animation:hPulse .7s ease-out}

      /* الأرقام تتحرك بسلاسة */
      .liv{transition:color .25s ease}
    }
    @media (prefers-reduced-motion:no-preference){
      .in{animation:hIn .36s cubic-bezier(.22,.85,.28,1) both}
      .fade{animation:hFade .55s ease both}
      .pop{animation:hPop .5s cubic-bezier(.2,1.1,.3,1) both}
      .grow{transform-origin:${rtl ? "right" : "left"};animation:hGrow .5s ease both}
      .sheetIn{animation:hSheet .26s cubic-bezier(.22,.9,.28,1) both}
      .liv{transition:all .22s ease}
    }
  `}</style>
);

/* ========================== L9 — REUSABLE COMPONENTS ======================= */
const ICONS = {
  cart: "M2.5 3h2l2.2 9.5h9.3L18 6H6", clipboard: "M7 3h6v3H7z M6 5H4.5v14h11V5H14 M7.5 10h5 M7.5 13.5h5",
  calc: "M5 2.5h10v15H5z M8 6.5h4 M7.5 10h1 M11.5 10h1 M7.5 13.5h1 M11.5 13.5h1",
  tag: "M3 10.5V3.5h7l7 7-7 7z M6.5 6.5h.01", chartUp: "M3 15l4.5-5 3 3L17 5 M17 5h-4 M17 5v4",
  bars: "M4 17V9M9.3 17V4M14.6 17v-6",
  target: "M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z M10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z M10 10h.01",
  scale: "M10 3v14 M5 6.5h10 M5 6.5l-2.2 5.5h4.4z M15 6.5l-2.2 5.5h4.4z",
  crown: "M2.5 15.5l1.7-9.5 4.2 4L10 3.5l1.6 6.5 4.2-4 1.7 9.5z",
  home: "M3.5 9.5L10 4l6.5 5.5V17h-13z M8 17v-4.5h4V17",
  garage: "M3 8.5L10 4l7 4.5V17H3z M6 17v-6h8v6 M6 13.5h8",
  gear: "M10 7.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6z M10 2.5v2 M10 15.5v2 M2.5 10h2 M15.5 10h2 M4.7 4.7l1.4 1.4 M13.9 13.9l1.4 1.4 M15.3 4.7l-1.4 1.4 M6.1 13.9l-1.4 1.4",
  bell: "M5.5 8.5a4.5 4.5 0 019 0v4l1.6 2.2H3.9L5.5 12.5z M8.2 17.4h3.6",
  user: "M10 10.5a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z M4 17.5a6 6 0 0112 0",
  menu: "M3 5.5h14 M3 10h14 M3 14.5h9",
  chev: "M12 4.5L6.5 10l5.5 5.5", chevR: "M8 4.5L13.5 10 8 15.5",
  camera: "M3 6.5h3l1.3-2h5.4l1.3 2h3v10H3z M10 13.8a3 3 0 100-6 3 3 0 000 6z",
  edit: "M13.5 3.5l3 3-9 9H4.5v-3z", trash: "M4 5.5h12 M8 5.5V3.5h4v2 M6 5.5l.8 12h6.4l.8-12",
  plus: "M10 4v12 M4 10h12", cal: "M3.5 5h13v12h-13z M3.5 8.5h13 M7 3v3 M13 3v3",
  gavel: "M4 16.5h6 M6 13l5-5 M9.5 5.5l4.5 4.5 M12.5 2.5L17 7l-2 2-4.5-4.5z",
  person: "M10 9.5a3 3 0 100-6 3 3 0 000 6z M4.5 17a5.5 5.5 0 0111 0",
  ship: "M3 14l1.5-4.5h11L17 14a4 4 0 01-14 0z M10 9.5V4 M6.5 4h7",
  fuelP: "M4 17V4.5h7V17 M4 9h7 M13 7l2 1.5V15a1.5 1.5 0 003 0V8.5",
  engine: "M3 8.5h2.5l2-2h5l2 2H17v5h-2v3H5v-3H3z",
  gears: "M10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z M10 3v2 M10 15v2 M3.5 10h2 M14.5 10h2",
  drive: "M4 10h12 M6 6.5h8 M6 13.5h8",
  coins: "M10 4.5c3.6 0 6.5 1 6.5 2.3S13.6 9 10 9 3.5 8.1 3.5 6.8 6.4 4.5 10 4.5z M3.5 6.8v3c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3v-3 M3.5 9.8v3c0 1.3 2.9 2.3 6.5 2.3s6.5-1 6.5-2.3v-3",
  refresh: "M16 6.5A7 7 0 104.6 13 M16 3v4h-4",
  clock: "M10 3a7 7 0 100 14 7 7 0 000-14z M10 6v4.3l2.8 1.7",
  car: "M3 12.5l1.8-4.5h10.4l1.8 4.5 M4.5 12.5h11v3.5h-11z M6 16v1.5 M14 16v1.5",
  info: "M10 3a7 7 0 100 14 7 7 0 000-14z M10 9v4.5 M10 6.6h.01",
  globe: "M10 3a7 7 0 100 14 7 7 0 000-14z M3 10h14 M10 3c1.8 2 2.7 4.4 2.7 7s-.9 5-2.7 7c-1.8-2-2.7-4.4-2.7-7s.9-5 2.7-7z",
  dollar: "M10 3a7 7 0 100 14 7 7 0 000-14z M11.8 8c-.3-.8-1-1.2-1.9-1.2-1.1 0-1.9.6-1.9 1.4 0 2 4 1 4 3.1 0 .9-.9 1.5-2.1 1.5-1 0-1.8-.4-2.1-1.2 M10 5.5v9",
  brush: "M13.5 3.5l3 3-7 7-3-3z M6.5 10.5L4 16l5.5-2.5",
  cloud: "M6 15.5a3 3 0 010-6 4.2 4.2 0 018.1-1 3.5 3.5 0 01.4 7z M10 9v5 M8 12l2 2 2-2",
  download: "M10 3.5v9 M6.5 9.5L10 13l3.5-3.5 M4 16.5h12",
  upload: "M10 16.5v-9 M6.5 10.5L10 7l3.5 3.5 M4 3.5h12",
  exit: "M12 5.5V3.5H4v13h8v-2 M8.5 10h8 M14 7.5L16.5 10 14 12.5",
  spark: "M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6z",
  search: "M9 15.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z M13.8 13.8L17.5 17.5",
  filter: "M3 5h14 M6 10h8 M8.5 15h3", sortI: "M6 4v12 M3.5 12.5L6 16l2.5-3.5 M14 16V4 M11.5 7.5L14 4l2.5 3.5",
  check: "M4 10.5l4 4 8-9", x: "M5 5l10 10 M15 5L5 15",
  star: "M10 3l2.1 4.6 5 .6-3.7 3.5 1 5-4.4-2.5-4.4 2.5 1-5L2.9 8.2l5-.6z",
  history: "M10 3a7 7 0 106.9 8.2 M10 6v4.3l3 1.6 M3.4 6.4L3 3 M3 3h3.4",
};
function Ic({ n: nm, c = C.gold, s = ICON.lg, w = 1.6 }) {
  return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth={w}
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={ICONS[nm] || ICONS.tag} /></svg>;
}

function Logo({ h = 34 }) {
  return <img src={LOGO_SRC} alt="H CAR DEAL"
    style={{ height: h, width: "auto", display: "block", objectFit: "contain" }} />;
}

/* CarImage: lazy + fallback مضمون (البندان 4 و7) */
function CarImage({ src, h = 190, fit = "cover" }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);
  if (src && !bad) {
    return <img src={src} alt="" loading="lazy" decoding="async" onError={() => setBad(true)}
      style={{ width: "100%", height: h, objectFit: fit, display: "block" }} />;
  }
  return <CarPlaceholder h={h} />;
}

function CarPlaceholder({ h = 190 }) {
  return (
    <div style={{ height: h, position: "relative", display: "grid", placeItems: "center",
      overflow: "hidden",
      background: `radial-gradient(130% 100% at 50% 118%,${C.goldFaint} 0%,${C.card} 46%,${C.bg} 100%)` }}>
      {/* أرضية عاكسة */}
      <div style={{ position: "absolute", insetInline: 0, bottom: 0, height: "34%",
        background: `linear-gradient(180deg,transparent,${C.goldFaint})` }} />
      {/* هالة سفلية */}
      <div style={{ position: "absolute", width: "58%", height: 10, bottom: h * 0.235,
        borderRadius: "50%", background: C.line, filter: "blur(17px)" }} />
      {/* خطان ضوئيان خلف السيارة */}
      <div style={{ position: "absolute", top: h * 0.3, insetInline: "8%", height: 1,
        background: `linear-gradient(90deg,transparent,${C.redEdge},transparent)` }} />
      <div style={{ position: "absolute", top: h * 0.38, insetInline: "18%", height: 1,
        background: `linear-gradient(90deg,transparent,${C.goldDim},transparent)` }} />

      <svg viewBox="0 0 220 86" style={{ width: "84%", position: "relative" }} aria-hidden="true">
        <defs>
          <linearGradient id="phB" x1=".18" y1="0" x2=".52" y2="1">
            <stop offset="0%" stopColor="#3A4049" /><stop offset="26%" stopColor="#232830" />
            <stop offset="62%" stopColor="#141821" /><stop offset="100%" stopColor="#0A0D13" />
          </linearGradient>
          <linearGradient id="phG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A1F27" /><stop offset="100%" stopColor="#070A0F" />
          </linearGradient>
          <linearGradient id="phEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" /><stop offset="45%" stopColor={C.goldDim} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* الجسم */}
        <path d="M9 64 C9 55 14 50.5 22 49 L44 27 C51.5 20.5 62 17.5 77 17.5 L131 17.5
                 C148 17.5 160.5 21 170 28.5 L189 43.5 C203 45 211 49.5 211 59
                 L211 66 C211 68 209.5 69 207 69 L13 69 C10.5 69 9 68 9 66 Z"
              fill="url(#phB)" />
        {/* حافة علوية مضيئة */}
        <path d="M44 27 C51.5 20.5 62 17.5 77 17.5 L131 17.5 C148 17.5 160.5 21 170 28.5"
              fill="none" stroke="url(#phEdge)" strokeWidth="1.6" />
        {/* الزجاج */}
        <path d="M51 45 L65.5 29.5 C71.5 24.6 80 22.4 91 22.4 L127 22.4
                 C140 22.4 150 25.2 157.5 31 L172 45 Z" fill="url(#phG)" />
        <path d="M97 23 L97 45 M131 23 L131 45" stroke={C.bg} strokeWidth="1.4" opacity=".8" />
        {/* خط جانبي ذهبي رفيع */}
        <path d="M30 57.5 L184 57.5" stroke={C.goldDim} strokeWidth="1" />
        {/* كشاف أمامي */}
        <path d="M194 47.5 L209 49.5" stroke={C.goldHi} strokeWidth="3" strokeLinecap="round" />
        <path d="M193 53 L206 54.5" stroke={C.gold} strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
        {/* ضوء خلفي أحمر */}
        <path d="M11 50 L21 49" stroke={C.red} strokeWidth="2.4" strokeLinecap="round" opacity=".75" />
        {/* عتبة */}
        <path d="M36 69 L184 69 L184 72 L36 72 Z" fill={C.bg} />
        {/* العجلات */}
        {[57, 168].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy="66" r="17" fill={C.bg} />
            <circle cx={cx} cy="66" r="10" fill="none" stroke={C.card3} strokeWidth="3" />
            <circle cx={cx} cy="66" r="13" fill="none" stroke={C.gold} strokeWidth="1.1" opacity=".42" />
            <circle cx={cx} cy="66" r="3.2" fill={C.ink4} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* عدّاد متحرّك — الرقم يعدّ للقيمة الجديدة بدل ما يقفز */
function useCountUp(target, ms = 520) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  const raf = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce || !isFinite(target)) { setV(target); from.current = target; return; }
    const a = from.current, b = target, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setV(a + (b - a) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);
  return v;
}

function Counter({ value, format = f0, signed: sgnd, style, className = "" }) {
  const v = useCountUp(num(value));
  return <span className={`num liv ${className}`} style={style}>
    {sgnd ? signed(v) : format(v)}</span>;
}

/* ============================ PHOTO CAROUSEL ==============================
   سحب يمين/يسار بين صور السيارة. الصورة اللي توقف عندها تصير الرئيسية.
   ========================================================================== */
function PhotoCarousel({ photos, fallback, h = 190, index = 0, onIndex }) {
  const [i, setI] = useState(Math.min(index, Math.max(0, photos.length - 1)));
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const w = useRef(1);
  const box = useRef(null);

  useEffect(() => { setI(Math.min(index, Math.max(0, photos.length - 1))); }, [index, photos.length]);

  const commit = (next) => {
    const n2 = Math.max(0, Math.min(photos.length - 1, next));
    setI(n2);
    if (n2 !== index) onIndex?.(n2);
  };

  const down = (x) => { start.current = x; w.current = box.current?.clientWidth || 1; };
  const move = (x) => { if (start.current === null) return; setDrag(x - start.current); };
  const up = () => {
    if (start.current === null) return;
    const d = drag;
    start.current = null; setDrag(0);
    if (Math.abs(d) > Math.min(60, w.current * 0.18)) { Sfx.swipe(); commit(i + (d < 0 ? 1 : -1)); }
  };

  if (!photos.length) return <CarImage src={fallback} h={h} />;

  return (
    <div ref={box} style={{ position: "relative", height: h, overflow: "hidden",
      direction: "ltr", touchAction: "pan-y" }}
      onTouchStart={(e) => down(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={up}
      onMouseDown={(e) => down(e.clientX)}
      onMouseMove={(e) => start.current !== null && move(e.clientX)}
      onMouseUp={up}
      onMouseLeave={up}>
      <div style={{ display: "flex", height: "100%", width: `${photos.length * 100}%`,
        transform: `translateX(calc(${-i * (100 / photos.length)}% + ${drag}px))`,
        transition: start.current === null ? "transform .28s cubic-bezier(.22,.85,.28,1)" : "none" }}>
        {photos.map((src, n2) => (
          <div key={n2} style={{ width: `${100 / photos.length}%`, height: "100%", flexShrink: 0 }}>
            <img src={src} alt="" loading="lazy" decoding="async" draggable="false"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                pointerEvents: "none" }} />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <div style={{ position: "absolute", bottom: 10, insetInline: 0, display: "flex",
            justifyContent: "center", gap: 6, zIndex: 5, pointerEvents: "none" }}>
            {photos.map((_, n2) => (
              <span key={n2} style={{ width: n2 === i ? 18 : 6, height: 6, borderRadius: 26,
                background: n2 === i ? C.gold : C.ink2,
                transition: "all .22s ease" }} />
            ))}
          </div>
          {[["prev", -1, 8], ["next", 1, null]].map(([kk, dir, left]) => (
            <button key={kk} onClick={(e) => { e.stopPropagation(); buzz(); commit(i + dir); }}
              aria-label={kk}
              style={{ position: "absolute", top: "50%", transform: "translateY(-50%)",
                [left === null ? "right" : "left"]: 8, width: 32, height: 32, borderRadius: 26,
                background: C.scrim, border: `1px solid ${C.line}`,
                cursor: "pointer", display: "grid", placeItems: "center", zIndex: 5,
                opacity: (dir < 0 && i === 0) || (dir > 0 && i === photos.length - 1) ? .25 : 1 }}>
              <Ic n={dir < 0 ? "chev" : "chevR"} c={C.white} s={15} />
            </button>
          ))}
        </>
      )}
    </div>
  );
}

function AppHeader({ onMenu, onProfile, onAlerts, alertCount }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 0 16px" }}>
      <button onClick={onMenu} aria-label="menu" style={{ background: "none", border: 0,
        cursor: "pointer", padding: 6, width: 40 }}><Ic n="menu" c={C.white} s={22} w={1.8} /></button>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}><Logo h={34} /></div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: 78, justifyContent: "flex-end" }}>
        <button aria-label="alerts" onClick={onAlerts} style={{ background: "none", border: 0,
          cursor: "pointer", position: "relative", padding: 4 }}>
          <Ic n="bell" c={C.gold} s={20} />
          {alertCount > 0 && (
            <span className="num" style={{ position: "absolute", top: -4, insetInlineEnd: -5,
              minWidth: 16, height: 16, borderRadius: 26, background: C.red, color: "#fff",
              fontSize: 9.5, fontWeight: 800, display: "grid", placeItems: "center",
              padding: "0 4px" }}>{alertCount}</span>
          )}
        </button>
        <button onClick={onProfile} aria-label="profile" style={{ width: 34, height: 34,
          borderRadius: 26, background: C.card3, border: `1px solid ${C.line}`, cursor: "pointer",
          display: "grid", placeItems: "center" }}><Ic n="user" c={C.ink2} s={20} /></button>
      </div>
    </div>
  );
}

function StatusBadge({ status, lang, big }) {
  const s = STATUS[status] || STATUS.purchased;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: RD.sm,
      padding: big ? "7px 12px" : "5px 10px", border: `1px solid ${s.ce}`,
      background: `${s.cf}` }}>
      <span style={{ width: 7, height: 7, borderRadius: 26, background: s.c, flexShrink: 0 }} />
      <span style={{ textAlign: "center", lineHeight: 1.25 }}>
        <span style={{ display: "block", fontSize: big ? 11 : 10, fontWeight: 700, color: s.c }}>
          {s[lang]}
        </span>
        {big && <span className="num" style={{ display: "block", fontSize: 9.5, fontWeight: 700,
          color: `${s.c}`, letterSpacing: ".08em" }}>{s.en.toUpperCase()}</span>}
      </span>
    </span>
  );
}

function ProfitBadge({ v, ccy, size = 17 }) {
  const up = v >= 0;
  return <span className="num liv" style={{ fontSize: size, fontWeight: 800, color: up ? C.green : C.red }}>
    {signed(v)}<span style={{ fontSize: size * .55, opacity: .75 }}> {CURRENCIES[ccy].ar}</span></span>;
}

function MoneyInput({ value, onChange, ccy, big, err }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
      border: `1px solid ${err ? C.red : big ? C.line : C.line}`, borderRadius: RD.md,
      padding: big ? "14px 16px" : "12px 13px" }}>
      <span style={{ fontSize: big ? 13 : 11, color: C.ink2, fontWeight: 700 }}>{CURRENCIES[ccy].ar}</span>
      <input className="num" type="number" inputMode="decimal" step="0.001" value={value}
        onChange={(e) => onChange(num(e.target.value))}
        style={{ flex: 1, background: "transparent", border: 0, outline: "none",
          textAlign: big ? "center" : "end", color: C.white,
          font: `800 ${big ? 30 : 21}px 'Inter',sans-serif` }} />
      {big && <span style={{ width: 24 }} />}
    </div>
  );
}

function MetricCard({ label, value, unit, color, size = 17, icon, count }) {
  return (
    <div style={{ flex: 1, minWidth: 0, textAlign: "center", padding: "0 4px" }}>
      {icon && <div style={{ display: "grid", placeItems: "center", marginBottom: 6 }}>
        <Ic n={icon} c={color || C.gold} s={ICON.md} /></div>}
      <div style={{ fontSize: 9.5, color: C.ink2, marginBottom: 4, lineHeight: 1.25 }}>{label}</div>
      <div className="num liv" style={{ fontSize: size, fontWeight: 800, color: color || C.white,
        lineHeight: 1.1 }}>{count !== undefined
          ? <Counter value={count} signed={count < 0 || String(value).startsWith("+")} />
          : value}</div>
      {unit && <div style={{ fontSize: 9.5, color: color ? `${color}` : C.ink3, marginTop: 2 }}>{unit}</div>}
    </div>
  );
}

function MetricStrip({ k, ccy, t, compact }) {
  const up = k.profit >= 0;
  const U = CURRENCIES[ccy].ar;
  const items = [
    { i: "cart", l: t("purchasePrice"), v: f0(k.purchasePrice), n: k.purchasePrice, c: C.white },
    { i: "clipboard", l: t("totalExp"), v: f0(k.totalExpenses), n: k.totalExpenses, c: C.white },
    { i: "calc", l: t("totalCost"), v: f0(k.totalCost), n: k.totalCost, c: C.gold },
    { i: "tag", l: t("sellPrice"), v: f0(k.sellingPrice), n: k.sellingPrice, c: C.white },
    { i: "chartUp", l: t("netProfit"), v: signed(k.profit), c: up ? C.green : C.red, roi: true },
  ];
  return (
    <div className="card" style={{ display: "flex", padding: compact ? "12px 2px" : "14px 2px" }}>
      {items.map((m, i) => (
        <div key={i} style={{ flex: 1, minWidth: 0,
          borderInlineEnd: i < items.length - 1 ? `1px solid ${C.line}` : 0 }}>
          <MetricCard label={m.l} value={m.v} count={m.n} unit={U}
            color={m.c === C.white ? undefined : m.c} size={compact ? 15 : 17} icon={m.i} />
          {m.roi && <div className="num" style={{ fontSize: 9.5, fontWeight: 700,
            color: up ? C.green : C.red, textAlign: "center", marginTop: 1 }}>{pct(k.roi)}</div>}
        </div>
      ))}
    </div>
  );
}

function RangeBar({ be, cur, tgt, t }) {
  const lo = be * .985, hi = Math.max(tgt, cur, be * 1.05) * 1.015;
  const p = `${Math.max(2, Math.min(98, ((cur - lo) / (hi - lo || 1)) * 100))}%`;
  return (
    <div>
      <div style={{ position: "relative", height: 22, marginBottom: 8 }}>
        <div className="grow" style={{ position: "absolute", top: 7, insetInline: 0, height: 9,
          borderRadius: 26, background: `linear-gradient(90deg,${C.red},${C.gold} 50%,${C.green})` }} />
        <span style={{ position: "absolute", top: 0, left: p, transform: "translateX(-50%)",
          width: 22, height: 22, borderRadius: 26, background: C.card2,
          border: `3px solid ${C.bg}`, boxShadow: "0 2px 8px rgba(0,0,0,.7)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {[[t("breakEven"), be, C.red], [t("currentPrice"), cur, C.white], [t("targetPrice"), tgt, C.green]]
          .map(([l, v, col], i) => (
          <div key={i} style={{ textAlign: i === 0 ? "start" : i === 2 ? "end" : "center", flex: 1 }}>
            <div style={{ fontSize: 9.5, color: C.ink3, marginBottom: 2 }}>{l}</div>
            <div className="num liv" style={{ fontSize: 13.5, fontWeight: 800, color: col }}>{f0(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon = "car", title, sub, action, onAction }) {
  return (
    <div className="card" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ display: "grid", placeItems: "center", marginBottom: 14 }}>
        <Ic n={icon} c={C.gold} s={30} />
      </div>
      <h3 style={{ fontSize: 15, marginBottom: 8 }}>{title}</h3>
      {sub && <p style={{ fontSize: 12.5, color: C.ink3, marginBottom: 18, lineHeight: 1.7 }}>{sub}</p>}
      {action && <button className="btnG" onClick={onAction}>{action}</button>}
    </div>
  );
}

function BottomSheet({ title, onClose, children }) {
  return (
    <div onClick={onClose} className="sheetWrap"
      style={{ position: "fixed", insetInline: 0, top: 0, zIndex: 80,
      background: C.scrim, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} className="sheetIn"
        className="sheetBox" style={{ width: "100%", maxHeight: "88vh", overflowY: "auto",
          background: C.card, borderRadius: `${RD.xl}px ${RD.xl}px 0 0`,
          border: `1px solid ${C.line}`, borderBottom: 0,
          padding: "10px 15px calc(20px + env(safe-area-inset-bottom))" }}>
        <div style={{ width: 42, height: 4, borderRadius: 26, background: C.ink4, margin: "0 auto 14px" }} />
        {title && <h3 style={{ fontSize: 17, fontWeight: 800, textAlign: "center", marginBottom: 16 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ text, t, onYes, onNo, danger }) {
  return (
    <div onClick={onNo} style={{ position: "fixed", inset: 0, zIndex: 90, background: C.scrim,
      display: "grid", placeItems: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="card pop"
        style={{ width: "100%", maxWidth: 340, padding: 20, textAlign: "center" }}>
        <div style={{ display: "grid", placeItems: "center", marginBottom: 12 }}>
          <Ic n="info" c={danger ? C.red : C.gold} s={30} />
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.8, marginBottom: 18 }}>{text}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btnO" onClick={onNo}>{t("no")}</button>
          <button className={danger ? "btnR" : "btnG"} onClick={onYes}>{t("yes")}</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, action, onAction }) {
  if (!msg) return null;
  return (
    <div className="in" style={{ position: "fixed", bottom: 96, insetInline: 16, zIndex: 85,
      maxWidth: 480, margin: "0 auto", background: C.card3, border: `1px solid ${C.line}`,
      borderRadius: RD.md, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,.7)" }}>
      <span style={{ flex: 1, fontSize: 13.5 }}>{msg}</span>
      {action && <button onClick={onAction} style={{ background: "none", border: 0, color: C.gold,
        font: "800 13px inherit", cursor: "pointer" }}>{action}</button>}
    </div>
  );
}

/* ============================== L10 — APP ROOT ============================= */
function HCarDeal({ account, onSignOut }) {
  const [ready, setReady] = useState(false);
  const [st, setSt] = useState(() => initialState());
  const [screen, setScreen] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [err, setErr] = useState(null);
  const [saveState, setSaveState] = useState("saved");
  const [mediaWarn, setMediaWarn] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const boot = useRef(true);

  const lang = st.settings.lang;
  const ccy = st.settings.currency;
  const rtl = lang === "ar";
  const theme = useTheme(st.settings?.theme || "system");
  const t = useMemo(() => makeT(lang), [lang]);

  /* ---- تحميل ---- */
  useEffect(() => {
    (async () => {
      await Store.init();
      await Repo.probe();
      const saved = await Repo.load();
      if (saved) setSt((s) => ({ ...initialState(), ...saved,
        settings: { ...initialState().settings, ...saved.settings } }));
      setReady(true);
    })();
  }, []);

  /* ---- المنطقة المرئية: نقيسها بدل التخمين ----
     iOS لا يغيّر layout viewport عند فتح لوحة المفاتيح، بل يزيح visual viewport.
     نقيس الفرق ونخفي الشريط السفلي فقط، بلا إعادة تخطيط تسبب قفزة. ---- */
  const [vv, setVv] = useState(null);
  useEffect(() => {
    const V = window.visualViewport;
    if (!V) return;
    const root = document.documentElement;
    let raf = 0;
    const apply = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = Math.round(V.height);
        root.style.setProperty("--vvh", h + "px");
        /* لوحة المفاتيح مفتوحة إذا نقص الارتفاع أكثر من 140px */
        const open = window.innerHeight - h > 140;
        document.body.classList.toggle("kb-open", open);
        setVv({ w: Math.round(V.width), h, offsetTop: Math.round(V.offsetTop),
          pageTop: Math.round(V.pageTop), scale: +V.scale.toFixed(3),
          innerH: window.innerHeight, kb: open });
      });
    };
    apply();
    V.addEventListener("resize", apply);
    V.addEventListener("scroll", apply);
    return () => {
      cancelAnimationFrame(raf);
      V.removeEventListener("resize", apply);
      V.removeEventListener("scroll", apply);
      document.body.classList.remove("kb-open");
    };
  }, []);

  /* ---- مزامنة مكتبة الصور مع الفهرس ---- */
  useEffect(() => { setUserImages(st.imageLibrary); }, [st.imageLibrary]);
  useEffect(() => { setImageBase(st.settings.imageBase); }, [st.settings.imageBase]);
  useEffect(() => { Sfx.on = st.settings.sound !== false; }, [st.settings.sound]);

  /* ---- حفظ تلقائي مع مؤشر حالة ---- */
  /* التخزين best-effort: البيانات في الذاكرة دائماً، والحفظ يحاول مرتين */
  const tRef = useRef(t);
  useEffect(() => { tRef.current = t; }, [t]);

  /* الحفظ: السجل الرئيسي أولاً. لا يظهر خطأ إلا بعد فشل محاولتين. */
  const persist = useCallback(async (state) => {
    setSaveState("saving");
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await Repo.save(state);
        setSaveState("saved"); setErr(null);
        setMediaWarn(!!res?.mediaFailed);
        return;
      } catch {
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1200));
      }
    }
    setSaveState("error");
    setErr(tRef.current("errSave"));
    Sfx.error();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (boot.current) { boot.current = false; return; }
    setSaveState("dirty");
    const id = setTimeout(() => persist(st), 1200);
    return () => clearTimeout(id);
  }, [st, ready, persist]);

  useEffect(() => {
    if (!err) return;
    const id = setTimeout(() => setErr(null), 6000);
    return () => clearTimeout(id);
  }, [err]);

  /* حفظ فوري قبل إغلاق التطبيق أو تصغيره */
  useEffect(() => {
    const flush = () => {
      if (!ready || boot.current) return;
      Repo.save(st).catch(() => {});
      /* نسخة فورية احتياطية في localStorage تضمن عدم الضياع عند الإغلاق المفاجئ */
      try {
        const light = JSON.stringify({ ...st,
          deals: st.deals.map(({ photos, ...r }) => ({ ...r, photoCount: photos?.length || 0 })),
          imageLibrary: (st.imageLibrary || []).map(({ src, ...r }) => r) });
        window.localStorage?.setItem(STORE_KEY + "_flush", light);
      } catch {}
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [st, ready]);

  /* ---- Actions (الشاشات تنادي هذي فقط) ---- */
  const A = useMemo(() => ({
    setSetting: (k, v) => setSt((s) => ({ ...s, settings: { ...s.settings, [k]: v } })),
    setActive: (id) => setSt((s) => ({ ...s, activeDealId: id })),
    upsertModel: (m) => setSt((s) => {
      const i = s.models.findIndex((x) => x.vehicleModelId === m.vehicleModelId);
      const models = i >= 0 ? s.models.map((x) => (x.vehicleModelId === m.vehicleModelId
        ? { ...x, ...m, updatedAt: nowISO() } : x)) : [...s.models, m];
      return { ...s, models };
    }),
    addDeal: (d, modelId) => setSt((s) => ({
      ...s, deals: [logEvent(d, "purchased"), ...s.deals], activeDealId: d.dealId,
      recentModels: [modelId, ...s.recentModels.filter((x) => x !== modelId)].slice(0, 10),
    })),
    /* أي تغيير في سعر العرض يُسجَّل تلقائياً — ليس ربحاً ولا حركة نقدية */
    patchDeal: (id, p, meta) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => {
        if (d.dealId !== id) return d;
        const next = { ...d, ...p, updatedAt: nowISO() };
        if (p.status === "listed" && !d.listedAt) next.listedAt = todayISO();
        if (p.askingPrice !== undefined && num(p.askingPrice) !== num(d.askingPrice)) {
          next.priceHistory = [...(d.priceHistory || []), {
            id: uid("ph"), at: nowISO(), from: num(d.askingPrice), to: num(p.askingPrice),
            reason: meta?.reason || "", note: meta?.note || "" }];
        }
        return next;
      }) })),
    addOffer: (dealId, leadId, row) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId !== dealId ? d : { ...d, updatedAt: nowISO(),
        leads: (d.leads || []).map((l) => (l.leadId !== leadId ? l
          : { ...normalizeLead(l), lastContact: todayISO(),
              offers: [...normalizeLead(l).offers,
                { id: uid("of"), at: nowISO(), amount: num(row.amount), note: row.note || "" }] })) })) })),
    addDeposit: (dealId, row) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId !== dealId ? d
        : { ...d, updatedAt: nowISO(), deposits: [...(d.deposits || []), mkDeposit(row)] })) })),
    setDepositStatus: (dealId, depositId, status, when) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId !== dealId ? d : { ...d, updatedAt: nowISO(),
        deposits: (d.deposits || []).map((x) => {
          if (x.depositId !== depositId) return x;
          const at = when || todayISO();
          return { ...x, status,
            refundDate: status === "refunded" ? at : x.refundDate,
            forfeitDate: status === "forfeited" ? at : x.forfeitDate };
        }) })) })),
    dropDeposit: (dealId, depositId) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId !== dealId ? d : { ...d, updatedAt: nowISO(),
        deposits: (d.deposits || []).filter((x) => x.depositId !== depositId) })) })),
    setStatus: (id, status) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId === id
        ? logEvent({ ...d, status, listedAt: (status === "listed" && !d.listedAt)
            ? todayISO() : d.listedAt }, status) : d)) })),
    softDelete: (id) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId === id ? { ...d, deleted: true, updatedAt: nowISO() } : d)) })),
    restore: (id) => setSt((s) => ({ ...s,
      deals: s.deals.map((d) => (d.dealId === id ? { ...d, deleted: false } : d)) })),
    toggleFav: (mid) => setSt((s) => ({ ...s,
      favouriteModels: s.favouriteModels.includes(mid)
        ? s.favouriteModels.filter((x) => x !== mid) : [...s.favouriteModels, mid] })),
    importModels: (rows) => setSt((s) => ({ ...s, models: [...s.models, ...rows] })),
    setCapital: (p) => setSt((s) => ({ ...s, capital: { ...s.capital, ...p } })),
    saveImport: (imp) => setSt((s) => {
      const list = s.imports || [];
      const i = list.findIndex((x) => x.importId === imp.importId);
      const row = { ...imp, updatedAt: nowISO() };
      return { ...s, imports: i >= 0
        ? list.map((x) => (x.importId === imp.importId ? row : x)) : [row, ...list] };
    }),
    dropImport: (id) => setSt((s) => ({ ...s,
      imports: (s.imports || []).filter((x) => x.importId !== id) })),
    convertImport: (imp) => setSt((s) => {
      const { deal, model } = importToDeal(imp, s.models);
      return { ...s,
        models: model ? [...s.models, model] : s.models,
        deals: [logEvent(deal, "purchased"), ...s.deals],
        activeDealId: deal.dealId,
        recentModels: [deal.vehicleModelId,
          ...s.recentModels.filter((x) => x !== deal.vehicleModelId)].slice(0, 10),
        imports: (s.imports || []).map((x) => (x.importId === imp.importId
          ? { ...x, status: "converted", dealId: deal.dealId, updatedAt: nowISO() } : x)) };
    }),
    saveInspection: (insp) => setSt((s) => {
      const list = s.inspections || [];
      const i = list.findIndex((x) => x.inspectionId === insp.inspectionId);
      const row = { ...insp, updatedAt: nowISO() };
      return { ...s, inspections: i >= 0
        ? list.map((x) => (x.inspectionId === insp.inspectionId ? row : x))
        : [row, ...list] };
    }),
    dropInspection: (id) => setSt((s) => ({ ...s,
      inspections: (s.inspections || []).filter((x) => x.inspectionId !== id) })),
    convertInspection: (insp) => setSt((s) => {
      const { deal, model } = inspectionToDeal(insp, s.models);
      return { ...s,
        models: model ? [...s.models, model] : s.models,
        deals: [logEvent(deal, "purchased"), ...s.deals],
        activeDealId: deal.dealId,
        recentModels: [deal.vehicleModelId,
          ...s.recentModels.filter((x) => x !== deal.vehicleModelId)].slice(0, 10),
        inspections: (s.inspections || []).map((x) => (x.inspectionId === insp.inspectionId
          ? { ...x, status: "converted", dealId: deal.dealId, updatedAt: nowISO() } : x)) };
    }),
    addCash: (row) => setSt((s) => ({ ...s,
      cashLedger: [...(s.cashLedger || []), mkCashEntry(row)] })),
    dropCash: (id) => setSt((s) => ({ ...s,
      cashLedger: (s.cashLedger || []).filter((x) => x.entryId !== id) })),
    addBiz: (row) => setSt((s) => ({ ...s,
      businessExpenses: [...(s.businessExpenses || []), mkBizExpense(row)] })),
    updateBiz: (id, p) => setSt((s) => ({ ...s,
      businessExpenses: (s.businessExpenses || []).map((x) =>
        (x.bizId === id ? { ...x, ...p, updatedAt: nowISO() } : x)) })),
    dropBiz: (id) => setSt((s) => ({ ...s,
      businessExpenses: (s.businessExpenses || []).filter((x) => x.bizId !== id) })),
    addReserve: (row) => setSt((s) => ({ ...s,
      reserve: { entries: [...(s.reserve?.entries || []), { id: uid("rv"), date: todayISO(), ...row }] } })),
    dropReserve: (id) => setSt((s) => ({ ...s,
      reserve: { entries: (s.reserve?.entries || []).filter((x) => x.id !== id) } })),
    setBrandLogo: (brand, src) => setSt((s) => ({ ...s,
      brandLogos: { ...s.brandLogos, [brand]: src } })),
    removeBrandLogo: (brand) => setSt((s) => {
      const n = { ...s.brandLogos }; delete n[brand]; return { ...s, brandLogos: n };
    }),
    addLibraryImage: (row) => setSt((s) => ({ ...s,
      imageLibrary: [...s.imageLibrary.filter((x) => x.imageId !== row.imageId), row] })),
    removeLibraryImage: (id) => setSt((s) => ({ ...s,
      imageLibrary: s.imageLibrary.filter((x) => x.imageId !== id) })),
    restoreAll: (j) => setSt((s) => ({ ...initialState(), ...j,
      settings: { ...initialState().settings, ...(j.settings || {}) } })),
    reset: () => setSt((s) => {
      s.deals.forEach((d) => Repo.dropPhotos(d.dealId));
      Repo.dropLibImage();
      return initialState();
    }),
  }), []);

  const liveDeals = st.deals.filter((d) => !d.deleted);
  const deal = liveDeals.find((d) => d.dealId === st.activeDealId) || liveDeals[0] || null;
  const modelOf = useCallback((d) => st.models.find((m) => m.vehicleModelId === d?.vehicleModelId) || null,
    [st.models]);
  const model = deal ? modelOf(deal) : null;
  const k = deal ? computeDeal(deal, st.settings) : null;
  const go = (s) => { buzz(); Sfx.nav(); setScreen(s); window.scrollTo({ top: 0 }); };
  const alertCount = useMemo(() => buildAlerts(st.deals, st.models, st.settings).length,
    [st.deals, st.models, st.settings]);
  const flash = (msg, action, onAction) => {
    setToast({ msg, action, onAction });
    setTimeout(() => setToast(null), 4200);
  };

  if (!ready) {
    return <div className="hcd minh" style={{ display: "grid", placeItems: "center" }}>
      <Styles rtl={rtl} vars={theme.vars} /><Logo h={44} /></div>;
  }

  if (!st.settings.welcomed) {
    return <div className="hcd minh">
      <Styles rtl={rtl} vars={theme.vars} />
      <WelcomeScreen t={t} onStart={() => { buzz(14); Sfx.turbo(); setTimeout(() => A.setSetting("welcomed", true), 1150); }} />
    </div>;
  }

  const ctx = { st, A, t, lang, ccy, deal, model, k, modelOf, liveDeals, go, setSheet, setConfirm, flash };

  return (
    <div className="hcd shellFrame minh" style={{
        padding: "10px 14px calc(124px + env(safe-area-inset-bottom))" }}>
      <Styles rtl={rtl} vars={theme.vars} />
      <div className="shell">
        <AppHeader onMenu={() => go("garage")} onProfile={() => go("settings")}
          onAlerts={() => { buzz(); setSheet({ type: "alerts" }); }}
          alertCount={alertCount} />
        {err && (
          <div style={{ background: C.redFaint, border: `1px solid ${C.redEdge}`, borderRadius: RD.sm,
            padding: "10px 12px", marginBottom: 12, fontSize: 12.5, color: C.redHi,
            display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: 1 }}>{err}</span>
            <button onClick={() => persist(st)} style={{ background: "none", border: 0,
              color: C.gold, font: "800 12.5px inherit", cursor: "pointer" }}>{t("retry")}</button>
            <button onClick={() => setErr(null)} aria-label="close" style={{ background: "none",
              border: 0, cursor: "pointer", padding: 4 }}><Ic n="x" c={C.ink3} s={13} /></button>
          </div>
        )}
        {mediaWarn && !err && (
          <div style={{ background: C.goldFaint, border: `1px solid ${C.line}`,
            borderRadius: RD.sm, padding: "10px 12px", marginBottom: 12, fontSize: 12.5,
            color: C.gold, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: 1 }}>{t("errPhotos")}</span>
            <button onClick={() => setMediaWarn(false)} aria-label="close"
              style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
              <Ic n="x" c={C.gold} s={13} /></button>
          </div>
        )}
        <div className="in" key={screen + (deal?.dealId || "")}>
          {screen === "home" && (deal
            ? <HomeScreen {...ctx} />
            : <EmptyState icon="car" title={t("emptyCars")} sub={t("buyCalcSub")}
                action={t("buyCalc")} onAction={() => go("buycalc")} />)}
          {screen === "garage" && <GarageScreen {...ctx} />}
          {screen === "add" && <AddDealScreen {...ctx} />}
          {screen === "details" && (deal ? <DetailsScreen {...ctx} /> : null)}
          {screen === "costs" && (deal ? <CostsScreen {...ctx} /> : null)}
          {screen === "sell" && (deal ? <SellScreen {...ctx} /> : null)}
          {screen === "buycalc" && <BuyCalcScreen {...ctx} />}
          {screen === "reserve" && <ReserveScreen {...ctx} />}
          {screen === "backup" && <BackupCenterScreen {...ctx} />}
          {screen === "capital" && <CapitalScreen {...ctx} />}
          {screen === "inspect" && <InspectionScreen {...ctx} />}
          {screen === "import" && <ImportScreen {...ctx} />}
          {screen === "compare" && <CompareScreen {...ctx} />}
          {screen === "analytics" && <AnalyticsScreen {...ctx} />}
          {screen === "settings" && <SettingsScreen {...ctx} devMode={devMode}
            setDevMode={setDevMode} account={account} onSignOut={onSignOut} />}
          {screen === "imglib" && <ImageLibraryScreen {...ctx} />}
          {screen === "brandlogos" && <BrandLogosScreen {...ctx} />}
        </div>
      </div>

      {sheet?.type === "paste" && deal && (
        <PasteExpensesSheet deal={deal} A={A} t={t} lang={lang} ccy={ccy}
          flash={flash} onClose={() => setSheet(null)} />
      )}

      {sheet?.type === "expense" && deal && (
        <ExpenseSheet {...ctx} initial={sheet.expense} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "ad" && deal && (
        <AdSheet {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "deposits" && deal && (
        <DepositSheet {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "leads" && deal && (
        <LeadsSheet {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "cash" && (
        <CashSheet {...ctx} kind={sheet.kind} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "biz" && (
        <BizSheet {...ctx} initial={sheet.expense} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "alerts" && (
        <AlertsSheet {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "report" && deal && (
        <DealReport {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "photos" && deal && (
        <PhotoManager {...ctx} onClose={() => setSheet(null)} />
      )}
      {sheet?.type === "sold" && deal && (
        <SoldSheet {...ctx} onClose={() => setSheet(null)} />
      )}
      {confirm && (
        <ConfirmDialog text={confirm.text} t={t} danger={confirm.danger}
          onYes={() => { confirm.onYes(); setConfirm(null); }} onNo={() => setConfirm(null)} />
      )}
      <Toast msg={toast?.msg} action={toast?.action} onAction={() => { toast?.onAction?.(); setToast(null); }} />

      {devMode && vv && (
        <div className="num" style={{ position: "fixed", top: "calc(4px + env(safe-area-inset-top))",
          insetInlineStart: 6, zIndex: 200, pointerEvents: "none", background: C.scrim,
          border: `1px solid ${C.line}`, borderRadius: 8, padding: "4px 8px",
          font: "600 9.5px 'Inter',monospace", color: vv.scale !== 1 ? C.red : C.gold,
          lineHeight: 1.5, direction: "ltr" }}>
          vv {vv.w}×{vv.h} · inner {vv.innerH}<br />
          offTop {vv.offsetTop} · pageTop {vv.pageTop}<br />
          scale {vv.scale} {vv.scale !== 1 && "ZOOM!"} · kb {vv.kb ? "open" : "closed"}
        </div>
      )}

      <div className="navWrap"><nav className="nav">
        {[["home", t("navHome"), "home"], ["garage", t("navGarage"), "garage"]].map(([id, lb, ic]) => (
          <button key={id} className="navb" data-on={screen === id ? "1" : "0"} onClick={() => go(id)}>
            <Ic n={ic} c="currentColor" s={20} />{lb}
          </button>
        ))}
        <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
          <button className="fab" onClick={() => go("add")} aria-label={t("navAdd")}>+</button>
          <span style={{ font: "700 9.5px inherit", color: C.ink3 }}>{t("navAdd")}</span>
        </div>
        {[["analytics", t("navAnalytics"), "bars"], ["settings", t("navSettings"), "gear"]].map(([id, lb, ic]) => (
          <button key={id} className="navb" data-on={screen === id ? "1" : "0"} onClick={() => go(id)}>
            <Ic n={ic} c="currentColor" s={20} />{lb}
          </button>
        ))}
      </nav></div>
    </div>
  );
}

/* ============================== WELCOME ==================================== */
function WelcomeScreen({ t, onStart }) {
  const demo = SEED_MODELS()[0];
  const played = useRef(false);
  const prime = () => { if (played.current) return; played.current = true; Sfx.turbo(); };
  return (
    <div onPointerDown={prime} className="minh" style={{ display: "flex", flexDirection: "column",
      padding: "26px 20px calc(26px + env(safe-area-inset-bottom))", textAlign: "center",
      background: `radial-gradient(130% 60% at 50% 12%,${C.card3} 0%,#000 62%)` }}>
      <div className="pop" style={{ display: "grid", placeItems: "center", paddingTop: 12 }}>
        <Logo h={92} />
      </div>
      <div className="fade" style={{ marginTop: 22, animationDelay: ".2s" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{t("welcomeIn")}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 6,
          direction: "ltr", font: "900 27px 'Inter',sans-serif", letterSpacing: ".04em" }}>
          <span style={{ background: `linear-gradient(180deg,#FFF,${C.ink2})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text" }}>H CAR</span>
          <span style={{ background: C.goldGrad, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text" }}>DEAL</span>
        </div>
      </div>
      <div className="fade" style={{ animationDelay: ".4s", marginTop: 26, display: "flex",
        justifyContent: "center", gap: 12, alignItems: "center", direction: "ltr",
        font: "700 15px 'Inter',sans-serif", letterSpacing: ".06em" }}>
        {["BUY", "COST", "SELL", "PROFIT"].map((w, i) => (
          <React.Fragment key={w}>
            {i > 0 && <span style={{ width: 5, height: 5, borderRadius: 26, background: C.gold }} />}
            <span style={{ color: C.white }}>{w}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="fade" style={{ animationDelay: ".5s", height: 1, margin: "16px 8px 12px",
        background: `linear-gradient(90deg,transparent,${C.goldDim},transparent)` }} />
      <p className="fade" style={{ animationDelay: ".55s", fontSize: 13.5, color: C.ink2,
        lineHeight: 1.9, maxWidth: 330, margin: "0 auto" }}>{t("tagline")}</p>
      <div className="fade" style={{ animationDelay: ".7s", flex: 1, display: "grid",
        placeItems: "center", minHeight: 150, margin: "2px 0" }}>
        <div style={{ width: "100%" }}>
          <CarImage src={resolveModelImage(demo)} h={252} fit="contain" />
        </div>
      </div>
      <button className="btnG fade" style={{ animationDelay: ".85s", padding: 16, fontSize: 17 }}
        onClick={onStart}>{t("start")}</button>
      <div className="fade" style={{ animationDelay: "1s", marginTop: 20, display: "grid",
        placeItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,transparent,${C.goldDim})` }} />
          <Ic n="spark" c={C.gold} s={20} />
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${C.goldDim},transparent)` }} />
        </div>
        <p style={{ fontSize: 12.5, color: C.ink2 }}>{t("footNote")}</p>
      </div>
    </div>
  );
}

/* ================================ HOME ===================================== */
function HomeScreen({ deal, model, k, A, t, lang, ccy, go, st, setSheet }) {
  const U = CURRENCIES[ccy].ar;
  const up = k.profit >= 0;
  const img = resolveDealImage(deal, model);
  const hasPhoto = (deal.photos || []).length > 0;
  const age = agingOf(deal, st.settings);
  const specs = [
    deal.mileage && { i: "drive", v: `${Number(num(deal.mileage)).toLocaleString("en-US")} ${lang === "ar" ? "كم" : "km"}` },
    model?.engine && { i: "engine", v: model.engine },
    model?.transmission && { i: "gears", v: model.transmission },
    deal.color && { i: "brush", v: deal.color },
  ].filter(Boolean).slice(0, 4);

  return (
    <>
      {/* الشعار المعتمد */}
      <div style={{ display: "grid", placeItems: "center", padding: "0 0 14px" }}>
        <Logo h={38} />
      </div>

      {/* السيارة الحالية — صورتك الحقيقية إن وُجدت */}
      <div className="card" style={{ padding: 4, overflow: "hidden", marginBottom: 12,
        borderColor: C.line }}>
        <div style={{ position: "relative", minHeight: 190 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <PhotoCarousel photos={deal.photos || []} fallback={img} h={190}
              index={deal.mainPhoto || 0}
              onIndex={(n) => A.patchDeal(deal.dealId, { mainPhoto: n })} />
          </div>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(to top,${C.scrimSolid} 6%,${C.scrim} 46%,transparent 82%)` }} />

          <span onClick={(e) => { e.stopPropagation(); buzz(); setSheet({ type: "photos" }); }}
            role="button" tabIndex={0} aria-label="photos"
            style={{ position: "absolute", top: 12, insetInlineEnd: 12, zIndex: 6, width: 40,
              height: 40, borderRadius: 12, background: C.scrim,
              border: `1px solid ${hasPhoto ? C.line : C.line}`, cursor: "pointer",
              display: "grid", placeItems: "center" }}>
            <Ic n="camera" c={C.gold} s={20} />
            {hasPhoto && (
              <span className="num" style={{ position: "absolute", top: -6, insetInlineEnd: -6,
                minWidth: 18, height: 18, borderRadius: 26, background: C.gold, color: C.onGold,
                fontSize: 9.5, fontWeight: 800, display: "grid", placeItems: "center",
                padding: "0 4px" }}>{deal.photos.length}</span>
            )}
          </span>

          <div style={{ position: "absolute", top: 12, insetInlineStart: 12, zIndex: 5,
            display: "flex", gap: 6 }}>
            <StatusBadge status={deal.status} lang={lang} />
            <AgingBadge deal={deal} st={st} t={t} lang={lang} small />
          </div>

          <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: 14,
            pointerEvents: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BrandBadge brand={model?.brand} size={30} logos={st.brandLogos} />
              <h2 style={{ fontSize: 20, fontWeight: 800, direction: "ltr", color: C.white,
                flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap" }}>{model?.brand} {model?.model}</h2>
              <span className="num" style={{ fontSize: 17, fontWeight: 800, color: C.red }}>
                {model?.year}</span>
            </div>
            {specs.length > 0 && (
              <div style={{ display: "flex", gap: 14, marginTop: 9, flexWrap: "wrap" }}>
                {specs.map((sp, i2) => (
                  <span key={i2} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Ic n={sp.i} c={C.ink3} s={13} />
                    <span className="num" style={{ fontSize: 10.5, color: C.ink2 }}>{sp.v}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* المستوى الأول: التكلفة والربح */}
      <HeroPair cost={k.totalCost} profit={k.profit} ccy={ccy} t={t} up={up} />

      {/* المستوى الثاني: سعر البيع */}
      <div className="card" style={{ display: "flex", alignItems: "center",
        padding: "14px 14px", marginBottom: 12 }}>
        <span style={{ fontSize: 11.5, color: C.ink2, flex: 1, textAlign: "start" }}>
          {k.isSold ? t("soldPrice") : t("sellPrice")}</span>
        <span className="num" style={{ fontSize: 20, fontWeight: 800, color: C.white }}>
          {money(k.sellingPrice, ccy, { exact: true, fixed: true })}</span>
        <span style={{ fontSize: 9.5, color: C.ink3, marginInlineStart: 6 }}>{U}</span>
      </div>

      {/* المستوى الثالث: معلومات ثانوية */}
      <div className="card" style={{ padding: "10px 14px", marginBottom: 12 }}>
        {[[t("purchasePrice"), money(k.purchasePrice, ccy, { exact: true, fixed: true })],
          [t("totalExp"), money(k.totalExpenses, ccy, { exact: true, fixed: true })]].map(([l, v], i2) => (
          <div key={i2} style={{ display: "flex", alignItems: "baseline", padding: "4px 0" }}>
            <span style={{ fontSize: 10.5, color: C.ink3, flex: 1, textAlign: "start" }}>{l}</span>
            <span className="num" style={{ fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* المؤشرات */}
      <MiniStats items={[
        [t("roiShort"), pct(k.roi), up ? C.green : C.red],
        [t("margin"), pct(k.margin), up ? C.green : C.red],
        [t("daysIn"), `${age.days}`, age.label.c],
      ]} />

      <GoalBar label={t("profitTarget")} value={k.profit}
        target={num(deal.targetProfit) || st.settings.defaultTarget} ccy={ccy} t={t} />

      {k.dueExpenses > 0 && (
        <button onClick={() => { buzz(); go("costs"); }} className="card"
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "12px 14px", marginBottom: 12, cursor: "pointer", fontFamily: "inherit",
            border: `1px solid ${C.redEdge}`, borderRadius: RD.md, color: "inherit" }}>
          <Ic n="info" c={C.red} s={17} />
          <span style={{ flex: 1, fontSize: 11.5, color: C.ink2, textAlign: "start" }}>
            {t("notPaidYet")}</span>
          <span className="num" style={{ fontSize: 13.5, fontWeight: 800, color: C.red }}>
            {money(k.dueExpenses, ccy, { exact: true, fixed: true })}</span>
        </button>
      )}

      <div style={{ fontSize: 10.5, color: C.ink3, marginBottom: 8, textAlign: "end" }}>
        {t("quickActions")}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8,
        marginBottom: 12 }}>
        <QuickTile icon="garage" label={t("garage")} onClick={() => go("garage")} />
        <QuickTile icon="clipboard" label={t("costsTitle")} onClick={() => go("costs")} />
        <QuickTile icon="tag" label={t("sellTitle")} onClick={() => go("sell")} />
        <QuickTile icon="bars" label={t("analytics")} onClick={() => go("analytics")} />
      </div>

      <ActionButton kind="primary" icon="calc" onClick={() => go("buycalc")}>
        {t("buyCalc")}</ActionButton>
    </>
  );
}

function GarageScreen({ liveDeals, st, A, t, lang, ccy, go, modelOf, setConfirm, flash }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [q, setQ] = useState("");
  const U = CURRENCIES[ccy].ar;

  const rows = useMemo(() => {
    let r = liveDeals.map((d) => ({ d, m: modelOf(d), k: computeDeal(d, st.settings) }));
    if (filter === "active") r = r.filter((x) => OPEN_STATUSES.includes(x.d.status));
    else if (String(filter).startsWith("age:")) {
      const b = String(filter).slice(4);
      r = r.filter((x) => agingOf(x.d, st.settings).bucket === b);
    } else if (filter !== "all") r = r.filter((x) => x.d.status === filter);
    if (q.trim()) {
      const s2 = norm(translateQuery(q));
      r = r.filter((x) => norm([x.m?.brand, x.m?.model, x.m?.year, x.m?.trim,
        EN_TO_AR_BRAND[x.m?.brand], EN_TO_AR_MODEL[x.m?.model], x.d.vin, x.d.color]
        .filter(Boolean).join(" ")).includes(s2));
    }
    const by = {
      newest: (a, b) => new Date(b.d.createdAt) - new Date(a.d.createdAt),
      oldest: (a, b) => new Date(a.d.createdAt) - new Date(b.d.createdAt),
      profitHi: (a, b) => b.k.profit - a.k.profit,
      profitLo: (a, b) => a.k.profit - b.k.profit,
      investHi: (a, b) => b.k.totalCost - a.k.totalCost,
      investLo: (a, b) => a.k.totalCost - b.k.totalCost,
      year: (a, b) => num(b.m?.year) - num(a.m?.year),
      make: (a, b) => String(a.m?.brand || "").localeCompare(String(b.m?.brand || "")),
      status: (a, b) => STATUS_FLOW.indexOf(a.d.status) - STATUS_FLOW.indexOf(b.d.status),
      aging: (a, b) => agingOf(b.d, st.settings).days - agingOf(a.d, st.settings).days,
    };
    return [...r].sort(by[sort] || by.newest);
  }, [liveDeals, filter, sort, q, st.settings, modelOf]);

  const all = liveDeals.map((d) => ({ d, k: computeDeal(d, st.settings) }));
  const open = all.filter((x) => OPEN_STATUSES.includes(x.d.status));
  const sold = all.filter((x) => x.d.status === "sold");
  const invested = open.reduce((s, x) => s + x.k.totalCost, 0);
  const realized = sold.reduce((s, x) => s + x.k.profit, 0);

  const FILTERS = [["all", t("all")], ...STATUS_FLOW.map((s) => [s, STATUS[s][lang]]),
    ["cancelled", STATUS.cancelled[lang]],
    ...Object.keys(AGING_BUCKETS).map((b) => [`age:${b}`, AGING_BUCKETS[b][lang]])];
  const SORTS = [["aging", t("aging")], ["newest", t("sortNewest")], ["oldest", t("sortOldest")],
    ["profitHi", t("sortProfitHi")], ["profitLo", t("sortProfitLo")],
    ["investHi", t("sortInvestHi")], ["investLo", t("sortInvestLo")],
    ["make", t("sortMake")], ["sortYear", t("sortYear")], ["status", t("sortStatus")]]
    .map(([k2, v]) => [k2 === "sortYear" ? "year" : k2, v]);

  return (
    <>
      <PageHeader title={t("garage")} sub={t("garageSub")} lang={lang}
        right={<Ic n="garage" c={C.gold} s={20} />} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
        {[{ i: "bars", l: t("totalInvest"), v: f0(invested), n: invested, u: U, c: C.gold, br: C.goldDim },
          { i: "chartUp", l: t("realizedProfit"), v: f0(realized), n: realized, u: U,
            c: realized >= 0 ? C.green : C.red, br: C.line },
          { i: "car", l: t("activeCars"), v: open.length, u: t("carUnit"), c: C.white, br: C.line },
          { i: "tag", l: t("soldCars"), v: sold.length, u: t("carUnit"), c: C.ink2, br: C.line },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${s.br}`, borderRadius: RD.md,
            padding: "12px 4px" }}>
            <MetricCard label={s.l} value={s.v} count={s.n} unit={s.u}
              color={s.c === C.white ? undefined : s.c} icon={s.i} />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card2,
        border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "10px 12px", marginBottom: 10 }}>
        <Ic n="search" c={C.ink3} s={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
          style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: C.white,
            font: "600 16px inherit" }} />
        {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0,
          cursor: "pointer", padding: 4 }}><Ic n="x" c={C.ink3} s={15} /></button>}
      </div>

      <div className="wrap-x" style={{ marginBottom: 10 }}>
        {FILTERS.map(([id, lb]) => (
          <button key={id} className="chip" data-on={filter === id ? "1" : "0"}
            onClick={() => { buzz(); setFilter(id); }}>{lb}</button>
        ))}
      </div>
      <div className="wrap-x" style={{ marginBottom: 14, alignItems: "center" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.ink3,
          fontSize: 11.5, flexShrink: 0, paddingInlineEnd: 4 }}>
          <Ic n="sortI" c={C.ink3} s={13} />{t("sort")}
        </span>
        {SORTS.map(([id, lb]) => (
          <button key={id} className="chip" data-on={sort === id ? "1" : "0"}
            onClick={() => { buzz(); setSort(id); }}>{lb}</button>
        ))}
      </div>

      {!rows.length && (
        <EmptyState icon="car" title={q || filter !== "all" ? t("emptyResults") : t("emptyCars")}
          sub={t("addCarSub")} action={`+ ${t("addCar")}`} onAction={() => go("add")} />
      )}

      {rows.map(({ d, m, k }) => (
        <VehicleCard key={d.dealId} st={st} deal={d} model={m} k={k} t={t} lang={lang} ccy={ccy}
          logos={st.brandLogos} selected={d.dealId === st.activeDealId}
          onOpen={() => { A.setActive(d.dealId); go("details"); }}
          onSelect={() => { A.setActive(d.dealId); go("home"); }}
          onDelete={() => setConfirm({ text: t("confirmDeleteCar"), danger: true,
            onYes: () => { A.softDelete(d.dealId); flash(t("del"), t("undo"), () => A.restore(d.dealId)); } })} />
      ))}

      <button onClick={() => go("add")} style={{ width: "100%", marginTop: 8, background: "transparent",
        border: `2px dashed ${C.goldDim}`, borderRadius: RD.lg, padding: "24px 16px", cursor: "pointer",
        display: "grid", justifyItems: "center", gap: 8, fontFamily: "inherit" }}>
        <Ic n="plus" c={C.gold} s={28} w={2} />
        <span style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>{t("addCar")}</span>
        <span style={{ fontSize: 11.5, color: C.ink3 }}>{t("addCarSub")}</span>
      </button>
    </>
  );
}

/* شارة مدة بقاء السيارة في المخزون */
function AgingBadge({ deal, st, t, lang, small }) {
  const a = agingOf(deal, st.settings);
  const L = a.label;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4,
      background: `${L.cf}`, border: `1px solid ${L.ce}`, borderRadius: RD.pill,
      padding: small ? "3px 8px" : "4px 10px", flexShrink: 0 }}>
      <span style={{ width: 6, height: 6, borderRadius: 26, background: L.c }} />
      <span className="num" style={{ fontSize: small ? 10 : 11, fontWeight: 800, color: L.c }}>
        {a.days}</span>
      <span style={{ fontSize: small ? 9 : 10, color: L.c }}>
        {a.sold ? t("holdingDays") : L[lang]}</span>
    </span>
  );
}

function VehicleCard({ deal, model, k, t, lang, ccy, onOpen, onSelect, onDelete, selected, logos, st }) {
  const img = resolveDealImage(deal, model);
  const up = k.profit >= 0;
  const sold = deal.status === "sold";

  return (
    <div className="card" style={{ padding: 4, overflow: "hidden", marginBottom: 12,
      borderColor: selected ? C.gold : C.line }}>
      <button onClick={onSelect} style={{ width: "100%", background: "none", border: 0,
        padding: 4, cursor: "pointer", display: "block", position: "relative" }}>
        <div style={{ position: "relative", minHeight: 150 }}>
          <div style={{ position: "absolute", inset: 0 }}><CarImage src={img} h={150} /></div>
          <div style={{ position: "absolute", inset: 0,
            background: `linear-gradient(to top,${C.scrimSolid} 4%,${C.scrim} 42%,transparent 76%)` }} />

          <div style={{ position: "absolute", top: 11, insetInlineStart: 11, display: "flex",
            gap: 6 }}>
            <StatusBadge status={deal.status} lang={lang} />
            {st && <AgingBadge deal={deal} st={st} t={t} lang={lang} small />}
          </div>

          <div style={{ position: "absolute", insetInline: 0, bottom: 0, padding: 12,
            display: "flex", alignItems: "flex-end" }}>
            <BrandBadge brand={model?.brand} size={26} logos={logos} />
            <span style={{ flex: 1, minWidth: 0, marginInlineStart: 9, textAlign: "start" }}>
              <span style={{ display: "block", fontSize: 17, fontWeight: 800,
                direction: "ltr", color: C.white, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {model?.brand} {model?.model}</span>
              <span className="num" style={{ display: "block", fontSize: 11.5, color: C.ink2,
                marginTop: 2 }}>
                {model?.year}{deal.mileage ? ` · ${Number(num(deal.mileage)).toLocaleString("en-US")} ${lang === "ar" ? "كم" : "km"}` : ""}</span>
            </span>
          </div>
        </div>
      </button>

      {/* ثلاثة أرقام: التكلفة · السعر · الربح — الربح هو الأبرز */}
      <div style={{ display: "flex", padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
        {[[t("totalCost"), money(k.totalCost, ccy, { exact: true, fixed: true }), C.gold, false],
          [sold ? t("soldPrice") : t("sellPrice"), money(k.sellingPrice, ccy, { exact: true, fixed: true }), C.ink2, false],
          [t("netProfit"), signed(k.profit), up ? C.green : C.red, true]].map(([l, v, col, big], i2) => (
          <div key={i2} style={{ flex: 1, minWidth: 0, textAlign: "center",
            borderInlineEnd: i2 < 2 ? `1px solid ${C.line}` : 0 }}>
            <div className="num" style={{ fontSize: big ? 15 : 12.5, fontWeight: 800,
              color: col }}>{v}</div>
            <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 12px 12px" }}>
        <ActionButton kind="outline" onClick={onOpen} style={{ flex: 1, minHeight: 46 }}>
          {t("showDetails")}</ActionButton>
        <button onClick={onDelete} aria-label="delete" style={{ width: 46, minHeight: 46,
          background: "transparent", border: `1px solid ${C.redEdge}`, borderRadius: RD.md,
          cursor: "pointer", display: "grid", placeItems: "center" }}>
          <Ic n="trash" c={C.red} s={17} />
        </button>
      </div>
    </div>
  );
}

function FormBox({ label, error, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${error ? C.red : C.line}`,
      borderRadius: RD.md, padding: "10px 12px" }}>
      <div style={{ fontSize: 10.5, color: error ? C.red : C.ink2, marginBottom: 6 }}>
        {error || label}</div>
      {children}
    </div>
  );
}

function SettingRow({ ic, ar, en, right, onClick, danger, lang }) {
  return (
    <button onClick={onClick} style={{ width: "100%", display: "flex", alignItems: "center",
      gap: 12, background: danger ? C.redFaint : C.card, borderRadius: RD.md, padding: "14px 14px",
      marginBottom: 10, cursor: onClick ? "pointer" : "default", fontFamily: "inherit",
      border: `1px solid ${danger ? C.redEdge : C.line}` }}>
      <span style={{ width: 38, height: 38, borderRadius: 26, flexShrink: 0, display: "grid",
        placeItems: "center", border: `1px solid ${danger ? C.redEdge : C.line}` }}>
        <Ic n={ic} c={danger ? C.red : C.gold} s={20} /></span>
      <span style={{ flex: 1, textAlign: "start", minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 800,
          color: danger ? C.red : C.white }}>{ar}</span>
        <span style={{ display: "block", fontSize: 11.5, color: C.ink3, marginTop: 2,
          direction: "ltr", fontFamily: "Inter,sans-serif" }}>{en}</span>
      </span>
      {right}
      {onClick && !danger && <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.ink3} s={17} />}
    </button>
  );
}

function PickHead({ title, back, lang }) {
  return (
    <PageHeader title={title} lang={lang} onBack={back} />
  );
}

function PickTile({ label, sub, onClick, right, icon, lang }) {
  return (
    <button onClick={() => { buzz(); onClick(); }} className="card"
      style={{ width: "100%", padding: "12px 14px", cursor: "pointer", display: "flex",
        alignItems: "center", gap: 10, color: "inherit", fontFamily: "inherit", marginBottom: 8 }}>
      {icon}
      <span style={{ flex: 1, textAlign: "start", minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700, direction: "ltr",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        {sub && <span style={{ display: "block", fontSize: 10.5, color: C.ink3, marginTop: 2,
          direction: "ltr" }}>{sub}</span>}
      </span>
      {right}
      <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.ink4} s={15} />
    </button>
  );
}

/* ============================== ADD DEAL =================================== */
function AddDealScreen({ st, A, t, lang, ccy, go, flash }) {
  const [step, setStep] = useState("pick");   // pick → form
  const [picked, setPicked] = useState(null); // vehicle model
  const [q, setQ] = useState("");
  const [v, setV] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [errs, setErrs] = useState({});
  const fileRef = useRef(null);

  /* البند 39: مسودة تلقائية — تُكتب بعد توقف الكتابة، لا مع كل حرف */
  useEffect(() => {
    (async () => {
      const d = await Repo.loadDraft();
      if (d?.picked && d?.v) {
        setPicked(d.picked); setV(d.v); setPhotos(d.photos || []); setStep("form");
      } else if (d) { Repo.clearDraft(); }
    })();
  }, []);
  useEffect(() => {
    if (step !== "form" || !picked || !v) return;
    const id = setTimeout(() => Repo.saveDraft({ picked, v, photos }), 900);
    return () => clearTimeout(id);
  }, [step, picked, v, photos]);

  const results = useMemo(() => searchModels(st.models, q), [st.models, q]);
  const recent = st.recentModels.map((id) => st.models.find((m) => m.vehicleModelId === id)).filter(Boolean);
  const favs = st.favouriteModels.map((id) => st.models.find((m) => m.vehicleModelId === id)).filter(Boolean);

  const choose = (m) => {
    buzz();
    setPicked(m);
    setV({ purchasePrice: "", purchaseDate: todayISO(), purchaseSource: "individual",
      mileage: "", vin: "", color: "", targetProfit: st.settings.defaultTarget, notes: "" });
    setStep("form");
  };

  const pickPhotos = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 10 - photos.length);
    e.target.value = "";
    let failed = 0;
    for (const f of files) {
      try { const src = await downscale(f, 820, 0.55); setPhotos((p) => (p.length >= 10 ? p : [...p, src])); }
      catch { failed++; }
    }
    if (failed) flash(t("errPhotoRead"));
  };

  const submit = () => {
    const e = validateDeal({ ...v, brand: picked.brand, model: picked.model, year: picked.year }, t);
    setErrs(e);
    if (Object.keys(e).length) return;
    const d = mkDeal({
      vehicleModelId: picked.vehicleModelId,
      purchasePrice: num(v.purchasePrice), purchaseDate: v.purchaseDate,
      purchaseSource: v.purchaseSource, mileage: v.mileage, vin: v.vin, color: v.color,
      targetProfit: num(v.targetProfit) || st.settings.defaultTarget,
      askingPrice: Math.round(num(v.purchasePrice) * 1.25),
      photos, notes: v.notes, status: "purchased",
    });
    A.addDeal(d, picked.vehicleModelId);
    Repo.clearDraft();
    buzz(14); Sfx.turbo();
    flash(t("savedOk"));
    go("garage");
  };

  /* ---- STEP 1: كتالوج السيارات — وكالة ← موديل ← سنة ← فئة ---- */
  if (step === "pick") {
    return <CatalogPicker st={st} A={A} t={t} lang={lang} onCancel={() => go("garage")}
      onPick={(m) => { A.upsertModel(m); choose(m); }} />;
  }

  /* ---- STEP 2: بيانات الصفقة ---- */
  if (!picked || !v) {
    return <EmptyState icon="car" title={t("chooseModel")} action={t("addCar")}
      onAction={() => setStep("pick")} />;
  }

  const inp = (val, on, ph, ltr = true) => (
    <input value={val} onChange={(e) => on(e.target.value)} placeholder={ph}
      className={ltr ? "ltr" : ""} style={{ width: "100%", background: "transparent", border: 0,
        outline: "none", color: C.white, font: "700 16px 'Inter',sans-serif" }} />
  );

  return (
    <div className="card" style={{ padding: 14 }}>
      <PageHeader title={t("addCarTitle")} lang={lang} onBack={() => setStep("pick")} />

      <div className="card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0, borderRadius: RD.sm, overflow: "hidden",
            position: "relative", minHeight: 132, background: C.black }}>
            <CarImage src={photos[0] || resolveModelImage(picked)} h={132} />
            <div style={{ position: "absolute", inset: 0,
              background: `linear-gradient(to right,${C.scrimSolid},transparent 66%)` }} />
            <div style={{ position: "absolute", top: 10, insetInlineStart: 12, textAlign: "start" }}>
              <div style={{ fontSize: 15, fontWeight: 800, direction: "ltr" }}>
                {picked.brand} {picked.model}</div>
              <div className="num" style={{ fontSize: 13.5, fontWeight: 800, color: C.red }}>
                {picked.year}</div>
              <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 3 }}>{picked.trim}</div>
            </div>
            {photos.length > 0 && (
              <span className="num" style={{ position: "absolute", bottom: 8, insetInlineStart: 10,
                fontSize: 9.5, color: C.gold, background: `${C.scrim}`, borderRadius: 8,
                padding: "4px 8px" }}>{photos.length}/10</span>
            )}
          </div>
          <button onClick={() => fileRef.current?.click()} style={{ width: 146, flexShrink: 0,
            border: `2px dashed ${C.goldDim}`, borderRadius: RD.sm, background: "transparent",
            cursor: "pointer", display: "grid", justifyItems: "center", alignContent: "center",
            gap: 6, padding: 10, fontFamily: "inherit" }}>
            <Ic n="camera" c={C.gold} s={30} />
            <span style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>{t("addPhotos")}</span>
            <span style={{ fontSize: 9.5, color: C.ink3, textAlign: "center", lineHeight: 1.5 }}>
              {t("addPhotosSub")}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif" multiple onChange={pickPhotos}
            style={{ display: "none" }} />
        </div>
        {photos.length > 0 && (
          <div className="scroll-x" style={{ marginTop: 10 }}>
            {photos.map((p, i) => (
              <button key={i} onClick={() => setPhotos((x) => x.filter((_, j) => j !== i))}
                style={{ width: 56, height: 44, flexShrink: 0, padding: 4, borderRadius: 8,
                  overflow: "hidden", border: `1px solid ${i === 0 ? C.gold : C.line}`,
                  cursor: "pointer", background: C.card2 }}>
                <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </button>
            ))}
          </div>
        )}
        <div style={{ fontSize: 9.5, color: C.ink3, textAlign: "center", marginTop: 9 }}>
          {t("photoLimits")}</div>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <FormBox label={`${t("purchasePrice")} (${CURRENCIES[ccy].ar})`} error={errs.purchasePrice}>
          {inp(v.purchasePrice, (x) => setV((s) => ({ ...s, purchasePrice: x })), "16,500")}
        </FormBox>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <FormBox label={t("mileage")} error={errs.mileage}>
            {inp(v.mileage, (x) => setV((s) => ({ ...s, mileage: x })), "12,500")}</FormBox>
          <FormBox label={t("color")}>
            {inp(v.color, (x) => setV((s) => ({ ...s, color: x })), lang === "ar" ? "أحمر" : "Red", false)}</FormBox>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <FormBox label={t("vin")} error={errs.vin}>
            {inp(v.vin, (x) => setV((s) => ({ ...s, vin: x })), "2C3CDXGJ6RH123456")}</FormBox>
          <FormBox label={t("purchaseDate")}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Ic n="cal" c={C.gold} s={15} />
              <input type="date" value={v.purchaseDate}
                onChange={(e) => setV((s) => ({ ...s, purchaseDate: e.target.value }))}
                style={{ flex: 1, background: "transparent", border: 0, outline: "none",
                  color: C.white, font: "700 16px 'Inter',sans-serif", direction: "ltr" }} />
            </div>
          </FormBox>
        </div>
        <FormBox label={t("targetProfit")}>
          {inp(v.targetProfit, (x) => setV((s) => ({ ...s, targetProfit: x })), "300")}</FormBox>
        <FormBox label={t("notes")}>
          {inp(v.notes, (x) => setV((s) => ({ ...s, notes: x })), "", false)}</FormBox>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 10, textAlign: "end" }}>
          {t("purchaseSource")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {Object.entries(SOURCES).map(([kk, sc]) => {
            const on = v.purchaseSource === kk;
            return (
              <button key={kk} onClick={() => { buzz(); setV((s) => ({ ...s, purchaseSource: kk })); }}
                style={{ position: "relative", background: on ? C.goldFaint : C.card2,
                  border: `1px solid ${on ? C.gold : C.line}`, borderRadius: RD.sm,
                  padding: "14px 4px", cursor: "pointer", display: "grid", justifyItems: "center",
                  gap: 8, fontFamily: "inherit" }}>
                <Ic n={sc.icon} c={on ? C.gold : C.ink2} s={20} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: on ? C.gold : C.ink2 }}>
                  {sc[lang]}</span>
                {on && <span style={{ position: "absolute", top: -7, insetInlineEnd: -7, width: 20,
                  height: 20, borderRadius: 26, background: C.gold, color: C.onGold, fontSize: 11.5,
                  display: "grid", placeItems: "center", fontWeight: 900 }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button className="btnG" style={{ marginBottom: 10 }} onClick={submit}>{t("saveCar")}</button>
      <button className="btnO" onClick={() => { Repo.clearDraft(); go("garage"); }}>{t("cancel")}</button>
    </div>
  );
}

function CatalogPicker({ st, A, t, lang, onPick, onCancel }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState(null);
  const [row, setRow] = useState(null);
  const [year, setYear] = useState(null);

  const brands = useMemo(() => Object.keys(CATALOG), []);
  const hits = useMemo(() => (q.trim() ? searchCatalog(q, 80) : []), [q]);
  const models = useMemo(() => (brand ? CATALOG_ROWS.filter((r) => r.brand === brand) : []), [brand]);
  const recent = st.recentModels.map((id) => st.models.find((m) => m.vehicleModelId === id)).filter(Boolean);
  const favs = st.favouriteModels.map((id) => st.models.find((m) => m.vehicleModelId === id)).filter(Boolean);

  const finish = (r, y, trim) => onPick(materializeModel(r, y, trim, st.models));

  /* --- سنة --- */
  if (row && !year) {
    return (
      <div className="card" style={{ padding: 14 }}>
        <PickHead lang={lang} title={t("pickYear")} back={() => setRow(null)} />
        <div style={{ fontSize: 12.5, color: C.gold, fontWeight: 700, textAlign: "center",
          marginBottom: 12, direction: "ltr" }}>{row.brand} {row.model}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {yearsOf(row).map((y) => (
            <button key={y} className="chip" onClick={() => { buzz(); setYear(y); }}
              style={{ padding: "12px 4px", textAlign: "center" }}>
              <span className="num">{y}</span></button>
          ))}
        </div>
      </div>
    );
  }

  /* --- فئة --- */
  if (row && year) {
    return (
      <div className="card" style={{ padding: 14 }}>
        <PickHead lang={lang} title={t("pickTrim")} back={() => setYear(null)} />
        <div style={{ fontSize: 12.5, color: C.gold, fontWeight: 700, textAlign: "center",
          marginBottom: 12, direction: "ltr" }}>
          {row.brand} {row.model} <span className="num">{year}</span></div>
        <button className="btnG" style={{ marginBottom: 12 }}
          onClick={() => finish(row, year, "")}>{t("skipTrim")}</button>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {TRIMS.map((tr) => (
            <button key={tr} className="chip" onClick={() => { buzz(); finish(row, year, tr); }}>
              {tr}</button>
          ))}
        </div>
      </div>
    );
  }

  /* --- موديل داخل وكالة --- */
  if (brand) {
    return (
      <div className="card" style={{ padding: 14 }}>
        <PickHead lang={lang} title={brand} back={() => setBrand(null)} />
        <div style={{ display: "grid", placeItems: "center", marginBottom: 14 }}>
          <BrandBadge brand={brand} size={56} logos={st.brandLogos} />
        </div>
        {models.map((r, i) => (
          <PickTile lang={lang} key={i} label={r.model}
            sub={[lang === "ar" && EN_TO_AR_MODEL[r.model],
              (lang === "ar" ? BODY_AR : BODY_EN)[r.body] || r.body,
              `${r.from}–${r.to}`].filter(Boolean).join(" · ")}
            onClick={() => setRow(r)} />
        ))}
      </div>
    );
  }

  /* --- الشاشة الأولى: بحث سريع + مفضلة + مستخدمة مؤخراً + كل الوكالات --- */
  return (
    <div className="card" style={{ padding: 14 }}>
      <PickHead lang={lang} title={t("chooseModel")} back={onCancel} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card2,
        border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "12px 12px", marginBottom: 12 }}>
        <Ic n="search" c={C.gold} s={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
          style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: C.white,
            font: "600 16px inherit" }} />
        {q && <button onClick={() => setQ("")} style={{ background: "none", border: 0,
          cursor: "pointer" }}><Ic n="x" c={C.ink3} s={15} /></button>}
      </div>

      {q ? (
        <>
          {!hits.length && <EmptyState icon="search" title={t("emptyResults")} />}
          {hits.map((r, i) => (
            <PickTile lang={lang} key={i} icon={<BrandBadge brand={r.brand} size={30} logos={st.brandLogos} />}
              label={`${r.brand} ${r.model}`}
              sub={[lang === "ar" && arLabel(r.brand, r.model),
                (lang === "ar" ? BODY_AR : BODY_EN)[r.body] || r.body,
                `${r.from}–${r.to}`].filter(Boolean).join(" · ")}
              onClick={() => { if (r.pickYear) { setRow(r); setYear(String(r.pickYear)); }
                else setRow(r); }} />
          ))}
        </>
      ) : (
        <>
          {favs.length > 0 && <ModelRow title={t("favorites")} icon="star" models={favs} onPick={onPick} />}
          {recent.length > 0 && <ModelRow title={t("recent")} icon="history" models={recent} onPick={onPick} />}

          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end",
            margin: "6px 0 10px" }}>
            <span className="num" style={{ fontSize: 11.5, color: C.ink3 }}>
              {brands.length} {t("brands")} · {CATALOG_ROWS.length} {t("modelsWord")}</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 12.5, fontWeight: 800 }}>{t("catalogTitle")}</span>
            <Ic n="car" c={C.gold} s={15} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
            {brands.map((b) => (
              <button key={b} className="card" onClick={() => { buzz(); setBrand(b); }}
                style={{ padding: "10px 10px", cursor: "pointer", color: "inherit",
                  fontFamily: "inherit", textAlign: "start", display: "flex",
                  alignItems: "center", gap: 10 }}>
                <BrandBadge brand={b} size={34} logos={st.brandLogos} />
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, direction: "ltr",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b}</span>
                  {lang === "ar" && EN_TO_AR_BRAND[b] && (
                    <span style={{ display: "block", fontSize: 10.5, color: C.ink2 }}>
                      {EN_TO_AR_BRAND[b]}</span>
                  )}
                  <span className="num" style={{ display: "block", fontSize: 9.5, color: C.ink3,
                    marginTop: 1 }}>{CATALOG[b].split(";").length} {t("modelsWord")}</span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ModelRow({ title, icon, models, onPick }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end",
        marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>{title}</span>
        <Ic n={icon} c={C.gold} s={15} />
      </div>
      <div className="scroll-x">
        {models.map((m) => (
          <button key={m.vehicleModelId} onClick={() => onPick(m)} className="card"
            style={{ width: 132, flexShrink: 0, padding: 4, overflow: "hidden", cursor: "pointer",
              color: "inherit", fontFamily: "inherit" }}>
            <CarImage src={resolveModelImage(m)} h={62} />
            <div style={{ padding: "8px 8px", textAlign: "start" }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, direction: "ltr", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.brand} {m.model}</div>
              <div className="num" style={{ fontSize: 10.5, color: C.red }}>{m.year}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========================== VEHICLE DETAILS ================================ */
function DetailsScreen({ deal, model, k, A, t, lang, ccy, go, setSheet, setConfirm, flash, st }) {
  const U = CURRENCIES[ccy].ar;
  const img = resolveDealImage(deal, model);
  const up = k.profit >= 0;

  const info = [
    [t("brand"), model?.brand], [t("model"), model?.model], [t("year"), model?.year],
    [t("trim"), model?.trim], ["Engine", model?.engine], ["Transmission", model?.transmission],
    ["Drive", model?.drive], ["Fuel", model?.fuel],
    [t("mileage"), deal.mileage && `${f0(num(deal.mileage))}`],
    [t("color"), deal.color], [t("vin"), deal.vin],
    [t("purchaseDate"), deal.purchaseDate],
    [t("purchaseSource"), SOURCES[deal.purchaseSource]?.[lang]],
    [t("daysHeld"), `${k.daysHeld} ${t("dayUnit")}`],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHeader title={t("details")} lang={lang} onBack={() => go("garage")} />

      <div className="card" style={{ padding: 4, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ width: "100%", position: "relative", minHeight: 200 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <PhotoCarousel photos={deal.photos || []} fallback={img} h={200}
              index={deal.mainPhoto || 0}
              onIndex={(n) => A.patchDeal(deal.dealId, { mainPhoto: n })} />
          </div>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(to right,${C.scrimSolid} 4%,${C.scrim} 40%,transparent 66%)` }} />
          <div style={{ position: "relative", padding: 16, display: "flex",
            justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none" }}>
            <div style={{ textAlign: "start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <BrandBadge brand={model?.brand} size={28} logos={st.brandLogos} />
                <h3 style={{ fontSize: 20, fontWeight: 800, direction: "ltr" }}>
                  {model?.brand} {model?.model}</h3>
              </div>
              <div className="num" style={{ fontSize: 20, fontWeight: 800, color: C.red }}>
                {model?.year}</div>
              {model?.trim && <div style={{ fontSize: 11.5, color: C.ink2, marginTop: 4 }}>{model.trim}</div>}
            </div>
            <StatusBadge status={deal.status} lang={lang} big />
          </div>
          <button onClick={() => { buzz(); setSheet({ type: "photos" }); }} aria-label="photos"
            style={{ position: "absolute", top: 12, insetInlineEnd: 12, zIndex: 6, display: "flex",
              alignItems: "center", gap: 6, fontSize: 10.5, color: C.gold, background: C.scrim,
              border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px",
              cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
            <Ic n="camera" c={C.gold} s={15} />
            <span className="num">{deal.photos?.length || 0}</span>
          </button>
          {deal.photos?.length > 1 && (
            <span style={{ position: "absolute", bottom: 26, insetInline: 0, textAlign: "center",
              fontSize: 10.5, color: `${C.ink2}`, pointerEvents: "none" }}>
              {t("swipeHint")}</span>
          )}
        </div>
        <div style={{ padding: "0 12px 12px" }}><HeroPair cost={k.totalCost} profit={k.profit} ccy={ccy} t={t} up={k.profit >= 0} />

      <MiniStats items={[
        [t("purchasePrice"), money(k.purchasePrice, ccy, { exact: true, fixed: true }), C.ink2],
        [t("totalExp"), money(k.totalExpenses, ccy, { exact: true, fixed: true }), C.ink2],
        [k.isSold ? t("soldPrice") : t("sellPrice"),
          money(k.sellingPrice, ccy, { exact: true, fixed: true }), C.white],
      ]} />

      <MiniStats items={[
        [t("roiShort"), pct(k.roi), k.profit >= 0 ? C.green : C.red],
        [t("margin"), pct(k.margin), k.profit >= 0 ? C.green : C.red],
        [t("daysIn"), `${agingOf(deal, st.settings).days}`, C.white],
      ]} /></div>
      </div>

      {/* شريط الحالة */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div className="scroll-x">
          {STATUS_FLOW.concat("cancelled").map((s) => (
            <button key={s} className="chip" data-on={deal.status === s ? "1" : "0"}
              onClick={() => {
                buzz();
                if (s === "sold") setSheet({ type: "sold" });
                else A.setStatus(deal.dealId, s);
              }}
              style={deal.status === s ? { borderColor: STATUS[s].c, color: STATUS[s].c,
                background: `${STATUS[s].cf}` } : {}}>{STATUS[s][lang]}</button>
          ))}
        </div>
      </div>

      {/* الأرقام */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        {[[t("purchasePrice"), money(k.purchasePrice, ccy, { exact: true, fixed: true }), C.white],
          [t("totalExp"), money(k.totalExpenses, ccy, { exact: true, fixed: true }), C.white],
          [t("totalCost"), money(k.totalCost, ccy, { exact: true, fixed: true }), C.gold],
          [k.isSold ? t("soldPrice") : t("sellPrice"), money(k.sellingPrice, ccy, { exact: true, fixed: true }), C.white],
          [t("breakEven"), money(k.breakEven, ccy, { exact: true, fixed: true }), C.red],
          [t("targetPrice"), money(k.targetSellingPrice, ccy, { exact: true, fixed: true }), C.green],
          [t("margin"), pct(k.margin), up ? C.green : C.red],
        ].map(([l, v, col], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0",
            borderBottom: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 12.5, color: C.ink2 }}>{l}</span>
            <span className="num liv" style={{ fontSize: 13.5, fontWeight: 800, color: col }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: up ? C.green : C.red }}>
            {t("netProfit")}</span>
          <ProfitBadge v={k.profit} ccy={ccy} size={18} />
        </div>
      </div>

      {/* سجل الصفقة */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("timeline")}</h3>
          <Ic n="history" c={C.gold} s={17} />
        </div>
        {(deal.history || []).map((h, i, a) => (
          <div key={h.id} style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "grid", justifyItems: "center", width: 14 }}>
              <span style={{ width: 10, height: 10, borderRadius: 26, marginTop: 4,
                background: STATUS[h.type]?.c || C.gold }} />
              {i < a.length - 1 && <span style={{ width: 1, flex: 1, background: C.line }} />}
            </div>
            <div style={{ paddingBottom: 16, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>
                {STATUS[h.type]?.[lang] || h.type}</div>
              <div className="num" style={{ fontSize: 10.5, color: C.ink3, marginTop: 2 }}>
                {String(h.at).slice(0, 10)}</div>
            </div>
          </div>
        ))}
        {!deal.history?.length && (
          <p style={{ fontSize: 12.5, color: C.ink3 }}>—</p>
        )}
      </div>

      {/* ملاحظات */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 8 }}>{t("notes")}</div>
        <textarea value={deal.notes} rows={3}
          onChange={(e) => A.patchDeal(deal.dealId, { notes: e.target.value })}
          className="inp" style={{ resize: "vertical" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        {[["person", t("leads"), "leads"], ["coins", t("deposits"), "deposits"],
          ["tag", t("adGen"), "ad"],
          ["clipboard", t("report"), "report"], ["history", t("priceHistory"), null]]
          .filter(([, , sh]) => sh !== null).map(([ic, lb, sh]) => (
          <button key={sh} onClick={() => { buzz(); setSheet({ type: sh }); }} className="card"
            style={{ padding: "14px 8px", cursor: "pointer", display: "grid", justifyItems: "center",
              gap: 8, color: "inherit", fontFamily: "inherit" }}>
            <Ic n={ic} c={C.gold} s={20} />
            <span style={{ fontSize: 11.5, fontWeight: 700 }}>{lb}</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <FormBox label={t("insuranceExpiry")}>
          <input className="inp ltr" type="date" value={deal.insuranceExpiry || ""}
            onChange={(e) => A.patchDeal(deal.dealId, { insuranceExpiry: e.target.value })}
            style={{ background: "transparent", border: 0, padding: 4 }} />
        </FormBox>
        <FormBox label={t("regExpiry")}>
          <input className="inp ltr" type="date" value={deal.regExpiry || ""}
            onChange={(e) => A.patchDeal(deal.dealId, { regExpiry: e.target.value })}
            style={{ background: "transparent", border: 0, padding: 4 }} />
        </FormBox>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button className="btnG" onClick={() => setSheet({ type: "photos" })}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Ic n="camera" c={C.onGold} s={20} />{t("photosTitle")}</button>
        <button className="btnO" onClick={() => go("costs")}>{t("costsTitle")}</button>
        <button className="btnO" onClick={() => go("sell")}>{t("sellTitle")}</button>
        {deal.status !== "sold" && (
          <button className="btnO" onClick={() => setSheet({ type: "sold" })}>{t("closeSale")}</button>
        )}
        <button className="btnR" onClick={() => setConfirm({ text: t("confirmDeleteCar"), danger: true,
          onYes: () => { A.softDelete(deal.dealId); flash(t("del"), t("undo"),
            () => A.restore(deal.dealId)); go("garage"); } })}>{t("deleteDeal")}</button>
      </div>

    </>
  );
}

/* حقل موحّد داخل اللوحات — تسمية واحدة ومسافة واحدة في كل مكان */
function SheetField({ label, hint, error, children, span }) {
  return (
    <label style={{ display: "block", gridColumn: span ? "1 / -1" : "auto" }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, marginBottom: 7,
        color: error ? C.red : C.ink2 }}>{error || label}</div>
      {children}
      {hint && <div style={{ fontSize: 10.5, color: C.ink4, marginTop: 6, lineHeight: 1.6 }}>
        {hint}</div>}
    </label>
  );
}

/* شريط نتائج داخل اللوحات */
function SheetStats({ items }) {
  return (
    <div className="card" style={{ display: "flex", padding: "12px 0" }}>
      {items.map(([l, v, col], i) => (
        <div key={i} style={{ flex: 1, minWidth: 0, textAlign: "center",
          borderInlineEnd: i < items.length - 1 ? `1px solid ${C.line}` : 0 }}>
          <div style={{ fontSize: 9.5, color: C.ink2, marginBottom: 5, padding: "0 4px" }}>{l}</div>
          <div className="num liv" style={{ fontSize: 17, fontWeight: 800, color: col || C.white }}>
            {v}</div>
        </div>
      ))}
    </div>
  );
}

/* ======================== CLOSE SALE — مراجعة أخيرة ======================= */
function SoldSheet({ deal, model, k, A, t, lang, ccy, onClose, flash, st }) {
  const U = CURRENCIES[ccy].ar;
  const depReceived = depositsReceived(deal);          // ما استُلم فعلاً ولم يُرجَع
  const [f, setF] = useState({
    soldPrice: k.sellingPrice || deal.askingPrice,
    soldDate: todayISO(), buyerName: "", buyerPhone: "", notes: "",
    receivedAtClosing: Math.max(0, (k.sellingPrice || deal.askingPrice) - depReceived),
    method: "cash",
  });
  const set = (kk, v) => setF((x) => ({ ...x, [kk]: v }));

  const price = num(f.soldPrice);
  const collected = depReceived + num(f.receivedAtClosing);   // بلا احتساب مزدوج
  const receivable = price - collected;
  const final = computeDeal({ ...deal, soldPrice: price, status: "sold" }, st.settings);
  const days = daysBetween(deal.purchaseDate, f.soldDate);
  const up = final.profit >= 0;
  const keep = reserveFor(final.profit, st.settings);

  /* تعديل سعر البيع يعيد توزيع المستلم عند الإغلاق تلقائياً */
  const setPrice = (v) => setF((x) => ({ ...x, soldPrice: v,
    receivedAtClosing: Math.max(0, v - depReceived) }));

  return (
    <BottomSheet title={t("closeSale")} onClose={onClose}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
        background: C.card2, border: `1px solid ${C.line}`, borderRadius: RD.md, padding: 10 }}>
        <div style={{ width: 76, height: 52, flexShrink: 0, borderRadius: RD.sm,
          overflow: "hidden", background: C.black }}>
          <CarImage src={resolveDealImage(deal, model)} h={52} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, direction: "ltr", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {model?.brand} {model?.model}</div>
          <div className="num" style={{ fontSize: 11.5, color: C.red, fontWeight: 700 }}>
            {model?.year}</div>
        </div>
        <div style={{ textAlign: "end" }}>
          <div style={{ fontSize: 9.5, color: C.ink2 }}>{t("daysInInventory")}</div>
          <div className="num" style={{ fontSize: 15, fontWeight: 800 }}>{days}</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <SheetField label={`${t("soldPrice")} · ${U}`}>
          <MoneyInput ccy={ccy} big value={f.soldPrice} onChange={setPrice} />
        </SheetField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("soldDate")}>
            <input className="inp ltr" type="date" value={f.soldDate}
              onChange={(e) => set("soldDate", e.target.value)} /></SheetField>
          <SheetField label={`${t("receivedAtClosing")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal"
              value={f.receivedAtClosing}
              onChange={(e) => set("receivedAtClosing", num(e.target.value))} /></SheetField>
        </div>

        <SheetField label={t("paymentMethod")}>
          <div className="wrap-x">
            {[["cash", t("mCash")], ["bank", t("mBank")], ["cheque", t("mCheque")],
              ["transfer", t("mTransfer")]].map(([kk, lb]) => (
              <button key={kk} className="chip" data-on={f.method === kk ? "1" : "0"}
                onClick={() => { buzz(); set("method", kk); }}>{lb}</button>
            ))}
          </div>
        </SheetField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("buyerName")}>
            <input className="inp" value={f.buyerName}
              onChange={(e) => set("buyerName", e.target.value)} /></SheetField>
          <SheetField label={t("buyerPhone")}>
            <input className="inp ltr" inputMode="tel" value={f.buyerPhone}
              onChange={(e) => set("buyerPhone", e.target.value)} /></SheetField>
        </div>

        <SheetField label={t("notes")}>
          <input className="inp" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </SheetField>

        {/* ---- المراجعة الأخيرة ---- */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.gold, marginBottom: 8 }}>
            {t("closingReview")}</div>
          <FinRow l={t("sellPrice")} v={money(price, ccy, { exact: true, fixed: true })} />
          <FinRow l={t("totalCost")} v={money(final.totalCost, ccy, { exact: true, fixed: true })} col={C.gold} />
          <FinRow l={t("outstandingPayables")} v={money(final.dueExpenses, ccy, { exact: true, fixed: true })}
            col={final.dueExpenses > 0 ? C.red : C.ink3} />
          <FinRow strong l={t("realizedAcc")} v={signed(final.profit)}
            col={up ? C.green : C.red} />
          <FinRow l={t("roiShort")} v={pct(final.roi)} col={up ? C.green : C.red} />
          <FinRow l={t("margin")} v={pct(final.margin)} col={up ? C.green : C.red} />
          <FinRow l={t("depositReceived")} v={money(depReceived, ccy, { exact: true, fixed: true })}
            col={depReceived > 0 ? C.gold : C.ink3} />
          <FinRow l={t("receivedAtClosing")}
            v={money(num(f.receivedAtClosing), ccy, { exact: true, fixed: true })} />
          <FinRow strong l={t("totalCollected")} v={money(collected, ccy, { exact: true, fixed: true })}
            col={C.green} />
          <FinRow l={t("receivables")} v={money(receivable, ccy, { exact: true, fixed: true })}
            col={receivable > 0.0005 ? C.gold : C.ink3} />
          {keep > 0 && (
            <FinRow l={t("willReserve")} v={money(keep, ccy, { exact: true, fixed: true })} col={C.gold} />
          )}
          {depReceived > 0 && (
            <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 8, lineHeight: 1.75 }}>
              {t("depositNote")}</p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" disabled={price <= 0}
          style={{ opacity: price > 0 ? 1 : .4 }}
          onClick={() => {
            A.patchDeal(deal.dealId, {
              soldPrice: price, soldDate: f.soldDate,
              buyerName: f.buyerName, buyerPhone: f.buyerPhone,
              collectedAmount: collected, status: "sold",
              /* العرابين تُعلَّم محتسبة — لا تُحذف ولا تُحسب مرتين */
              deposits: (deal.deposits || []).map((x) =>
                (x.status === "held" ? { ...x, status: "applied" } : x)),
              closing: { at: nowISO(), method: f.method,
                receivedAtClosing: num(f.receivedAtClosing), depositApplied: depReceived },
              notes: [deal.notes, f.notes].filter(Boolean).join(" · "),
            });
            A.setStatus(deal.dealId, "sold");
            if (keep > 0) A.addReserve({ type: "deposit", amount: keep, dealId: deal.dealId,
              date: f.soldDate, note: `${model?.brand || ""} ${model?.model || ""}`.trim() });
            buzz(16); Sfx.money(); onClose(); flash(t("savedOk"));
          }}>{t("confirmSale")}</button>
      </div>
    </BottomSheet>
  );
}

/* ---- أين ذهبت مصاريف السيارة ---- */
function BreakdownCard({ deal, t, lang, ccy, k }) {
  const b = expenseBreakdown(deal, lang);
  if (!b.count) {
    return (
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, textAlign: "end", marginBottom: 8 }}>
          {t("breakdown")}</div>
        <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "8px 0" }}>
          {t("noBreakdown")}</p>
      </div>
    );
  }
  return (
    <div className="card" style={{ padding: 14, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
        marginBottom: 12 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800 }}>{t("breakdown")}</h3>
        <Ic n="bars" c={C.gold} s={17} />
      </div>

      {/* شريط مجمّع */}
      <div style={{ display: "flex", height: 10, borderRadius: 26, overflow: "hidden",
        background: C.hairline, marginBottom: 14 }}>
        {b.rows.map((r) => (
          <div key={r.key} className="grow" style={{ width: `${r.pct}%`, background: r.color }} />
        ))}
      </div>

      {b.rows.map((r) => (
        <div key={r.key} style={{ padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 26, background: r.color,
              flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
            <span className="num" style={{ fontSize: 12.5, fontWeight: 800 }}>
              {money(r.amount, ccy, { exact: true, fixed: true })}</span>
            <span className="num" style={{ fontSize: 11.5, fontWeight: 800, color: C.gold,
              width: 52, textAlign: "end" }}>{r.pct.toFixed(1)}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 26, marginTop: 6,
            background: C.hairline, overflow: "hidden" }}>
            <div className="grow" style={{ height: "100%", width: `${r.pct}%`,
              background: r.color, borderRadius: 26 }} />
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <div style={{ flex: 1, textAlign: "center", background: C.card2, borderRadius: RD.sm,
          padding: "10px 6px" }}>
          <div style={{ fontSize: 9.5, color: C.ink2 }}>{t("topCategory")}</div>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.gold, marginTop: 3 }}>
            {b.top.label}</div>
          <div className="num" style={{ fontSize: 10.5, color: C.ink3 }}>
            {b.top.pct.toFixed(1)}% {t("ofExpenses")}</div>
        </div>
        {(k.partsTotal > 0 || k.laborTotal > 0) && (
          <div style={{ flex: 1, textAlign: "center", background: C.card2, borderRadius: RD.sm,
            padding: "10px 6px" }}>
            <div style={{ fontSize: 9.5, color: C.ink2 }}>{t("partsVsLabor")}</div>
            <div className="num" style={{ fontSize: 12.5, fontWeight: 800, marginTop: 3 }}>
              {f0(k.partsTotal)} <span style={{ color: C.ink4 }}>/</span> {f0(k.laborTotal)}</div>
            <div style={{ fontSize: 10.5, color: C.ink3 }}>
              {t("partsCost")} / {t("laborCost")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================ COSTS ==================================== */
function CostsScreen({ deal, model, k, A, t, lang, ccy, go, setSheet, setConfirm }) {
  const U = CURRENCIES[ccy].ar;
  const img = resolveDealImage(deal, model);
  const catOf = (e) => EXPENSE_CATS[e.category] || EXPENSE_CATS.other;
  const label = (e) => e.description || (e.customCategory || catOf(e)[lang]);

  return (
    <div style={{ padding: 4 }}>
      <PageHeader title={t("costsTitle")} lang={lang} onBack={() => go("details")} />

      <MiniStats items={[
        [t("totalExp"), money(k.totalExpenses, ccy, { exact: true, fixed: true }), C.gold],
        [t("paidLabel"), money(k.paidExpenses, ccy, { exact: true, fixed: true }), C.green],
        [t("notPaidYet"), money(k.dueExpenses, ccy, { exact: true, fixed: true }),
          k.dueExpenses > 0 ? C.red : C.ink3],
      ]} />

      <div className="card" style={{ padding: 4, overflow: "hidden", marginBottom: 14,
        position: "relative", minHeight: 132 }}>
        <div style={{ position: "absolute", inset: 0 }}><CarImage src={img} h={132} /></div>
        <div style={{ position: "absolute", inset: 0,
          background: `linear-gradient(to right,${C.scrimSolid} 6%,${C.scrim} 42%,transparent 68%)` }} />
        <div style={{ position: "relative", padding: 12 }}>
          <div style={{ fontSize: 17, fontWeight: 800, direction: "ltr" }}>
            {model?.brand} {model?.model}</div>
          <div className="num" style={{ fontSize: 15, fontWeight: 800, color: C.red, marginBottom: 10 }}>
            {model?.year}</div>
          <div style={{ display: "flex", gap: 14 }}>
            {[[t("totalExp"), f0(k.totalExpenses)], [t("purchasePrice"), f0(k.purchasePrice)]]
              .map(([l, v], i) => (
              <div key={i} style={{ paddingInlineEnd: 14,
                borderInlineEnd: i === 0 ? `1px solid ${C.line}` : 0 }}>
                <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 3 }}>{l}</div>
                <div className="num liv" style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 9.5, color: C.ink3 }}>{U}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <span className="num" style={{ fontSize: 11.5, color: C.gold }}>
            {deal.expenses.length} {t("expCount")}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 13.5, fontWeight: 800 }}>{t("expList")}</span>
          <span style={{ marginInlineStart: 8 }}><Ic n="clipboard" c={C.gold} s={17} /></span>
        </div>

        <BreakdownCard deal={deal} t={t} lang={lang} ccy={ccy} k={k} />

        {k.plannedExpenses > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            background: C.goldFaint, border: `1px solid ${C.line}`,
            borderRadius: RD.sm, padding: "10px 12px" }}>
            <Ic n="info" c={C.gold} s={15} />
            <span style={{ fontSize: 11.5, color: C.ink2, flex: 1, lineHeight: 1.7 }}>
              {t("plannedTotal")}: <span className="num" style={{ color: C.gold,
                fontWeight: 800 }}>{f0(k.plannedExpenses)}</span> · {t("plannedNote")}</span>
          </div>
        )}

        {k.dueExpenses > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
            background: C.redFaint, border: `1px solid ${C.redEdge}`,
            borderRadius: RD.sm, padding: "10px 12px" }}>
            <Ic n="info" c={C.red} s={15} />
            <span style={{ fontSize: 11.5, color: C.redHi, lineHeight: 1.7, flex: 1 }}>
              {t("dueHint")}</span>
          </div>
        )}

        {!deal.expenses.length && (
          <EmptyState icon="clipboard" title={t("emptyExp")} action={`+ ${t("addExpense")}`}
            onAction={() => setSheet({ type: "expense", expense: null })} />
        )}

        {deal.expenses.map((e) => {
          const cat = catOf(e);
          return (
            <div key={e.expenseId} style={{ display: "flex", alignItems: "center", gap: 10,
              background: C.card2, border: `1px solid ${C.line}`, borderRadius: RD.sm,
              padding: "10px 12px", marginBottom: 8 }}>
              <button onClick={() => { buzz(); Sfx.toggle(e.paid === false);
                  A.patchDeal(deal.dealId, { expenses: deal.expenses.map((x) => {
                    if (x.expenseId !== e.expenseId) return x;
                    const nowPaid = x.paid === false;
                    /* تاريخ الدفع يحدد متى تخرج النقدية — يُسجَّل مرة واحدة */
                    return { ...x, paid: nowPaid, paidAt: nowPaid ? todayISO() : "" };
                  }) }); }}
                aria-label={e.paid === false ? t("markPaid") : t("markUnpaid")}
                style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, cursor: "pointer",
                  border: `1.6px solid ${e.paid === false ? C.red : C.green}`,
                  background: e.paid === false ? "transparent" : C.green,
                  color: C.onGreen, font: "900 14px 'Inter',sans-serif",
                  display: "grid", placeItems: "center", padding: 4 }}>
                {e.paid === false ? "" : "✓"}
              </button>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "grid",
                placeItems: "center", background: `${cat.cf}` }}>
                <Ic n={cat.icon} c={cat.c} s={15} /></span>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                <span style={{ display: "block", fontSize: 12.5, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                  color: e.paid === false ? C.ink3 : C.white }}>{label(e)}</span>
                {(e.paid === false || (e.status && e.status !== "completed")
                  || num(e.partsCost) > 0 || num(e.laborCost) > 0) && (
                  <span style={{ display: "block", fontSize: 9.5, marginTop: 2,
                    color: e.status === "planned" ? C.gold
                      : e.status === "cancelled" ? C.ink4
                      : e.paid === false ? C.red : C.ink3 }}>
                    {e.status === "planned" ? EXP_STATES.planned[lang]
                      : e.status === "cancelled" ? EXP_STATES.cancelled[lang]
                      : e.paid === false ? t("notPaidYet") : ""}
                    {(num(e.partsCost) > 0 || num(e.laborCost) > 0) && (
                      <span className="num">
                        {e.status !== "completed" || e.paid === false ? " · " : ""}
                        {f0(num(e.partsCost))}+{f0(num(e.laborCost))}</span>
                    )}
                  </span>
                )}
              </span>
              {e.receipt && <Ic n="clipboard" c={C.gold} s={13} />}
              <span className="num" style={{ fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                {money(expAmount(e), ccy, { exact: true, fixed: true })}
                <span style={{ fontSize: 9.5, color: C.ink3 }}> {U}</span></span>
              <span style={{ width: 1, height: 20, background: C.line, flexShrink: 0 }} />
              <button onClick={() => setSheet({ type: "expense", expense: e })} aria-label="edit"
                style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                <Ic n="edit" c={C.gold} s={17} /></button>
              <button aria-label="delete" style={{ background: "none", border: 0, cursor: "pointer",
                padding: 4 }} onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                  onYes: () => A.patchDeal(deal.dealId, {
                    expenses: deal.expenses.filter((x) => x.expenseId !== e.expenseId) }) })}>
                <Ic n="trash" c={C.red} s={17} /></button>
            </div>
          );
        })}

        <div className="card" style={{ display: "flex", padding: "12px 0", marginTop: 12 }}>
          {[[t("totalCost"), f0(k.totalCost)], [t("totalExp"), f0(k.totalExpenses)]].map(([l, v], i) => (
            <div key={i} style={{ flex: 1, textAlign: "center",
              borderInlineEnd: i === 0 ? `1px solid ${C.line}` : 0 }}>
              <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 5 }}>{l}</div>
              <div className="num liv" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
                {v} <span style={{ fontSize: 10.5, color: C.ink3 }}>{U}</span></div>
            </div>
          ))}
        </div>

        {k.dueExpenses > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10,
            fontSize: 11.5 }}>
            <span style={{ color: C.ink3 }}>{t("paidLabel")}{" "}
              <span className="num" style={{ color: C.green, fontWeight: 700 }}>
                {money(k.paidExpenses, ccy, { exact: true, fixed: true })}</span></span>
            <span style={{ color: C.ink3 }}>{t("dueLabel")}{" "}
              <span className="num" style={{ color: C.red, fontWeight: 700 }}>
                {money(k.dueExpenses, ccy, { exact: true, fixed: true })}</span></span>
          </div>
        )}
      </div>

      <button className="btnG" onClick={() => setSheet({ type: "expense", expense: null })}>
        + {t("addExpense")}</button>

      <button className="btnO" onClick={() => { buzz(); setSheet({ type: "paste" }); }}
        style={{ marginTop: 10 }}>
        {t("pasteExpenses")}</button>
    </div>
  );
}

/* =========================== EXPENSE SHEET ================================= */
function ExpenseSheet({ deal, A, t, lang, ccy, initial, onClose }) {
  const [f, setF] = useState(() => initial || mkExpense());
  const [errs, setErrs] = useState({});
  const [custom, setCustom] = useState(!!initial?.customCategory);
  const fileRef = useRef(null);

  const readReceipt = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    try { const src = await downscale(file, 900, 0.6); setF((s) => ({ ...s, receipt: src })); } catch {}
  };

  const save = () => {
    const er = validateExpense(f, t); setErrs(er);
    if (Object.keys(er).length) return;
    const row = { ...f, amount: num(f.amount), updatedAt: nowISO() };
    const exists = deal.expenses.some((x) => x.expenseId === row.expenseId);
    A.patchDeal(deal.dealId, { expenses: exists
      ? deal.expenses.map((x) => (x.expenseId === row.expenseId ? row : x))
      : [...deal.expenses, row] });
    buzz(12); Sfx.money(); onClose();
  };

  return (
    <BottomSheet title={initial ? t("edit") : t("addExpense")} onClose={onClose}>
      <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 8 }}>{t("category")}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {Object.entries(EXPENSE_CATS).map(([kk, cat]) => (
          <button key={kk} className="chip" data-on={!custom && f.category === kk ? "1" : "0"}
            onClick={() => { setCustom(false); setF((s) => ({ ...s, category: kk, customCategory: "" })); }}
            style={!custom && f.category === kk
              ? { borderColor: cat.c, color: cat.c, background: `${cat.cf}` } : {}}>
            {cat[lang]}</button>
        ))}
        <button className="chip" data-on={custom ? "1" : "0"} onClick={() => setCustom(true)}>
          + {t("customCat")}</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {custom && (
          <SheetField label={t("customCat")}>
            <input className="inp" value={f.customCategory}
              onChange={(e) => setF((s) => ({ ...s, customCategory: e.target.value, category: "other" }))}
              placeholder={lang === "ar" ? "مثال: تظليل" : "e.g. Window Tint"} />
          </SheetField>
        )}
        <SheetField label={t("desc")}>
          <input className="inp" value={f.description}
            onChange={(e) => setF((s) => ({ ...s, description: e.target.value }))} />
        </SheetField>
        {/* حالة العمل */}
        <SheetField label={t("expStatus")}
          hint={f.status === "planned" ? t("plannedNote") : ""}>
          <div style={{ display: "flex", gap: 4, background: C.card2, borderRadius: 12, padding: 4 }}>
            {Object.keys(EXP_STATES).map((kk) => (
              <button key={kk} onClick={() => { buzz(); setF((s) => ({ ...s, status: kk })); }}
                style={{ flex: 1, border: 0, borderRadius: 8, padding: "10px 4px", cursor: "pointer",
                  font: "700 12px inherit",
                  background: f.status === kk
                    ? (kk === "completed" ? C.green : kk === "planned" ? C.goldGrad : C.red)
                    : "transparent",
                  color: f.status === kk ? C.onGold : C.ink3 }}>
                {EXP_STATES[kk][lang]}</button>
            ))}
          </div>
        </SheetField>

        {/* القطعة والورشة */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("itemName")}>
            <input className="inp" value={f.item || ""}
              onChange={(e) => setF((s) => ({ ...s, item: e.target.value }))} /></SheetField>
          <SheetField label={t("workshop")}>
            <input className="inp" value={f.workshop || ""}
              onChange={(e) => setF((s) => ({ ...s, workshop: e.target.value }))} /></SheetField>
        </div>

        {/* قطع + أجرة يد */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={`${t("partsCost")} · ${CURRENCIES[ccy].ar}`}>
            <input className="inp ltr" type="number" inputMode="decimal" step="0.001"
              value={f.partsCost || ""}
              onChange={(e) => setF((s) => ({ ...s, partsCost: num(e.target.value) }))}
              placeholder="0" /></SheetField>
          <SheetField label={`${t("laborCost")} · ${CURRENCIES[ccy].ar}`}>
            <input className="inp ltr" type="number" inputMode="decimal" step="0.001"
              value={f.laborCost || ""}
              onChange={(e) => setF((s) => ({ ...s, laborCost: num(e.target.value) }))}
              placeholder="0" /></SheetField>
        </div>

        {/* الإجمالي: تلقائي إن أُدخل القطع أو الأجرة، وإلا يدوي */}
        {(num(f.partsCost) > 0 || num(f.laborCost) > 0) ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
            border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "12px 14px" }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 11.5, color: C.ink2 }}>{t("expTotal")}</span>
              <span style={{ display: "block", fontSize: 9.5, color: C.ink4, marginTop: 2 }}>
                {t("autoTotal")}</span>
            </span>
            <span className="num" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
              {f0(num(f.partsCost) + num(f.laborCost))}</span>
          </div>
        ) : (
          <SheetField label={`${t("expTotal")} · ${CURRENCIES[ccy].ar}`} error={errs.amount}>
            <input className="inp ltr" data-err={errs.amount ? "1" : "0"} type="number"
              inputMode="decimal" step="0.001" value={f.amount}
              onChange={(e) => setF((s) => ({ ...s, amount: e.target.value }))} placeholder="0" />
          </SheetField>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("date")}>
            <input className="inp ltr" type="date" value={f.date}
              onChange={(e) => setF((s) => ({ ...s, date: e.target.value }))} />
          </SheetField>
          <SheetField label={t("supplier")}>
            <input className="inp" value={f.supplier}
              onChange={(e) => setF((s) => ({ ...s, supplier: e.target.value }))} />
          </SheetField>
          <SheetField label={t("odoAt")}>
            <input className="inp ltr" inputMode="numeric" value={f.mileage || ""}
              onChange={(e) => setF((s) => ({ ...s, mileage: e.target.value }))} />
          </SheetField>
          <SheetField label={t("method")}>
            <div className="wrap-x">
              {[["cash", t("mCash")], ["bank", t("mBank")], ["cheque", t("mCheque")],
                ["transfer", t("mTransfer")]].map(([kk, lb]) => (
                <button key={kk} className="chip" data-on={f.method === kk ? "1" : "0"}
                  onClick={() => { buzz(); setF((s) => ({ ...s, method: kk })); }}>{lb}</button>
              ))}
            </div>
          </SheetField>
        </div>
        <SheetField label={t("notes")}>
          <input className="inp" value={f.notes}
            onChange={(e) => setF((s) => ({ ...s, notes: e.target.value }))} />
        </SheetField>

        <SheetField label={t("receipt")}>
          {f.receipt ? (
            <div style={{ position: "relative", borderRadius: RD.sm, overflow: "hidden" }}>
              <img src={f.receipt} alt="" style={{ width: "100%", maxHeight: 180,
                objectFit: "cover", display: "block" }} />
              <button onClick={() => setF((s) => ({ ...s, receipt: "" }))}
                style={{ position: "absolute", top: 8, insetInlineEnd: 8, width: 30, height: 30,
                  borderRadius: 26, background: C.scrim, border: `1px solid ${C.line}`,
                  cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Ic n="x" c={C.white} s={13} /></button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{ width: "100%",
              border: `2px dashed ${C.goldDim}`, borderRadius: RD.sm, background: "transparent",
              padding: "16px", cursor: "pointer", display: "grid", justifyItems: "center", gap: 6 }}>
              <Ic n="camera" c={C.gold} s={20} />
              <span style={{ fontSize: 11.5, color: C.gold, fontWeight: 700 }}>{t("receipt")}</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={readReceipt}
            style={{ display: "none" }} />
        </SheetField>

        <button onClick={() => setF((s) => ({ ...s, paid: !s.paid }))}
          style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
            border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "12px 12px",
            cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ width: 22, height: 22, borderRadius: 8, flexShrink: 0,
            border: `1.5px solid ${f.paid ? C.green : C.ink4}`,
            background: f.paid ? C.green : "transparent", color: C.onGreen,
            display: "grid", placeItems: "center", font: "900 12px 'Inter',sans-serif" }}>
            {f.paid ? "✓" : ""}</span>
          <span style={{ fontSize: 12.5, color: C.white }}>{t("paidLabel")}</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" onClick={save}>{t("save")}</button>
      </div>
    </BottomSheet>
  );
}

/* ================================ SELL ===================================== */
function SellScreen({ deal, model, k, A, t, lang, ccy, go, st, setSheet }) {
  const ph = priceStats(deal);
  const os = offerStats(deal);
  const U = CURRENCIES[ccy].ar;
  const up = k.profit >= 0;
  const img = resolveDealImage(deal, model);
  const lo = Math.round(Math.min(k.purchasePrice, k.totalCost * .76));
  const hi = Math.round(Math.max(k.targetSellingPrice * 1.09, k.totalCost * 1.25));
  const isSold = deal.status === "sold";
  const setPrice = (v) => A.patchDeal(deal.dealId, isSold ? { soldPrice: v } : { askingPrice: v });

  const opts = sellingStrategy(deal, st.settings).map((o) => ({
    ...o,
    label: { breakEven: t("breakEven"), quick: t("quickTag"),
      current: t("currentPrice"), target: t("targetTag") }[o.key],
    col: { breakEven: C.red, quick: C.gold, current: C.white, target: C.green }[o.key],
    bg: { breakEven: "rgba(226,58,46,.08)", quick: "rgba(227,180,87,.06)",
      current: "rgba(227,180,87,.1)", target: "rgba(39,196,106,.08)" }[o.key],
  }));

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <button onClick={() => go("home")} aria-label="back" style={{ background: "none", border: 0,
          cursor: "pointer", padding: 4, width: 34 }}>
          <Ic n={lang === "ar" ? "chevR" : "chev"} c={C.white} s={20} /></button>
        <span style={{ flex: 1 }} /><span style={{ width: 34 }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>{t("sellTitle")}</h2>
        <p style={{ fontSize: 12.5, color: C.ink2, marginTop: 6 }}>{t("sellSub")}</p>
      </div>

      <div className="card" style={{ padding: 4, overflow: "hidden", marginBottom: 12,
        position: "relative", minHeight: 140 }}>
        <div style={{ position: "absolute", inset: 0 }}><CarImage src={img} h={140} /></div>
        <div style={{ position: "absolute", inset: 0,
          background: `linear-gradient(to right,${C.scrimSolid} 4%,${C.scrim} 40%,transparent 66%)` }} />
        <div style={{ position: "relative", padding: 14, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, direction: "ltr" }}>
              {model?.brand} {model?.model}</div>
            <div className="num" style={{ fontSize: 17, fontWeight: 800, color: C.red }}>
              {model?.year}</div>
            <div style={{ marginTop: 9, display: "grid", gap: 6 }}>
              {model?.engineSize && <SpecRow i="engine" v={model.engineSize} />}
              {deal.mileage && <SpecRow i="fuelP"
                v={`${f0(num(deal.mileage))} ${lang === "ar" ? "كم" : "km"}`} />}
            </div>
          </div>
          <StatusBadge status={deal.status} lang={lang} big />
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 10.5, color: C.ink3, display: "flex", alignItems: "center", gap: 4 }}>
            <Ic n="info" c={C.ink3} s={13} />{t("suggestPrice")}</span>
          <span style={{ flex: 1 }} />
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("sellPrice")}</h3>
          <span style={{ marginInlineStart: 8 }}><Ic n="tag" c={C.gold} s={20} /></span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <MoneyInput ccy={ccy} big value={isSold ? deal.soldPrice : deal.askingPrice} onChange={setPrice} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setPrice(Math.max(0, k.sellingPrice - 25))} aria-label="minus"
            style={{ width: 40, height: 40, borderRadius: 26, flexShrink: 0, background: C.card3,
              border: `1px solid ${C.line}`, color: C.white, fontSize: 20, cursor: "pointer",
              lineHeight: 1 }}>−</button>
          <input className="rng" type="range" min={lo} max={hi} step={5}
            value={Math.min(Math.max(k.sellingPrice, lo), hi)}
            onChange={(e) => setPrice(+e.target.value)} />
          <button onClick={() => setPrice(k.sellingPrice + 25)} aria-label="plus"
            style={{ width: 40, height: 40, borderRadius: 26, flexShrink: 0, background: C.card3,
              border: `1px solid ${C.line}`, color: C.white, fontSize: 20, cursor: "pointer",
              lineHeight: 1 }}>+</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px" }}>
          <span className="num" style={{ fontSize: 11.5, color: C.ink3 }}>{f0(lo)}</span>
          <span className="num" style={{ fontSize: 11.5, color: C.ink3 }}>{f0(hi)}</span>
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, textAlign: "end", marginBottom: 14 }}>
          {t("recommendations")}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {opts.map((o, i) => (
            <button key={i} onClick={() => { buzz(); setPrice(o.price); }}
              style={{ position: "relative", background: o.bg, cursor: "pointer", fontFamily: "inherit",
                border: `1px solid ${o.isCurrent ? C.gold : `${o.col}`}`, borderRadius: RD.md,
                padding: "14px 4px 10px", display: "grid", justifyItems: "center", gap: 4 }}>
              {o.isCurrent && (
                <span style={{ position: "absolute", top: -9, insetInline: 0, margin: "0 auto",
                  width: "fit-content", background: C.goldGrad, color: C.onGold, borderRadius: 26,
                  padding: "0 10px", font: "800 9.5px inherit" }}>{t("currentTag")}</span>
              )}
              <span style={{ fontSize: 9.5, color: o.col === C.white ? C.ink2 : o.col,
                textAlign: "center", lineHeight: 1.3, minHeight: 24 }}>{o.label}</span>
              <span className="num liv" style={{ fontSize: 17, fontWeight: 800,
                color: o.col === C.white ? C.white : o.col }}>{f0(o.price)}</span>
              <span style={{ fontSize: 9.5, color: C.ink3 }}>{U}</span>
              <span style={{ height: 1, background: C.line, alignSelf: "stretch", margin: "5px 6px" }} />
              <span style={{ fontSize: 9.5, color: C.ink3 }}>{t("netProfit")}</span>
              <span className="num liv" style={{ fontSize: 12.5, fontWeight: 800,
                color: o.profit > 0 ? C.green : o.profit < 0 ? C.red : C.ink2 }}>
                {o.profit === 0 ? "0" : signed(o.profit)}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", background: C.card2, border: `1px solid ${C.line}`,
          borderRadius: RD.md, marginTop: 12, padding: "12px 0" }}>
          {[[t("netProfit"), signed(k.profit), up ? C.green : C.red, U],
            [`${t("roi")} (ROI)`, pct(k.roi), up ? C.green : C.red, ""],
            [t("diffTarget"), k.targetDiff > 0 ? f0(k.targetDiff) : `+${f0(-k.targetDiff)}`, C.gold, U],
          ].map(([l, v, col, u], i, a) => (
            <div key={i} style={{ flex: 1, textAlign: "center",
              borderInlineEnd: i < a.length - 1 ? `1px solid ${C.line}` : 0 }}>
              <div style={{ fontSize: 9.5, color: C.ink2, marginBottom: 5, padding: "0 4px" }}>{l}</div>
              <div className="num liv" style={{ fontSize: 17, fontWeight: 800, color: col }}>
                {v} {u && <span style={{ fontSize: 9.5, color: C.ink3 }}>{u}</span>}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, textAlign: "end", marginBottom: 12 }}>
          {t("profitAnalysis")}</h3>
        <ProfitChart k={k} t={t} U={U} lo={lo} hi={hi} />
      </div>

      {/* أقل سعر مقبول — داخلي */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <SheetField label={`${t("minAcceptable")} · ${U}`} hint={t("minAcceptableNote")}>
          <input className="inp ltr" type="number" inputMode="decimal"
            value={deal.minAcceptable || ""}
            onChange={(e) => A.patchDeal(deal.dealId, { minAcceptable: num(e.target.value) })} />
        </SheetField>
        {num(deal.minAcceptable) > 0 && (
          <div style={{ marginTop: 12 }}>
            <FinRow l={t("ifSoldAt")} v={money(num(deal.minAcceptable), ccy, { exact: true, fixed: true })} />
            <FinRow l={t("netProfit")}
              v={signed(num(deal.minAcceptable) - k.totalCost)}
              col={num(deal.minAcceptable) >= k.totalCost ? C.green : C.red} />
            <FinRow l={t("roiShort")}
              v={pct(k.totalCost > 0
                ? ((num(deal.minAcceptable) - k.totalCost) / k.totalCost) * 100 : 0)}
              col={num(deal.minAcceptable) >= k.totalCost ? C.green : C.red} />
          </div>
        )}
      </div>

      {/* سجل الأسعار */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("priceHistory")}</h3>
          <Ic n="history" c={C.gold} s={17} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))",
          gap: 8, marginBottom: 12 }}>
          {[[t("originalAsking"), ph.original, C.ink2], [t("currentAsking"), ph.current, C.gold],
            [t("lowestAsking"), ph.lowest, C.red], [t("priceChanges"), ph.count, C.white]]
            .map(([l, v, col], i) => (
            <div key={i} style={{ background: C.card2, border: `1px solid ${C.line}`,
              borderRadius: RD.sm, padding: "8px 4px", textAlign: "center" }}>
              <div className="num" style={{ fontSize: 15, fontWeight: 800, color: col }}>
                {i === 3 ? v : f0(v)}</div>
              <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        {!ph.rows.length ? (
          <p style={{ fontSize: 11.5, color: C.ink3, textAlign: "center", padding: "6px 0" }}>
            {t("noPriceChanges")}</p>
        ) : [...ph.rows].reverse().map((h) => (
          <PriceRow key={h.id} h={h} lang={lang} ccy={ccy} t={t} />
        ))}
        <div style={{ marginTop: 10, fontSize: 10.5, color: C.ink3, textAlign: "center" }}>
          {t("heldFor")} <span className="num" style={{ color: C.white, fontWeight: 700 }}>
            {ph.sinceLast}</span> {t("dayUnit")}
        </div>
      </div>

      {/* العروض والعرابين */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <button className="card" onClick={() => { buzz(); setSheet({ type: "leads" }); }}
          style={{ padding: 14, cursor: "pointer", display: "grid", justifyItems: "center",
            gap: 6, color: "inherit", fontFamily: "inherit" }}>
          <Ic n="person" c={C.gold} s={20} />
          <span style={{ fontSize: 11.5, fontWeight: 700 }}>{t("offers")}</span>
          <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
            {os.highest ? f0(os.highest) : os.total}</span>
        </button>
        <button className="card" onClick={() => { buzz(); setSheet({ type: "deposits" }); }}
          style={{ padding: 14, cursor: "pointer", display: "grid", justifyItems: "center",
            gap: 6, color: "inherit", fontFamily: "inherit" }}>
          <Ic n="coins" c={C.gold} s={20} />
          <span style={{ fontSize: 11.5, fontWeight: 700 }}>{t("deposits")}</span>
          <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
            {f0(heldDeposits(deal).reduce((a, x) => a + num(x.amount), 0))}</span>
        </button>
      </div>

      {deal.status !== "sold" && (
        <button className="btnG" onClick={() => { buzz(); setSheet({ type: "sold" }); }}>
          {t("closeSale")}</button>
      )}
    </>
  );
}

function SpecRow({ i, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Ic n={i} c={C.ink2} s={13} /><span style={{ fontSize: 10.5, color: C.ink2 }}>{v}</span>
    </div>
  );
}

function ProfitChart({ k, t, U, lo, hi }) {
  const W = 320, H = 190, L = 34, R = 10, TOP = 14, B = 44;
  const be = k.breakEven, cur = k.sellingPrice, tgt = k.targetSellingPrice;
  const yMin = lo - be, yMax = hi - be;
  const px = (v) => L + ((v - lo) / (hi - lo || 1)) * (W - L - R);
  const py = (v) => TOP + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - TOP - B);
  const y0 = py(0);
  const ticks = [lo, Math.round(lo + (hi - lo) * .27), Math.round(be), Math.round(cur), hi];
  const yTicks = [yMax, yMax / 2, 0, yMin / 2, yMin].map((v) => Math.round(v / 50) * 50);
  const clamp = (v) => Math.min(Math.max(v, lo), hi);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="lossG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.red} stopOpacity=".05" />
          <stop offset="100%" stopColor={C.red} stopOpacity=".3" />
        </linearGradient>
        <linearGradient id="profG" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={C.green} stopOpacity=".05" />
          <stop offset="100%" stopColor={C.green} stopOpacity=".34" />
        </linearGradient>
      </defs>
      {yTicks.map((v, i) => (
        <g key={i}>
          <line x1={L} y1={py(v)} x2={W - R} y2={py(v)} stroke={C.line} strokeWidth="1" />
          <text x={L - 6} y={py(v) + 3.5} fill={C.ink3} fontSize="8.5" textAnchor="end"
            fontFamily="Inter">{v > 0 ? `+${v}` : v}</text>
        </g>
      ))}
      <path d={`M${px(lo)},${y0} L${px(be)},${y0} L${px(lo)},${py(lo - be)} Z`} fill="url(#lossG)" />
      <path d={`M${px(be)},${y0} L${px(hi)},${y0} L${px(hi)},${py(hi - be)} Z`} fill="url(#profG)" />
      <line x1={px(lo)} y1={py(lo - be)} x2={px(be)} y2={y0} stroke={C.red} strokeWidth="2" />
      <line x1={px(be)} y1={y0} x2={px(hi)} y2={py(hi - be)} stroke={C.green} strokeWidth="2" />
      <line x1={px(be)} y1={TOP} x2={px(be)} y2={H - B} stroke={C.white} strokeWidth="1"
        strokeDasharray="3 3" opacity=".55" />
      <line x1={px(clamp(cur))} y1={TOP} x2={px(clamp(cur))} y2={H - B} stroke={C.gold}
        strokeWidth="1" strokeDasharray="3 3" opacity=".65" />
      {[{ v: lo + (be - lo) * .45, c: C.red }, { v: be, c: C.white },
        { v: clamp(cur), c: C.gold }, { v: clamp(tgt), c: C.green }].map((p, i) => (
        <circle key={i} cx={px(p.v)} cy={py(p.v - be)} r="5.5" fill={p.c}
          stroke={C.bg} strokeWidth="2.4" />
      ))}
      <text x={px(lo + (be - lo) * .4)} y={H - B + 15} fill={C.red} fontSize="8.5"
        textAnchor="middle" fontFamily="inherit">{t("lossZone")}</text>
      <text x={px(be)} y={H - B + 15} fill={C.white} fontSize="8.5" textAnchor="middle"
        fontFamily="inherit">{t("breakEven")}</text>
      <text x={px(hi - (hi - tgt) * .3)} y={H - B + 15} fill={C.green} fontSize="8.5"
        textAnchor="middle" fontFamily="inherit">{t("profitZone")}</text>
      {ticks.map((v, i) => (
        <text key={i} x={px(clamp(v))} y={H - B + 30} fontSize="8.5" textAnchor="middle"
          fontFamily="Inter" fill={v === Math.round(be) || v === Math.round(cur) ? C.gold : C.ink3}
          fontWeight={v === Math.round(be) || v === Math.round(cur) ? 700 : 400}>{f0(v)}</text>
      ))}
      <text x={W / 2} y={H - 4} fill={C.ink3} fontSize="8.5" textAnchor="middle"
        fontFamily="inherit">{t("sellPrice")} ({U})</text>
    </svg>
  );
}

/* ============================== ANALYTICS ================================== */
function AnalyticsScreen({ st, t, lang, ccy, liveDeals, go }) {
  const [period, setPeriod] = useState("all");
  const U = CURRENCIES[ccy].ar;
  const a = useMemo(() => analytics(st.deals, st.models, st.settings, period),
    [st.deals, st.models, st.settings, period]);

  const MONTHS = lang === "ar"
    ? ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const KPI = [
    { i: "car", l: t("carsBought"), v: a.totalDeals, u: t("totalWord"), c: C.gold, br: C.goldDim },
    { i: "car", l: t("activeCars"), v: a.open.length, u: t("nowWord"), c: C.white, br: C.line },
    { i: "tag", l: t("soldCars"), v: a.sold.length, u: t("totalWord"), c: C.red, br: C.redEdge },
    { i: "coins", l: t("totalInvest"), v: f0(a.totalInvestment), u: U, c: C.gold, br: C.line },
    { i: "chartUp", l: t("totalSales"), v: f0(a.totalSales), u: U, c: C.white, br: C.line },
    { i: "bars", l: t("realizedProfit"), v: f0(a.realizedProfit), u: U,
      c: a.realizedProfit >= 0 ? C.green : C.red, br: C.greenEdge },
    { i: "target", l: t("expectedProfit"), v: f0(a.expectedProfit), u: U,
      c: a.expectedProfit >= 0 ? C.gold : C.red, br: C.goldDim },
    { i: "clipboard", l: t("totalExp"), v: f0(a.totalExpenses), u: U, c: C.white, br: C.line },
    { i: "refresh", l: t("avgRoi"), v: `${a.avgRoi.toFixed(2)}%`, u: t("avgWord"),
      c: a.avgRoi >= 0 ? C.green : C.red, br: C.line },
    { i: "chartUp", l: t("avgProfit"), v: f0(a.avgProfit), u: U,
      c: a.avgProfit >= 0 ? C.green : C.red, br: C.line },
    { i: "clock", l: t("avgDays"), v: Math.round(a.avgDays), u: t("dayUnit"), c: C.white, br: C.line },
    { i: "crown", l: t("topBrand"), v: a.topBrand?.[0] || "—", u: a.topBrand ? f0(a.topBrand[1]) : "",
      c: C.gold, br: C.line },
  ];

  const distr = [
    { l: t("activeCars"), v: a.open.length, c: C.gold },
    { l: t("soldCars"), v: a.sold.length, c: C.red },
    { l: t("cancelledLbl"), v: a.cancelled.length, c: C.green },
  ];

  if (!liveDeals.length) return <EmptyState icon="bars" title={t("emptyCars")} />;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, flex: 1 }}>{t("analytics")}</h2>
        <span style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.line}`,
          borderRadius: RD.sm, padding: "8px 12px", color: C.gold, fontSize: 11.5, fontWeight: 700 }}>
          <Ic n="cal" c={C.gold} s={15} />{t("period")}</span>
      </div>

      <div className="scroll-x" style={{ marginBottom: 14 }}>
        {Object.entries(PERIODS).map(([kk, p]) => (
          <button key={kk} className="chip" data-on={period === kk ? "1" : "0"}
            onClick={() => { buzz(); setPeriod(kk); }}>{p[lang]}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
        {KPI.map((x, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${x.br}`, borderRadius: RD.md,
            padding: "12px 4px" }}>
            <MetricCard label={x.l} value={x.v} unit={x.u} icon={x.i} size={15}
              color={x.c === C.white ? undefined : x.c} />
          </div>
        ))}
      </div>

      {(a.best || a.worst) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[[t("bestDeal"), a.best, C.green], [t("worstDeal"), a.worst, C.red]].map(([l, r, col], i) =>
            r ? (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 5 }}>{l}</div>
                <div style={{ fontSize: 12.5, fontWeight: 800, direction: "ltr", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {st.models.find((m) => m.vehicleModelId === r.d.vehicleModelId)?.model || "—"}</div>
                <div className="num" style={{ fontSize: 15, fontWeight: 800, color: col, marginTop: 3 }}>
                  {signed(r.k.profit)}</div>
              </div>
            ) : <div key={i} />)}
        </div>
      )}

      {a.sold.length === 0 ? (
        <div style={{ marginBottom: 14 }}>
          <EmptyState icon="bars" title={t("emptyAnalytics")} sub={t("emptySold")} />
        </div>
      ) : (
        <>
          <PortfolioCard st={st} t={t} lang={lang} ccy={ccy} go={go} />

      <button onClick={() => go("reserve")} className="cardG"
        style={{ width: "100%", padding: 16, marginBottom: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12, color: "inherit",
          fontFamily: "inherit", textAlign: "start" }}>
        <Ic n="coins" c={C.gold} s={24} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 11.5, color: C.ink2 }}>{t("reserveBalance")}</span>
          <span className="num" style={{ display: "block", fontSize: 20, fontWeight: 800,
            color: C.gold }}>{f0(reserveSummary(st).balance)}
            <span style={{ fontSize: 10.5, color: C.ink3, fontWeight: 600 }}> {U}</span></span>
          <span className="num" style={{ display: "block", fontSize: 10.5, color: C.ink3 }}>
            {t("reserveLeft")} {f0(reserveSummary(st).left)}</span>
        </span>
        <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.ink4} s={17} />
      </button>

      <ChartCard title={t("monthlyProfit")} icon="bars" unit={U}>
            <BarChart data={a.monthlyProfit} labels={MONTHS} />
          </ChartCard>
          <ChartCard title={t("roiTrend")} icon="chartUp" unit="%">
            <LineChart data={a.roiTrend} labels={MONTHS} />
          </ChartCard>
        </>
      )}

      <div className="card" style={{ padding: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, textAlign: "end", marginBottom: 14 }}>
          {t("dealDist")}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <DonutChart slices={distr} total={a.totalDeals} label={t("dealUnit")} lang={lang} />
          <div style={{ flex: 1, minWidth: 150 }}>
            {distr.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
                borderBottom: i < distr.length - 1 ? `1px solid ${C.line}` : 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: 26, background: s.c, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12.5, color: C.ink2 }}>{s.l}</span>
                <span className="num" style={{ fontSize: 13.5, fontWeight: 800 }}>{s.v}</span>
                <span className="num" style={{ fontSize: 10.5, color: C.ink3, width: 48, textAlign: "end" }}>
                  ({((s.v / (a.totalDeals || 1)) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ChartCard({ title, icon, unit, children }) {
  return (
    <div className="card" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 9.5, color: C.ink3 }}>{unit}</span>
        <span style={{ flex: 1 }} />
        <h3 style={{ fontSize: 13.5, fontWeight: 800 }}>{title}</h3>
        <span style={{ marginInlineStart: 8 }}><Ic n={icon} c={C.gold} s={17} /></span>
      </div>
      {children}
    </div>
  );
}

function BarChart({ data, labels }) {
  const W = 320, H = 168, L = 30, R = 6, TOP = 10, B = 30;
  const mx = Math.max(...data.map(Math.abs), 1);
  const bw = (W - L - R) / data.length;
  const py = (v) => TOP + (1 - v / mx) * (H - TOP - B);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      {[mx, mx * .75, mx * .5, mx * .25, 0].map((v, i) => (
        <g key={i}>
          <line x1={L} y1={py(v)} x2={W - R} y2={py(v)} stroke={C.line} strokeWidth="1" />
          <text x={L - 5} y={py(v) + 3} fill={C.ink3} fontSize="7.5" textAnchor="end"
            fontFamily="Inter">{v >= 1000 ? `${Math.round(v / 1000)}K` : Math.round(v)}</text>
        </g>
      ))}
      {data.map((v, i) => (
        <rect key={i} x={L + i * bw + bw * .22} y={py(Math.abs(v))} width={bw * .56}
          height={Math.max(0, py(0) - py(Math.abs(v)))} rx="2"
          fill={v >= 0 ? C.red : C.red} opacity={v === 0 ? .16 : 1} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={L + i * bw + bw / 2} y={H - 12} fill={C.ink3} fontSize="7"
          textAnchor="middle" fontFamily="inherit"
          transform={`rotate(-38 ${L + i * bw + bw / 2} ${H - 12})`}>{l}</text>
      ))}
    </svg>
  );
}

function LineChart({ data, labels }) {
  const W = 320, H = 168, L = 30, R = 6, TOP = 10, B = 30;
  const mx = Math.max(...data, 20) * 1.15;
  const step = (W - L - R) / (data.length - 1);
  const px = (i) => L + i * step;
  const py = (v) => TOP + (1 - v / mx) * (H - TOP - B);
  const path = data.map((v, i) => `${i ? "L" : "M"}${px(i)},${py(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="roiG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.gold} stopOpacity=".28" />
          <stop offset="100%" stopColor={C.gold} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[mx, mx * .75, mx * .5, mx * .25, 0].map((v, i) => (
        <g key={i}>
          <line x1={L} y1={py(v)} x2={W - R} y2={py(v)} stroke={C.line} strokeWidth="1" />
          <text x={L - 5} y={py(v) + 3} fill={C.ink3} fontSize="7.5" textAnchor="end"
            fontFamily="Inter">{Math.round(v)}%</text>
        </g>
      ))}
      <path d={`${path} L${px(data.length - 1)},${py(0)} L${px(0)},${py(0)} Z`} fill="url(#roiG)" />
      <path d={path} fill="none" stroke={C.gold} strokeWidth="2" strokeLinejoin="round" />
      {data.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r="3.2" fill={C.gold}
        stroke={C.bg} strokeWidth="1.6" />)}
      {labels.map((l, i) => (
        <text key={i} x={px(i)} y={H - 12} fill={C.ink3} fontSize="7" textAnchor="middle"
          fontFamily="inherit" transform={`rotate(-38 ${px(i)} ${H - 12})`}>{l}</text>
      ))}
    </svg>
  );
}

function DonutChart({ slices, total, label, lang }) {
  const RAD = 52, SW = 26, C0 = 2 * Math.PI * RAD;
  const sum = slices.reduce((s, x) => s + x.v, 0) || 1;
  let off = 0;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140, flexShrink: 0 }}>
      <g transform="translate(70,70) rotate(-90)">
        <circle r={RAD} fill="none" stroke={C.hairline} strokeWidth={SW} />
        {slices.map((s, i) => {
          const len = (s.v / sum) * C0;
          const el = <circle key={i} r={RAD} fill="none" stroke={s.c} strokeWidth={SW}
            strokeDasharray={`${len} ${C0 - len}`} strokeDashoffset={-off} />;
          off += len; return el;
        })}
      </g>
      <text x="70" y="64" textAnchor="middle" fill={C.ink2} fontSize="9" fontFamily="inherit">
        {lang === "ar" ? "إجمالي" : "Total"}</text>
      <text x="70" y="82" textAnchor="middle" fill={C.white} fontSize="21" fontWeight="800"
        fontFamily="Inter">{total}</text>
      <text x="70" y="95" textAnchor="middle" fill={C.ink3} fontSize="8" fontFamily="inherit">{label}</text>
    </svg>
  );
}

/* =========================== CAR IMAGE LIBRARY ============================= */
function ImageLibraryScreen({ st, A, t, lang, go, flash }) {
  const [busy, setBusy] = useState(null);
  const [bulk, setBulk] = useState(null);
  const [q, setQ] = useState("");
  const refs = useRef({});
  const bulkRef = useRef(null);

  /* رفع دفعة: يطابق كل ملف بموديل من الكتالوج حسب اسمه */
  const bulkAdd = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setBulk("busy");
    let ok = 0, miss = 0;
    for (const f of list) {
      const hit = matchModelByFile(f.name);
      if (!hit) { miss++; continue; }
      try {
        const src = await downscale(f, 900, 0.68);
        const m = materializeModel(hit.row, hit.year, "", st.models);
        A.upsertModel(m);
        A.addLibraryImage({
          imageId: `img_${slugPart(hit.row.brand)}_${slugPart(hit.row.model)}_${hit.year}`,
          brand: hit.row.brand, model: hit.row.model, year: hit.year, trim: "",
          view: "front_3_4",
          file: `car_images/${slugPart(hit.row.brand)}/${slugPart(hit.row.model)}/${hit.year}/front_3_4.webp`,
          src,
        });
        ok++;
      } catch { miss++; }
    }
    setBulk({ ok, miss });
    buzz(14); Sfx.success();
    flash(`${t("bulkDone")} · ${ok}`);
  };

  const rows = useMemo(() => searchModels(st.models, q), [st.models, q]);
  const withImg = st.models.filter((m) => resolveModelImage(m)).length;

  const upload = async (m, file) => {
    if (!file) return;
    setBusy(m.vehicleModelId);
    try {
      const src = await downscale(file, 760, 0.55);
      A.addLibraryImage({
        imageId: `img_${m.vehicleModelId}`,
        brand: m.brand, model: m.model, year: m.year, trim: m.trim,
        view: "front_3_4",
        file: `car_images/${norm(m.brand).replace(/ /g, "_")}/${norm(m.model).replace(/ /g, "_")}/${m.year}/front_3_4.webp`,
        src,
      });
      flash(t("uploadImg"));
    } catch { flash(t("errSave")); }
    setBusy(null);
  };

  return (
    <>
      <PageHeader title={t("imgLib")} lang={lang} onBack={() => go("settings")} />

      <div className="card" style={{ display: "flex", padding: "12px 0", marginBottom: 12 }}>
        <div style={{ flex: 1, textAlign: "center", borderInlineEnd: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 4 }}>{t("imgHave")}</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{withImg}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 4 }}>{t("imgMissing")}</div>
          <div className="num" style={{ fontSize: 20, fontWeight: 800, color: C.red }}>
            {st.models.length - withImg}</div>
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.8, marginBottom: 10 }}>{t("imgNote")}</p>

      <button className="btnG" style={{ marginBottom: 8, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8 }} disabled={bulk === "busy"}
        onClick={() => bulkRef.current?.click()}>
        <Ic n="upload" c={C.onGold} s={20} />
        {bulk === "busy" ? t("running") : t("bulkUpload")}
      </button>
      <input ref={bulkRef} type="file" accept="image/*,image/heic,image/heif" multiple style={{ display: "none" }}
        onChange={(e) => { bulkAdd(e.target.files); e.target.value = ""; }} />
      <p style={{ fontSize: 10.5, color: C.ink4, lineHeight: 1.8, marginBottom: 12,
        direction: "ltr", fontFamily: "Inter,sans-serif" }}>{t("bulkCarsHint")}</p>
      {bulk && bulk !== "busy" && (
        <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex",
          justifyContent: "space-around", fontSize: 12.5 }}>
          <span style={{ color: C.green }}>{t("matched")}{" "}
            <span className="num" style={{ fontWeight: 800 }}>{bulk.ok}</span></span>
          <span style={{ color: bulk.miss ? C.red : C.ink3 }}>{t("unmatched")}{" "}
            <span className="num" style={{ fontWeight: 800 }}>{bulk.miss}</span></span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card2,
        border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "10px 12px", marginBottom: 12 }}>
        <Ic n="search" c={C.ink3} s={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
          style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: C.white,
            font: "600 16px inherit" }} />
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((m) => {
          const src = resolveModelImage(m);
          const own = st.imageLibrary.find((x) => x.imageId === `img_${m.vehicleModelId}`);
          return (
            <div key={m.vehicleModelId} className="card" style={{ padding: 10, display: "flex",
              gap: 10, alignItems: "center" }}>
              <div style={{ width: 100, height: 64, flexShrink: 0, borderRadius: RD.sm,
                overflow: "hidden", background: C.black }}>
                <CarImage src={src} h={64} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, direction: "ltr", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.brand} {m.model}</div>
                <div className="num" style={{ fontSize: 11.5, color: C.red, fontWeight: 700 }}>
                  {m.year}{m.trim ? ` · ${m.trim}` : ""}</div>
                <div style={{ fontSize: 9.5, color: src ? C.green : C.ink4, marginTop: 3,
                  direction: "ltr", fontFamily: "Inter,sans-serif", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {src ? (own?.file || `car_images/${norm(m.brand)}/${norm(m.model)}/…`) : t("imgMissing")}
                </div>
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <button onClick={() => refs.current[m.vehicleModelId]?.click()}
                  disabled={busy === m.vehicleModelId}
                  style={{ border: `1px solid ${C.line}`, background: C.goldFaint,
                    color: C.gold, borderRadius: RD.sm, padding: "8px 10px", cursor: "pointer",
                    font: "700 11px inherit", whiteSpace: "nowrap" }}>
                  {busy === m.vehicleModelId ? "…" : src ? t("replaceImg") : t("uploadImg")}
                </button>
                {own && (
                  <button onClick={() => A.removeLibraryImage(own.imageId)}
                    style={{ border: `1px solid ${C.redEdge}`, background: "transparent",
                      color: C.red, borderRadius: RD.sm, padding: "6px 10px", cursor: "pointer",
                      font: "700 11px inherit" }}>{t("removeImg")}</button>
                )}
              </div>
              <input ref={(el) => { refs.current[m.vehicleModelId] = el; }} type="file"
                accept="image/*" style={{ display: "none" }}
                onChange={(e) => { upload(m, e.target.files?.[0]); e.target.value = ""; }} />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============================ PHOTO MANAGER ================================
   البند 6: تصوير، اختيار من الاستديو، تعيين رئيسية، ترتيب، حذف، عرض كامل.
   ========================================================================== */
function PhotoManager({ deal, model, A, t, lang, onClose, flash }) {
  const [busy, setBusy] = useState(false);
  const [full, setFull] = useState(null);
  const camRef = useRef(null);
  const galRef = useRef(null);
  const photos = deal.photos || [];
  const main = Math.min(deal.mainPhoto || 0, Math.max(0, photos.length - 1));

  const add = async (files) => {
    const list = Array.from(files || []).slice(0, 10 - photos.length);
    if (!list.length) return;
    setBusy(true);
    const out = []; let failed = 0;
    for (const f of list) {
      try { out.push(await downscale(f, 820, 0.55)); } catch { failed++; }
    }
    if (out.length) { A.patchDeal(deal.dealId, { photos: [...photos, ...out] }); buzz(12); }
    if (failed) flash(t("errPhotoRead"));
    setBusy(false);
  };

  const setMain = (i) => { buzz(); A.patchDeal(deal.dealId, { mainPhoto: i }); };
  const remove = (i) => {
    const next = photos.filter((_, j) => j !== i);
    A.patchDeal(deal.dealId, { photos: next, mainPhoto: Math.min(main, Math.max(0, next.length - 1)) });
    buzz();
  };
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    let nm = main;
    if (main === i) nm = j; else if (main === j) nm = i;
    A.patchDeal(deal.dealId, { photos: next, mainPhoto: nm });
    buzz();
  };

  /* يحفظ الصورة الرئيسية كصورة افتراضية لكل سيارات هذا الموديل */
  const useForModel = () => {
    if (!photos.length || !model) return;
    A.addLibraryImage({
      imageId: `img_${model.vehicleModelId}`,
      brand: model.brand, model: model.model, year: model.year, trim: model.trim,
      view: "front_3_4",
      file: `car_images/${slugPart(model.brand)}/${slugPart(model.model)}/${model.year}/front_3_4.webp`,
      src: photos[main],
    });
    flash(t("useForModel"));
  };

  return (
    <BottomSheet title={t("photosTitle")} onClose={onClose}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button className="btnG" disabled={busy || photos.length >= 10}
          onClick={() => camRef.current?.click()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Ic n="camera" c={C.onGold} s={20} />{t("takePhoto")}
        </button>
        <button className="btnO" disabled={busy || photos.length >= 10}
          onClick={() => galRef.current?.click()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Ic n="upload" c={C.gold} s={20} />{t("fromGallery")}
        </button>
      </div>
      <input ref={camRef} type="file" accept="image/*,image/heic,image/heif" capture="environment"
        style={{ display: "none" }}
        onChange={(e) => { add(e.target.files); e.target.value = ""; }} />
      <input ref={galRef} type="file" accept="image/*,image/heic,image/heif" multiple style={{ display: "none" }}
        onChange={(e) => { add(e.target.files); e.target.value = ""; }} />

      {busy && (
        <p style={{ fontSize: 12.5, color: C.gold, textAlign: "center", marginBottom: 12 }}>…</p>
      )}

      {!photos.length ? (
        <EmptyState icon="camera" title={t("noPhotos")} sub={t("addPhotosSub")} />
      ) : (
        <>
          <div style={{ fontSize: 11.5, color: C.ink3, marginBottom: 10, textAlign: "center" }}>
            <span className="num">{photos.length}</span>/10 {t("photoCount")}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {photos.map((p, i) => (
              <div key={i} className="card" style={{ padding: 8, display: "flex", gap: 10,
                alignItems: "center", borderColor: i === main ? C.gold : C.line }}>
                <button onClick={() => setFull(p)} style={{ width: 96, height: 66, flexShrink: 0,
                  padding: 4, border: 0, borderRadius: RD.sm, overflow: "hidden", cursor: "pointer",
                  background: C.black }}>
                  <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {i === main ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 11.5, fontWeight: 800, color: C.gold }}>
                      <Ic n="star" c={C.gold} s={13} />{t("mainPhoto")}</span>
                  ) : (
                    <button onClick={() => setMain(i)} style={{ background: "none", border: 0,
                      cursor: "pointer", color: C.ink2, font: "600 11.5px inherit", padding: 4 }}>
                      {t("setMain")}</button>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="up"
                      style={{ width: 32, height: 30, borderRadius: 8, background: C.card2,
                        border: `1px solid ${C.line}`, cursor: "pointer", opacity: i === 0 ? .35 : 1,
                        display: "grid", placeItems: "center" }}>
                      <Ic n={lang === "ar" ? "chevR" : "chev"} c={C.ink2} s={13} /></button>
                    <button onClick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="down"
                      style={{ width: 32, height: 30, borderRadius: 8, background: C.card2,
                        border: `1px solid ${C.line}`, cursor: "pointer",
                        opacity: i === photos.length - 1 ? .35 : 1,
                        display: "grid", placeItems: "center" }}>
                      <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.ink2} s={13} /></button>
                  </div>
                </div>
                <button onClick={() => remove(i)} aria-label="delete"
                  style={{ width: 38, height: 38, borderRadius: 8, background: "transparent",
                    border: `1px solid ${C.redEdge}`, cursor: "pointer",
                    display: "grid", placeItems: "center" }}>
                  <Ic n="trash" c={C.red} s={15} /></button>
              </div>
            ))}
          </div>

          {model && (
            <button className="btnO" style={{ marginTop: 14 }} onClick={useForModel}>
              {t("useForModel")}</button>
          )}
        </>
      )}

      {full && (
        <div onClick={() => setFull(null)} style={{ position: "fixed", inset: 0, zIndex: 99,
          background: `${C.scrimSolid}`, display: "grid", placeItems: "center", padding: 14 }}>
          <img src={full} alt="" style={{ maxWidth: "100%", maxHeight: "88vh",
            borderRadius: RD.md, display: "block" }} />
        </div>
      )}
    </BottomSheet>
  );
}

/* =========================== BRAND LOGO MANAGER =========================== */
function BrandLogosScreen({ st, A, t, lang, go, flash }) {
  const [q, setQ] = useState("");
  const [bulk, setBulk] = useState(null);
  const refs = useRef({});
  const bulkRef = useRef(null);

  const bulkAdd = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setBulk("busy");
    let ok = 0, miss = 0;
    const found = {};
    for (const f of list) {
      const brand = matchBrandByFile(f.name);
      if (!brand) { miss++; continue; }
      try { found[brand] = await downscale(f, 240, 0.85); ok++; }
      catch { miss++; }
    }
    Object.entries(found).forEach(([b, src]) => A.setBrandLogo(b, src));
    setBulk({ ok, miss });
    buzz(14); Sfx.success();
    flash(`${t("bulkDone")} · ${ok}`);
  };
  const brands = useMemo(() => Object.keys(CATALOG)
    .filter((b) => !q.trim() || norm(b).includes(norm(q))), [q]);
  const have = Object.keys(st.brandLogos || {}).length;

  const upload = async (brand, file) => {
    if (!file) return;
    try { A.setBrandLogo(brand, await downscale(file, 240, 0.85)); flash(t("uploadLogo")); buzz(12); }
    catch { flash(t("errSave")); }
  };

  return (
    <>
      <PageHeader title={t("brandLogos")} lang={lang} onBack={() => go("settings")} />

      <p style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.8, marginBottom: 10 }}>
        {t("brandLogosSub")}</p>

      <button className="btnG" style={{ marginBottom: 8, display: "flex", alignItems: "center",
        justifyContent: "center", gap: 8 }} disabled={bulk === "busy"}
        onClick={() => bulkRef.current?.click()}>
        <Ic n="upload" c={C.onGold} s={20} />
        {bulk === "busy" ? t("running") : t("bulkUpload")}
      </button>
      <input ref={bulkRef} type="file" accept="image/*,image/heic,image/heif" multiple style={{ display: "none" }}
        onChange={(e) => { bulkAdd(e.target.files); e.target.value = ""; }} />
      <p style={{ fontSize: 10.5, color: C.ink4, lineHeight: 1.8, marginBottom: 12,
        direction: "ltr", fontFamily: "Inter,sans-serif" }}>{t("bulkLogosHint")}</p>
      {bulk && bulk !== "busy" && (
        <div className="card" style={{ padding: 12, marginBottom: 12, display: "flex",
          justifyContent: "space-around", fontSize: 12.5 }}>
          <span style={{ color: C.green }}>{t("matched")}{" "}
            <span className="num" style={{ fontWeight: 800 }}>{bulk.ok}</span></span>
          <span style={{ color: bulk.miss ? C.red : C.ink3 }}>{t("unmatched")}{" "}
            <span className="num" style={{ fontWeight: 800 }}>{bulk.miss}</span></span>
        </div>
      )}

      <div className="card" style={{ padding: "12px 0", marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 4 }}>{t("brandLogos")}</div>
        <div className="num" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
          {have}/{Object.keys(CATALOG).length}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card2,
        border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "10px 12px", marginBottom: 12 }}>
        <Ic n="search" c={C.ink3} s={17} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")}
          style={{ flex: 1, background: "transparent", border: 0, outline: "none", color: C.white,
            font: "600 16px inherit" }} />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {brands.map((b) => (
          <div key={b} className="card" style={{ padding: 10, display: "flex", gap: 10,
            alignItems: "center" }}>
            <BrandBadge brand={b} size={42} logos={st.brandLogos} />
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, direction: "ltr",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b}</span>
            <button onClick={() => refs.current[b]?.click()}
              style={{ border: `1px solid ${C.line}`, background: C.goldFaint,
                color: C.gold, borderRadius: RD.sm, padding: "8px 12px", cursor: "pointer",
                font: "700 11px inherit", whiteSpace: "nowrap" }}>{t("uploadLogo")}</button>
            {st.brandLogos?.[b] && (
              <button onClick={() => A.removeBrandLogo(b)}
                style={{ border: `1px solid ${C.redEdge}`, background: "transparent",
                  color: C.red, borderRadius: RD.sm, padding: "8px 10px", cursor: "pointer",
                  font: "700 11px inherit" }}>{t("removeLogo")}</button>
            )}
            <input ref={(el) => { refs.current[b] = el; }} type="file" accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { upload(b, e.target.files?.[0]); e.target.value = ""; }} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ================================ LEADS SHEET ============================= */
function LeadsSheet({ deal, A, t, lang, ccy, onClose }) {
  const U = CURRENCIES[ccy].ar;
  const leads = (deal.leads || []).map(leadStats);
  const st2 = offerStats(deal);
  const k = computeDeal(deal, { });
  const [openId, setOpenId] = useState(null);
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");

  const setLeads = (rows) => A.patchDeal(deal.dealId, { leads: rows });
  const upd = (id, p) => setLeads(leads.map((x) => (x.leadId === id ? { ...x, ...p } : x)));

  const asking = num(deal.askingPrice);
  const minAcc = num(deal.minAcceptable);

  return (
    <BottomSheet title={t("leads")} onClose={onClose}>
      {/* أعلى عرض قائم */}
      <div className="card" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 5 }}>{t("highestActive")}</div>
        <Counter value={st2.highest} style={{ fontSize: 30, fontWeight: 800, color: C.gold,
          display: "block", lineHeight: 1.15 }} />
        <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>
          {U}{st2.holder ? ` · ${st2.holder.name || "—"}` : ""}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9.5, color: C.ink2 }}>{t("vsAsking")}</div>
            <span className="num" style={{ fontSize: 13.5, fontWeight: 800,
              color: st2.highest >= asking ? C.green : C.red }}>
              {st2.highest ? signed(st2.highest - asking) : "—"}</span>
          </div>
          {minAcc > 0 && (
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 9.5, color: C.ink2 }}>{t("vsMin")}</div>
              <span className="num" style={{ fontSize: 13.5, fontWeight: 800,
                color: st2.highest >= minAcc ? C.green : C.red }}>
                {st2.highest ? signed(st2.highest - minAcc) : "—"}</span>
            </div>
          )}
        </div>
      </div>

      {!leads.length && (
        <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "10px 0 14px" }}>
          {t("noLeads")}</p>
      )}

      {leads.map((L) => {
        const open = openId === L.leadId;
        return (
          <div key={L.leadId} className="card" style={{ padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="inp" value={L.name} placeholder={t("leadName")}
                onChange={(e) => upd(L.leadId, { name: e.target.value })} style={{ flex: 1 }} />
              <button onClick={() => { buzz(); setOpenId(open ? null : L.leadId); }}
                aria-label="expand" style={{ background: "none", border: 0, cursor: "pointer" }}>
                <Ic n={open ? "chev" : "chevR"} c={C.gold} s={17} /></button>
              <button onClick={() => setLeads(leads.filter((x) => x.leadId !== L.leadId))}
                aria-label="delete" style={{ background: "none", border: 0, cursor: "pointer" }}>
                <Ic n="trash" c={C.ink4} s={15} /></button>
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 9, fontSize: 10.5 }}>
              <span style={{ color: C.ink3 }}>{t("firstOffer")}{" "}
                <span className="num" style={{ color: C.white, fontWeight: 700 }}>
                  {L.first ? f0(L.first) : "—"}</span></span>
              <span style={{ color: C.ink3 }}>{t("lastOffer")}{" "}
                <span className="num" style={{ color: C.white, fontWeight: 700 }}>
                  {L.last ? f0(L.last) : "—"}</span></span>
              <span style={{ color: C.ink3 }}>{t("highestOffer")}{" "}
                <span className="num" style={{ color: C.gold, fontWeight: 800 }}>
                  {L.highest ? f0(L.highest) : "—"}</span></span>
            </div>

            <div className="wrap-x" style={{ marginTop: 10 }}>
              {Object.keys(LEAD_STATES).map((kk) => (
                <button key={kk} className="chip" data-on={L.status === kk ? "1" : "0"}
                  onClick={() => { buzz(); upd(L.leadId, { status: kk, lastContact: todayISO() }); }}>
                  {LEAD_STATES[kk][lang]}</button>
              ))}
            </div>

            {open && (
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                <div style={{ display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
                  <SheetField label={t("leadPhone")}>
                    <input className="inp ltr" inputMode="tel" value={L.phone}
                      onChange={(e) => upd(L.leadId, { phone: e.target.value })} /></SheetField>
                  <SheetField label={t("lastContact")}>
                    <input className="inp ltr" type="date" value={L.lastContact || ""}
                      onChange={(e) => upd(L.leadId, { lastContact: e.target.value })} /></SheetField>
                  <SheetField label={`${t("quotedPrice")} · ${U}`}>
                    <input className="inp ltr" type="number" inputMode="decimal"
                      value={L.quotedPrice || ""}
                      onChange={(e) => upd(L.leadId, { quotedPrice: num(e.target.value) })} /></SheetField>
                  <SheetField label={`${t("minTold")} · ${U}`}>
                    <input className="inp ltr" type="number" inputMode="decimal"
                      value={L.minToldPrice || ""}
                      onChange={(e) => upd(L.leadId, { minToldPrice: num(e.target.value) })} /></SheetField>
                </div>

                <SheetField label={t("notes")}>
                  <input className="inp" value={L.notes}
                    onChange={(e) => upd(L.leadId, { notes: e.target.value })} /></SheetField>

                {/* سجل العروض — لا يُمسح عرض سابق */}
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: C.ink2, marginBottom: 7 }}>
                    {t("offers")} · <span className="num">{L.count}</span></div>
                  {!L.offers.length && (
                    <p style={{ fontSize: 11.5, color: C.ink4, padding: "4px 0" }}>{t("noOffers")}</p>
                  )}
                  {[...L.offers].reverse().map((o) => (
                    <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 0", borderBottom: `1px solid ${C.line}` }}>
                      <Ic n="tag" c={C.ink3} s={13} />
                      <span className="num" style={{ flex: 1, fontSize: 10.5, color: C.ink3 }}>
                        {String(o.at).slice(0, 10)}{o.note ? ` · ${o.note}` : ""}</span>
                      <span className="num" style={{ fontSize: 13.5, fontWeight: 800,
                        color: num(o.amount) === L.highest ? C.gold : C.white }}>
                        {f0(num(o.amount))}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                    <input className="inp ltr" type="number" inputMode="decimal" value={amt}
                      onChange={(e) => setAmt(e.target.value)} placeholder="0" style={{ flex: 1 }} />
                    <input className="inp" value={note} onChange={(e) => setNote(e.target.value)}
                      placeholder={t("notes")} style={{ flex: 1 }} />
                    <button className="btnG" style={{ width: 96 }} disabled={!num(amt)}
                      onClick={() => { A.addOffer(deal.dealId, L.leadId,
                        { amount: num(amt), note }); setAmt(""); setNote("");
                        buzz(12); Sfx.success(); }}>{t("addOffer")}</button>
                  </div>
                </div>

                {L.phone && (
                  <a href={`tel:${L.phone}`} className="btnO" style={{ display: "flex",
                    alignItems: "center", justifyContent: "center", gap: 8,
                    textDecoration: "none" }}>
                    <Ic n="bell" c={C.gold} s={15} />{t("call")}</a>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button className="btnG" style={{ marginTop: 6 }}
        onClick={() => { buzz(); setLeads([...leads, mkLead()]); }}>+ {t("addLead")}</button>
    </BottomSheet>
  );
}

/* سطر في تقرير الطباعة — مرفوع لمنع إعادة التركيب */
function ReportLine({ l, v, bold, col }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0",
      borderBottom: "1px solid #E4E4E8", fontSize: bold ? 14 : 12.5,
      fontWeight: bold ? 800 : 500, color: col || "#111" }}>
      <span>{l}</span><span style={{ direction: "ltr" }}>{v}</span>
    </div>
  );
}

/* رقم كبير في حاسبة الشراء — مرفوع حتى لا يُعاد تشغيل العدّاد كل رسم */
function BigStat({ label, value, unit, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 5 }}>{label}</div>
      <Counter value={value} style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1.1,
        letterSpacing: "-.03em", display: "block" }} />
      <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>{unit}</div>
    </div>
  );
}

/* ============================== ALERTS PANEL ============================== */
function AlertsSheet({ st, t, lang, A, go, onClose }) {
  const rows = useMemo(() => buildAlerts(st.deals, st.models, st.settings),
    [st.deals, st.models, st.settings]);
  const tone = { good: C.green, warn: C.gold, bad: C.red };
  return (
    <BottomSheet title={t("alerts")} onClose={onClose}>
      {!rows.length && (
        <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "16px 0" }}>
          {t("noAlerts")}</p>
      )}
      {rows.map((r) => (
        <button key={r.id} className="card" onClick={() => {
          buzz(); A.setActive(r.dealId); onClose(); go("details"); }}
          style={{ width: "100%", padding: 12, marginBottom: 9, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, color: "inherit",
            fontFamily: "inherit", textAlign: "start",
            borderColor: `${tone[r.tone]}` }}>
          <span style={{ width: 34, height: 34, borderRadius: 26, flexShrink: 0, display: "grid",
            placeItems: "center", background: `${tone[r.tone]}` }}>
            <Ic n="bell" c={tone[r.tone]} s={15} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 13.5, fontWeight: 700 }}>
              {t(r.key)} {r.val && <span className="num">{r.val}</span>}
              {r.key === "alertListed" && ` ${t("daysWord")}`}
            </span>
            <span style={{ display: "block", fontSize: 10.5, color: C.ink3, marginTop: 2,
              direction: "ltr" }}>{r.name}</span>
          </span>
          <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.ink4} s={15} />
        </button>
      ))}
    </BottomSheet>
  );
}

/* ============================== DEAL REPORT =============================== */
function DealReport({ deal, model, k, t, lang, ccy, st, onClose }) {
  const U = CURRENCIES[ccy].ar;
  useEffect(() => { const id = setTimeout(() => window.print(), 350);
    return () => clearTimeout(id); }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 120, background: C.scrimSolid,
      overflowY: "auto", padding: 14 }}>
      <div className="printArea" style={{ background: "#fff", color: "#111", borderRadius: 12,
        padding: 20, maxWidth: 640, margin: "0 auto",
        fontFamily: lang === "ar" ? "'Cairo',sans-serif" : "'Inter',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "2px solid #111",
          paddingBottom: 12, marginBottom: 16 }}>
          <img src={LOGO_SRC} alt="" style={{ height: 46 }} />
          <div style={{ flex: 1, textAlign: "end" }}>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{t("report")}</div>
            <div className="num" style={{ fontSize: 10.5, color: "#666" }}>{todayISO()}</div>
          </div>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, direction: "ltr", marginBottom: 2 }}>
          {model?.brand} {model?.model} <span style={{ color: "#C00" }}>{model?.year}</span></h2>
        <div style={{ fontSize: 11.5, color: "#555", marginBottom: 16, direction: "ltr" }}>
          {[model?.trim, model?.engine, deal.vin && `VIN ${deal.vin}`,
            deal.mileage && `${f0(num(deal.mileage))} km`].filter(Boolean).join("  ·  ")}
        </div>

        <ReportLine l={t("purchasePrice")} v={money(k.purchasePrice, ccy, { exact: true, fixed: true })} />
        <ReportLine l={t("totalExp")} v={money(k.totalExpenses, ccy, { exact: true, fixed: true })} />
        <ReportLine l={t("totalCost")} v={money(k.totalCost, ccy, { exact: true, fixed: true })} bold />
        <ReportLine l={k.isSold ? t("soldPrice") : t("sellPrice")}
          v={money(k.sellingPrice, ccy, { exact: true, fixed: true })} bold />
        <ReportLine l={t("netProfit")} v={signed(k.profit)} bold col={k.profit >= 0 ? "#0A7" : "#C00"} />
        <ReportLine l={t("roi")} v={pct(k.roi)} col={k.profit >= 0 ? "#0A7" : "#C00"} />
        <ReportLine l={t("margin")} v={pct(k.margin)} />
        <ReportLine l={t("breakEven")} v={money(k.breakEven, ccy, { exact: true, fixed: true })} />
        <ReportLine l={t("daysHeld")} v={`${k.daysHeld} ${t("dayUnit")}`} />

        {deal.expenses.length > 0 && (
          <>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, margin: "18px 0 8px" }}>{t("expList")}</h3>
            {deal.expenses.map((e) => (
              <ReportLine key={e.expenseId}
                l={e.description || (EXPENSE_CATS[e.category] || EXPENSE_CATS.other)[lang]}
                v={money(expAmount(e), ccy, { exact: true, fixed: true })} />
            ))}
          </>
        )}

        {deal.notes && (
          <>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, margin: "18px 0 8px" }}>{t("notes")}</h3>
            <p style={{ fontSize: 12.5, lineHeight: 1.9, color: "#333" }}>{deal.notes}</p>
          </>
        )}

        <div style={{ marginTop: 22, paddingTop: 12, borderTop: "1px solid #DDD",
          fontSize: 10.5, color: "#777", textAlign: "center", direction: "ltr" }}>
          {t("reportBy")} H CAR DEAL — BUY • COST • SELL • PROFIT
        </div>
      </div>

      <div className="noPrint" style={{ display: "flex", gap: 10, maxWidth: 640,
        margin: "14px auto 0" }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" onClick={() => window.print()}>{t("printReport")}</button>
      </div>
    </div>
  );
}

/* ========================= BUY CALCULATOR (قبل ما تشتري) ================== */
function BuyCalcScreen({ st, A, t, lang, ccy, go, flash }) {
  const U = CURRENCIES[ccy].ar;
  const [sell, setSell] = useState(7000);
  const [want, setWant] = useState(st.settings.defaultTarget || 2000);
  const [asked, setAsked] = useState(0);
  const [picks, setPicks] = useState({});
  const [manual, setManual] = useState("");

  const presetTotal = Object.values(picks).reduce((a, v) => a + num(v), 0);
  const exp = manual !== "" ? num(manual) : presetTotal;
  const r = buyCeiling({ expectedSelling: sell, expectedExpenses: exp,
    targetProfit: want, askingPrice: asked });

  const toneOf = { good: C.green, tight: C.gold, bad: C.red }[r.verdict];
  const edgeOf = { good: C.greenEdge, tight: C.goldEdge, bad: C.redEdge }[r.verdict];
  const lastV = useRef(null);
  useEffect(() => {
    if (!asked) { lastV.current = null; return; }
    if (lastV.current && lastV.current !== r.verdict) {
      if (r.verdict === "good") Sfx.success();
      else if (r.verdict === "bad") Sfx.error();
      else Sfx.warn();
    }
    lastV.current = r.verdict;
  }, [r.verdict, asked]);
  const bgOf = { good: C.greenFaint, tight: C.goldFaint, bad: C.redFaint }[r.verdict];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <button onClick={() => go("home")} aria-label="back" style={{ background: "none",
          border: 0, cursor: "pointer", padding: 4, width: 34 }}>
          <Ic n={lang === "ar" ? "chevR" : "chev"} c={C.white} s={20} /></button>
        <span style={{ flex: 1 }} /><span style={{ width: 34 }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>{t("buyCalc")}</h2>
        <p style={{ fontSize: 12.5, color: C.ink2, marginTop: 6 }}>{t("buyCalcSub")}</p>
      </div>

      {/* ١ — بكم بتبيعها */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("expectSell")}</h3>
          <Ic n="tag" c={C.gold} s={17} />
        </div>
        <MoneyInput ccy={ccy} big value={sell} onChange={setSell} />
      </div>

      {/* ٢ — كم بتصرف */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("expectExp")}</h3>
          <Ic n="clipboard" c={C.gold} s={17} />
        </div>
        <p style={{ fontSize: 10.5, color: C.ink3, marginBottom: 12, lineHeight: 1.7 }}>
          {t("presetHint")}</p>

        <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
          {EXPENSE_PRESETS.map((pz) => {
            const on = picks[pz.key] !== undefined;
            return (
              <div key={pz.key} style={{ display: "flex", alignItems: "center", gap: 8,
                background: on ? C.goldFaint : C.card2, borderRadius: RD.sm,
                border: `1px solid ${on ? C.line : C.line}`, padding: "8px 10px" }}>
                <button onClick={() => { buzz(); setManual("");
                  setPicks((x) => { const n2 = { ...x };
                    if (on) delete n2[pz.key]; else n2[pz.key] = pz.amount; return n2; }); }}
                  aria-label={pz.key}
                  style={{ width: 21, height: 21, borderRadius: 8, flexShrink: 0, cursor: "pointer",
                    border: `1.5px solid ${on ? C.gold : C.ink4}`,
                    background: on ? C.gold : "transparent", color: C.onGold,
                    font: "900 12px 'Inter',sans-serif", display: "grid", placeItems: "center" }}>
                  {on ? "✓" : ""}</button>
                <span style={{ flex: 1, fontSize: 12.5, color: on ? C.white : C.ink3 }}>
                  {lang === "ar" ? pz.ar : pz.en}</span>
                <input className="inp ltr" type="number" inputMode="decimal"
                  value={on ? picks[pz.key] : ""} placeholder={String(pz.amount)}
                  onChange={(e) => { setManual("");
                    setPicks((x) => ({ ...x, [pz.key]: num(e.target.value) })); }}
                  style={{ width: 92, padding: "8px 6px", textAlign: "center", fontSize: 15 }} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
          border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "12px 12px" }}>
          <span style={{ fontSize: 11.5, color: C.ink2, flex: 1 }}>{t("totalExp")}</span>
          <input className="num" type="number" inputMode="decimal"
            value={manual !== "" ? manual : presetTotal}
            onChange={(e) => setManual(e.target.value)}
            style={{ width: 110, background: "transparent", border: 0, outline: "none",
              textAlign: "end", font: "800 20px 'Inter',sans-serif", color: C.gold }} />
          <span style={{ fontSize: 10.5, color: C.ink3 }}>{U}</span>
        </div>
      </div>

      {/* ٣ — كم تبي تربح */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("wantProfit")}</h3>
          <Ic n="target" c={C.gold} s={17} />
        </div>
        <MoneyInput ccy={ccy} value={want} onChange={setWant} />
        <input className="rng" type="range" min={0} max={Math.max(500, Math.round(sell * 0.5))}
          step={25} value={Math.min(want, Math.max(500, Math.round(sell * 0.5)))}
          onChange={(e) => setWant(+e.target.value)} style={{ marginTop: 10 }} />
      </div>

      {/* النتيجة */}
      <div className="card" style={{ padding: 20, marginBottom: 12 }}>
        <BigStat label={t("maxPay")} value={Math.max(0, r.maxPurchase)} unit={U} color={C.gold} />
        <div style={{ height: 1, background: C.line, margin: "16px 0" }} />
        <div style={{ display: "flex" }}>
          {[[t("breakEven"), f0(Math.max(0, r.breakEvenPurchase)), C.red],
            [t("totalExp"), f0(exp), C.white],
            [t("targetProfit"), f0(want), C.green]].map(([l, v, col], i, a) => (
            <div key={i} style={{ flex: 1, textAlign: "center",
              borderInlineEnd: i < a.length - 1 ? `1px solid ${C.line}` : 0 }}>
              <div style={{ fontSize: 9.5, color: C.ink2, marginBottom: 4 }}>{l}</div>
              <div className="num liv" style={{ fontSize: 15, fontWeight: 800, color: col }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* السعر المطلوب والحكم */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
          marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800 }}>{t("askedPrice")}</h3>
          <Ic n="cart" c={C.gold} s={17} />
        </div>
        <MoneyInput ccy={ccy} big value={asked} onChange={setAsked} />

        {asked > 0 && (
          <>
            <div key={r.verdict} className="pulse" style={{ marginTop: 14, borderRadius: RD.md,
              padding: "14px 14px", "--pc": `${toneOf}`,
              background: bgOf, border: `1px solid ${edgeOf}`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: toneOf, marginBottom: 6 }}>
                {t(r.verdict)}</div>
              <div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.8 }}>
                {r.gap > 0
                  ? <>{t("roomDown")} <span className="num" style={{ color: toneOf,
                      fontWeight: 800 }}>{f0(r.gap)}</span> {U}</>
                  : <>{t("roomUp")} <span className="num" style={{ color: C.green,
                      fontWeight: 800 }}>{f0(-r.gap)}</span> {U}</>}
              </div>
            </div>

            <div style={{ display: "flex", background: C.card2, border: `1px solid ${C.line}`,
              borderRadius: RD.md, marginTop: 12, padding: "12px 0" }}>
              {[[`${t("ifBuyAt")} ${f0(asked)}`, "", C.ink2],
                [t("resultProfit"), signed(r.profitAtAsked), r.profitAtAsked >= 0 ? C.green : C.red],
                [t("resultRoi"), pct(r.roiAtAsked), r.profitAtAsked >= 0 ? C.green : C.red]]
                .map(([l, v, col], i, a) => (
                <div key={i} style={{ flex: 1, textAlign: "center",
                  borderInlineEnd: i < a.length - 1 ? `1px solid ${C.line}` : 0 }}>
                  <div style={{ fontSize: 9.5, color: C.ink2, marginBottom: v ? 5 : 0,
                    padding: "0 4px" }}>{l}</div>
                  {v && <div className="num liv" style={{ fontSize: 17, fontWeight: 800,
                    color: col }}>{v}</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button className="btnO" style={{ marginBottom: 10 }} onClick={() => go("inspect")}>
        {t("inspection")}</button>

      <button className="btnG" disabled={!asked} style={{ opacity: asked ? 1 : .4 }}
        onClick={() => {
          const row = CATALOG_ROWS[0];
          const m = materializeModel(row, String(new Date().getFullYear()), "", st.models);
          A.upsertModel(m);
          const d = mkDeal({
            vehicleModelId: m.vehicleModelId, purchasePrice: num(asked),
            askingPrice: num(sell), targetProfit: num(want), status: "purchased",
            expenses: Object.entries(picks).map(([cat, amount]) =>
              mkExpense({ category: cat, amount: num(amount), paid: false,
                description: (EXPENSE_PRESETS.find((x) => x.key === cat) || {})[lang] || "" })),
          });
          A.addDeal(d, m.vehicleModelId);
          buzz(14); Sfx.turbo(); flash(t("saveAsDeal")); go("details");
        }}>{t("saveAsDeal")}</button>
    </>
  );
}

/* ================================ RESERVE ================================== */
function ReserveScreen({ st, A, t, lang, ccy, go, flash, setConfirm }) {
  const U = CURRENCIES[ccy].ar;
  const r = reserveSummary(st);
  const S = st.settings;
  const [amt, setAmt] = useState("");
  const [kind, setKind] = useState("deposit");

  const setS = (k2, v) => A.setSetting(k2, v);
  const done = r.balance >= r.goal && r.goal > 0;

  return (
    <>
      <PageHeader title={t("reserve")} lang={lang} onBack={() => go("analytics")} />

      {/* الرصيد */}
      <div className="card" style={{ padding: 20, marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 6 }}>{t("reserveBalance")}</div>
        <Counter value={r.balance} style={{ fontSize: 38, fontWeight: 800, color: C.gold,
          letterSpacing: "-.03em", lineHeight: 1.1, display: "block" }} />
        <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>{U}</div>

        <div style={{ marginTop: 16, height: 9, borderRadius: 26, background: C.hairline,
          overflow: "hidden" }}>
          <div className="grow" style={{ height: "100%", borderRadius: 26,
            width: `${r.pct}%`, background: C.goldGrad }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7,
          fontSize: 10.5, color: C.ink3 }}>
          <span>{done ? t("reserveDone") : t("reserveLeft")}{" "}
            {!done && <span className="num" style={{ color: C.gold, fontWeight: 700 }}>
              {f0(r.left)}</span>}</span>
          <span className="num">{t("reserveTarget")} {f0(r.goal)}</span>
        </div>
      </div>

      {/* الإعداد */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", gap: 14 }}>
        <SheetField label={t("reserveMode")}>
          <SegmentedControl value={S.reserveMode} onChange={(k) => setS("reserveMode", k)}
            options={[["percent", t("modePercent")], ["fixed", t("modeFixed")]]} />
        </SheetField>

        {S.reserveMode === "fixed" ? (
          <SheetField label={`${t("reserveFixed")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={S.reserveFixed}
              onChange={(e) => setS("reserveFixed", num(e.target.value))} />
          </SheetField>
        ) : (
          <SheetField label={t("reservePct")}>
            <input className="inp ltr" type="number" inputMode="decimal" value={S.reservePct}
              onChange={(e) => setS("reservePct", num(e.target.value))} />
            <input className="rng" type="range" min={0} max={60} step={5} value={S.reservePct}
              onChange={(e) => setS("reservePct", +e.target.value)} style={{ marginTop: 8 }} />
          </SheetField>
        )}

        <SheetField label={`${t("reserveTarget")} · ${U}`} hint={t("reserveHint")}>
          <input className="inp ltr" type="number" inputMode="decimal" value={S.reserveTarget}
            onChange={(e) => setS("reserveTarget", num(e.target.value))} />
        </SheetField>
      </div>

      {/* حركة يدوية */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: C.ink2, marginBottom: 9 }}>
          {t("addManual")}</div>
        <div style={{ display: "flex", gap: 4, background: C.card2, borderRadius: 12, padding: 4,
          marginBottom: 11 }}>
          {[["deposit", t("depositIn")], ["withdraw", t("withdraw")]].map(([kk, lb]) => (
            <button key={kk} onClick={() => { buzz(); setKind(kk); }}
              style={{ flex: 1, border: 0, borderRadius: 8, padding: "10px 6px", cursor: "pointer",
                font: "700 12.5px inherit",
                background: kind === kk ? (kk === "deposit" ? C.green : C.red) : "transparent",
                color: kind === kk ? C.onGreen : C.ink3 }}>{lb}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="inp ltr" type="number" inputMode="decimal" value={amt}
            onChange={(e) => setAmt(e.target.value)} placeholder="0" style={{ flex: 1 }} />
          <button className="btnG" style={{ width: 120 }} disabled={!num(amt)}
            onClick={() => { A.addReserve({ type: kind, amount: num(amt) });
              setAmt(""); buzz(12); Sfx.money(); flash(t("savedOk")); }}>
            {kind === "deposit" ? t("depositIn") : t("withdraw")}</button>
        </div>
      </div>

      {/* الحركات */}
      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 12, textAlign: "end" }}>
          {t("reserveLog")}</div>
        {!r.moves.length && (
          <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "10px 0" }}>
            {t("noMoves")}</p>
        )}
        {[...r.moves].reverse().map((m) => {
          const out = m.type === "withdraw";
          return (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "grid",
                placeItems: "center", background: out ? C.redFaint : C.greenFaint }}>
                <Ic n={out ? "download" : "coins"} c={out ? C.red : C.green} s={15} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 12.5, overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.note || (out ? t("withdraw") : t("depositIn"))}</span>
                <span className="num" style={{ display: "block", fontSize: 10.5, color: C.ink3 }}>
                  {m.date}</span>
              </span>
              <span className="num" style={{ fontSize: 15, fontWeight: 800,
                color: out ? C.red : C.green }}>
                {out ? "−" : "+"}{f0(num(m.amount))}</span>
              <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                onYes: () => A.dropReserve(m.id) })} aria-label="delete"
                style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                <Ic n="trash" c={C.ink4} s={15} /></button>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* صف قيمة داخل مركز النسخ — مرفوع لمنع إعادة التركيب */
function BkRow({ l, v, col }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0",
      borderBottom: `1px solid ${C.line}`, fontSize: 12.5 }}>
      <span style={{ color: C.ink2 }}>{l}</span>
      <span className="num" style={{ fontWeight: 800, color: col || C.white }}>{v}</span>
    </div>
  );
}

/* شبكة عدّادات محتويات النسخة */
function BkCounts({ c, t }) {
  const items = [[t("cDeals"), c.deals], [t("cActive"), c.activeDeals], [t("cPhotos"), c.photos],
    [t("cExpenses"), c.expenses], [t("cReceipts"), c.receipts], [t("cLeads"), c.leads],
    [t("cModels"), c.models], [t("cEvents"), c.events],
    [t("cLibrary"), c.libraryImages], [t("cLogos"), c.brandLogos],
    [t("cReserve"), c.reserveEntries], [t("cCash"), c.cashEntries],
    [t("cBiz"), c.bizExpenses], [t("cInsp"), c.inspections],
    [t("cOffers"), c.offers], [t("cDeposits"), c.deposits],
    [t("cPrices"), c.priceChanges], [t("cImports"), c.imports]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(88px,1fr))",
      gap: 8, marginTop: 10 }}>
      {items.map(([l, v], i) => (
        <div key={i} style={{ background: C.card2, border: `1px solid ${C.line}`,
          borderRadius: RD.sm, padding: "8px 4px", textAlign: "center" }}>
          <div className="num" style={{ fontSize: 17, fontWeight: 800,
            color: v > 0 ? C.gold : C.ink4 }}>{v}</div>
          <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---- إحصاءات سجل الأسعار ---- */
function priceStats(deal) {
  const hist = deal.priceHistory || [];
  const current = num(deal.askingPrice);
  const all = [...hist.map((h) => num(h.from)), current].filter((x) => x > 0);
  const original = hist.length ? num(hist[0].from) : current;
  const lowest = all.length ? Math.min(...all) : current;
  const rows = hist.map((h, i) => {
    const start = new Date(h.at);
    const end = i < hist.length - 1 ? new Date(hist[i + 1].at) : new Date();
    return { ...h, days: Math.max(0, Math.round((end - start) / 864e5)) };
  });
  const sinceLast = hist.length
    ? Math.max(0, Math.round((Date.now() - new Date(hist[hist.length - 1].at)) / 864e5))
    : daysBetween(deal.purchaseDate, todayISO());
  return { current, original, lowest, count: hist.length, rows, sinceLast };
}

/* ---- أعلى عرض قائم من المشترين ---- */
function offerStats(deal) {
  const leads = (deal.leads || []).map(leadStats);
  const active = leads.filter((l) => !["rejected"].includes(l.status));
  const highest = active.reduce((a, l) => Math.max(a, l.highest), 0);
  const holder = active.find((l) => l.highest === highest && highest > 0);
  return { leads, active, highest, holder, total: leads.length };
}

/* ---- سطر عرض في سجل الأسعار ---- */
function PriceRow({ h, lang, ccy, t }) {
  const down = num(h.to) < num(h.from);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
      borderBottom: `1px solid ${C.line}` }}>
      <Ic n={down ? "download" : "chartUp"} c={down ? C.red : C.green} s={15} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="num" style={{ display: "block", fontSize: 12.5, fontWeight: 700 }}>
          {f0(num(h.from))} <span style={{ color: C.ink4 }}>→</span>{" "}
          <span style={{ color: down ? C.red : C.green }}>{f0(num(h.to))}</span>
        </span>
        <span style={{ display: "block", fontSize: 10.5, color: C.ink3, marginTop: 2 }}>
          <span className="num">{String(h.at).slice(0, 10)}</span>
          {h.days !== undefined && <> · {t("heldFor")} <span className="num">{h.days}</span></>}
          {h.reason ? ` · ${h.reason}` : ""}
        </span>
      </span>
      <span className="num" style={{ fontSize: 11.5, fontWeight: 800,
        color: down ? C.red : C.green }}>{signed(num(h.to) - num(h.from))}</span>
    </div>
  );
}

/* ---------------- لوحة العرابين ---------------- */
function DepositSheet({ deal, A, t, lang, ccy, onClose, flash, setConfirm }) {
  const U = CURRENCIES[ccy].ar;
  const list = deal.deposits || [];
  const leads = (deal.leads || []).map(leadStats);
  const [f, setF] = useState(() => mkDeposit());
  const [adding, setAdding] = useState(!list.length);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const held = heldDeposits(deal).reduce((a, x) => a + num(x.amount), 0);

  const LBL = { held: t("depHeld"), applied: t("depApplied"),
    refunded: t("depRefunded"), forfeited: t("depForfeited") };
  const COL = { held: C.gold, applied: C.green, refunded: C.ink3, forfeited: C.redHi };
  const forfeited = forfeitedDeposits(deal);

  return (
    <BottomSheet title={t("deposits")} onClose={onClose}>
      <div className="card" style={{ padding: 14, marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 5 }}>{t("depHeld")}</div>
        <Counter value={held} style={{ fontSize: 30, fontWeight: 800, color: C.gold,
          display: "block", lineHeight: 1.15 }} />
        <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>{U}</div>
      </div>

      {forfeited > 0 && (
        <div className="card" style={{ padding: 12, marginBottom: 12 }}>
          <FinRow l={t("forfeitedIncome")} v={money(forfeited, ccy, { exact: true, fixed: true })}
            col={C.green} strong />
        </div>
      )}

      <p style={{ fontSize: 10.5, color: C.ink4, lineHeight: 1.8, marginBottom: 14 }}>
        {t("depositNote")}</p>

      {list.map((d) => (
        <div key={d.depositId} className="card" style={{ padding: 12, marginBottom: 9 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 26,
              background: COL[d.status] || C.ink3, flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, fontWeight: 700 }}>
                {d.name || "—"}</span>
              <span className="num" style={{ display: "block", fontSize: 10.5, color: C.ink3 }}>
                {d.date} · {d.refundable ? t("refundable") : t("nonRefundable")}
                {" · "}{LBL[d.status]}</span>
            </span>
            <span className="num" style={{ fontSize: 15, fontWeight: 800,
              color: d.status === "refunded" ? C.ink4 : C.gold }}>
              {money(num(d.amount), ccy, { exact: true, fixed: true })}</span>
            <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
              onYes: () => A.dropDeposit(deal.dealId, d.depositId) })} aria-label="delete"
              style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
              <Ic n="trash" c={C.ink4} s={15} /></button>
          </div>
          {d.status === "held" && deal.status !== "sold" && (
            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              {d.refundable && (
                <button className="btnO"
                  onClick={() => setConfirm({ text: t("refundDeposit"), danger: true, onYes: () => {
                    A.setDepositStatus(deal.dealId, d.depositId, "refunded", todayISO());
                    buzz(12); flash(t("depRefunded"));
                  } })}>{t("refundDeposit")}</button>
              )}
              {!d.refundable && (
                <button className="btnR"
                  onClick={() => setConfirm({ text: t("forfeitNote"), danger: true, onYes: () => {
                    A.setDepositStatus(deal.dealId, d.depositId, "forfeited", todayISO());
                    buzz(14); Sfx.money(); flash(t("depForfeited"));
                  } })}>{t("forfeitDeposit")}</button>
              )}
            </div>
          )}
        </div>
      ))}

      {!adding ? (
        <button className="btnG" style={{ marginTop: 6 }}
          onClick={() => { buzz(); setF(mkDeposit()); setAdding(true); }}>
          + {t("addDeposit")}</button>
      ) : (
        <div className="card" style={{ padding: 14, marginTop: 8, display: "grid", gap: 12 }}>
          <SheetField label={t("leadName")}>
            <input className="inp" value={f.name} list="dl-leads"
              onChange={(e) => set("name", e.target.value)} />
            <datalist id="dl-leads">
              {leads.map((l) => <option key={l.leadId} value={l.name} />)}
            </datalist>
          </SheetField>
          <SheetField label={`${t("amount")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={f.amount || ""}
              onChange={(e) => set("amount", num(e.target.value))} />
          </SheetField>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10 }}>
            <SheetField label={t("date")}>
              <input className="inp ltr" type="date" value={f.date}
                onChange={(e) => set("date", e.target.value)} /></SheetField>
            <SheetField label={t("method")}>
              <div className="wrap-x">
                {[["cash", t("mCash")], ["bank", t("mBank")], ["cheque", t("mCheque")],
                  ["transfer", t("mTransfer")]].map(([k2, lb]) => (
                  <button key={k2} className="chip" data-on={f.method === k2 ? "1" : "0"}
                    onClick={() => { buzz(); set("method", k2); }}>{lb}</button>
                ))}
              </div>
            </SheetField>
          </div>
          <div className="wrap-x">
            {[[true, t("refundable")], [false, t("nonRefundable")]].map(([v, lb]) => (
              <button key={String(v)} className="chip" data-on={f.refundable === v ? "1" : "0"}
                onClick={() => { buzz(); set("refundable", v); }}>{lb}</button>
            ))}
          </div>
          <SheetField label={t("notes")}>
            <input className="inp" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
          </SheetField>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btnO" onClick={() => setAdding(false)}>{t("cancel")}</button>
            <button className="btnG" disabled={num(f.amount) <= 0}
              style={{ opacity: num(f.amount) > 0 ? 1 : .4 }}
              onClick={() => {
                A.addDeposit(deal.dealId, f);
                setAdding(false); buzz(14); Sfx.money(); flash(t("savedOk"));
              }}>{t("save")}</button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}

/* ---------------- لوحة حركة نقدية يدوية ---------------- */
function CashSheet({ st, A, t, lang, ccy, kind, onClose, flash }) {
  const U = CURRENCIES[ccy].ar;
  const [f, setF] = useState({ amount: "", date: todayISO(), method: "cash", note: "",
    type: kind || "capital_in" });
  const meta = CASH_TYPES[f.type] || CASH_TYPES.capital_in;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const TYPES = Object.keys(CASH_TYPES).filter((k) => !CASH_TYPES[k].auto);

  return (
    <BottomSheet title={meta[lang]} onClose={onClose}>
      <div style={{ display: "grid", gap: 14 }}>
        <SheetField label={t("category")}>
          <div className="wrap-x">
            {TYPES.map((k) => (
              <button key={k} className="chip" data-on={f.type === k ? "1" : "0"}
                onClick={() => { buzz(); set("type", k); }}>{CASH_TYPES[k][lang]}</button>
            ))}
          </div>
        </SheetField>

        <SheetField label={`${t("amount")} · ${U}`}>
          <input className="inp ltr" type="number" inputMode="decimal" value={f.amount}
            onChange={(e) => set("amount", e.target.value)} placeholder="0" />
        </SheetField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("date")}>
            <input className="inp ltr" type="date" value={f.date}
              onChange={(e) => set("date", e.target.value)} />
          </SheetField>
          <SheetField label={t("method")}>
            <div className="wrap-x">
              {[["cash", t("mCash")], ["bank", t("mBank")], ["cheque", t("mCheque")],
                ["transfer", t("mTransfer")]].map(([k, lb]) => (
                <button key={k} className="chip" data-on={f.method === k ? "1" : "0"}
                  onClick={() => { buzz(); set("method", k); }}>{lb}</button>
              ))}
            </div>
          </SheetField>
        </div>

        <SheetField label={t("notes")}>
          <input className="inp" value={f.note} onChange={(e) => set("note", e.target.value)} />
        </SheetField>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" disabled={num(f.amount) <= 0}
          style={{ opacity: num(f.amount) > 0 ? 1 : .4 }}
          onClick={() => {
            A.addCash({ type: f.type, amount: num(f.amount), date: f.date,
              method: f.method, note: f.note });
            buzz(14); Sfx.money(); onClose(); flash(t("savedOk"));
          }}>{t("save")}</button>
      </div>
    </BottomSheet>
  );
}

/* ---------------- لوحة مصروف نشاط ---------------- */
function BizSheet({ A, t, lang, ccy, onClose, flash, initial }) {
  const U = CURRENCIES[ccy].ar;
  const [f, setF] = useState(() => initial || mkBizExpense());
  const [err, setErr2] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const fileRef = useRef(null);

  const pickReceipt = async (e) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    try { set("receipt", await downscale(file, 900, 0.6)); } catch { flash(t("errPhotoRead")); }
  };

  return (
    <BottomSheet title={initial ? t("editBiz") : t("addBizExpense")} onClose={onClose}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: C.ink2, marginBottom: 8 }}>
        {t("category")}</div>
      <div className="wrap-x" style={{ marginBottom: 14 }}>
        {Object.keys(BIZ_CATS).map((k) => (
          <button key={k} className="chip" data-on={f.category === k ? "1" : "0"}
            onClick={() => { buzz(); set("category", k); }}>{BIZ_CATS[k][lang]}</button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        <SheetField label={t("desc")}>
          <input className="inp" value={f.description}
            onChange={(e) => set("description", e.target.value)} />
        </SheetField>

        <SheetField label={`${t("amount")} · ${U}`} error={err}>
          <input className="inp ltr" type="number" inputMode="decimal" step="0.001"
            value={f.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" />
        </SheetField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("date")}>
            <input className="inp ltr" type="date" value={f.date}
              onChange={(e) => set("date", e.target.value)} />
          </SheetField>
          <SheetField label={t("supplier")}>
            <input className="inp" value={f.supplier}
              onChange={(e) => set("supplier", e.target.value)} />
          </SheetField>
        </div>

        <SheetField label={t("method")}>
          <div className="wrap-x">
            {[["cash", t("mCash")], ["bank", t("mBank")], ["cheque", t("mCheque")],
              ["transfer", t("mTransfer")]].map(([k, lb]) => (
              <button key={k} className="chip" data-on={f.method === k ? "1" : "0"}
                onClick={() => { buzz(); set("method", k); }}>{lb}</button>
            ))}
          </div>
        </SheetField>

        <SheetField label={t("notes")}>
          <input className="inp" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        </SheetField>

        <SheetField label={t("receipt")}>
          {f.receipt ? (
            <div style={{ position: "relative", borderRadius: RD.sm, overflow: "hidden" }}>
              <img src={f.receipt} alt="" style={{ width: "100%", maxHeight: 170,
                objectFit: "cover", display: "block" }} />
              <button onClick={() => set("receipt", "")} style={{ position: "absolute", top: 8,
                insetInlineEnd: 8, width: 30, height: 30, borderRadius: 26,
                background: C.scrim, border: `1px solid ${C.line}`, cursor: "pointer",
                display: "grid", placeItems: "center" }}>
                <Ic n="x" c={C.white} s={13} /></button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{ width: "100%",
              border: `2px dashed ${C.goldDim}`, borderRadius: RD.sm, background: "transparent",
              padding: 14, cursor: "pointer", display: "grid", justifyItems: "center", gap: 6 }}>
              <Ic n="camera" c={C.gold} s={20} />
              <span style={{ fontSize: 11.5, color: C.gold, fontWeight: 700 }}>{t("receipt")}</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif"
            style={{ display: "none" }} onChange={pickReceipt} />
        </SheetField>

        <button onClick={() => setF((x) => ({ ...x, paid: !x.paid,
            paidAt: !x.paid ? todayISO() : "" }))}
          style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
            border: `1px solid ${f.paid ? C.line : C.redEdge}`,
            borderRadius: RD.sm, padding: "12px 12px", cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ width: 22, height: 22, borderRadius: 8, flexShrink: 0,
            border: `1.5px solid ${f.paid ? C.green : C.red}`,
            background: f.paid ? C.green : "transparent", color: C.onGreen,
            display: "grid", placeItems: "center", font: "900 12px 'Inter',sans-serif" }}>
            {f.paid ? "✓" : ""}</span>
          <span style={{ fontSize: 12.5, flex: 1, textAlign: "start" }}>
            {f.paid ? t("paidLabel") : t("notPaidYet")}</span>
        </button>

        {!f.paid && (
          <p style={{ fontSize: 10.5, color: C.redHi, lineHeight: 1.75,
            background: C.redFaint, border: `1px solid ${C.redEdge}`,
            borderRadius: RD.sm, padding: "10px 12px" }}>{t("bizPayableNote")}</p>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" onClick={() => {
          if (num(f.amount) <= 0) { setErr2(t("errAmount")); return; }
          const row = { ...f, amount: num(f.amount) };
          if (initial) A.updateBiz(initial.bizId, row);
          else A.addBiz(row);
          buzz(14); Sfx.success(); onClose(); flash(t("savedOk"));
        }}>{t("save")}</button>
      </div>
    </BottomSheet>
  );
}

/* مجموعة مؤشرات في لوحة التحكم المالية */
function FinGroup({ title, icon, children, accent }) {
  return (
    <div className="card" style={{ padding: 14, marginBottom: 12,
      borderColor: accent || C.line }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Ic n={icon} c={accent ? C.gold : C.ink2} s={17} />
        <span style={{ fontSize: 12.5, fontWeight: 800,
          color: accent ? C.gold : C.ink2, letterSpacing: ".02em" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/* بطاقة مؤشّر مالي */
function FinCard({ label, value, unit, color, sub, big }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: RD.md,
      padding: big ? "16px 14px" : "12px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 10.5, color: C.ink2, marginBottom: 5, lineHeight: 1.35 }}>{label}</div>
      <Counter value={value} style={{ fontSize: big ? 26 : 17, fontWeight: 800,
        color: color || C.white, display: "block", lineHeight: 1.15 }} />
      <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 3 }}>{sub || unit}</div>
    </div>
  );
}

/* صف داخل قسم مالي */
function FinRow({ l, v, col, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
      <span style={{ fontSize: 12.5, color: strong ? C.white : C.ink2,
        fontWeight: strong ? 700 : 400 }}>{l}</span>
      <span className="num liv" style={{ fontSize: strong ? 15.5 : 14, fontWeight: 800,
        color: col || C.white }}>{v}</span>
    </div>
  );
}

/* ==================== CAPITAL & CASH FLOW SCREEN ========================== */
function CapitalScreen({ st, A, t, lang, ccy, go, flash, setConfirm, setSheet }) {
  const U = CURRENCIES[ccy].ar;
  const f = useMemo(() => cashEngine(st), [st]);
  const [openCash, setOpenCash] = useState("");
  const [tab, setTab] = useState("summary");

  /* ---- شاشة افتتاح الدفتر ---- */
  if (!f.opened) {
    return (
      <>
        <PageHeader title={t("capital")} lang={lang} onBack={() => go("settings")} />

        <div className="cardG" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 14 }}>
            <Ic n="coins" c={C.gold} s={30} />
          </div>
          <p style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.95, textAlign: "center",
            marginBottom: 16 }}>{t("openingNote")}</p>

          <SheetField label={`${t("openingCash")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={openCash}
              onChange={(e) => setOpenCash(e.target.value)} placeholder="0" />
          </SheetField>

          <button className="btnG" style={{ marginTop: 16 }} onClick={() => {
            A.setCapital({ opened: true, openingCash: num(openCash), openingDate: todayISO() });
            buzz(14); Sfx.money(); flash(t("savedOk"));
          }}>{t("openLedger")}</button>
        </div>

        {/* ما سيدخل المركز الافتتاحي */}
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 10 }}>
            {t("openingPosition")}</div>
          <FinRow l={t("inventoryCost")} v={money(f.inventoryCost, ccy, { exact: true, fixed: true })} col={C.gold} />
          <FinRow l={t("payables")} v={money(f.payables, ccy, { exact: true, fixed: true })} col={C.red} />
          <FinRow l={t("inventoryCount")} v={f.inventoryCount} />
        </div>
      </>
    );
  }

  const TABS = [["summary", t("capital")], ["ledger", t("ledger")], ["biz", t("bizExpenses")]];

  return (
    <>
      <PageHeader title={t("capital")} lang={lang} onBack={() => go("settings")} />

      <div className="wrap-x" style={{ marginBottom: 14, justifyContent: "center" }}>
        {TABS.map(([k, lb]) => (
          <button key={k} className="chip" data-on={tab === k ? "1" : "0"}
            onClick={() => { buzz(); setTab(k); }}>{lb}</button>
        ))}
      </div>

      {tab === "summary" && (
        <>
          {/* النقد — أبرز رقمين */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div className="card" style={{ padding: 4 }}>
              <FinCard big label={t("availableCash")} value={f.availableCash} unit={U} color={C.gold} />
            </div>
            <div className="card" style={{ padding: 4 }}>
              <FinCard big label={t("spendableCash")} value={f.spendableCash} unit={U}
                color={f.spendableCash >= 0 ? C.green : C.red} />
            </div>
          </div>

          {/* ١ · رأس المال */}
          <FinGroup title={t("grpCapital")} icon="coins" accent>
            <FinRow l={t("openingCapital")} v={money(f.openingCapital, ccy, { exact: true, fixed: true })} />
            <FinRow l={t("ownerContributions")} v={money(f.ownerContributions, ccy, { exact: true, fixed: true })}
              col={C.green} />
            <FinRow l={t("ownerWithdrawals")} v={money(f.ownerWithdrawals, ccy, { exact: true, fixed: true })}
              col={C.red} />
            <FinRow l={t("openingEquity")} v={money(f.openingEquity, ccy, { exact: true, fixed: true })} col={C.ink2} />
            <FinRow strong l={t("ownerEquity")} v={money(f.ownerEquity, ccy, { exact: true, fixed: true })}
              col={C.gold} />
          </FinGroup>

          {/* ٢ · النقد */}
          <FinGroup title={t("grpCash")} icon="dollar">
            <FinRow l={t("availableCash")} v={money(f.availableCash, ccy, { exact: true, fixed: true })} col={C.gold} />
            <FinRow l={t("reserve")} v={money(f.reserveBalance, ccy, { exact: true, fixed: true })} col={C.ink2} />
            <FinRow strong l={t("spendableCash")} v={money(f.spendableCash, ccy, { exact: true, fixed: true })}
              col={f.spendableCash >= 0 ? C.green : C.red} />
          </FinGroup>

          {/* ٣ · المخزون */}
          <FinGroup title={`${t("grpInventory")} · ${f.inventoryCount}`} icon="garage">
            <FinRow strong l={t("inventoryCost")} v={money(f.inventoryCost, ccy, { exact: true, fixed: true })}
              col={C.gold} />
            <FinRow l={t("cashInInventory")} v={money(f.cashInInventory, ccy, { exact: true, fixed: true })} />
            <FinRow l={t("askingValue")} v={money(f.askingValue, ccy, { exact: true, fixed: true })} col={C.ink2} />
            <FinRow l={t("potentialProfit")} v={signed(f.potentialGrossProfit)} col={C.ink2} />
            <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 8, lineHeight: 1.7 }}>
              {lang === "ar"
                ? "قيمة الطلب والربح المحتمل خارج حقوق الملكية."
                : "Asking value and potential profit are excluded from equity."}</p>
          </FinGroup>

          {/* ٤ · الالتزامات */}
          <FinGroup title={t("grpLiabilities")} icon="clipboard">
            <FinRow l={t("vehiclePayables")} v={money(f.vehiclePayables, ccy, { exact: true, fixed: true })}
              col={f.vehiclePayables > 0 ? C.red : C.ink3} />
            <FinRow l={t("businessPayables")} v={money(f.businessPayables, ccy, { exact: true, fixed: true })}
              col={f.businessPayables > 0 ? C.red : C.ink3} />
            <FinRow l={t("depositLiability")} v={money(f.depositsHeld, ccy, { exact: true, fixed: true })}
              col={f.depositsHeld > 0 ? C.gold : C.ink3} />
            {f.partnerHeld > 0 && (
              <FinRow l={CASH_TYPES.partner_in[lang]} v={money(f.partnerHeld, ccy, { exact: true, fixed: true })}
                col={C.gold} />
            )}
            <FinRow strong l={t("totalPayables")} v={money(f.totalPayables, ccy, { exact: true, fixed: true })}
              col={f.totalPayables > 0 ? C.red : C.ink3} />
          </FinGroup>

          {/* ٥ · المبيعات */}
          <FinGroup title={t("grpSales")} icon="tag">
            <FinRow l={t("cashCollected")} v={money(f.cashCollected, ccy, { exact: true, fixed: true })} />
            <FinRow l={t("capitalRecovered")} v={money(f.capitalRecovered, ccy, { exact: true, fixed: true })} />
            <FinRow l={t("capitalToRecover")} v={money(f.capitalToRecover, ccy, { exact: true, fixed: true })}
              col={f.capitalToRecover > 0 ? C.red : C.ink3} />
            <FinRow l={t("receivables")} v={money(f.receivables, ccy, { exact: true, fixed: true })}
              col={f.receivables > 0 ? C.gold : C.ink3} />
            <FinRow strong l={t("realizedAcc")} v={signed(f.realizedProfitLedger)}
              col={f.realizedProfitLedger >= 0 ? C.green : C.red} />
            <FinRow l={t("profitInCash")} v={signed(f.profitRecoveredInCash)}
              col={f.profitRecoveredInCash > 0 ? C.green : C.ink2} />
            <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 8, lineHeight: 1.75 }}>
              {t("cashRecoveryNote")}</p>
          </FinGroup>

          {/* ٦ · النشاط */}
          <FinGroup title={t("grpBusiness")} icon="bars">
            <FinRow l={t("unrealized")} v={signed(f.unrealizedProfit)} col={C.ink2} />
            <FinRow l={t("forfeitedIncome")} v={signed(f.forfeitedIncome)}
              col={f.forfeitedIncome > 0 ? C.green : C.ink3} />
            <FinRow l={t("bizExpenses")} v={money(f.businessExpenses, ccy, { exact: true, fixed: true })}
              col={C.red} />
            <FinRow strong l={t("netBizProfit")} v={signed(f.netBusinessProfit)}
              col={f.netBusinessProfit >= 0 ? C.green : C.red} />
            {f.realizedProfitPre !== 0 && (
              <FinRow l={`${t("realizedAcc")} · ${t("preOpening")}`}
                v={signed(f.realizedProfitPre)} col={C.ink3} />
            )}
          </FinGroup>

          {/* شريط التحقق المحاسبي */}
          <div style={{ borderRadius: RD.md, padding: "12px 14px", marginBottom: 12,
            background: f.balanced ? C.greenFaint : C.redFaint,
            border: `1px solid ${f.balanced ? C.greenEdge : C.redEdge}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Ic n={f.balanced ? "check" : "x"} c={f.balanced ? C.green : C.red} s={20} />
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800,
                color: f.balanced ? C.greenHi : C.redHi }}>
                {f.balanced ? t("balanced") : t("unbalanced")}</span>
              {!f.balanced && (
                <span className="num" style={{ fontSize: 15, fontWeight: 800, color: C.red }}>
                  {signed(f.invariantDiff)}</span>
              )}
            </div>
            {!f.balanced && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
                <FinRow l={t("ownerEquity")} v={money(f.ownerEquity, ccy, { exact: true, fixed: true })} />
                <FinRow l={t("schemaCurrent")} v={money(f.expectedEquity, ccy, { exact: true, fixed: true })} />
                <FinRow strong l={t("diffAmount")} v={signed(f.invariantDiff)} col={C.red} />
              </div>
            )}
            <p style={{ fontSize: 9.5, color: C.ink3, marginTop: 8, lineHeight: 1.7 }}>
              {t("invariantNote")}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button className="btnG" onClick={() => setSheet({ type: "cash", kind: "capital_in" })}>
              + {t("addCapital")}</button>
            <button className="btnO" onClick={() => setSheet({ type: "cash", kind: "capital_out" })}>
              − {t("drawCapital")}</button>
          </div>
        </>
      )}

      {tab === "ledger" && (
        <div className="card" style={{ padding: 12 }}>
          {!f.entries.length && (
            <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "16px 0" }}>
              {t("noEntries")}</p>
          )}
          {[...f.entries].reverse().map((e) => {
            const meta = CASH_TYPES[e.type] || CASH_TYPES.adjustment_out;
            const isIn = meta.dir === "in";
            return (
              <div key={e.entryId} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  display: "grid", placeItems: "center",
                  background: isIn ? C.greenFaint : C.redFaint }}>
                  <Ic n={isIn ? "coins" : "download"} c={isIn ? C.green : C.red} s={15} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {meta[lang]}{e.note ? ` · ${e.note}` : ""}</span>
                  <span className="num" style={{ display: "block", fontSize: 9.5, color: C.ink3 }}>
                    {e.date} · {e.auto ? t("autoEntry") : t("manualEntry")}</span>
                </span>
                <span className="num" style={{ fontSize: 13.5, fontWeight: 800,
                  color: isIn ? C.green : C.red }}>
                  {isIn ? "+" : "−"}{f0(Math.abs(num(e.amount)))}</span>
                {!e.auto && (
                  <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                    onYes: () => A.dropCash(e.entryId) })} aria-label="delete"
                    style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                    <Ic n="trash" c={C.ink4} s={15} /></button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "biz" && (
        <>
          <div className="card" style={{ padding: 12, marginBottom: 12 }}>
            <FinRow strong l={t("bizExpenses")}
              v={money(f.businessExpenses, ccy, { exact: true, fixed: true })} col={C.red} />
            <FinRow l={t("businessPayables")}
              v={money(f.businessPayables, ccy, { exact: true, fixed: true })}
              col={f.businessPayables > 0 ? C.red : C.ink3} />
            <FinRow l={t("netBizProfit")} v={signed(f.netBusinessProfit)}
              col={f.netBusinessProfit >= 0 ? C.green : C.red} />
            {!(st.businessExpenses || []).length && (
              <p style={{ fontSize: 12.5, color: C.ink3, textAlign: "center", padding: "14px 0" }}>
                {t("emptyExp")}</p>
            )}
            {(st.businessExpenses || []).map((b) => (
              <div key={b.bizId} style={{ display: "flex", alignItems: "center", gap: 10,
                padding: "10px 0", borderBottom: `1px solid ${C.line}` }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  display: "grid", placeItems: "center", background: C.redFaint }}>
                  <Ic n="clipboard" c={C.red} s={15} /></span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {b.description || (BIZ_CATS[b.category] || BIZ_CATS.other)[lang]}</span>
                  <span className="num" style={{ display: "block", fontSize: 9.5, color: C.ink3 }}>
                    {b.date} · {(BIZ_CATS[b.category] || BIZ_CATS.other)[lang]}
                    {b.paid === false ? ` · ${t("notPaidYet")}` : ""}</span>
                </span>
                <span className="num" style={{ fontSize: 13.5, fontWeight: 800,
                  color: b.paid === false ? C.ink3 : C.red }}>
                  {money(num(b.amount), ccy, { exact: true, fixed: true })}</span>
                {b.receipt && <Ic n="clipboard" c={C.gold} s={13} />}
                <button onClick={() => setSheet({ type: "biz", expense: b })} aria-label="edit"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n="edit" c={C.gold} s={15} /></button>
                <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                  onYes: () => A.dropBiz(b.bizId) })} aria-label="delete"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n="trash" c={C.ink4} s={15} /></button>
              </div>
            ))}
          </div>
          <button className="btnG" onClick={() => setSheet({ type: "biz" })}>
            + {t("addBizExpense")}</button>
        </>
      )}
    </>
  );
}

/* صف بند فحص — مرفوع لمنع إعادة التركيب أثناء الكتابة */
function InspRow({ itemKey, ar, en, lang, ccy, it, onChange }) {
  const st = INSP_STATUS[it.status] || INSP_STATUS.notChecked;
  const [open, setOpen] = useState(false);
  const fileRef = useRef(null);
  const pick = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    try { onChange({ ...it, photo: await downscale(f, 900, 0.6) }); } catch {}
  };
  return (
    <div style={{ background: C.card2, border: `1px solid ${it.status === "critical"
      ? C.redEdge : C.line}`, borderRadius: RD.sm, padding: "10px 10px",
      marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 26, background: st.c, flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5,
          color: it.status === "notChecked" ? C.ink3 : C.white, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {lang === "ar" ? ar : en}</span>
        {num(it.cost) > 0 && (
          <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.red }}>
            {f0(num(it.cost))}</span>
        )}
        {it.photo && <Ic n="camera" c={C.gold} s={13} />}
        <button onClick={() => { buzz(); setOpen(!open); }} aria-label="expand"
          style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
          <Ic n={open ? "chev" : "chevR"} c={C.ink4} s={15} /></button>
      </div>

      <div className="wrap-x" style={{ marginTop: 9 }}>
        {INSP_ORDER.map((k) => {
          const on = it.status === k;
          return (
            <button key={k} onClick={() => { buzz(); onChange({ ...it, status: k }); }}
              style={{ border: `1px solid ${on ? INSP_STATUS[k].c : C.line}`,
                background: on ? `${INSP_STATUS[k].cf}` : "transparent",
                color: on ? INSP_STATUS[k].c : C.ink3, borderRadius: RD.pill,
                padding: "0 10px", minHeight: 32, cursor: "pointer",
                font: "700 10.5px inherit", display: "inline-flex", alignItems: "center" }}>
              {INSP_STATUS[k][lang]}</button>
          );
        })}
      </div>

      {open && (
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
            gap: 8 }}>
            <input className="inp ltr" type="number" inputMode="decimal" value={it.cost || ""}
              placeholder={`${CURRENCIES[ccy].ar} 0`}
              onChange={(e) => onChange({ ...it, cost: num(e.target.value) })} />
            <button onClick={() => fileRef.current?.click()} className="btnO"
              style={{ minHeight: 48, padding: "0 12px", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8 }}>
              <Ic n="camera" c={C.gold} s={15} />
              {it.photo ? "✓" : ""}</button>
            <input ref={fileRef} type="file" accept="image/*,image/heic,image/heif"
              style={{ display: "none" }} onChange={pick} />
          </div>
          <input className="inp" value={it.notes || ""}
            onChange={(e) => onChange({ ...it, notes: e.target.value })} />
          {it.photo && (
            <div style={{ position: "relative", borderRadius: RD.sm, overflow: "hidden" }}>
              <img src={it.photo} alt="" style={{ width: "100%", maxHeight: 150,
                objectFit: "cover", display: "block" }} />
              <button onClick={() => onChange({ ...it, photo: "" })}
                style={{ position: "absolute", top: 7, insetInlineEnd: 7, width: 28, height: 28,
                  borderRadius: 26, background: C.scrim, border: `1px solid ${C.line}`,
                  cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Ic n="x" c={C.white} s={13} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==================== PRE-PURCHASE INSPECTION SCREEN ===================== */
function InspectionScreen({ st, A, t, lang, ccy, go, flash, setConfirm }) {
  const U = CURRENCIES[ccy].ar;
  const [insp, setInsp] = useState(null);
  const [openSec, setOpenSec] = useState("engine");
  const list = st.inspections || [];

  const set = (k, v) => setInsp((x) => ({ ...x, [k]: v }));
  const setItem = (key, it) => setInsp((x) => ({ ...x, items: { ...x.items, [key]: it } }));
  const k = insp ? inspectionEngine(insp) : null;

  /* ---- القائمة ---- */
  if (!insp) {
    return (
      <>
        <PageHeader title={t("inspection")} lang={lang} onBack={() => go("home")} />
        <p style={{ fontSize: 11.5, color: C.ink3, textAlign: "center", marginBottom: 14 }}>
          {t("inspectionSub")}</p>

        <button className="btnG" style={{ marginBottom: 14 }}
          onClick={() => { buzz(); setInsp(mkInspection({ desiredProfit: st.settings.defaultTarget })); }}>
          + {t("newInspection")}</button>

        {!list.length && <EmptyState icon="clipboard" title={t("noInspections")} />}

        {list.map((x) => {
          const e = inspectionEngine(x);
          const v = VERDICTS[e.verdict];
          return (
            <div key={x.inspectionId} className="card" style={{ padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 800,
                    direction: "ltr", overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap" }}>
                    {x.brand || "—"} {x.model} {x.year}</span>
                  <span className="num" style={{ display: "block", fontSize: 10.5,
                    color: C.ink3, marginTop: 2 }}>
                    {String(x.createdAt).slice(0, 10)} · {e.checked}/{e.itemCount}</span>
                </span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: v.c }}>
                  {x.status === "converted" ? t("converted") : v[lang]}</span>
                <button onClick={() => { buzz(); setInsp(x); }} aria-label="open"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.gold} s={17} /></button>
                <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                  onYes: () => A.dropInspection(x.inspectionId) })} aria-label="delete"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n="trash" c={C.ink4} s={15} /></button>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 9, fontSize: 10.5 }}>
                <span style={{ color: C.ink3 }}>{t("maxBuyPrice")}{" "}
                  <span className="num" style={{ color: C.gold, fontWeight: 800 }}>
                    {f0(e.maxBuy)}</span></span>
                <span style={{ color: C.ink3 }}>{t("expectedProfit2")}{" "}
                  <span className="num" style={{ color: e.expectedProfit >= 0 ? C.green : C.red,
                    fontWeight: 800 }}>{signed(e.expectedProfit)}</span></span>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  const v = VERDICTS[k.verdict];
  const FLBL = { roi: t("fRoi"), margin: t("fMargin"), critical: t("fCritical"),
    needsRepair: t("fRepair"), repairRisk: t("fRisk"), days: t("fDays"),
    headroom: t("fHeadroom"), coverage: t("fCoverage") };

  return (
    <>
      <PageHeader title={t("inspection")} lang={lang} onBack={() => setInsp(null)} />

      {/* بيانات السيارة */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", gap: 10 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>{t("vehicleInfo2")}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8 }}>
          <SheetField label={t("brand")}>
            <input className="inp ltr" value={insp.brand} list="dl-brands"
              onChange={(e) => set("brand", e.target.value)} />
            <datalist id="dl-brands">{Object.keys(CATALOG).map((b) => <option key={b} value={b} />)}</datalist>
          </SheetField>
          <SheetField label={t("model")}>
            <input className="inp ltr" value={insp.model}
              onChange={(e) => set("model", e.target.value)} /></SheetField>
          <SheetField label={t("year")}>
            <input className="inp ltr" inputMode="numeric" value={insp.year}
              onChange={(e) => set("year", e.target.value)} /></SheetField>
          <SheetField label={t("trim")}>
            <input className="inp ltr" value={insp.trim}
              onChange={(e) => set("trim", e.target.value)} /></SheetField>
          <SheetField label={t("mileage")}>
            <input className="inp ltr" inputMode="numeric" value={insp.mileage}
              onChange={(e) => set("mileage", e.target.value)} /></SheetField>
          <SheetField label={t("origin")}>
            <div className="wrap-x">
              {[["gcc", t("gcc")], ["import", t("imported")]].map(([kk, lb]) => (
                <button key={kk} className="chip" data-on={insp.origin === kk ? "1" : "0"}
                  onClick={() => { buzz(); set("origin", kk); }}>{lb}</button>
              ))}
            </div>
          </SheetField>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8 }}>
          <SheetField label={`${t("askingPrice2")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={insp.askingPrice || ""}
              onChange={(e) => set("askingPrice", num(e.target.value))} /></SheetField>
          <SheetField label={`${t("sellerFinal")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={insp.sellerFinalPrice || ""}
              onChange={(e) => set("sellerFinalPrice", num(e.target.value))} /></SheetField>
          <SheetField label={`${t("expectedSelling")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={insp.expectedSellingPrice || ""}
              onChange={(e) => set("expectedSellingPrice", num(e.target.value))} /></SheetField>
          <SheetField label={t("expectedDays")}>
            <input className="inp ltr" type="number" inputMode="numeric" value={insp.expectedDays || ""}
              onChange={(e) => set("expectedDays", num(e.target.value))} /></SheetField>
        </div>
      </div>

      {/* قائمة الفحص */}
      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 11 }}>
          <span className="num" style={{ fontSize: 11.5, color: C.ink3 }}>
            {k.checked}/{k.itemCount} {t("checkedItems")}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 12.5, fontWeight: 800 }}>{t("checklist")}</span>
        </div>

        {INSP_SECTIONS.map((sec) => {
          const opened = openSec === sec.key;
          const secCost = sec.items.reduce((a, [key]) => a + num(inspItem(insp, key).cost), 0);
          const secCrit = sec.items.filter(([key]) => inspItem(insp, key).status === "critical").length;
          return (
            <div key={sec.key} style={{ marginBottom: 8 }}>
              <button onClick={() => { buzz(); setOpenSec(opened ? null : sec.key); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 8,
                  background: opened ? C.goldFaint : C.card2,
                  border: `1px solid ${secCrit ? C.redEdge : opened ? C.line : C.line}`,
                  borderRadius: RD.sm, padding: "12px 12px", cursor: "pointer",
                  fontFamily: "inherit", color: "inherit" }}>
                <Ic n={sec.icon} c={secCrit ? C.red : C.gold} s={17} />
                <span style={{ flex: 1, textAlign: "start", fontSize: 12.5, fontWeight: 700 }}>
                  {lang === "ar" ? sec.ar : sec.en}</span>
                {secCrit > 0 && (
                  <span className="num" style={{ fontSize: 10.5, color: C.red, fontWeight: 800 }}>
                    {secCrit} ⚠</span>
                )}
                {secCost > 0 && (
                  <span className="num" style={{ fontSize: 11.5, color: C.red, fontWeight: 800 }}>
                    {f0(secCost)}</span>
                )}
                <Ic n={opened ? "chev" : "chevR"} c={C.ink4} s={15} />
              </button>
              {opened && (
                <div style={{ marginTop: 8 }}>
                  {sec.items.map(([key, ar, en]) => (
                    <InspRow key={key} itemKey={key} ar={ar} en={en} lang={lang} ccy={ccy}
                      it={inspItem(insp, key)} onChange={(it) => setItem(key, it)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* الحساب */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <SheetField label={`${t("otherCosts")} · ${U}`}>
          <input className="inp ltr" type="number" inputMode="decimal" value={insp.otherCosts || ""}
            onChange={(e) => set("otherCosts", num(e.target.value))} />
        </SheetField>
        <div style={{ height: 12 }} />
        <FinRow l={t("askingPrice2")} v={money(k.asking, ccy, { exact: true, fixed: true })} />
        <FinRow l={t("sellerFinal")} v={money(k.negotiated, ccy, { exact: true, fixed: true })} col={C.gold} />
        <FinRow l={t("estRepairs")} v={money(k.repairsTotal, ccy, { exact: true, fixed: true })} col={C.red} />
        <FinRow l={t("otherCosts")} v={money(k.other, ccy, { exact: true, fixed: true })} col={C.red} />
        <FinRow strong l={t("totalInvestment2")} v={money(k.totalInvestment, ccy, { exact: true, fixed: true })}
          col={C.gold} />
        <FinRow l={t("expectedSelling")} v={money(k.selling, ccy, { exact: true, fixed: true })} />
        <FinRow strong l={t("expectedProfit2")} v={signed(k.expectedProfit)}
          col={k.expectedProfit >= 0 ? C.green : C.red} />
        <FinRow l={t("roiShort")} v={pct(k.roi)} col={k.roi >= 0 ? C.green : C.red} />
        <FinRow l={t("margin")} v={pct(k.margin)} col={k.margin >= 0 ? C.green : C.red} />
      </div>

      {/* أقصى سعر شراء */}
      <div className="cardG" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 9 }}>{t("desiredBy")}</div>
        <div style={{ marginBottom: 12 }}>
          <SegmentedControl value={insp.desiredMode}
            onChange={(k) => set("desiredMode", k)}
            options={[["profit", t("byProfit")], ["roi", t("byRoi")]]} />
        </div>
        {insp.desiredMode === "roi" ? (
          <SheetField label={`${t("byRoi")} %`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={insp.desiredRoi}
              onChange={(e) => set("desiredRoi", num(e.target.value))} />
          </SheetField>
        ) : (
          <SheetField label={`${t("byProfit")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={insp.desiredProfit}
              onChange={(e) => set("desiredProfit", num(e.target.value))} />
          </SheetField>
        )}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 5 }}>{t("maxBuyPrice")}</div>
          <Counter value={Math.max(0, k.maxBuy)} style={{ fontSize: 38, fontWeight: 800,
            color: C.gold, display: "block", lineHeight: 1.1, letterSpacing: "-.03em" }} />
          <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>{U}</div>
        </div>

        <div style={{ marginTop: 14, borderRadius: RD.sm, padding: "10px 12px", textAlign: "center",
          background: k.headroom >= 0 ? C.greenFaint : C.redFaint,
          border: `1px solid ${k.headroom >= 0 ? C.greenEdge : C.redEdge}`,
          fontSize: 12.5, fontWeight: 600, color: k.headroom >= 0 ? C.greenHi : C.redHi }}>
          {k.headroom >= 0
            ? <>{t("belowCeiling")} <span className="num">{f0(k.headroom)}</span> {U}</>
            : <>{t("aboveCeiling")} <span className="num">{f0(-k.headroom)}</span> {U}</>}
        </div>

        <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 10, lineHeight: 1.8,
          direction: "ltr", fontFamily: "Inter,sans-serif" }}>
          {insp.desiredMode === "roi"
            ? `Max = ${f0(k.selling)} ÷ (1 + ${num(insp.desiredRoi)}%) − ${f0(k.addedCosts)}`
            : `Max = ${f0(k.selling)} − ${f0(k.addedCosts)} − ${f0(num(insp.desiredProfit))}`}
        </p>
      </div>

      {/* التقييم */}
      <div className="card" style={{ padding: 14, marginBottom: 12,
        borderColor: `${v.ce}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ width: 12, height: 12, borderRadius: 26, background: v.c }} />
          <span style={{ flex: 1, fontSize: 17, fontWeight: 800, color: v.c }}>{v[lang]}</span>
          <span className="num" style={{ fontSize: 12.5, color: C.ink3 }}>{k.score}</span>
        </div>
        <p style={{ fontSize: 10.5, color: C.ink4, marginBottom: 12 }}>{t("recommendationOnly")}</p>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.ink2, marginBottom: 6 }}>
          {t("factors")}</div>
        {k.factors.map((fx) => (
          <div key={fx.key} style={{ display: "flex", alignItems: "center", gap: 8,
            padding: "6px 0", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ flex: 1, fontSize: 11.5, color: C.ink2 }}>{FLBL[fx.key]}</span>
            <span className="num" style={{ fontSize: 11.5, color: C.ink3 }}>{fx.detail}</span>
            <span className="num" style={{ fontSize: 11.5, fontWeight: 800, width: 30,
              textAlign: "end", color: fx.pts > 0 ? C.green : fx.pts < 0 ? C.red : C.ink4 }}>
              {fx.pts > 0 ? `+${fx.pts}` : fx.pts}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button className="btnG" onClick={() => {
          A.saveInspection({ ...insp, status: insp.status === "converted" ? "converted" : "potential" });
          buzz(14); Sfx.success(); flash(t("savedOk"));
        }}>{t("saveAsPotential")}</button>

        {insp.status !== "converted" && (
          <button className="btnO" onClick={() => setConfirm({ text: t("convertNote"),
            onYes: () => {
              A.saveInspection({ ...insp, status: "potential" });
              A.convertInspection({ ...insp, status: "potential" });
              buzz(16); Sfx.turbo(); flash(t("converted")); go("details");
            } })}>{t("convertToDeal")}</button>
        )}
      </div>
    </>
  );
}

/* ==================== VEHICLE COMPARISON SCREEN ========================== */
function CompareScreen({ st, t, lang, ccy, go }) {
  const U = CURRENCIES[ccy].ar;
  const P = useMemo(() => portfolioStats({ ...st, settings: { ...st.settings, lang } }),
    [st, lang]);
  const G = useMemo(() => globalExpenseStats(st, lang), [st, lang]);
  const [picked, setPicked] = useState(() => P.rows.slice(0, 3).map((r) => r.dealId));
  const rows = P.rows.filter((r) => picked.includes(r.dealId));

  const toggle = (id) => { buzz(); setPicked((p) =>
    (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); };

  const money2 = (v) => (v === null || v === undefined ? "—" : money(v, ccy, { exact: true, fixed: true }));
  const pct2 = (v) => (v === null || v === undefined ? "—" : pct(v));
  const days2 = (v) => (v === null || v === undefined ? "—" : String(v));

  /* أفضل قيمة في كل سطر تُبرز بالذهبي */
  const METRICS = [
    { k: "purchasePrice", l: t("purchasePrice"), f: money2 },
    { k: "totalExpenses", l: t("totalExp"), f: money2 },
    { k: "totalCost", l: t("totalCost"), f: money2, strong: true },
    { k: "sellingPrice", l: t("soldPrice"), f: money2 },
    { k: "realizedProfit", l: t("netProfit"), f: money2, best: "max", strong: true },
    { k: "roi", l: t("roiShort"), f: pct2, best: "max" },
    { k: "margin", l: t("margin"), f: pct2, best: "max" },
    { k: "holdingDays", l: t("holdingDays"), f: days2, best: "min" },
    { k: "days", l: t("daysIn"), f: days2 },
    { k: "partsCost", l: t("partsCost"), f: money2 },
    { k: "laborCost", l: t("laborCost"), f: money2 },
    { k: "paidExpenses", l: t("paidLabel"), f: money2 },
    { k: "unpaidExpenses", l: t("notPaidYet"), f: money2, best: "min" },
    { k: "topCategory", l: t("largestCat"), f: (v) => v || "—" },
    { k: "topCategoryPct", l: t("largestCatPct"), f: (v) => (v ? `${v.toFixed(1)}%` : "—") },
    { k: "avgDailyProfit", l: t("avgDaily"), f: money2, best: "max" },
  ];

  const bestOf = (m) => {
    if (!m.best) return null;
    const vals = rows.map((r) => r[m.k]).filter((v) => typeof v === "number" && Number.isFinite(v));
    if (!vals.length) return null;
    return m.best === "max" ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <>
      <PageHeader title={t("compare")} lang={lang} onBack={() => go("analytics")} />
      <p style={{ fontSize: 11.5, color: C.ink3, textAlign: "center", marginBottom: 14 }}>
        {t("compareSub")}</p>

      {/* اختيار السيارات */}
      <div className="card" style={{ padding: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.ink2, marginBottom: 9 }}>
          {t("selectCars")}</div>
        <div className="wrap-x">
          {P.rows.map((r) => (
            <button key={r.dealId} className="chip" data-on={picked.includes(r.dealId) ? "1" : "0"}
              onClick={() => toggle(r.dealId)}>
              {r.name}{r.isSold ? "" : ` · ${t("expectedOnly")}`}</button>
          ))}
        </div>
      </div>

      {rows.length < 2 ? (
        <EmptyState icon="bars" title={t("noSelection")} />
      ) : (
        <div className="card" style={{ padding: 4, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 120 + rows.length * 120 }}>
              <thead>
                <tr>
                  <th style={{ position: "sticky", insetInlineStart: 0, background: C.card,
                    zIndex: 2, padding: "12px 10px", textAlign: "start", fontSize: 10.5,
                    color: C.ink2, fontWeight: 700, borderBottom: `1px solid ${C.line}` }}>—</th>
                  {rows.map((r) => (
                    <th key={r.dealId} style={{ padding: "12px 8px", fontSize: 11.5,
                      fontWeight: 800, color: C.white, borderBottom: `1px solid ${C.line}`,
                      minWidth: 118, textAlign: "center", direction: "ltr" }}>
                      {r.name}
                      <div style={{ fontSize: 9.5, fontWeight: 600, marginTop: 3,
                        color: r.isSold ? C.green : C.ink3 }}>
                        {r.isSold ? STATUS.sold[lang] : STATUS[r.deal.status]?.[lang]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => {
                  const bv = bestOf(m);
                  return (
                    <tr key={m.k}>
                      <td style={{ position: "sticky", insetInlineStart: 0, background: C.card,
                        zIndex: 1, padding: "10px 10px", fontSize: 11.5,
                        color: m.strong ? C.white : C.ink2, fontWeight: m.strong ? 700 : 400,
                        borderBottom: `1px solid ${C.line}`, whiteSpace: "nowrap" }}>{m.l}</td>
                      {rows.map((r) => {
                        const v = r[m.k];
                        const isBest = bv !== null && typeof v === "number" && v === bv
                          && rows.length > 1;
                        return (
                          <td key={r.dealId} className="num" style={{ padding: "10px 8px",
                            textAlign: "center", fontSize: 12.5,
                            fontWeight: isBest || m.strong ? 800 : 600,
                            color: isBest ? C.gold
                              : (m.k === "realizedProfit" || m.k === "roi" || m.k === "margin")
                                && typeof v === "number"
                                ? (v >= 0 ? C.green : C.red)
                              : v === null ? C.ink4 : C.white,
                            borderBottom: `1px solid ${C.line}` }}>
                            {m.f(v)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{ fontSize: 10.5, color: C.ink4, lineHeight: 1.8, marginBottom: 14,
        textAlign: "center" }}>
        {lang === "ar"
          ? "الربح والعائد والهامش للمباعة فقط. المفتوحة تُعرض بشرطة لأن ربحها لم يتحقق."
          : "Profit, ROI and margin are shown for sold cars only. Open cars show a dash."}</p>

      {/* أين تذهب مصاريفي عبر كل السيارات */}
      {G.rows.length > 0 && (
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
            marginBottom: 12 }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 800 }}>{t("globalExpenses")}</h3>
            <Ic n="bars" c={C.gold} s={17} />
          </div>
          <div style={{ display: "flex", height: 10, borderRadius: 26, overflow: "hidden",
            background: C.hairline, marginBottom: 14 }}>
            {G.rows.map((r) => (
              <div key={r.key} className="grow" style={{ width: `${r.pct}%`, background: r.color }} />
            ))}
          </div>
          {G.rows.map((r) => (
            <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 8,
              padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ width: 9, height: 9, borderRadius: 26, background: r.color,
                flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
              <span className="num" style={{ fontSize: 9.5, color: C.ink4 }}>
                {r.cars} {t("acrossCars")}</span>
              <span className="num" style={{ fontSize: 12.5, fontWeight: 800 }}>
                {money(r.amount, ccy, { exact: true, fixed: true })}</span>
              <span className="num" style={{ fontSize: 11.5, fontWeight: 800, color: C.gold,
                width: 50, textAlign: "end" }}>{r.pct.toFixed(1)}%</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12,
            paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>{t("totalExp")}</span>
            <span className="num" style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>
              {money(G.total, ccy, { exact: true, fixed: true })}</span>
          </div>
        </div>
      )}
    </>
  );
}

/* ملخّص المحفظة — يظهر في التحليلات */
function PortfolioCard({ st, t, lang, ccy, go }) {
  const U = CURRENCIES[ccy].ar;
  const P = useMemo(() => portfolioStats({ ...st, settings: { ...st.settings, lang } }),
    [st, lang]);
  const nm = (r) => (r ? r.name : "—");

  return (
    <div className="card" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end",
        marginBottom: 12 }}>
        <h3 style={{ fontSize: 13.5, fontWeight: 800 }}>{t("portfolio")}</h3>
        <Ic n="garage" c={C.gold} s={17} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(84px,1fr))",
        gap: 8, marginBottom: 14 }}>
        {[[t("carsPurchased"), P.purchased], [t("currentInventory"), P.inventoryCount],
          [t("carsSold"), P.soldCount]].map(([l, v], i) => (
          <div key={i} style={{ background: C.card2, border: `1px solid ${C.line}`,
            borderRadius: RD.sm, padding: "10px 4px", textAlign: "center" }}>
            <div className="num" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{v}</div>
            <div style={{ fontSize: 9.5, color: C.ink3, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      <FinRow l={t("spentOnVehicles")} v={money(P.totalSpentOnVehicles, ccy, { exact: true, fixed: true })} />
      <FinRow l={t("totalExp")} v={money(P.totalExpenses, ccy, { exact: true, fixed: true })} col={C.red} />
      <FinRow l={t("totalSalesAmt")} v={money(P.totalSales, ccy, { exact: true, fixed: true })} />
      <FinRow strong l={t("realizedProfit")} v={signed(P.realizedProfit)}
        col={P.realizedProfit >= 0 ? C.green : C.red} />
      <FinRow l={t("avgProfitPer")} v={signed(P.avgProfitPerSold)}
        col={P.avgProfitPerSold >= 0 ? C.green : C.red} />
      <FinRow l={t("avgRoi")} v={pct(P.avgROI)} col={P.avgROI >= 0 ? C.green : C.red} />
      <FinRow l={t("avgHolding")} v={`${Math.round(P.avgHoldingDays)} ${t("dayUnit")}`} />

      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
        {[[t("bestDeal"), P.best, C.green], [t("worstDeal"), P.worst, C.red],
          [t("mostExpensive"), P.mostExpensive, C.gold],
          [t("highestExpenses"), P.highestExpenses, C.ink2]].map(([l, r, col], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
            background: C.card2, borderRadius: RD.sm, padding: "10px 12px" }}>
            <span style={{ fontSize: 10.5, color: C.ink2, width: 92 }}>{l}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: 700,
              direction: "ltr", overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", textAlign: "start" }}>{nm(r)}</span>
            {r && (
              <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: col }}>
                {i === 0 || i === 1 ? signed(num(r.realizedProfit))
                  : i === 2 ? f0(r.purchasePrice) : f0(r.totalExpenses)}</span>
            )}
          </div>
        ))}
      </div>

      <button className="btnO" style={{ marginTop: 14 }} onClick={() => go("compare")}>
        {t("compare")}</button>
    </div>
  );
}

/* ==================== IMPORT CALCULATOR SCREEN =========================== */
function ImportScreen({ st, A, t, lang, ccy, go, flash, setConfirm }) {
  const U = CURRENCIES[ccy].ar;
  const [imp, setImp] = useState(null);
  const list = st.imports || [];
  const set = (k2, v) => setImp((x) => ({ ...x, [k2]: v }));
  const k = imp ? importEngine(imp) : null;

  if (!imp) {
    return (
      <>
        <PageHeader title={t("importCalc")} lang={lang} onBack={() => go("home")} />
        <p style={{ fontSize: 11.5, color: C.ink3, textAlign: "center", marginBottom: 14 }}>
          {t("importSub")}</p>

        <button className="btnG" style={{ marginBottom: 14 }}
          onClick={() => { buzz(); setImp(mkImport({ desiredProfit: st.settings.defaultTarget })); }}>
          + {t("newImport")}</button>

        {!list.length && <EmptyState icon="truck" title={t("noImports")} />}

        {list.map((x) => {
          const e = importEngine(x);
          return (
            <div key={x.importId} className="card" style={{ padding: 12, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13.5, fontWeight: 800,
                    direction: "ltr", overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap" }}>
                    {x.brand || "—"} {x.model} {x.year}</span>
                  <span className="num" style={{ display: "block", fontSize: 10.5,
                    color: C.ink3, marginTop: 2 }}>
                    {x.country || "—"} · {x.currency} · {String(x.createdAt).slice(0, 10)}</span>
                </span>
                {x.status === "converted" && (
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: C.green }}>
                    {t("converted")}</span>
                )}
                <button onClick={() => { buzz(); setImp(x); }} aria-label="open"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n={lang === "ar" ? "chev" : "chevR"} c={C.gold} s={17} /></button>
                <button onClick={() => setConfirm({ text: t("confirmDeleteExp"), danger: true,
                  onYes: () => A.dropImport(x.importId) })} aria-label="delete"
                  style={{ background: "none", border: 0, cursor: "pointer", padding: 4 }}>
                  <Ic n="trash" c={C.ink4} s={15} /></button>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 9, fontSize: 10.5 }}>
                <span style={{ color: C.ink3 }}>{t("landedCost")}{" "}
                  <span className="num" style={{ color: C.gold, fontWeight: 800 }}>
                    {f0(e.landedCost)}</span></span>
                <span style={{ color: C.ink3 }}>{t("expectedProfit2")}{" "}
                  <span className="num" style={{ color: e.expectedProfit >= 0 ? C.green : C.red,
                    fontWeight: 800 }}>{signed(e.expectedProfit)}</span></span>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("importCalc")} lang={lang} onBack={() => setImp(null)} />

      {/* السيارة والشراء */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
          gap: 8 }}>
          <SheetField label={t("brand")}>
            <input className="inp ltr" value={imp.brand}
              onChange={(e) => set("brand", e.target.value)} /></SheetField>
          <SheetField label={t("model")}>
            <input className="inp ltr" value={imp.model}
              onChange={(e) => set("model", e.target.value)} /></SheetField>
          <SheetField label={t("year")}>
            <input className="inp ltr" inputMode="numeric" value={imp.year}
              onChange={(e) => set("year", e.target.value)} /></SheetField>
          <SheetField label={t("mileage")}>
            <input className="inp ltr" inputMode="numeric" value={imp.mileage}
              onChange={(e) => set("mileage", e.target.value)} /></SheetField>
          <SheetField label={t("country")}>
            <input className="inp" value={imp.country}
              onChange={(e) => set("country", e.target.value)} /></SheetField>
        </div>

        <SheetField label={t("buyCurrency")}>
          <div className="wrap-x">
            {IMPORT_CCY.map((c2) => (
              <button key={c2} className="chip" data-on={imp.currency === c2 ? "1" : "0"}
                onClick={() => { buzz(); set("currency", c2); }}>{c2}</button>
            ))}
          </div>
        </SheetField>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 8 }}>
          <SheetField label={`${t("purchasePrice")} · ${imp.currency}`}>
            <input className="inp ltr" type="number" inputMode="decimal"
              value={imp.purchasePrice || ""}
              onChange={(e) => set("purchasePrice", num(e.target.value))} /></SheetField>
          <SheetField label={`${t("exchangeRate")} · 1 ${imp.currency} = ? ${U}`}
            hint={t("rateNote")}>
            <input className="inp ltr" type="number" inputMode="decimal" step="0.0001"
              value={imp.rate || ""}
              onChange={(e) => set("rate", num(e.target.value))} /></SheetField>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card2,
          border: `1px solid ${C.line}`, borderRadius: RD.sm, padding: "12px 14px" }}>
          <span style={{ flex: 1, fontSize: 11.5, color: C.ink2 }}>{t("purchaseCostBHD")}</span>
          <span className="num" style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
            {f0(k.purchaseBHD)}</span>
        </div>
      </div>

      {/* بنود الاستيراد */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: C.gold, marginBottom: 11 }}>
          {t("importCosts")} · {U}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 8 }}>
          {IMPORT_ITEMS.map(([key, ar, en]) => (
            <SheetField key={key} label={lang === "ar" ? ar : en}>
              <input className="inp ltr" type="number" inputMode="decimal"
                value={imp[key] || ""} placeholder="0"
                onChange={(e) => set(key, num(e.target.value))} />
            </SheetField>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12,
          background: C.card2, border: `1px solid ${C.line}`, borderRadius: RD.sm,
          padding: "12px 14px" }}>
          <span style={{ flex: 1, fontSize: 11.5, color: C.ink2 }}>{t("importCosts")}</span>
          <span className="num" style={{ fontSize: 17, fontWeight: 800, color: C.red }}>
            {f0(k.importCosts)}</span>
        </div>
      </div>

      {/* التوقعات */}
      <div className="card" style={{ padding: 14, marginBottom: 12, display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 8 }}>
          <SheetField label={`${t("expectedRepairs")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal"
              value={imp.expectedRepairs || ""}
              onChange={(e) => set("expectedRepairs", num(e.target.value))} /></SheetField>
          <SheetField label={`${t("expectedSelling")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal"
              value={imp.expectedSellingPrice || ""}
              onChange={(e) => set("expectedSellingPrice", num(e.target.value))} /></SheetField>
        </div>
      </div>

      {/* النتائج */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <FinRow l={t("purchaseCostBHD")} v={money(k.purchaseBHD, ccy, { exact: true, fixed: true })} />
        <FinRow l={t("importCosts")} v={money(k.importCosts, ccy, { exact: true, fixed: true })} col={C.red} />
        <FinRow strong l={t("landedCost")} v={money(k.landedCost, ccy, { exact: true, fixed: true })}
          col={C.gold} />
        <FinRow l={t("expectedRepairs")} v={money(k.repairs, ccy, { exact: true, fixed: true })} col={C.red} />
        <FinRow strong l={t("totalInvestment2")} v={money(k.totalInvestment, ccy, { exact: true, fixed: true })}
          col={C.gold} />
        <FinRow l={t("expectedSelling")} v={money(k.selling, ccy, { exact: true, fixed: true })} />
        <FinRow strong l={t("expectedProfit2")} v={signed(k.expectedProfit)}
          col={k.expectedProfit >= 0 ? C.green : C.red} />
        <FinRow l={t("roiShort")} v={pct(k.roi)} col={k.roi >= 0 ? C.green : C.red} />
        <FinRow l={t("margin")} v={pct(k.margin)} col={k.margin >= 0 ? C.green : C.red} />
      </div>

      {/* أقصى سعر شراء */}
      <div className="cardG" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 9 }}>{t("desiredBy")}</div>
        <div style={{ marginBottom: 12 }}>
          <SegmentedControl value={imp.desiredMode}
            onChange={(k) => set("desiredMode", k)}
            options={[["profit", t("byProfit")], ["roi", t("byRoi")]]} />
        </div>
        {imp.desiredMode === "roi" ? (
          <SheetField label={`${t("byRoi")} %`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={imp.desiredRoi}
              onChange={(e) => set("desiredRoi", num(e.target.value))} /></SheetField>
        ) : (
          <SheetField label={`${t("byProfit")} · ${U}`}>
            <input className="inp ltr" type="number" inputMode="decimal" value={imp.desiredProfit}
              onChange={(e) => set("desiredProfit", num(e.target.value))} /></SheetField>
        )}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 5 }}>{t("maxBuyPrice")}</div>
          <Counter value={Math.max(0, k.maxBuyBHD)} style={{ fontSize: 30, fontWeight: 800,
            color: C.gold, display: "block", lineHeight: 1.1, letterSpacing: "-.03em" }} />
          <div style={{ fontSize: 10.5, color: C.ink3, marginTop: 3 }}>{U}</div>
          {imp.currency !== ccy && k.rate > 0 && (
            <div className="num" style={{ fontSize: 15, fontWeight: 700, color: C.ink2,
              marginTop: 8 }}>
              ≈ {f0(Math.max(0, k.maxBuyForeign))} {imp.currency}</div>
          )}
        </div>

        <div style={{ marginTop: 14, borderRadius: RD.sm, padding: "10px 12px", textAlign: "center",
          background: k.headroom >= 0 ? C.greenFaint : C.redFaint,
          border: `1px solid ${k.headroom >= 0 ? C.greenEdge : C.redEdge}`,
          fontSize: 12.5, fontWeight: 600, color: k.headroom >= 0 ? C.greenHi : C.redHi }}>
          {k.headroom >= 0
            ? <>{t("belowCeiling")} <span className="num">{f0(k.headroom)}</span> {U}</>
            : <>{t("aboveCeiling")} <span className="num">{f0(-k.headroom)}</span> {U}</>}
        </div>

        <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 10, lineHeight: 1.8,
          direction: "ltr", fontFamily: "Inter,sans-serif" }}>
          {imp.desiredMode === "roi"
            ? `Max = ${f0(k.selling)} ÷ (1 + ${num(imp.desiredRoi)}%) − ${f0(k.addedCosts)}`
            : `Max = ${f0(k.selling)} − ${f0(k.addedCosts)} − ${f0(num(imp.desiredProfit))}`}
        </p>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button className="btnG" onClick={() => {
          A.saveImport({ ...imp, status: imp.status === "converted" ? "converted" : "potential" });
          buzz(14); Sfx.success(); flash(t("savedOk"));
        }}>{t("saveAsPotential")}</button>
        {imp.status !== "converted" && (
          <button className="btnO" onClick={() => setConfirm({ text: t("convertImportNote"),
            onYes: () => {
              A.saveImport({ ...imp, status: "potential" });
              A.convertImport({ ...imp, status: "potential" });
              buzz(16); Sfx.turbo(); flash(t("converted")); go("details");
            } })}>{t("convertToDeal")}</button>
        )}
      </div>
    </>
  );
}

/* ==================== AD GENERATOR SHEET ================================= */
function AdSheet({ deal, model, st, t, lang, ccy, onClose, flash, A }) {
  const [mode, setMode] = useState("normal");
  const [adLang, setAdLang] = useState(lang);
  const text = adLang === "both"
    ? buildAdBoth(deal, model, mode, st.settings, ccy)
    : buildAd(deal, model, mode, adLang, st.settings, ccy);

  return (
    <BottomSheet title={t("adGen")} onClose={onClose}>
      <div style={{ display: "grid", gap: 12 }}>
        <SheetField label={t("adMode")}>
          <div className="wrap-x">
            {Object.keys(AD_MODES).map((k) => (
              <button key={k} className="chip" data-on={mode === k ? "1" : "0"}
                onClick={() => { buzz(); setMode(k); }}>{AD_MODES[k][lang]}</button>
            ))}
          </div>
        </SheetField>
        <SheetField label={t("adLang")}>
          <div className="wrap-x">
            {Object.keys(AD_LANGS).map((k) => (
              <button key={k} className="chip" data-on={adLang === k ? "1" : "0"}
                onClick={() => { buzz(); setAdLang(k); }}>{AD_LANGS[k][lang]}</button>
            ))}
          </div>
        </SheetField>

        <div style={{ background: C.card2, border: `1px solid ${C.line}`, borderRadius: RD.sm,
          padding: 14, whiteSpace: "pre-wrap", fontSize: 12.5, lineHeight: 2,
          maxHeight: 300, overflowY: "auto",
          direction: adLang === "en" ? "ltr" : "rtl", textAlign: "start" }}>
          {text || "—"}</div>

        <p style={{ fontSize: 10.5, color: C.ink4, lineHeight: 1.8 }}>{t("adNote")}</p>

        {/* حقول يمكن إضافتها لتحسين الإعلان */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 10 }}>
          <SheetField label={t("interiorColor")}>
            <input className="inp" value={deal.colorInterior || ""}
              onChange={(e) => A.patchDeal(deal.dealId, { colorInterior: e.target.value })} />
          </SheetField>
          <SheetField label={t("featuresLabel")}>
            <input className="inp" value={deal.features || ""}
              onChange={(e) => A.patchDeal(deal.dealId, { features: e.target.value })} />
          </SheetField>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="btnO" onClick={onClose}>{t("cancel")}</button>
        <button className="btnG" onClick={async () => {
          try { await navigator.clipboard.writeText(text); buzz(14); Sfx.success();
            flash(t("adCopied")); } catch { flash(t("errSave")); }
        }}>{t("copyAd")}</button>
      </div>
    </BottomSheet>
  );
}

/* ======================= DATA & BACKUP CENTER ============================= */
function BackupCenterScreen({ st, A, t, lang, go, flash, setConfirm }) {
  const [meta, setMeta] = useState(null);
  const [busy, setBusy] = useState(null);
  const [check, setCheck] = useState(null);   // نتيجة الفحص
  const [report, setReport] = useState(null); // تقرير بعد الاستعادة
  const [hasAuto, setHasAuto] = useState(false);
  const impRef = useRef(null);
  const verRef = useRef(null);

  useEffect(() => {
    (async () => {
      setMeta(await readBackupMeta());
      setHasAuto(!!(await readAutoBackup()));
    })();
  }, []);

  const live = countBackup(st);

  /* ---- تصدير ---- */
  const doExport = async () => {
    setBusy("export");
    try {
      const b = buildBackup(st);
      const text = JSON.stringify(b, null, 2);
      const bytes = new Blob([text]).size;
      const name = `h-car-deal-backup-${todayISO()}.json`;
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url; a.download = name; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      const m = { at: b.createdAt, size: bytes, counts: b.counts,
        schema: b.schema, appVersion: b.appVersion, name };
      await writeBackupMeta(m);
      setMeta(m);
      buzz(14); Sfx.success(); flash(t("savedOk"));
    } catch { flash(t("errSave")); Sfx.error(); }
    setBusy(null);
  };

  /* ---- فحص ملف بلا استيراد ---- */
  const doVerify = (file) => {
    if (!file) return;
    setBusy("verify"); setCheck(null);
    const r = new FileReader();
    r.onload = () => {
      const v = validateBackup(String(r.result));
      setCheck({ ...v, size: file.size, name: file.name });
      setBusy(null);
      if (v.ok) { Sfx.success(); } else { Sfx.error(); }
    };
    r.onerror = () => { setCheck({ ok: false, errs: ["bad-json"] }); setBusy(null); };
    r.readAsText(file);
  };

  /* ---- استعادة ---- */
  const doRestore = (file) => {
    if (!file) return;
    setBusy("import");
    const r = new FileReader();
    r.onload = async () => {
      const v = validateBackup(String(r.result));
      if (!v.ok) {
        setCheck({ ...v, size: file.size, name: file.name });
        setBusy(null); Sfx.error(); flash(t("fileInvalid"));
        return;
      }
      await saveAutoBackup(st);      // نسخة تلقائية قبل الاستبدال
      setHasAuto(true);
      setBusy(null);
      setConfirm({
        text: t("confirmRestore"), danger: true,
        onYes: () => {
          const next = migrateBackup(v.data, v.schema);
          A.restoreAll(next);
          setReport({ counts: countBackup(next), schema: v.schema });
          buzz(16); Sfx.money(); flash(t("restored"));
        },
      });
    };
    r.onerror = () => { setBusy(null); flash(t("errBadJson")); };
    r.readAsText(file);
  };

  const restoreAuto = async () => {
    const b = await readAutoBackup();
    if (!b) return flash(t("errCorrupt"));
    const v = validateBackup(b);
    if (!v.ok) return flash(t("errCorrupt"));
    setConfirm({ text: t("confirmRestore"), danger: true, onYes: () => {
      const next = migrateBackup(v.data, v.schema);
      A.restoreAll(next);
      setReport({ counts: countBackup(next), schema: v.schema });
      buzz(16); Sfx.money(); flash(t("restored"));
    } });
  };

  const errText = (e) => ({ "bad-json": t("errBadJson"), "not-object": t("errBadJson"),
    "not-hcardeal": t("errNotApp") }[e] || t("errCorrupt"));

  return (
    <>
      <PageHeader title={t("backupCenter")} lang={lang} onBack={() => go("settings")} />
      <p style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.8, marginBottom: 14 }}>
        {t("backupCenterSub")} · {t("autoBackupNote")}</p>

      {/* آخر نسخة */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Ic n="cloud" c={C.gold} s={20} />
          <span style={{ fontSize: 13.5, fontWeight: 800, flex: 1 }}>{t("lastBackup")}</span>
        </div>
        {meta ? (
          <>
            <BkRow l={t("backupDate")} v={String(meta.at).slice(0, 16).replace("T", " ")} />
            <BkRow l={t("backupSize")} v={humanSize(meta.size)} col={C.gold} />
            <BkRow l={t("backupSchema")} v={`v${meta.schema}`} />
            <BkRow l={t("cDeals")} v={meta.counts?.deals ?? 0} />
            <BkRow l={t("cPhotos")} v={meta.counts?.photos ?? 0} />
          </>
        ) : (
          <p style={{ fontSize: 12.5, color: C.red, textAlign: "center", padding: "10px 0" }}>
            {t("neverBackedUp")}</p>
        )}
      </div>

      {/* البيانات الحالية */}
      <div className="card" style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 2 }}>
          {t("schemaCurrent")} v{BACKUP_SCHEMA} · {APP_VERSION}</div>
        <BkCounts c={live} t={t} />
      </div>

      {/* الأزرار */}
      <button className="btnG" style={{ marginBottom: 10 }} disabled={busy === "export"}
        onClick={doExport}>
        {busy === "export" ? "…" : t("exportFull")}</button>

      <button className="btnO" style={{ marginBottom: 10 }} disabled={busy === "verify"}
        onClick={() => verRef.current?.click()}>
        {busy === "verify" ? t("verifying") : t("verifyBackup")}</button>
      <input ref={verRef} type="file" accept="application/json,.json" style={{ display: "none" }}
        onChange={(e) => { doVerify(e.target.files?.[0]); e.target.value = ""; }} />

      <button className="btnO" style={{ marginBottom: 10 }} disabled={busy === "import"}
        onClick={() => impRef.current?.click()}>
        {busy === "import" ? "…" : t("importRestore")}</button>
      <input ref={impRef} type="file" accept="application/json,.json" style={{ display: "none" }}
        onChange={(e) => { doRestore(e.target.files?.[0]); e.target.value = ""; }} />

      {hasAuto && (
        <button className="btnO" style={{ marginBottom: 10 }} onClick={restoreAuto}>
          {t("restoreAuto")}</button>
      )}

      {/* نتيجة الفحص */}
      {check && (
        <div className="card" style={{ padding: 14, marginTop: 4, marginBottom: 12,
          borderColor: check.ok ? C.greenEdge : C.redEdge }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Ic n={check.ok ? "check" : "x"} c={check.ok ? C.green : C.red} s={17} />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: check.ok ? C.green : C.red }}>
              {check.ok ? t("fileValid") : t("fileInvalid")}</span>
          </div>
          {check.name && (
            <div style={{ fontSize: 10.5, color: C.ink3, direction: "ltr", marginBottom: 8 }}>
              {check.name} · {humanSize(check.size)}</div>
          )}
          {check.ok ? (
            <>
              <BkRow l={t("fromSchema")} v={`v${check.schema}`} />
              <BkCounts c={check.counts} t={t} />
            </>
          ) : (
            <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 12.5, color: C.redHi,
              lineHeight: 2 }}>
              {(check.errs || []).map((e, i) => <li key={i}>{errText(e)}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* تقرير الاستعادة */}
      {report && (
        <div className="card" style={{ padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Ic n="check" c={C.green} s={17} />
            <span style={{ fontSize: 13.5, fontWeight: 800, color: C.green, flex: 1 }}>
              {t("restoreReport")}</span>
            <span style={{ fontSize: 10.5, color: C.ink3 }}>{t("fromSchema")} v{report.schema}</span>
          </div>
          <BkCounts c={report.counts} t={t} />
        </div>
      )}
    </>
  );
}

/* =============================== SETTINGS ================================== */
/* ==================== إدارة المستخدمين — للمالك فقط ==================== */
function UsersPanel({ account, flash, onSignOut, t, lang }) {
  const [users, setUsers] = useState(loadUsers);
  const [nu, setNu] = useState("");
  const [nn, setNn] = useState("");
  const [np, setNp] = useState("");
  const [err, setErr] = useState("");
  const isOwner = account?.role === "owner";

  const persist = (list) => { setUsers(list); saveUsers(list); };

  const add = () => {
    const u = nu.trim().toUpperCase();
    const name = nn.trim() || u;
    if (u.length < 3) return setErr("اسم المستخدم ثلاثة أحرف على الأقل");
    if (np.length < 4) return setErr("كلمة المرور أربعة أحرف على الأقل");
    if (u === OWNER.u) return setErr("هذا الاسم محجوز للمالك");
    if (users.some((x) => x.u === u)) return setErr("الاسم مستخدم بالفعل");
    persist([...users, { u, name, p: hashPw(np), at: nowISO() }]);
    setNu(""); setNn(""); setNp(""); setErr("");
    buzz(14); flash("أُضيف المستخدم");
  };

  const del = (u) => {
    persist(users.filter((x) => x.u !== u));
    buzz(14); flash("حُذف المستخدم");
  };

  const resetPw = (u) => {
    const p = prompt("كلمة المرور الجديدة لـ " + u);
    if (!p || p.length < 4) return;
    persist(users.map((x) => (x.u === u ? { ...x, p: hashPw(p) } : x)));
    buzz(14); flash("غُيّرت كلمة المرور");
  };

  const field = {
    width: "100%", minHeight: 48, borderRadius: 12, padding: "0 14px",
    background: C.card2, border: `1px solid ${C.line}`, color: C.white,
    fontSize: 15, fontFamily: "inherit", outline: "none", marginBottom: 10,
    boxSizing: "border-box", textAlign: "start",
  };

  return (
    <div className="card" style={{ padding: 15, marginBottom: 12 }}>
      {/* الحساب الحالي */}
      <div style={{ display: "flex", alignItems: "center", gap: 12,
        paddingBottom: 14, borderBottom: `1px solid ${C.line}`, marginBottom: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: C.goldGrad, display: "grid", placeItems: "center",
          color: C.onGold, fontSize: 17, fontWeight: 800 }}>
          {(account?.name || "?").charAt(0)}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 15, fontWeight: 800, color: C.white }}>
            {account?.name}</span>
          <span style={{ display: "block", fontSize: 11.5, color: C.ink3, marginTop: 2 }}>
            {isOwner ? "المالك · صلاحية كاملة" : "مستخدم"}</span>
        </span>
        <button onClick={() => { buzz(); onSignOut?.(); }}
          style={{ background: "transparent", border: `1px solid ${C.redEdge}`,
            borderRadius: 12, padding: "10px 14px", cursor: "pointer",
            color: C.red, font: "700 12px inherit" }}>خروج</button>
      </div>

      {!isOwner && (
        <p style={{ fontSize: 12, color: C.ink3, lineHeight: 1.9, textAlign: "start" }}>
          إدارة المستخدمين متاحة للمالك فقط.
        </p>
      )}

      {isOwner && (
        <>
          {/* قائمة المستخدمين */}
          <div style={{ fontSize: 12, color: C.ink3, marginBottom: 10, textAlign: "end" }}>
            المستخدمون · {users.length}
          </div>

          {users.length === 0 && (
            <p style={{ fontSize: 12.5, color: C.ink4, textAlign: "center",
              padding: "14px 0 18px", lineHeight: 1.9 }}>
              لا يوجد مستخدمون بعد.<br />أضف مستخدماً ليدخل من هذا الجهاز.
            </p>
          )}

          {users.map((x) => (
            <div key={x.u} style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: `1px solid ${C.hairline}` }}>
              <span style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: C.card2, border: `1px solid ${C.line}`,
                display: "grid", placeItems: "center", color: C.ink2,
                fontSize: 14, fontWeight: 800 }}>{x.name.charAt(0)}</span>
              <span style={{ flex: 1, minWidth: 0, textAlign: "start" }}>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 700,
                  color: C.white }}>{x.name}</span>
                <span className="num" style={{ display: "block", fontSize: 11,
                  color: C.ink4, marginTop: 2, direction: "ltr" }}>{x.u}</span>
              </span>
              <button onClick={() => resetPw(x.u)}
                style={{ background: "transparent", border: `1px solid ${C.line}`,
                  borderRadius: 10, padding: "8px 10px", cursor: "pointer",
                  color: C.ink2, font: "700 11px inherit" }}>كلمة المرور</button>
              <button onClick={() => del(x.u)} aria-label="delete"
                style={{ width: 36, height: 36, background: "transparent",
                  border: `1px solid ${C.redEdge}`, borderRadius: 10,
                  cursor: "pointer", color: C.red, fontSize: 15 }}>×</button>
            </div>
          ))}

          {/* إضافة مستخدم */}
          <div style={{ marginTop: 18, paddingTop: 16,
            borderTop: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 12, color: C.gold, marginBottom: 12,
              textAlign: "end", fontWeight: 700 }}>إضافة مستخدم</div>
            <input value={nn} onChange={(e) => setNn(e.target.value)}
              placeholder="الاسم المعروض" style={field} />
            <input value={nu} onChange={(e) => setNu(e.target.value)}
              placeholder="اسم المستخدم" autoCapitalize="characters"
              autoCorrect="off" spellCheck="false"
              style={{ ...field, direction: "ltr" }} />
            <input type="password" value={np} onChange={(e) => setNp(e.target.value)}
              placeholder="كلمة المرور" autoCorrect="off" spellCheck="false"
              style={{ ...field, direction: "ltr" }} />
            {err && <p style={{ fontSize: 11.5, color: C.red, marginBottom: 10,
              textAlign: "start" }}>{err}</p>}
            <button onClick={add} style={{ width: "100%", minHeight: 48,
              borderRadius: 12, border: 0, background: C.goldGrad, color: C.onGold,
              font: "800 13px inherit", cursor: "pointer" }}>إضافة</button>
          </div>

          <p style={{ fontSize: 10.5, color: C.ink4, marginTop: 16,
            lineHeight: 1.9, textAlign: "start" }}>
            المستخدمون محفوظون في هذا الجهاز فقط. من يفتح الرابط من جهاز آخر
            لن يرى هؤلاء المستخدمين.
          </p>
        </>
      )}
    </div>
  );
}

function SettingsScreen({ st, A, t, lang, ccy, liveDeals, setConfirm, flash, modelOf, go,
  devMode, setDevMode, account, onSignOut }) {
  const [open, setOpen] = useState(null);
  const [ask, setAsk] = useState(false);
  const [tests, setTests] = useState(null);
  const [diag, setDiag] = useState(null);
  const [paste, setPaste] = useState("");
  const [resetTxt, setResetTxt] = useState("");
  const [canInstall, setCanInstall] = useState(!!(typeof window !== "undefined" && window.__hcdInstall));
  const isIOS = typeof navigator !== "undefined"
    && /iphone|ipad|ipod/i.test(navigator.userAgent)
    && !window.matchMedia?.("(display-mode: standalone)")?.matches;
  useEffect(() => {
    const on = () => setCanInstall(true);
    window.addEventListener("hcd-installable", on);
    return () => window.removeEventListener("hcd-installable", on);
  }, []);
  const importRef = useRef(null);
  const backupRef = useRef(null);
  const tapRef = useRef(0);
  const tapTimer = useRef(null);

  const exportCSV = () => {
    const head = "deal_id,brand,model,year,trim,status,purchase,expenses,total_cost,selling,profit,roi,margin,days_held\n";
    const body = liveDeals.map((d) => {
      const m = modelOf(d), k = computeDeal(d, st.settings);
      return [d.dealId, m?.brand, m?.model, m?.year, m?.trim, d.status, k.purchasePrice,
        k.totalExpenses, k.totalCost, k.sellingPrice, k.profit.toFixed(3),
        k.roi.toFixed(2), k.margin.toFixed(2), k.daysHeld].join(",");
    }).join("\n");
    try {
      const url = URL.createObjectURL(new Blob([head + body], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = "h-car-deal-deals.csv"; a.click();
      URL.revokeObjectURL(url); buzz(14); flash(t("exportData"));
    } catch { flash(t("errSave")); }
  };

  const importLibrary = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const txt = String(r.result);
        let rows = [];
        if (file.name.endsWith(".json")) {
          const j = JSON.parse(txt);
          if (Array.isArray(j.images)) { importImageManifest(j.images); }
          rows = (Array.isArray(j) ? j : j.models || []).map((m) => mkModel(m));
        } else rows = parseModelsCSV(txt);
        if (rows.length) A.importModels(rows);
        flash(`${rows.length} ${lang === "ar" ? "موديل" : "models"}`);
      } catch { flash(t("errSave")); }
    };
    r.readAsText(file);
    e.target.value = "";
  };

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", margin: "4px 0 18px" }}>
        {t("settings")}</h2>

      <div onClick={() => {
          const c = tapRef.current + 1; tapRef.current = c;
          if (c >= 7) { const v = !devMode; setDevMode(v); Sfx.toggle(v);
            flash(v ? t("devOn") : t("devOff")); tapRef.current = 0; }
          clearTimeout(tapTimer.current);
          tapTimer.current = setTimeout(() => { tapRef.current = 0; }, 1600);
        }}
        className="card" style={{ padding: 14, marginBottom: 14, display: "flex",
        alignItems: "center", gap: 14, position: "relative", overflow: "hidden", cursor: "pointer" }}>
        <div style={{ position: "absolute", insetInlineEnd: -30, top: 20, width: 200, height: 2,
          background: `linear-gradient(90deg,transparent,${C.red})`, opacity: .5,
          transform: "rotate(-12deg)" }} />
        <div style={{ width: 74, height: 74, borderRadius: 26, flexShrink: 0, display: "grid",
          placeItems: "center", background: C.card3, border: `2px solid ${C.gold}`,
          boxShadow: "0 0 18px rgba(227,180,87,.25)" }}>
          <Ic n="user" c={C.ink2} s={38} w={1.4} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 17, fontWeight: 800 }}>
              {lang === "ar" ? "حسابي" : "My Account"}</span>
            <Ic n="crown" c={C.gold} s={15} /></div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.gold, marginTop: 3 }}>{t("premium")}</div>
          <div className="num" style={{ fontSize: 11.5, color: C.ink3, marginTop: 3, direction: "ltr" }}>
            {liveDeals.length} deals · {st.models.length} models</div>
          <div style={{ fontSize: 9.5, color: devMode ? C.gold : C.ink4, marginTop: 3 }}>
            {devMode ? t("devTools") : t("devHint")}</div>
        </div>
      </div>

      <SettingRow lang={lang} ic="user" ar="الحساب والمستخدمون" en="Account & Users"
        onClick={() => setOpen(open === "users" ? null : "users")}
        right={<span style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>
          {account?.name || ""}</span>} />
      {open === "users" && (
        <UsersPanel account={account} flash={flash} onSignOut={onSignOut}
          t={t} lang={lang} />
      )}

      <SettingRow lang={lang} ic="globe" ar={t("language")} en="Language" right={
        <span style={{ display: "flex", background: C.card2, borderRadius: 8, padding: 4,
          border: `1px solid ${C.line}` }}>
          {[["ar", "العربية"], ["en", "English"]].map(([kk, lb]) => (
            <span key={kk} onClick={(e) => { e.stopPropagation(); buzz(); A.setSetting("lang", kk); }}
              style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                cursor: "pointer", color: lang === kk ? C.gold : C.ink2,
                background: lang === kk ? "${C.goldFaint}" : "transparent" }}>{lb}</span>
          ))}
        </span>} />

      <SettingRow lang={lang} ic="dollar" ar={t("currency")} en="Currency" onClick={() => setOpen(open === "ccy" ? null : "ccy")}
        right={<span className="num" style={{ fontSize: 13.5, fontWeight: 800, color: C.gold }}>{ccy}</span>} />
      {open === "ccy" && (
        <div className="card" style={{ padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.keys(CURRENCIES).map((cc) => (
              <button key={cc} className="chip" data-on={ccy === cc ? "1" : "0"}
                onClick={() => { buzz(); A.setSetting("currency", cc); setOpen(null); }}>{cc}</button>
            ))}
          </div>
          <p style={{ fontSize: 10.5, color: C.ink3, marginTop: 10, lineHeight: 1.7 }}>
            {lang === "ar"
              ? "تغيير العملة يغيّر العرض فقط — الأرقام ما تتحوّل."
              : "Changing currency changes the display only — values are not converted."}
          </p>
        </div>
      )}

      <SettingRow lang={lang} ic="bell" ar={t("sound")} en="Sound"
        onClick={() => { const v = !(st.settings.sound !== false);
          A.setSetting("sound", v); Sfx.on = v; if (v) Sfx.toggle(true); }}
        right={<span style={{ fontSize: 12.5, fontWeight: 700,
          color: st.settings.sound !== false ? C.green : C.ink3 }}>
          {st.settings.sound !== false ? t("soundOn") : t("soundOff")}</span>} />

      {devMode && st.settings.sound !== false && (
        <div className="card" style={{ padding: 12, marginBottom: 10, display: "flex", gap: 8 }}>
          {[["turbo", "TURBO"], ["fizz", "قزوز"], ["money", "CASH"], ["success", "OK"]].map(([kk, lb]) => (
            <button key={kk} onClick={() => Sfx[kk]()} style={{ flex: 1, cursor: "pointer",
              border: `1px solid ${C.line}`, background: C.goldFaint,
              color: C.gold, borderRadius: RD.sm, padding: "10px 6px",
              font: "800 12px 'Inter',sans-serif" }}>{lb}</button>
          ))}
        </div>
      )}

      <SettingRow lang={lang} ic="truck" ar={t("importCalc")} en="Import Calculator"
        onClick={() => go("import")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {(st.imports || []).length}</span>} />

      <SettingRow lang={lang} ic="history" ar={t("agingSettings")} en="Aging thresholds"
        onClick={() => setOpen(open === "aging" ? null : "aging")} />
      {open === "aging" && (
        <div className="card" style={{ padding: 14, marginBottom: 10, display: "grid", gap: 10 }}>
          {[["fresh", t("agingFresh")], ["normal", t("agingNormal")], ["aging", t("agingOld")]]
            .map(([k2, lb]) => (
            <SheetField key={k2} label={`${lb} · ${t("dayUnit")}`}>
              <input className="inp ltr" type="number" inputMode="numeric"
                value={(st.settings.aging || AGING_DEFAULT)[k2]}
                onChange={(e) => A.setSetting("aging",
                  { ...(st.settings.aging || AGING_DEFAULT), [k2]: num(e.target.value) })} />
            </SheetField>
          ))}
          <div className="wrap-x">
            {Object.keys(AGING_BUCKETS).map((b) => (
              <span key={b} className="chip" style={{ borderColor: `${AGING_BUCKETS[b].ce}`,
                color: AGING_BUCKETS[b].c }}>{AGING_BUCKETS[b][lang]}</span>
            ))}
          </div>
        </div>
      )}

      <SettingRow lang={lang} ic="person" ar={t("myLocation")} en="Location & contact"
        onClick={() => setOpen(open === "loc" ? null : "loc")} />
      {open === "loc" && (
        <div className="card" style={{ padding: 14, marginBottom: 10, display: "grid", gap: 10 }}>
          <SheetField label={t("myLocation")} hint={t("adNote")}>
            <input className="inp" value={st.settings.location || ""}
              onChange={(e) => A.setSetting("location", e.target.value)} />
          </SheetField>
          <SheetField label={t("myContact")}>
            <input className="inp ltr" inputMode="tel" value={st.settings.contact || ""}
              onChange={(e) => A.setSetting("contact", e.target.value)} />
          </SheetField>
        </div>
      )}

      <SettingRow lang={lang} ic="clipboard" ar={t("inspection")} en="Pre-Purchase Inspection"
        onClick={() => go("inspect")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {(st.inspections || []).length}</span>} />

      <SettingRow lang={lang} ic="coins" ar={t("capital")} en="Capital & Cash Flow"
        onClick={() => go("capital")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {f0(cashEngine(st).availableCash)}</span>} />

      <SettingRow lang={lang} ic="coins" ar={t("reserve")} en="Reserve"
        onClick={() => go("reserve")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {f0(reserveSummary(st).balance)}</span>} />

      {(canInstall || isIOS) && (
        <SettingRow lang={lang} ic="download" ar={t("installApp")} en="Add to Home Screen"
          onClick={async () => {
            if (canInstall && window.__hcdInstall) {
              window.__hcdInstall.prompt();
              const r = await window.__hcdInstall.userChoice.catch(() => null);
              if (r?.outcome === "accepted") { window.__hcdInstall = null; setCanInstall(false); }
            } else { setOpen(open === "install" ? null : "install"); }
          }} />
      )}
      {open === "install" && (
        <div className="card" style={{ padding: 14, marginBottom: 10 }}>
          <p style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.9 }}>{t("installHint")}</p>
        </div>
      )}

      <SettingRow lang={lang} ic="brush" ar={t("theme")} en="Appearance"
        onClick={() => setOpen(open === "theme" ? null : "theme")}
        right={<span style={{ fontSize: 11.5, fontWeight: 700, color: C.gold }}>
          {{ system: t("themeSystem"), light: t("themeLight"),
             dark: t("themeDark") }[st.settings.theme || "system"]}</span>} />
      {open === "theme" && (
        <div className="card" style={{ padding: 14, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 4, background: C.card2, borderRadius: 12,
            padding: 4, marginBottom: 12 }}>
            {[["system", t("themeSystem")], ["light", t("themeLight")],
              ["dark", t("themeDark")]].map(([k2, lb]) => {
              const on = (st.settings.theme || "system") === k2;
              return (
                <button key={k2} onClick={() => { buzz(); A.setSetting("theme", k2); }}
                  style={{ flex: 1, border: 0, borderRadius: 8, padding: "10px 4px",
                    cursor: "pointer", font: "700 12px inherit",
                    background: on ? C.goldGrad : "transparent",
                    color: on ? C.onGold : C.ink3 }}>{lb}</button>
              );
            })}
          </div>
          <p style={{ fontSize: 10.5, color: C.ink3, lineHeight: 1.85 }}>{t("themeNote")}</p>
        </div>
      )}

      <SettingRow lang={lang} ic="brush" ar={t("appearance")} en="Display"
        right={<span style={{ fontSize: 13.5, color: C.ink2 }}>{t("dark")}</span>} />

      <SettingRow lang={lang} ic="target" ar={t("defaultTarget")} en="Default Profit Target"
        onClick={() => setOpen(open === "tgt" ? null : "tgt")}
        right={<span className="num" style={{ fontSize: 13.5, fontWeight: 800, color: C.green }}>
          +{f0(st.settings.defaultTarget)}</span>} />
      {open === "tgt" && (
        <div className="card" style={{ padding: 12, marginBottom: 10, display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 6 }}>{t("defaultTarget")}</div>
            <input className="inp ltr" type="number" value={st.settings.defaultTarget}
              onChange={(e) => A.setSetting("defaultTarget", num(e.target.value))} />
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: C.ink2, marginBottom: 6 }}>{t("quickSalePct")} %</div>
            <input className="inp ltr" type="number" value={st.settings.quickSalePct}
              onChange={(e) => A.setSetting("quickSalePct", num(e.target.value))} />
          </div>
        </div>
      )}

      <SettingRow lang={lang} ic="bell" ar={t("notifications")} en="Notifications"
        right={<span style={{ fontSize: 12.5, color: C.green, fontWeight: 700 }}>{t("enabled")}</span>} />

      <SettingRow lang={lang} ic="cloud" ar={t("backupCenter")} en="Data & Backup Center"
        onClick={() => go("backup")}
        right={<Ic n="check" c={C.green} s={15} />} />

      <SettingRow lang={lang} ic="download" ar={t("exportData")} en="Export Data (CSV)" onClick={exportCSV} />

      <SettingRow lang={lang} ic="info" ar={t("about")} en="About H CAR DEAL"
        onClick={() => setOpen(open === "about" ? null : "about")} />
      {open === "about" && (
        <div className="card" style={{ padding: 16, marginBottom: 10, textAlign: "center" }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 12 }}><Logo h={44} /></div>
          <div style={{ fontSize: 11.5, color: C.gold, letterSpacing: ".14em", direction: "ltr",
            fontFamily: "Inter,sans-serif", fontWeight: 700 }}>BUY • COST • SELL • PROFIT</div>
          <p style={{ fontSize: 12.5, color: C.ink3, marginTop: 12, lineHeight: 1.8 }}>
            {lang === "ar" ? "بياناتك محفوظة على جهازك فقط، والتطبيق يشتغل بدون إنترنت."
              : "Your data stays on your device and the app works offline."}</p>
        </div>
      )}

      {devMode && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8,
            margin: "18px 0 10px", color: C.ink3 }}>
            <span style={{ flex: 1, height: 1, background: C.line }} />
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>{t("devTools")}</span>
            <span style={{ flex: 1, height: 1, background: C.line }} />
          </div>
      <SettingRow lang={lang} ic="cloud" ar={t("imageBase")} en="Image Library Base URL"
        onClick={() => setOpen(open === "base" ? null : "base")}
        right={<span style={{ fontSize: 11.5, color: st.settings.imageBase ? C.green : C.ink4 }}>
          {st.settings.imageBase ? "●" : "—"}</span>} />
      {open === "base" && (
        <div className="card" style={{ padding: 12, marginBottom: 10 }}>
          <input className="inp ltr" value={st.settings.imageBase}
            onChange={(e) => A.setSetting("imageBase", e.target.value)}
            placeholder="https://cdn.example.com/car_images" />
          <p style={{ fontSize: 10.5, color: C.ink3, marginTop: 9, lineHeight: 1.8 }}>
            {t("imageBaseHint")}</p>
        </div>
      )}

      <SettingRow lang={lang} ic="star" ar={t("brandLogos")} en="Brand Logos" onClick={() => go("brandlogos")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {Object.keys(st.brandLogos || {}).length}</span>} />

      <SettingRow lang={lang} ic="camera" ar={t("imgLib")} en="Car Image Library"
        onClick={() => go("imglib")}
        right={<span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
          {st.models.filter((m) => resolveModelImage(m)).length}/{st.models.length}</span>} />

      <SettingRow lang={lang} ic="upload" ar={t("importLib")} en="Import Car Library (CSV / JSON)"
        onClick={() => importRef.current?.click()} />
      <input ref={importRef} type="file" accept=".csv,.json" onChange={importLibrary}
        style={{ display: "none" }} />

      <SettingRow lang={lang} ic="check" ar={t("calcTests")} en="Calculation Tests"
        onClick={() => { setTests(runCalcTests()); setOpen("tests"); }} />
      {open === "tests" && tests && (
        <div className="card" style={{ padding: 14, marginBottom: 10 }}>
          {tests.map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
              borderBottom: i < tests.length - 1 ? `1px solid ${C.line}` : 0 }}>
              <Ic n={x.ok ? "check" : "x"} c={x.ok ? C.green : C.red} s={15} />
              <span style={{ flex: 1, fontSize: 12.5, direction: "ltr", fontFamily: "Inter,sans-serif" }}>
                {x.name}</span>
              <span className="num" style={{ fontSize: 11.5, color: x.ok ? C.green : C.red }}>
                {x.got.toFixed(3)}</span>
            </div>
          ))}
          <div style={{ marginTop: 10, textAlign: "center", fontSize: 12.5,
            color: tests.every((x) => x.ok) ? C.green : C.red, fontWeight: 700 }}>
            {tests.filter((x) => x.ok).length}/{tests.length} {t("passed")}
          </div>
        </div>
      )}

      <SettingRow lang={lang} ic="check" ar={t("storageCheck")} en="Storage Check"
        onClick={async () => { setOpen("storage"); setDiag("running");
          setDiag(await storageSelfTest()); }} />
      {open === "storage" && (
        <div className="card" style={{ padding: 14, marginBottom: 10 }}>
          {diag === "running" || !diag ? (
            <p style={{ fontSize: 12.5, color: C.gold, textAlign: "center" }}>{t("running")}</p>
          ) : (
            <>
              {diag.map((x, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 0", borderBottom: i < diag.length - 1 ? `1px solid ${C.line}` : 0 }}>
                  <Ic n={x.ok ? "check" : "x"} c={x.ok ? C.green : C.red} s={15} />
                  <span style={{ flex: 1, fontSize: 12.5 }}>
                    {t({ write: "stWrite", read: "stRead", list: "stList",
                      big: "stBig", delete: "stDelete" }[x.name] || x.name)}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: x.ok ? C.green : C.red }}>
                    {x.ok ? t("stOk") : t("stFail")}</span>
                </div>
              ))}
              {diag.some((x) => !x.ok && x.why) && (
                <p style={{ fontSize: 10.5, color: C.ink3, marginTop: 8, direction: "ltr",
                  fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>
                  {diag.find((x) => !x.ok && x.why)?.why}</p>
              )}
              <p style={{ fontSize: 12.5, marginTop: 12, lineHeight: 1.8,
                color: diag.every((x) => x.ok) ? C.green : C.red, textAlign: "center" }}>
                {diag.every((x) => x.ok) ? t("stAll") : t("stNone")}</p>
            </>
          )}
        </div>
      )}

        </>
      )}

      {!ask ? (
        <SettingRow lang={lang} ic="exit" ar={t("signOut")} en="Reset Data" danger
          onClick={() => { setAsk(true); setResetTxt(""); }} />
      ) : (
        <div className="card" style={{ padding: 14, borderColor: C.redEdge }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.9, marginBottom: 12 }}>{t("confirmReset")}</p>
          <p style={{ fontSize: 11.5, color: C.ink3, marginBottom: 8 }}>{t("typeReset")}</p>
          <input className="inp ltr" value={resetTxt} placeholder="RESET"
            onChange={(e) => setResetTxt(e.target.value)} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="btnO" onClick={() => { setAsk(false); setResetTxt(""); }}>
              {t("cancel")}</button>
            <button className="btnR" disabled={resetTxt.trim().toUpperCase() !== "RESET"}
              style={{ opacity: resetTxt.trim().toUpperCase() === "RESET" ? 1 : .35 }}
              onClick={() => { A.reset(); setAsk(false); setResetTxt(""); flash(t("signOut")); }}>
              {t("signOut")}</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ==================== شاشة الدخول ==================== */
function LockScreen({ onUnlock, lang = "ar" }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);

  const submit = () => {
    const acc = authenticate(u, p);
    if (acc) {
      if (remember) saveSession({ u: acc.u });
      onUnlock(acc);
    } else {
      setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
      try { navigator.vibrate && navigator.vibrate(60); } catch {}
      setTimeout(() => setErr(""), 2600);
    }
  };

  const field = {
    width: "100%", minHeight: 52, borderRadius: 14, padding: "0 16px",
    background: "#1B1E23", border: "1px solid rgba(255,255,255,.10)",
    color: "#F3F5F8", fontSize: 16, fontFamily: "inherit", outline: "none",
    marginBottom: 12, boxSizing: "border-box", textAlign: "start",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#0B0C0E",
      display: "grid", placeItems: "center", padding: 24, overflowY: "auto",
      fontFamily: "'Cairo','Inter',system-ui,sans-serif", direction: "rtl",
      paddingTop: "calc(24px + env(safe-area-inset-top))",
    }}>
      <div style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>
        <img src={LOGO_SRC} alt="H CAR DEAL"
          style={{ width: 180, height: "auto", marginBottom: 10 }} />
        <p style={{ fontSize: 12.5, color: "#828A97", marginBottom: 28 }}>
          {greetOf("ar")} · سجّل دخولك للمتابعة
        </p>

        <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input type="text" value={u} onChange={(e) => setU(e.target.value)}
            placeholder="اسم المستخدم" autoCapitalize="characters"
            autoCorrect="off" spellCheck="false" style={field} />

          <div style={{ position: "relative", marginBottom: 16 }}>
            <input type={show ? "text" : "password"} value={p}
              onChange={(e) => setP(e.target.value)} placeholder="كلمة المرور"
              autoCorrect="off" spellCheck="false"
              style={{ ...field, marginBottom: 0, paddingInlineEnd: 52,
                borderColor: err ? "#E8493C" : "rgba(255,255,255,.10)" }} />
            <span onClick={() => setShow(!show)} role="button"
              style={{ position: "absolute", insetInlineEnd: 14, top: 0, height: 52,
                display: "grid", placeItems: "center", cursor: "pointer",
                color: "#828A97", fontSize: 11.5, fontWeight: 700 }}>
              {show ? "إخفاء" : "إظهار"}
            </span>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 9,
            marginBottom: 18, cursor: "pointer" }}>
            <span onClick={() => setRemember(!remember)} style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0,
              border: `1px solid ${remember ? "#E3B457" : "rgba(255,255,255,.22)"}`,
              background: remember ? "#E3B457" : "transparent",
              display: "grid", placeItems: "center" }}>
              {remember && <span style={{ color: "#241800", fontSize: 13,
                fontWeight: 900, lineHeight: 1 }}>✓</span>}
            </span>
            <span onClick={() => setRemember(!remember)}
              style={{ fontSize: 13, color: "#A9AEB8" }}>تذكّرني على هذا الجهاز</span>
          </label>

          <button type="submit" style={{
            width: "100%", minHeight: 54, borderRadius: 14, border: 0,
            background: "linear-gradient(150deg,#F6DE9C 0%,#E3B457 45%,#B07E23 100%)",
            color: "#241800", font: "800 15px inherit", cursor: "pointer" }}>
            دخول
          </button>
        </form>

        <div style={{ minHeight: 26, marginTop: 14 }}>
          {err && <span style={{ fontSize: 13, color: "#E8493C" }}>{err}</span>}
        </div>

        <p style={{ fontSize: 10.5, color: "#5C6371", marginTop: 20, lineHeight: 1.8 }}>
          بياناتك محفوظة في هذا الجهاز فقط ولا تُرفع إلى أي مكان
        </p>
      </div>
    </div>
  );
}

/* ============= شاشة تحية الدخول — غير شاشة الترحيب الأولى ============= */
function GreetingScreen({ account, onDone }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2300);   /* يبدأ التلاشي */
    const t2 = setTimeout(onDone, 2900);                    /* ثم يخرج */
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#0B0C0E",
      display: "grid", placeItems: "center", padding: 24,
      fontFamily: "'Cairo','Inter',system-ui,sans-serif", direction: "rtl",
      opacity: leaving ? 0 : 1,
      transform: leaving ? "scale(1.04)" : "scale(1)",
      transition: "opacity .55s ease, transform .55s ease",
    }}>
      <style>{`
        @keyframes wLogo {
          0%   { opacity: 0; transform: scale(.82); filter: blur(6px); }
          100% { opacity: 1; transform: scale(1);   filter: blur(0); }
        }
        @keyframes wUp {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes wLine {
          0%   { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes wGlow {
          0%, 100% { opacity: .16; transform: scale(1); }
          50%      { opacity: .32; transform: scale(1.10); }
        }
        .wl  { animation: wLogo .85s cubic-bezier(.2,.75,.3,1) both; }
        .w1  { animation: wUp .6s ease .55s both; }
        .w2  { animation: wUp .6s ease .78s both; }
        .w3  { animation: wLine .7s cubic-bezier(.2,.75,.3,1) 1.05s both;
               transform-origin: center; }
        .w4  { animation: wUp .6s ease 1.25s both; }
        .wg  { animation: wGlow 3.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .wl,.w1,.w2,.w3,.w4,.wg { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      <div style={{ textAlign: "center", position: "relative" }}>
        {/* توهّج ذهبي خلف الشعار */}
        <span className="wg" style={{
          position: "absolute", top: -30, insetInline: 0, height: 200,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle,#E3B457 0%,transparent 68%)",
        }} />

        <img src={LOGO_SRC} alt="H CAR DEAL" className="wl"
          style={{ width: 158, height: "auto", marginBottom: 30,
            position: "relative", zIndex: 1 }} />

        <div className="w1" style={{ fontSize: 15, color: "#828A97", marginBottom: 10 }}>
          {greetOf("ar")}
        </div>

        <div className="w2" style={{ fontSize: 32, fontWeight: 800, color: "#E3B457",
          lineHeight: 1.25, letterSpacing: "-.01em" }}>
          {account.name}
        </div>

        <div className="w3" style={{ width: 62, height: 2, borderRadius: 2,
          margin: "16px auto 14px",
          background: "linear-gradient(90deg,transparent,#E3B457,transparent)" }} />

        <div className="w4" style={{ fontSize: 12.5, color: "#5C6371" }}>
          {account.role === "owner" ? "المالك" : "مستخدم"}
        </div>
      </div>
    </div>
  );
}

/* ==================== البوابة ==================== */
function Gate() {
  const [account, setAccount] = useState(() => loadSession());
  const [greeted, setGreeted] = useState(() => !loadSession());

  if (!account) {
    return <LockScreen onUnlock={(acc) => { setAccount(acc); setGreeted(false); }} />;
  }
  if (!greeted) {
    return <GreetingScreen account={account} onDone={() => setGreeted(true)} />;
  }
  return <HCarDeal account={account} onSignOut={() => { clearSession(); setAccount(null); }} />;
}





(function mount() {
  const el = document.getElementById("root");
  const boot = document.getElementById("boot");
  if (boot) boot.remove();
  ReactDOM.createRoot(el).render(React.createElement(Gate));
})();
