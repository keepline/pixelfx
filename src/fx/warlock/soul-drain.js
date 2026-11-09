import { fit, smooth, TAU, sparkle, WHITE, cycle, ease, rand } from "../../core/index.js";
import { VOID, envelope } from "./_lib.js";

export const meta = {
  name: "汲魂射线",
  desc: "Braided violet tendrils drag spectral sparks from the target back into the caster's hand.",
  tags: ["warlock", "beam", "drain", "one-shot"],
  size: [176, 88],
  origin: [22, 66],
  duration: 1.05,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 7 },
};

const Y = -28, X0 = 8, X1 = 132;

export function draw(p, t, o) {
  if (t < 0 || t >= meta.duration) return;
  const C = fit(o.palette, 7), a = envelope(t, meta.duration, 0.1, 0.35);
  const reach = smooth(0, 0.18, t) * (1 - smooth(0.78, 1, t / meta.duration));
  const xEnd = X0 + (X1 - X0) * reach;
  // soft beam volume
  for (let i = 0; i < 5; i++) {
    const yy = Y + (i - 2) * 1.4;
    p.beam(X0, yy, xEnd, yy + Math.sin(t * 10 + i) * 1.5, 1.2 + (2 - Math.abs(i - 2)) * 0.4, C[2 + (i === 2 ? 2 : 0)], a * (0.25 + (i === 2 ? 0.35 : 0)));
  }
  // braided tendrils
  for (let j = 0; j < 6; j++) {
    let prev = null;
    const ph = j * 1.1 + o.seed * 0.01;
    for (let x = X0; x <= xEnd; x += 2) {
      const u = (x - X0) / Math.max(1, xEnd - X0);
      const y = Y + Math.sin(x * 0.08 + t * TAU * 2.4 + ph) * (2.5 + Math.sin(u * Math.PI) * 6) * (0.6 + 0.4 * Math.sin(t * 6 + j));
      if (prev) p.line(prev[0], prev[1], x, y, j % 2 ? C[5] : C[4], a * (0.45 + j * 0.06));
      if (x % 10 === 0) p.glow(x, y, 7, C[3], a * 0.12);
      prev = [x, y];
    }
  }
  // souls traveling toward caster (right -> left)
  cycle(t, meta.duration, 36, o.seed + 3, (r) => r.range(0.45, 0.85), (age, life, r) => {
    const q = age / life, x = xEnd - (xEnd - X0) * ease.inQuad(q), y = Y + Math.sin(q * TAU * 2 + r.range(0, TAU)) * 7;
    const k = Math.sin(q * Math.PI) * a;
    p.disc(x, y, 1.6 + r.range(0, 1.2), r.chance(0.3) ? WHITE : C[6], k);
    p.glow(x, y, 5, C[4], k * 0.4);
    p.line(x + 6, y, x, y, C[5], k * 0.7);
  });
  // caster hand core + target tip
  sparkle(p, X0, Y, 4 + 2 * Math.sin(t * 22), C[6], C[4], a);
  p.glow(X0, Y, 22, C[4], a * 0.55);
  p.glow(X0, Y, 10, WHITE, a * 0.25);
  if (reach > 0.2) {
    sparkle(p, xEnd, Y, 3, C[5], C[3], a * 0.7);
    p.glow(xEnd, Y, 12, C[3], a * 0.3);
  }
  // floor wash under beam
  for (let x = X0; x < xEnd; x += 8) p.glow(x, -2, 10, C[2], a * 0.08);
}
