import { Particles, Lights, P, PF, Rng, fit, smooth, TAU, sparkle, flare, WHITE } from "../../core/index.js";
import { VOID, envelope } from "./_lib.js";

export const meta = {
  name: "虚空裂隙",
  desc: "A jagged vertical gate tears open, bleeds violet light, and swallows orbiting motes before sealing.",
  tags: ["warlock", "portal", "void", "one-shot"],
  size: [128, 128],
  origin: [64, 112],
  duration: 1.05,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 7 },
};

const CY = -48;

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[2]], haze: C[3] });
  const lights = new Lights();
  let t = 0;
  const motes = Array.from({ length: 64 }, () => ({ g: R.range(0, TAU), r: R.range(22, 52), phase: R.range(0, 1), speed: R.range(1.2, 2.2) }));
  lights.add(0, CY, 56, C[4], 0.7, 0.9);
  lights.add(0, CY, 24, C[6], 0.45, 0.35);
  for (let i = 0; i < 30; i++) {
    ps.spawn(P.VAPOUR, R.range(-8, 8), CY + R.range(-28, 28), R.range(-14, 14), R.range(-10, 6), R.range(0.55, 0.95), C[2], R.range(2.5, 5), R.range(0, 0.25), R.chance(0.4) ? PF.BACK : 0);
  }
  for (let i = 0; i < 20; i++) {
    ps.spawn(P.MOTE, R.range(-40, 40), CY + R.range(-30, 30), R.range(-20, 20), R.range(-15, 10), R.range(0.4, 0.8), C[5], 1, R.range(0, 0.3));
  }
  return {
    update(dt) {
      t += dt;
      if (t < 0.7 && R.chance(0.45)) {
        const g = R.range(0, TAU), r = R.range(18, 40);
        ps.spawn(P.SPARK, Math.cos(g) * r, CY + Math.sin(g) * r, -Math.cos(g) * 40, -Math.sin(g) * 40, R.range(0.2, 0.4), C[5], 1);
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      if (t >= meta.duration) return;
      ps.draw(p, "back");
    },
    draw(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.1, 0.35);
      const open = smooth(0, 0.22, t) * (1 - smooth(0.72, 1.0, t / meta.duration));
      const w = 16 * open, h = 42 * open;
      p.glow(0, CY, 48, C[3], a * 0.5);
      p.glow(0, CY, 20, C[5], a * 0.35);
      // jagged tear body
      const left = [], right = [];
      for (let i = 0; i <= 40; i++) {
        const u = i / 40, y = CY - h + 2 * h * u;
        const ww = Math.sin(u * Math.PI) * w;
        const jag = Math.sin(i * 2.9 + t * 18) * 2.2 * open + Math.sin(i * 5.1 - t * 11) * 1.1 * open;
        left.push([-ww + jag, y]); right.push([ww - jag * 0.7, y]);
      }
      p.poly([...left, ...right.slice().reverse()], C[0], a);
      // bright rims
      for (let i = 0; i < left.length - 1; i++) {
        p.line(left[i][0], left[i][1], left[i + 1][0], left[i + 1][1], i % 3 ? C[5] : C[6], a);
        p.line(right[i][0], right[i][1], right[i + 1][0], right[i + 1][1], i % 3 ? C[4] : C[5], a);
      }
      for (let i = 0; i < left.length; i += 3) {
        p.glow(left[i][0], left[i][1], 7, C[5], a * 0.28);
        p.glow(right[i][0], right[i][1], 7, C[4], a * 0.22);
        if (i % 6 === 0) sparkle(p, (left[i][0] + right[i][0]) * 0.5, left[i][1], 1.8, C[6], C[4], a * 0.5);
      }
      // inner filaments
      for (let i = 0; i < 8; i++) {
        const u = (i + 0.5) / 8, y = CY - h + 2 * h * u;
        const wob = Math.sin(t * 20 + i * 2) * 3 * open;
        p.line(-2 + wob, y, 2 + wob, y + 2, C[5], a * 0.6);
      }
      // motes sucked in
      for (const m of motes) {
        const u = (t * m.speed + m.phase) % 1, r = m.r * (1 - u), g = m.g + u * 2.4;
        const x = Math.cos(g) * r, y = CY + Math.sin(g) * r * 0.85;
        p.line(x + Math.cos(g) * 5, y + Math.sin(g) * 5, x, y, u > 0.6 ? C[6] : C[4], a * Math.sin(u * Math.PI));
        p.light(x, y, C[5], a * 0.25 * u);
      }
      if (t < 0.25) flare(p, 0, CY, 28 * (1 - t / 0.25), 0.8 * (1 - t / 0.25), C);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
