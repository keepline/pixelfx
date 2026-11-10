import assert from 'node:assert/strict';
import {Painter} from '../src/core/painter.js';
import {choreography} from '../src/core/medieval/assassin.js';
const C=[0x190b18,0x351023,0x65152c,0xa5213c,0xe44752,0xff9c91,0xffece0];
function draw(i,t){const f={w:288,h:224,ox:-76,oy:-152,color:new Uint32Array(288*224),light:new Uint32Array(288*224)};choreography[i](new Painter(f),t,1,1,C);return f.color;}
for(let i=0;i<8;i++){const frames=[.45,.75,1.05,1.4].map(t=>draw(i,t));const peak=Math.max(...frames.map(f=>f.filter(Boolean).length));assert(peak>180,`${i}: substantial occupied silhouette`);assert(draw(i,2.38).filter(Boolean).length<peak*.12,`${i}: recovery clears released pixels`);let target=0;for(const f of frames)for(let y=45;y<160;y++)for(let x=116;x<200;x++)if(f[y*288+x])target++;assert(target>150,`${i}: target region occupied after release`);}
console.log('Eight assassin rendered occupancy/recovery checks passed');
