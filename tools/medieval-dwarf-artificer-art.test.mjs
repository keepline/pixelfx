import assert from 'node:assert/strict';
import {Painter} from '../src/core/painter.js';
import {choreography} from '../src/core/medieval/dwarf.js';
const C=[0xff231720,0xff443444,0xff665466,0xff987050,0xffc99655,0xffffcf88,0xffffffff];
function render(i,t){const f={w:288,h:224,ox:0,oy:0,color:new Uint32Array(288*224),light:new Uint32Array(288*224)};const p=new Painter(f);p.place(76,152);choreography[i](p,t,1,1,C);return f.color;}
const count=f=>f.reduce((s,c)=>s+!!c,0);
for(let i=0;i<8;i++){const mid=render(i,.9),late=render(i,2.399);assert(count(mid)>90,`skill ${i} substantial release`);assert(count(late)<count(mid)*.08,`skill ${i} recovers internally`);assert.notDeepEqual(render(i,.45),mid,`skill ${i} moves after release`);let region=0;mid.forEach((c,k)=>{if(c&&k%288>111)region++;});if(i!==4)assert(region>70,`skill ${i} forward occupied region`);}
console.log('8 rendered temporal, recovery and occupied-region checks passed');
