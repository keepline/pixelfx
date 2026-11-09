import { smooth, TAU, sparkle } from "../../core/index.js";

export const VOID = ["#090711", "#21112f", "#43185c", "#722aa1", "#ab51d9", "#d393ef", "#f5dfff"];
export const BLOOD = ["#100812", "#310d26", "#68132e", "#a52242", "#da4662", "#f993aa", "#ffe0dc"];
export const POISON = ["#0c1410", "#243221", "#425b28", "#739432", "#a8c94e", "#d5e886", "#f3ffd1"];
export const BONE = ["#1a1019", "#582332", "#706563", "#a3967c", "#c7bea0", "#e8dfbe", "#fff3d6"];

/** Attack / hold / release envelope that hits 0 at t=duration. */
export const envelope = (t, d, atk = 0.08, rel = 0.35) =>
  smooth(0, atk, t) * (1 - smooth(d * (1 - rel), d, t));

export function ring(p, C, r, sy, a, far = null, y = 0, step = 0.04) {
  if (r < 0.5 || a <= 0) return;
  for (let g = 0; g < TAU; g += step) {
    if (far !== null && Math.sin(g) < 0 !== far) continue;
    const x = Math.cos(g) * r, yy = y + Math.sin(g) * r * sy;
    const hot = Math.cos(g * 7) > 0.72;
    p.dot(x, yy, hot ? C[5] : C[4], a);
    if (hot) p.light(x, yy, C[5], a * 0.2);
  }
}

export function floorRing(p, C, r, sy, a, far, y = 0) {
  ring(p, C, r, sy, a, far, y, 0.03);
  ring(p, C, r - 2.5, sy, a * 0.55, far, y, 0.05);
}

export function glyph(p, x, y, s, C, a, phase = 0) {
  if (s < 0.4 || a <= 0) return;
  p.line(x - s, y, x, y - s, C[5], a);
  p.line(x, y - s, x + s, y, C[4], a);
  p.line(x + s, y, x, y + s, C[5], a);
  p.line(x, y + s, x - s, y, C[4], a);
  p.line(x, y - s - 2, x, y + s + 2, C[6], a * 0.9);
  p.line(x - s - 2, y + phase, x + s + 2, y - phase, C[3], a * 0.7);
  p.px(x, y, C[6]);
}

export function scorch(p, C, rx, a, y = 0) {
  if (a <= 0 || rx < 1) return;
  for (let x = -Math.ceil(rx); x <= Math.ceil(rx); x++) {
    const q = Math.abs(x) / rx;
    if (q > 1) continue;
    const k = (1 - q * q) * a;
    p.dot(x, y, q < 0.35 ? C[1] : C[0], k);
    p.dot(x, y + 1, C[0], k * 0.55);
    if ((x & 3) === 0) p.glow(x, y - 1, 5, C[3], 0.08 * k);
  }
}
