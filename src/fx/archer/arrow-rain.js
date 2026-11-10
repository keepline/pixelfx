import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '箭雨', desc: 'Many moonlit shafts descend across a glowing ground zone with dust and leaf scatter.', tags: ['archer', 'rain', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65,.83,1.01,1.19,1.415], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);for(let j=0;j<15;j++){const s=.3+j*.035,h=s+.38,u=(t-s)/.38,x=60+(j%5)*20;if(u>=0&&u<1){const y=-130+125*u;p.glowLine(x-8,y-24,x,y,5,C[3],.3);p.line(x-8,y-24,x,y,C[5]);p.line(x,y,x-5,y-4,C[6]);p.line(x,y,x+1,y-7,C[6]);}if(j%3===0)bloom(p,t,h,x,-3,C,o.seed+j);}}};}
