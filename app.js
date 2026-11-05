(function () {
'use strict';
var TZ = 'America/Los_Angeles', CITY = null, CITIES = [], NEAR_KM = 50, OPEN = 8, CLOSE = 20, MIN_BOOK = 30, YMIN = 2026, YMAX = 2035;
var ALLOWED_LD = [5, 8, 11, 13, 14, 19, 21, 22, 26, 27, 28];
var GOOD_SIGNS = [1, 4, 5, 6, 9];          // Taurus Leo Virgo Libra Capricorn (Capricorn only while waxing)
var SIGNS = {
  ru: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'],
  en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
};
var T = {
  ru: {
    loc: 'ru-RU', nowLbl: 'Сейчас хорошее время', nextLbl: 'Ближайшее окно:', sunday: 'воскресенье', legOut: 'хорошее вне часов салона', legNew: 'новолуние', legFull: 'полнолуние', note: 'Научных данных о влиянии Луны на волосы нет: это традиция, а не доказанный эффект.', next: 'Следующее хорошее время', now: 'Сейчас хорошее время', until: 'до', none: 'Окон в выбранном периоде нет',
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
    calc: function (c, z) { return 'Расчёт для города ' + c + ', часовой пояс ' + z + '.'; }, city: 'Город', search: 'Найти город', useLoc: 'Моё местоположение',
    locNear: function (c, km) { return 'Ближайший город: ' + c + ', ' + km + ' км от вас.'; }, locFar: function (c, km) { return 'Ближайший город ' + c + ' в ' + km + ' км, это дальше ' + NEAR_KM + ' км. Выберите город из списка.'; }, locErr: 'Не удалось определить местоположение. Выберите город из списка.', noCity: 'Ничего не найдено',
    foot: 'Метод собран из публично опубликованных русских лунных календарей стрижек. Независимый проект. Не медицинская рекомендация.',
    offline: 'Не удалось загрузить данные. Проверьте соединение и обновите страницу.', outRange: 'Данные есть с ноября 2026 по декабрь 2035.',
    wd: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  },
  en: {
    loc: 'en-US', nowLbl: 'Good time right now', nextLbl: 'Next window:', sunday: 'Sunday', legOut: 'good, outside salon hours', legNew: 'new moon', legFull: 'full moon', note: 'There is no scientific evidence that the Moon affects hair: this is a tradition, not a proven effect.', next: 'Next good time', now: 'Good time right now', until: 'until', none: 'No windows in this period',
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
    calc: function (c, z) { return 'Calculated for ' + c + ', time zone ' + z + '.'; }, city: 'City', search: 'Search city', useLoc: 'My location',
    locNear: function (c, km) { return 'Nearest city: ' + c + ', ' + km + ' km away.'; }, locFar: function (c, km) { return 'Nearest city ' + c + ' is ' + km + ' km away, more than ' + NEAR_KM + ' km. Pick a city from the list.'; }, locErr: 'Could not get your location. Pick a city from the list.', noCity: 'Nothing found',
    foot: 'Method assembled from publicly published Russian lunar haircut calendars. Independent project. Not medical advice.',
    offline: 'Could not load the data. Check your connection and reload.', outRange: 'Data covers November 2026 to December 2035.',
    wd: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
};
var lang = 'ru';
try { lang = localStorage.getItem('hm-lang') || (/^ru|^uk|^be/.test(navigator.language || '') ? 'ru' : 'en'); } catch (e) { lang = 'ru'; }
function t() { return T[lang]; }

/* ---------- time in Los Angeles ---------- */
var F = null;
function setTZ(z) { TZ = z; F = new Intl.DateTimeFormat('en-US', { timeZone: z, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
setTZ(TZ);
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
  var ck = CITY.key + y;
  if (!cache[ck]) cache[ck] = fetch('data/' + CITY.key + '/' + y + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    d.by = {}; d.days.forEach(function (a) { d.by[a[0]] = { ld: a[1], sign: a[2], waxing: a[3], illum: a[4], rahu: [a[5], a[6]] }; }); return d;
  });
  return cache[ck];
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
  if (CITY && CITY.lat < 0) waxing = !waxing;   // southern hemisphere sees the lit side mirrored
  var r = 15, f = illum / 100, rx = Math.abs(1 - 2 * f) * r, sweep = (f < 0.5) ? 0 : 1;
  var d = 'M16 1 A15 15 0 0 1 16 31 A' + rx.toFixed(2) + ' 15 0 0 ' + sweep + ' 16 1 Z';
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-opacity=".35"/><path d="' + d + '" fill="#e9e2cf" ' + (waxing ? '' : 'transform="translate(32 0) scale(-1 1)"') + '/></svg>';
}

/* ---------- state ---------- */
var $ = function (id) { return document.getElementById(id); };
var now, todayKey, view, sel, autoSel = true;
function initState() {
  now = Math.floor(Date.now() / 60000); todayKey = keyOf(now);
  autoSel = true; view = { y: +todayKey.slice(0, 4), m: +todayKey.slice(5, 7) }; sel = todayKey;
  if (view.y < YMIN || (view.y === YMIN && view.m < 11)) { view.y = YMIN; view.m = 11; sel = '2026-11-05'; }
  if (view.y > YMAX) { view.y = YMAX; view.m = 12; sel = YMAX + '-12-15'; }
}
function cityName(c) { return lang === 'ru' ? c.ru : c.en; }
function ldText(n) { return lang === 'ru' ? n + '-й лунный день' : 'lunar day ' + n; }
function modeName(m) { return m === 0 ? t().growth : t().trim; }

/* ---------- arcs ---------- */
function lmin(m, me) { if (m >= me) return 1440; var p = parts(m); return (+p.hour % 24) * 60 + +p.minute; }
function ang(m, me) { return 2 * Math.PI * lmin(m, me) / 1440; }
function px(r, a) { return (r * Math.sin(a)).toFixed(2) + ' ' + (-r * Math.cos(a)).toFixed(2); }
function dayBook(s, ms, me) {
  var out = [];
  overlap(s.good, ms, me).forEach(function (o) { bookable(o.x).forEach(function (p) { var a = Math.max(p[0], ms), b = Math.min(p[1], me); if (b > a) out.push({ a: a, b: b, x: o.x }); }); });
  return out;
}
function strokeArc(r, a0, a1, cls) {
  if (a1 - a0 < 0.01) return '';
  if (a1 - a0 > 2 * Math.PI - 0.01) return '<circle class="' + cls + '" r="' + r + '"/>';
  return '<path class="' + cls + '" d="M' + px(r, a0) + 'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + px(r, a1) + '"/>';
}
function bandArc(r0, r1, a0, a1, cls, title) {
  if (a1 - a0 < 0.004) return '';
  if (a1 - a0 > 2 * Math.PI - 0.004) return bandArc(r0, r1, a0, a0 + Math.PI, cls, title) + bandArc(r0, r1, a0 + Math.PI, a1, cls, '');
  var large = a1 - a0 > Math.PI ? 1 : 0;
  return '<path class="' + cls + '" d="M' + px(r1, a0) + 'A' + r1 + ' ' + r1 + ' 0 ' + large + ' 1 ' + px(r1, a1) + 'L' + px(r0, a1) + 'A' + r0 + ' ' + r0 + ' 0 ' + large + ' 0 ' + px(r0, a0) + 'Z">' + (title ? '<title>' + title + '</title>' : '') + '</path>';
}
function moonGlyph(cls, cx, cy) { return '<g class="' + cls + '"><circle class="mm-ring" cx="' + cx + '" cy="' + cy + '" r="4"/><circle class="mm-disc" cx="' + cx + '" cy="' + cy + '" r="2.4"/></g>'; }
function micro(d, book, av, me, mk) {
  var h = '<svg viewBox="-20 -20 40 40" aria-hidden="true"><circle class="trk" r="15"/>';
  av.forEach(function (o) { h += strokeArc(15, ang(o.s, me), ang(o.e, me), 'b'); });
  book.forEach(function (o) { h += strokeArc(15, ang(o.a, me), ang(o.b, me), 'g'); });
  if (mk) h += moonGlyph(mk, 15.8, -15.8);
  return h + '<text class="num" y="0.5">' + d + '</text></svg>';
}

/* ---------- hero + upcoming ---------- */
function stampWd(m) { return dateLabel(keyOf(m), { weekday: 'short' }) + ' ' + clock(m); }
function renderHero() {
  var hero = $('hero');
  var y0 = Math.min(Math.max(+todayKey.slice(0, 4), YMIN), YMAX);
  return Promise.all([around(y0), around(Math.min(y0 + 1, YMAX))]).then(function (r) {
    var pieces = [], seen = {};
    r.forEach(function (s) { s.good.forEach(function (w) { if (seen[w[0]]) return; seen[w[0]] = 1; bookable(w).forEach(function (p) { pieces.push({ s: p[0], e: p[1], w: w }); }); }); });
    pieces.sort(function (a, b) { return a.s - b.s; });
    var upc = pieces.filter(function (p) { return p.e > now; }), first = upc[0];
    if (!first) { hero.className = 'hero'; hero.innerHTML = '<div class="msg">' + t().none + '</div>'; $('upcoming').innerHTML = ''; return; }
    var inside = first.s <= now, key = keyOf(first.s), w = first.w;
    if (autoSel) {   // first view: if today has nothing bookable, open the dial on the next good day
      autoSel = false;
      if (!dayBook(r[0], midnight(todayKey), midnight(addDays(todayKey, 1))).length && key !== sel) { sel = key; view.y = +key.slice(0, 4); view.m = +key.slice(5, 7); renderMonth().then(renderDay); }
    }
    hero.className = 'hero' + (inside ? ' now' : '');
    var when = inside ? t().until + ' ' + clock(first.e) : dateLabel(key, { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + clock(first.s) + ' - ' + clock(first.e);
    hero.innerHTML = '<h1><span>' + (inside ? t().nowLbl : t().nextLbl) + '</span> ' + when + '</h1>' +
      '<p class="sub">' + modeName(w[2]) + ' &middot; ' + t().moonIn + ' ' + SIGNS[lang][w[4]] + ' &middot; ' + ldText(w[3]) + '. ' + t().full.charAt(0).toUpperCase() + t().full.slice(1) + ': ' + stampWd(w[0]) + ' - ' + stampWd(w[1]) + '</p>' +
      '<div class="actions"><a class="btn" id="sub" href="ics/' + CITY.key + '.ics">' + t().add + '</a><button class="btn ghost" id="showDay" type="button">' + t().show + '</button></div>';
    var h = location.protocol.indexOf('http') === 0 && !/^(localhost|127\.|\[::1\])/.test(location.hostname);
    if (h) $('sub').href = 'webcal://' + location.host + location.pathname.replace(/[^\/]*$/, '') + 'ics/' + CITY.key + '.ics';
    else $('sub').setAttribute('download', 'hairy-moon-' + CITY.key + '.ics');
    $('showDay').onclick = function () { goto(key); };
    $('upcoming').innerHTML = upc.slice(0, 8).map(function (p) {
      var k = keyOf(p.s);
      return '<li data-k="' + k + '" tabindex="0"><span class="dn"><b>' + +k.slice(8) + '</b><small>' + dateLabel(k, { weekday: 'short' }) + '</small></span><span class="t">' + clock(p.s) + ' - ' + clock(p.e) + '</span><span class="mode">' + modeName(p.w[2]) + '</span><span class="m">' + t().moonIn + ' ' + SIGNS[lang][p.w[4]] + ' &middot; ' + ldText(p.w[3]) + '</span></li>';
    }).join('');
    Array.prototype.forEach.call($('upcoming').children, function (li) {
      var go = function () { goto(li.getAttribute('data-k')); };
      li.onclick = go; li.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
  }).catch(function () { hero.innerHTML = '<div class="msg">' + t().offline + '</div>'; });
}

/* ---------- month of micro-dials ---------- */
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
      if (!info) { html += '<div class="cell out" aria-hidden="true"><span class="num">' + d + '</span></div>'; continue; }
      var ms = midnight(k), me = midnight(addDays(k, 1)), book = dayBook(s, ms, me), av = overlap(s.avoid, ms, me), bad = 0;
      av.forEach(function (o) { bad += o.e - o.s; });
      var pv = s.by[addDays(k, -1)], nx = s.by[addDays(k, 1)], mk = '', mkl = '';
      if (info.illum <= 3 && (!pv || info.illum <= pv.illum) && (!nx || info.illum < nx.illum)) { mk = 'mm-new'; mkl = ', ' + t().legNew; }
      else if (info.illum >= 97 && (!pv || info.illum >= pv.illum) && (!nx || info.illum > nx.illum)) { mk = 'mm-full'; mkl = ', ' + t().legFull; }
      var good = book.length > 0, cls = 'cell' + (k === todayKey ? ' today' : '') + (k === sel ? ' sel' : '');
      var label = dateLabel(k, { weekday: 'long', day: 'numeric', month: 'long' }) + (good ? ', ' + t().legGood : '') + (bad >= 12 * 60 ? ', ' + t().legBad : '') + mkl;
      html += '<button type="button" class="' + cls + '" data-k="' + k + '" aria-label="' + label + '"' + (k === sel ? ' aria-current="date"' : '') + '>' + micro(d, book, av, me, mk) + '</button>';
    }
    $('grid').innerHTML = html;
    Array.prototype.forEach.call($('grid').querySelectorAll('button'), function (b) { b.onclick = function () { sel = b.getAttribute('data-k'); renderMonth(); renderDay().then(function () { if (innerWidth < 920) $('day').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }); }; });
  }).catch(function () { $('grid').innerHTML = '<div class="msg" style="grid-column:1/-1">' + (view.y < YMIN || view.y > YMAX ? t().outRange : t().offline) + '</div>'; });
}

/* ---------- the 24 h dial ---------- */
function dialSVG(o) {
  var R0 = 112, R1 = 146, a, i, h = '';
  var aOpen = 2 * Math.PI * OPEN / 24, aClose = 2 * Math.PI * CLOSE / 24, TAU = 2 * Math.PI;
  h += '<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="hatch-bg" width="6" height="6"/><line class="hatch-ln" x1="0" y1="0" x2="0" y2="6"/></pattern></defs>';
  h += '<defs><pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><rect class="dots-bg" width="4" height="4"/><circle class="dots-dot" cx="2" cy="2" r="1.1"/></pattern></defs>';
  h += '<g class="dial-arcs">' + bandArc(R0, R1, 0, TAU, 'trk-night', '') + bandArc(R0, R1, aOpen, aClose, 'trk-day', '');
  o.avoids.forEach(function (x) { var a0 = ang(x.s, o.me), a1 = ang(x.e, o.me); h += bandArc(R0, R1, a0, a1, 'arc-bad', o.avoidTitle(x)); });
  o.goods.forEach(function (x) { h += bandArc(R0, R1, ang(x.s, o.me), ang(x.e, o.me), 'arc-good-out', t().legOut + ' ' + clock(x.x[0]) + ' - ' + clock(x.x[1])); });
  o.book.forEach(function (x) { h += bandArc(R0, R1, ang(x.a, o.me), ang(x.b, o.me), 'arc-good', t().legGood + ' ' + clock(x.a) + ' - ' + clock(x.b)); });
  h += bandArc(149, 154, aOpen, aClose, 'salon-arc', t().salon + ' ' + OPEN + ':00-' + CLOSE + ':00');
  h += '<circle class="guide" r="102"/><circle class="guide" r="90"/>';
  if (o.rahu[1] > o.rahu[0]) h += bandArc(98, 106, ang(o.rahu[0], o.me), ang(o.rahu[1], o.me), 'arc-rahu', t().tlRahu + ' ' + clock(o.info.rahu[0]) + ' - ' + clock(o.info.rahu[1]));
  o.vocs.forEach(function (x) { h += bandArc(86, 94, ang(x.s, o.me), ang(x.e, o.me), 'arc-voc', t().tlVoc); });
  h += '</g>';
  for (i = 0; i < 24; i++) {
    a = TAU * i / 24; var mj = i % 3 === 0;
    h += '<line class="tk' + (mj ? ' mj' : '') + '" x1="' + (158 * Math.sin(a)).toFixed(2) + '" y1="' + (-158 * Math.cos(a)).toFixed(2) + '" x2="' + ((mj ? 167 : 162) * Math.sin(a)).toFixed(2) + '" y2="' + (-(mj ? 167 : 162) * Math.cos(a)).toFixed(2) + '"/>';
    if (mj) h += '<text class="hl' + (i % 6 === 0 ? ' mj' : '') + '" x="' + (183 * Math.sin(a)).toFixed(2) + '" y="' + (-183 * Math.cos(a)).toFixed(2) + '">' + pad(i) + '</text>';
  }
  if (o.nowHand != null) { a = ang(o.nowHand, o.me); h += '<line class="hand" x1="' + (70 * Math.sin(a)).toFixed(2) + '" y1="' + (-70 * Math.cos(a)).toFixed(2) + '" x2="' + (156 * Math.sin(a)).toFixed(2) + '" y2="' + (-156 * Math.cos(a)).toFixed(2) + '"/><circle class="hand-dot" cx="' + (156 * Math.sin(a)).toFixed(2) + '" cy="' + (-156 * Math.cos(a)).toFixed(2) + '" r="5.5"/>'; }
  h += moon(o.info.illum, o.info.waxing, 30).replace('<svg ', '<svg x="-15" y="-60" ');
  h += '<text class="d-num" y="-4">' + +o.sel.slice(8) + '</text><text class="d-mon" y="26">' + dateLabel(o.sel, { month: 'short' }).replace('.', '') + '</text><text class="d-sub" y="44">' + ldText(o.info.ld) + '</text>';
  return '<svg class="dial" viewBox="-204 -204 408 408" role="img" aria-label="' + o.summary.replace(/"/g, '&quot;') + '">' + h + '</svg>';
}
function renderDay() {
  var y = +sel.slice(0, 4), box = $('day');
  return around(y).then(function (s) {
    var info = s.by[sel];
    if (!info) { box.innerHTML = '<div class="msg">' + t().outRange + '</div>'; return; }
    var ms = midnight(sel), me = midnight(addDays(sel, 1));
    var goods = overlap(s.good, ms, me), avoids = overlap(s.avoid, ms, me), vocs = overlap(s.voc, ms, me), book = dayBook(s, ms, me);
    var rahu = [Math.max(info.rahu[0], ms), Math.min(info.rahu[1], me)], sun = weekday(sel) === 6;
    function avoidTitle(x) { return t().legBad + ': ' + (x.x[2] === 1 ? t().sunday : ldText(x.x[3])); }
    // text verdict rows
    var rows = '';
    book.forEach(function (b) { rows += '<li><i></i><div><b>' + clock(b.a) + ' - ' + clock(b.b) + '</b> <span>' + modeName(b.x[2]) + ' &middot; ' + SIGNS[lang][b.x[4]] + '</span></div></li>'; });
    avoids.forEach(function (x) { rows += '<li><i class="b"></i><div><b>' + t().badV + '</b> <span>' + (x.x[2] === 1 ? t().rBadSun : t().rBad(x.x[3])) + '</span></div></li>'; });
    if (!book.length && !avoids.length) {
      var reason;
      if (ALLOWED_LD.indexOf(info.ld) < 0) reason = t().rLd(info.ld);
      else if (GOOD_SIGNS.indexOf(info.sign) < 0 || (!info.waxing && info.sign === 9)) reason = t().rSign(SIGNS[lang][info.sign]);
      else reason = t().rCut;
      rows += '<li><i class="n"></i><div><b>' + t().neutV + '</b> <span>' + reason + '</span></div></li>';
    }
    var summary = dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long' }) + '. ' + (book.length ? t().goodV + ': ' + book.map(function (b) { return clock(b.a) + ' - ' + clock(b.b); }).join(', ') : t().neutV) + (avoids.length ? '. ' + t().badV : '');
    function stamp(m) { var k = keyOf(m); return (k === sel ? '' : dateLabel(k, { day: 'numeric', month: 'short' }) + ' ') + clock(m); }
    var vocTxt = vocs.length ? vocs.map(function (o) { return stamp(o.x[0]) + ' - ' + stamp(o.x[1]); }).join('; ') : t().none2;
    box.innerHTML = '<div class="dhead"><h3>' + dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long' }) + '</h3><span class="ph">' + (info.waxing ? t().wax : t().wan) + ', ' + info.illum + '%</span></div>' +
      dialSVG({ sel: sel, info: info, me: me, goods: goods, book: book, avoids: avoids, vocs: vocs, rahu: rahu, nowHand: (sel === todayKey ? now : null), summary: summary, avoidTitle: avoidTitle }) +
      '<ul class="verdict">' + rows + '</ul>' +
      '<div class="legend"><span><i class="g"></i>' + t().legGood + '</span><span><i class="go"></i>' + t().legOut + '</span><span><i class="b"></i>' + t().legBad + '</span><span><i class="s"></i>' + t().salon + ' ' + OPEN + ':00-' + CLOSE + ':00</span><span><i class="r"></i>' + t().tlRahu + '</span><span><i class="v"></i>' + t().tlVoc + '</span></div>' +
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
  $('today').textContent = t().today; $('hHow').textContent = t().hHow; $('how').innerHTML = t().how; $('foot').textContent = t().note + ' ' + t().calc(cityName(CITY), TZ) + ' ' + t().foot; $('cityBtn').textContent = cityName(CITY); $('cityBtn').setAttribute('aria-label', t().city + ': ' + cityName(CITY)); $('citySearch').placeholder = t().search; $('locBtn').textContent = t().useLoc;
  $('legend').innerHTML = '<span><i class="g"></i>' + t().legGood + '</span><span><i class="b"></i>' + t().legBad + '</span><span><i class="t"></i>' + t().legToday + '</span><span><svg class="mm" viewBox="0 0 12 12" aria-hidden="true">' + moonGlyph('mm-new', 6, 6) + '</svg>' + t().legNew + '</span><span><svg class="mm" viewBox="0 0 12 12" aria-hidden="true">' + moonGlyph('mm-full', 6, 6) + '</svg>' + t().legFull + '</span>';
  $('logo').innerHTML = moon(55, 1, 28);
  document.title = lang === 'ru' ? 'Hairy Moon: когда стричься' : 'Hairy Moon: when to cut hair';
}
function all() { renderStatic(); renderCityList(); renderHero(); renderMonth().then(renderDay); }
$('lang').onclick = function () { lang = lang === 'ru' ? 'en' : 'ru'; try { localStorage.setItem('hm-lang', lang); } catch (e) {} all(); };
$('prev').onclick = function () { view.m--; if (view.m < 1) { view.m = 12; view.y--; } renderMonth(); };
$('next').onclick = function () { view.m++; if (view.m > 12) { view.m = 1; view.y++; } renderMonth(); };
$('today').onclick = function () { var k = todayKey < '2026-11-04' ? '2026-11-05' : todayKey; goto(k); };

/* ---------- city picker ---------- */
function km(a, b) { var R = 6371, r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r, x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) * Math.sin(dn / 2); return 2 * R * Math.asin(Math.sqrt(x)); }
function renderCityList() {
  var q = ($('citySearch').value || '').trim().toLowerCase();
  var items = CITIES.filter(function (c) { return !q || c.ru.toLowerCase().indexOf(q) >= 0 || c.en.toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { return cityName(a).localeCompare(cityName(b), lang); });
  $('cityList').innerHTML = items.length ? items.map(function (c) { return '<li><button type="button" data-k="' + c.key + '"' + (c.key === CITY.key ? ' aria-current="true"' : '') + '>' + cityName(c) + '<span>' + c.cc + '</span></button></li>'; }).join('') : '<li class="msg">' + t().noCity + '</li>';
  Array.prototype.forEach.call($('cityList').querySelectorAll('button'), function (b) { b.onclick = function () { chooseCity(b.getAttribute('data-k')); }; });
}
function chooseCity(key, keepPanel) {
  var c = CITIES.filter(function (x) { return x.key === key; })[0]; if (!c) return;
  CITY = c; setTZ(c.tz); cache = {}; initState();
  try { localStorage.setItem('hm-city', key); } catch (e) {}
  if (history.replaceState) history.replaceState(null, '', '#' + key);
  if (!keepPanel) { $('cityPanel').hidden = true; $('cityBtn').setAttribute('aria-expanded', 'false'); }
  all();
}
$('cityBtn').onclick = function () { var open = $('cityPanel').hidden; $('cityPanel').hidden = !open; $('cityBtn').setAttribute('aria-expanded', open ? 'true' : 'false'); if (open) $('citySearch').focus(); };
$('citySearch').oninput = renderCityList;
$('locBtn').onclick = function () {
  var msg = $('locMsg'); msg.textContent = '';
  if (!navigator.geolocation) { msg.textContent = t().locErr; return; }
  navigator.geolocation.getCurrentPosition(function (p) {
    var me = { lat: p.coords.latitude, lon: p.coords.longitude }, best = null, bd = 1e9;
    CITIES.forEach(function (c) { var d = km(me, c); if (d < bd) { bd = d; best = c; } });
    var d = Math.round(bd);
    if (bd <= NEAR_KM) { msg.textContent = t().locNear(cityName(best), d); chooseCity(best.key, true); }
    else msg.textContent = t().locFar(cityName(best), d);
  }, function () { msg.textContent = t().locErr; }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });
};

/* ---------- boot ---------- */
fetch('cities.json').then(function (r) { return r.json(); }).then(function (list) {
  CITIES = list;
  var key = (location.hash || '').slice(1), pick = list.filter(function (c) { return c.key === key; })[0];
  if (!pick) { try { var sv = localStorage.getItem('hm-city'); pick = list.filter(function (c) { return c.key === sv; })[0]; } catch (e) {} }
  if (!pick) { var z = ''; try { z = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {} pick = list.filter(function (c) { return c.tz === z; })[0] || list.filter(function (c) { return c.key === 'los_angeles'; })[0]; }
  CITY = pick; setTZ(pick.tz); initState(); all();
}).catch(function () { $('hero').innerHTML = '<div class="msg">Could not load the city list.</div>'; });
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
