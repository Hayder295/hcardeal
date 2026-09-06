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
const LOGO_SRC = "data:image/png;base64,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";
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
    addExpense: "إضافة مصروف", paidLabel: "مدفوع", dueLabel: "باقي",
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
    addExpense: "Add Expense", paidLabel: "Paid", dueLabel: "Due",
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
