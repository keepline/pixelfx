import { Particles, Lights, P, PF, Rng, fit, smooth, TAU, sparkle } from "../../core/index.js";
import { POISON, envelope, floorRing } from "./_lib.js";

export const meta = {
  name: "瘟疫毒云",
  desc: "Poison vapour rolls outward in luminous layers with drifting spores and a sickly floor ring.",
  tags: ["warlock", "aoe", "poison", "one-shot"],
  size: [144, 112],
  origin: [72, 88],
  duration: 1.25,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: POISON, seed: 7 },
};

export function create(o) {
  const C = fit(o.palette, 7), R = new Rng(o.seed), floor = () => 0;
  const ps = new Particles({ rng: R, ground: floor, sparks: [C[6], C[5], C[4], C[3]], haze: C[4] });
  const lights = new Lights();
  let t = 0, tick = 0;
  lights.add(0, -14, 48, C[4], 0.45, 1.1);
  lights.add(0, -10, 22, C[5], 0.35, 0.5);
  for (let i = 0; i < 56; i++) {
    const g = R.range(0, TAU), v = R.range(10, 42);
    ps.spawn(P.VAPOUR, Math.cos(g) * 4, -8, Math.cos(g) * v, -R.range(6, 28), R.range(0.7, 1.15), C[R.int(1, 4)], R.range(3.5, 7.5), R.range(0, 0.25), R.chance(0.3) ? PF.BACK : 0);
  }
  for (let i = 0; i < 48; i++) {
    ps.spawn(P.MOTE, R.range(-28, 28), -R.range(2, 30), R.range(-12, 12), -R.range(4, 22), R.range(0.45, 0.95), R.pick([C[5], C[6], C[4]]), 1, R.range(0, 0.35));
  }
  for (let i = 0; i < 18; i++) {
    ps.spawn(P.DUST, R.range(-20, 20), -2, R.range(-20, 20), -R.range(5, 18), R.range(0.5, 0.9), C[2], R.range(2, 4), R.range(0, 0.2));
  }
  return {
    update(dt) {
      t += dt;
      // keep feeding spores while cloud lives
      if (t < 0.85 && R.chance(0.55)) {
        const g = R.range(0, TAU), rad = 8 + 28 * smooth(0, 0.7, t);
        ps.spawn(P.MOTE, Math.cos(g) * rad, -R.range(4, 20), R.range(-6, 6), -R.range(8, 20), R.range(0.35, 0.7), C[5], 1);
      }
      if (t < 0.6 && R.chance(0.25)) {
        ps.spawn(P.VAPOUR, R.range(-16, 16), -R.range(4, 14), R.range(-8, 8), -R.range(4, 12), R.range(0.5, 0.8), C[3], R.range(3, 5));
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.08, 0.4);
      const rr = 14 + 34 * smooth(0, 0.75, t);
      floorRing(p, C, rr, 0.22, a * 0.55, true);
      ps.draw(p, "back");
    },
    draw(p) {
      if (t >= meta.duration) return;
      const a = envelope(t, meta.duration, 0.08, 0.4);
      const rr = 14 + 34 * smooth(0, 0.75, t);
      floorRing(p, C, rr, 0.22, a * 0.7, false);
      p.glow(0, -12, 52, C[3], a * 0.28);
      p.glow(0, -18, 24, C[5], a * 0.22);
      // spore sparkles
      for (let i = 0; i < 18; i++) {
        const g = i * 2.15 + t * 1.2, u = (t * 0.7 + i * 0.07) % 1;
        const rad = 10 + 26 * u, x = Math.cos(g) * rad, y = -10 + Math.sin(g) * rad * 0.45 - u * 14;
        sparkle(p, x, y, 1.2 + (i % 3) * 0.4, C[6], C[4], a * (1 - u) * 0.65);
      }
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
