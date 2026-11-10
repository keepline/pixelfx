import assert from 'node:assert/strict';
import {effects} from '../src/fx/index.js';
import {resolveOptions} from '../src/core/index.js';
for(const [id,fx] of Object.entries(effects).filter(([id])=>/^(templar|frost-mage|crimson-assassin|dwarf-artificer)\//.test(id))){assert(fx.meta.actor,id+' supported actor');const a=resolveOptions(fx.meta).actor;assert.equal(a.identity,fx.identity);assert.equal(a.mask.data.length,a.pixels.length);assert(a.pixels.every((c,i)=>!!c===!!a.mask.data[i]));}
