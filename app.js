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
    loc: 'ru-RU', vLine: 'Линия', vSlots: 'Слоты', vClock: 'Часы', wGood: 'Хорошо', wNeu: 'Нейтрально', wBad: 'Не стричься', whyNone: 'лунный день или знак Луны не подходят', nextGood: 'Ближайшее хорошее время:', capLine: 'Одна линия это день салона с 8:00 до 20:00. Коснитесь или наведите, чтобы узнать, что значит участок.', legRim: 'ободок: окно / пунктир: не стричься', moonNoon: 'в полдень Луна в знаке', showBtn: 'Показать', addBtn: 'Подписаться', addBtnMore: 'на календарь', addBtnFull: 'Подписаться на календарь', todayNone: 'Сегодня окон нет', todayLast: 'Это последнее окно сегодня', todayNow: function (e) { return 'Сегодня сейчас хорошее время до ' + e; }, todayLater: function (r) { return 'Сегодня ещё: ' + r; }, legHas: 'есть окно', legNo: 'нет окна', legAvoid: 'не стричься', prevDay: 'Предыдущий день', nextDay: 'Следующий день', closeL: 'Закрыть', nowLbl: 'Сейчас хорошее время', nextLbl: 'Ближайшее окно:', sunday: 'воскресенье',
    tGood: function (r, m, sg, ld) { return '<b>Хорошее время</b> ' + r + '<br>' + m + ' · ' + sg + ' · ' + ldText(ld); },
    tBadLd: function (r, ld) { return '<b>Не стричься</b> ' + r + '<br>' + ldText(ld) + ': календарь исключает, тибетский текст: плохо'; },
    tBadSun: function (r) { return '<b>Не стричься</b>' + (r ? ' ' + r : '') + '<br>Воскресенье: исключено календарём и индийским текстом'; },
    tRahu: function (r) { return '<b>Раху-кала</b> ' + r + '<br>Неблагоприятный отрезок дня (Индия), окна вычитаются'; },
    tVoc: function (r) { return '<b>Луна без курса</b> ' + r + '<br>Луна ждёт входа в новый знак, окна вычитаются'; },
    tNone: '<b>Окна нет</b><br>Лунный день или знак Луны сейчас не подходят', cap: 'Один оборот часов это день салона: с 8:00 до 20:00, ночь не показана. Наведите или коснитесь дуги, чтобы узнать, что она значит.', rNight: 'Хорошее время есть только ночью, вне часов салона.', legOut: 'хорошее вне часов салона', legNew: 'новолуние', legFull: 'полнолуние', note: 'Научных данных о влиянии Луны на волосы нет: это традиция, а не доказанный эффект.', next: 'Следующее хорошее время', now: 'Сейчас хорошее время', until: 'до', none: 'Окон в выбранном периоде нет',
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
    loc: 'en-US', vLine: 'Line', vSlots: 'Slots', vClock: 'Clock', wGood: 'Good', wNeu: 'Neutral', wBad: 'Avoid', whyNone: 'lunar day or Moon sign does not fit', nextGood: 'Next good time:', capLine: 'One line is the salon day, 8:00 AM to 8:00 PM. Touch or hover to see what a stretch means.', legRim: 'rim: window / dashes: avoid', moonNoon: 'at noon the Moon is in', showBtn: 'Show', addBtn: 'Subscribe', addBtnMore: 'to calendar', addBtnFull: 'Subscribe to calendar', todayNone: 'No window today', todayLast: 'The last window today', todayNow: function (e) { return 'Good time right now until ' + e; }, todayLater: function (r) { return 'Later today: ' + r; }, legHas: 'has a window', legNo: 'no window', legAvoid: 'avoid', prevDay: 'Previous day', nextDay: 'Next day', closeL: 'Close', nowLbl: 'Good time right now', nextLbl: 'Next window:', sunday: 'Sunday',
    tGood: function (r, m, sg, ld) { return '<b>Good time</b> ' + r + '<br>' + m + ' · ' + sg + ' · ' + ldText(ld); },
    tBadLd: function (r, ld) { return '<b>Better not to cut</b> ' + r + '<br>' + ldText(ld) + ': the calendar excludes it, the Tibetan text says bad'; },
    tBadSun: function (r) { return '<b>Better not to cut</b>' + (r ? ' ' + r : '') + '<br>Sunday: excluded by the calendar and the Indian text'; },
    tRahu: function (r) { return '<b>Rahu Kala</b> ' + r + '<br>Inauspicious part of the day (India), windows are subtracted'; },
    tVoc: function (r) { return '<b>Void-of-course Moon</b> ' + r + '<br>The Moon waits to enter a new sign, windows are subtracted'; },
    tNone: '<b>No window</b><br>The lunar day or Moon sign does not fit right now', cap: 'One turn of the clock is the salon day, 8:00 AM to 8:00 PM; night is not shown. Hover or tap an arc to see what it means.', rNight: 'Good time exists only at night, outside salon hours.', legOut: 'good, outside salon hours', legNew: 'new moon', legFull: 'full moon', note: 'There is no scientific evidence that the Moon affects hair: this is a tradition, not a proven effect.', next: 'Next good time', now: 'Good time right now', until: 'until', none: 'No windows in this period',
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
try { lang = localStorage.getItem('hm-lang') || ((navigator.languages || [navigator.language || '']).some(function (l) { return /^(ru|uk|be|kk)/i.test(l); }) ? 'ru' : (/^en/i.test((navigator.languages || [navigator.language || ''])[0] || '') ? 'en' : 'ru')); } catch (e) { lang = 'ru'; }
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
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#12263a" stroke="#9db4c4" stroke-opacity=".6"/><path d="' + d + '" fill="#e9e2cf" ' + (waxing ? '' : 'transform="translate(32 0) scale(-1 1)"') + '/></svg>';
}

