# Medieval Four Implementation Plan

> **For agentic workers:** Use checkboxes to track completion. Production implementation is complete; final rendering and acceptance belong to the supervisor. No commit or push steps are authorized.

**Goal:** Deliver four recognizable medieval actors and 32 distinct skills using the existing effect display contract.

**Architecture:** Pure effect modules, separate character choreography, optional animated actor descriptors.

**Tech stack:** JavaScript ESM, Node tools, software pixel painter, PNG/GIF exports.

## Templar - completed implementation

- [x] Add all eight modules under src/fx/templar/: holy-cleave.js, shield-bash.js, lance-charge.js, consecrated-ground.js, guardian-rampart.js, judgment-pillar.js, orbiting-hammer.js, angelic-descent.js.
- [x] Export identity='templar', action phases/release/recovery, meta with actorFactory(0,skillIndex), and draw(p,t,o).
- [x] Implement distinct choreography in src/core/medieval/knight.js and identity-specific pose recipes in src/core/medieval.js.
- [x] Register IDs in src/fx/index.js and category metadata; generated catalog includes all eight.
- [ ] Supervisor reviews all eight official GIFs and contacts for idle identity, anticipation, release, sustain/hit and recovery.

## Frost mage - completed implementation

- [x] Add all eight modules under src/fx/frost-mage/: ice-lance.js, freezing-nova.js, glacier-wall.js, blizzard.js, ice-aegis.js, frozen-prison.js, comet-fall.js, absolute-ray.js.
- [x] Export identity='frost-mage', action phases/release/recovery, meta with actorFactory(1,skillIndex), and draw(p,t,o).
- [x] Implement distinct choreography in src/core/medieval/mage.js and identity-specific pose recipes in src/core/medieval.js.
- [x] Register IDs in src/fx/index.js and category metadata; generated catalog includes all eight.
- [ ] Supervisor reviews all eight official GIFs and contacts for idle identity, anticipation, release, sustain/hit and recovery.

## Crimson assassin - completed implementation

- [x] Add all eight modules under src/fx/crimson-assassin/: crossed-daggers.js, shadow-backstab.js, smoke-screen.js, flying-blades.js, venom-burst.js, phantom-step.js, chain-hook.js, crimson-execution.js.
- [x] Export identity='crimson-assassin', action phases/release/recovery, meta with actorFactory(2,skillIndex), and draw(p,t,o).
- [x] Implement distinct choreography in src/core/medieval/assassin.js and identity-specific pose recipes in src/core/medieval.js.
- [x] Register IDs in src/fx/index.js and category metadata; generated catalog includes all eight.
- [ ] Supervisor reviews all eight official GIFs and contacts for idle identity, anticipation, release, sustain/hit and recovery.

## Dwarf artificer - completed implementation

- [x] Add all eight modules under src/fx/dwarf-artificer/: quake-hammer.js, powder-bomb.js, scatter-shot.js, auto-turret.js, steam-dash.js, magnetic-snare.js, forge-breath.js, mechanical-airstrike.js.
- [x] Export identity='dwarf-artificer', action phases/release/recovery, meta with actorFactory(3,skillIndex), and draw(p,t,o).
- [x] Implement distinct choreography in src/core/medieval/dwarf.js and identity-specific pose recipes in src/core/medieval.js.
- [x] Register IDs in src/fx/index.js and category metadata; generated catalog includes all eight.
- [ ] Supervisor reviews all eight official GIFs and contacts for idle identity, anticipation, release, sustain/hit and recovery.

## Shared interfaces and evidence

- [x] Extend src/core/fx.js option resolution for optional meta.actor(options); retain numeric/boolean stock defaults and explicit overrides.
- [x] Extend src/core/actor.js drawActor callback dispatch and actorAlphaOf pose clock.
- [x] Add tools/medieval-four.test.mjs, tools/medieval-actors.test.mjs and tools/medieval-poses.test.mjs.
- [x] Record initial red evidence in records/medieval-four-validation/red.log (registration assertion) and actor-red.log (actor extension assertion).
- [x] Record earlier green registration/identity/phase/determinism/lifecycle evidence in green.log and medieval-test.log. These are historical runs, not a claim that the final revision has passed every check.
- [x] Document public descriptor compatibility in docs/AUTHORING.md.

## Executor local final validation - complete

- [ ] Run node tools/medieval-four.test.mjs.
- [ ] Run node tools/medieval-actors.test.mjs and node tools/medieval-poses.test.mjs.
- [ ] Run node tools/check.mjs and node tools/build-gallery.mjs; retain actual exit codes under records/medieval-four-validation/.
- [ ] Finish node tools/render.mjs templar frost-mage crimson-assassin dwarf-artificer --gif --zoom 1.
- [ ] Run node records/medieval-four-validation/finalize.mjs only after official renders finish.
- [ ] Inspect four overview PNGs and all 32 GIF/contact pairs; verify identity, motion, clipping, palette/flip and actor toggle in gallery.
- [ ] Review final manifest dimensions, byte counts and all delivery files. No commit/push.


## Executor final evidence (2026-11-10 17:14:09 Asia/Shanghai)
All ten medieval tests pass; full check293 pass/0fail with existing warlock performance warning only; all32 official GIF/contact exports and 73-frame GIF decode pass; all4x8 final contact overviews visually inspected; built gallery bundle contains32/32 IDs. See records/medieval-four-validation/report.md and raw logs. Browser-driven deployment acceptance and commit/push remain parent tasks. Earlier unchecked supervisor items above are historical checklist entries, superseded by this evidence.
