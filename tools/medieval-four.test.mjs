import fs from 'node:fs';
import assert from 'node:assert/strict';
import {effects,categories} from '../src/fx/index.js';
import {createFrame,painterFor,resolveOptions} from '../src/core/index.js';
const kits={"templar":["圣殿骑士","holy-cleave:圣光斩","shield-bash:盾牌猛击","lance-charge:冲锋突刺","consecrated-ground:奉献圣地","guardian-rampart:守护壁垒","judgment-pillar:审判光柱","orbiting-hammer:回旋圣锤","angelic-descent:天使降临"],"frost-mage":["寒霜法师","ice-lance:冰枪","freezing-nova:霜冻新星","glacier-wall:冰墙","blizzard:暴风雪","ice-aegis:寒冰护盾","frozen-prison:冰封牢笼","comet-fall:彗星坠落","absolute-ray:极寒射线"],"crimson-assassin":["猩红刺客","crossed-daggers:双刃交叉","shadow-backstab:影袭背刺","smoke-screen:烟幕","flying-blades:飞刃","venom-burst:毒刃爆发","phantom-step:残影闪步","chain-hook:锁链钩索","crimson-execution:绯红处决"],"dwarf-artificer":["矮人工匠","quake-hammer:重锤震地","powder-bomb:火药炸弹","scatter-shot:散弹轰击","auto-turret:自动炮塔","steam-dash:蒸汽冲刺","magnetic-snare:磁力陷阱","forge-breath:熔炉喷焰","mechanical-airstrike:机械空袭"]};
let count=0;
for(const [cat,skills] of Object.entries(kits)){assert(categories.some(c=>c.id===cat));for(const entry of skills.slice(1)){const [id,name]=entry.split(':');const fx=effects[cat+'/'+id];assert(fx,cat+'/'+id);assert.equal(fx.meta.name,name);assert.equal(fx.identity,cat);assert.deepEqual(fx.action.phases,['anticipation','release','sustain','recovery']);const render=t=>{const f=createFrame(...fx.meta.size);fx.draw(painterFor(f).place(...fx.meta.origin),t,resolveOptions(fx.meta));return f;};assert.deepEqual(render(.6),render(.6));assert(render(.6).color.some(Boolean));assert(!render(fx.meta.duration).color.some(Boolean));assert.notDeepEqual(render(.1).color,render(.6).color);count++;}}
assert.equal(count,32);console.log('PASS 32 registrations, identities, phases, deterministic motion, terminal lifecycle');

const signatures=new Set();
for(const cat of Object.keys(kits))for(const entry of kits[cat].slice(1)){const fx=effects[cat+'/'+entry.split(':')[0]],calls=[];const p=new Proxy({}, {get:(_,key)=>(...args)=>calls.push([key,...args.map(x=>typeof x==='string'?'color':x)])});fx.draw(p,.8,resolveOptions(fx.meta));const signature=JSON.stringify(calls);assert(!signatures.has(signature),'duplicate geometry '+entry);signatures.add(signature);}

assert(!fs.readFileSync(new URL('../src/core/medieval.js',import.meta.url),'utf8').includes('switch(n)'), 'shared ordinal geometry must be removed');
