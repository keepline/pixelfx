import { Particles, P, Rng, fit, clamp, smooth, ease, noise, TAU, WHITE, mix } from "../../core/index.js";
import { VOID, Puffs, PK, Drops, floorPool } from "./_lib.js";

export const meta = {
  name: "Medusa shadow serpents",
  desc: "A dark pool opens; Medusa serpents with scaled olive bodies, lit rims, fanged heads and forked tongues lash up, writhe, and sink as it closes.",
  tags: ["shadow", "medusa", "snake", "serpent", "ground", "dark", "magic", "one-shot"],
  size: [208, 130],
  origin: [104, 106],
  duration: 3.2,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 3 },
};

const RX = 40, OPEN = 0.34, SHUT = 2.5, SINK = 0.5, LX = -0.6, LY = -0.8;

// a snake's spine at t: it rises out of the pool along its own curve, a wave writhes up it, its lean sways
// and sometimes whips, and its tip curls into a hook; points every 0.5 px with angle and half-width
function spine(T, t) {
  const e = clamp((t - T.t0) / 0.2), s1 = clamp((t - T.t1) / SINK);
  if (e <= 0 || s1 >= 1) return null;
  // it lashes up past its length and settles; going, it lifts a little, then slides back under
  const lift = 0.07 * Math.sin(Math.PI * clamp(s1 / 0.3)), down = ease.inOutCubic(clamp((s1 - 0.12) / 0.88));
  const rise = ease.outBack(e, 1.8) * (1 + lift) * (1 - down), hidden = (1 - rise) * T.L;
  const writhe = T.A * (0.25 + 0.75 * smooth(T.t0 + 0.08, T.t0 + 0.5, t));
  // tip hook fades once standing so necks can flatten to a horizontal head
  const hook = (0.04 + T.H * ease.outBack(clamp((t - T.t0 - 0.1) / 0.32), 2.5)) * (1 + 0.5 * s1) * (1 + 0.18 * Math.sin(t * 2.3 + T.ph)) * (1 - 0.85 * smooth(0.4, 0.85, rise));
  let lean = T.lean + 0.12 * Math.sin(t * 1.6 + T.ph);
  if (T.whip) lean += T.whip.a * Math.exp(-(((t - T.whip.t) / 0.14) ** 2));
  // outward horizontal: right = 0, left = PI (body still writhes below)
  const out = T.face > 0 ? 0 : Math.PI;
  const flatten = smooth(0.4, 0.88, rise);
  let th = -Math.PI / 2 + lean, x = T.x - Math.cos(th) * hidden, y = T.y - Math.sin(th) * hidden;
  const pts = [], n = Math.ceil(T.L / 0.5);
  for (let i = 0; i <= n; i++) {
    const s = i * 0.5, u = s / T.L;
    pts.push({ x, y, th, w: T.W * Math.pow(1 - u, 0.75) + 0.45, u, s });
    th += 0.5 * (writhe * Math.sin((s / T.lam) * TAU - T.om * t + T.ph) + T.curl * hook * smooth(0.58, 1, u));
    // pull the last quarter toward horizontal outward while extended
    const pull = flatten * smooth(0.62, 1, u);
    if (pull > 0.01) {
      let d = out - th;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      th += d * pull * 0.55;
    }
    x += Math.cos(th) * 0.5;
    y += Math.sin(th) * 0.5;
  }
  pts.rise = rise;
  pts.out = out;
  pts.flatten = flatten;
  return pts;
}

