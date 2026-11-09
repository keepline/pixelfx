import { Particles, Lights, Bits, P, B, Rng, fit, smooth, TAU, sparkle, flare, WHITE, READY } from "../../core/index.js";
import { VOID, envelope, ring } from "./_lib.js";

export const meta = {
  name: "暗影飞弹",
  desc: "A void heart flies from the hand on a violet trail, then ruptures in a flash of cursed sparks.",
  tags: ["warlock", "projectile", "shadow", "one-shot"],
  size: [112, 80],
  origin: [28, 56],
  duration: 0.65,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 7 },
};

const HIT = 0.42, Y = -22, X0 = 4, X1 = 52;

export const act = {
  target: { x: 58 },
  poses: [
    [-0.18, { ...READY, crouch: 2, lean: -2, fx: 6, fy: -24 }],
    [0.0, { ...READY, crouch: 3, lean: 4, fx: 16, fy: -22 }, "snap"],
    [0.45, READY],
  ],
  hits: [{ t: HIT, stop: 0.05, shake: 0.12, amp: 1, push: 1.4, straw: 8, skin: "shadow" }],
};

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[3]], haze: C[3] });
  const bits = new Bits({ ground: floor }), lights = new Lights();
  let t = 0, hit = false, trail = 0;

  return {
    update(dt) {
      t += dt;
      // dense trail while in flight
      if (t < HIT) {
        const u = t / HIT, x = X0 + (X1 - X0) * u;
        lights.add(x, Y, 14, C[4], 0.35, 0.05);
        while (trail / 180 < t) {
          const q = trail++ / 180, xx = X0 + (X1 - X0) * (q / HIT);
          ps.spawn(P.MOTE, xx, Y + R.range(-2, 2), R.range(-55, -20), R.range(-18, 18), R.range(0.18, 0.35), R.pick([C[5], C[4], C[6]]), 1);
          if (trail % 2 === 0) ps.spawn(P.SPARK, xx, Y, R.range(-40, -10), R.range(-25, 10), R.range(0.12, 0.28), C[5], 1);
          if (trail % 4 === 0) ps.spawn(P.STREAK, xx + R.range(-2, 2), Y + R.range(-3, 3), R.range(-90, -40), R.range(-10, 10), R.range(0.15, 0.28), C[4]);
        }
      }
      if (!hit && t >= HIT) {
        hit = true;
        lights.add(X1, Y, 34, C[5], 0.95, 0.22);
        lights.add(X1, Y, 18, WHITE, 0.7, 0.08);
        for (let i = 0; i < 42; i++) {
          const g = R.range(0, TAU), v = R.range(40, 160);
          ps.spawn(P.SPARK, X1, Y, Math.cos(g) * v, Math.sin(g) * v - 30, R.range(0.18, 0.4), R.pick([C[6], C[5], WHITE]), 1);
        }
        for (let i = 0; i < 16; i++) {
          const g = R.range(0, TAU), v = R.range(20, 70);
          ps.spawn(P.MOTE, X1, Y, Math.cos(g) * v, Math.sin(g) * v, R.range(0.25, 0.5), C[4], 1);
        }
        for (let i = 0; i < 10; i++) {
          const g = R.range(-Math.PI, 0), v = R.range(30, 90);
          bits.add({ kind: B.SHARD, x: X1, y: Y, vx: Math.cos(g) * v, vy: Math.sin(g) * v, g: 0.7, drag: 0.5, bounce: 0.2, life: R.range(0.25, 0.45), a: R.range(0, TAU), va: R.range(-12, 12), s: R.range(1, 2.2), c: R.pick([C[5], C[6], C[4]]) });
        }
        ps.spawn(P.VAPOUR, X1, Y, 0, -8, 0.35, C[3], 4);
      }
      ps.update(dt); bits.update(dt); lights.update(dt);
    },
    draw(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.04, 0.4);
      if (t < HIT) {
        const u = t / HIT, x = X0 + (X1 - X0) * u;
        // long ribbon trail
        for (let i = 0; i < 10; i++) {
          const q = i / 10, xx = x - q * 18, yy = Y + Math.sin(t * 28 + i) * q * 2;
          p.dot(xx, yy, q < 0.25 ? WHITE : q < 0.55 ? C[6] : C[4], a * (1 - q));
          p.glow(xx, yy, 4, C[4], a * 0.12 * (1 - q));
        }
        p.glow(x, Y, 18, C[4], 0.55 * a);
        p.disc(x, Y, 3.2, C[0], a);
        p.disc(x, Y, 1.6, C[5], a);
        p.px(x + 1, Y, WHITE);
        sparkle(p, x + 2, Y, 2.5 + Math.sin(t * 40), C[6], C[4], a);
        p.arc(x, Y, 5, 1.2, t * 22, t * 22 + 3.5, C[5], a);
      } else {
        const u = (t - HIT) / (meta.duration - HIT);
        flare(p, X1, Y, 22 * Math.pow(1 - u, 1.4), (1 - u) * 0.9, C);
        ring(p, C, 4 + 18 * (1 - Math.pow(1 - Math.min(1, u * 1.4), 2)), 0.85, (1 - u) * 0.85, null, Y);
        sparkle(p, X1, Y, 10 * (1 - u), C[6], C[4], 1 - u);
        p.glow(X1, Y, 26, C[4], (1 - u) * 0.55);
      }
      bits.draw(p); ps.draw(p); lights.draw(p);
    },
  };
}
