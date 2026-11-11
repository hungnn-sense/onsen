#!/usr/bin/env node
// Onsen — dựng video animation (thẻ giao diện + lời dẫn) và xuất MP4 bằng HyperFrames.
// Lệnh:  node onsen-video.mjs kiem-tra | tao <ten> | dung <thu-muc> | xem <thu-muc> | xuat <thu-muc> [--nhap]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);
const HF = path.join(HERE, 'node_modules', 'hyperframes', 'bin', 'hyperframes.mjs');
const VOFF = 0.25;               // giọng bắt đầu sau 0,25 giây
const SR = 48000;

function die(msg) { console.error('✗ ' + msg); process.exit(1); }
function bins() {
  let ff = 'ffmpeg', fp = 'ffprobe';
  try { ff = require('ffmpeg-static') || ff; } catch {}
  try { fp = require('@ffprobe-installer/ffprobe').path || fp; } catch {}
  return { ff, fp };
}
const B = bins();
const ENV = { ...process.env, HYPERFRAMES_FFMPEG_PATH: B.ff, HYPERFRAMES_FFPROBE_PATH: B.fp,
  PATH: [path.dirname(B.ff), path.dirname(B.fp), process.env.PATH].join(path.delimiter) };
function run(cmd, args, opt = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', env: ENV, maxBuffer: 1 << 28, ...opt });
  if (r.error) die(`Không chạy được ${path.basename(cmd)}: ${r.error.message}`);
  return r;
}
const ff = (args) => { const r = run(B.ff, ['-hide_banner', '-y', ...args]); if (r.status) die('ffmpeg lỗi:\n' + r.stderr.slice(-1500)); return r; };
const hf = (args, opt) => run(process.execPath, [HF, ...args], { stdio: 'inherit', ...opt });
function thoiLuong(f) {
  const r = run(B.fp, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]);
  const d = parseFloat(r.stdout); if (!(d > 0)) die('Không đọc được độ dài file ' + f); return d;
}

// ---------- chữ ----------
const bo = (s) => String(s ?? '').replace(/[{}]/g, '');
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const laChu = (w) => /[\p{L}\p{N}]/u.test(w);
function tachTu(loi) {               // → [{w, k}] ; k = từ nằm trong {…} (tô màu)
  const out = []; const re = /\{([^}]*)\}|([^{}]+)/g; let m;
  while ((m = re.exec(String(loi ?? '')))) {
    const k = m[1] != null; (k ? m[1] : m[2]).split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, k }));
  }
  return out.filter((t) => laChu(t.w) || out.length === 1);
}
function chiaCum(tu) {               // cụm phụ đề ≤ 6 chữ, ngắt ở dấu câu
  const cum = []; let cur = [];
  tu.forEach((t, i) => {
    cur.push(i);
    const het = /[,.!?;:…]$/.test(t.w);
    if (cur.length >= 6 || (het && cur.length >= 3)) { cum.push(cur); cur = []; }
  });
  if (cur.length) { if (cur.length <= 2 && cum.length && cum[cum.length - 1].length <= 6) cum[cum.length - 1].push(...cur); else cum.push(cur); }
  return cum;
}
function htmlCum(tu, idx) {
  let h = '', mo = false;
  idx.forEach((i, j) => {
    const t = tu[i];
    if (t.k && !mo) { h += (j ? ' ' : '') + '<span class="k">'; mo = true; } else if (!t.k && mo) { h += '</span> '; mo = false; } else if (j) h += ' ';
    h += esc(t.w);
  });
  return h + (mo ? '</span>' : '');
}

