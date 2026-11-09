import { fit, TAU, sparkle, WHITE, cycle, ease, rand } from "../../core/index.js";
import { VOID, floorRing, glyph } from "./_lib.js";

export const meta = {
  name: "邪能法阵",
  desc: "An infernal ritual seal turns on the floor: layered runes, chasing light, rising violet motes.",
  tags: ["warlock", "ritual", "circle", "loop", "ground"],
  size: [136, 104],
  origin: [68, 82],
  duration: 1.8,
  loop: true,
  fps: 30,
  bg: "ground",
  options: { palette: VOID, seed: 8 },
};

const D = 1.8, SY = 0.26, R0 = 48, R1 = 36, R2 = 22, R3 = 9;

const at = (g, r) => [Math.cos(g) * r, Math.sin(g) * r * SY];

function layer(p, C, t, far) {
  const ph = (t / D) * TAU, chase = ph * 2;
  const keep = (g) => (Math.sin(g) < 0) === far;
  // concentric rings
  floorRing(p, C, R0, SY, 0.85, far);
  floorRing(p, C, R1, SY, 0.7, far);
  floorRing(p, C, R2, SY, 0.8, far);
  floorRing(p, C, R3, SY, 0.9, far);
  // rotating ticks on outer ring
  for (let j = 0; j < 18; j++) {
    const g = ph / 4 + ((j + 0.5) * TAU) / 18;
    if (!keep(g)) continue;
    const [x, y] = at(g, R0 + 3);
    const hot = Math.abs(Math.atan2(Math.sin(g - chase), Math.cos(g - chase))) < 0.35;
    p.px(x, y, hot ? WHITE : C[5]);
    if (j % 2 === 0) {
      p.dot(x + Math.cos(g), y + Math.sin(g) * SY, hot ? C[6] : C[4], 0.8);
    }
  }
  // mid runes
  for (let k = 0; k < 12; k++) {
    const g = ph / 3 + ((k + 0.5) * TAU) / 12;
    if (!keep(g)) continue;
    const [x, y] = at(g, (R0 + R1) * 0.5);
    const hot = Math.abs(Math.atan2(Math.sin(g - chase), Math.cos(g - chase))) < 0.28;
    glyph(p, x, y - 1, hot ? 2.6 : 2.1, C, hot ? 0.95 : 0.65, Math.sin(ph * 2 + k));
    p.glow(x, y - 2, hot ? 9 : 5, C[4], hot ? 0.35 : 0.14);
  }
  // inner triangle spinning opposite
  for (let k = 0; k < 3; k++) {
    const g0 = -ph / 2 + (k * TAU) / 3, g1 = -ph / 2 + ((k + 1) * TAU) / 3;
    if (!keep(g0) && !keep(g1)) continue;
    const [ax, ay] = at(g0, R2), [bx, by] = at(g1, R2);
    p.line(ax, ay, bx, by, far ? C[3] : C[5], 0.75);
  }
  // rising motes
  cycle(t, D, 40, (far ? 11 : 3) + 8, (r) => r.range(0.9, 1.6), (age, life, r) => {
    const g0 = r.range(0, TAU), q = age / life;
    if ((Math.sin(g0 + q) < 0) !== far) return;
    const rr = r.pick([R0, R1, R1, R2]) * (1 - 0.3 * q);
    const x = Math.cos(g0 + q * 0.8) * rr, y = Math.sin(g0 + q * 0.8) * rr * SY - ease.outQuad(q) * r.range(10, 28);
    const k = Math.min(1, q * 5) * (1 - smoothQ(q));
    p.dot(x, y, r.chance(0.25) ? WHITE : C[5], k);
    if (r.chance(0.3)) p.glow(x, y, 3, C[4], k * 0.25);
  });
  if (far) {
    p.glow(0, 0, R0 * 1.3, C[3], 0.2 + 0.06 * Math.sin(ph * 2));
    for (const s of [-1, 1]) p.glow(s * R0 * 0.5, 1, R0 * 0.55, C[4], 0.1);
  }
}

function smoothQ(q) {
  return q < 0.6 ? 0 : (q - 0.6) / 0.4;
}

export function drawBack(p, t, o) {
  layer(p, fit(o.palette, 7), t, true);
}
export function draw(p, t, o) {
  const C = fit(o.palette, 7), ph = (t / D) * TAU, chase = ph * 2;
  layer(p, C, t, false);
  // chase sparkles
  for (const g of [chase, chase + Math.PI]) {
    const [x, y] = at(g, R0);
    sparkle(p, x, y, 2.2 + Math.sin(t * 28) * 0.6, C[6], C[4], 0.55);
    p.glow(x, y, 12, C[5], 0.35);
  }
  // column of ritual light
  for (let h = 0; h < 40; h += 6) p.glow(0, -h, 18, C[3], 0.07 * (1 - h / 48) * (0.85 + 0.15 * Math.sin(ph * 3)));
}
