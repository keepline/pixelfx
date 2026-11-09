import { fit, smooth, TAU, sparkle, WHITE, cycle, ease } from "../../core/index.js";
import { VOID, envelope, ring, glyph } from "./_lib.js";

export const meta = {
  name: "诅咒印记",
  desc: "A thorned hex brands the target, blooms with violet runes, then crumbles into cursed embers.",
  tags: ["warlock", "hex", "curse", "one-shot"],
  size: [96, 96],
  origin: [48, 64],
  duration: 0.85,
  loop: false,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 7 },
};

const CY = -26;

export function draw(p, t, o) {
  if (t < 0 || t >= meta.duration) return;
  const C = fit(o.palette, 7), a = envelope(t, meta.duration, 0.06, 0.38);
  const bloom = smooth(0, 0.2, t), fade = 1 - smooth(0.55, meta.duration, t);
  const r = 8 + 12 * bloom;
  p.glow(0, CY, 34, C[3], a * 0.5);
  p.glow(0, CY, 16, C[5], a * 0.35);
  // double rings
  ring(p, C, r, 1, a * fade, null, CY, 0.05);
  ring(p, C, r * 0.62, 1, a * 0.75 * fade, null, CY, 0.07);
  // star thorns
  for (let i = 0; i < 8; i++) {
    const g = (i * TAU) / 8 + t * 0.6;
    const x0 = Math.cos(g) * r, y0 = CY + Math.sin(g) * r;
    const x1 = Math.cos(g) * (r + 6 + 2 * Math.sin(t * 12 + i)), y1 = CY + Math.sin(g) * (r + 6);
    p.line(x0, y0, x1, y1, i % 2 ? C[6] : C[5], a * fade);
    p.px(x1, y1, WHITE);
    p.light(x1, y1, C[5], a * 0.25);
  }
  glyph(p, 0, CY, 5 + 5 * bloom, C, a * fade, Math.sin(t * 8));
  // inner cross
  p.line(-r * 0.4, CY, r * 0.4, CY, C[6], a * fade);
  p.line(0, CY - r * 0.4, 0, CY + r * 0.4, C[5], a * fade);
  // rising embers / crumbling
  cycle(t, meta.duration, 28, o.seed, (r0) => r0.range(0.35, 0.7), (age, life, r0) => {
    const g = r0.range(0, TAU), rad = r0.range(4, r + 2), q = age / life;
    const x = Math.cos(g) * rad, y = CY + Math.sin(g) * rad - ease.outQuad(q) * r0.range(8, 22);
    const k = Math.min(1, q * 4) * (1 - smooth(0.55, 1, q)) * a;
    p.dot(x, y, q < 0.3 ? WHITE : C[5], k);
    if (r0.chance(0.35)) p.glow(x, y, 3, C[4], k * 0.3);
  });
  if (t < 0.18) sparkle(p, 0, CY, 8 * (1 - t / 0.18), C[6], C[4], 1);
  if (t > 0.55) {
    const u = (t - 0.55) / (meta.duration - 0.55);
    for (let i = 0; i < 12; i++) {
      const g = (i * TAU) / 12, d = r * (0.4 + u);
      p.dot(Math.cos(g) * d, CY + Math.sin(g) * d, C[4], (1 - u) * 0.7);
    }
  }
}