// ---------- âm thanh: khớp lời theo khoảng lặng ----------
function chuanGiong(src, dst) {
  ff(['-i', src, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-14:TP=-1.5:LRA=11',
    '-ar', String(SR), '-ac', '2', dst]);
}
function khoangLang(f, D) {
  const r = run(B.ff, ['-hide_banner', '-i', f, '-af', 'silencedetect=noise=-35dB:d=0.2', '-f', 'null', '-']);
  const out = []; let s = null;
  for (const ln of r.stderr.split('\n')) {
    let m = ln.match(/silence_start: ([\d.]+)/); if (m) s = parseFloat(m[1]);
    m = ln.match(/silence_end: ([\d.]+)/); if (m && s != null) { out.push([s, parseFloat(m[1])]); s = null; }
  }
  return out.filter(([a, b]) => a > 0.05 && b < D - 0.05);
}
function khopGiong(dong, D, lang) {   // dong[i] = số âm tiết; trả về [[bắt đầu, kết thúc]] từng dòng + bản đồ thời gian nói
  const noi = []; let t = 0;
  for (const [a, b] of lang) { if (a > t) noi.push([t, a]); t = b; }
  if (D > t) noi.push([t, D]);
  const tong = noi.reduce((a, [x, y]) => a + y - x, 0);
  const tg = (f) => { let r = f * tong; for (const [x, y] of noi) { if (r <= y - x) return x + r; r -= y - x; } return D; };
  const C = dong.reduce((a, b) => a + b, 0), n = dong.length, k = n - 1, m = lang.length;
  const T = []; let c = 0; for (let i = 0; i < k; i++) { c += dong[i]; T.push(tg(c / C)); }
  // quy hoạch động: gán ranh giới k vào khoảng lặng j (tăng dần), ưu tiên khoảng lặng gần + dài
  const PHAT = 0.7, cost = (i, j) => Math.abs((lang[j][0] + lang[j][1]) / 2 - T[i]) - 0.5 * Math.min(lang[j][1] - lang[j][0], 0.6);
  const dp = Array.from({ length: k + 1 }, () => new Array(m + 1).fill(Infinity)), bk = Array.from({ length: k + 1 }, () => new Array(m + 1).fill(0));
  for (let j = 0; j <= m; j++) dp[0][j] = 0;
  for (let i = 1; i <= k; i++) for (let j = 0; j <= m; j++) {
    let v = dp[i - 1][j] + PHAT, b = 0;                                    // ranh giới i không gán
    if (j > 0 && dp[i][j - 1] < v) { v = dp[i][j - 1]; b = 1; }           // bỏ khoảng lặng j
    if (j > 0 && dp[i - 1][j - 1] + cost(i - 1, j - 1) < v) { v = dp[i - 1][j - 1] + cost(i - 1, j - 1); b = 2; }
    dp[i][j] = v; bk[i][j] = b;
  }
  const gan = new Array(k).fill(-1); let i = k, j = m;
  while (i > 0) { const b = bk[i][j]; if (b === 2) { gan[i - 1] = j - 1; i--; j--; } else if (b === 1) j--; else i--; }
  const kq = []; let a = 0;
  for (let q = 0; q < k; q++) { const g = gan[q]; kq.push([a, g >= 0 ? lang[g][0] : T[q]]); a = g >= 0 ? lang[g][1] : T[q]; }
  kq.push([a, D]);
  return { kq, noi };
}
function chiaAmTiet(a, b, n, noi) {   // rải n âm tiết đều trên phần thời gian có tiếng nói trong [a,b]
  const seg = noi.map(([x, y]) => [Math.max(x, a), Math.min(y, b)]).filter(([x, y]) => y - x > 0.02);
  if (!seg.length) seg.push([a, b]);
  const tong = seg.reduce((s, [x, y]) => s + y - x, 0), at = (r) => { for (const [x, y] of seg) { if (r <= y - x) return x + r; r -= y - x; } return b; };
  return Array.from({ length: n }, (_, i) => [at(tong * i / n), at(tong * (i + 1) / n)]);
}

// ---------- tiếng hiệu ứng tự tổng hợp (không cần file bản quyền) ----------
function wav(file, sec, fn) {
  const n = Math.round(sec * SR), buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1; let lp = 0;
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, fn(i / SR, rnd, (x, a) => (lp += a * (x - lp))))); buf.writeInt16LE(Math.round(v * 32000), 44 + i * 2); }
  fs.writeFileSync(file, buf);
}
const SFX = {
  whoosh: [0.6, (t, r, lp) => { const e = Math.sin(Math.PI * Math.min(1, t / 0.6)) ** 2; return lp(r(), 0.04 + 0.25 * e) * e * 1.6; }],
  tick: [0.06, (t) => Math.sin(2 * Math.PI * 2200 * t) * Math.exp(-t * 90) * 0.7],
  thud: [0.4, (t, r) => (Math.sin(2 * Math.PI * (70 + 40 * Math.exp(-t * 20)) * t) * 0.9 + r() * 0.15 * Math.exp(-t * 40)) * Math.exp(-t * 9)],
  ding: [1.0, (t) => (Math.sin(2 * Math.PI * 1320 * t) * 0.5 + Math.sin(2 * Math.PI * 1980 * t) * 0.3) * Math.exp(-t * 4.5) * Math.min(1, t * 200)],
};

