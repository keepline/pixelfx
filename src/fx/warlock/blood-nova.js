import { Particles, Bits, Lights, P, PF, B, Rng, fit, smooth, TAU, sparkle, flare, WHITE, READY } from "../../core/index.js";
import { BLOOD, envelope, ring, scorch, floorRing } from "./_lib.js";

export const meta = {
  name: "血怒新星",
  desc: "A blood-and-void detonation: white-hot flash, shock rings, debris, and a scorched ritual floor.",
  tags: ["warlock", "nova", "blood", "ultimate", "one-shot"],
  size: [176, 144],
  origin: [88, 118],
  duration: 1.15,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: BLOOD, seed: 7 },
};

const CY = -20;

export const act = {
  target: { x: 70 },
  poses: [
    [-0.28, { ...READY, crouch: 2, fx: -6, fy: -36, bx: 8, by: -36, turn: 1 }],
    [0.0, { ...READY, crouch: 7, lean: 3, fx: -8, fy: -10, bx: 10, by: -10, turn: 1 }, "snap"],
    [0.7, READY],
  ],
  hits: [
    { t: 0.05, stop: 0.08, shake: 0.2, amp: 2, target: false },
    { t: 0.12, push: 1.6, straw: 10, skin: "red" },
  ],
  dust: [{ t: 0.05, x: 10, n: 6, dir: 1, c: "#f993aa" }, { t: 0.05, x: -10, n: 6, dir: -1, c: "#f993aa" }],
};

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[2]], haze: C[3] });
  const bits = new Bits({ ground: floor }), lights = new Lights();
  let t = 0;
  lights.add(0, CY, 70, C[4], 0.95, 0.75);
  lights.add(0, CY, 32, WHITE, 0.85, 0.14);
  lights.add(0, CY, 50, C[5], 0.55, 0.45);
  for (let i = 0; i < 130; i++) {
    const g = R.range(0, TAU), v = R.range(30, 150), delay = R.range(0.02, 0.14);
    const kind = i % 5 === 0 ? P.VAPOUR : i % 3 === 0 ? P.MOTE : P.SPARK;
    ps.spawn(kind, R.range(-3, 3), CY + R.range(-2, 2), Math.cos(g) * v, Math.sin(g) * v * 0.65 - 40, R.range(0.35, 0.9), C[1 + (i % 5)], kind === P.VAPOUR ? R.range(3, 6) : 1, delay, kind === P.VAPOUR && R.chance(0.4) ? PF.BACK : 0);
  }
  for (let i = 0; i < 36; i++) {
    const g = R.range(-Math.PI, 0.2), v = R.range(40, 180);
    bits.add({ kind: R.chance(0.4) ? B.CHUNK : B.SHARD, x: R.range(-4, 4), y: CY, vx: Math.cos(g) * v, vy: Math.sin(g) * v, g: 0.8, drag: 0.55, bounce: 0.28, life: R.range(0.5, 1.0), a: R.range(0, TAU), va: R.range(-18, 18), s: R.range(1.4, 3.2), c: R.pick([C[5], C[4], C[6], C[3]]) });
  }
  for (let i = 0; i < 14; i++) {
    ps.spawn(P.DUST, R.range(-20, 20), -1, R.range(-40, 40), -R.range(5, 20), R.range(0.5, 0.9), C[1], R.range(2, 4), R.range(0.05, 0.2));
  }
  return {
    update(dt) {
      t += dt;
      if (t < 0.35 && R.chance(0.35)) {
        const g = R.range(0, TAU), v = R.range(20, 60);
        ps.spawn(P.SPARK, Math.cos(g) * 8, CY, Math.cos(g) * v, Math.sin(g) * v - 20, R.range(0.2, 0.4), C[5], 1);
      }
      ps.update(dt); bits.update(dt); lights.update(dt);
    },
    drawBack(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.05, 0.4);
      const rr = 58 * smooth(0.04, 0.5, t);
      scorch(p, C, rr * 0.85, a * 0.85);
      floorRing(p, C, rr, 0.22, a * 0.7, true);
      p.ellipse(0, 0, rr * 0.9, 9, C[0], a * 0.45);
      ps.draw(p, "back");
    },
    draw(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.05, 0.4);
      const rr = 58 * smooth(0.04, 0.5, t);
      floorRing(p, C, rr, 0.22, a * 0.85, false);
      for (let i = 0; i < 4; i++) {
        const u = (t - 0.04 - i * 0.07) / 0.55;
        if (u > 0 && u < 1) ring(p, C, 6 + 58 * (1 - Math.pow(1 - u, 3)), 0.7, (1 - u) * 0.85, null, CY, 0.045);
      }
      if (t < 0.22) {
        flare(p, 0, CY, 30 * Math.pow(1 - t / 0.22, 1.3), 1 - t / 0.22, C);
        sparkle(p, 0, CY, 16 * Math.sin(Math.min(1, t / 0.18) * Math.PI), C[6], C[4], 1);
        p.glow(0, CY, 40, WHITE, 0.45 * (1 - t / 0.22));
      }
      p.glow(0, CY, 36, C[4], a * 0.35);
      bits.draw(p); ps.draw(p, "front"); lights.draw(p);
    },
  };
}
