import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '缚藤箭', desc: 'A spirit arrow strikes first, then living vines climb and bind the struck target.', tags: ['archer', 'vine', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act = bowAct([.65], false, false);

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;charge(p,t,C);if(t>.28&&t<.62)ribbon(p,12+88*(t-.28)/.34,-24,35,0,t,C);bloom(p,t,.62,100,-8,C,o.seed);if(t>.65){const g=smooth(.65,1.25,t),k=1-smooth(1.4,1.95,t);for(let j=0;j<5;j++){const pts=[];for(let z=0;z<60*g;z++){const u=z/60;pts.push([100+Math.sin(u*7+j*1.5)*(9+u*8)+(j-2)*3,-u*65]);}for(let z=1;z<pts.length;z++)p.beam(...pts[z-1],...pts[z],2,C[3],k);p.polyline(pts.map(([x,y])=>[x+1,y]),C[4],k*.8);for(let z=5;z<pts.length;z+=10)leaf(p,...pts[z],j+z,C,k);}}}};}
