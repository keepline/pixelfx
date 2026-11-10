import assert from 'node:assert/strict';
import {effects} from '../src/fx/index.js';
import {createFrame,painterFor,resolveOptions} from '../src/core/index.js';
for(const [id,fx] of Object.entries(effects).filter(([id])=>["templar","frost-mage","crimson-assassin","dwarf-artificer"].includes(id.split('/')[0]))){
 const frames=[.7,1,1.3].map(t=>{const f=createFrame(...fx.meta.size);fx.draw(painterFor(f).place(...fx.meta.origin),t,resolveOptions(fx.meta));return f;});
 assert(new Set(frames.map(f=>Buffer.concat([Buffer.from(f.color.buffer),Buffer.from(f.light.buffer)]).toString('base64'))).size===3,id+' frozen after release');
 // Steam exhaust trails behind the origin: circles x=8-v*41-(j%2)*3,
 // radius 5+9*v; speed streaks span local x=-39..49. Other primary
 // impacts occupy the target side (world x>100). Count occupied pixels once.
 const rear=id==='dwarf-artificer/steam-dash';
 const mass=f=>f.color.reduce((n,c,i)=>n+((c||f.light[i])&&(rear?i%f.w<fx.meta.origin[0]:i%f.w>100)?1:0),0);
 const masses=frames.map(mass);
 console.log(id, rear?'rear exhaust x<76':'target x>100', masses);
 assert(Math.max(...masses)>240,id+' insufficient primary area');
 const end=createFrame(...fx.meta.size);fx.draw(painterFor(end).place(...fx.meta.origin),fx.meta.duration,resolveOptions(fx.meta));
 assert(!end.color.some(Boolean)&&!end.light.some(Boolean),id+' failed recovery');
}
console.log('PASS temporal evolution and primary occupied area');