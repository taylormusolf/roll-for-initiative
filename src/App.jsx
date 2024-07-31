import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Encounter from './components/Encounter';
import EncounterManager from './components/EncounterManager';
import EncounterProvider from './context/EncounterContext';
import MonsterStatBlock from './components/MonsterStatBlock';

const monsterData = {
  "_id": "oaxKg1yQDmK2PWXG",
  "img": "systems/pf2e/icons/default-icons/npc.svg",
  "items": [
      {
          "_id": "mS16mfAS5hbK048v",
          "img": "systems/pf2e/icons/default-icons/spellcastingEntry.svg",
          "name": "Divine Innate Spells",
          "sort": 100000,
          "system": {
              "autoHeightenLevel": {
                  "value": null
              },
              "description": {
                  "value": ""
              },
              "prepared": {
                  "flexible": false,
                  "value": "innate"
              },
              "proficiency": {
                  "value": 0
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [],
              "showSlotlessLevels": {
                  "value": false
              },
              "slots": {},
              "slug": null,
              "spelldc": {
                  "dc": 17,
                  "mod": 0,
                  "value": 9
              },
              "tradition": {
                  "value": "divine"
              },
              "traits": {}
          },
          "type": "spellcastingEntry"
      },
      {
          "_id": "syyUh0WOgLKpCRdF",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.spells-srd.Item.pkcOby5prOausy1k"
              }
          },
          "img": "systems/pf2e/icons/spells/read-omens.webp",
          "name": "Read Omens",
          "sort": 200000,
          "system": {
              "area": null,
              "cost": {
                  "value": ""
              },
              "counteraction": false,
              "damage": {},
              "defense": null,
              "description": {
                  "value": "<p>You peek into the future. Choose a particular goal or activity you plan to engage in within 1 week, or an event you expect might happen within 1 week. You learn a cryptic clue or piece of advice that could help with the chosen event, often in the form of a rhyme or omen.</p>"
              },
              "duration": {
                  "sustained": false,
                  "value": ""
              },
              "level": {
                  "value": 4
              },
              "location": {
                  "heightenedLevel": 4,
                  "value": "mS16mfAS5hbK048v"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Player Core"
              },
              "range": {
                  "value": ""
              },
              "requirements": "",
              "rules": [],
              "slug": "read-omens",
              "target": {
                  "value": ""
              },
              "time": {
                  "value": "10 minutes"
              },
              "traits": {
                  "rarity": "uncommon",
                  "traditions": [
                      "divine",
                      "occult"
                  ],
                  "value": [
                      "concentrate",
                      "manipulate",
                      "prediction"
                  ]
              }
          },
          "type": "spell"
      },
      {
          "_id": "1AVEDCYseyeJLtb8",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.spells-srd.Item.aIHY2DArKFweIrpf"
              }
          },
          "img": "systems/pf2e/icons/spells/command.webp",
          "name": "Command",
          "sort": 300000,
          "system": {
              "area": null,
              "cost": {
                  "value": ""
              },
              "counteraction": false,
              "damage": {},
              "defense": {
                  "save": {
                      "basic": false,
                      "statistic": "will"
                  }
              },
              "description": {
                  "value": "<p>You shout a command that's hard to ignore. You can command the target to approach you, run away (as if it had the @UUID[Compendium.pf2e.conditionitems.Item.Fleeing] condition), release what it's holding, drop @UUID[Compendium.pf2e.conditionitems.Item.Prone], or stand in place. It can't @UUID[Compendium.pf2e.actionspf2e.Item.Delay] or take any reactions until it has obeyed your command. The effects depend on the target's Will save.</p>\n<hr />\n<p><strong>Success</strong> The creature is unaffected.</p>\n<p><strong>Failure</strong> For the first action on its next turn, the creature must use a single action to do as you command.</p>\n<p><strong>Critical Failure</strong> The target must use all its actions on its next turn to obey your command.</p>\n<hr />\n<p><strong>Heightened (5th)</strong> You can target up to 10 creatures.</p>"
              },
              "duration": {
                  "sustained": false,
                  "value": "until the end of the target's next turn"
              },
              "heightening": {
                  "levels": {
                      "5": {
                          "target": {
                              "value": "10 creatures"
                          }
                      }
                  },
                  "type": "fixed"
              },
              "level": {
                  "value": 1
              },
              "location": {
                  "heightenedLevel": 1,
                  "value": "mS16mfAS5hbK048v"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Player Core"
              },
              "range": {
                  "value": "30 feet"
              },
              "requirements": "",
              "rules": [],
              "slug": "command",
              "target": {
                  "value": "1 creature"
              },
              "time": {
                  "value": "2"
              },
              "traits": {
                  "rarity": "common",
                  "traditions": [
                      "arcane",
                      "divine",
                      "occult"
                  ],
                  "value": [
                      "auditory",
                      "concentrate",
                      "linguistic",
                      "manipulate",
                      "mental"
                  ]
              }
          },
          "type": "spell"
      },
      {
          "_id": "43d95EaoCTpuIvKz",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.spells-srd.Item.dINQzhqGmIsqGMUY"
              }
          },
          "img": "systems/pf2e/icons/spells/mending.webp",
          "name": "Mending",
          "sort": 400000,
          "system": {
              "area": null,
              "cost": {
                  "value": ""
              },
              "counteraction": false,
              "damage": {},
              "defense": null,
              "description": {
                  "value": "<p>You repair the target item. You restore 5 Hit Points per spell rank to the target, potentially removing the @UUID[Compendium.pf2e.conditionitems.Item.Broken] condition if this repairs it past the item's Broken Threshold. You can't replace lost pieces or repair an object that's been completely destroyed.</p>\n<hr />\n<p><strong>Heightened (2nd)</strong> You can target a non-magical object of 1 Bulk or less.</p>\n<p><strong>Heightened (3rd)</strong> You can target a non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less.</p>"
              },
              "duration": {
                  "sustained": false,
                  "value": ""
              },
              "heightening": {
                  "levels": {
                      "2": {
                          "target": {
                              "value": "non-magical object of 1 Bulk or less"
                          }
                      },
                      "3": {
                          "target": {
                              "value": "non-magical object of 2 Bulk or less, or a magical object of 1 Bulk or less"
                          }
                      }
                  },
                  "type": "fixed"
              },
              "level": {
                  "value": 1
              },
              "location": {
                  "heightenedLevel": 1,
                  "uses": {
                      "max": 3,
                      "value": 3
                  },
                  "value": "mS16mfAS5hbK048v"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Player Core"
              },
              "range": {
                  "value": "touch"
              },
              "requirements": "",
              "rules": [],
              "slug": "mending",
              "target": {
                  "value": "non-magical object of light Bulk or less"
              },
              "time": {
                  "value": "10 minutes"
              },
              "traits": {
                  "rarity": "common",
                  "traditions": [
                      "arcane",
                      "divine",
                      "occult",
                      "primal"
                  ],
                  "value": [
                      "concentrate",
                      "manipulate"
                  ]
              }
          },
          "type": "spell"
      },
      {
          "_id": "41WwdI9v5RAhSNrc",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.spells-srd.Item.8xRzLhwGL7Dgy3EZ"
              }
          },
          "img": "systems/pf2e/icons/spells/sanctuary.webp",
          "name": "Sanctuary",
          "sort": 500000,
          "system": {
              "area": null,
              "cost": {
                  "value": ""
              },
              "counteraction": false,
              "damage": {},
              "defense": null,
              "description": {
                  "value": "<p>You ward a creature with protective energy that deters attacks. Creatures attempting to attack the target must attempt a Will save each time. If the target uses a hostile action, the spell ends.</p>\n<hr />\n<p><strong>Critical Success</strong> <em>Sanctuary</em> ends.</p>\n<p><strong>Success</strong> The creature can attempt its attack and any other attacks against the target this turn.</p>\n<p><strong>Failure</strong> The creature can't attack the target and wastes the action. It can't attempt further attacks against the target this turn.</p>\n<p><strong>Critical Failure</strong> The creature wastes the action and can't attempt to attack the target for the rest of <em>sanctuary</em>'s duration.</p>"
              },
              "duration": {
                  "sustained": false,
                  "value": "1 minute"
              },
              "level": {
                  "value": 1
              },
              "location": {
                  "heightenedLevel": 1,
                  "value": "mS16mfAS5hbK048v"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Player Core"
              },
              "range": {
                  "value": "touch"
              },
              "requirements": "",
              "rules": [],
              "slug": "sanctuary",
              "target": {
                  "value": "1 creature"
              },
              "time": {
                  "value": "2"
              },
              "traits": {
                  "rarity": "common",
                  "traditions": [
                      "divine",
                      "occult"
                  ],
                  "value": [
                      "concentrate",
                      "manipulate"
                  ]
              }
          },
          "type": "spell"
      },
      {
          "_id": "YZLDodDoRJekqsfb",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.equipment-srd.Item.7tKkkF8eZ4iCLJtp"
              }
          },
          "img": "icons/weapons/swords/sword-guard-purple.webp",
          "name": "Shortsword",
          "sort": 600000,
          "system": {
              "baseItem": "shortsword",
              "bonus": {
                  "value": 0
              },
              "bonusDamage": {
                  "value": 0
              },
              "bulk": {
                  "value": 0.1
              },
              "category": "martial",
              "containerId": null,
              "damage": {
                  "damageType": "piercing",
                  "dice": 1,
                  "die": "d6"
              },
              "description": {
                  "value": "<p>These blades come in a variety of shapes and styles, but they are typically 2 feet long.</p>"
              },
              "equipped": {
                  "carryType": "held",
                  "handsHeld": 1,
                  "invested": null
              },
              "group": "sword",
              "hardness": 0,
              "hp": {
                  "max": 0,
                  "value": 0
              },
              "level": {
                  "value": 0
              },
              "material": {
                  "grade": null,
                  "type": null
              },
              "price": {
                  "value": {
                      "sp": 9
                  }
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Player Core"
              },
              "quantity": 1,
              "range": null,
              "reload": {
                  "value": ""
              },
              "rules": [],
              "runes": {
                  "potency": 0,
                  "property": [],
                  "striking": 0
              },
              "size": "tiny",
              "slug": "shortsword",
              "splashDamage": {
                  "value": 0
              },
              "traits": {
                  "rarity": "common",
                  "value": [
                      "agile",
                      "finesse",
                      "versatile-s"
                  ]
              },
              "usage": {
                  "value": "held-in-one-hand"
              }
          },
          "type": "weapon"
      },
      {
          "_id": "iJVGp2XuaslAOfcc",
          "flags": {
              "pf2e": {
                  "linkedWeapon": "YZLDodDoRJekqsfb"
              }
          },
          "img": "systems/pf2e/icons/default-icons/melee.svg",
          "name": "Shortsword",
          "sort": 700000,
          "system": {
              "attack": {
                  "value": ""
              },
              "attackEffects": {
                  "custom": "",
                  "value": []
              },
              "bonus": {
                  "value": 7
              },
              "damageRolls": {
                  "0uoh64cg0zidik7f0p0r": {
                      "damage": "1d6+1",
                      "damageType": "piercing"
                  }
              },
              "description": {
                  "value": ""
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [],
              "slug": null,
              "traits": {
                  "rarity": "common",
                  "value": [
                      "agile",
                      "finesse",
                      "magical",
                      "reach-0",
                      "versatile-s"
                  ]
              },
              "weaponType": {
                  "value": "melee"
              }
          },
          "type": "melee"
      },
      {
          "_id": "xH8E3TYe6R3G6KEv",
          "img": "systems/pf2e/icons/actions/Passive.webp",
          "name": "Locate Aeon",
          "sort": 800000,
          "system": {
              "actionType": {
                  "value": "passive"
              },
              "actions": {
                  "value": null
              },
              "category": "interaction",
              "description": {
                  "value": "<p>An arbiter can always sense the direction of the nearest non-arbiter aeon on the plane, but it can't sense the range to the aeon.</p>"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [],
              "slug": null,
              "traits": {
                  "rarity": "common",
                  "value": []
              }
          },
          "type": "action"
      },
      {
          "_id": "kayBhD4IXys5Ppt8",
          "flags": {
              "core": {
                  "sourceId": "Compendium.pf2e.bestiary-ability-glossary-srd.Item.kquBnQ0kObZztnBc"
              }
          },
          "img": "systems/pf2e/icons/actions/Passive.webp",
          "name": "+1 Status to All Saves vs. Magic",
          "sort": 900000,
          "system": {
              "actionType": {
                  "value": "passive"
              },
              "actions": {
                  "value": null
              },
              "category": "defensive",
              "description": {
                  "value": ""
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [
                  {
                      "key": "FlatModifier",
                      "predicate": [
                          {
                              "or": [
                                  "magical",
                                  "arcane",
                                  "divine",
                                  "primal",
                                  "occult"
                              ]
                          }
                      ],
                      "selector": "saving-throw",
                      "type": "status",
                      "value": 1
                  }
              ],
              "slug": "1-status-to-all-saves-vs-magic",
              "traits": {
                  "rarity": "common",
                  "value": []
              }
          },
          "type": "action"
      },
      {
          "_id": "Qc7duDVeN4puhd9w",
          "img": "systems/pf2e/icons/actions/TwoActions.webp",
          "name": "Electrical Burst",
          "sort": 1000000,
          "system": {
              "actionType": {
                  "value": "action"
              },
              "actions": {
                  "value": 2
              },
              "category": "offensive",
              "description": {
                  "value": "<p>The arbiter releases an electrical burst from its body that deals @Damage[3d6[electricity]] damage to all creatures in a @Template[type:emanation|distance:10], with a @Check[type:reflex|dc:17|basic:true] save. The arbiter is then @UUID[Compendium.pf2e.conditionitems.Item.Stunned] for 24 hours.</p>"
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [],
              "slug": null,
              "traits": {
                  "rarity": "common",
                  "value": [
                      "divine",
                      "electricity"
                  ]
              }
          },
          "type": "action"
      },
      {
          "_id": "6qvzXeFuSeJ64OSj",
          "img": "systems/pf2e/icons/default-icons/lore.svg",
          "name": "Axis Lore",
          "sort": 1100000,
          "system": {
              "description": {
                  "value": ""
              },
              "mod": {
                  "value": 5
              },
              "proficient": {
                  "value": 0
              },
              "publication": {
                  "license": "ORC",
                  "remaster": true,
                  "title": "Pathfinder Monster Core"
              },
              "rules": [],
              "slug": null,
              "traits": {}
          },
          "type": "lore"
      }
  ],
  "name": "Arbiter",
  "system": {
      "abilities": {
          "cha": {
              "mod": 1
          },
          "con": {
              "mod": 2
          },
          "dex": {
              "mod": 4
          },
          "int": {
              "mod": 0
          },
          "str": {
              "mod": 1
          },
          "wis": {
              "mod": 2
          }
      },
      "attributes": {
          "ac": {
              "details": "",
              "value": 16
          },
          "allSaves": {
              "value": "+1 status to all saves vs. magic"
          },
          "hp": {
              "details": "",
              "max": 22,
              "temp": 0,
              "value": 22
          },
          "immunities": [
              {
                  "type": "death-effects"
              },
              {
                  "type": "disease"
              },
              {
                  "type": "emotion"
              },
              {
                  "type": "poison"
              },
              {
                  "type": "unconscious"
              }
          ],
          "resistances": [
              {
                  "type": "electricity",
                  "value": 3
              }
          ],
          "speed": {
              "otherSpeeds": [
                  {
                      "type": "fly",
                      "value": 40
                  }
              ],
              "value": 20
          },
          "weaknesses": []
      },
      "details": {
          "blurb": "",
          "languages": {
              "details": "",
              "value": [
                  "common",
                  "diabolic",
                  "empyrean",
                  "utopian"
              ]
          },
          "level": {
              "value": 1
          },
          "privateNotes": "",
          "publicNotes": "<p>These spherical aeons are scouts and diplomats. Found throughout the multiverse, they have traditionally kept watch over chaos and its agents. With the announcement of the Convergence, many arbiters now serve as go-betweens among the aeon alliance and its mortal associates.</p>\n<hr />\n<p>Aeons have always been the caretakers of reality and defenders of the natural order of balance. Each type of aeon takes on some form of duality in its manifestation and works either to shape the multiverse within the aspects of this duality in some way, or to correct imbalances to the perfect order of existence. Aeons' machinations can raise a nation, raze it, or restore it from ruin. Their reasons are their own, and they rarely share their motivations with others—through their strange envisioning mode of communication, they simply create the results they insist are necessary to maintain the balance of the multiverse.</p>\n<p>As a result of recent shifts in reality, aeons have begun to reassert a presence in the perfect planar city of Axis. To aeons, this is merely the latest in a recurring cycle, albeit one that mortals have not yet borne witness to. Aeons have a name for this cyclic return, in which they welcome their industrious axiomite brethren back to their fold: the Convergence. At the onset of the Convergence, a council of pleroma aeons appeared in the Eternal City of Axis, where they revealed that axiomites were wayward aeons, split off long ago to pursue the act of creation. With the latest cycle of change, it was time for axiomites—and their mortal creations and kin—to rejoin the aeon cause. While most axiomites fell in line, realizing perhaps on a fundamental level of reality that what the aeons said was the truth, some refused to heed the call and waited for the wrath of the aeons. That wrath has yet to come. The dual-natured aeons have responded to those who have declined in confusing ways. With some they treat and even bargain, while a handful of others they have destroyed, and a few have been exterminated by the axiomites. But most of these quiet insurgents they leave alone, allowing these axiomites to continue to create in peace. How—or if—this Convergence will end is as little understood as aeons themselves.</p>",
          "publication": {
              "license": "ORC",
              "remaster": true,
              "title": "Pathfinder Monster Core"
          }
      },
      "initiative": {
          "statistic": "perception"
      },
      "perception": {
          "details": "locate aeon",
          "mod": 7,
          "senses": [
              {
                  "type": "darkvision"
              }
          ]
      },
      "resources": {
          "focus": {
              "max": 1,
              "value": 1
          }
      },
      "saves": {
          "fortitude": {
              "saveDetail": "",
              "value": 5
          },
          "reflex": {
              "saveDetail": "",
              "value": 7
          },
          "will": {
              "saveDetail": "",
              "value": 7
          }
      },
      "skills": {
          "acrobatics": {
              "base": 9
          },
          "diplomacy": {
              "base": 6
          },
          "stealth": {
              "base": 9
          }
      },
      "traits": {
          "rarity": "common",
          "size": {
              "value": "tiny"
          },
          "value": [
              "aeon",
              "monitor"
          ]
      }
  },
  "type": "npc"
}


const App = () => (
  <EncounterProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<EncounterManager />} />
          <Route path="/encounter/:id" element={<Encounter />} />
          <Route path="/monster" element={<MonsterStatBlock data={monsterData}/>} />
        </Routes>
      </div>
    </Router>
  </EncounterProvider>
);

export default App
