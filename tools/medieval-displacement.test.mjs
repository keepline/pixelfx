import assert from 'node:assert/strict';
import {poseOf,character,medievalActor,palettes} from '../src/core/medieval.js';
import {createFrame,painterFor} from '../src/core/fx.js';
import {fit} from '../src/core/color.js';
const ramp=['#171122','#605080','#c09050','#fff0cc'];
for(const [k,n] of [[0,2],[3,4],[2,1],[2,5]])for(const C of [palettes[k],ramp])for(const flip of [false,true]){
 const raster=(pose,t)=>{const f=createFrame(320,224);character(painterFor(f).place(150,160,flip),t,k,fit(C,7),pose);return f.color;};
 const t=.9,q=poseOf(k,n,t),actual=raster(q,t),base=raster({...q,x:0,y:0},t);
 const center=a=>{let sum=0,count=0;a.forEach((c,i)=>{if(c){sum+=i%320;count++;}});return sum/count;};
 assert((center(actual)-center(base))*(flip?-1:1)>20,`${k}/${n} rendered movement`);
 // Every occupied pixel, including equipment, must undergo exactly the same translation.
 const dx=Math.round(q.x)*(flip?-1:1);base.forEach((c,i)=>{if(c)assert.equal(actual[i+dx],c);});
 const d=medievalActor(k,t,C,n);assert(d.chest[0]>20);assert(d.head[0]>20);
 for(let i=0;i<=240;i++){const a=medievalActor(k,i/100,C,n);if(a.alpha){assert(a.x>=-52&&a.x+a.w-1<=132&&a.y>=-134&&a.y+a.h-1<=40);}}
 assert.equal(poseOf(k,n,2.4).x,0);assert.equal(poseOf(k,n,3).x,0);
 assert.deepEqual(raster(poseOf(k,n,2.4),2.4),raster({...poseOf(k,n,2.4),x:0},2.4));
}
assert.equal(medievalActor(2,.4,palettes[2],1).pixels.some(Boolean),false);
assert(medievalActor(2,.51,palettes[2],1).x>30);
for(let k=0;k<4;k++)for(let n=0;n<8;n++)if(![[0,2],[3,4],[2,1],[2,5]].some(([a,b])=>a===k&&b===n))assert.equal(poseOf(k,n,.9).x,0);
console.log('PASS rendered displacement, complete raster translation, facing, palettes, safe bounds, blink and recovery');
