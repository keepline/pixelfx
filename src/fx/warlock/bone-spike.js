import { Particles, Bits, Lights, P, B, Rng, fit, smooth, TAU, sparkle } from "../../core/index.js";
import { BONE, envelope } from "./_lib.js";

export const meta = {
  name: "白骨尖刺",
  desc: "A staggered crown of bone punches through ash, sheds grit, then crumbles back into the floor.",
  tags: ["warlock", "earth", "bone", "one-shot"],
  size: [112, 112],
  origin: [56, 92],
  duration: 0.75,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: BONE, seed: 7 },
};

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[2]], haze: C[3] });
  const bits = new Bits({ ground: floor }), lights = new Lights();
  let t = 0, erupted = false;
  const spikes = Array.from({ length: 9 }, (_, i) => ({
    x: (i - 4) * 8 + R.range(-1.5, 1.5),
    h: R.range(18, 48) * (1 - Math.abs(i - 4) * 0.08),
    w: R.range(2.8, 5.2),
    lean: R.range(-8, 8),
    delay: 0.02 + Math.abs(i - 4) * 0.025 + R.range(0, 0.04),
    back: i % 2 === 0,
  }));
  lights.add(0, -6, 40, C[3], 0.55, 0.35);
  for (let i = 0; i < 60; i++) {
    ps.spawn(i % 3 ? P.GRIT : P.DUST, R.range(-36, 36), -1, R.range(-60, 60), -R.range(30, 140), R.range(0.25, 0.65), C[R.int(1, 4)], R.range(1, 3), R.range(0.02, 0.16));
  }
  return {
    update(dt) {
      t += dt;
      if (!erupted && t > 0.08) {
        erupted = true;
        lights.add(0, -8, 28, C[4], 0.5, 0.2);
        for (let i = 0; i < 28; i++) {
          const g = -Math.PI / 2 + R.range(-1.2, 1.2), v = R.range(50, 160);
          bits.add({ kind: B.SHARD, x: R.range(-20, 20), y: -2, vx: Math.cos(g) * v * 0.5, vy: Math.sin(g) * v, g: 0.85, drag: 0.55, bounce: 0.25, life: R.range(0.35, 0.7), a: R.range(0, TAU), va: R.range(-16, 16), s: R.range(1.2, 2.8), c: R.pick([C[5], C[6], C[4]]) });
        }
      }
      if (t > 0.35 && t < 0.6 && R.chance(0.4)) {
        ps.spawn(P.DUST, R.range(-24, 24), -R.range(2, 10), R.range(-10, 10), -R.range(4, 12), R.range(0.3, 0.55), C[2], 2);
      }
      ps.update(dt); bits.update(dt); lights.update(dt);
    },
    drawBack(p) {
      if (t >= meta.duration) return;
      drawSpikes(p, spikes.filter((s) => s.back), t, C);
      ps.draw(p, "back");
    },
    draw(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.05, 0.4);
      // blood accent seam on floor
      p.line(-28, 0, 28, 0, C[1], a * 0.7);
      for (let x = -26; x <= 26; x += 3) p.dot(x, 1, C[1], a * 0.45);
      p.glow(0, -2, 36, C[2], a * 0.28);
      drawSpikes(p, spikes.filter((s) => !s.back), t, C);
      bits.draw(p); ps.draw(p, "front"); lights.draw(p);
      if (t < 0.2) sparkle(p, 0, -6, 6 * (1 - t / 0.2), C[6], C[4], 0.7);
    },
  };
}

function drawSpikes(p, list, t, C) {
  const crum = smooth(0.42, 0.75, t);
  for (const s of list) {
    const up = smooth(s.delay, s.delay + 0.1, t);
    const h = s.h * up * (1 - 0.85 * crum), a = 1 - crum * 0.95;
    if (h < 1) continue;
    const tipx = s.x + s.lean * up;
    p.tri(s.x - s.w, 0, tipx, -h, s.x + s.w, 0, C[2], a);
    p.tri(s.x - s.w * 0.15, 0, tipx, -h, s.x + s.w, 0, C[4], a);
    p.line(s.x, 0, tipx, -h, C[6], a);
    p.line(s.x - s.w, -1, s.x + s.w, -1, C[1], a * 0.8);
    // lit ridge chips
    if (up > 0.7 && crum < 0.5) {
      p.px(tipx, -h + 1, C[6]);
      p.glow(tipx, -h * 0.55, 5, C[5], 0.15 * a);
    }
  }
}
