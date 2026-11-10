import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '精灵箭', desc: 'A gathered spirit charge releases a silver arrow on leafy gold ribbons.', tags: ['archer', 'arrow', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);if(t>=.28&&t<.7){const u=(t-.28)/.42;ribbon(p,12+90*u,-24,65,0,t,C);}bloom(p,t,.7,102,-24,C,o.seed);}};}