/* ---------- state ---------- */
var $ = function (id) { return document.getElementById(id); };
var now, todayKey, view, sel, autoSel = true, sheetOpen = false;
var ZOD = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map(function (g) { return g + '︎'; });
function desk() { return matchMedia('(min-width: 920px)').matches; }
function initState() {
  now = Math.floor(Date.now() / 60000); todayKey = keyOf(now);
  autoSel = true; sheetOpen = false;
  view = { y: +todayKey.slice(0, 4), m: +todayKey.slice(5, 7) }; sel = todayKey;
  if (view.y < YMIN || (view.y === YMIN && view.m < 11)) { view.y = YMIN; view.m = 11; sel = '2026-11-05'; }
  if (view.y > YMAX) { view.y = YMAX; view.m = 12; sel = YMAX + '-12-15'; }
}
function cityName(c) { return lang === 'ru' ? c.ru : c.en; }
function ldText(n) { return lang === 'ru' ? n + '-й лунный день' : 'lunar day ' + n; }
function modeName(m) { return m === 0 ? t().growth : t().trim; }
function stampWd(m) { return dateLabel(keyOf(m), { weekday: 'short' }) + ' ' + clock(m); }

/* ---------- arcs: one turn of the clock = OPEN..CLOSE (12 h) ---------- */
function lmin(m) { var p = parts(m); return (+p.hour % 24) * 60 + +p.minute; }
function ang(m) { return 2 * Math.PI * lmin(m) / 720; }   // unwrapped: 8:00 -> 4pi/3 ... 20:00 -> 10pi/3
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
function moonGlyph(cls, cx, cy) {
  if (cls === 'mm-new') return '<g class="mm-new"><circle class="mm-nd" cx="' + cx + '" cy="' + cy + '" r="4.6"/></g>';
  var rays = '', i; for (i = 0; i < 8; i++) { var a = i * Math.PI / 4; rays += 'M' + (cx + 4.4 * Math.sin(a)).toFixed(1) + ' ' + (cy - 4.4 * Math.cos(a)).toFixed(1) + 'L' + (cx + 6.2 * Math.sin(a)).toFixed(1) + ' ' + (cy - 6.2 * Math.cos(a)).toFixed(1); }
  return '<g class="mm-full"><path class="mm-fr" d="' + rays + '"/><circle class="mm-fd" cx="' + cx + '" cy="' + cy + '" r="3.2"/></g>';
}
function micro(d, book, av, mk, rim) {
  var h = '<svg viewBox="-20 -20 40 40" aria-hidden="true">';
  if (rim) {
    h += '<circle class="trk" r="15"/>';
    av.forEach(function (o) { h += strokeArc(15, ang(o.s), ang(o.e), 'b'); });
    book.forEach(function (o) { h += strokeArc(15, ang(o.a), ang(o.b), 'g'); });
  }
  if (mk) h += moonGlyph(mk, 14.2, -14.2);
  return h + '<text class="num" y="0.5">' + d + '</text></svg>';
}
function moonOf(s) { var i = s.by[todayKey] || s.by[Object.keys(s.by)[0]]; return i ? moon(i.illum, i.waxing, 92) : ''; }

/* ---------- strip (next window) + upcoming ---------- */
function todayLine(s) {
  if (!s.by[todayKey]) return '';
  var b = dayBook(s, midnight(todayKey), midnight(addDays(todayKey, 1))).filter(function (x) { return x.b > now; });
  var cur = b.filter(function (x) { return x.a <= now; })[0];
  if (cur) { var later = b.filter(function (x) { return x.a > cur.b; })[0]; return later ? t().todayLater(clock(later.a) + ' - ' + clock(later.b)) : t().todayLast; }
  if (!b.length) return t().todayNone;
  return t().todayLater(clock(b[0].a) + ' - ' + clock(b[0].b));
}
function renderHero() {
  var hero = $('hero');
  var y0 = Math.min(Math.max(+todayKey.slice(0, 4), YMIN), YMAX);
  return Promise.all([around(y0), around(Math.min(y0 + 1, YMAX))]).then(function (r) {
    var pieces = [], seen = {};
    r.forEach(function (s) { s.good.forEach(function (w) { if (seen[w[0]]) return; seen[w[0]] = 1; bookable(w).forEach(function (p) { pieces.push({ s: p[0], e: p[1], w: w }); }); }); });
    pieces.sort(function (a, b) { return a.s - b.s; });
    var upc = pieces.filter(function (p) { return p.e > now; }), first = upc[0];
    if (!first) { hero.innerHTML = '<div class="msg">' + t().none + '</div>'; $('upcoming').innerHTML = ''; return; }
    var inside = first.s <= now, key = keyOf(first.s), w = first.w;
    if (autoSel && desk()) {   // desktop first view: if today has nothing bookable, open the clock on the next good day
      autoSel = false;
      if (!dayBook(r[0], midnight(todayKey), midnight(addDays(todayKey, 1))).length && key !== sel) { sel = key; view.y = +key.slice(0, 4); view.m = +key.slice(5, 7); renderMonth().then(renderDay); }
    }
    var l1 = inside ? '<span>' + t().nowLbl + '</span> <span class="nw" style="color:inherit;font-weight:inherit">' + t().until + ' ' + clock(first.e) + '</span>' : '<span>' + t().nextLbl + '</span> ' + dateLabel(key, { weekday: 'short', day: 'numeric', month: 'short' }) + ', <span class="nw" style="color:inherit;font-weight:inherit">' + clock(first.s) + ' - ' + clock(first.e) + '</span>';
    hero.innerHTML = '<svg class="scis" viewBox="0 0 32 32" aria-hidden="true"><circle cx="8" cy="25" r="4.4"/><circle cx="24" cy="25" r="4.4"/><path class="bl" d="M10.4 21 25 4"/><path class="bl bl2" d="M21.6 21 7 4"/></svg>' +
      '<div class="st"><div class="l1">' + l1 + '</div><div class="l2">' + todayLine(r[0]) + '</div></div><div class="smoon" aria-hidden="true">' + moonOf(r[0]) + '</div>' +
      '<div class="sa"><button class="btn sm" id="showDay" type="button">' + t().showBtn + ' ' + dateLabel(key, { day: 'numeric', month: 'long' }) + '</button><a class="btn ghost sm" id="sub" aria-label="' + t().addBtnFull + '" href="ics/' + CITY.key + '.ics">' + t().addBtn + '<span class="sub-long"> ' + t().addBtnMore + '</span></a></div>';
    var h = location.protocol.indexOf('http') === 0 && !/^(localhost|127\.|\[::1\])/.test(location.hostname);
    if (h) $('sub').href = 'webcal://' + location.host + location.pathname.replace(/[^\/]*$/, '') + 'ics/' + CITY.key + '.ics';
    else $('sub').setAttribute('download', 'hairy-moon-' + CITY.key + '.ics');
    $('showDay').onclick = function () { selectDay(key); };
    $('upcoming').innerHTML = upc.slice(0, 8).map(function (p) {
      var k = keyOf(p.s);
      return '<li data-k="' + k + '" tabindex="0"><span class="dn"><b>' + +k.slice(8) + '</b><small>' + dateLabel(k, { weekday: 'short' }) + '</small></span><span class="t">' + clock(p.s) + ' - ' + clock(p.e) + '</span><span class="mode">' + modeName(p.w[2]) + '</span><span class="m">' + t().moonIn + ' ' + SIGNS[lang][p.w[4]] + ' &middot; ' + ldText(p.w[3]) + '</span></li>';
    }).join('');
    Array.prototype.forEach.call($('upcoming').children, function (li) {
      var go = function () { selectDay(li.getAttribute('data-k')); };
      li.onclick = go; li.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
  }).catch(function () { hero.innerHTML = '<div class="msg">' + t().offline + '</div>'; });
}

/* ---------- month: every day is tinted, good days carry a rim of bookable time ---------- */
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
      if (!info) { html += '<div class="cell out" aria-hidden="true"><svg viewBox="-20 -20 40 40"><text class="num" y="0.5">' + d + '</text></svg></div>'; continue; }
      var ms = midnight(k), me = midnight(addDays(k, 1)), book = dayBook(s, ms, me), av = clipTo(overlap(s.avoid, ms, me), at(k, OPEN), at(k, CLOSE)), bad = 0;
      av.forEach(function (o) { bad += o.e - o.s; });
      var good = book.length > 0, state = good ? 'good' : bad >= 6 * 60 ? 'bad' : 'none';
      var pv = s.by[addDays(k, -1)], nx = s.by[addDays(k, 1)], mk = '', mkl = '';
      if (info.illum <= 3 && (!pv || info.illum <= pv.illum) && (!nx || info.illum < nx.illum)) { mk = 'mm-new'; mkl = ', ' + t().legNew; }
      else if (info.illum >= 97 && (!pv || info.illum >= pv.illum) && (!nx || info.illum > nx.illum)) { mk = 'mm-full'; mkl = ', ' + t().legFull; }
      var isSel = k === sel && (sheetOpen || desk());
      var cls = 'cell ' + state + (k === todayKey ? ' today' : '') + (isSel ? ' sel' : '');
      var label = dateLabel(k, { weekday: 'long', day: 'numeric', month: 'long' }) + ', ' + (good ? t().legHas : state === 'bad' ? t().legAvoid : t().legNo) + mkl;
      html += '<button type="button" class="' + cls + '" data-k="' + k + '" aria-label="' + label + '"' + (isSel ? ' aria-current="date"' : '') + '>' + micro(d, book, av, mk, good) + '</button>';
    }
    $('grid').innerHTML = html;
    Array.prototype.forEach.call($('grid').querySelectorAll('button'), function (b) { b.onclick = function () { selectDay(b.getAttribute('data-k')); }; });
  }).catch(function () { $('grid').innerHTML = '<div class="msg" style="grid-column:1/-1">' + (view.y < YMIN || view.y > YMAX ? t().outRange : t().offline) + '</div>'; });
}

