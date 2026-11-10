import {skill,palettes,phases,actorFactory} from '../../core/medieval.js';
export const identity='frost-mage';
export const action={phases,release:.3,recovery:1.4};
export const meta={actor:actorFactory(1,0),name:'冰枪',desc:'寒霜法师施放冰枪，蓄势、命中与余辉消散。',tags:['frost-mage','medieval'],size:[288,224],origin:[76,152],duration:2.4,loop:false,fps:30,bg:'ground',options:{palette:palettes[1],seed:1}};
export function draw(p,t,o){skill(p,t,o,1,0);}
