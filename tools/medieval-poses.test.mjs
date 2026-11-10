import assert from 'node:assert/strict';
import * as m from '../src/core/medieval.js';
assert.equal(typeof m.poseOf,'function');
const tracks=new Set();
for(let k=0;k<4;k++){const masks=new Set();for(let n=0;n<8;n++){
const ps=[.05,.7,2.3].map(t=>m.poseOf(k,n,t));
assert.equal(new Set(ps.map(JSON.stringify)).size,3);
assert(ps.every(p=>p.name.length>5&&Object.entries(p).every(([key,v])=>key==='name'||Number.isFinite(v))));
tracks.add(JSON.stringify(ps));const a=m.actorFactory(k,n)({palette:m.palettes[k]});a.setTime(.65);masks.add(JSON.stringify(Array.from(a.mask.data)));assert.equal(a.mask.data.length,a.pixels.length);
}assert.equal(masks.size,8);}assert.equal(tracks.size,32);
console.log('PASS 32 distinct pose tracks and normalized silhouettes');