/* ---------- day views: line, slots, clock ---------- */
var VB = 240, viewMode = 'line';
try { var vm = localStorage.getItem('hm-view'); if (vm === 'line' || vm === 'slots' || vm === 'clock') viewMode = vm; } catch (e) {}
function durText(m) { m = Math.round(m); var h = Math.floor(m / 60), r = m % 60; return lang === 'ru' ? (h ? h + ' ч ' : '') + (r ? r + ' мин' : '') : (h ? h + ' h ' : '') + (r ? r + ' min' : ''); }
function dayStamp(m) { var k = keyOf(m); return (k === sel ? '' : dateLabel(k, { day: 'numeric', month: 'short' }) + ' ') + clock(m); }

/* the day as consecutive states: good / neutral / avoid, with a reason for each */
function daySegs(c) {
  var lo = c.lo, R = function (m) { return 480 + (m - lo); }, pts = { 480: 1, 1200: 1 }, i;
  c.book.forEach(function (x) { pts[Math.round(R(x.a))] = 1; pts[Math.round(R(x.b))] = 1; });
  c.avoids.forEach(function (x) { pts[Math.round(R(x.s))] = 1; pts[Math.round(R(x.e))] = 1; });
  if (c.rahu[1] > c.rahu[0]) { pts[Math.round(R(c.rahu[0]))] = 1; pts[Math.round(R(c.rahu[1]))] = 1; }
  c.vocs.forEach(function (x) { pts[Math.round(R(x.s))] = 1; pts[Math.round(R(x.e))] = 1; });
  var xs = Object.keys(pts).map(Number).filter(function (v) { return v >= 480 && v <= 1200; }).sort(function (a, b) { return a - b; }), raw = [];
  for (i = 0; i < xs.length - 1; i++) {
    var a = xs[i], b = xs[i + 1], mid = (a + b) / 2, st = 'n', why = '';
    var A = c.avoids.filter(function (x) { return mid >= R(x.s) && mid < R(x.e); })[0];
    var G = c.book.filter(function (x) { return mid >= R(x.a) && mid < R(x.b); })[0];
    if (A) { st = 'b'; why = A.x[2] === 1 ? t().rBadSun : t().rBad(A.x[3]); }
    else if (G) { st = 'g'; why = modeName(G.x[2]) + ' · ' + t().moonIn + ' ' + SIGNS[lang][G.x[4]] + ' · ' + ldText(G.x[3]); }
    else if (c.rahu[1] > c.rahu[0] && mid >= R(c.rahu[0]) && mid < R(c.rahu[1])) why = t().tlRahu;
    else if (c.vocs.some(function (x) { return mid >= R(x.s) && mid < R(x.e); })) why = t().tlVoc;
    else why = t().whyNone;
    var last = raw[raw.length - 1];
    if (last && last.st === st && last.why === why) last.b = b; else raw.push({ a: a, b: b, st: st, why: why });
  }
  var out = [];
  raw.forEach(function (x) { var l = out[out.length - 1]; if (l && l.st === 'n' && x.st === 'n') { l.parts.push(x); l.b = x.b; } else { if (x.st === 'n') x.parts = [{ a: x.a, b: x.b, why: x.why }]; out.push(x); } });
  out.forEach(function (x) {
    if (x.st !== 'n') return; var rs = [];
    x.parts.forEach(function (p) { if (p.b - p.a >= 4 && rs.indexOf(p.why) < 0) rs.push(p.why); });
    if (!rs.length) { var m = x.parts.slice().sort(function (p, q) { return (q.b - q.a) - (p.b - p.a); })[0]; rs = [m.why]; }
    x.why = rs.join(', ');
  });
  out.forEach(function (x) { x.ea = lo + (x.a - 480); x.eb = lo + (x.b - 480); });
  return out;
}
var WORD = function (st) { return st === 'g' ? t().wGood : st === 'b' ? t().wBad : t().wNeu; };
var ICO = {
  g: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 14.3 9.7 21.5 12 14.3 14.3 12 21.5 9.7 14.3 2.5 12 9.7 9.7Z"/></svg>',
  n: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.5a9 9 0 1 0 5 13.5A7.5 7.5 0 0 1 15.5 3.5Z"/></svg>',
  b: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.8"/><circle cx="18" cy="18" r="2.8"/><path d="M8 16 19 4M16 16 5 4"/><path d="M3 21 21 3" stroke-width="2.2"/></svg>'
};