// ---------- nhịp từng cảnh (một nguồn sự thật cho hình + tiếng) ----------
const kep = (v, a, b) => Math.max(a, Math.min(b, v));
function nhip(sc) {
  const { s, e } = sc, d = e - s, M = [], X = []; let C = null;
  const deu = (n, t0, span, lo, hi) => { const st = kep(span / Math.max(n, 1), lo, hi); for (let i = 0; i < n; i++) M.push(+(t0 + i * st).toFixed(3)); };
  switch (sc.kieu) {
    case 'tin-nhan': deu((sc.tin || []).length, s + 0.35, d * 0.45, 0.14, 0.5); C = sc.the_duoi ? Math.max(s + d * 0.55, (M[M.length - 1] || s) + 0.4) : null;
      M.forEach((t) => X.push(['tick', t, 0.25])); if (C && sc.the_duoi.xau) X.push(['thud', C + 0.45, 0.45]); break;
    case 'chi-so': deu(Math.min(6, (sc.o || []).length), s + 0.25, d * 0.35, 0.12, 0.18); M.forEach((t) => X.push(['tick', t, 0.3])); break;
    case 'bieu-do': { C = s + 0.35; const dur = Math.min(1.8, d * 0.6), n = Math.max(2, (sc.diem || [1, 2, 3, 4, 5]).length);
      (sc.chip || []).forEach((ch) => M.push(+(C + dur * kep(ch.i | 0, 0, n - 1) / (n - 1) + 0.1).toFixed(3))); M.forEach((t) => X.push(['tick', t, 0.3])); break; }
    case 'danh-sach': deu((sc.muc || []).length, s + 0.45, d * 0.55, 0.25, 0.7); M.forEach((t) => X.push(['tick', t, 0.3])); break;
    case 'so-sanh': { const a = (sc.trai?.muc || []).length, b = (sc.phai?.muc || []).length; C = s + d * 0.48;
      deu(a, s + 0.45, d * 0.3, 0.15, 0.45); const st = kep((e - C - 0.6) / Math.max(b, 1), 0.15, 0.45);
      for (let j = 0; j < b; j++) M.push(+(C + 0.4 + j * st).toFixed(3)); X.push(['whoosh', C, 0.2]); M.forEach((t) => X.push(['tick', t, 0.25])); break; }
    case 'cau-hoi': deu((sc.cau || []).length, s + 0.35, d * 0.55, 0.3, 0.9); M.forEach((t) => X.push(['tick', t, 0.3])); break;
    case 'dau-moc': C = s + Math.min(0.6, d * 0.3); X.push(['thud', C + 0.15, 0.6]); break;
    case 'san-pham': C = s + d * 0.62; X.push(['tick', C, 0.45]); break;
    case 'thong-bao': deu(Math.min(5, (sc.tb || []).length), s + 0.3, d * 0.5, 0.25, 0.6); M.forEach((t) => X.push(['tick', t, 0.35])); break;
    case 'ket': C = s + 0.3; X.push(['ding', C, 0.45]); break;
    case 'tieu-de': if (sc.gach) { C = s + d * 0.55; X.push(['thud', C, 0.35]); } break;
  }
  return { t_muc: M, t_chinh: C, sfx: X };
}

// ---------- phông chữ nhúng (OFL) ----------
const DAI = {
  'latin': 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF',
  'vietnamese': 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB',
};
function phongChu() {
  const out = [];
  for (const [ten, tep, w] of [['Inter', 'inter', '100 900'], ['Playfair Display', 'playfair', '400 900']])
    for (const [sub, dai] of Object.entries(DAI)) {
      const b64 = fs.readFileSync(path.join(HERE, 'fonts', `${tep}-${sub}.woff2`)).toString('base64');
      out.push(`@font-face{font-family:'${ten}';font-style:normal;font-weight:${w};font-display:block;src:url(data:font/woff2;base64,${b64}) format('woff2');unicode-range:${dai};}`);
    }
  return out.join('\n');
}
function sangHon(hex, k) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return null;
  const n = parseInt(m[1], 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (255 - v) * k));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// ---------- lệnh ----------
