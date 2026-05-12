import { useState, useMemo, useEffect } from "react";

const ROLE_COLOR = { Attacker:"#e85c5c", Defender:"#5c9ee8", Supporter:"#5ce880", Support:"#5ce880" };
const ROLE_BG   = { Attacker:"#2d1414", Defender:"#14202d", Supporter:"#142d1a", Support:"#142d1a" };
const TYPE_COLOR = { Fire:"#e85c30",Ice:"#5cb8e8",Lightning:"#f0c030",Wind:"#5ce870",Shot:"#8aaccc",Slash:"#e8a45c",Blunt:"#b87cd0" };

const CHARACTERS = [
  // ── AKARI MINASE ─────────────────────────────────────────────────────────
  { id:"am-fc", name:"Akari Minase", variant:"Festive Christmas", parent:"Akari Minase",
    role:"Attacker", type:["Shot","Fire"], ailment:"Burn / Flare-Up",
    weapons:["AR-Xmas 25","AR-Hyperion","AR-Narwhal 59"],
    uniparts:"Fungal-Type β", priority:"ATK > Effect Hit Rate > Fire DMG Dealt",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Follow-Up Skill",2],["Normal Attack",1]],
    skills:[
      {name:"Normal Attack",title:"Devoted Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Radiant Grenade",desc:"Before attacking, applies DoT DMG Multiplier +25.6% (2 turns) to self. Max 3 stacks. Deals Shot and Fire DMG equal to 72% ATK to single Kaiju; 36% ATK to adjacent.",ugc:90,sp:1,type:"Shot / Fire",range:"Blast"},
      {name:"Ultimate",title:"Support Request",desc:"Deals Shot and Fire DMG equal to 109% ATK to all Kaiju. 100% base chance to apply Burn (3 turns). Burn: Fire DoT equal to 32% ATK.",ugc:"300★",sp:"—",type:"Shot / Fire",range:"AoE"},
      {name:"Follow-Up Skill",title:"Brilliant Shot",desc:"Deals Shot and Fire DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Fire",range:"Single Target"},
    ],
    passive:{name:"Exceptional Enthusiasm",desc:"After Combat Skill or Follow-Up Skill, 80% chance to apply Burn (2 turns). Burn: Fire DoT equal to 46.3% ATK. Before Ultimate, applies Flare-Up to target — after ally attacks that Kaiju, triggers 22% of DoT from each status ailment (max 7 activations)."},
    addPassives:[["Lv.40 — Surging Spirit","At wave start, applies Flare-Up to all Kaiju."],["Lv.60 — By-The-Book","Effect Hit Rate +20%."],["Lv.80 — Fervent Stance","After attacking Kaiju in Burn state, DMG dealt +15% (2 turns)."]],
    ascensions:[["A1","★★★★","Smooth Execution","After applying a status ailment, DMG dealt +15% (2 turns)."],["A2","★★★★★","Tactful Action","DoT DMG Multiplier +50% at battle start (1 turn). Wave start: 100% chance Burn (3 turns) to all Kaiju."],["A3","★★★","Third Division Helper","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Overflowing Energy","Before Combat Skill: Fire DMG dealt +20% (1 turn). After Ultimate: Charge Rate +15% (2 turns)."],["A5","★★★","Cheerful Santa Claus","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Beacon of the Holy Night","DoT DMG Multiplier +80%."]],
    statusNotes:["Burn — Fire DoT at start of action.","Flare-Up — After ally attacks, triggers % of each DoT the target is receiving (max 7 activations)."] },

  { id:"am-hc", name:"Akari Minase", variant:"Heart of Compassion", parent:"Akari Minase",
    role:"Defender", type:["Shot"], ailment:"—",
    weapons:["AR-Crius","AR-Honeybee 84","—"],
    uniparts:"Ant-Type", priority:"HP > Healing Multiplier > SPD",
    medal:"Kaiju No. 2",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Relentless Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:48,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Comprehensive Support",desc:"Recovers a single ally's HP equal to 9.6% Max HP +88. Applies Ultimate Gauge Charge Rate +11% (3 turns) to target.",ugc:72,sp:1,type:"—",range:"Recovery"},
      {name:"Ultimate",title:"Rapid First Aid",desc:"Recovers all allies' HP equal to 9.5% Max HP +77.",ugc:"300★",sp:"—",type:"—",range:"Recovery"},
      {name:"Follow-Up Skill",title:"Considerate Support",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Former Health Committee Member",desc:"When recovering an ally with 25% or less HP, Healing Multiplier +11%."},
    addPassives:[["Lv.40","After receiving an attack, 35% fixed chance to remove 1 status ailment."],["Lv.60","When HP ≤50%, chance of being targeted slightly decreases."],["Lv.80","Healing Multiplier +10%."]],
    ascensions:[["A1","★★★","Gradual Preparation","Effect RES +15%."],["A2","★★★★","Practical Experience","After Ultimate, Healing Multiplier +15% (2 turns)."],["A3","★★★","Teachings of the Third Division","Normal Attack, Ultimate Lv. +2 / Max Lv. +2."],["A4","★★★★","Advantage from Adversity","After receiving an attack, Ultimate Gauge +15."],["A5","★★★","Overflowing Affinity","Combat Skill, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Miracle of Compassion","If any ally (not self) becomes incapacitated, recover 10% Max HP and revive. 1x per battle."]],
    statusNotes:[] },

  { id:"am-sa", name:"Akari Minase", variant:"Synchro Aptitude", parent:"Akari Minase",
    role:"Defender", type:["Shot","Slash"], ailment:"—",
    weapons:["—","—","—"], uniparts:"—", priority:"—", medal:"—",
    skillPrio:[["Combat Skill",5],["Ultimate",4],["Passive Skill",3],["Follow-Up Skill",2],["Normal Attack",1]],
    skills:[
      {name:"Normal Attack",title:"Riatla: Sentry Mode",desc:"Details TBD.",ugc:"—",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Riatla: Relief Mode",desc:"Details TBD.",ugc:90,sp:1,type:"—",range:"Recovery"},
      {name:"Ultimate",title:"Riatla: Full Drive",desc:"Details TBD.",ugc:"300★",sp:"—",type:"Shot",range:"AoE"},
      {name:"Follow-Up Skill",title:"Synchronized Pursuit",desc:"Details TBD.",ugc:"—",sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"FD-Riatla",desc:"Details TBD."},
    addPassives:[["Lv.40 — Avian Assault","Extra Attack and Overflow Attack CRIT Rate +100%."],["Lv.60 — Integrated Care","After Combat Skill, randomly removes 1 of target's debuffs."],["Lv.80 — Resonating Hearts","If Max HP ≥6,300, Overflow Attack DMG Multiplier +150%."]],
    ascensions:[["A1","—","Vanguard Wings","Revive incapacitated ally with 30% HP (1x/battle). After Overflow Attack, DEF PEN Rate +20% (2 turns) to all allies."],["A2","—","Predatory Bird's-Eye View","Patrol max stack −1. After Combat Skill, DMG dealt +30% (2 turns) to target."],["A3","—","Rekindled Purpose","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","—","Compassionate Overwatch","DMG Dealt +30%, CRIT DMG +60%, Healing Multiplier +30%."],["A5","—","Connected Souls","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","—","Synchro Mastery","CRIT DMG buff before Extra Attack stacks up to 2. After Ultimate, CRIT DMG +50% (3 turns)."]],
    statusNotes:["Overflow, Patrol, Surveillance debuffs apply."] },

  // ── AOI KAGURAGI ─────────────────────────────────────────────────────────
  { id:"ak-fd", name:"Aoi Kaguragi", variant:"Fruits of Diligence", parent:"Aoi Kaguragi",
    role:"Defender", type:["Blunt"], ailment:"—",
    weapons:["HM-Nohpyt","HM-Canasta","—"],
    uniparts:"Bovine-Type", priority:"DEF > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",5],["Normal Attack",3],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Steadfast Swing",desc:"Deals Blunt DMG equal to 55% DEF to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Stalwart Stance",desc:"Applies a Shield (3 turns) equal to 11.6% DEF +11 to all allies.",ugc:90,sp:1,type:"—",range:"Defense"},
      {name:"Ultimate",title:"Fortified Crushing Blow",desc:"Deals Blunt DMG equal to 249% DEF to a single Kaiju. Applies Wound (3 turns): DMG Taken +6.4%, +13.7% if Core Exposed.",ugc:"300★",sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Skillful Bash",desc:"Deals Blunt DMG equal to 60% DEF to a single Kaiju. After attacking, DMG Taken Reduction +7.7% (1 turn) to self.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
    ],
    passive:{name:"Mastered Combat Style",desc:"When ally attacks Kaiju in Wound state, attacker's DMG dealt +9.6%. After Combat Skill: +1 Unyielding (max 15). Each PLT destroyed: +1 Unyielding. Ally attacks Core Exposed: +2 Unyielding. At max stacks: Normal Attack DMG Multiplier +22% (2 turns), Shield to all allies, consume all Unyielding."},
    addPassives:[["Lv.40 — Frontline Advance","Chance of being targeted increases."],["Lv.60 — Honed Basics","After Normal Attack, Ultimate Gauge +20."],["Lv.80 — Pillar of Morale","Allies with a Shield: DMG Taken Reduction +10%."]],
    ascensions:[["A1","★★★★★","Indomitable Will","After ally attacks Kaiju in Wound state, attacker: DMG dealt +15% (1 turn), CRIT DMG +20% (1 turn)."],["A2","★★★★★","Steadfast Support","Battle start: Shield (3 turns) to all allies. Wound: Core Exposed DMG Taken +20% additionally."],["A3","★★★","Absolute Composure","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★","Impenetrable Guard","After Ultimate, 200% chance to apply Taunt (2 turns)."],["A5","★★★","Proven Results","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Accumulated Might","Unyielding max stack −5. After Ultimate, recover all allies' HP by 200."]],
    statusNotes:["Taunt — Cannot choose targets other than the Kaiju that applied it.","Wound — Increases DMG taken; more if Core Exposed."] },

  { id:"ak-prs", name:"Aoi Kaguragi", variant:"The Promising Rising Star", parent:"Aoi Kaguragi",
    role:"Attacker", type:["Shot","Wind"], ailment:"Windbite",
    weapons:["AR-Hyperion","AR-Cronus","AR-Narwhal 59"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > Wind DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Combat Skill",4],["Passive Skill",3],["Ultimate",2],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Military-Style Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Violent Wind Blast",desc:"Deals Shot and Wind DMG equal to 74% ATK to single Kaiju. 100% chance to apply Windbite (2 turns). Windbite: Wind DoT equal to 32% ATK.",ugc:90,sp:1,type:"Shot / Wind",range:"Single Target"},
      {name:"Ultimate",title:"Wild Shot",desc:"Deals Shot DMG equal to 165% ATK to a single Kaiju. After attacking, SPD +25 (2 turns) to self.",ugc:"300★",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Exemplary Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Unparalleled Training",desc:"Each PLT destroyed: ATK +3.2%, DEF +1.6% (max 5 stacks). On turn start: recover HP equal to 2.7% Max HP +20."},
    addPassives:[["Lv.40 — Remarkable Core Strength","Wave start: DMG Taken Reduction +25% (3 turns)."],["Lv.60 — Honed Physical Strength","Normal Attack and Combat Skill DMG dealt +15%."],["Lv.80 — Acquired Mobility","After Ultimate, advance next Action Order by 20%."]],
    ascensions:[["A1","★★★★","Cautious Movements","After attacking, 50% fixed chance ATK +10% (2 turns)."],["A2","★★★★★","Unflinching Integrity","After Combat Skill, randomly removes 1 of this unit's debuffs."],["A3","★★★","Young Rising Star","Normal Attack, Ultimate Lv. +2 / Max Lv. +2."],["A4","★★★","Unassuming Assurance","After Combat Skill, Effect RES +20% (2 turns)."],["A5","★★★","Mature Spirit","Combat Skill, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★","Exceptional Stamina","After defeating Kaiju with Ultimate, Ultimate Gauge Charge Rate +30% (2 turns)."]],
    statusNotes:["Windbite — Inflicts Wind DoT at start of action."] },

  // ── CHESTER ──────────────────────────────────────────────────────────────
  { id:"chester-ar", name:"Chester", variant:"The All-Rounder", parent:"Chester",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["AR-Anollococ","AR-Hyperion","AR-Lynx 75"],
    uniparts:"Lizard-Type", priority:"ATK > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Skilled Shooting",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:72,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Cool-Headed Command",desc:"Applies Wit and Courage (3 turns) to self: all other allies' ATK +19.2% of this unit's ATK.",ugc:108,sp:1,type:"—",range:"Support"},
      {name:"Ultimate",title:"Meticulous Planning",desc:"DMG dealt +13.7% (2 turns) and CRIT Rate +12.6% (2 turns) to all allies. Advances all other allies' next Action Order by 10.5%.",ugc:"300★",sp:"—",type:"—",range:"Support"},
      {name:"Follow-Up Skill",title:"Swift Support",desc:"Deals Shot DMG equal to 77% ATK to a single Kaiju.",ugc:72,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Field Command",desc:"After Combat Skill or Ultimate, applies Field Ops (1 turn) to all other allies. Field Ops: after attacking, deals Shot Additional DMG equal to 16.5% of attacker's ATK."},
    addPassives:[["Lv.40 — First Move Focus","Battle start: advance Action Order by 25%."],["Lv.60 — Boots on the Ground","While in Wit and Courage state, DMG dealt +20%."],["Lv.80 — Battle Routine","After Normal Attack, Ultimate Gauge +20."]],
    ascensions:[["A1","★★★★★","Ultimate Wit and Courage","While ally is in Field Ops state, DMG dealt +30%."],["A2","★★★★","Offensive Formation","After Ultimate, DEF PEN Rate +20% (2 turns) to all allies."],["A3","★★★","CLOZER's Paragon","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Battle-Forged Veteran","After receiving attack: DEF +20% (2 turns), DMG Taken Reduction +15% (2 turns)."],["A5","★★★","Versatile Operative","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Flawless Execution","Ultimate DMG dealt buff duration +1 turn. Passive Additional DMG Multiplier +50%."]],
    statusNotes:["Field Ops — Shot Additional DMG after attacking (1 turn).","Wit and Courage — All other allies' ATK increased."] },

  // ── EIJI HASEGAWA ────────────────────────────────────────────────────────
  { id:"eiji-rhs", name:"Eiji Hasegawa", variant:"Right-Hand Man of the Strongest", parent:"Eiji Hasegawa",
    role:"Attacker", type:["Blunt","Shot"], ailment:"Stun",
    weapons:["PS-Dobermann 52","—","—"],
    uniparts:"Fungal-Type", priority:"ATK > CRIT Rate / CRIT DMG > Shot / Blunt DMG Dealt",
    medal:"Kaiju No. 2",
    skillPrio:[["Passive Skill",4],["Combat Skill",3],["Follow-Up Skill",2],["Normal Attack",1],["Ultimate",1]],
    skills:[
      {name:"Normal Attack",title:"Efficient Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:51,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Powered Blow",desc:"Deals Blunt DMG equal to 116% ATK to a single Kaiju. 80% chance to apply Stun (1 turn).",ugc:76,sp:1,type:"Blunt",range:"Single Target"},
      {name:"Ultimate",title:"Magnificent Bombardment",desc:"Deals Shot DMG equal to 89% ATK to all Kaiju.",ugc:"300★",sp:"—",type:"Shot",range:"AoE"},
      {name:"Follow-Up Skill",title:"Efficient Snipe",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Acting Commander",desc:"After any ally activates Combat Skill or Follow-Up Skill, +1 Progress (max 5). At max Progress: CRIT Rate +16.5% (2 turns), CRIT DMG +33% (2 turns), then consume all Progress."},
    addPassives:[["Lv.40 — Simplicity and Strength","Follow-Up Skill DMG Multiplier +50%."],["Lv.60 — Proficiency in Neutralization","Follow-Up Skill DMG dealt +18%."],["Lv.80 — According to Plan","After defeating Kaiju, ATK +20% (2 turns)."]],
    ascensions:[["A1","★★★","Rapid Advance","Each PLT destroyed: Ultimate Gauge +15."],["A2","★★★★★","Command Multitasking","After Combat Skill, 50% fixed chance SP +1."],["A3","★★★","Acting Captain Duties","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★★","Frontline Deployment","Progress max stack −1."],["A5","★★★","First Division's Hard Worker","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★","Solid Competence","After Follow-Up Skill, advance next Action Order by 50%."]],
    statusNotes:["Stun — Prevents acting; increases CRIT DMG taken.","Progress — CRIT Rate and CRIT DMG at max stacks."] },

  // ── GEN NARUMI ───────────────────────────────────────────────────────────
  { id:"gn-fs", name:"Gen Narumi", variant:"Future Sight", parent:"Gen Narumi",
    role:"Attacker", type:["Slash","Shot"], ailment:"—",
    weapons:["GS-Oyamatsumi","GS-3305","GS-Takamimusubi"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT DMG > Slash / Shot DMG Dealt",
    medal:"Kaiju No. 1",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Precognitive Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Booming Slash",desc:"Deals Slash and Shot DMG equal to 126% ATK to a single Kaiju. When attacking Core Exposed Kaiju, recover 1 SP.",ugc:90,sp:1,type:"Slash / Shot",range:"Single Target"},
      {name:"Ultimate",title:"Seven-Branched Sword",desc:"Before attacking, applies Seen Through to target. Deals Slash and Shot DMG equal to 313% ATK. Seen Through: after 5 ally attacks, removes state and destroys 3 PLT.",ugc:"300★",sp:"—",type:"Slash / Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Flawless Follow-Up",desc:"Deals Slash and Shot DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Shot",range:"Single Target"},
    ],
    passive:{name:"Created Opportunity",desc:"After an ally attacks a Kaiju in Seen Through state, that attacker's DMG dealt +16.5% (2 turns)."},
    addPassives:[["Lv.40 — Absolute Range Control","Wave start: Ultimate Gauge Charge Rate +100% (2 turns)."],["Lv.60 — Precognitive Eyes","When attacking Kaiju with ≤80% HP, CRIT Rate +20%."],["Lv.80 — Accumulated Results","Each PLT destroyed: ATK +4% (max 5 stacks)."]],
    ascensions:[["A1","★★★★","Overwhelming Pride","After Combat Skill, Ultimate Gauge +30."],["A2","★★★★★","Unbreakable Stratagem","After attacking Kaiju in Seen Through state, Combat Skill DMG Multiplier +25% (max 3 stacks)."],["A3","★★★","User of the Oldest Power","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Preemptive Onslaught","When attacking Core Exposed Kaiju, DEF PEN Rate +24%."],["A5","★★★","Cultivated Power","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Tenacious Ace in the Hole","After Ultimate, advance next Action Order by 50%."]],
    statusNotes:["Seen Through — After 5 ally attacks, removed and 3 PLT destroyed. Core Exposed attacks don't count toward the 5."] },

  { id:"gn-jsc", name:"Gen Narumi", variant:"Japan's Strongest Combatant", parent:"Gen Narumi",
    role:"Attacker", type:["Slash","Shot"], ailment:"—",
    weapons:["GS-3305","GS-Takamimusubi","GS-Amatsu Mikaboshi"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG > Slash / Shot DMG Dealt",
    medal:"Kaiju No. 1",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Brilliant Strike",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:54,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Eruption Slash",desc:"Deals Slash and Shot DMG equal to 90% ATK to single Kaiju; 45% ATK to adjacent.",ugc:81,sp:1,type:"Slash / Shot",range:"Blast"},
      {name:"Ultimate",title:"Slash Salvo",desc:"Deals Slash and Shot DMG equal to 159% ATK to single Kaiju; 80% ATK to adjacent.",ugc:"300★",sp:"—",type:"Slash / Shot",range:"Blast"},
      {name:"Follow-Up Skill",title:"Skyfall Strike",desc:"Deals Slash DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Way of the Strongest",desc:"Before Combat Skill: if Ultimate Gauge <50%, SPD +9.6% (1 turn); if ≥50%, DMG dealt +9.6% (1 turn)."},
    addPassives:[["Lv.40 — Ultimate Awakening","Ultimate DMG dealt +20%."],["Lv.60 — Eyes on the Kaiju","When attacking Core Exposed Kaiju, DMG dealt +20%."],["Lv.80 — Unmatched Speed","When causing Core Exposed via Combat Skill, advance Action Order by 20%."]],
    ascensions:[["A1","★★★★","Brilliant Combat","Combat Skill DMG dealt +20%."],["A2","★★★★★","Unstoppable Advantage","After Combat Skill, CRIT Rate +10% (max 3 stacks)."],["A3","★★★","Will to Surpass the Wall","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Greater Advancement","After defeating Kaiju, Ultimate Gauge +45."],["A5","★★★","Strength Comes First","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","The Essence of His Genius","After Combat Skill, Combat Skill DMG Multiplier +5% (max 3 stacks)."]],
    statusNotes:[] },

  { id:"gn-jss", name:"Gen Narumi", variant:"Japan's Strongest Santa", parent:"Gen Narumi",
    role:"Attacker", type:["Slash","Ice"], ailment:"—",
    weapons:["GS-Xmas 25","GS-3305","GS-Takamimusubi"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT DMG > SPD",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Dazzling Strike",desc:"Deals Slash and Ice DMG equal to 34% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Ice",range:"Single Target"},
      {name:"Combat Skill",title:"Exceptional Onslaught",desc:"Consumes 2 SP. Deals Slash and Ice DMG equal to 233% ATK to single Kaiju; 44% to adjacent. After attacking, Shot Additional DMG equal to 32% ATK.",ugc:90,sp:2,type:"Slash / Ice",range:"Blast"},
      {name:"Ultimate",title:"Magnificent Posing",desc:"Applies Combat Skill DMG Multiplier +28.3% (2 turns). Advances Action Order by 100%. SP +2.",ugc:"300★",sp:"—",type:"—",range:"Enhance"},
      {name:"Follow-Up Skill",title:"Ultra Generous Support",desc:"Deals Slash and Ice DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Ice",range:"Single Target"},
    ],
    passive:{name:"Ace in the Hole",desc:"After Combat Skill or Ultimate, +1 stack of Hyped (max 6). Hyped: ATK +2.3%, CRIT DMG +3.4%."},
    addPassives:[["Lv.40 — Vigilant Demeanor","After Combat Skill, Effect RES +35% (2 turns)."],["Lv.60 — Sharp-Eyed Strategy","Battle start: Ultimate Gauge +60."],["Lv.80 — Christmas Eve Dispatch","After PLT destroyed, CRIT DMG +24% (1 turn)."]],
    ascensions:[["A1","★★★★","Successful Promotion","After Combat Skill, CRIT Rate +5% (max 3 stacks)."],["A2","★★★★","In the Spotlight","Before Combat Skill, DEF PEN Rate +15% (2 turns)."],["A3","★★★","Calculated Demeanor","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Smart Neutralization","When HP ≥50%, Ultimate Gauge Charge Rate +16%."],["A5","★★★","Carefree Santa Claus","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Peak Performance","Hyped max stack +4. After Combat Skill or Ultimate, applies 2 stacks of Hyped instead of 1."]],
    statusNotes:["Hyped — ATK and CRIT DMG increased per stack."] },

  // ── HAKUA IGARASHI ───────────────────────────────────────────────────────
  { id:"hi-sp", name:"Hakua Igarashi", variant:"Sincerity and Potential", parent:"Hakua Igarashi",
    role:"Defender", type:["Shot","Fire"], ailment:"—",
    weapons:["AR-Allosaurus 77","AR-Squid 62","—"],
    uniparts:"Bovine-Type", priority:"DEF > Healing Multiplier > SPD",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Earnest Shot",desc:"Deals Shot DMG equal to 55% DEF to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Direct Encouragement",desc:"Applies Patience (2 turns) to all allies. Patience: on turn start, recovers HP equal to 5.3% applier's DEF +48.",ugc:90,sp:1,type:"—",range:"Recovery"},
      {name:"Ultimate",title:"Determined Volley",desc:"Deals Shot and Fire DMG equal to 94% DEF to single Kaiju and adjacent.",ugc:"300★",sp:"—",type:"Shot / Fire",range:"Blast"},
      {name:"Follow-Up Skill",title:"Eager Pursuit",desc:"Deals Shot DMG equal to 55% DEF to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Sunny Disposition",desc:"All allies' Fire DMG dealt +16.5%. After ally in Patience state activates Ultimate, recover activator's HP equal to 8.8% of applier's DEF +33."},
    addPassives:[["Lv.40 — Sturdy Build","When HP ≥50%, DEF +25%."],["Lv.60 — Superb Recovery","All allies' Blast and AoE DMG +10%. After Ultimate, Healing Multiplier +10% (2 turns)."],["Lv.80 — Soothing Presence","After Combat Skill, remove 1 debuff/ailment from all allies."]],
    ascensions:[["A1","★★★★","Exceptional Toughness","On turn start, Ultimate Gauge +15."],["A2","★★★★","Unwavering Patience","After Ultimate, DMG Taken Reduction +10% (2 turns) to all allies."],["A3","★★★","Sincere Nature","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★★","Tenacious Spirit","While ally is in Patience state, their Ultimate DMG dealt +15%."],["A5","★★★","Glimmer of Talent","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Culminated Effort","Fire DMG dealt buff from Passive +20%."]],
    statusNotes:["Patience — Recovers HP on turn start."] },

  // ── HARUICHI IZUMO ───────────────────────────────────────────────────────
  { id:"hiz-cc", name:"Haruichi Izumo", variant:"Calculated Choice", parent:"Haruichi Izumo",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["AW-Kokyab","AW-Scopone","Standard Bow"],
    uniparts:"Fungal-Type", priority:"ATK > CRIT DMG > SPD",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Dexterous Snap-Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Suppressive Stance",desc:"Applies to single ally: Combat Skill DMG dealt +27.5% (1 turn), SPD +7.8% (1 turn), and True Potential (1 turn). True Potential: CRIT DMG increased by 32% of this unit's CRIT DMG. Cannot target self.",ugc:90,sp:1,type:"—",range:"Support"},
      {name:"Ultimate",title:"Manifold Arrow Salvo",desc:"CRIT Rate +100% for this attack. Deals Shot DMG equal to 69% ATK to all Kaiju. After attacking, applies Assistance (3 turns): battle buddy's All-Attribute DMG dealt +19.2%.",ugc:"300★",sp:"—",type:"Shot",range:"AoE"},
      {name:"Follow-Up Skill",title:"Focused True-Shot",desc:"Deals Shot DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Universal Support",desc:"After this unit or battle buddy activates Combat Skill, +1 Clarity (max 3). Clarity: CRIT DMG +10%. At max Clarity, consume all and SP +1. After Combat Skill, battle buddy ATK +26.4% (2 turns)."},
    addPassives:[["Lv.40 — State of Immersion","After Combat Skill, battle buddy: ST and Blast Attack DMG dealt +30% (1 turn)."],["Lv.60 — Composed Spirit","Battle start: applies Assistance (3 turns) to self."],["Lv.80 — Unwavering Rapid-Fire","After Normal Attack, advance Action Order by 50% (1x every 2 turns)."]],
    ascensions:[["A1","★★★★","Flawless Arrangements","True Potential also grants target CRIT Rate +20% and DMG dealt +20%."],["A2","★★★★★","Keen Suppression","After Ultimate, CRIT DMG +80% (3 turns) to self."],["A3","★★★","Superior Judgment","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★★","Essence of Archery","Assistance buff targets all allies instead of just battle buddy."],["A5","★★★","The Path Discovered","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Distinguished Choice","Combat Skill buff durations +1 turn."]],
    statusNotes:["Assistance — Battle buddy's All-Attribute DMG dealt increased.","Clarity — CRIT DMG increased.","True Potential — CRIT DMG increased; cannot be overwritten by weaker effects."] },

  { id:"hiz-cce", name:"Haruichi Izumo", variant:"The Clean-Cut Elite", parent:"Haruichi Izumo",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["AR-Hyperion","AR-Panther 33","AR-Octopus 58"],
    uniparts:"Wyvern-Type", priority:"HP / DEF > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 2",
    skillPrio:[["Passive Skill",4],["Ultimate",3],["Combat Skill",2],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Personal Style Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Precision Snipe",desc:"Deals Shot DMG equal to 66% ATK to single Kaiju; 29% to adjacent. 80% chance to apply ATK −8.2% (3 turns) to target.",ugc:90,sp:1,type:"Shot",range:"Blast"},
      {name:"Ultimate",title:"Clearance",desc:"Deals Shot DMG equal to 70% ATK to all Kaiju. After attacking, randomly removes 1 buff from target.",ugc:"300★",sp:"—",type:"Shot",range:"AoE"},
      {name:"Follow-Up Skill",title:"Coordinated Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Pace Control",desc:"After attacking, 75% base chance to apply SPD −6% (1 turn) to target."},
    addPassives:[["Lv.40 — Camaraderie","After Follow-Up Skill, randomly removes 1 of a single ally's debuffs."],["Lv.60 — Independent Presence","When attacking Kaiju with a debuff, DMG dealt +20%."],["Lv.80 — My Pace","After attacking Core Exposed Kaiju, Ultimate Gauge +17."]],
    ascensions:[["A1","★★★","Synchronized Breathing","Each Kaiju defeated: Ultimate Gauge +15."],["A2","★★★★","Sharp-Witted Nature","All allies' Effect RES +10%."],["A3","★★★","Neutralization University Valedictorian","Normal Attack, Ultimate Lv. +2 / Max Lv. +2."],["A4","★★★★★","Finishing Blow","After attacking Kaiju with a debuff, Shot Additional DMG equal to 20% ATK."],["A5","★★★","Clean-Cut Powerhouse","Combat Skill, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Solid Combat Style","For each debuff on Kaiju, DMG dealt to that Kaiju +5% (max +25%)."]],
    statusNotes:[] },

  // ── HIKARI SHINOMIYA ─────────────────────────────────────────────────────
  { id:"hs-tv", name:"Hikari Shinomiya", variant:"The Valkyrie", parent:"Hikari Shinomiya",
    role:"Attacker", type:["Slash","Wind"], ailment:"—",
    weapons:["Lc-0039","Lc-Rhinoceros 01","Standard Spear"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate > Slash DMG Dealt",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Lightning-Fast Pierce",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Brilliant Onslaught",desc:"Deals Slash and Wind DMG equal to 150% ATK to a single Kaiju.",ugc:90,sp:1,type:"Slash / Wind",range:"Single Target"},
      {name:"Ultimate",title:"Celestial Trajectory",desc:"Deals Slash and Wind DMG equal to 328% ATK to a single Kaiju.",ugc:"300★",sp:"—",type:"Slash / Wind",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Flurry of an Instant",desc:"Deals Slash and Wind DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Wind",range:"Single Target"},
    ],
    passive:{name:"Exclusive Flight Ability",desc:"Before Ultimate, applies Acceleration (2 turns): DMG dealt +11%, SPD +300%, SP +1 after Combat Skill vs Core Exposed. While in Acceleration: Normal Attack / Combat Skill / Follow-Up cannot recover Ultimate Gauge."},
    addPassives:[["Lv.40 — A League of Her Own","Battle start: Ultimate Gauge +60."],["Lv.60 — A Vow to Protect","When attacking Core Exposed Kaiju, CRIT DMG +24%."],["Lv.80 — Aggressive Pursuit Stance","Each PLT destroyed: ATK +4% (2 turns), max 5 stacks."]],
    ascensions:[["A1","★★★★","Swift Spearwork","DEF PEN Rate +16%."],["A2","★★★★★","Swift as Light","While in Acceleration state, CRIT DMG +24%. Acceleration duration +1 turn."],["A3","★★★","Unmatched Kill Count","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Relentless Chase","Each PLT destroyed: Slash DMG dealt +6% (2 turns), max 3 stacks."],["A5","★★★","For the Family","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Preemptive Move","Before Ultimate, applies Forestalled (1 turn) to target. After attacking Forestalled Kaiju, Slash Additional DMG equal to 100% ATK."]],
    statusNotes:["Acceleration — DMG dealt +11%, SPD +300%; Normal/Combat/Follow-Up cannot recover Ultimate Gauge."] },

  // ── IHARU FURUHASHI ──────────────────────────────────────────────────────
  { id:"if-lt", name:"Iharu Furuhashi", variant:"Latent Talent", parent:"Iharu Furuhashi",
    role:"Supporter", type:["Shot","Lightning"], ailment:"Shock",
    weapons:["AR-Hyperion","AR-Cronus","AR-Panther 33"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > Lightning DMG Dealt",
    medal:"Kaiju No. 2",
    skillPrio:[["Combat Skill",4],["Passive Skill",4],["Ultimate",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Single-Minded Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:54,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Thunderbolt Blast",desc:"Deals Shot and Lightning DMG equal to 62% ATK to single Kaiju. 65% chance to apply Shock (2 turns).",ugc:81,sp:1,type:"Shot / Lightning",range:"Single Target"},
      {name:"Ultimate",title:"Rapid Thunderbolt",desc:"Deals Shot and Lightning DMG equal to 137% ATK to single Kaiju. 80% chance to apply DEF −21% (2 turns) to target.",ugc:"300★",sp:"—",type:"Shot / Lightning",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Caring Support",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Hidden Aptitude",desc:"All allies' Effect Hit Rate +7%."},
    addPassives:[["Lv.40 — Area of Expertise","When attacking Kaiju with a debuff, DMG dealt +20%."],["Lv.60 — Intense Fighting Spirit","Battle start: advance Action Order by 25%."],["Lv.80 — High Spirit","When ally attacks Kaiju with a debuff, ally's Lightning DMG dealt +20%."]],
    ascensions:[["A1","★★★","Direct Effort","Before Combat Skill, 100% chance Effect RES −10% (2 turns) to target."],["A2","★★★★★","Preemptive Intimidation","DEF debuff from Ultimate duration +1 turn."],["A3","★★★","Technical College Powerhouse Valedictorian","Normal Attack, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Relentless Pursuit of Victory","Shock base chance from Combat Skill +35%."],["A5","★★★","Spirit to Soar","Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A6","★★★★","Awakening of Talent","Shock DoT DMG Multiplier from Combat Skill +60%."]],
    statusNotes:["Shock — Inflicts Lightning DoT at start of action."] },

  // ── ISAO SHINOMIYA ───────────────────────────────────────────────────────
  { id:"is-pf", name:"Isao Shinomiya", variant:"Prime Fist", parent:"Isao Shinomiya",
    role:"Attacker", type:["Blunt"], ailment:"—",
    weapons:["Fs-Baldr","Fs-Magni","Fs-1002"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT DMG > SPD",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Barrage Blast",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Force Blast",desc:"Deals Blunt DMG equal to 80% ATK to all Kaiju.",ugc:90,sp:1,type:"Blunt",range:"AoE"},
      {name:"Ultimate",title:"Peerless Blow",desc:"Before attacking, Blunt Additional DMG Multiplier +31% (1 turn). Deals Blunt DMG equal to 117% ATK to all Kaiju.",ugc:"300★",sp:"—",type:"Blunt",range:"AoE"},
      {name:"Follow-Up Skill",title:"Wave of Fists",desc:"Deals Blunt DMG equal to 29% ATK to all Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"AoE"},
    ],
    passive:{name:"Storied Valor",desc:"Each attack: +1 Valor (max 5). At max Valor, after Combat Skill or Ultimate: Blunt Additional DMG equal to 44% ATK, then consume all Valor and CRIT Rate +2.3% (max 5 stacks)."},
    addPassives:[["Lv.40 — Makings of a Legend","On turn start, +1 Valor."],["Lv.60 — Perfect Neutralization","For each Kaiju on field, DMG dealt +5%."],["Lv.80 — Unrivaled Destructive Power","If Valor ≥3, CRIT DMG +24%."]],
    ascensions:[["A1","★★★★","Flawless Combat Style","Before Ultimate, ATK +40% (1 turn)."],["A2","★★★★","Roaring Fist","When Valor ≥3, DMG dealt +20%."],["A3","★★★","Peak Physique","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Technical Reinforcement","Each attack: Ultimate Gauge +5."],["A5","★★★","Strategic Prevision","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Overwhelming Destructive Power","Passive Blunt Additional DMG activates 2 times."]],
    statusNotes:["Valor — At max stacks, Combat Skill/Ultimate deals Blunt Additional DMG."] },

  { id:"is-uiw", name:"Isao Shinomiya", variant:"The Unbreakable Iron Wall", parent:"Isao Shinomiya",
    role:"Defender", type:["Blunt"], ailment:"—",
    weapons:["Fs-1002","Fs-Vidar","Fs-Grizzly 83"],
    uniparts:"Bovine-Type", priority:"DEF > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 2",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",2],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Wholehearted Strike",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:48,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Solid Stance",desc:"Applies a Shield (3 turns) equal to 7.5% DEF +33 to all allies.",ugc:72,sp:1,type:"—",range:"Defense"},
      {name:"Ultimate",title:"Energy Burst",desc:"Deals Blunt DMG equal to 336% DEF to a single Kaiju.",ugc:"300★",sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Daikaiju-Empowered Blow",desc:"Deals Blunt DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
    ],
    passive:{name:"Indomitable Stronghold",desc:"While having Shield, chance of being targeted slightly increases. Each ally with Shield that receives attack: DEF +2.8% (3 turns, max 5 stacks). For each ally with Shield, DMG dealt +3.2% for all allies."},
    addPassives:[["Lv.40 — Fundamentals of Combat Technique","After Combat Skill, Effect RES +15% (3 turns) to all allies."],["Lv.60 — Evolved Combat Technique","While having Shield, DEF +20%."],["Lv.80 — Perfected Combat Technique","After Ultimate, DMG Taken Reduction +10% (1 turn) to all allies."]],
    ascensions:[["A1","★★★★★","Preparation for a Prolonged Battle","After attacking, recover HP equal to 5% Max HP."],["A2","★★★★★","Last Line of Defense","If incapacitated, recover 25% Max HP and resurrect (1x/battle)."],["A3","★★★","Resolve to Protect the Nation","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Perfectionism","Battle start: Shield (3 turns) to all allies."],["A5","★★★","Role to Fulfill","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Unified Offense and Defense","While having Shield, Normal Attack and Ultimate DMG Multiplier +80%."]],
    statusNotes:[] },

  // ── JURA IGARASHI ────────────────────────────────────────────────────────
  { id:"ji-gd", name:"Jura Igarashi", variant:"Grit and Duty", parent:"Jura Igarashi",
    role:"Supporter", type:["Blunt","Fire"], ailment:"Burn",
    weapons:["SB-7137","SB-Stegosaurus 38","—"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > Fire DMG Dealt",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Herculean Toss",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Hot-Blooded Impact",desc:"Before attacking, applies Hot-Blooded (2 turns) to all allies: DMG dealt +20.3%, ATK +16%, SPD +11. Deals Blunt and Fire DMG equal to 54% ATK to single Kaiju and adjacent.",ugc:90,sp:1,type:"Blunt / Fire",range:"Blast"},
      {name:"Ultimate",title:"Zenith Plunge",desc:"Deals Blunt and Fire DMG equal to 146% ATK to single Kaiju and adjacent. 65% chance to apply Burn (3 turns): Fire DoT equal to 52.5% ATK.",ugc:"300★",sp:"—",type:"Blunt / Fire",range:"Blast"},
      {name:"Follow-Up Skill",title:"Blazing Slugger",desc:"Deals Blunt and Fire DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt / Fire",range:"Single Target"},
    ],
    passive:{name:"Commanding Grit",desc:"After Normal Attack, all allies Effect Hit Rate +12.1% (2 turns). After Ultimate, applies Afterburn (3 turns) to target: when target takes DoT, triggers 1 additional instance equal to 22% of total DoT."},
    addPassives:[["Lv.40 — Renowned Capability","On turn start, Ultimate Gauge +15."],["Lv.60 — Unflagging Spirit","When ally attacks Kaiju in Afterburn state, DEF PEN Rate +18%."],["Lv.80 — Boundless Brawn","When Effect Hit Rate ≥70%, all allies' DoT DMG Multiplier +20%."]],
    ascensions:[["A1","★★★★★","Infectious Zeal","Afterburn Effect Multiplier +40%."],["A2","★★★★★","Seething Hot Blood","Wave start: applies Afterburn (3 turns) to all Kaiju."],["A3","★★★","Iron-Clad Trust","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★","All at Once","Burn from Ultimate applies to all Kaiju. Wave start: 65% chance to apply Burn to all Kaiju."],["A5","★★★","Strongest Big Sis","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Grit-Fueled Push","Afterburn applies to all Kaiju. When ally attacks Kaiju with debuff/ailment, ally ATK +30%."]],
    statusNotes:["Burn — Fire DoT at start of action.","Afterburn — Extra DoT instance (22% of total DoT) when target takes DoT.","Hot-Blooded — DMG dealt, ATK, and SPD increased."] },

  // ── KAFKA HIBINO ─────────────────────────────────────────────────────────
  { id:"kh-mk", name:"Kafka Hibino", variant:"The Man Who Became a Kaiju", parent:"Kafka Hibino",
    role:"Attacker", type:["Shot"], ailment:"—",
    weapons:["HG-Beetle 15","—","—"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG / Ultimate Gauge Charge Rate > Blunt / Shot DMG Dealt / SPD",
    medal:"Kaiju No. 1",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"1% Shot / Inhuman Fist",desc:"Pre-transform: Shot DMG 55% ATK. Post-transform (Kaiju form): Blunt DMG 55% ATK.",ugc:66,sp:"—",type:"Shot / Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Wholehearted Support / Overwhelming Roar",desc:"Pre-transform: Shot DMG 89% ATK, DEF −16% (1 turn) to target, SPD +16% (1 turn) to self. Post-transform: Blunt DMG 64% ATK to all Kaiju.",ugc:99,sp:1,type:"Shot / Blunt",range:"ST / AoE"},
      {name:"Ultimate",title:"Transformation / Acquired Fighting Style",desc:"Transform: enter Kaiju form (HP +44%, SPD +10, full heal, advance Action Order 100%). Post-transform Ultimate becomes single-target Blunt attack.",ugc:"300★",sp:"—",type:"— / Blunt",range:"Enhance / ST"},
      {name:"Follow-Up Skill",title:"Experienced Support / Earth-Shaking Blow",desc:"Pre-transform: Shot DMG 55% ATK. Post-transform: Blunt DMG 66% ATK.",ugc:60,sp:"—",type:"Shot / Blunt",range:"Single Target"},
    ],
    passive:{name:"Unorthodox Fighting Spirit",desc:"Battle start: Effect Hit Rate +20% (3 turns). While in Kaiju form: ATK +55%, DEF +22%."},
    addPassives:[["Lv.40 — Battle-Ready Stance","After Transform Ultimate, Ultimate Gauge +60."],["Lv.60 — Kaiju Vitals","After Follow-Up Skill, Effect RES +15% (2 turns)."],["Lv.80 — Guts to Step Up","When attacking Kaiju with ≥50% HP, CRIT Rate +16%."]],
    ascensions:[["A1","★★★★","Resolution of a Defense Officer","While in Kaiju form, ATK +10%."],["A2","★★★★","Strength Beyond Imagination","While in Kaiju form, Combat Skill DMG dealt +10%."],["A3","★★★","Steady Training","Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Partial Transformation","Battle start: Ultimate Gauge Charge Rate +20% (2 turns)."],["A5","★★★","Promise of Childhood Days","Normal Attack, Combat Skill, Passive Lv. +2 / Max Lv. +2."],["A6","★★★★★","Mastered Strength","After Normal Attack / Combat Skill in Kaiju form, Blunt DMG dealt +5% (max 3 stacks)."]],
    statusNotes:["Kaiju form — HP and SPD increased; weapons unequipped; skills change; lasts until end of battle."] },

  { id:"kh-mr", name:"Kafka Hibino", variant:"The Man Who Became a Reindeer", parent:"Kafka Hibino",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["HG-Xmas 25","HG-Beetle 15","—"],
    uniparts:"Wyvern-Type", priority:"ATK > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Reindeer-Style Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Simple Present",desc:"Applies to single ally: Combat Skill DMG dealt +25.6% (1 turn) and Care Package. Care Package: after consuming 2 SP, recover 2 SP and remove Care Package.",ugc:300,sp:1,type:"—",range:"Support"},
      {name:"Ultimate",title:"Mountain of Presents",desc:"Applies Gift (2 turns) to a single ally. Gift: ATK increased by 38.8% of this unit's ATK.",ugc:"300★",sp:"—",type:"—",range:"Support"},
      {name:"Follow-Up Skill",title:"Reindeer's Best Work",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Agile Footwork",desc:"After ally in Gift or Care Package state activates Ultimate, DMG dealt +16% (2 turns) to that activator."},
    addPassives:[["Lv.40 — Steady Growth","Normal Attack and Follow-Up Skill DMG dealt +30%."],["Lv.60 — Timely Encouragement","Battle start: advance Action Order by 25%."],["Lv.80 — Christmas Eve Mainstay","After Ultimate, Ultimate Gauge Charge Rate +15% (2 turns)."]],
    ascensions:[["A1","★★★★","Generous Spirit","After Ultimate, randomly removes 1 of this unit's debuffs."],["A2","★★★★★","Big Fat Gift","Gift from Ultimate duration +1 turn."],["A3","★★★","Approachable Air","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Life of the Party","On turn start, Ultimate Gauge +10."],["A5","★★★","Reliable Reindeer","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Heartfelt Support","After Ultimate, target's Ultimate Gauge +25."]],
    statusNotes:["Care Package — After consuming 2 SP, recover 2 SP (auto-removed if applied to another ally).","Gift — ATK increased; cannot be overwritten by weaker effects."] },

  // ── KAIJU NO. 8 ──────────────────────────────────────────────────────────
  { id:"k8-f98", name:"Kaiju No. 8", variant:"Fortitude 9.8", parent:"Kaiju No. 8",
    role:"Attacker", type:["Blunt"], ailment:"—",
    weapons:["Cannot equip","—","—"],
    uniparts:"Cannot equip", priority:"N/A — Cannot equip weapons / uniparts",
    medal:"Kaiju No. 1",
    skillPrio:[["Passive Skill",5],["Normal Attack",4],["Ultimate",3],["Combat Skill",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Daikaiju's Punch",desc:"Deals Blunt DMG equal to 55% ATK. 100% chance to apply Taunt (1 turn) to target. DEF +11% (1 turn) to self.",ugc:66,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Unyielding Fists",desc:"If attacking Miniature-Class Kaiju with ≤50% HP, inflicts definite defeat. Deals Blunt DMG equal to 140% ATK.",ugc:99,sp:1,type:"Blunt",range:"Single Target"},
      {name:"Ultimate",title:"Ultimate Punch",desc:"Before attacking: Blunt DMG dealt +32% (2 turns), CRIT DMG +44% (2 turns). Deals Blunt DMG equal to 253% ATK.",ugc:"300★",sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Controlled Punch",desc:"Deals Blunt DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
    ],
    passive:{name:"Zeal and Supremacy",desc:"Cannot equip weapons/uniparts. After Normal Attack, Combat Skill, or receiving attack: +1 Fighting Spirit (max 5). Fighting Spirit: ATK +3.2%, DMG dealt +3.2%, Ultimate DMG Multiplier +6.4%."},
    addPassives:[["Lv.40 — Unyielding Tenacity","ATK +27%. Battle start: DEF +35% (3 turns)."],["Lv.60 — Full-Power Fist","CRIT Rate +19%. Ultimate DMG dealt +15%."],["Lv.80 — Kaiju's Hardened Skin","SPD +16. After Combat Skill, CRIT Rate +15% (2 turns)."]],
    ascensions:[["A1","★★★","Kaiju Awakening","After Normal Attack, Ultimate Gauge +30."],["A2","★★★★","Weight of Fighting Spirit","On turn start, remove 1 of this unit's debuffs."],["A3","★★★","Don't Use This on People","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★★","Kaiju-Derived Recovery","After Normal Attack, recover HP equal to 10% of ATK."],["A5","★★★","Daikaiju's True Power","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Overflowing Fighting Spirit","Battle start: +1 Fighting Spirit. Fighting Spirit max stack +2."]],
    statusNotes:["Taunt — Cannot choose other targets.","Fighting Spirit — DMG dealt and Ultimate DMG Multiplier increased per stack."] },

  { id:"k8-sv", name:"Kaiju No. 8", variant:"Scorching Variant", parent:"Kaiju No. 8",
    role:"Attacker", type:["Blunt","Fire"], ailment:"—",
    weapons:["Cannot equip","—","—"],
    uniparts:"Cannot equip", priority:"N/A — Cannot equip weapons / uniparts",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",5],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Valiant Flying Kick",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Extreme-Heat Dive Kick",desc:"Before attacking, CRIT DMG +19.2% (1 turn). Deals Blunt and Fire DMG equal to 117% ATK to single Kaiju; 54% to adjacent.",ugc:90,sp:1,type:"Blunt / Fire",range:"Blast"},
      {name:"Ultimate",title:"Full-On Heatblast",desc:"Deals Blunt and Fire DMG equal to 267% ATK to single Kaiju; 129% to adjacent. After attacking, SPD +14.6% (1 turn).",ugc:"300★",sp:"—",type:"Blunt / Fire",range:"Blast"},
      {name:"Follow-Up Skill",title:"Scorching Fist",desc:"Deals Blunt and Fire DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt / Fire",range:"Single Target"},
    ],
    passive:{name:"Resonant Resolve",desc:"Cannot equip weapons/uniparts. Before Ultimate: DMG dealt +1.2%, Ultimate DMG dealt +5.5% (max 5 stacks). After any ally activates Ultimate — self: consume up to 3 Resolve for Ultimate Gauge +30 each, then +2 Resolve; other ally: +1 Resolve. Resolve: Blunt DMG dealt +4.4%, Ultimate DMG Multiplier +8.8% (max 6 stacks)."},
    addPassives:[["Lv.40 — Overflowing Power","ATK +32%, SPD +20, CRIT Rate +24%."],["Lv.60 — Lingering Heat","ATK +46%. After Ultimate, CRIT DMG +36% (2 turns)."],["Lv.80 — Beyond Resolve","CRIT DMG +48%. For every 100 ATK over 1,200, CRIT Rate +3% (max +27%)."]],
    ascensions:[["A1","★★★★","Unwavering Readiness","Ultimate CRIT DMG +42%."],["A2","★★★★★","Deep-Piercing Heat","After Ultimate with 3 Resolve consumed, DEF PEN Rate +18% (2 turns). Combat Skill DMG Multiplier +30%."],["A3","★★★","Unidentified Form","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★★","Deepening Resolve","After Combat Skill or Follow-Up Skill, +1 Resolve."],["A5","★★★","Embers of Rage","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Thermal Overdrive","Resolve max stack +2. Resolve also grants Ultimate DMG Multiplier +4%."]],
    statusNotes:["Resolve — Blunt DMG dealt and Ultimate DMG Multiplier increased."] },

  // ── KEIJI ITAMI ──────────────────────────────────────────────────────────
  { id:"ki-cq", name:"Keiji Itami", variant:"Calm and Quiet", parent:"Keiji Itami",
    role:"Supporter", type:["Shot"], ailment:"Poison / Stun",
    weapons:["AR-Hyperion","AR-Cronus","AR-Narwhal 59"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > SPD",
    medal:"Kaiju No. 2",
    skillPrio:[["Combat Skill",5],["Ultimate",3],["Passive Skill",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Dignified Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:54,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Smoke Grenade",desc:"Deals Shot DMG equal to 54% ATK to single Kaiju. 80% chance to apply Poison (2 turns): DoT equal to 5% target's Max HP (max 128% applier's ATK).",ugc:81,sp:1,type:"Shot",range:"Single Target"},
      {name:"Ultimate",title:"Loud Grenade",desc:"Deals Shot DMG equal to 224% ATK to single Kaiju. 80% chance to apply Stun (1 turn).",ugc:"300★",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Rational Support",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Discreet Operation",desc:"If no attack received for 1 turn, after attacking: Stealth (1 turn). While in Stealth, after attacking: Shot Additional DMG equal to 50% ATK."},
    addPassives:[["Lv.40 — Handling with Ease","When HP ≥80%, ATK +15%."],["Lv.60 — Precision from Experience","Effect Hit Rate +16%."],["Lv.80 — Prudent Demeanor","When attacking Kaiju in Poison state, DMG dealt +20%."]],
    ascensions:[["A1","★★★★","Habitual Procedure","While in Stealth state, SP will not be consumed."],["A2","★★★","Smooth Progress","After defeating Kaiju, Ultimate Gauge +35."],["A3","★★★","Sharp Insight","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★★","Setting Up the Next Move","After Ultimate, randomly remove 1 of target's buffs."],["A5","★★★","Linchpin of the Defense Force","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Seasoned Expertise","Before Combat Skill, 100% chance DMG Taken Increase +10% (2 turns) to target."]],
    statusNotes:["Poison — DoT based on target's Max HP at start of action.","Stun — Prevents acting; increases CRIT DMG taken.","Stealth — Will not be targeted by Kaiju."] },

  // ── KIKORU SHINOMIYA ─────────────────────────────────────────────────────
  { id:"ks-et", name:"Kikoru Shinomiya", variant:"Evolving Talent", parent:"Kikoru Shinomiya",
    role:"Attacker", type:["Slash","Blunt"], ailment:"—",
    weapons:["S-12066","S-Silky Shark 13","Standard Greatsword"],
    uniparts:"Caudata-Type", priority:"ATK > CRIT DMG > Slash DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Agile Slash",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Offense-Defense Array",desc:"Before attacking, DMG Taken Reduction +9.6% (1 turn) to all allies. Deals Slash and Blunt DMG equal to 68% ATK to single Kaiju; 34% to adjacent.",ugc:90,sp:1,type:"Slash / Blunt",range:"Blast"},
      {name:"Ultimate",title:"All-Out Cleave",desc:"Deals Slash and Blunt DMG equal to 92% ATK to all Kaiju. After attacking, applies Bold (3 turns): after Combat Skill or Extra Attack, Slash Additional DMG equal to 34.7% ATK.",ugc:"300★",sp:"—",type:"Slash / Blunt",range:"AoE"},
      {name:"Follow-Up Skill",title:"Rapid Strike",desc:"Deals Slash and Blunt DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Blunt",range:"Single Target"},
    ],
    passive:{name:"Vengeful Resolve",desc:"After Combat Skill, Ultimate, or each time ally receives attack: +1 Wrath (max 6). When Wrath ≥3, after attacking: consume 3 Wrath → Extra Attack (Slash / Blunt DMG 22% ATK to target + adjacent, Additional DMG Multiplier +27.5%)."},
    addPassives:[["Lv.40 — Overflowing Combat Will","Battle start: Bold (3 turns)."],["Lv.60 — Fueled by Resolve","After defeating Kaiju, Ultimate Gauge +30."],["Lv.80 — Swift Adjustment","For every 100 ATK over 1,200, CRIT Rate +4% (max +36%)."]],
    ascensions:[["A1","★★★★","Mastered Onslaught","After Normal Attack or Combat Skill, Slash Additional DMG equal to 30% ATK."],["A2","★★★★★","Belligerent Stance","While in Bold state, CRIT DMG +35%."],["A3","★★★","Substantial Growth","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Impenetrable Stance","After Extra Attack: DEF +20% (2 turns), Effect RES +20% (2 turns)."],["A5","★★★","Continuous Progress","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Seized Mastery","After defeating Kaiju, +1 Wrath. Additional DMG dealt +30%, CRIT DMG from Additional DMG +50%."]],
    statusNotes:["Bold — After Combat Skill or Extra Attack, deals Slash Additional DMG.","Wrath — At ≥3 stacks, activates Extra Attack after attacking."] },

  { id:"ks-fpc", name:"Kikoru Shinomiya", variant:"Full-Power Christmas", parent:"Kikoru Shinomiya",
    role:"Defender", type:["Slash"], ailment:"—",
    weapons:["Ax-Xmas 25","Ax-Var","Ax-0112"],
    uniparts:"Ant-Type", priority:"HP > Healing Multiplier > SPD",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Tree Cleaver",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Present Delivery",desc:"Recovers single ally's HP equal to 12.8% Max HP +54. Randomly removes 1 of target's debuffs.",ugc:90,sp:1,type:"—",range:"Recovery"},
      {name:"Ultimate",title:"Christmas Eve Extravaganza",desc:"Recovers all allies' HP equal to 7.3% Max HP +42. Applies Engrossed (1 turn) to all other allies: before Normal Attack / Combat Skill, recover 16.8% Max HP; after, if HP ≥50%, ATK +16.8% (3 turns).",ugc:"300★",sp:"—",type:"—",range:"Recovery"},
      {name:"Follow-Up Skill",title:"Tree Splitter",desc:"Deals Slash DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Christmas Spirit",desc:"After Normal Attack or Follow-Up Skill, DMG dealt +9.9% (1 turn) to all allies. After Combat Skill, Ultimate Gauge Charge Rate +7.8% (2 turns) to all other allies."},
    addPassives:[["Lv.40 — Maximum Effort","On turn start, Ultimate Gauge +12."],["Lv.60 — Indomitable Santa","Effect RES +30%."],["Lv.80 — Holy Night Miracle","If ally becomes incapacitated, recover 30% Max HP and revive (1x/battle)."]],
    ascensions:[["A1","★★★★","Selfless Focus","Battle start: Engrossed (1 turn) to all other allies."],["A2","★★★","Insight in Crisis","When HP ≤30%, after Combat Skill: recover HP equal to 10% Max HP +300."],["A3","★★★","All-Out Christmas","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Perfect Present","After Combat Skill: DMG Taken Reduction +10% (2 turns) and DMG dealt +10% (2 turns) to target."],["A5","★★★","Memories Recalled","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","True Essence of Christmas Eve","After Combat Skill or Ultimate, DMG dealt +40% (2 turns) to target."]],
    statusNotes:["Engrossed — Recovers HP before Normal Attack / Combat Skill; ATK increased if HP ≥50%."] },

  { id:"ks-glf", name:"Kikoru Shinomiya", variant:"Guiding Light of the Future", parent:"Kikoru Shinomiya",
    role:"Attacker", type:["Slash"], ailment:"—",
    weapons:["Ax-0112","Ax-Dellingr","Ax-Mantis 21"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate > Slash DMG Dealt",
    medal:"Kaiju No. 1",
    skillPrio:[["Combat Skill",5],["Ultimate",5],["Passive Skill",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Water Skimmer",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:54,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Rotary Slash",desc:"Deals Slash DMG equal to 108% ATK to single Kaiju; 54% ATK to adjacent.",ugc:81,sp:1,type:"Slash",range:"Blast"},
      {name:"Ultimate",title:"Falling Thunder",desc:"If Tip-Top Shape is at 3 stacks: 100% chance to apply DEF −8.2% (2 turns). Deals Slash DMG equal to 227% ATK to single Kaiju.",ugc:"300★",sp:"—",type:"Slash",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Half Moon",desc:"Deals Slash DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Rising Morale",desc:"After any skill except Ultimate: +1 Tip-Top Shape (max 3). After Ultimate: consume all Tip-Top Shape. Tip-Top Shape: ATK +5.5%, CRIT DMG +11%."},
    addPassives:[["Lv.40 — Young Talent","Battle start: Ultimate Gauge +60."],["Lv.60 — No Limit","If Tip-Top Shape ≥1, Effect Hit Rate +30%."],["Lv.80 — Finishing Touch","When attacking Kaiju with ≤50% HP, Combat Skill DMG dealt +20%."]],
    ascensions:[["A1","★★★★","Decisive Ax Strike","When attacking Kaiju with a debuff, CRIT Rate +15%."],["A2","★★★★","Lasting Slash","DEF debuff from Ultimate duration +1 turn."],["A3","★★★","Outstanding Ability","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★","Aggressive Combat Style","Ultimate Gauge Charge Rate +10%."],["A5","★★★","Light of Hope","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","On the Rise","After Ultimate, Tip-Top Shape is not consumed."]],
    statusNotes:["Tip-Top Shape — ATK and CRIT DMG increased per stack; consumed after Ultimate."] },

  { id:"ks-iw", name:"Kikoru Shinomiya", variant:"The Inherited Will", parent:"Kikoru Shinomiya",
    role:"Attacker", type:["Blunt"], ailment:"—",
    weapons:["Fs-Magni","Fs-1002","Fs-Vidar"],
    uniparts:"Armored-Type", priority:"ATK > Ultimate Gauge Charge Rate / Effect Hit Rate > SPD / Blunt DMG Dealt",
    medal:"Kaiju No. 2",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Father's Strike",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"All-Out Swing",desc:"Deals Blunt DMG equal to 87% ATK to single Kaiju; 39% to adjacent. 65% chance to apply SPD −9.6% (2 turns) to target.",ugc:90,sp:1,type:"Blunt",range:"Blast"},
      {name:"Ultimate",title:"Full-Force Strike",desc:"Deals Blunt PEN DMG equal to 115% ATK to single Kaiju; 58% to adjacent. 65% chance to apply DEF −10.5% (2 turns).",ugc:"300★",sp:"—",type:"Blunt",range:"Blast"},
      {name:"Follow-Up Skill",title:"Twin Blast",desc:"Deals Blunt PEN DMG equal to 48% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
    ],
    passive:{name:"Inherited Resolve",desc:"After Ultimate, applies Inheritance (3 turns): Ultimate Gauge Charge Rate +100%; 65% chance after Normal Attack: DEF −11% to target; 65% chance after Combat Skill: DEF −7.8% to target."},
    addPassives:[["Lv.40 — Unleashed Power","DMG dealt increased by 100% of Effect Hit Rate (max +80%)."],["Lv.60 — Fully Prepared","Battle start: Ultimate Gauge +300."],["Lv.80 — Strengthened Resolve","After Ultimate, ATK +20% (2 turns)."]],
    ascensions:[["A1","★★★★","Natural Talent","After attacking Kaiju with a debuff, Blunt DMG dealt +20% (1 turn)."],["A2","★★★★","Quintessential Inheritance","While in Inheritance state, Normal Attack DMG Multiplier +30%, Combat Skill DMG Multiplier +30%."],["A3","★★★","Lofty Ideals","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Inherited Spirit","Wave start: 150% chance Effect RES −20% to all Kaiju."],["A5","★★★","Pursuit of Ideals","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Strength to Uphold a Legacy","After Ultimate, Ultimate DMG Multiplier +130% (3 turns). While in Inheritance, after Normal Attack, advance Action Order by 20%."]],
    statusNotes:["Inheritance — Ultimate Gauge Charge Rate +100%; DEF debuffs applied after Normal Attack / Combat Skill."] },

  { id:"ks-mp", name:"Kikoru Shinomiya", variant:"The Mission to Be Perfect", parent:"Kikoru Shinomiya",
    role:"Attacker", type:["Slash"], ailment:"—",
    weapons:["Ax-Dellingr","Ax-Var","Ax-0112"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG > Slash DMG Dealt",
    medal:"Kaiju No. 1",
    skillPrio:[["Ultimate",5],["Passive Skill",4],["Combat Skill",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Reverse Grip Draw",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:54,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Reverse Grip Sweep",desc:"Deals Slash DMG equal to 160% ATK to a single Kaiju.",ugc:81,sp:1,type:"Slash",range:"Single Target"},
      {name:"Ultimate",title:"Spinning Blade Slash",desc:"Deals Slash DMG equal to 250% ATK to single Kaiju. When attacking Core Exposed Kaiju, Slash Additional DMG equal to 38.5% ATK.",ugc:"300★",sp:"—",type:"Slash",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Reverse Grip Strike",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Dominating Combat Style",desc:"After an ally causes a Kaiju to become Core Exposed, SPD +13.7% (2 turns) to this unit."},
    addPassives:[["Lv.40 — Constant Growth","When HP ≤50%, chance of being targeted slightly decreases."],["Lv.60 — Perfection on Display","Battle start: advance Action Order by 25%."],["Lv.80 — Next Objective","After defeating Kaiju, ATK +20% (2 turns)."]],
    ascensions:[["A1","★★★","Outstanding Talent","After Combat Skill vs Core Exposed Kaiju, Ultimate Gauge +30."],["A2","★★★★","Tireless Effort","When attacking Core Exposed Kaiju, DMG dealt +20%."],["A3","★★★","Discipline","Normal Attack, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★★","Pursuit of Perfection","Each PLT destroyed: ATK +6% (max 5 stacks)."],["A5","★★★","Vow of the Past","Combat Skill, Ultimate, Passive Lv. +2 / Max Lv. +2."],["A6","★★★★","Accumulating Experience","Ultimate DMG dealt +20% and Slash Additional DMG Multiplier +50%."]],
    statusNotes:[] },

  // ── KOTA TACHIBANA ───────────────────────────────────────────────────────
  { id:"kt-fff", name:"Kota Tachibana", variant:"First Division's Feral Force", parent:"Kota Tachibana",
    role:"Defender", type:["Shot","Ice"], ailment:"Freeze",
    weapons:["AR-Squid 62","—","—"],
    uniparts:"Bovine-Type", priority:"DEF > Effect Hit Rate > SPD",
    medal:"Kaiju No. 1",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Steady Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Menacing Blow",desc:"Deals Shot DMG equal to 118% ATK to single Kaiju. 100% chance to apply ATK −9.6% (3 turns) to target.",ugc:90,sp:1,type:"Shot",range:"Single Target"},
      {name:"Ultimate",title:"Freeze Grenade",desc:"Deals Shot and Ice DMG equal to 153% ATK to single Kaiju. 80% chance to apply Freeze (1 turn): delays Action Order by 30%, Ice Additional DMG equal to 38.5% ATK on turn start.",ugc:"300★",sp:"—",type:"Shot / Ice",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Solid Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Absolute Conviction",desc:"When HP ≥50%, chance of being targeted increases. After Normal Attack vs Kaiju with debuff / ailment, apply Shield (1 turn) equal to 9.5% DEF +36 to self."},
    addPassives:[["Lv.40 — Fierce Combat Style","While having a Shield, Effect RES +25%."],["Lv.60 — Intimidating Presence","Before Ultimate, Effect Hit Rate +25% (3 turns)."],["Lv.80 — Swift Subjugation","After Combat Skill, DEF +20% (2 turns)."]],
    ascensions:[["A1","★★★★★","Feral Gaze","After Ultimate, recover HP equal to 5% Max HP."],["A2","★★★★","Mark of the Platoon Leader","Shield from Passive duration +1 turn."],["A3","★★★","First Division's Pride","Normal Attack, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Top-Tier Ability","Shield Application Multiplier +25%."],["A5","★★★","Respect for the Strongest","Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A6","★★★★","Unmatched Caliber","After receiving attack, DMG Taken Reduction +5% (max 5 stacks)."]],
    statusNotes:["Freeze — Ice DoT at start of action; delays Action Order by 30%."] },

  // ── MINA ASHIRO ──────────────────────────────────────────────────────────
  { id:"ma-agh", name:"Mina Ashiro", variant:"Aiming for Greater Heights", parent:"Mina Ashiro",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["AR-Hyperion","AR-Panther 33","—"],
    uniparts:"Wyvern-Type", priority:"ATK > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Combat Skill",5],["Passive Skill",4],["Ultimate",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Graceful Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:48,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Declaration of Resolve",desc:"Applies Morale (3 turns) to a single ally: DMG dealt +19.2%, Combat Skill DMG dealt +19.2%.",ugc:72,sp:1,type:"—",range:"Support"},
      {name:"Ultimate",title:"Proof of Ability",desc:"If ally has Morale, this attack: Ultimate DMG Multiplier +55%, DMG dealt +13.7%. Deals Shot PEN DMG equal to 105% ATK to single Kaiju.",ugc:"300★",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Superb Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Discreet Encouragement",desc:"After Normal Attack or Ultimate, ATK +38.4% (1 turn) to self and all allies with Morale."},
    addPassives:[["Lv.40 — Preserved Composure","Effect RES +15%."],["Lv.60 — Seize the Opportunity","After attacking Core Exposed Kaiju, Ultimate Gauge +17."],["Lv.80 — Ready to Fire","After Combat Skill, SPD +20% (1 turn)."]],
    ascensions:[["A1","★★★","Continue the Operation","After defeating Kaiju with Ultimate, advance Action Order by 20%."],["A2","★★★★★","Lingering Encouragement","ATK buff from Passive duration +1 turn."],["A3","★★★","Artillery Talent","Normal Attack, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Exceptional Willpower","Morale DMG dealt and Combat Skill DMG dealt effect amount +5%."],["A5","★★★","Mission Engraved in the Heart","Combat Skill, Ultimate, Passive Lv. +2 / Max Lv. +2."],["A6","★★★★","Firing with Belief","While Morale is applied to an ally, Ultimate Shot DMG dealt +15%."]],
    statusNotes:["Morale — DMG dealt and Combat Skill DMG dealt increased."] },

  { id:"ma-ots", name:"Mina Ashiro", variant:"Off the Scale", parent:"Mina Ashiro",
    role:"Attacker", type:["Shot"], ailment:"—",
    weapons:["T-25101985","T-Oceanus","T-Rhea"],
    uniparts:"Fungal-Type", priority:"ATK > CRIT DMG > Shot DMG Dealt",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Ultimate",5],["Normal Attack",4],["Combat Skill",3],["Passive Skill",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Precision Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:90,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Reload Complete",desc:"Applies to self: DMG dealt +9.6% (2 turns), Normal Attack DMG Multiplier +16% (2 turns).",ugc:60,sp:1,type:"—",range:"Enhance"},
      {name:"Ultimate",title:"Unconventional Blow",desc:"Deals Shot DMG equal to 284% ATK to single Kaiju. After attacking, DMG Taken Reduction +8.2% (1 turn).",ugc:"300★",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Immediate Barrage",desc:"Deals Shot DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Supergiant-Class Kaiju Killer",desc:"When attacking Giant-class Kaiju, DMG dealt +19.2%. After Normal Attack or Combat Skill: +1 Focus (max 3). At max Focus: CRIT Rate +100% (1 turn), then consume all Focus."},
    addPassives:[["Lv.40 — Reload","Battle start: +1 Focus."],["Lv.60 — Serious and Sincere","After defeating Kaiju with Ultimate, Ultimate Gauge +50."],["Lv.80 — Sound Strategy","When HP ≥80%, ATK +15%."]],
    ascensions:[["A1","★★★","Declaration of Neutralization","After Ultimate, SPD +15% (2 turns)."],["A2","★★★★","Steadfast Spirit","After Combat Skill, randomly removes 1 of this unit's debuffs."],["A3","★★★","Captain's Responsibility","Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A4","★★★★★","Unyielding Perseverance","After Combat Skill, Shot DMG dealt +20% (2 turns)."],["A5","★★★","Hidden Tenderness","Normal Attack, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Unparalleled Output","When Focus is at max stacks, also applies CRIT DMG +40% (1 turn)."]],
    statusNotes:["Focus — At max stacks, CRIT Rate +100% for 1 turn."] },

  { id:"ma-sc", name:"Mina Ashiro", variant:"Superb Combination", parent:"Mina Ashiro",
    role:"Attacker", type:["Shot"], ailment:"—",
    weapons:["T-Dionysus","T-25101985","T-Rhea"],
    uniparts:"Caudata-Type", priority:"ATK > CRIT DMG > Shot DMG Dealt",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Steadfast Blast",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"High-Power Cannon",desc:"Deals Shot DMG equal to 68% ATK to single Kaiju; 30% to adjacent. After attacking, advances Bakko's Action Order by 50%.",ugc:90,sp:1,type:"Shot",range:"Blast"},
      {name:"Ultimate",title:"Tigerback Barrage",desc:"Deals Shot DMG equal to 168% ATK to single Kaiju; 84% to adjacent. After attacking, applies Combined Forces (3 turns): after Bakko acts, activates Extra Attack.",ugc:"300★",sp:"—",type:"Shot",range:"Blast"},
      {name:"Follow-Up Skill",title:"High-Mobility Snipe",desc:"Deals Shot DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Seamless Synergy",desc:"Battle start: summons Bakko (fixed SPD 105). After Bakko's turn: CRIT Rate +16.5% (1 turn) and Shield (3 turns) equal to 5.5% Max HP to self. Extra Attack: Shot DMG 50% ATK to single Kaiju and adjacent."},
    addPassives:[["Lv.40 — True Strength Unleashed","Before Extra Attack, DMG dealt +20% (2 turns)."],["Lv.60 — Moral Support","Battle start: Combined Forces (3 turns)."],["Lv.80 — Absolute Trust","After Ultimate, ATK +20% (2 turns)."]],
    ascensions:[["A1","★★★★","Exceptional Artillery Power","Before Combat Skill or Ultimate, CRIT DMG +30% (1 turn)."],["A2","★★★★★","Combined Forces Maintained","Combined Forces duration +1 turn. After Extra Attack, DEF PEN Rate +4% (max 5 stacks)."],["A3","★★★","Loyalty Beyond Species","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Firm Conviction","Shield Application Multiplier +50%."],["A5","★★★","Back-to-Back Trust","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Perfected Snipe","Bakko CRIT Rate buff duration +1 turn. When HP ≥70%, CRIT DMG +50%."]],
    statusNotes:["Combined Forces — After Bakko acts, activates Extra Attack."] },

  // ── RENO ICHIKAWA ────────────────────────────────────────────────────────
  { id:"ri-cu", name:"Reno Ichikawa", variant:"The Compatible User", parent:"Reno Ichikawa",
    role:"Attacker", type:["Shot","Ice"], ailment:"Freeze",
    weapons:["AR-Boreas","AR-Hyperion","AR-Octopus 58"],
    uniparts:"Spider-Type", priority:"ATK > CRIT DMG / Effect Hit Rate > Ice DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Combat Skill",5],["Ultimate",4],["Passive Skill",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Sub-Zero Shot",desc:"Deals Shot and Ice DMG equal to 34% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Ice",range:"Single Target"},
      {name:"Combat Skill",title:"Ice Break",desc:"Deals Shot and Ice DMG equal to 192% ATK to single Kaiju. After attacking, applies Ice Crystal (2 turns) to target.",ugc:90,sp:1,type:"Shot / Ice",range:"Single Target"},
      {name:"Ultimate",title:"Extreme Cold Manifestation",desc:"Before: CRIT Rate +15% (2 turns). Deals Shot and Ice DMG equal to 163% ATK to single Kaiju; 81% to adjacent. 65% chance to apply Freeze (1 turn).",ugc:"300★",sp:"—",type:"Shot / Ice",range:"Blast"},
      {name:"Follow-Up Skill",title:"Ice Block Impact",desc:"Deals Shot and Ice DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Ice",range:"Single Target"},
    ],
    passive:{name:"Composed Thinking",desc:"After Combat Skill, Follow-Up, or Ultimate vs Kaiju in Ice Crystal state, applies Ice Crystal (2 turns) to adjacent Kaiju. Ice Crystal: after ally attacks, deals Ice Additional DMG equal to 21% of applier's ATK."},
    addPassives:[["Lv.40 — Instant Cold Energy","After Combat Skill, 50% fixed chance SP +1."],["Lv.60 — Limitless Aspiration","Wave start: applies Ice Crystal (2 turns) to all Kaiju."],["Lv.80 — Results of Basic Training","When attacking Kaiju in Ice Crystal state, DMG dealt +18%."]],
    ascensions:[["A1","★★★★","Lingering Cold","Before Ultimate, CRIT DMG +30% (1 turn)."],["A2","★★★★","Bone-Chilling Frostbite","When attacking Kaiju in Ice Crystal state, DEF PEN Rate +16%."],["A3","★★★","Young Talent","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Restoration of Cold Energy","Each time Ice Additional DMG from Ice Crystal activates, Ultimate Gauge +2."],["A5","★★★","Compatible with the Strongest Weapon","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Awakened Compatible User","Ice Additional DMG Multiplier from Ice Crystal +60%."]],
    statusNotes:["Freeze — Ice DoT at start of action; delays Action Order by 30%.","Ice Crystal — After ally attacks, Ice Additional DMG equal to applier's ATK %."] },

  { id:"ri-soa", name:"Reno Ichikawa", variant:"Signs of Awakening", parent:"Reno Ichikawa",
    role:"Attacker", type:["Shot"], ailment:"—",
    weapons:["AR-Hyperion","AR-Cronus","AR-Lynx 75"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG > Shot DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Combat Skill",5],["Ultimate",4],["Passive Skill",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Careful Shooting",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Dynamic Targeting",desc:"Deals Shot DMG equal to 96% ATK to single Kaiju; 48% to adjacent. After attacking, applies Gunshot Wound (2 turns).",ugc:90,sp:1,type:"Shot",range:"Blast"},
      {name:"Ultimate",title:"Burst Fire",desc:"Deals Shot DMG equal to 235% ATK to single Kaiju. 100% chance to apply Effect RES −11% (2 turns).",ugc:"300★",sp:"—",type:"Shot",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Resolute Support",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Vigorous Shooting",desc:"After Combat Skill or Ultimate vs Kaiju in Gunshot Wound state, deals Shot Additional DMG equal to 22% ATK."},
    addPassives:[["Lv.40 — Clear Judgment","After dealing Shot Additional DMG from Passive, Ultimate Gauge +17."],["Lv.60 — High Motivation","Battle start: Ultimate Gauge +60."],["Lv.80 — Rising Spirit","When attacking Kaiju in Gunshot Wound state, DMG dealt +10%."]],
    ascensions:[["A1","—","Calm Demeanor","When HP ≤50%, DEF +20%."],["A2","—","Passion Within","Passive Shot Additional DMG Multiplier +20%."],["A3","—","Rapidly Growing Talent","Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A4","—","Following in the Footsteps","After attacking Kaiju in Gunshot Wound state, DMG dealt +15% (2 turns)."],["A5","—","Resolute Action","Normal Attack, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","—","Latent Potential","Before Ultimate, 100% chance DMG Taken Increase +15% (1 turn) to target."]],
    statusNotes:["Gunshot Wound — After applier's Combat Skill / Ultimate, deals Shot Additional DMG."] },

  // ── RIN SHINONOME ────────────────────────────────────────────────────────
  { id:"rs-aah", name:"Rin Shinonome", variant:"Aspiration and Honor", parent:"Rin Shinonome",
    role:"Attacker", type:["Shot"], ailment:"—",
    weapons:["GG-5012","GG-Iapetus","GG-Squirrel 02"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG > Shot DMG Dealt",
    medal:"Kaiju No. 1",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Focused Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:51,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Thorough Sweep Fire",desc:"Deals Shot DMG equal to 64% ATK to all Kaiju.",ugc:76,sp:1,type:"Shot",range:"AoE"},
      {name:"Ultimate",title:"Circular Barrage",desc:"Deals Shot DMG equal to 84% ATK to all Kaiju.",ugc:"300★",sp:"—",type:"Shot",range:"AoE"},
      {name:"Follow-Up Skill",title:"Agile Barrage",desc:"Deals Shot DMG equal to 22% ATK to all Kaiju.",ugc:60,sp:"—",type:"Shot",range:"AoE"},
    ],
    passive:{name:"Battle-Hardened Experience",desc:"Each time this unit attacks a Kaiju, DMG dealt +2.4% (max 5 stacks)."},
    addPassives:[["Lv.40 — Mark of Respect","Each Kaiju defeated: Ultimate Gauge +20."],["Lv.60 — Solid Ability","Battle start: Ultimate Gauge +60."],["Lv.80 — Refined Range Control","When HP ≥70%, ATK +20%."]],
    ascensions:[["A1","★★★★","Skillful Coordination","After causing Core Exposed, CRIT Rate +20% (2 turns)."],["A2","★★★","Will to Win","When attacking Kaiju with ≥50% HP, DMG dealt +20%."],["A3","★★★","Aspiration Born from Admiration","Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★★","Further Exertion","DMG dealt buff max stack count +2."],["A5","★★★","Hidden Feelings","Normal Attack, Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A6","★★★★","My Honor","After Combat Skill: CRIT DMG +20% (1 turn) and Ultimate Gauge +20."]],
    statusNotes:[] },

  // ── RYO IKARUGA ──────────────────────────────────────────────────────────
  { id:"ri2-pr", name:"Ryo Ikaruga", variant:"Passion and Responsibility", parent:"Ryo Ikaruga",
    role:"Supporter", type:["Shot"], ailment:"—",
    weapons:["AR-Hyperion","AR-Panther 33","—"],
    uniparts:"Wyvern-Type", priority:"HP / DEF > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Hot-Blooded Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:45,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Firing Command",desc:"Deals Shot DMG equal to 140% ATK to single Kaiju. After attacking, Ultimate Gauge Charge Rate +10% (2 turns) to self.",ugc:67,sp:1,type:"Shot",range:"Single Target"},
      {name:"Ultimate",title:"Contagious Zeal",desc:"Applies to all other allies: SPD −8.4% (2 turns) and DMG dealt +16.8% (2 turns).",ugc:"300★",sp:"—",type:"—",range:"Support"},
      {name:"Follow-Up Skill",title:"Passionate Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
    ],
    passive:{name:"Proactive Command",desc:"All other allies' ATK +12.8%."},
    addPassives:[["Lv.40 — Full-Throttle Motivation","Battle start: Ultimate Gauge +60."],["Lv.60 — Platoon Leader's Innate Strength","Normal Attack DMG dealt +40%."],["Lv.80 — Soulful Command","Wave start: ATK +10% (2 turns) to all allies."]],
    ascensions:[["A1","★★★★","Good Start","Battle start: SPD +10% (2 turns) to self."],["A2","★★★","Emphasis on Mobility","Normal Attack DMG Multiplier +20%."],["A3","★★★","Overflowing Sense of Responsibility","Normal Attack, Ultimate Lv. +2 / Max Lv. +2."],["A4","★★★★★","Overwhelming Enthusiasm","Ultimate buff duration +1 turn."],["A5","★★★","Platoon Leader's Duty","Combat Skill, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Frontline Command","All allies' DMG dealt +10%."]],
    statusNotes:[] },

  // ── SAGAN SHINOMIYA ──────────────────────────────────────────────────────
  { id:"ss-ddd", name:"Sagan Shinomiya", variant:"Dimensionally Distorted Destiny", parent:"Sagan Shinomiya",
    role:"Defender", type:["Blunt","Fire"], ailment:"Burn",
    weapons:["SH-luggnil","SH-Euchre","Heavy Duty Shield"],
    uniparts:"Bovine-Type", priority:"DEF > Ultimate Gauge Charge Rate / Effect Hit Rate > SPD / Fire DMG Dealt",
    medal:"Kaiju No. 2",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Shield Bash",desc:"Deals Blunt and Fire DMG equal to 34% DEF to a single Kaiju.",ugc:54,sp:"—",type:"Blunt / Fire",range:"Single Target"},
      {name:"Combat Skill",title:"Proclamation of Battle",desc:"100% chance to apply Taunt (2 turns) to all Kaiju. Applies Shield (2 turns) equal to 7% DEF +40 to self.",ugc:81,sp:1,type:"—",range:"Enhance"},
      {name:"Ultimate",title:"Wrathful Inferno",desc:"Before: DEF +16.9% (2 turns) to self, ATK +10.5% (2 turns) to all allies. Deals Blunt and Fire DMG equal to 70% DEF to all Kaiju.",ugc:"300★",sp:"—",type:"Blunt / Fire",range:"AoE"},
      {name:"Follow-Up Skill",title:"Shield Charge",desc:"Deals Blunt and Fire DMG equal to 77% DEF to a single Kaiju.",ugc:60,sp:"—",type:"Blunt / Fire",range:"Single Target"},
    ],
    passive:{name:"Kindling Inner Flame",desc:"After receiving attack: +1 Inner Flame (max 5) and counter the attacker for Blunt / Fire DMG equal to 32% DEF. Inner Flame: Ultimate DMG Multiplier +11%, DMG dealt +2.5%."},
    addPassives:[["Lv.40 — Pledge of Revival","If incapacitated, recover 25% Max HP and resurrect (1x/battle)."],["Lv.60 — Signal for Counterattack","After countering, 80% chance to apply Burn (2 turns): Fire DoT 100% ATK."],["Lv.80 — Fiery Will to Fight","After Ultimate, recover HP equal to 5% Max HP."]],
    ascensions:[["A1","★★★★★","Same Fighting Spirit","Before Ultimate, CRIT DMG +30% (2 turns) to all allies."],["A2","★★★","Blazing Drive","If Inner Flame ≥1, on turn start: remove 1 of this unit's debuffs."],["A3","★★★","CLOZER Captain","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Smoldering Fate","Taunt duration +1. When attacking Taunt-state Kaiju, CRIT Rate +15%."],["A5","★★★","Pride of a Shinomiya","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★","Strong Will to Protect Allies","After Ultimate, Shield (2 turns) equal to 20% DEF to all allies."]],
    statusNotes:["Burn — Fire DoT at start of action.","Taunt — Cannot choose other targets.","Inner Flame — Ultimate DMG Multiplier and DMG dealt increased per stack."] },

  { id:"ss-ol", name:"Sagan Shinomiya", variant:"Over Limit", parent:"Sagan Shinomiya",
    role:"Attacker", type:["Slash","Fire"], ailment:"—",
    weapons:["Lc-Anorollal","Lc-Brunhild","Lc-0039"],
    uniparts:"Wyvern-Type β", priority:"HP > CRIT DMG > SPD",
    medal:"Kaiju No. 6",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Normal Attack",3],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Resolute Thrust / Blazing Thrust",desc:"Normal: Slash DMG 55% ATK. Enhanced (Blaze state): Slash / Fire DMG equal to 15% Max HP to single Kaiju; 8% to adjacent.",ugc:60,sp:"—",type:"Slash / Fire",range:"Single / Blast"},
      {name:"Combat Skill",title:"Over Limit Strike",desc:"Before: consume 30% Max HP, apply Blaze (2 turns): DMG dealt −20.3%, Normal Attack becomes Enhanced. Deals Slash / Fire DMG equal to 63% Max HP to single Kaiju and adjacent.",ugc:60,sp:1,type:"Slash / Fire",range:"Blast"},
      {name:"Ultimate",title:"All-In Throw",desc:"Before: Ardor (3 turns) to self, CRIT DMG +11% (3 turns) to all allies. Deals Slash / Fire DMG equal to 46% Max HP to all Kaiju. Ardor: after ally activates Ultimate, DMG dealt +4.2% (3 turns, max 3 stacks).",ugc:"300★",sp:"—",type:"Slash / Fire",range:"AoE"},
      {name:"Follow-Up Skill",title:"Flame-Clad Pierce",desc:"Deals Slash and Fire DMG equal to 77% Max HP to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Fire",range:"Single Target"},
    ],
    passive:{name:"Encroaching Resolve",desc:"Each 400 HP lost: Ultimate DMG Multiplier +3.3% (max 5), Enhanced Normal Attack DMG Multiplier +1.2% (max 5), all allies' Ultimate DMG dealt +3.3% (max 5). After Enhanced Normal Attack, all allies' Ultimate Gauge +27."},
    addPassives:[["Lv.40 — Long-Standing Vendetta","Battle start: Ardor (3 turns) to self."],["Lv.60 — Assimilated Power","Max HP +24%."],["Lv.80 — Alternate Form","For every 200 HP over 2,000, CRIT Rate +3% (max +36%)."]],
    ascensions:[["A1","★★★★★","Rekindled Will","After Combat Skill, CRIT Rate +20% (2 turns). Enhanced Normal Attack and Ultimate DMG dealt +30%."],["A2","★★★★★","Choice to Entrust","While in Ardor state, all allies' DEF PEN Rate +24%."],["A3","★★★","Recalled Ideals","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★","Blight Incineration","After Ultimate, remove all debuffs and ailments from self and battle buddy."],["A5","★★★","Victory for All","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Burning Vow of Protection","While in Blaze state, CRIT DMG from Enhanced Normal Attack and Ultimate +150%."]],
    statusNotes:["Ardor — After ally activates Ultimate, DMG dealt increased.","Blaze — DMG dealt reduced; Normal Attack becomes Enhanced."] },

  // ── SOSHIRO HOSHINA ──────────────────────────────────────────────────────
  { id:"sh-atp", name:"Soshiro Hoshina", variant:"Ax Technique Proficiency", parent:"Soshiro Hoshina",
    role:"Supporter", type:["Slash"], ailment:"Fear / Tremble",
    weapons:["Ax-0087","Ax-Bison 91","Ax-Var"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > Slash DMG Dealt",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Normal Attack",2],["Follow-Up Skill",2]],
    skills:[
      {name:"Normal Attack",title:"Menace Swing",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:72,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Spiral Cleave",desc:"Deals Slash DMG equal to 51% ATK to all Kaiju. 80% chance to apply Tremble (2 turns): DMG Taken from Additional DMG +19.2%.",ugc:108,sp:1,type:"Slash",range:"AoE"},
      {name:"Ultimate",title:"Frenzy of the Ax",desc:"Deals Slash DMG equal to 70% ATK to all Kaiju. 80% chance to apply DMG Taken Increase +13.7% (3 turns) to targets.",ugc:"300★",sp:"—",type:"Slash",range:"AoE"},
      {name:"Follow-Up Skill",title:"Expert Drop Strike",desc:"Deals Slash DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Aura of Intimidation",desc:"Battle start: Ultimate Gauge +150. All allies' DMG dealt +5.5%. After ally attacks, 80% chance to apply Fear (1 turn, max 4 stacks): after ally attacks, Slash Additional DMG equal to 5.5% ATK × stack count."},
    addPassives:[["Lv.40 — Precision Ax Work","CRIT Rate increased by 100% of Effect Hit Rate (max +60%)."],["Lv.60 — Menacing Demeanor","After Normal Attack, Ultimate Gauge +20."],["Lv.80 — Merciless Combat Style","After Normal Attack or Follow-Up Skill, 80% chance to apply Fear to all Kaiju."]],
    ascensions:[["A1","★★★★","Manifestation of Might","Tremble also reduces Effect RES −20%. Each Tremble-state Kaiju defeated: Ultimate Gauge +10."],["A2","★★★★★","Grasp of the Battlefield","Tremble also grants DMG Taken from Additional DMG +30%."],["A3","★★★","Proficiency in Application","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Unstoppable Advance","Additional DMG CRIT DMG +46%."],["A5","★★★","Art of Close Combat","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Overwhelming Battle Aura","Slash Additional DMG Multiplier per Fear stack +10%."]],
    statusNotes:["Fear — After ally attacks, Slash Additional DMG based on ATK × stack count.","Tremble — DMG Taken from Additional DMG increased."] },

  { id:"sh-bs", name:"Soshiro Hoshina", variant:"Blade Specialist", parent:"Soshiro Hoshina",
    role:"Supporter", type:["Slash"], ailment:"—",
    weapons:["SW-Fox 48","—","—"],
    uniparts:"Wyvern-Type", priority:"HP / DEF > Ultimate Gauge Charge Rate > SPD",
    medal:"Kaiju No. 10",
    skillPrio:[["Combat Skill",5],["Passive Skill",4],["Ultimate",3],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Swift Slash",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:51,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Instant Inspiration",desc:"Applies to single ally: ST Attack and Blast Attack DMG dealt +35.7% (2 turns). If target is battle buddy, removes 1 of their debuffs.",ugc:76,sp:1,type:"—",range:"Support"},
      {name:"Ultimate",title:"Exemplary Swordplay",desc:"Deals Slash DMG equal to 143% ATK to single Kaiju. After attacking, SPD +14.7% (2 turns) to battle buddy.",ugc:"300★",sp:"—",type:"Slash",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Instantaneous Slash",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Resourcefulness in a Pinch",desc:"After Combat Skill or Ultimate: if SP ≤2, battle buddy SPD +16% (2 turns); if SP ≤1, battle buddy CRIT DMG +32% (2 turns)."},
    addPassives:[["Lv.40 — Strength-Boosting Coordination","This unit's and battle buddy's Normal Attack DMG dealt +20%."],["Lv.60 — Combat Stance","After Combat Skill, SPD +15% (1 turn) to self."],["Lv.80 — Unyielding Combat Style","On turn start, Ultimate Gauge +12."]],
    ascensions:[["A1","★★★★★","Support Stance","Battle buddy CRIT Rate +20%."],["A2","★★★","Stance for Pursuit","All allies' Follow-Up Skill DMG dealt +25%."],["A3","★★★","Keen Observation","Normal Attack, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Proficiency in Support","After Ultimate, battle buddy's Ultimate Gauge +25."],["A5","★★★","Blade Talent","Combat Skill, Ultimate, Passive Lv. +2 / Max Lv. +2."],["A6","★★★★","Genuine Praise","After battle buddy defeats Kaiju, SPD +20% (2 turns) to self."]],
    statusNotes:[] },

  { id:"sh-hsst", name:"Soshiro Hoshina", variant:"Hoshina-Style Sword-Slay Technique", parent:"Soshiro Hoshina",
    role:"Attacker", type:["Slash"], ailment:"—",
    weapons:["SW-2033","SW-Ameno Torifune","SW-Takeminakata"],
    uniparts:"Fungal-Type", priority:"ATK > CRIT Rate / CRIT DMG > Slash DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Wild Slashes",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Double Attack",desc:"Deals Slash DMG equal to 64% ATK to all Kaiju.",ugc:90,sp:1,type:"Slash",range:"AoE"},
      {name:"Ultimate",title:"Eightfold Slasher",desc:"CRIT Rate +16% for this attack. Deals Slash DMG equal to 224% ATK to single Kaiju. While in Fierce state, advances Action Order by 20%.",ugc:"300★",sp:"—",type:"Slash",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Supreme Speed Strike",desc:"Deals Slash DMG equal to 66% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Make It Quick",desc:"After defeating Kaiju, ATK +11% (2 turns). After Combat Skill, applies Fierce: CRIT Rate +11%, CRIT DMG +16%. After Normal Attack, Fierce is removed."},
    addPassives:[["Lv.40 — Miniature Kaiju Specialist","When attacking Miniature-Class Kaiju, DMG dealt +15%."],["Lv.60 — Super Speed","After Ultimate, SPD +15% (1 turn)."],["Lv.80 — Humble Swordsmanship","Battle start: applies Fierce."]],
    ascensions:[["A1","★★★★","Steady Neutralization","When attacking Kaiju with ≤50% HP, CRIT DMG +20%."],["A2","★★★★★","Only Way to Leave a Mark","Slash DMG Dealt +15%."],["A3","★★★","Fruitful Training","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","Path-Carving Determination","After Ultimate, Ultimate Gauge Charge Rate +20% (2 turns)."],["A5","★★★","Dedication to the Blade","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Unwavering Edge","While in Fierce state, DEF PEN Rate +25%."]],
    statusNotes:["Fierce — CRIT Rate and CRIT DMG increased; removed after Normal Attack."] },

  { id:"sh-np", name:"Soshiro Hoshina", variant:"New Possibilities", parent:"Soshiro Hoshina",
    role:"Attacker", type:["Slash","Wind"], ailment:"Windbite",
    weapons:["SW-Ihcatiamak","SW-Takeminakata","SW-Ameno Torifune"],
    uniparts:"Wolf-Type", priority:"ATK > Effect Hit Rate > Wind DMG Dealt",
    medal:"Kaiju No. 6",
    skillPrio:[["Passive Skill",5],["Combat Skill",4],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Dragonfly Return",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Kamaitachi",desc:"Deals Slash and Wind DMG equal to 116% ATK to single Kaiju; 29% to adjacent. 100% chance to apply Windbite (2 turns): Wind DoT 12.8% ATK.",ugc:90,sp:1,type:"Slash / Wind",range:"Blast"},
      {name:"Ultimate",title:"Pinwheel Vortex",desc:"Before: +3 Opening stacks to single Kaiju. Deals Slash and Wind DMG equal to 442% ATK to single Kaiju.",ugc:"300★",sp:"—",type:"Slash / Wind",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Mountain Storm",desc:"Deals Slash and Wind DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash / Wind",range:"Single Target"},
    ],
    passive:{name:"Insight to Pierce Openings",desc:"After attacking: +1 Opening (max 10). When attacking Kaiju in Windbite state: +2 Opening. [3+] CRIT Rate +13.3%. [5+] After Combat Skill, advance Action Order by 50% (1x every 2 turns). [10] CRIT DMG +33%, Ultimate DMG Multiplier +44%."},
    addPassives:[["Lv.40 — Keen Sharpness","CRIT DMG increased by 300% of Effect Hit Rate (max +180%)."],["Lv.60 — Foresight Technique","Wave start: +2 Opening to all Kaiju."],["Lv.80 — Rising Storm","After attacking, Combat Skill DMG dealt +10% (max 5 stacks)."]],
    ascensions:[["A1","★★★★★","Gale of the Kamaitachi","DEF PEN Rate +16%. Wave start: 100% chance Windbite (1 turn) to all Kaiju."],["A2","★★★★","Opening-Cleaving Blade","When Combat Skill vs Kaiju with 5+ Opening stacks, Combat Skill DMG dealt +30%."],["A3","★★★","Proficiency in Shuriken","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★","Transition Energy Utilization","After Ultimate or Follow-Up Skill, SPD +12% (2 turns)."],["A5","★★★","A New Horizon","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Realm of Masterful Art","After Combat Skill, +1 Opening to target. After attacking, Wind DMG dealt +7% (max 5 stacks)."]],
    statusNotes:["Windbite — Wind DoT at start of action.","Opening — Effects activate at 3 / 5 / 10 stacks."] },

  { id:"sh-uf", name:"Soshiro Hoshina", variant:"United Front", parent:"Soshiro Hoshina",
    role:"Attacker", type:["Slash"], ailment:"—",
    weapons:["SW-Susanoo","SW-Ameno Torifune","SW-Takeminakata"],
    uniparts:"Lizard-Type", priority:"ATK > CRIT Rate / CRIT DMG > Slash DMG Dealt",
    medal:"Kaiju No. 10 (Giant Form)",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Air Slicer",desc:"Deals Slash DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
      {name:"Combat Skill",title:"Fleeting Slasher / Synchronized Swordplay",desc:"Normal: Slash DMG 131% ATK (single) + 66% (adjacent), advance Action Order +10%. Enhanced (Resonance): Slash DMG dealt +12.8%, deals 230% ATK to single Kaiju.",ugc:90,sp:1,type:"Slash",range:"Blast / ST"},
      {name:"Ultimate",title:"12-Layered Strike",desc:"Deals Slash DMG equal to 420% ATK to single Kaiju. If ≤2 Kaiju on field, applies Resonance: Combat Skill enhanced. If ≥3 Kaiju remain after Ultimate, Resonance is removed.",ugc:"300★",sp:"—",type:"Slash",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Return Slasher",desc:"Deals Slash DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Slash",range:"Single Target"},
    ],
    passive:{name:"Synchronized Spirit",desc:"While not in Resonance state: Ultimate Gauge Charge Rate +11%. While in Resonance state: CRIT DMG +22%."},
    addPassives:[["Lv.40 — Ultimate State","After Ultimate, applies Slash Additional DMG state (1 time: Slash Additional DMG 30% ATK, then removes state)."],["Lv.60 — Valiance in Adversity","When HP ≥50%, Slash DMG dealt +15%."],["Lv.80 — Kindred Spirits","While in Resonance state, Ultimate DMG dealt +15%."]],
    ascensions:[["A1","★★★★★","Polished Technique","Before Combat Skill, CRIT Rate +25% (1 turn)."],["A2","★★★★","Honed Senses","Before Ultimate or Follow-Up Skill, ATK +15% (max 5 stacks)."],["A3","★★★","Unexpected Combination","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★","The Path Forged","After defeating Kaiju, Ultimate Gauge +45."],["A5","★★★","Critical Realization","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Joy of Combat","After Ultimate, CRIT DMG +100% (2 turns)."]],
    statusNotes:["Resonance — Combat Skill becomes Enhanced."] },

  // ── SUITED ───────────────────────────────────────────────────────────────
  { id:"suited-uc", name:"Suited", variant:"Unbridled Curiosity", parent:"Suited",
    role:"Attacker", type:["Blunt"], ailment:"—",
    weapons:["HM-Eporhtnacyl","HM-Holdem","Standard Hammer"],
    uniparts:"Caudata-Type", priority:"ATK > CRIT DMG > Blunt DMG Dealt",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Swing for the Dream",desc:"Deals Blunt DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
      {name:"Combat Skill",title:"Free-Spirited Slam",desc:"Deals Blunt DMG equal to 75% ATK to single Kaiju and adjacent. After attacking, applies Mark (2 turns): DMG Taken from Follow-Up Skill and Extra Attack +19.2%.",ugc:90,sp:1,type:"Blunt",range:"Blast"},
      {name:"Ultimate",title:"Suited's Special Bombs",desc:"Deals Blunt DMG equal to 336% ATK to single Kaiju; 168% to adjacent. After attacking, applies 7 stacks of Chips.",ugc:"300★",sp:"—",type:"Blunt",range:"Blast"},
      {name:"Follow-Up Skill",title:"Calculated Hammer Strike",desc:"Deals Blunt DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Blunt",range:"Single Target"},
    ],
    passive:{name:"Born Gambler",desc:"Battle start: 7 Chips (max 7). After Normal Attack or Combat Skill: Extra Attack + consume 1 Chip. After ally attacks with Combat Skill / Ultimate / Extra Attack / Counter: 52% fixed chance Extra Attack + consume 1 Chip. Extra Attack: Blunt DMG 23% ATK to all Kaiju."},
    addPassives:[["Lv.40 — High Energy","After Ultimate, ATK +25% (2 turns)."],["Lv.60 — Restless Curiosity","After Extra Attack vs Kaiju in Mark state, Ultimate Gauge +10."],["Lv.80 — Theoretical Output","After Extra Attack, Follow-Up Skill and Extra Attack DMG dealt +15% to all allies (max 3 stacks)."]],
    ascensions:[["A1","★★★★","Destructive Logic","When attacking Kaiju in Mark state, DEF PEN Rate +26%."],["A2","★★★★★","Eager Anticipation","After Extra Attack, CRIT DMG +25% (1 turn) to all allies."],["A3","★★★","Theoretical Foundations","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★★","All-In","Before Ultimate: Combat Skill DMG Multiplier +25% (2 turns), Extra Attack DMG Multiplier +70% (2 turns)."],["A5","★★★","Endless Research","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Bursting Ambition","Chips max stack +3. After Ultimate, additionally +3 Chips. Blunt DMG from Extra Attack +25%."]],
    statusNotes:["Chips — Activates Extra Attack; consumed per activation.","Mark — DMG Taken from Follow-Up Skill and Extra Attack increased."] },

  // ── TAE NAKANOSHIMA ──────────────────────────────────────────────────────
  { id:"tn-kpl", name:"Tae Nakanoshima", variant:"The Keen-Eyed Platoon Leader", parent:"Tae Nakanoshima",
    role:"Attacker", type:["Shot","Fire"], ailment:"Burn",
    weapons:["AR-Hyperion","AR-Cronus","AR-Narwhal 59"],
    uniparts:"Spider-Type", priority:"ATK > Effect Hit Rate > Fire DMG Dealt",
    medal:"Kaiju No. 10",
    skillPrio:[["Combat Skill",4],["Ultimate",3],["Passive Skill",3],["Normal Attack",2],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Aggressive Shot",desc:"Deals Shot DMG equal to 55% ATK to a single Kaiju.",ugc:66,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Blazing Fire Shot",desc:"Deals Shot and Fire DMG equal to 65% ATK to single Kaiju. 80% chance to apply Burn (2 turns): Fire DoT 39% ATK.",ugc:99,sp:1,type:"Shot / Fire",range:"Single Target"},
      {name:"Ultimate",title:"Heat Grenade",desc:"Before: DMG dealt +5.5% (3 turns), DoT DMG Multiplier +16.5% (3 turns) to self. Deals Shot and Fire DMG equal to 124% ATK to single Kaiju.",ugc:"300★",sp:"—",type:"Shot / Fire",range:"Single Target"},
      {name:"Follow-Up Skill",title:"Passionate Shot",desc:"Deals Shot and Fire DMG equal to 55% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Fire",range:"Single Target"},
    ],
    passive:{name:"Fervent Drive",desc:"After Normal Attack or Ultimate vs Kaiju in Burn state, ATK +27.5% (1 turn)."},
    addPassives:[["Lv.40 — Secret Motive","DoT DMG Multiplier +40%."],["Lv.60 — Overheated Fighting Spirit","Effect Hit Rate +16%."],["Lv.80 — Increasing Blaze","Each PLT destroyed: Ultimate Gauge +10."]],
    ascensions:[["A1","★★★","Ample Stamina","After Ultimate, Ultimate Gauge Charge Rate +20% (2 turns)."],["A2","★★★","Penetrating Gaze","After attacking Kaiju in Burn state, DMG dealt +20% (2 turns)."],["A3","★★★","Cougar Mode","Normal Attack, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Firm Stance","When Burn application fails from Combat Skill, Effect Hit Rate +40% (1 turn). 1x every 2 turns."],["A5","★★★","Platoon Leader's Pride","Combat Skill, Ultimate Lv. +2 / Max Lv. +2."],["A6","★★★★★","Expanded Heatwave","After Ultimate, 65% chance to apply Burn (2 turns) to single Kaiju and adjacent."]],
    statusNotes:["Burn — Fire DoT at start of action."] },

  // ── WANG MEIXING ─────────────────────────────────────────────────────────
  { id:"wm-nwc", name:"Wang Meixing", variant:"Negotiator of Wit and Charm", parent:"Wang Meixing",
    role:"Supporter", type:["Shot","Lightning"], ailment:"Shock Wire",
    weapons:["AR-Gnijiluh","AR-Hyperion","AR-Narwhal 59"],
    uniparts:"Fungal-Type β", priority:"ATK > Effect Hit Rate > Lightning DMG Dealt",
    medal:"Kaiju A (Divided entity)",
    skillPrio:[["Ultimate",5],["Passive Skill",5],["Combat Skill",4],["Follow-Up Skill",2],["Normal Attack",1]],
    skills:[
      {name:"Normal Attack",title:"Lightning Wire Shot",desc:"Deals Shot and Lightning DMG equal to 34% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Lightning",range:"Single Target"},
      {name:"Combat Skill",title:"Shock Net",desc:"Deals Shot and Lightning DMG equal to 15% ATK to all Kaiju. 80% chance to apply Shock Wire (2 turns): DoT taken +8%, Lightning DoT 44% ATK.",ugc:90,sp:1,type:"Shot / Lightning",range:"AoE"},
      {name:"Ultimate",title:"Anti-Kaiju Mass Orbital Weapon: Tianxie",desc:"Deals Shot and Lightning DMG equal to 82% ATK to all Kaiju. 80% chance to apply Shock Wire (3 turns).",ugc:"300★",sp:"—",type:"Shot / Lightning",range:"AoE"},
      {name:"Follow-Up Skill",title:"Snare Shot",desc:"Deals Shot and Lightning DMG equal to 77% ATK to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Lightning",range:"Single Target"},
    ],
    passive:{name:"Absolute Wires",desc:"After Combat Skill, 80% chance to apply Shock Wire (2 turns). Based on highest debuff/ailment count on any Kaiju: [2+] 80% chance DMG Taken Increase +5.5% (2 turns) to all Kaiju; [4+] DoT DMG Multiplier +16.5% (1 turn) to all allies; [6+] DEF PEN Rate +7.8% (1 turn) to all allies."},
    addPassives:[["Lv.40 — Dominant Demeanor","After Combat Skill vs Kaiju in Shock Wire state, 50% chance SP +1."],["Lv.60 — Thorough Preparation","Battle start: Ultimate Gauge +60."],["Lv.80 — Adept Technique","DMG dealt increased by 80% of Effect Hit Rate (max +56%)."]],
    ascensions:[["A1","★★★★","Electrifying Stratagem","After Ultimate, 100% chance ATK −15% (3 turns) to target."],["A2","★★★★★","Arrangements Complete","When ally attacks Kaiju in Shock Wire state, ally's DMG dealt +15%."],["A3","★★★","CLOZER's Intel Specialist","Normal Attack, Combat Skill Lv. +2 / Max Lv. +2."],["A4","★★★★","Plan in Orbit","Each time Kaiju takes DoT, Ultimate Gauge +4."],["A5","★★★","Unseen Effort","Ultimate, Passive, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Exceeding Expectations","After Ultimate, 100% chance DEF −20% (3 turns) to target. DoT DMG Multiplier +50%."]],
    statusNotes:["Shock Wire — DMG taken from DoT increased; Lightning DoT at start of action."] },

  // ── ZOEE WANDERFALKE ─────────────────────────────────────────────────────
  { id:"zw-wu", name:"Zoee Wanderfalke", variant:"The Weapon Unsealed", parent:"Zoee Wanderfalke",
    role:"Attacker", type:["Shot","Slash"], ailment:"—",
    weapons:["RF-Mruwdnil","RF-Judith","Sustained Combat Ride-Frame"],
    uniparts:"Paraves-Type α", priority:"HP > CRIT DMG > SPD",
    medal:"Kaiju No. 6",
    skillPrio:[["Combat Skill",5],["Passive Skill",5],["Ultimate",4],["Normal Attack",1],["Follow-Up Skill",1]],
    skills:[
      {name:"Normal Attack",title:"Fierce Impalement",desc:"Deals Shot DMG equal to 23% Max HP to a single Kaiju.",ugc:60,sp:"—",type:"Shot",range:"Single Target"},
      {name:"Combat Skill",title:"Dual-Armament Strike / Impulsive Onslaught",desc:"Normal: Slash / Shot DMG 75% Max HP (single) + 12% (adjacent). Enhanced (Berserk): no SP cost, consumes 5% Max HP, deals 87% Max HP (single) + 15% (adjacent).",ugc:90,sp:"1 / 0",type:"Slash / Shot",range:"Blast"},
      {name:"Ultimate",title:"Ecstatic Railgun",desc:"Before: consumes 60% Max HP (HP becomes 1 if insufficient). Deals Slash / Shot DMG equal to 208% Max HP (single) + 48% (adjacent). After: Shield (2 turns) equal to 40% Max HP.",ugc:"300★",sp:"—",type:"Shot / Slash",range:"Blast"},
      {name:"Follow-Up Skill",title:"Thrilling Pursuit",desc:"Deals Slash and Shot DMG equal to 34% Max HP to a single Kaiju.",ugc:60,sp:"—",type:"Shot / Slash",range:"Single Target"},
    ],
    passive:{name:"Inner Persona",desc:"Each 20% Max HP lost: DMG dealt +2.3% (max 6 stacks). After Ultimate, applies Berserk (3 turns): CRIT Rate +60%, Shot DMG dealt +20%, Combat Skill → Enhanced; can only use Enhanced Combat Skill, Ultimate, Follow-Up."},
    addPassives:[["Lv.40 — Unrestrained Momentum","After Ultimate, SPD +25% (3 turns)."],["Lv.60 — Last-Stand Exhilaration","When HP ≤30%, DMG Taken Reduction +20%."],["Lv.80 — Savage Instinct","Enhanced Combat Skill CRIT DMG +20%."]],
    ascensions:[["A1","★★★★★","Breakthrough Will","Battle start: Ultimate Gauge +90. Each 20% Max HP lost: CRIT DMG +10% (max 5 stacks)."],["A2","★★★★★","Chain of Annihilation","After Enhanced Combat Skill, advance Action Order by 50% (1x every 2 turns)."],["A3","★★★","Battle-Hungry Instinct","Normal Attack, Passive Lv. +2 / Max Lv. +2."],["A4","★★★★","Absorbed Aggression","Shield Application Multiplier +50%. Ultimate Shield duration +1 turn."],["A5","★★★","Berserker Unleashed","Combat Skill, Ultimate, Follow-Up Skill Lv. +2 / Max Lv. +2."],["A6","★★★★★","Exultation in Extremis","Before Ultimate: Enhanced Combat Skill DMG Multiplier +30% (3 turns), Ultimate DMG Multiplier +30% (3 turns)."]],
    statusNotes:["Berserk — CRIT Rate and Shot DMG dealt increased; Combat Skill becomes Enhanced; restricted skill usage."] },
];

const PARENTS = [...new Set(CHARACTERS.map(c => c.parent))];

// ── COMPONENTS ───────────────────────────────────────────────────────────────

function Stars({ n }) {
  return <span style={{color:"#f0c030",letterSpacing:"1px",fontSize:"12px"}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;
}

function TypePill({ type }) {
  const parts = type.split(/\s*\/\s*/);
  return (
    <span style={{display:"inline-flex",gap:"3px",flexWrap:"wrap"}}>
      {parts.map(t => {
        const c = TYPE_COLOR[t.trim()] || "#888";
        return (
          <span key={t} style={{background:c+"22",border:`1px solid ${c}55`,color:c,
            padding:"1px 7px",borderRadius:"3px",fontSize:"11px",fontWeight:"700",letterSpacing:"0.4px"}}>
            {t.trim()}
          </span>
        );
      })}
    </span>
  );
}

function CharacterCard({ char, onClick }) {
  const rc = ROLE_COLOR[char.role] || "#fff";
  const [hov, setHov] = useState(false);
  return (
    <div onClick={() => onClick(char)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{background: hov ? "#111d2c" : "#0d1620",
        border: `1px solid ${hov ? rc+"66" : "#1c2d40"}`,
        borderLeft:`3px solid ${rc}`,borderRadius:"6px",padding:"14px 15px",
        cursor:"pointer",transition:"all 0.15s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:"11px",color:"#6a8099",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"2px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{char.name}</div>
          <div style={{fontSize:"14px",color:"#d4e0ee",fontWeight:"700",lineHeight:"1.3"}}>{char.variant}</div>
        </div>
        <span style={{background:ROLE_BG[char.role],color:rc,padding:"2px 7px",borderRadius:"3px",
          fontSize:"10px",fontWeight:"700",letterSpacing:"0.8px",textTransform:"uppercase",flexShrink:0,marginLeft:"8px",whiteSpace:"nowrap"}}>
          {char.role}
        </span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"3px",alignItems:"center"}}>
        <TypePill type={char.type.join(" / ")} />
        {char.ailment !== "—" && <span style={{color:"#6a8099",fontSize:"10px",marginLeft:"3px"}}>· {char.ailment}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom:"22px"}}>
      <div style={{fontSize:"9px",fontWeight:"700",letterSpacing:"2.5px",textTransform:"uppercase",
        color:"#f0c030",borderBottom:"1px solid #1c2d40",paddingBottom:"6px",marginBottom:"11px"}}>
        {title}
      </div>
      {children}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div style={{display:"flex",gap:"10px",marginBottom:"5px",alignItems:"flex-start"}}>
      <span style={{color:"#6a8099",fontSize:"10px",textTransform:"uppercase",letterSpacing:"0.4px",
        minWidth:"100px",flexShrink:0,paddingTop:"1px"}}>{label}</span>
      <span style={{color:"#c4d4e0",fontSize:"12px",fontFamily:"'Share Tech Mono',monospace",lineHeight:"1.5"}}>{value}</span>
    </div>
  );
}

function SkillCard({ skill }) {
  return (
    <div style={{background:"#08111c",border:"1px solid #1a2d3e",borderRadius:"5px",padding:"11px 13px",marginBottom:"9px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px",gap:"8px"}}>
        <div>
          <span style={{color:"#f0c030",fontSize:"9px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>{skill.name} — </span>
          <span style={{color:"#d4e0ee",fontSize:"13px",fontWeight:"700"}}>{skill.title}</span>
        </div>
        <div style={{display:"flex",gap:"8px",flexShrink:0,fontSize:"10px"}}>
          <span style={{color:"#5c9ee8"}}>UGC {skill.ugc}</span>
          {skill.sp !== "—" && <span style={{color:"#f0c030"}}>SP {skill.sp}</span>}
        </div>
      </div>
      <div style={{color:"#8aa0b8",fontSize:"12px",lineHeight:"1.65",marginBottom:"7px"}}>{skill.desc}</div>
      <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
        <TypePill type={skill.type} />
        <span style={{color:"#506070",fontSize:"10px"}}>{skill.range}</span>
      </div>
    </div>
  );
}

function PassiveCard({ label, title, desc, accent }) {
  return (
    <div style={{background:"#08111c",border:`1px solid ${accent?"#f0c03044":"#1a2d3e"}`,
      borderLeft:accent?"3px solid #f0c030":"1px solid #1a2d3e",
      borderRadius:"5px",padding:"10px 13px",marginBottom:"7px"}}>
      {label && <div style={{color:"#f0c030",fontSize:"9px",fontWeight:"700",letterSpacing:"1px",marginBottom:"3px"}}>{label}</div>}
      <div style={{color:"#d4e0ee",fontSize:"12px",fontWeight:"700",marginBottom:"4px"}}>{title}</div>
      <div style={{color:"#8aa0b8",fontSize:"11px",lineHeight:"1.6"}}>{desc}</div>
    </div>
  );
}

function AscRow({ asc }) {
  const [lvl, stars, name, desc] = asc;
  return (
    <div style={{display:"flex",gap:"10px",marginBottom:"8px",background:"#08111c",
      border:"1px solid #1a2d3e",borderRadius:"5px",padding:"9px 12px"}}>
      <div style={{minWidth:"28px",flexShrink:0}}>
        <div style={{color:"#f0c030",fontSize:"11px",fontWeight:"700"}}>{lvl}</div>
        <div style={{color:"#8aa0b8",fontSize:"9px",letterSpacing:"0.5px"}}>{stars}</div>
      </div>
      <div>
        <div style={{color:"#d4e0ee",fontSize:"12px",fontWeight:"700",marginBottom:"2px"}}>{name}</div>
        <div style={{color:"#8aa0b8",fontSize:"11px",lineHeight:"1.55"}}>{desc}</div>
      </div>
    </div>
  );
}

function CharacterPage({ char, onBack }) {
  const rc = ROLE_COLOR[char.role] || "#fff";
  return (
    <div style={{minHeight:"100vh",background:"#050a12",padding:"20px 24px",fontFamily:"'Exo 2',sans-serif",color:"#d4e0ee"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto"}}>
        <button onClick={onBack} style={{background:"none",border:"1px solid #1c2d40",color:"#8aa0b8",
          padding:"6px 14px",borderRadius:"4px",cursor:"pointer",marginBottom:"20px",
          fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase"}}>
          ← Back to Database
        </button>

        {/* Hero */}
        <div style={{borderBottom:"1px solid #1c2d40",paddingBottom:"18px",marginBottom:"24px"}}>
          <div style={{fontSize:"11px",color:"#6a8099",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"4px"}}>{char.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:"14px",flexWrap:"wrap",marginBottom:"10px"}}>
            <h1 style={{fontFamily:"'Russo One',sans-serif",fontSize:"clamp(20px,3vw,30px)",
              color:"#f0c030",margin:0,textTransform:"uppercase",letterSpacing:"1px"}}>{char.variant}</h1>
            <span style={{background:ROLE_BG[char.role],color:rc,padding:"3px 11px",borderRadius:"4px",
              fontSize:"11px",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase"}}>{char.role}</span>
          </div>
          <TypePill type={char.type.join(" / ")} />
          {char.ailment !== "—" && <span style={{color:"#8aa0b8",fontSize:"12px",marginLeft:"10px"}}>Inflicts: {char.ailment}</span>}
        </div>

        {/* Two-column layout */}
        <div style={{display:"grid",gridTemplateColumns:"minmax(240px,300px) 1fr",gap:"28px"}}>

          {/* LEFT COLUMN */}
          <div>
            <Section title="Build">
              <DataRow label="Uniparts" value={char.uniparts} />
              <DataRow label="Stat Priority" value={char.priority} />
              <DataRow label="Exploit Medal" value={char.medal} />
            </Section>

            <Section title="Best Weapons">
              {["Best","2nd","3rd"].map((lbl,i) => char.weapons[i] && char.weapons[i] !== "—" &&
                <DataRow key={i} label={lbl} value={char.weapons[i]} />)}
            </Section>

            <Section title="Skill Upgrade Priority">
              {char.skillPrio.map(([name,n]) => (
                <div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"5px"}}>
                  <span style={{color:"#c4d4e0",fontSize:"12px"}}>{name}</span>
                  <Stars n={n} />
                </div>
              ))}
            </Section>

            {char.statusNotes.length > 0 && (
              <Section title="Status / Ailment Reference">
                {char.statusNotes.map((note,i) => (
                  <div key={i} style={{color:"#8aa0b8",fontSize:"11px",lineHeight:"1.65",marginBottom:"5px"}}>
                    <span style={{color:"#f0c03099"}}>◆ </span>{note}
                  </div>
                ))}
              </Section>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <Section title="Skills">
              {char.skills.map((s,i) => <SkillCard key={i} skill={s} />)}
            </Section>

            <Section title="Passive Skill">
              <PassiveCard accent title={char.passive.name} desc={char.passive.desc} />
              {char.addPassives.map(([lbl,desc],i) => (
                <PassiveCard key={i} label={lbl} title="" desc={desc} />
              ))}
            </Section>

            <Section title="Ascension Unlocks">
              {char.ascensions.map((a,i) => <AscRow key={i} asc={a} />)}
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ groups, onSelect, search, onSearch }) {
  return (
    <div style={{minHeight:"100vh",background:"#050a12",padding:"24px",fontFamily:"'Exo 2',sans-serif"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto"}}>

        {/* Header */}
        <div style={{textAlign:"center",marginBottom:"28px",paddingBottom:"24px",borderBottom:"1px solid #1c2d40"}}>
          <div style={{color:"#f0c03088",fontSize:"9px",letterSpacing:"4px",textTransform:"uppercase",marginBottom:"10px"}}>
            Defense Force Intelligence Division
          </div>
          <h1 style={{fontFamily:"'Russo One',sans-serif",fontSize:"clamp(22px,4vw,38px)",
            color:"#d4e0ee",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"2px",lineHeight:1.1}}>
            Kaiju No. 8 <span style={{color:"#f0c030"}}>The Game</span>
          </h1>
          <div style={{color:"#6a8099",fontSize:"11px",letterSpacing:"3px",textTransform:"uppercase"}}>
            Character Database
          </div>
          {/* Legend */}
          <div style={{display:"flex",gap:"16px",justifyContent:"center",marginTop:"16px",flexWrap:"wrap"}}>
            {Object.entries(ROLE_COLOR).filter(([k]) => k !== "Support").map(([role,c]) => (
              <span key={role} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <span style={{width:"8px",height:"8px",borderRadius:"1px",background:c,display:"inline-block"}} />
                <span style={{color:"#6a8099",fontSize:"11px"}}>{role}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{marginBottom:"28px",position:"relative"}}>
          <input value={search} onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, variant, role, or element…"
            style={{width:"100%",background:"#0d1620",border:"1px solid #1c2d40",color:"#d4e0ee",
              padding:"11px 16px",borderRadius:"6px",fontSize:"14px",outline:"none",
              boxSizing:"border-box",fontFamily:"inherit"}} />
        </div>

        {/* Groups */}
        {PARENTS.map(parent => {
          const group = groups[parent] || [];
          if (!group.length) return null;
          return (
            <div key={parent} style={{marginBottom:"28px"}}>
              <div style={{fontFamily:"'Russo One',sans-serif",fontSize:"12px",textTransform:"uppercase",
                letterSpacing:"2px",color:"#8aa0b8",borderBottom:"1px solid #1c2d40",
                paddingBottom:"7px",marginBottom:"12px",display:"flex",alignItems:"center",gap:"10px"}}>
                {parent}
                <span style={{color:"#3a5060",fontSize:"10px",fontFamily:"inherit"}}>({group.length})</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"9px"}}>
                {group.map(c => <CharacterCard key={c.id} char={c} onClick={onSelect} />)}
              </div>
            </div>
          );
        })}

        {PARENTS.every(p => !(groups[p]||[]).length) && (
          <div style={{textAlign:"center",color:"#6a8099",padding:"48px 0",fontStyle:"italic"}}>No characters match your search.</div>
        )}

        <div style={{textAlign:"center",color:"#2a3a48",fontSize:"10px",letterSpacing:"1px",marginTop:"32px",paddingTop:"16px",borderTop:"1px solid #1a2535"}}>
          {CHARACTERS.length} characters · Kaiju No. 8 The Game Guide
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const el = document.createElement("link");
    el.rel = "stylesheet";
    el.href = "https://fonts.googleapis.com/css2?family=Russo+One&family=Exo+2:wght@400;600;700&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const groups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q ? CHARACTERS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.variant.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.type.some(t => t.toLowerCase().includes(q)) ||
      (c.ailment !== "—" && c.ailment.toLowerCase().includes(q))
    ) : CHARACTERS;
    const g = {};
    PARENTS.forEach(p => { g[p] = filtered.filter(c => c.parent === p); });
    return g;
  }, [search]);

  if (selected) return <CharacterPage char={selected} onBack={() => setSelected(null)} />;
  return <HomePage groups={groups} onSelect={setSelected} search={search} onSearch={setSearch} />;
}
