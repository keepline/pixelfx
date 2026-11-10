import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '灵鹰', desc: 'A luminous hawk stoops from above and tears through in a burst of spectral feathers.', tags: ['archer', 'hawk', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65], false, true);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);if(t>.28&&t<.85){const u=(t-.28)/.57,x=15+100*u,y=-108+88*u,wing=30+Math.sin(u*9)*6;p.glow(x,y,32,C[3],.5);for(let j=0;j<10;j++){const w=wing-j*1.5;p.beam(x-j*.7,y+j*.5,x-w,y-18+j*2,1.5,C[j%3?3:5],.85);p.beam(x-j*.7,y+j*.5,x+w*.7,y-22+j*2,1.5,C[j%3?3:5],.85);}p.beam(x-4,y-8,x+5,y+7,3,C[5],1);p.line(x+5,y+7,x+10,y+5,C[6]);p.line(x-3,y+2,x-12,y+17,C[4]);glint(p,x+5,y+4,C,.8);}if(t>.8&&t<1.05)p.arc(102,-22,32,4,-2,1,C[5],1-smooth(.8,1.05,t));bloom(p,t,.85,108,-22,C,o.seed);}};}
