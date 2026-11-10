import { fit, smooth, Rng, TAU, READY } from '../../core/index.js';
import { KIT, bowAct, charge, ribbon, bloom, leaf, glint } from './_lib.js';
export const meta = { name: '疾风步', desc: 'A backward bow dodge leaves wind ribbons, leaf echoes and dust at the feet.', tags: ['archer', 'step', 'spirit', 'one-shot'], size: [320, 224], origin: [88, 170], duration: 2.0, loop: false, fps: 30, bg: 'ground', options: { palette: KIT, seed: 7 } };
export const act={target:false,poses:[[-.1,{...READY,weapon:'bow'}],[.1,{...READY,weapon:'bow',crouch:5,lean:-8}],[.4,{...READY,weapon:'bow',x:-46,ghost:1}],[1.7,{...READY,weapon:'bow',x:-46}]],dust:[{t:.12,x:0,n:18,dir:1}]};

export function create(o){const C=fit(o.palette,7);let t=0;return {update(dt){t+=dt;},draw(p){if(t>=meta.duration-0.025)return;const k=1-smooth(.65,1.7,t),x=-46*smooth(0,.4,t);for(let j=0;j<6;j++){const xx=x+j*6;p.arc(xx,-19,16+j*2,1,-1.3,1.3,C[j%2?5:3],k*(1-j/8));for(let z=0;z<5;z++)leaf(p,xx+Math.sin(z+j+t*4)*10,-5-z*7,j+t*5,C,k*.7);}p.glow(x,-2,28,C[3],k*.3);for(let j=0;j<15;j++)p.disc(x+j*2,-2-Math.sin(j)*2-t*5,3,C[2],k*.12);}};}
