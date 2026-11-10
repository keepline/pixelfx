import {skill,palettes,phases,actorFactory} from '../../core/medieval.js';
export const identity='templar';
export const action={phases,release:.3,recovery:1.4};
export const meta={actor:actorFactory(0,6),name:'回旋圣锤',desc:'圣殿骑士施放回旋圣锤，蓄势、命中与余辉消散。',tags:['templar','medieval'],size:[288,224],origin:[76,152],duration:2.4,loop:false,fps:30,bg:'ground',options:{palette:palettes[0],seed:1}};
export function draw(p,t,o){skill(p,t,o,0,6);}