/* line view: a path of light, hour ticks like comb teeth */
function lineHTML(c, segs) {
  var h = '<div class="line"><div class="track" id="track">';
  segs.forEach(function (s) { h += '<div class="sg ' + s.st + '" style="left:' + ((s.a - 480) / 7.2).toFixed(2) + '%;width:' + ((s.b - s.a) / 7.2).toFixed(2) + '%"></div>'; });
  var R = function (m) { return 480 + (m - c.lo); };
  if (c.rahu[1] > c.rahu[0]) h += '<div class="rb" style="left:' + ((R(c.rahu[0]) - 480) / 7.2).toFixed(2) + '%;width:' + ((c.rahu[1] - c.rahu[0]) / 7.2).toFixed(2) + '%"></div>';
  c.vocs.forEach(function (v) { h += '<div class="vb" style="left:' + ((R(v.s) - 480) / 7.2).toFixed(2) + '%;width:' + ((v.e - v.s) / 7.2).toFixed(2) + '%"></div>'; });
  segs.forEach(function (sg) { if (sg.st === 'g') { h += '<div class="nd" style="left:' + ((sg.a - 480) / 7.2).toFixed(2) + '%"></div><div class="nd" style="left:' + ((sg.b - 480) / 7.2).toFixed(2) + '%"></div>'; } });
  if (c.nowRel != null) h += '<div class="needle" style="left:' + ((c.nowRel - 480) / 7.2).toFixed(2) + '%"></div>';
  h += '<div class="lghost" id="lghost"></div></div><div class="comb">';
  for (var m = 480; m <= 1200; m += 15) {
    var cls = m % 60 === 0 ? 'h' : m % 30 === 0 ? 'q' : '';
    h += '<span class="tooth ' + cls + '" style="left:' + ((m - 480) / 7.2).toFixed(2) + '%"></span>';
  }
  for (m = 480; m <= 1200; m += 120) h += '<span class="cl' + (m === 480 ? ' first' : m === 1200 ? ' last' : '') + '" style="left:' + ((m - 480) / 7.2).toFixed(2) + '%">' + (m / 60) + '</span>';
  return h + '</div></div>';
}
function slotsHTML(c, segs, s) {
  var h = '<ul class="slots">';
  segs.forEach(function (x) { h += '<li class="' + x.st + '">' + ICO[x.st] + '<div><span class="w">' + WORD(x.st) + '</span><div class="tm">' + clock(x.ea) + ' - ' + clock(x.eb) + ' <span class="d">&middot; ' + durText(x.b - x.a) + '</span></div><div class="d">' + x.why + '</div></div></li>'; });
  h += '</ul>';
  if (!c.book.length) {
    var ng = null, ws = s.good.slice().sort(function (p, q) { return p[0] - q[0]; });
    for (var i = 0; i < ws.length && !ng; i++) { var ps = bookable(ws[i]); for (var j = 0; j < ps.length; j++) if (ps[j][0] >= c.hi) { ng = { a: ps[j][0], b: ps[j][1], w: ws[i] }; break; } }
    if (ng) h += '<button type="button" class="nextg" data-k="' + keyOf(ng.a) + '">' + t().nextGood + ' <b>' + dateLabel(keyOf(ng.a), { weekday: 'short', day: 'numeric', month: 'short' }) + ', ' + clock(ng.a) + ' - ' + clock(ng.b) + '</b></button>';
  }
  return h;
}

