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
    loc: 'ru-RU', nowLbl: 'Сейчас хорошее время', nextLbl: 'Ближайшее окно:', sunday: 'воскресенье',
    tGood: function (r, m, sg, ld) { return 'Хорошее время ' + r + '. ' + m + ', Луна в знаке ' + sg + ', ' + ldText(ld) + '. Лунный день и знак подходят, Раху-калы и Луны без курса нет.'; },
    tBadLd: function (r, ld) { return 'Лучше не стричься ' + r + '. ' + ldText(ld) + ': календарь не пускает этот день, а тибетский текст называет его плохим для стрижки.'; },
    tBadSun: function (r) { return 'Лучше не стричься' + (r ? ' ' + r : '') + '. Воскресенье: календарь исключает его, индийский текст тоже считает его плохим.'; },
    tRahu: function (r) { return 'Раху-кала ' + r + '. Неблагоприятный отрезок дня в индийской традиции, окна в это время вычитаются.'; },
    tVoc: function (r) { return 'Луна без курса ' + r + '. Луна закончила последнее сближение с планетами и ждёт перехода в новый знак, окна в это время вычитаются.'; },
    tNone: 'Окна нет. В этот час сочетание лунного дня и знака Луны не из подходящих.', cap: 'Один оборот часов это день салона: с 8:00 до 20:00, ночь не показана. Наведите на цветной сектор, чтобы узнать, что он значит.', rNight: 'Хорошее время есть только ночью, вне часов салона.', legOut: 'хорошее вне часов салона', legNew: 'новолуние', legFull: 'полнолуние', note: 'Научных данных о влиянии Луны на волосы нет: это традиция, а не доказанный эффект.', next: 'Следующее хорошее время', now: 'Сейчас хорошее время', until: 'до', none: 'Окон в выбранном периоде нет',
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
    loc: 'en-US', nowLbl: 'Good time right now', nextLbl: 'Next window:', sunday: 'Sunday',
    tGood: function (r, m, sg, ld) { return 'Good time ' + r + '. ' + m + ', Moon in ' + sg + ', ' + ldText(ld) + '. The lunar day and sign fit, no Rahu Kala or void-of-course Moon.'; },
    tBadLd: function (r, ld) { return 'Better not to cut ' + r + '. ' + ldText(ld) + ': the calendar excludes this day and the Tibetan text calls it bad for haircuts.'; },
    tBadSun: function (r) { return 'Better not to cut' + (r ? ' ' + r : '') + '. Sunday: the calendar excludes it and the Indian text also calls it bad.'; },
    tRahu: function (r) { return 'Rahu Kala ' + r + '. An inauspicious part of the day in the Indian tradition; windows are subtracted then.'; },
    tVoc: function (r) { return 'Void-of-course Moon ' + r + '. The Moon has finished its last aspect and waits to enter a new sign; windows are subtracted then.'; },
    tNone: 'No window. At this hour the lunar day and Moon sign are not on the allowed list.', cap: 'One turn of the clock is the salon day, 8:00 AM to 8:00 PM; night is not shown. Hover a coloured sector to see what it means.', rNight: 'Good time exists only at night, outside salon hours.', legOut: 'good, outside salon hours', legNew: 'new moon', legFull: 'full moon', note: 'There is no scientific evidence that the Moon affects hair: this is a tradition, not a proven effect.', next: 'Next good time', now: 'Good time right now', until: 'until', none: 'No windows in this period',
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
    var a = Math.max(w[0], at(key, OPEN)), b = Math.min(w[1], at(key, CLOSE));
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
function lmin(m) { var p = parts(m); return (+p.hour % 24) * 60 + +p.minute; }
function ang(m) { return 2 * Math.PI * lmin(m) / 720; }   // 12 h face, unwrapped: 8:00 -> 4pi/3 ... 20:00 -> 10pi/3
function at(key, h) { var ms = midnight(key), L0 = ms + offset(ms), T = L0 + h * 60 - offset(ms); return L0 + h * 60 - offset(T); }
function clipTo(list, lo, hi) { var o = []; list.forEach(function (x) { var s = Math.max(x.s, lo), e = Math.min(x.e, hi); if (e > s) o.push({ s: s, e: e, x: x.x }); }); return o; }
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
function micro(d, book, av, mk) {
  var h = '<svg viewBox="-20 -20 40 40" aria-hidden="true"><circle class="trk" r="15"/>';
  av.forEach(function (o) { h += strokeArc(15, ang(o.s), ang(o.e), 'b'); });
  book.forEach(function (o) { h += strokeArc(15, ang(o.a), ang(o.b), 'g'); });
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
      var ms = midnight(k), me = midnight(addDays(k, 1)), book = dayBook(s, ms, me), av = clipTo(overlap(s.avoid, ms, me), at(k, OPEN), at(k, CLOSE)), bad = 0;
      av.forEach(function (o) { bad += o.e - o.s; });
      var pv = s.by[addDays(k, -1)], nx = s.by[addDays(k, 1)], mk = '', mkl = '';
      if (info.illum <= 3 && (!pv || info.illum <= pv.illum) && (!nx || info.illum < nx.illum)) { mk = 'mm-new'; mkl = ', ' + t().legNew; }
      else if (info.illum >= 97 && (!pv || info.illum >= pv.illum) && (!nx || info.illum > nx.illum)) { mk = 'mm-full'; mkl = ', ' + t().legFull; }
      var good = book.length > 0, cls = 'cell' + (k === todayKey ? ' today' : '') + (k === sel ? ' sel' : '');
      var label = dateLabel(k, { weekday: 'long', day: 'numeric', month: 'long' }) + (good ? ', ' + t().legGood : '') + (bad >= 6 * 60 ? ', ' + t().legBad : '') + mkl;
      html += '<button type="button" class="' + cls + '" data-k="' + k + '" aria-label="' + label + '"' + (k === sel ? ' aria-current="date"' : '') + '>' + micro(d, book, av, mk) + '</button>';
    }
    $('grid').innerHTML = html;
    Array.prototype.forEach.call($('grid').querySelectorAll('button'), function (b) { b.onclick = function () { sel = b.getAttribute('data-k'); renderMonth(); renderDay().then(function () { if (innerWidth < 920) $('day').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); }); }; });
  }).catch(function () { $('grid').innerHTML = '<div class="msg" style="grid-column:1/-1">' + (view.y < YMIN || view.y > YMAX ? t().outRange : t().offline) + '</div>'; });
}

