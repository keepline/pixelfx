import {skill,palettes,phases,actorFactory} from '../../core/medieval.js';
export const identity='crimson-assassin';
export const action={phases,release:.3,recovery:1.4};
export const meta={actor:actorFactory(2,5),name:'残影闪步',desc:'猩红刺客施放残影闪步，蓄势、命中与余辉消散。',tags:['crimson-assassin','medieval'],size:[288,224],origin:[76,152],duration:2.4,loop:false,fps:30,bg:'ground',options:{palette:palettes[2],seed:1}};
export function draw(p,t,o){skill(p,t,o,2,5);}