/* the clock: an astrolabe with a zodiac ring */
function arcPath(r, a0, a1) { return 'M' + px(r, a0) + 'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + px(r, a1); }
function dArc(r, a0, a1, w, cls, A, B) {
  var TAU = 2 * Math.PI, at_ = ' data-a="' + A + '" data-b="' + B + '" stroke-width="' + w + '"';
  if (a1 - a0 < 0.004) return '';
  if (a1 - a0 > TAU - 0.004) return '<circle class="arc ' + cls + '"' + at_ + ' r="' + r + '"/>';
  var half = (w / 2) / r * 0.8, rc = (a1 - a0) > 2 * half + 0.05, s0 = rc ? a0 + half : a0, s1 = rc ? a1 - half : a1;
  return '<path class="arc ' + cls + (rc ? ' rc' : '') + '"' + at_ + ' d="' + arcPath(r, s0, s1) + '"/>';
}
function dialSVG(o) {
  var TAU = 2 * Math.PI, a, i, h = '', S = function (v) { return v.toFixed(2); };
  h += '<defs>' +
    '<linearGradient id="bzG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c2"/><stop offset=".3" stop-color="#d8b259"/><stop offset=".6" stop-color="#7a5a1e"/><stop offset="1" stop-color="#f1d98f"/></linearGradient>' +
    '<linearGradient id="bziG" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f3dc96"/><stop offset=".5" stop-color="#8a6a28"/><stop offset="1" stop-color="#2a1d06"/></linearGradient>' +
    '<radialGradient id="zb" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#241d6a"/><stop offset="1" stop-color="#0b0827"/></radialGradient>' +
    '<radialGradient id="face" cx=".4" cy=".32" r=".9"><stop offset="0" stop-color="#2f2377"/><stop offset=".55" stop-color="#120e44"/><stop offset="1" stop-color="#05040f"/></radialGradient>' +
    '<radialGradient id="neb" cx=".75" cy=".78" r=".55"><stop offset="0" stop-color="#12b3a3" stop-opacity=".38"/><stop offset="1" stop-color="#12b3a3" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="gGoodS" gradientUnits="userSpaceOnUse" x1="-140" y1="-140" x2="140" y2="140"><stop offset="0" stop-color="#1fa07b"/><stop offset=".5" stop-color="#65f0c4"/><stop offset="1" stop-color="#2fc296"/></linearGradient>' +
    '<linearGradient id="hand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a98a3c"/><stop offset=".5" stop-color="#fff6d2"/><stop offset="1" stop-color="#8f7230"/></linearGradient>' +
    '<radialGradient id="cap" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d9b862"/><stop offset="1" stop-color="#5a4210"/></radialGradient>' +
    '<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="hatch-bg" width="7" height="7"/><line class="hatch-ln" x1="0" y1="0" x2="0" y2="7"/></pattern>' +
    '<filter id="drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#000" flood-opacity=".6"/></filter>' +
    '<filter id="hshadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="2" dy="3" stdDeviation="2.2" flood-color="#000" flood-opacity=".6"/></filter>' +
    '<filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="3.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 -.15"/></filter>' +
    '<clipPath id="faceclip"><circle r="191"/></clipPath></defs>';
  h += '<g filter="url(#drop)"><circle r="236" fill="url(#bzG)"/><circle r="231" fill="#0b0827"/></g>';
  h += '<circle r="229" fill="url(#zb)"/><circle class="zring" r="228"/><circle class="zring" r="206"/>';
  for (i = 0; i < 12; i++) {
    a = TAU * i / 12; var za = TAU * (i + 0.5) / 12, on = i === o.info.sign;
    h += '<line class="zl" x1="' + S(206 * Math.sin(a)) + '" y1="' + S(-206 * Math.cos(a)) + '" x2="' + S(228 * Math.sin(a)) + '" y2="' + S(-228 * Math.cos(a)) + '"/>';
    if (on) h += '<circle class="zon" cx="' + S(217 * Math.sin(za)) + '" cy="' + S(-217 * Math.cos(za)) + '" r="11.5"/>';
    h += '<text class="zg' + (on ? ' on' : '') + '" x="' + S(217 * Math.sin(za)) + '" y="' + S(-217 * Math.cos(za)) + '">' + ZOD[i] + '</text>';
  }
  h += '<circle r="204" fill="url(#bziG)"/><circle r="197" fill="#0a0828"/><circle r="191" fill="url(#face)"/><circle r="191" fill="url(#neb)"/>';
  for (i = 0; i < 26; i++) { var rr = 30 + ((i * 53 + o.seed) % 150), ra = ((i * 97 + o.seed * 7) % 360) * Math.PI / 180; h += '<circle class="sp" cx="' + S(rr * Math.sin(ra)) + '" cy="' + S(-rr * Math.cos(ra)) + '" r="' + (0.5 + (i % 3) * 0.4) + '" opacity="' + (0.25 + (i % 4) * 0.15) + '"/>'; }
  h += '<rect x="-191" y="-191" width="382" height="382" filter="url(#grain)" clip-path="url(#faceclip)" opacity=".42"/>';
  for (i = 0; i < 12; i++) { var ga = TAU * i / 12; h += '<line class="guil" x1="' + S(22 * Math.sin(ga)) + '" y1="' + S(-22 * Math.cos(ga)) + '" x2="' + S(112 * Math.sin(ga)) + '" y2="' + S(-112 * Math.cos(ga)) + '"/>'; }
  for (i = 26; i <= 86; i += 6) h += '<circle class="guil" r="' + i + '"/>';
  h += '<circle class="groove" r="131"/><circle class="groove2" r="131"/><circle class="edge" r="114.5"/><circle class="edge" r="147.5"/>';
  h += '<g class="sweep">';
  o.avoids.forEach(function (x) { h += dArc(131, ang(x.s), ang(x.e), 21, 'arc-bad-base', x.s, x.e) + dArc(131, ang(x.s), ang(x.e), 21, 'arc-bad', x.s, x.e); });
  h += '<g filter="url(#glow)">';
  o.book.forEach(function (x) { h += dArc(131, ang(x.a), ang(x.b), 21, 'arc-good', x.a, x.b); });
  h += '</g>';
  o.book.forEach(function (x) { h += dArc(138, ang(x.a), ang(x.b), 3, 'hilite', x.a, x.b); });
  if (o.rahu[1] > o.rahu[0]) h += dArc(108, ang(o.rahu[0]), ang(o.rahu[1]), 6, 'arc-rahu', o.rahu[0], o.rahu[1]);
  o.vocs.forEach(function (x) { h += dArc(98, ang(x.s), ang(x.e), 5, 'arc-voc', x.s, x.e); });
  h += '</g>';
  for (i = 0; i < 60; i++) {
    a = TAU * i / 60; var hr = i % 5 === 0, r0 = hr ? 177 : 181, r1 = 187;
    h += '<line class="tk' + (hr ? ' mj' : '') + '" x1="' + S(r0 * Math.sin(a)) + '" y1="' + S(-r0 * Math.cos(a)) + '" x2="' + S(r1 * Math.sin(a)) + '" y2="' + S(-r1 * Math.cos(a)) + '"/>';
  }
  for (i = 1; i <= 12; i++) { a = TAU * i / 12; h += '<text class="hl' + (i % 3 === 0 ? ' mj' : '') + '" x="' + S(163 * Math.sin(a)) + '" y="' + S(-163 * Math.cos(a)) + '">' + i + '</text>'; }
  h += '<path class="sp" d="M0 -66 L3.6 -55.6 L14 -52 L3.6 -48.4 L0 -38 L-3.6 -48.4 L-14 -52 L-3.6 -55.6Z"/>';
  h += '<circle class="sub" cx="0" cy="58" r="21"/>' + moon(o.info.illum, o.info.waxing, 34).replace('<svg ', '<svg x="-17" y="41" ');
  h += '<rect class="win" x="41" y="-11" width="34" height="22" rx="4"/><text class="win-n" x="58" y="1">' + +o.sel.slice(8) + '</text>';
  h += '<line id="ghost" class="ghost" x1="0" y1="0" x2="0" y2="-140" visibility="hidden"/>';
  if (o.nowHand != null) {
    var lm = lmin(o.nowHand);
    h += '<g filter="url(#hshadow)"><g transform="rotate(' + S((lm % 720) / 2) + ')"><path class="hh" d="M-5 16 L-3.2 -80 L0 -94 L3.2 -80 L5 16Z"/></g><g transform="rotate(' + S((lm % 60) * 6) + ')"><path class="hh" d="M-3.4 20 L-1.9 -122 L0 -138 L1.9 -122 L3.4 20Z"/></g></g>';
  }
  h += o.nowHand != null ? '<circle class="cap" r="9"/><circle r="2.8" fill="#0b0820"/>' : '<circle class="pin" r="4.5"/>';
  h += '<path d="M-150 -96 A190 190 0 0 1 150 -96 Q0 -38 -150 -96Z" fill="url(#gloss)" clip-path="url(#faceclip)" pointer-events="none"/>';
  return '<svg class="dial" id="dialsvg" viewBox="' + (-VB) + ' ' + (-VB) + ' ' + (2 * VB) + ' ' + (2 * VB) + '" tabindex="0" role="group" aria-label="' + o.summary.replace(/"/g, '&quot;') + '">' + h + '</svg>';
}

/* tooltips: what is active at a moment, and why */
function layersAt(c, m) {
  var out = [];
  c.avoids.forEach(function (x) { if (m >= x.s && m < x.e) out.push({ k: 'bad', h: x.x[2] === 1 ? t().tBadSun(clock(x.s) + ' - ' + clock(x.e)) : t().tBadLd(clock(x.s) + ' - ' + clock(x.e), x.x[3]) }); });
  c.book.forEach(function (x) { if (m >= x.a && m < x.b) out.push({ k: 'good', h: t().tGood(clock(x.a) + ' - ' + clock(x.b), modeName(x.x[2]), SIGNS[lang][x.x[4]], x.x[3]) }); });
  if (c.rahu[1] > c.rahu[0] && m >= c.rahu[0] && m < c.rahu[1]) out.push({ k: 'rahu', h: t().tRahu(clock(c.info.rahu[0]) + ' - ' + clock(c.info.rahu[1])) });
  c.vocs.forEach(function (x) { if (m >= x.s && m < x.e) out.push({ k: 'voc', h: t().tVoc(dayStamp(x.x[0]) + ' - ' + dayStamp(x.x[1])) }); });
  if (!out.length) out.push({ k: 'none', h: c.sun ? t().tBadSun('') : t().tNone });
  return out;
}
function putTip(box, tip, ls, m, px_, py_, touch, refTop, refH) {
  tip.innerHTML = '<div class="tt">' + clock(m) + '</div>' + ls.map(function (l) { return '<div class="tl ' + l.k + '"><i></i><span>' + l.h + '</span></div>'; }).join('');
  tip.hidden = false;
  var cr = box.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight, gap = touch ? 56 : 22, upper = py_ < refTop + refH / 2;
  var x = px_ - cr.left - tw / 2, y = upper ? py_ - cr.top + gap : py_ - cr.top - th - gap;
  if (x + tw > cr.width - 6) x = cr.width - 6 - tw;
  if (x < 6) x = 6;
  if (y < 4) y = 4;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
function attachDial(box, c) {
  var svg = box.querySelector('#dialsvg'), tip = box.querySelector('.tip'), ghost = svg.querySelector('#ghost'), kb = null;
  function show(theta, px_, py_, touch) {
    var cm = theta * 720 / (2 * Math.PI), tt = cm >= 480 ? cm : cm + 720, m = at(sel, tt / 60), sr = svg.getBoundingClientRect();
    putTip(box, tip, layersAt(c, m), m, px_, py_, touch, sr.top, sr.height);
    ghost.setAttribute('transform', 'rotate(' + (theta * 180 / Math.PI).toFixed(2) + ')'); ghost.setAttribute('visibility', 'visible');
    Array.prototype.forEach.call(svg.querySelectorAll('.arc-good,.arc-bad'), function (p) { p.classList.toggle('hot', m >= +p.getAttribute('data-a') && m < +p.getAttribute('data-b')); });
  }
  function hide() { tip.hidden = true; ghost.setAttribute('visibility', 'hidden'); Array.prototype.forEach.call(svg.querySelectorAll('.hot'), function (p) { p.classList.remove('hot'); }); }
  function fromEvent(e) {
    var r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy;
    var rr = Math.sqrt(dx * dx + dy * dy) / (r.width / 2) * VB;
    if (rr > 200 || rr < 14) { hide(); return; }
    var th = Math.atan2(dx, -dy); if (th < 0) th += 2 * Math.PI;
    show(th, e.clientX, e.clientY, e.pointerType === 'touch' || e.pointerType === 'pen');
  }
  svg.addEventListener('pointermove', fromEvent);
  svg.addEventListener('pointerdown', fromEvent);
  svg.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
  svg.addEventListener('keydown', function (e) {
    var step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 15 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -15 : e.key === 'Home' ? 'home' : e.key === 'End' ? 'end' : e.key === 'Escape' ? 'esc' : null;
    if (step === null) return; e.preventDefault();
    if (step === 'esc') { hide(); return; }
    if (kb === null) kb = 8 * 60;
    kb = step === 'home' ? 8 * 60 : step === 'end' ? 19 * 60 + 45 : Math.min(19 * 60 + 59, Math.max(8 * 60, kb + step));
    var th = 2 * Math.PI * (kb % 720) / 720, r = svg.getBoundingClientRect(), k = r.width / (2 * VB), rad = 100 * k;
    show(th, r.left + r.width / 2 + rad * Math.sin(th), r.top + r.height / 2 - rad * Math.cos(th), false);
  });
  svg.addEventListener('blur', hide);
  if (!box._outside) { box._outside = true; document.addEventListener('pointerdown', function (e) { var tp = box.querySelector('.tip'); if (tp && !box.contains(e.target)) tp.hidden = true; }); }
}
function attachLine(box, c) {
  var tr = box.querySelector('#track'), tip = box.querySelector('.tip'), gh = box.querySelector('#lghost');
  function at_(e) {
    var r = tr.getBoundingClientRect(), f = Math.min(0.9999, Math.max(0, (e.clientX - r.left) / r.width)), rel = 480 + f * 720, m = c.lo + (rel - 480);
    putTip(box, tip, layersAt(c, m), m, e.clientX, r.top + r.height / 2, e.pointerType === 'touch' || e.pointerType === 'pen', r.top, r.height + 40);
    gh.style.left = (f * 100) + '%'; gh.style.visibility = 'visible';
  }
  function hide() { tip.hidden = true; gh.style.visibility = 'hidden'; }
  tr.addEventListener('pointermove', at_); tr.addEventListener('pointerdown', at_);
  tr.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
  if (!box._outside2) { box._outside2 = true; document.addEventListener('pointerdown', function (e) { var tp = box.querySelector('.tip'); if (tp && !box.contains(e.target)) tp.hidden = true; }); }
}

function renderDay() {
  var y = +sel.slice(0, 4), box = $('day');
  $('hDay').textContent = dateLabel(sel, { weekday: 'long', day: 'numeric', month: 'long' });
  $('dayPrev').disabled = sel <= '2026-11-04'; $('dayNext').disabled = sel >= YMAX + '-12-31';
  Array.prototype.forEach.call($('vmode').querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-v') === viewMode ? 'true' : 'false'); });
  return around(y).then(function (s) {
    var info = s.by[sel];
    if (!info) { box.innerHTML = '<div class="msg">' + t().outRange + '</div>'; return; }
    var ms = midnight(sel), me = midnight(addDays(sel, 1));
    var lo = at(sel, OPEN), hi = at(sel, CLOSE), goods = overlap(s.good, ms, me), avoids = clipTo(overlap(s.avoid, ms, me), lo, hi), vocs = clipTo(overlap(s.voc, ms, me), lo, hi), book = dayBook(s, ms, me);
    var rahu = [Math.max(info.rahu[0], lo), Math.min(info.rahu[1], hi)], sun = weekday(sel) === 6;
    var nowIn = sel === todayKey && now >= lo && now <= hi;
    var c = { lo: lo, hi: hi, avoids: avoids, book: book, vocs: vocs, rahu: rahu, info: info, sun: sun, nowRel: nowIn ? 480 + (now - lo) : null };
    var segs = daySegs(c), rows = '';
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
    var seed = +sel.slice(5, 7) * 31 + +sel.slice(8);
    var body;
    if (viewMode === 'slots') body = slotsHTML(c, segs, s);
    else if (viewMode === 'clock') body = dialSVG({ sel: sel, seed: seed, info: info, book: book, avoids: avoids, vocs: vocs, rahu: rahu, nowHand: nowIn ? now : null, summary: summary }) + '<p class="dcap">' + t().cap + '</p><ul class="verdict">' + rows + '</ul>';
    else body = lineHTML(c, segs) + '<p class="dcap">' + t().capLine + '</p><ul class="verdict">' + rows + '</ul>';
    box.innerHTML = '<div class="dhead"><span>' + (info.waxing ? t().wax : t().wan) + ', ' + info.illum + '%</span><span>&middot;</span><span>' + t().moonNoon + ' ' + SIGNS[lang][info.sign] + '</span></div>' +
      '<div class="tip" role="status" aria-live="polite" hidden></div>' + body +
      '<div class="legend"><span><i class="g"></i>' + t().legGood + '</span><span><i class="b"></i>' + t().legBad + '</span><span><i class="r"></i>' + t().tlRahu + '</span><span><i class="v"></i>' + t().tlVoc + '</span></div>' +
      '<dl class="facts"><dt>' + t().ld + '</dt><dd>' + info.ld + '</dd><dt>' + t().rahu + '</dt><dd>' + clock(info.rahu[0]) + ' - ' + clock(info.rahu[1]) + '</dd><dt>' + t().voc + '</dt><dd>' + vocTxt + '</dd></dl>';
    if (viewMode === 'clock') attachDial(box, { avoids: avoids, book: book, vocs: vocs, rahu: rahu, info: info, sun: sun });
    else if (viewMode === 'line') attachLine(box, c);
    var ng = box.querySelector('.nextg'); if (ng) ng.onclick = function () { selectDay(ng.getAttribute('data-k')); };
  }).catch(function () { box.innerHTML = '<div class="msg">' + t().offline + '</div>'; });
}

/* ---------- day sheet ---------- */
function openSheet() { var s = $('sheet'); s.style.transform = ''; s.style.transition = ''; s.classList.add('open'); s.setAttribute('aria-hidden', 'false'); sheetOpen = true; }
function closeSheet() { var s = $('sheet'); s.style.transform = ''; s.style.transition = ''; s.classList.remove('open'); if (!desk()) s.setAttribute('aria-hidden', 'true'); sheetOpen = false; renderMonth(); }
function selectDay(key) {
  sel = key; view.y = +key.slice(0, 4); view.m = +key.slice(5, 7);
  if (!desk()) openSheet();
  renderMonth(); renderDay();
}
function stepDay(n) { var k = addDays(sel, n); if (k < '2026-11-04' || k > YMAX + '-12-31') return; selectDay(k); }
(function swipe() {
  var g = $('grab'), s = $('sheet'), y0 = null;
  g.addEventListener('pointerdown', function (e) { y0 = e.clientY; g.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  g.addEventListener('pointermove', function (e) { if (y0 === null) return; var dy = Math.max(0, e.clientY - y0); s.style.transform = 'translateY(' + dy + 'px)'; });
  function end(e) { if (y0 === null) return; var dy = e.clientY - y0; y0 = null; s.style.transition = ''; if (dy > 80) closeSheet(); else s.style.transform = ''; }
  g.addEventListener('pointerup', end); g.addEventListener('pointercancel', end);
})();
$('sheetClose').onclick = closeSheet;
Array.prototype.forEach.call($('vmode').querySelectorAll('button'), function (b) { b.onclick = function () { viewMode = b.getAttribute('data-v'); try { localStorage.setItem('hm-view', viewMode); } catch (e) {} renderDay(); }; });
function emblem() {
  return '<svg viewBox="0 0 34 34" aria-hidden="true"><defs><linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2c2"/><stop offset=".5" stop-color="#d8b259"/><stop offset="1" stop-color="#8a6a28"/></linearGradient></defs><circle cx="17" cy="17" r="15.5" fill="#120e44" stroke="url(#lg1)" stroke-width="1.4"/><path d="M21.5 5.2A12 12 0 1 0 21.5 28.8 9.2 9.2 0 1 1 21.5 5.2Z" fill="#efe9da"/><path d="M26 8.5l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#e6c36c"/><path d="M8.5 25 17 15.5M8.5 15.5 17 25" stroke="#e6c36c" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="26" r="1.7" fill="none" stroke="#e6c36c" stroke-width="1.1"/><circle cx="8" cy="14.5" r="1.7" fill="none" stroke="#e6c36c" stroke-width="1.1"/></svg>';
}
function buildWheel() {
  var h = '<svg viewBox="-500 -500 1000 1000" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><circle r="470"/><circle r="410"/><circle r="330"/><circle r="250"/><circle r="170"/></g><g stroke="currentColor" stroke-width="1">', i;
  for (i = 0; i < 72; i++) { var a = Math.PI * 2 * i / 72, r0 = i % 6 === 0 ? 410 : 440; h += '<line x1="' + (r0 * Math.sin(a)).toFixed(1) + '" y1="' + (-r0 * Math.cos(a)).toFixed(1) + '" x2="' + (470 * Math.sin(a)).toFixed(1) + '" y2="' + (-470 * Math.cos(a)).toFixed(1) + '"/>'; }
  for (i = 0; i < 12; i++) { var b = Math.PI * 2 * i / 12; h += '<line x1="' + (170 * Math.sin(b)).toFixed(1) + '" y1="' + (-170 * Math.cos(b)).toFixed(1) + '" x2="' + (410 * Math.sin(b)).toFixed(1) + '" y2="' + (-410 * Math.cos(b)).toFixed(1) + '"/>'; }
  h += '</g><g fill="currentColor" font-size="46" text-anchor="middle" font-family="Apple Symbols,Segoe UI Symbol,sans-serif">';
  for (i = 0; i < 12; i++) { var c2 = Math.PI * 2 * (i + .5) / 12; h += '<text x="' + (370 * Math.sin(c2)).toFixed(1) + '" y="' + (-370 * Math.cos(c2) + 16).toFixed(1) + '">' + ZOD[i] + '</text>'; }
  $('wheel').innerHTML = h + '</g></svg>';
}
buildWheel();
$('dayPrev').onclick = function () { stepDay(-1); };
$('dayNext').onclick = function () { stepDay(1); };
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheetOpen && !desk()) closeSheet(); });
matchMedia('(min-width: 920px)').addEventListener('change', function () { $('sheet').classList.remove('open'); $('sheet').style.transform = ''; sheetOpen = false; $('sheet').setAttribute('aria-hidden', desk() ? 'false' : 'true'); if (CITY) { renderMonth(); renderDay(); } });

/* ---------- chrome ---------- */
function renderStatic() {
  document.documentElement.lang = lang;
  $('langRu').setAttribute('aria-pressed', lang === 'ru' ? 'true' : 'false'); $('langEn').setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
  $('hCal').textContent = t().cal; $('hUp').textContent = t().up;
  $('today').textContent = t().today; $('hHow').textContent = t().hHow; $('how').innerHTML = t().how;
  $('foot').textContent = t().note + ' ' + t().calc(cityName(CITY), TZ) + ' ' + t().foot;
  $('cityBtn').textContent = cityName(CITY); $('cityBtn').setAttribute('aria-label', t().city + ': ' + cityName(CITY));
  $('citySearch').placeholder = t().search; $('locBtn').textContent = t().useLoc;
  $('dayPrev').setAttribute('aria-label', t().prevDay); $('dayNext').setAttribute('aria-label', t().nextDay); $('sheetClose').setAttribute('aria-label', t().closeL);
  $('legend').innerHTML = '<span><i class="lg"></i>' + t().legHas + '</span><span><i class="ln"></i>' + t().legNo + '</span><span><i class="lb"></i>' + t().legAvoid + '</span><span><i class="t"></i>' + t().legToday + '</span><span><svg class="rim" viewBox="-20 -20 40 40" aria-hidden="true"><circle class="t0" r="15"/><path class="g1" d="M-13 -7A15 15 0 0 1 8 -13"/><path class="b1" d="M13 -7A15 15 0 0 1 4 14"/></svg>' + t().legRim + '</span><span><svg class="mm" viewBox="0 0 14 14" aria-hidden="true">' + moonGlyph('mm-new', 7, 7) + '</svg>' + t().legNew + '</span><span><svg class="mm" viewBox="0 0 14 14" aria-hidden="true">' + moonGlyph('mm-full', 7, 7) + '</svg>' + t().legFull + '</span>';
  $('logo').innerHTML = emblem();
  var vb = $('vmode').querySelectorAll('button'); vb[0].textContent = t().vLine; vb[1].textContent = t().vSlots; vb[2].textContent = t().vClock; $('vmode').setAttribute('aria-label', t().vLine + ' / ' + t().vSlots + ' / ' + t().vClock);
  $('sheet').setAttribute('aria-hidden', (sheetOpen || desk()) ? 'false' : 'true');
  document.title = lang === 'ru' ? 'Hairy Moon: когда стричься' : 'Hairy Moon: when to cut hair';
}
function all() { renderStatic(); renderCityList(); renderHero(); renderMonth().then(renderDay); }
function setLang(l) { lang = l; try { localStorage.setItem('hm-lang', l); } catch (e) {} all(); }
$('langRu').onclick = function () { setLang('ru'); };
$('langEn').onclick = function () { setLang('en'); };
$('prev').onclick = function () { view.m--; if (view.m < 1) { view.m = 12; view.y--; } renderMonth(); };
$('next').onclick = function () { view.m++; if (view.m > 12) { view.m = 1; view.y++; } renderMonth(); };
$('today').onclick = function () { var k = todayKey < '2026-11-04' ? '2026-11-05' : todayKey; selectDay(k); };

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
  $('sheet').classList.remove('open');
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
  CITY = pick; setTZ(pick.tz); initState(); $('upd').open = desk(); all();
}).catch(function () { $('hero').innerHTML = '<div class="msg">Could not load the city list.</div>'; });
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