// a snake in cross-sections: a dark body with a lighter half toward the light, then the rims: bright where it
// faces the light (white where it faces it squarely), violet on the side the pool lights, scales along the coils
function snake(p, T, pts, C, S, t) {
  const surf = T.y;
  for (const q of pts) {
    if (q.y > surf) continue;
    const nx = -Math.sin(q.th), ny = Math.cos(q.th), ks = nx * LX + ny * LY >= 0 ? 1 : -1;
    for (let v = -q.w; v <= q.w; v += 0.5) {
      const x = q.x + nx * v, y = q.y + ny * v;
      const u = (v / q.w) * ks;
      if (y <= surf) p.px(x, y, u > 0.55 ? S[2] : u > -0.45 ? S[1] : S[0]);
    }
  }
  // a pulse of light runs up it as it lashes, then slower ones while it writhes
  const pulse = (t - T.t0) * 150, slow = (((t - T.t0) * 55) % (T.L * 1.8)) - 4;
  for (const q of pts) {
    if (q.y > surf) continue;
    const nx = -Math.sin(q.th), ny = Math.cos(q.th), f = nx * LX + ny * LY, ks = f >= 0 ? 1 : -1;
    const lit = ks * q.w, x0 = q.x + nx * lit, y0 = q.y + ny * lit, x1 = q.x - nx * lit, y1 = q.y - ny * lit;
    if (y1 <= surf) p.px(x1, y1, C[3]);
    if (y0 <= surf) p.px(x0, y0, Math.abs(f) > 0.8 && q.u > 0.15 ? C[7] : q.u > 0.85 ? C[6] : Math.abs(f) > 0.3 ? C[6] : C[5]);
    // Narrow ventral plates and staggered diamond scales follow the lit normal.
    if (q.u > 0.1 && q.u < 0.92) {
      p.px(q.x - nx * ks * q.w * 0.28, q.y - ny * ks * q.w * 0.28, S[3]);
      if (q.s % 3 < 0.5) {
        const band = Math.floor(q.s / 3), v = ks * q.w * (band % 2 ? 0.65 : 0.35);
        const sx = q.x + nx * v, sy = q.y + ny * v;
        if (sy < surf - 1) {
          p.px(sx, sy, S[4]);
          p.px(sx - Math.cos(q.th), sy - Math.sin(q.th), S[2]);
          p.px(sx + nx, sy + ny, S[1]);
        }
      }
    }
    const dp = Math.min(Math.abs(q.s - pulse), Math.abs(q.s - slow) * 1.6);
    if (dp < 2.5) p.px(q.x, q.y, dp < 1 ? C[7] : C[5]);
  }
  // the tip catches the light, and light runs along it
  const tip = pts[pts.length - 1];
  if (tip.y <= surf) {
    // Angular adder head (~1.75x); when extended, lock near-horizontal facing outward and flick tongue.
    const HS = 1.75;
    const flatten = pts.flatten ?? 0, out = pts.out ?? tip.th;
    let headTh = tip.th;
    if (flatten > 0.01) {
      let d = out - tip.th;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      headTh = tip.th + d * Math.min(1, flatten * 1.15);
      // tiny idle bob only — no wild pitch
      headTh += 0.06 * Math.sin(t * 3.2 + T.ph) * flatten;
    }
    const dx = Math.cos(headTh), dy = Math.sin(headTh), nx = -dy, ny = dx;
    const mark = (u, v, c) => {
      const x = tip.x + dx * u + nx * v, y = tip.y + dy * u + ny * v;
      if (y <= surf) p.px(x, y, c);
    };
    const jaw = (0.5 + 0.8 * (0.5 + 0.5 * Math.sin(t * 11 + T.ph))) * HS;
    const u0 = -3 * HS, u1 = 6 * HS;
    for (let u = u0; u <= u1; u += 0.5) {
      const uu = u / HS;
      const w = (uu < 0 ? 1.2 + (uu + 3) * 0.8 : 3.6 - uu * 0.43) * HS;
      for (let v = -w; v <= w; v += 0.5)
        mark(u, v, Math.abs(v) > w - 0.65 * HS ? C[3] : v < -0.5 * HS ? S[2] : S[1]);
    }
    for (let u = 1 * HS; u <= 6 * HS; u += 0.5) {
      mark(u, jaw, C[0]);
      mark(u, jaw + 1.2 * HS, S[3]);
      if (u > 2 * HS) mark(u, jaw + 0.55 * HS, C[1]); // thicker lower jaw mass
    }
    // fangs
    mark(5.2 * HS, jaw + 0.2 * HS, C[7]);
    mark(5.6 * HS, jaw + 0.9 * HS, C[6]);
    mark(5.2 * HS, -0.3 * HS, C[7]);
    for (const side of [-1, 1]) {
      mark(1.2 * HS, side * 2.2 * HS, S[4]);           // eye socket wash
      mark(2.2 * HS, side * 2.0 * HS, C[7]);            // bright eye
      mark(2.6 * HS, side * 2.0 * HS, C[6]);            // eye glint trail
      mark(1.0 * HS, side * 3.4 * HS, S[0]);            // heavy brow ridge
      mark(0.4 * HS, side * 3.0 * HS, S[1]);
      mark(3.4 * HS, side * 1.4 * HS, S[2]);            // cheek plate
    }
    mark(3.4 * HS, jaw, C[7]);
    mark(4.0 * HS, jaw + 1.0 * HS, C[6]);
    mark(5.4 * HS, -0.6 * HS, S[0]);                    // snout tip
    const flick = Math.max(0, Math.sin(t * 19 + T.ph));
    if (flick > (flatten > 0.5 ? 0.05 : 0.2)) {
      const end = (7 + flick * 4) * HS;
      for (let u = 6 * HS; u < end; u += 0.5) mark(u, jaw, C[5]);
      for (let u = 0; u < 2.4 * HS; u += 0.5) {
        mark(end + u, jaw + u * 0.65, C[6]);
        mark(end + u, jaw - u * 0.65, C[6]);
      }
    }
    p.glow(tip.x + dx * 2 * HS, tip.y + dy * 2 * HS, 9, C[6], 0.28);
  }
  for (let i = 0; i < pts.length; i += 8) if (pts[i].y < surf) p.glow(pts[i].x, pts[i].y, 9, C[4], 0.1);
  const pq = pts[Math.min(pts.length - 1, Math.max(0, Math.round(pulse * 2)))];
  if (pulse < T.L && pq.y < surf) p.glow(pq.x, pq.y, 10, C[6], 0.45);
  // where it breaks the surface: a lit collar of ink
  const base = pts.find((q) => q.y <= surf);
  if (base) {
    const w = base.w + 1.5;
    p.line(base.x - w, surf, base.x + w, surf, C[5]);
    p.px(base.x - w - 1, surf + 0.5, C[3]);
    p.px(base.x + w + 1, surf + 0.5, C[3]);
  }
}

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), floor = () => 0;
  const SNAKE = [mix(C[0], "#1a2e14", 0.45), mix(C[1], "#2f4a22", 0.75), mix(C[2], "#4a6b2f", 0.8), mix(C[3], "#6f8f3a", 0.7), mix(C[6], "#a8c45a", 0.8)];
  const SDIM = SNAKE.map((c) => mix(c, C[0], 0.32));
  const DIM = [C[0], C[0], C[1], C[1], C[3], C[4], C[5], C[6]];
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[7], C[6], C[5], C[4]], haze: C[4] });
  const puffs = new Puffs({ rng: R, flame: [C[7], C[6], C[5], C[4], C[3], C[2], C[1], C[1], C[0]], soot: [mix(C[3], C[2], 0.55), mix(C[2], C[1], 0.5)], cap: mix(C[4], C[2], 0.5), rim: [C[6], C[5], C[4]], floor });
  const ripples = [], splats = [], lights = [];
  let t = 0, acc = 0;
  const rx = (tt) => RX * ease.outCubic(clamp(tt / OPEN)) * (1 - ease.inCubic(clamp((tt - SHUT) / 0.45)));
  const inPool = (x, tt) => Math.abs(x) < rx(tt) * 0.95;
  const drops = new Drops({
    onLand: (x, y, v, s) => {
      if (inPool(x, t)) ripples.push({ x, t0: t, life: 0.5, w: 0.6 });
      else splats.push({ x, t0: t, s });
    },
  });
  // seven snakes in two rows: the back row taller and dimmer, hooks mostly curling inward
  const rows = [[-22, -2.5], [-8, -3], [7, -3], [21, -2.5], [-28, 2.5], [-1, 3], [27, 2.5]];
  const order = [3, 0, 5, 2, 4, 1, 6], last = [1, 5, 0, 6, 3, 2, 4];
  const snakes = rows.map(([x, y], i) => {
    const back = y < 0, sx = Math.sign(x) || 1;
    return {
      x: x + R.range(-3, 3), y, back, face: sx,
      L: back ? R.range(46, 62) : R.range(32, 46), W: back ? R.range(4.2, 5.2) : R.range(5.0, 6.2),
      lean: sx * (0.06 + Math.abs(x) / 120) + R.range(-0.06, 0.06), curl: R.chance(0.75) ? -sx : sx,
      lam: R.range(36, 50), om: R.range(4.5, 7) * R.sign(), ph: R.range(0, TAU), A: R.range(0.06, 0.085), H: R.range(0.15, 0.32),
      t0: 0.3 + order[i] * 0.045 + R.range(0, 0.03), t1: 1.5 + last[i] * 0.1 + R.range(0, 0.05),
      whip: R.chance(0.45) ? { t: R.range(0.9, 1.5), a: R.range(0.28, 0.45) * R.sign() } : null,
      up: false, down: false,
    };
  });

  function splash(x, y, n, power) {
    for (let i = 0; i < n; i++) drops.add(x + R.range(-2, 2), y - 1, R.range(-70, 70) * power, -R.range(90, 230) * power, R.chance(0.4) ? 2 : 1);
    ripples.push({ x, t0: t, life: 0.7, w: 1 });
    lights.push({ x, y: y - 7, r: 30, k: 0.6 * power, life: 0.25, max: 0.25 });
  }

  return {
    update(dt) {
      t += dt;
      for (const T of snakes) {
        if (!T.up && t >= T.t0) {
          T.up = true;
          splash(T.x, T.y, 12, 1);
          for (let i = 0; i < 4; i++) ps.spawn(P.SPARK, T.x, T.y - 2, R.range(-80, 80), -R.range(120, 260), R.range(0.2, 0.45));
        }
        if (!T.down && t >= T.t1 + SINK * 0.8) {
          T.down = true;
          splash(T.x, T.y, 6, 0.6);
        }
        // glints run over the rims while they stand
        if (t > T.t0 + 0.2 && t < T.t1 && R.chance(dt * 1.6)) {
          const pts = spine(T, t), q = pts && pts[Math.floor(R.range(0.3, 0.95) * pts.length)];
          if (q && q.y < T.y) ps.spawn(P.STAR, q.x - Math.sin(q.th) * q.w, q.y + Math.cos(q.th) * q.w, 0, -4, R.range(0.25, 0.5), C[6], R.range(1, 2.2));
        }
      }
      // the pool breathes out wisps and motes while it's open
      const r = rx(t);
      if (r > 8 && t < SHUT - 0.4) {
        for (acc += dt * 9; acc > 1; acc--) puffs.spawn(PK.SOOT, R.range(-0.8, 0.8) * r, -R.range(1, 4), R.range(-8, 8), -R.range(14, 30), R.range(0.6, 0.85), R.range(3, 6));
        if (R.chance(dt * 16)) ps.spawn(P.MOTE, R.range(-0.8, 0.8) * r, -2, R.range(-8, 8), -R.range(30, 80), R.range(0.5, 1), R.pick([C[7], C[6], C[6], C[5]]), R.range(0.6, 1.1));
        if (R.chance(dt * 5)) ps.spawn(P.EMBER, R.range(-0.8, 0.8) * r, -3, R.range(-10, 10), -R.range(20, 45), R.range(0.6, 1), C[6]);
        if (R.chance(dt * 3)) ripples.push({ x: R.range(-0.7, 0.7) * r, t0: t, life: 0.6, w: 0.5 });
        // a violet haze hangs over the pool, lit from inside
        if (R.chance(dt * 7)) ps.spawn(P.VAPOUR, R.range(-0.7, 0.7) * r, -R.range(2, 8), R.range(-6, 6), -R.range(10, 22), R.range(0.6, 0.9), R.chance(0.5) ? C[3] : C[4], R.range(3, 6));
      }
      for (const a of [ripples, splats]) for (let i = a.length - 1; i >= 0; i--) if (t - a[i].t0 > (a[i].life ?? 0.6)) a.splice(i, 1);
      for (let i = lights.length - 1; i >= 0; i--) if ((lights[i].life -= dt) <= 0) lights.splice(i, 1);
      drops.update(dt);
      puffs.update(dt);
      ps.update(dt);
    },
    drawBack(p) {
      if (t >= meta.duration) return;
      const r = rx(t), k = r / RX;
      floorPool(p, C, r, t, ripples);
      if (k > 0) {
        p.glow(0, -16, 86, C[4], 0.22 * k);
        p.glow(0, -8, r * 1.7 + 12, C[4], 0.32 * k * (0.9 + 0.1 * Math.sin(t * 5)));
        p.glow(0, 0, r * 1.15, C[5], 0.18 * k);
      }
      puffs.draw(p, PK.SOOT, { x: 0, y: 6, k: k, reach: 70 });
      ps.draw(p, "back");
      for (const T of snakes) if (T.back) {
        const pts = spine(T, t);
        if (pts) snake(p, T, pts, DIM, SDIM, t);
      }
    },
    draw(p) {
      if (t >= meta.duration) return;
      for (const T of snakes) if (!T.back) {
        const pts = spine(T, t);
        if (pts) snake(p, T, pts, C, SNAKE, t);
      }
      drops.draw(p, C[1], C[5]);
      for (const s of splats) {
        const a = 1 - (t - s.t0) / 0.6;
        p.dot(s.x, -0.5, C[1], a * 1.5);
        p.dot(s.x + 1, -0.5, C[2], a);
        if (s.s > 1) p.dot(s.x - 1, -0.5, C[2], a);
        p.dot(s.x, -1.5, C[5], a);
      }
      ps.draw(p, "front");
      for (const l of lights) {
        const q = l.life / l.max;
        p.glow(l.x, l.y, l.r * (0.6 + 0.4 * q), C[5], l.k * q * q);
      }
    },
  };
}
