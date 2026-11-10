import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '扇形连射', desc: 'Three staggered spirit arrows fan into separate glowing impacts.', tags: ['archer', 'fan', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65,.77,.89], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);for(let j=0;j<3;j++){const s=.28+j*.1,h=s+.45,u=(t-s)/.45,dy=(j-1)*28;if(u>=0&&u<1)ribbon(p,12+100*u,-24+dy*u,50,dy*.5,t,C);bloom(p,t,h,112,-24+dy,C,o.seed+j);}}};}
