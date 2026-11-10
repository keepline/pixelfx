import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '穿透光矢', desc: 'A long silver wind shaft pierces through with emerald ribbons and gold wake.', tags: ['archer', 'pierce', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);if(t>.28&&t<1.05){const u=smooth(.28,.55,t),k=1-smooth(.65,1.05,t);ribbon(p,12+190*u,-24,190*u,0,t,C,k);for(let j=0;j<4;j++)p.arc(65+j*35,-24,15,1,-1.4,1.4,C[5],k*.6);}bloom(p,t,.62,100,-24,C,o.seed);}};}
