/* Night sky behind the app: slow twinkling stars, one small constellation (Libra, the sign of the first window), a rare shooting star. Static when the visitor prefers reduced motion. */
(function () {
  'use strict';
  var c = document.getElementById('sky');
  if (!c || !c.getContext) return;
  var ctx = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0, stars = [], shoot = null, nextShoot = 0, raf = 0, last = 0;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)'), dark = matchMedia('(prefers-color-scheme: dark)');
  var CON = [[.025, .60], [.062, .56], [.10, .59], [.088, .67], [.045, .70]], LINES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]];

  function seed() {
    var n = Math.min(150, Math.round(W * H / 9500)); stars = [];
    for (var i = 0; i < n; i++) { var sx = Math.random() * W, sy = Math.random() * H; if (sx < W * .78 && sy > 70 && sy < 250) { sy = 250 + Math.random() * (H - 250); } stars.push({ x: sx, y: sy, r: Math.random() * 1.15 + .3, p: Math.random() * 6.28, s: Math.random() * .8 + .25, warm: Math.random() < .18 }); }
  }
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed(); draw(0);
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var d = dark.matches, col = d ? '223,233,255' : '11,34,51', k = d ? .95 : .34, i;
    for (i = 0; i < stars.length; i++) {
      var s = stars[i], a = (.3 + .7 * (.5 + .5 * Math.sin(t * .0009 * s.s + s.p))) * k;
      ctx.fillStyle = s.warm ? 'rgba(255,208,150,' + a + ')' : 'rgba(' + col + ',' + a + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
    if (W >= 1000) {
    ctx.strokeStyle = 'rgba(' + col + ',' + (d ? .17 : .12) + ')'; ctx.lineWidth = 1; ctx.beginPath();
    LINES.forEach(function (l) { ctx.moveTo(CON[l[0]][0] * W, CON[l[0]][1] * H); ctx.lineTo(CON[l[1]][0] * W, CON[l[1]][1] * H); });
    ctx.stroke();
    CON.forEach(function (p, j) { ctx.fillStyle = 'rgba(' + col + ',' + (d ? .8 : .45) + ')'; ctx.beginPath(); ctx.arc(p[0] * W, p[1] * H, j === 1 ? 2.1 : 1.6, 0, 6.2832); ctx.fill(); });
    }
    if (shoot) {
      var age = t - shoot.t0, u = age / 900;
      if (u >= 1) shoot = null;
      else {
        var x = shoot.x + shoot.vx * age, y = shoot.y + shoot.vy * age, g = ctx.createLinearGradient(x, y, x - shoot.vx * 150, y - shoot.vy * 150);
        g.addColorStop(0, 'rgba(' + col + ',' + (1 - u) * (d ? .9 : .5) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - shoot.vx * 150, y - shoot.vy * 150); ctx.stroke();
      }
    }
  }
  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return; last = t;
    if (!shoot && t > nextShoot) {
      if (nextShoot) shoot = { x: W * (.45 + Math.random() * .5), y: H * Math.random() * .3, vx: -.55 - Math.random() * .3, vy: .28 + Math.random() * .2, t0: t };
      nextShoot = t + 16000 + Math.random() * 18000;
    }
    draw(t);
  }
  function start() { cancelAnimationFrame(raf); if (reduce.matches || document.hidden) { draw(0); return; } last = 0; raf = requestAnimationFrame(loop); }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', start);
  [reduce, dark].forEach(function (m) { if (m.addEventListener) m.addEventListener('change', function () { draw(0); start(); }); });
  resize(); start();
})();
