import assert from 'node:assert/strict';
import {Painter} from '../src/core/painter.js';
import {choreography} from '../src/core/medieval/knight.js';
const C=[0xff554433,0xff776655,0xff998877,0xffbbaa99,0xffddccaa,0xffffeebb,0xffffffff];
function pixels(i,t){const f={w:288,h:224,ox:0,oy:0,color:new Uint32Array(288*224),light:new Uint32Array(288*224)}; choreography[i](new Painter(f).place(76,152),t,1,1,C);return f.color;}
for(let i=0;i<8;i++){const active=pixels(i,.8),end=pixels(i,2.39);assert(active.filter(Boolean).length>150,`skill ${i} substantial release`);assert(end.filter(Boolean).length<active.filter(Boolean).length*.1,`skill ${i} recovers`); let outside=0;active.forEach((v,k)=>{let x=k%288-76,y=Math.floor(k/288)-152;if(v&&(x< -52||x>132||y< -134||y>40))outside++;});assert.equal(outside,0);assert.notDeepEqual(active,pixels(i,1.2),`skill ${i} evolves`);}
console.log('8 templar pixel timelines and occupied bounds passed');
