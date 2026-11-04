(function () {
'use strict';
var TZ = 'America/Los_Angeles', OPEN = 8, CLOSE = 20, MIN_BOOK = 30, YMIN = 2026, YMAX = 2035;
var ALLOWED_LD = [5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28];
var GOOD_SIGNS = [1, 4, 5, 6, 9];          // Taurus Leo Virgo Libra Capricorn (Capricorn only while waxing)
var SIGNS = {
  ru: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'],
  en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
};
var T = {
  ru: {
    loc: 'ru-RU', next: 'Следующее хорошее время', now: 'Сейчас хорошее время', until: 'до', none: 'Окон в выбранном периоде нет',
    growth: 'Рост', trim: 'Подрезка', moonIn: 'Луна в знаке', ldn: 'лунный день', book: 'Запись в салон', full: 'полное окно',
    add: 'Добавить в календарь', ics: 'Скачать .ics', show: 'Показать день', cal: 'Календарь', day: 'День', up: 'Ближайшие окна',
    today: 'Сегодня', legGood: 'хорошее время', legBad: 'лучше не стричься', legToday: 'сегодня',
    goodV: 'Хорошее время для записи', badV: 'Лучше не стричься', neutV: 'Окон нет, день нейтральный',
    ld: 'Лунный день (в полдень)', sign: 'Знак Луны', phase: 'Фаза', wax: 'растёт', wan: 'убывает', rahu: 'Раху-кала', voc: 'Луна без курса',
    salon: 'часы салона', tlRahu: 'Раху-кала', tlVoc: 'Луна без курса', none2: 'нет',
    rSun: 'Воскресенье исключено.', rLd: function (n) { return 'Лунный день ' + n + ' не входит в список подходящих (5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28).'; },
    rSign: function (s) { return 'Луна в знаке «' + s + '» не подходит для этой фазы.'; },
    rCut: 'Знак и лунный день подходят, но окно закрыто Луной без курса или Раху-калой, либо лунный день сменился.',
    rBad: function (n) { return 'Лунный день ' + n + ': метод календаря не пускает этот день, тибетский текст называет его плохим.'; },
    rBadSun: 'Воскресенье: календарь исключает его, индийский текст тоже считает плохим.',
    hHow: 'Как это считается и чему можно верить',
    how: '<p>Окна считаются по правилам, которые я восстановил по опубликованным окнам русского лунного календаря стрижек (совпадение с ними до 1-2 минут в 14 городах).</p><ul><li>Лунный день отсчитывается от восхода Луны в Лос-Анджелесе. Подходят дни 5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28.</li><li>Луна в знаке Телец, Лев, Дева или Весы. При растущей Луне подходит и Козерог.</li><li>Растущая Луна: «рост». Убывающая: «подрезка».</li><li>Из окон вычитаются Луна без курса, Раху-кала (индийский неблагоприятный отрезок дня) и воскресенье.</li><li>Красным отмечены лунные дни 1, 2, 6, 7, 12, 20, 29 и воскресенья: их исключает календарь, и тибетский (и для воскресенья индийский) текст называет их плохими.</li></ul><p><b>Чему верить.</b> Расчёт времени точный. Пользу для волос никто не доказал: научных данных о влиянии Луны на рост волос нет. Это традиция, где разные школы расходятся (например, знаки Луны у европейских астрологов XVII века почти противоположны). Регулярная стрижка секущихся концов полезнее выбора дня.</p>',
    foot: 'Расчёт для Лос-Анджелеса, время тихоокеанское. Метод собран из публично опубликованных русских лунных календарей стрижек. Независимый проект. Не медицинская рекомендация.',
    offline: 'Не удалось загрузить данные. Проверьте соединение и обновите страницу.', outRange: 'Данные есть с ноября 2026 по декабрь 2035.',
    wd: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  },
  en: {
    loc: 'en-US', next: 'Next good time', now: 'Good time right now', until: 'until', none: 'No windows in this period',
    growth: 'Growth', trim: 'Trim', moonIn: 'Moon in', ldn: 'lunar day', book: 'Salon booking', full: 'full window',
    add: 'Add to calendar', ics: 'Download .ics', show: 'Show day', cal: 'Calendar', day: 'Day', up: 'Coming up',
    today: 'Today', legGood: 'good time', legBad: 'better not to cut', legToday: 'today',
    goodV: 'Good time to book', badV: 'Better not to cut hair', neutV: 'No windows, neutral day',
    ld: 'Lunar day (at noon)', sign: 'Moon sign', phase: 'Phase', wax: 'waxing', wan: 'waning', rahu: 'Rahu Kala', voc: 'Void of course Moon',
    salon: 'salon hours', tlRahu: 'Rahu Kala', tlVoc: 'Void of course', none2: 'none',
    rSun: 'Sunday is excluded.', rLd: function (n) { return 'Lunar day ' + n + ' is not on the allowed list (5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28).'; },
    rSign: function (s) { return 'Moon in ' + s + ' does not fit this phase.'; },
    rCut: 'Sign and lunar day fit, but the window is closed by a void-of-course Moon or Rahu Kala, or the lunar day changed.',
    rBad: function (n) { return 'Lunar day ' + n + ': the calendar method excludes it and the Tibetan text calls it bad.'; },
    rBadSun: 'Sunday: the calendar excludes it and the Indian text also calls it bad.',
    hHow: 'How it is calculated and what to trust',
    how: '<p>Windows follow rules I reconstructed from the published windows of a Russian lunar haircut calendar (matches them within 1-2 minutes in 14 cities).</p><ul><li>The lunar day counts from moonrise in Los Angeles. Days 5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28 qualify.</li><li>Moon in Taurus, Leo, Virgo or Libra. Capricorn also qualifies while the Moon is waxing.</li><li>Waxing Moon: "growth". Waning Moon: "trim".</li><li>Void-of-course Moon, Rahu Kala (an Indian inauspicious part of the day) and Sundays are subtracted.</li><li>Red marks lunar days 1, 2, 6, 7, 12, 20, 29 and Sundays: the calendar excludes them and a Tibetan text (and, for Sunday, an Indian text) calls them bad.</li></ul><p><b>What to trust.</b> The timing is exact. Nobody has shown a benefit for hair: there is no scientific evidence that the Moon affects hair growth. It is a tradition and its schools disagree (for example, 17th-century European astrologers recommend nearly the opposite Moon signs). Regular trims of split ends matter more than the choice of day.</p>',
    foot: 'Calculated for Los Angeles, Pacific time. Method assembled from publicly published Russian lunar haircut calendars. Independent project. Not medical advice.',
    offline: 'Could not load the data. Check your connection and reload.', outRange: 'Data covers November 2026 to December 2035.',
    wd: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
};
var lang = 'ru';
try { lang = localStorage.getItem('hm-lang') || (/^ru|^uk|^be/.test(navigator.language || '') ? 'ru' : 'en'); } catch (e) { lang = 'ru'; }
function t() { return T[lang]; }

/* ---------- time in Los Angeles ---------- */
var F = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
function parts(min) { var o = {}; F.formatToParts(new Date(min * 60000)).forEach(function (p) { o[p.type] = p.value; }); return o; }
function offset(min) { var p = parts(min); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) / 60000 - min; }
function midnight(key) { var a = key.split('-').map(Number), base = Date.UTC(a[0], a[1] - 1, a[2]) / 60000, g = base - offset(base); return base - offset(g); }
function keyOf(min) { var p = parts(min); return p.year + '-' + p.month + '-' + p.day; }
function addDays(key, n) { var a = key.split('-').map(Number), d = new Date(Date.UTC(a[0], a[1] - 1, a[2] + n)); return d.toISOString().slice(0, 10); }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function clock(min) {
  var p = parts(min), h = +p.hour % 24, m = +p.minute;
  if (lang === 'ru') return pad(h) + ':' + pad(m);
  return ((h + 11) % 12 + 1) + ':' + pad(m) + ' ' + (h < 12 ? 'AM' : 'PM');
}
function dateLabel(key, opts) { var a = key.split('-').map(Number); return new Date(Date.UTC(a[0], a[1] - 1, a[2], 12)).toLocaleDateString(t().loc, Object.assign({ timeZone: 'UTC' }, opts)); }
function weekday(key) { var a = key.split('-').map(Number); return (new Date(Date.UTC(a[0], a[1] - 1, a[2])).getUTCDay() + 6) % 7; }   // 0 = Monday

/* ---------- data ---------- */
var cache = {};
function load(y) {
  if (y < YMIN || y > YMAX) return Promise.resolve(null);
  if (!cache[y]) cache[y] = fetch('data/la-' + y + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    d.by = {}; d.days.forEach(function (a) { d.by[a[0]] = { ld: a[1], sign: a[2], waxing: a[3], illum: a[4], rahu: [a[5], a[6]] }; }); return d;
  });
  return cache[y];
}
function around(y) {
  return Promise.all([load(y - 1), load(y), load(y + 1)]).then(function (r) {
    var s = { good: [], avoid: [], voc: [], by: {} };
    r.forEach(function (d) { if (!d) return; s.good = s.good.concat(d.good); s.avoid = s.avoid.concat(d.avoid); s.voc = s.voc.concat(d.voc); Object.assign(s.by, d.by); });
    return s;
  });
}
function bookable(w) {   // w = [s,e,mode,ld,sign] -> list of [s,e] inside salon hours
  var out = [], key = keyOf(w[0]), last = keyOf(w[1] - 1);
  for (;;) {
    var ms = midnight(key), a = Math.max(w[0], ms + OPEN * 60), b = Math.min(w[1], ms + CLOSE * 60);
    if (b - a >= MIN_BOOK) out.push([a, b]);
    if (key >= last) break; key = addDays(key, 1);
  }
  return out;
}
function overlap(list, ms, me) {
  var o = [];
  list.forEach(function (x) { var s = Math.max(x[0], ms), e = Math.min(x[1], me); if (e > s) o.push({ s: s, e: e, x: x }); });
  return o;
}

/* ---------- moon glyph ---------- */
function moon(illum, waxing, size) {
  var r = 15, f = illum / 100, rx = Math.abs(1 - 2 * f) * r, sweep = (f < 0.5) ? 0 : 1;
  var d = 'M16 1 A15 15 0 0 1 16 31 A' + rx.toFixed(2) + ' 15 0 0 ' + sweep + ' 16 1 Z';
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-opacity=".35"/><path d="' + d + '" fill="#e9e2cf" ' + (waxing ? '' : 'transform="translate(32 0) scale(-1 1)"') + '/></svg>';
}

/* ---------- state ---------- */
var $ = function (id) { return document.getElementById(id); };
var now = Math.floor(Date.now() / 60000), todayKey = keyOf(now);
var view = { y: +todayKey.slice(0, 4), m: +todayKey.slice(5, 7) }, sel = todayKey;
if (view.y < YMIN || (view.y === YMIN && view.m < 11)) { view.y = YMIN; view.m = 11; sel = '2026-11-05'; }
if (view.y > YMAX) { view.y = YMAX; view.m = 12; sel = YMAX + '-12-15'; }

function ldText(n) { return lang === 'ru' ? n + '-й лунный день' : 'lunar day ' + n; }
function modeName(m) { return m === 0 ? t().growth : t().trim; }

/* ---------- hero + upcoming ---------- */
function renderHero() {
  var hero = $('hero');
  var y0 = Math.min(Math.max(+todayKey.slice(0, 4), YMIN), YMAX);
  return Promise.all([around(y0), around(Math.min(y0 + 1, YMAX))]).then(function (r) {
    var pieces = [];
    var seen = {};
    r.forEach(function (s) { s.good.forEach(function (w) { if (seen[w[0]]) return; seen[w[0]] = 1; bookable(w).forEach(function (p) { pieces.push({ s: p[0], e: p[1], w: w }); }); }); });
    pieces.sort(function (a, b) { return a.s - b.s; });
    var upc = pieces.filter(function (p) { return p.e > now; });
    var first = upc[0];
    if (!first) { hero.className = 'hero'; hero.innerHTML = '<div class="msg">' + t().none + '</div>'; $('upcoming').innerHTML = ''; return; }
    var inside = first.s <= now;
    var key = keyOf(first.s);
    hero.className = 'hero' + (inside ? ' now' : '');
    var w = first.w, sg = SIGNS[lang][w[4]];
    var head = inside ? t().now + ' ' + t().until + ' ' + clock(first.e) : dateLabel(key, { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + clock(first.s) + ' - ' + clock(first.e);
    hero.innerHTML = '<div class="kicker">' + (inside ? t().now : t().next) + '</div><h1>' + head + '</h1>' +
      '<p class="sub">' + modeName(w[2]) + ' &middot; ' + t().moonIn + ' ' + sg + ' &middot; ' + ldText(w[3]) + '<br>' + t().full + ': ' + clock(w[0]) + ' - ' + clock(w[1]) + '</p>' +
      '<div class="actions"><a class="btn" id="sub" href="la.ics">' + t().add + '</a><button class="btn ghost" id="showDay" type="button">' + t().show + '</button></div>';
    var h = location.protocol.indexOf('http') === 0 && !/^(localhost|127\.|\[::1\])/.test(location.hostname);
    if (h) $('sub').href = 'webcal://' + location.host + location.pathname.replace(/[^\/]*$/, '') + 'la.ics';
    else $('sub').setAttribute('download', 'hairy-moon-la.ics');
    $('showDay').onclick = function () { goto(key); };
    $('upcoming').innerHTML = upc.slice(0, 8).map(function (p) {
      var k = keyOf(p.s);
      return '<li data-k="' + k + '" tabindex="0"><span class="d">' + dateLabel(k, { weekday: 'short', day: 'numeric', month: 'short' }) + '<span class="badge">' + modeName(p.w[2]) + '</span></span><span class="t">' + clock(p.s) + ' - ' + clock(p.e) + '</span><span class="m">' + t().moonIn + ' ' + SIGNS[lang][p.w[4]] + ' &middot; ' + ldText(p.w[3]) + '</span></li>';
    }).join('');
    Array.prototype.forEach.call($('upcoming').children, function (li) {
      var go = function () { goto(li.getAttribute('data-k')); };
      li.onclick = go; li.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
  }).catch(function () { hero.innerHTML = '<div class="msg">' + t().offline + '</div>'; });
}

/* ---------- month grid ---------- */
function status(key, s) {
  var ms = midnight(key), me = midnight(addDays(key, 1));
  var g = 0; s.good.forEach(function (w) { bookable(w).forEach(function (p) { var a = Math.max(p[0], ms), b = Math.min(p[1], me); if (b > a) g += b - a; }); });
  var bad = 0; overlap(s.avoid, ms, me).forEach(function (o) { bad += o.e - o.s; });
  return { good: g >= MIN_BOOK, bad: bad >= 12 * 60 };
}
function renderMonth() {
  var y = view.y, m = view.m;
  var mt = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(t().loc, { month: 'long', year: 'numeric', timeZone: 'UTC' }).replace(/\s*г\.$/, '');
  $('mtitle').textContent = mt.charAt(0).toUpperCase() + mt.slice(1);
  $('prev').disabled = (y === YMIN && m <= 11); $('next').disabled = (y === YMAX && m >= 12);
  $('dows').innerHTML = t().wd.map(function (d) { return '<div class="dow">' + d + '</div>'; }).join('');
  return around(y).then(function (s) {
    var first = y + '-' + pad(m) + '-01', lead = weekday(first), n = new Date(Date.UTC(y, m, 0)).getUTCDate(), html = '';
    for (var i = 0; i < lead; i++) html += '<div class="cell empty"></div>';
    for (var d = 1; d <= n; d++) {
      var k = y + '-' + pad(m) + '-' + pad(d), info = s.by[k];
      if (!info) { html += '<div class="cell out"><span class="n">' + d + '</span></div>'; continue; }
      var st = status(k, s), cls = 'cell' + (st.good ? ' good' : st.bad ? ' bad' : '') + (k === todayKey ? ' today' : '') + (k === sel ? ' sel' : '');
      var mark = st.good ? '&#10003;' : st.bad ? '&times;' : '';
      var label = dateLabel(k, { weekday: 'long', day: 'numeric', month: 'long' }) + (st.good ? ', ' + t().legGood : st.bad ? ', ' + t().legBad : '');
      html += '<button type="button" class="' + cls + '" data-k="' + k + '" aria-label="' + label + '"' + (k === sel ? ' aria-current="date"' : '') + '><span class="n">' + d + '</span><span class="mark">' + mark + '</span></button>';
    }
    $('grid').innerHTML = html;
    Array.prototype.forEach.call($('grid').querySelectorAll('button'), function (b) { b.onclick = function () { sel = b.getAttribute('data-k'); renderMonth(); renderDay().then(function () { if (innerWidth < 900) $('day').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }); }; });
  }).catch(function () { $('grid').innerHTML = '<div class="msg" style="grid-column:1/-1">' + (view.y < YMIN || view.y > YMAX ? t().outRange : t().offline) + '</div>'; });
}

/* ---------- day panel ---------- */
function pct(v, len) { return (100 * v / len).toFixed(2) + '%'; }
function renderDay() {
  var y = +sel.slice(0, 4), box = $('day');
  return around(y).then(function (s) {
    var info = s.by[sel];
    if (!info) { box.innerHTML = '<div class="msg">' + t().outRange + '</div>'; return; }
    var ms = midnight(sel), me = midnight(addDays(sel, 1)), len = me - ms;
    var goods = overlap(s.good, ms, me), avoids = overlap(s.avoid, ms, me), vocs = overlap(s.voc, ms, me);
    var book = []; goods.forEach(function (o) { bookable(o.x).forEach(function (p) { var a = Math.max(p[0], ms), b = Math.min(p[1], me); if (b > a) book.push({ a: a, b: b, x: o.x }); }); });
    var rahu = [Math.max(info.rahu[0], ms), Math.min(info.rahu[1], me)];
    var sun = weekday(sel) === 6, verdict = '', vcls = '';
    if (book.length) {
      vcls = 'good';
      verdict = '<b>' + t().goodV + ':</b> ' + book.map(function (b) { return clock(b.a) + ' - ' + clock(b.b) + ' (' + modeName(b.x[2]) + ', ' + SIGNS[lang][b.x[4]] + ')'; }).join('; ');
    } else {
      var reason;
      if (sun) { reason = t().rBadSun; vcls = 'bad'; }
      else if (avoids.length) { reason = t().rBad(avoids[0].x[3]); vcls = 'bad'; }
      else if (ALLOWED_LD.indexOf(info.ld) < 0) reason = t().rLd(info.ld);
      else if (GOOD_SIGNS.indexOf(info.sign) < 0 || (!info.waxing && info.sign === 9)) reason = t().rSign(SIGNS[lang][info.sign]);
      else reason = t().rCut;
      verdict = '<b>' + (vcls === 'bad' ? t().badV : t().neutV) + '.</b> ' + reason;
    }
    var segs = '<div class="seg salon" style="left:' + pct(OPEN * 60, len) + ';width:' + pct((CLOSE - OPEN) * 60, len) + '" title="' + t().salon + '"></div>';
    avoids.forEach(function (o) { segs += '<div class="seg b" style="left:' + pct(o.s - ms, len) + ';width:' + pct(o.e - o.s, len) + '"></div>'; });
    goods.forEach(function (o) { segs += '<div class="seg g" style="left:' + pct(o.s - ms, len) + ';width:' + pct(o.e - o.s, len) + '"></div>'; });
    vocs.forEach(function (o) { segs += '<div class="seg v" style="left:' + pct(o.s - ms, len) + ';width:' + pct(o.e - o.s, len) + '"></div>'; });
    if (rahu[1] > rahu[0]) segs += '<div class="seg r" style="left:' + pct(rahu[0] - ms, len) + ';width:' + pct(rahu[1] - rahu[0], len) + '"></div>';
    function stamp(m) { var k = keyOf(m); return (k === sel ? '' : dateLabel(k, { day: 'numeric', month: 'short' }) + ' ') + clock(m); }
    var vocTxt = vocs.length ? vocs.map(function (o) { return stamp(o.x[0]) + ' - ' + stamp(o.x[1]); }).join('; ') : t().none2;
    box.innerHTML = '<div class="dayhead">' + moon(info.illum, info.waxing, 44) + '<div><h3>' + dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + '</h3><div class="mut" style="color:var(--mut);font-size:.88rem">' + (info.waxing ? t().wax : t().wan) + ', ' + info.illum + '%</div></div></div>' +
      '<div class="verdict ' + vcls + '">' + verdict + '</div>' +
      '<div class="tl" role="img" aria-label="' + t().day + '">' + segs + '</div><div class="ax"><span>0</span><span>6</span><span>12</span><span>18</span><span>24</span></div>' +
      '<div class="legend"><span><i style="background:var(--good)"></i>' + t().legGood + '</span><span><i style="background:var(--bad);opacity:.55"></i>' + t().legBad + '</span><span><i style="background:var(--warn)"></i>' + t().tlRahu + '</span><span><i style="background:var(--voc)"></i>' + t().tlVoc + '</span><span><i style="background:rgba(127,127,127,.25)"></i>' + t().salon + ' ' + OPEN + ':00-' + CLOSE + ':00</span></div>' +
      '<dl class="facts"><dt>' + t().ld + '</dt><dd>' + info.ld + '</dd><dt>' + t().sign + '</dt><dd>' + SIGNS[lang][info.sign] + '</dd><dt>' + t().rahu + '</dt><dd>' + clock(info.rahu[0]) + ' - ' + clock(info.rahu[1]) + '</dd><dt>' + t().voc + '</dt><dd>' + vocTxt + '</dd></dl>';
  }).catch(function () { box.innerHTML = '<div class="msg">' + t().offline + '</div>'; });
}

function goto(key) {
  sel = key; view.y = +key.slice(0, 4); view.m = +key.slice(5, 7);
  renderMonth().then(renderDay);
  $('day').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
}

/* ---------- chrome ---------- */
function renderStatic() {
  document.documentElement.lang = lang;
  $('lang').textContent = lang === 'ru' ? 'EN' : 'RU';
  $('lang').setAttribute('aria-label', lang === 'ru' ? 'Switch to English' : 'Переключить на русский');
  $('hCal').textContent = t().cal; $('hDay').textContent = t().day; $('hUp').textContent = t().up;
  $('today').textContent = t().today; $('hHow').textContent = t().hHow; $('how').innerHTML = t().how; $('foot').textContent = t().foot;
  $('legend').innerHTML = '<span><i style="background:var(--good)"></i>&#10003; ' + t().legGood + '</span><span><i style="background:var(--bad);opacity:.6"></i>&times; ' + t().legBad + '</span><span><i style="background:var(--ink)"></i>' + t().legToday + '</span>';
  $('logo').innerHTML = moon(55, 1, 28);
  document.title = lang === 'ru' ? 'Hairy Moon: когда стричься' : 'Hairy Moon: when to cut hair';
}
function all() { renderStatic(); renderHero(); renderMonth().then(renderDay); }
$('lang').onclick = function () { lang = lang === 'ru' ? 'en' : 'ru'; try { localStorage.setItem('hm-lang', lang); } catch (e) {} all(); };
$('prev').onclick = function () { view.m--; if (view.m < 1) { view.m = 12; view.y--; } renderMonth(); };
$('next').onclick = function () { view.m++; if (view.m > 12) { view.m = 1; view.y++; } renderMonth(); };
$('today').onclick = function () { var k = todayKey < '2026-11-04' ? '2026-11-05' : todayKey; goto(k); };
all();
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
