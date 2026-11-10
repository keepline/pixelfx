import assert from 'node:assert/strict';
import {effects} from '../src/fx/index.js';
import {createFrame,painterFor,resolveOptions,drawActor,actorAlphaOf} from '../src/core/index.js';
import {Painter} from '../src/core/painter.js';
import {renderFrames} from './lib/fxlib.mjs';
const entries=Object.entries(effects).filter(([id])=>/^(templar|frost-mage|crimson-assassin|dwarf-artificer)\//.test(id));
assert.equal(entries.length,32);
const ramp=['#171122','#605080','#c09050','#fff0cc'];
let context='',outside=0;
for(const method of ['put','add','blendPx']){const original=Painter.prototype[method];Painter.prototype[method]=function(x,y,c,...rest){assert.notEqual(c,undefined,context+' undefined '+method);if(c&&(x-this.ox<0||y-this.oy<0||x-this.ox>=this.w||y-this.oy>=this.h)){outside++;assert.fail(`${context} ${method} outside (${x},${y}) canvas ${this.w}x${this.h}`);}return original.call(this,x,y,c,...rest);};}
for(const [id,fx] of entries){
 context=id;
 const a=resolveOptions(fx.meta).actor;assert.equal(a.identity,fx.identity);assert.notStrictEqual(a,resolveOptions(fx.meta).actor);assert.equal(resolveOptions(fx.meta,{actor:false}).actor,false);const custom={identity:'custom'};assert.strictEqual(resolveOptions(fx.meta,{actor:custom}).actor,custom);
 for(const palette of [undefined,ramp])for(const flip of [false,true]){
 const o=resolveOptions(fx.meta,{...(palette?{palette}:{}),flip});const ox=flip?288-1-76:76;
 // Cell centers mirror x to origin-x-1. Mirrored origin preserves framing up to that documented cell convention.
 for(let i=0;i<=72;i++){const t=i*fx.meta.duration/72;context=`${id} t=${t} ramp=${!!palette} flip=${flip}`;
 const render=()=>{const f=createFrame(288,224),p=painterFor(f).place(ox,152,flip);actorAlphaOf(fx,t,o);fx.drawBack?.(p,t,o);drawActor(p,o.actor);fx.draw(p,t,o);return f;};
 const f=render();assert.deepEqual(f,render(),context+' deterministic');
 if(i===72){const end=createFrame(288,224),p=painterFor(end).place(ox,152,flip);fx.drawBack?.(p,t,o);fx.draw(p,t,o);assert(!end.color.some(Boolean)&&!end.light.some(Boolean));assert(f.color.some(Boolean),'terminal idle actor');}
 }
 o.actor.setTime(.65);const d=o.actor,f=createFrame(288,224);drawActor(painterFor(f).place(ox,152,flip),d);const expected=new Uint32Array(288*224);
 d.pixels.forEach((c,i)=>{assert.equal(!!c,!!d.mask.data[i]);if(c){const x=d.x+i%d.w,y=d.y+Math.floor(i/d.w);expected[(152+y)*288+(flip?ox-x-1:ox+x)]=c;}});assert.deepEqual(f.color,expected,context+' descriptor direct raster');
 }
 const r=renderFrames({meta:fx.meta,mod:fx},{fps:10,bg:'none'}),n=renderFrames({meta:fx.meta,mod:fx},{fps:10,bg:'none',actor:false});let body=0;for(let y=110;y<152;y++)for(let x=55;x<100;x++){const i=(y*288+x)*4;if(r.frames[1].color[i+3]&&!n.frames[1].color[i+3])body++;}assert(body>100,id+' early body present only with actor');console.log('PASS',id);
}
assert.equal(outside,0);console.log('PASS all32; 73 times x 2 palettes x 2 flips; zero outside/undefined writes; deterministic, descriptor and official composition contracts');
