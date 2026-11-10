import assert from 'node:assert/strict';
import {character,medievalActor,palettes} from '../src/core/medieval.js';
for(let k=0;k<4;k++){
 const a=medievalActor(k,0), b=medievalActor(k,.09);
 assert.notDeepEqual(a.pixels,b.pixels,'idle breathing '+k);
 const masks=new Set(Array.from({length:8},(_,n)=>{const a=medievalActor(k,.8,palettes[k],n);return `${a.w},${a.h}:`+Array.from(a.mask.data).join('');}));
 assert.equal(masks.size,8,'eight distinct equipment poses '+k);
}
const source=await import('node:fs/promises').then(fs=>fs.readFile(new URL('../src/core/medieval.js',import.meta.url),'utf8'));
assert(!source.includes('base.beam(hx,hy,wx,wy,k===3?5:3'),'no shared blade equipment');
