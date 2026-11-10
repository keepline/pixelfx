import assert from 'node:assert/strict';
import {Painter} from '../src/core/painter.js';
import {choreography} from '../src/core/medieval/mage.js';
const C=[0xff281408,0xff482410,0xff784020,0xffa87038,0xffd8b060,0xffffe0a0,0xfffffff0];
function render(i,t){const f={w:288,h:224,ox:0,oy:0,color:new Uint32Array(288*224),light:new Uint32Array(288*224)};choreography[i](new Painter(f).place(76,152),t,.7,1,C);return f.color;}
for(let i=0;i<8;i++){const mid=render(i,1),late=render(i,2.39);const count=b=>b.reduce((s,v)=>s+!!v,0);assert.ok(count(mid)>180,`skill ${i} substantial release`);assert.ok(count(late)<count(mid)*.12,`skill ${i} recovers`);let body=0;for(let y=112;y<145;y++)for(let x=65;x<94;x++)body+=!!mid[y*288+x];assert.ok(body<280,`skill ${i} preserves actor interior`);assert.notDeepEqual(render(i,.5),render(i,1.3),`skill ${i} evolves`);}
console.log('8 frost effects: release mass, recovery, actor clearance and temporal evolution passed');