/* ---------- the clock: one 12 h turn = the salon day, 8:00 to 20:00 ---------- */
function pie(a0, a1, r, cls, a, b) {
  if (a1 - a0 < 0.004) return '';
  if (a1 - a0 > 2 * Math.PI - 0.004) return pie(a0, a0 + Math.PI, r, cls, a, b) + pie(a0 + Math.PI, a1, r, cls, a, b);
  return '<path class="' + cls + '" data-a="' + a + '" data-b="' + b + '" d="M0 0L' + px(r, a0) + 'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + px(r, a1) + 'Z"/>';
}
function dialSVG(o) {
  var TAU = 2 * Math.PI, a, i, h = '', S = function (v) { return v.toFixed(2); };
  var a0 = ang(at(o.sel, OPEN));
  h += '<defs>' +
    '<linearGradient id="bz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe9ef"/><stop offset=".35" stop-color="#7f95a6"/><stop offset=".6" stop-color="#2c3f4e"/><stop offset="1" stop-color="#a9bccb"/></linearGradient>' +
    '<linearGradient id="bzi" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#d3dfe7"/><stop offset=".5" stop-color="#3b5163"/><stop offset="1" stop-color="#0d1b27"/></linearGradient>' +
    '<radialGradient id="face" cx=".42" cy=".36" r=".8"><stop offset="0" stop-color="#1c3b55"/><stop offset=".7" stop-color="#0d2336"/><stop offset="1" stop-color="#07131f"/></radialGradient>' +
    '<radialGradient id="gGood" cx="0" cy="0" r="126" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1b8a69"/><stop offset=".7" stop-color="#34c796"/><stop offset="1" stop-color="#58e6b6"/></radialGradient>' +
    '<linearGradient id="hand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fa4b3"/><stop offset=".5" stop-color="#f4f8fa"/><stop offset="1" stop-color="#7d93a3"/></linearGradient>' +
    '<radialGradient id="cap" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#9db0bd"/><stop offset="1" stop-color="#3a4f60"/></radialGradient>' +
    '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".30"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="hatch-bg" width="7" height="7"/><line class="hatch-ln" x1="0" y1="0" x2="0" y2="7"/></pattern>' +
    '<pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><rect class="dots-bg" width="4" height="4"/><circle class="dots-dot" cx="2" cy="2" r="1.1"/></pattern>' +
    '<filter id="drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".55"/></filter>' +
    '<filter id="hshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="2" dy="3" stdDeviation="2.2" flood-color="#000" flood-opacity=".55"/></filter>' +
    '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 -.16"/></filter>' +
    '<clipPath id="faceclip"><circle r="190"/></clipPath></defs>';
  h += '<g filter="url(#drop)"><circle r="207" fill="url(#bz)"/><circle r="196" fill="url(#bzi)"/></g><circle r="190" fill="url(#face)"/>';
  h += '<rect x="-190" y="-190" width="380" height="380" filter="url(#grain)" clip-path="url(#faceclip)" opacity=".5"/>';
  h += '<g class="dial-arcs">';
  o.avoids.forEach(function (x) { h += pie(ang(x.s), ang(x.e), 126, 'arc-bad', x.s, x.e); });
  o.book.forEach(function (x) { h += pie(ang(x.a), ang(x.b), 126, 'arc-good', x.a, x.b); });
  h += '<circle class="guide" r="127"/>';
  if (o.rahu[1] > o.rahu[0]) h += bandArc(130, 138, ang(o.rahu[0]), ang(o.rahu[1]), 'arc-rahu', '');
  o.vocs.forEach(function (x) { h += bandArc(141, 149, ang(x.s), ang(x.e), 'arc-voc', ''); });
  h += '</g><circle class="guide" r="150"/>';
  h += '<line class="seam" x1="' + S(34 * Math.sin(a0)) + '" y1="' + S(-34 * Math.cos(a0)) + '" x2="' + S(126 * Math.sin(a0)) + '" y2="' + S(-126 * Math.cos(a0)) + '"/>';
  for (i = 0; i < 60; i++) {
    a = TAU * i / 60; var hr = i % 5 === 0, r0 = hr ? 177 : 181, r1 = 187;
    h += '<line class="tk' + (hr ? ' mj' : '') + '" x1="' + S(r0 * Math.sin(a)) + '" y1="' + S(-r0 * Math.cos(a)) + '" x2="' + S(r1 * Math.sin(a)) + '" y2="' + S(-r1 * Math.cos(a)) + '"/>';
  }
  for (i = 1; i <= 12; i++) { a = TAU * i / 12; h += '<text class="hl' + (i % 3 === 0 ? ' mj' : '') + '" x="' + S(163 * Math.sin(a)) + '" y="' + S(-163 * Math.cos(a)) + '">' + i + '</text>'; }
  h += '<circle class="sub" cx="0" cy="84" r="30"/>' + moon(o.info.illum, o.info.waxing, 38).replace('<svg ', '<svg x="-19" y="65" ');
  h += '<rect class="win" x="74" y="-15" width="46" height="30" rx="5"/><text class="win-n" x="97" y="1">' + +o.sel.slice(8) + '</text>';
  h += '<line id="ghost" class="ghost" x1="0" y1="0" x2="0" y2="-140" visibility="hidden"/>';
  if (o.nowHand != null) {
    var lm = lmin(o.nowHand);
    h += '<g filter="url(#hshadow)"><g transform="rotate(' + S((lm % 720) / 2) + ')"><path class="hh" d="M-5.5 16 L-3.4 -88 L0 -100 L3.4 -88 L5.5 16Z"/></g><g transform="rotate(' + S((lm % 60) * 6) + ')"><path class="hh" d="M-3.6 20 L-2 -138 L0 -150 L2 -138 L3.6 20Z"/></g></g>';
  }
  h += '<circle class="cap" r="9.5"/><circle r="3" fill="#0b1b29"/>';
  h += '<path d="M-150 -96 A190 190 0 0 1 150 -96 Q0 -38 -150 -96Z" fill="url(#gloss)" clip-path="url(#faceclip)" pointer-events="none"/>';
  return '<svg class="dial" id="dialsvg" viewBox="-212 -212 424 424" tabindex="0" role="group" aria-label="' + o.summary.replace(/"/g, '&quot;') + '">' + h + '</svg>';
}
/* tooltip: time under the pointer -> which layers are active there and why */
function dayStamp(m) { var k = keyOf(m); return (k === sel ? '' : dateLabel(k, { day: 'numeric', month: 'short' }) + ' ') + clock(m); }
function layersAt(c, m) {
  var out = [];
  c.avoids.forEach(function (x) { if (m >= x.s && m < x.e) out.push({ k: 'bad', h: x.x[2] === 1 ? t().tBadSun(clock(x.s) + ' - ' + clock(x.e)) : t().tBadLd(clock(x.s) + ' - ' + clock(x.e), x.x[3]) }); });
  c.book.forEach(function (x) { if (m >= x.a && m < x.b) out.push({ k: 'good', h: t().tGood(clock(x.a) + ' - ' + clock(x.b), modeName(x.x[2]), SIGNS[lang][x.x[4]], x.x[3]) }); });
  if (c.rahu[1] > c.rahu[0] && m >= c.rahu[0] && m < c.rahu[1]) out.push({ k: 'rahu', h: t().tRahu(clock(c.info.rahu[0]) + ' - ' + clock(c.info.rahu[1])) });
  c.vocs.forEach(function (x) { if (m >= x.s && m < x.e) out.push({ k: 'voc', h: t().tVoc(dayStamp(x.x[0]) + ' - ' + dayStamp(x.x[1])) }); });
  if (!out.length) out.push({ k: 'none', h: c.sun ? t().tBadSun('') : t().tNone });
  return out;
}
function attachDial(box, c) {
  var svg = box.querySelector('#dialsvg'), tip = box.querySelector('.tip'), ghost = svg.querySelector('#ghost'), kb = null;
  function show(theta, px_, py_) {
    var cm = theta * 720 / (2 * Math.PI), tt = cm >= 480 ? cm : cm + 720, m = at(sel, tt / 60);
    var ls = layersAt(c, m);
    tip.innerHTML = '<div class="tt">' + clock(m) + '</div>' + ls.map(function (l) { return '<div class="tl ' + l.k + '"><i></i><span>' + l.h + '</span></div>'; }).join('');
    tip.hidden = false;
    var cr = box.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = px_ - cr.left + 14, y = py_ - cr.top - th - 12;
    if (x + tw > cr.width - 8) x = px_ - cr.left - tw - 14;
    if (x < 8) x = 8;
    if (y < 8) y = py_ - cr.top + 18;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    ghost.setAttribute('transform', 'rotate(' + (theta * 180 / Math.PI).toFixed(2) + ')'); ghost.setAttribute('visibility', 'visible');
    Array.prototype.forEach.call(svg.querySelectorAll('.arc-good,.arc-bad'), function (p) { p.classList.toggle('hot', m >= +p.getAttribute('data-a') && m < +p.getAttribute('data-b')); });
  }
  function hide() { tip.hidden = true; ghost.setAttribute('visibility', 'hidden'); Array.prototype.forEach.call(svg.querySelectorAll('.hot'), function (p) { p.classList.remove('hot'); }); }
  function fromEvent(e) {
    var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy;
    var rr = Math.sqrt(dx * dx + dy * dy) / (r.width / 2) * 212;
    if (rr > 200 || rr < 14) { hide(); return; }
    var th = Math.atan2(dx, -dy); if (th < 0) th += 2 * Math.PI;
    show(th, e.clientX, e.clientY);
  }
  svg.addEventListener('pointermove', fromEvent);
  svg.addEventListener('pointerdown', fromEvent);
  svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
  document.addEventListener('pointerdown', function (e) { if (!box.contains(e.target)) hide(); });
  svg.addEventListener('keydown', function (e) {
    var step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 15 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -15 : e.key === 'Home' ? 'home' : e.key === 'End' ? 'end' : e.key === 'Escape' ? 'esc' : null;
    if (step === null) return; e.preventDefault();
    if (step === 'esc') { hide(); return; }
    if (kb === null) kb = 8 * 60;
    kb = step === 'home' ? 8 * 60 : step === 'end' ? 19 * 60 + 45 : Math.min(19 * 60 + 59, Math.max(8 * 60, kb + step));
    var th = 2 * Math.PI * (kb % 720) / 720, r = svg.getBoundingClientRect(), k = r.width / 424, rad = 100 * k;
    show(th, r.left + r.width / 2 + rad * Math.sin(th), r.top + r.height / 2 - rad * Math.cos(th));
  });
  svg.addEventListener('blur', hide);
}
function renderDay() {
  var y = +sel.slice(0, 4), box = $('day');
  return around(y).then(function (s) {
    var info = s.by[sel];
    if (!info) { box.innerHTML = '<div class="msg">' + t().outRange + '</div>'; return; }
    var ms = midnight(sel), me = midnight(addDays(sel, 1));
    var lo = at(sel, OPEN), hi = at(sel, CLOSE), goods = overlap(s.good, ms, me), avoids = clipTo(overlap(s.avoid, ms, me), lo, hi), vocs = clipTo(overlap(s.voc, ms, me), lo, hi), book = dayBook(s, ms, me);
    var rahu = [Math.max(info.rahu[0], lo), Math.min(info.rahu[1], hi)], sun = weekday(sel) === 6;
    function avoidTitle(x) { return t().legBad + ': ' + (x.x[2] === 1 ? t().sunday : ldText(x.x[3])); }
    // text verdict rows
    var rows = '';
    book.forEach(function (b) { rows += '<li><i></i><div><b>' + clock(b.a) + ' - ' + clock(b.b) + '</b> <span>' + modeName(b.x[2]) + ' &middot; ' + SIGNS[lang][b.x[4]] + '</span></div></li>'; });
    avoids.forEach(function (x) { rows += '<li><i class="b"></i><div><b>' + t().badV + '</b> <span>' + (x.x[2] === 1 ? t().rBadSun : t().rBad(x.x[3])) + '</span></div></li>'; });
    if (!book.length && !avoids.length) {
      var reason;
      if (goods.length) reason = t().rNight;
      else if (ALLOWED_LD.indexOf(info.ld) < 0) reason = t().rLd(info.ld);
      else if (GOOD_SIGNS.indexOf(info.sign) < 0 || (!info.waxing && info.sign === 9)) reason = t().rSign(SIGNS[lang][info.sign]);
      else reason = t().rCut;
      rows += '<li><i class="n"></i><div><b>' + t().neutV + '</b> <span>' + reason + '</span></div></li>';
    }
    var summary = dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long' }) + '. ' + (book.length ? t().goodV + ': ' + book.map(function (b) { return clock(b.a) + ' - ' + clock(b.b); }).join(', ') : t().neutV) + (avoids.length ? '. ' + t().badV : '');
    function stamp(m) { var k = keyOf(m); return (k === sel ? '' : dateLabel(k, { day: 'numeric', month: 'short' }) + ' ') + clock(m); }
    var vocTxt = vocs.length ? vocs.map(function (o) { return stamp(o.x[0]) + ' - ' + stamp(o.x[1]); }).join('; ') : t().none2;
    box.innerHTML = '<div class="dhead"><h3>' + dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long' }) + '</h3><span class="ph">' + (info.waxing ? t().wax : t().wan) + ', ' + info.illum + '%</span></div>' +
      '<div class="tip" role="status" aria-live="polite" hidden></div>' + dialSVG({ sel: sel, info: info, me: me, goods: goods, book: book, avoids: avoids, vocs: vocs, rahu: rahu, nowHand: (sel === todayKey && now >= lo && now <= hi ? now : null), summary: summary, avoidTitle: avoidTitle }) +
      '<p class="dcap">' + t().cap + '</p><ul class="verdict">' + rows + '</ul>' +
      '<div class="legend"><span><i class="g"></i>' + t().legGood + '</span><span><i class="b"></i>' + t().legBad + '</span><span><i class="r"></i>' + t().tlRahu + '</span><span><i class="v"></i>' + t().tlVoc + '</span></div>' +
      '<dl class="facts"><dt>' + t().ld + '</dt><dd>' + info.ld + '</dd><dt>' + t().sign + '</dt><dd>' + SIGNS[lang][info.sign] + '</dd><dt>' + t().rahu + '</dt><dd>' + clock(info.rahu[0]) + ' - ' + clock(info.rahu[1]) + '</dd><dt>' + t().voc + '</dt><dd>' + vocTxt + '</dd></dl>';
    attachDial(box, { avoids: avoids, book: book, vocs: vocs, rahu: rahu, info: info, sun: sun });
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
