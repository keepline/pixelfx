# Medieval four: approved design and implementation

Four independent recognizable characters, eight skills each (32 total). This records the approved scope and current architecture; final visual acceptance remains with the supervisor.

## Templar (templar)

| Registered ID | Approved skill name |
|---|---|
| templar/holy-cleave | 圣光斩 |
| templar/shield-bash | 盾牌猛击 |
| templar/lance-charge | 冲锋突刺 |
| templar/consecrated-ground | 奉献圣地 |
| templar/guardian-rampart | 守护壁垒 |
| templar/judgment-pillar | 审判光柱 |
| templar/orbiting-hammer | 回旋圣锤 |
| templar/angelic-descent | 天使降临 |

## Frost mage (frost-mage)

| Registered ID | Approved skill name |
|---|---|
| frost-mage/ice-lance | 冰枪 |
| frost-mage/freezing-nova | 霜冻新星 |
| frost-mage/glacier-wall | 冰墙 |
| frost-mage/blizzard | 暴风雪 |
| frost-mage/ice-aegis | 寒冰护盾 |
| frost-mage/frozen-prison | 冰封牢笼 |
| frost-mage/comet-fall | 彗星坠落 |
| frost-mage/absolute-ray | 极寒射线 |

## Crimson assassin (crimson-assassin)

| Registered ID | Approved skill name |
|---|---|
| crimson-assassin/crossed-daggers | 双刃交叉 |
| crimson-assassin/shadow-backstab | 影袭背刺 |
| crimson-assassin/smoke-screen | 烟幕 |
| crimson-assassin/flying-blades | 飞刃 |
| crimson-assassin/venom-burst | 毒刃爆发 |
| crimson-assassin/phantom-step | 残影闪步 |
| crimson-assassin/chain-hook | 锁链钩索 |
| crimson-assassin/crimson-execution | 绯红处决 |

## Dwarf artificer (dwarf-artificer)

| Registered ID | Approved skill name |
|---|---|
| dwarf-artificer/quake-hammer | 重锤震地 |
| dwarf-artificer/powder-bomb | 火药炸弹 |
| dwarf-artificer/scatter-shot | 散弹轰击 |
| dwarf-artificer/auto-turret | 自动炮塔 |
| dwarf-artificer/steam-dash | 蒸汽冲刺 |
| dwarf-artificer/magnetic-snare | 磁力陷阱 |
| dwarf-artificer/forge-breath | 熔炉喷焰 |
| dwarf-artificer/mechanical-airstrike | 机械空袭 |

## Implemented architecture

Each src/fx/<category>/<skill>.js exports identity, action, meta and draw(p,t,o). The 32 modules use size [288,224], origin [76,152], 2.4 seconds, 30 fps, ground backdrop and seven-color ramps. src/core/medieval.js owns character(), poseOf(), medievalActor(), actorFactory() and skill(). Separate choreography arrays live in src/core/medieval/knight.js, mage.js, assassin.js and dwarf.js; skill dispatch selects these explicit functions rather than ordinal shared geometry.

meta.actor is actorFactory(characterIndex,skillIndex), an options-to-descriptor factory. resolveOptions invokes it only when options.actor is undefined. actorAlphaOf synchronizes descriptor.setTime(t) before returning the optional module actorAlpha result. drawActor delegates to descriptor.draw(p,alpha) when present. This uses the normal back/actor/front display contract; no forced act rig or mandatory act export. Raster mask, bounds, head and chest remain available to effect authors.

## Motion and visual requirements

Anticipation must read before release, followed by impact or sustained geometry and a readable recovery. Pose recipes move hands, weapons, lean and crouch; dash, throw, kneel, channel, recoil and execution should remain distinguishable. The assassin backstab includes deliberate temporary invisibility. Actor idle and casting art must remain recognizable with the actor toggle enabled. Effect geometry ends at 2.4 seconds; the display actor is separate, so an empty terminal effect buffer does not mean an empty composed preview.

Silhouettes: armored helmet, shield and sword for the templar; long robe and staff for the mage; hood, scarf and twin blades for the assassin; short broad body, goggles, beard and hammer for the dwarf. Preserve crisp pixel clusters, dark outlines, layered highlights and restrained additive glow.

Palettes (dark to bright):

- Templar: #171827, #36465c, #7289a0, #c1d6df, #c49b42, #ffe9a1, #ffffff
- Frost mage: #0c142b, #152b59, #285b91, #51a9cd, #8adeef, #c5faff, #ffffff
- Crimson assassin: #210f22, #491728, #85263d, #cb4353, #ed857b, #f9c5ad, #ffffff
- Dwarf artificer: #231c25, #503332, #985735, #c18a4d, #e7b66e, #ffe0a0, #ffffff

## Preservation constraints

Preserve existing archer, warlock, medusa and stock actor behavior, IDs, gallery controls, palette overrides, mirroring, seeding and transparent effect-only exports. Caller actor overrides take precedence. Do not retrofit these characters into the stock act skeleton. This documentation task changes no production code and performs no commits or pushes.

## Acceptance commands

Run node tools/medieval-four.test.mjs, node tools/medieval-actors.test.mjs and node tools/medieval-poses.test.mjs; then node tools/check.mjs and node tools/build-gallery.mjs. Render official artifacts with node tools/render.mjs templar frost-mage crimson-assassin dwarf-artificer --gif --zoom 1. After renders complete, run node records/medieval-four-validation/finalize.mjs.

## Self-review

The exact 32 IDs and names are enumerated above. Each ability has an independent named bespoke art function in its class choreography file. Animated poses drive hands, lean, crouch and weapon placement; templar sword/shield, mage staff, assassin twin blades and dwarf hammer remain class-specific. Shared character painting is separate from these four choreography files. Factory, clock and callback extensions are documented. Automated lifecycle checks establish effect-buffer behavior, not visual quality. Supervisor must still confirm recognizable silhouettes, distinct motion, clipping, toggle behavior and final artifacts; prior green logs do not certify the final render revision.

Richness correction: steamDash places ten exhaust circles behind the actor (local centers x=8-v*41-(j%2)*3, radii 5+9*v), with streaks beginning at x=-39. Its primary region is world x<76; the other abilities retain target x>100. Occupied color or additive-light pixels count once, with the same >240 minimum, three distinct release/sustain frames and empty terminal recovery. Final visual/GIF acceptance remains pending supervisor review.
