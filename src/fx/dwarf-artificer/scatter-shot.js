import {skill,palettes,phases,actorFactory} from '../../core/medieval.js';
export const identity='dwarf-artificer';
export const action={phases,release:.3,recovery:1.4};
export const meta={actor:actorFactory(3,2),name:'散弹轰击',desc:'矮人工匠施放散弹轰击，蓄势、命中与余辉消散。',tags:['dwarf-artificer','medieval'],size:[288,224],origin:[76,152],duration:2.4,loop:false,fps:30,bg:'ground',options:{palette:palettes[3],seed:1}};
export function draw(p,t,o){skill(p,t,o,3,2);}
