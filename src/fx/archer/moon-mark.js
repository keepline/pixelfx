import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '月印', desc: 'A gentle silver crescent brands the quarry with a gold rim and drifting light.', tags: ['archer', 'mark', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);if(t>.3&&t<.52)p.glowLine(12,-24,90,-28,4,C[5],.35);if(t>.48){const k=smooth(.48,.65,t)*(1-smooth(1.35,1.95,t));p.glow(100,-32,43,C[5],k*.35);p.arc(100,-32,24,4,.65,5.6,C[5],k);p.arc(100,-32,27,1,.65,5.6,C[4],k);for(let j=0;j<12;j++){const a=j*TAU/12+t*.4;glint(p,100+Math.cos(a)*33,-32+Math.sin(a)*33,C,k*.6);}glint(p,100,-3,C,k*1.5);}}};}