function docDuAn(dir) {
  const d = path.resolve(dir || '.'), f = path.join(d, 'video.json');
  if (!fs.existsSync(f)) die('Không thấy video.json trong ' + d);
  let v; try { v = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { die('video.json sai cú pháp JSON: ' + e.message); }
  if (!Array.isArray(v.canh) || !v.canh.length) die('video.json cần mảng "canh" (ít nhất 1 cảnh).');
  return { d, v };
}

function dung(dir) {
  const { d, v } = docDuAn(dir);
  const am = path.join(d, 'am-thanh'); fs.mkdirSync(am, { recursive: true });
  const canh = v.canh.map((c) => ({ ...c }));
  const coLoi = canh.map((c) => !!bo(c.loi).trim());
  const iCuoi = coLoi.lastIndexOf(true);
  if (iCuoi < 0) die('Chưa cảnh nào có "loi".');
  if (coLoi.slice(0, iCuoi).some((x) => !x)) die('Chỉ các cảnh CUỐI (vd "ket") được để trống "loi". Cảnh giữa cần có lời.');
  const tu = canh.map((c) => tachTu(c.loi)), soAm = tu.map((t) => t.length);
  canh.forEach((c, i) => { if (coLoi[i] && !soAm[i]) die(`Cảnh ${i + 1}: "loi" không có chữ.`); });

  // 1) mốc thời gian từng âm tiết
  let amTiet = [], doanLoi = [], giong = null, cuoiNoi;
  const nLoi = iCuoi + 1;
  if (v.giong) {
    const src = path.resolve(d, v.giong); if (!fs.existsSync(src)) die('Không thấy file giọng: ' + v.giong);
    giong = path.join(am, 'giong.wav'); chuanGiong(src, giong);
    const D = thoiLuong(giong), lang = khoangLang(giong, D);
    const { kq, noi } = khopGiong(soAm.slice(0, nLoi), D, lang);
    doanLoi = kq.map(([a, b]) => [a + VOFF, b + VOFF]);
    amTiet = kq.map(([a, b], i) => chiaAmTiet(a, b, soAm[i], noi).map(([x, y]) => [x + VOFF, y + VOFF]));
    cuoiNoi = D + VOFF;
    console.log(`• Giọng: ${D.toFixed(1)} giây, ${lang.length} khoảng ngắt; ${nLoi} câu.`);
  } else {
    const r = v.toc_do_doc || 4.2; let t = 0.4;
    for (let i = 0; i < nLoi; i++) {
      const len = Math.max(2.2, soAm[i] / r); doanLoi.push([t, t + len]);
      amTiet.push(Array.from({ length: soAm[i] }, (_, k) => [t + (len * k) / soAm[i], t + (len * (k + 1)) / soAm[i]]));
      t += len + 0.45;
    }
    cuoiNoi = t - 0.45;
    console.log(`• Chưa có giọng: ước ${cuoiNoi.toFixed(1)} giây theo tốc độ ${r} âm tiết/giây.`);
  }

  // 2) mốc cảnh
  for (let i = 0; i < nLoi; i++) canh[i].s = i === 0 ? 0 : +(doanLoi[i][0] - 0.12).toFixed(3);
  for (let i = 0; i < nLoi; i++) canh[i].e = i < nLoi - 1 ? canh[i + 1].s : +(cuoiNoi + 0.5).toFixed(3);
  let t = canh[nLoi - 1].e;
  for (let i = nLoi; i < canh.length; i++) { canh[i].s = t; t += canh[i].thoi_luong || (canh[i].kieu === 'ket' ? 3.2 : 2.5); canh[i].e = +t.toFixed(3); }
  const TONG = +canh[canh.length - 1].e.toFixed(3);

  // 3) phụ đề
  const caps = [];
  for (let i = 0; i < nLoi; i++) for (const idx of chiaCum(tu[i]))
    caps.push({ s: +amTiet[i][idx[0]][0].toFixed(3), e: +amTiet[i][idx[idx.length - 1]][1].toFixed(3), h: htmlCum(tu[i], idx) });

  // 4) nhịp + hiệu ứng âm thanh
  const MAC_DINH_TOI = { 'so-lon': 'toi', ket: 'toi' };
  const sfx = [];
  canh.forEach((c, i) => {
    c.nen = c.nen || MAC_DINH_TOI[c.kieu] || 'sang';
    if (c.kieu === 'chi-so' && c.minh_hoa == null) c.minh_hoa = (c.o || []).some((o) => typeof o.gia_tri === 'number' || /\d/.test(String(o.gia_tri ?? '')));
    if (c.kieu === 'bieu-do' && c.minh_hoa == null) c.minh_hoa = true;
    const n = nhip(c); c.t_muc = n.t_muc; c.t_chinh = n.t_chinh; sfx.push(...n.sfx);
    if (i > 0) sfx.push(['whoosh', Math.max(0, c.s - 0.15), 0.3]);
  });
  for (const [ten, [sec, fn]] of Object.entries(SFX)) { const f = path.join(am, `sfx-${ten}.wav`); if (!fs.existsSync(f)) wav(f, sec, fn); }

  // 5) nhạc nền (của Sếp, có bản quyền) — lặp đủ dài, mờ đầu/cuối, nhỏ hơn giọng
  let nhac = null;
  if (v.nhac) {
    const src = path.resolve(d, v.nhac); if (!fs.existsSync(src)) die('Không thấy file nhạc: ' + v.nhac);
    nhac = path.join(am, 'nhac.wav');
    ff(['-stream_loop', '-1', '-i', src, '-t', String(TONG), '-af', `loudnorm=I=${giong ? -30 : -18},afade=t=in:d=1,afade=t=out:st=${Math.max(0, TONG - 1.5).toFixed(2)}:d=1.5`, '-ar', String(SR), '-ac', '2', nhac]);
  }

  // 6) ảnh
  const th = { ...(v.thuong_hieu || {}) };
  const kiemAnh = (p, ten) => { if (p && !fs.existsSync(path.resolve(d, p))) { console.warn(`! Không thấy ${ten}: ${p} — bỏ qua.`); return ''; } return p || ''; };
  th.logo = kiemAnh(th.logo, 'logo');
  canh.forEach((c) => { if (c.anh) c.anh = kiemAnh(c.anh, 'ảnh sản phẩm'); });
  const chinh = /^#[0-9a-f]{6}$/i.test(th.mau_chinh || '') ? th.mau_chinh : (v.phong_cach === 'sang-trong' ? '#9A7B4F' : '#2563EB');
  const phu = /^#[0-9a-f]{6}$/i.test(th.mau_phu || '') ? th.mau_phu : sangHon(chinh, 0.35);

  // 7) ghép index.html cho HyperFrames
  const aud = [];
  if (giong) aud.push(`<audio id="giong" src="am-thanh/giong.wav" data-start="${VOFF}" data-duration="${(thoiLuong(giong)).toFixed(3)}" data-volume="1"></audio>`);
  if (nhac) aud.push(`<audio id="nhac" src="am-thanh/nhac.wav" data-start="0" data-duration="${TONG}" data-volume="1"></audio>`);
  sfx.filter(([, t0]) => t0 < TONG - 0.1).sort((a, b) => a[1] - b[1]).forEach(([n, t0, vol], i) =>
    aud.push(`<audio id="sfx${i}" src="am-thanh/sfx-${n}.wav" data-start="${t0.toFixed(3)}" data-duration="${SFX[n][0]}" data-volume="${vol}"></audio>`));
  const data = { phong_cach: v.phong_cach === 'sang-trong' ? 'sang-trong' : 'hien-dai', mau: { chinh, phu }, thuong_hieu: th, tong: TONG, canh, caps };
  const js = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
  const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>${esc(v.ten || 'Video animation')}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<style>
${phongChu()}
${fs.readFileSync(path.join(HERE, 'runtime', 'giao-dien.css'), 'utf8')}
</style></head><body>
<div id="root" data-composition-id="root" data-width="1080" data-height="1920" data-start="0" data-duration="${TONG}">
  <div id="nenSang"></div><div id="nenToi"></div>
  <div id="canh"></div><div id="nhan"></div><div id="phude"></div>
  ${aud.join('\n  ')}
</div>
<script>window.ONSEN=${js(data)};</script>
<script>
${fs.readFileSync(path.join(HERE, 'runtime', 'dong-co.js'), 'utf8')}
</script>
</body></html>`;
  fs.writeFileSync(path.join(d, 'index.html'), html);
  fs.writeFileSync(path.join(d, 'moc-thoi-gian.json'), JSON.stringify({ tong: TONG, canh: canh.map((c, i) => ({ canh: i + 1, kieu: c.kieu, s: c.s, e: c.e, loi: bo(c.loi) })) }, null, 1));
  console.log(`✓ Đã dựng ${path.join(d, 'index.html')} — ${canh.length} cảnh, ${caps.length} cụm phụ đề, ${TONG.toFixed(1)} giây.`);
  return { d, canh, TONG };
}

function xem(dir) {
  const { d, canh } = dung(dir);
  const at = canh.map((c) => +((c.s + c.e) / 2 + 0.2).toFixed(2)).join(',');
  const out = path.join(d, 'xem-truoc');
  const r = hf(['snapshot', d, '--at', at, '--no-end', '--output', out]);
  if (r.status) die('Chụp khung hình lỗi.');
  console.log(`✓ Ảnh xem trước từng cảnh: ${out}`);
}

function xuat(dir, nhap) {
  const { d } = dung(dir);
  if (hf(['lint', d]).status) die('Kiểm tra (lint) báo lỗi — xem ở trên.');
  const ten = (JSON.parse(fs.readFileSync(path.join(d, 'video.json'), 'utf8')).ten || path.basename(d)).replace(/[^\p{L}\p{N}_-]+/gu, '-');
  const out = path.join(d, `${ten}${nhap ? '-nhap' : ''}.mp4`);
  const r = hf(['render', d, '--output', out, '--quality', nhap ? 'draft' : 'looks', '--fps', '30']);
  if (r.status) die('Render lỗi — xem log ở trên.');
  console.log(`✓ Video: ${out}`);
}

function kiemTra() {
  const v = +process.versions.node.split('.')[0];
  console.log(`${v >= 22 ? '✓' : '✗'} Node ${process.versions.node}${v >= 22 ? '' : ' — cần Node 22 trở lên'}`);
  if (!fs.existsSync(HF)) die('Chưa cài thư viện. Chạy: cd cong-cu/video-animation && npm install');
  for (const [ten, b] of [['ffmpeg', B.ff], ['ffprobe', B.fp]]) {
    const r = spawnSync(b, ['-version'], { encoding: 'utf8' });
    console.log(r.status === 0 ? `✓ ${ten}: ${r.stdout.split('\n')[0].slice(0, 60)}` : `✗ ${ten} không chạy được (${b})`);
  }
  const r = hf(['browser', 'ensure'], { stdio: 'pipe' });
  console.log(r.status === 0 ? '✓ Trình duyệt render: sẵn sàng' : '✗ Không tải được trình duyệt render:\n' + (r.stderr || r.stdout));
}

function tao(ten) {
  if (!ten) die('Cần tên dự án, vd: node onsen-video.mjs tao nen-thom-thang-11');
  const slug = ten.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const d = path.join(REPO, 'brain-template', 'ket-qua', 'video', slug);
  if (fs.existsSync(path.join(d, 'video.json'))) die('Dự án đã có: ' + d);
  fs.mkdirSync(d, { recursive: true });
  const mau = JSON.parse(fs.readFileSync(path.join(HERE, 'mau', 'video.json'), 'utf8')); mau.ten = slug;
  fs.writeFileSync(path.join(d, 'video.json'), JSON.stringify(mau, null, 2));
  console.log('✓ Tạo dự án: ' + d);
}

const [cmd, arg, ...rest] = process.argv.slice(2);
({ 'kiem-tra': kiemTra, tao: () => tao(arg), dung: () => dung(arg), xem: () => xem(arg), xuat: () => xuat(arg, rest.includes('--nhap')) }[cmd]
  || (() => console.log('Lệnh: kiem-tra | tao <ten> | dung <thu-muc> | xem <thu-muc> | xuat <thu-muc> [--nhap]')))();
