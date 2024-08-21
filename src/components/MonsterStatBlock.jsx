import React, { useEffect, useState } from 'react';
import './MonsterStatBlock.scss';

//selectedBestiary, selectedName, setStatblock will be used at NPC creation
//block will be used to look at stats after creation
const MonsterStatBlock = ({selectedBestiary, selectedName, setStatblock, block }) => {
    const [data, setData] = useState(block ? JSON.parse(block) : undefined);
    useEffect(()=> {
        if(!block){
            const url = `http://taylormusolf.com/pf2e/packs/${selectedBestiary}/${selectedName}.json`
            fetch(url).then(res => res.json()).then(dat => setData(dat))
        }
    }, [selectedName])
    useEffect(()=> {
        if(!block){
            setStatblock(data)
        }
    }, [data])
    if(data === undefined) return null;
  const {
    img,
    name,
    system: {
      abilities,
      attributes: { ac, hp, immunities, resistances, speed, allSaves, weaknesses },
      details: { languages, level, publicNotes },
      initiative: {statistic},
      perception: {details, mod, senses},
      resources: {focus},
      saves: {fortitude, reflex, will},
      skills,
      traits: {rarity, size, value},
      type
    },
    items,
  } = data;
  function spellNumber(num){
    if(num === 1) return '1st';
    if(num === 2) return '2nd';
    if(num === 3) return '3rd';
    return num + 'th';
  }
  function actions(type, num){
      const action = {
          1: '◆',
          2: '◆◆',
          3: '◆◆◆',
          'free': '◇',
          'reaction': '⟳'
  
      }
      
    if(num){
        return action[num]
    }
    return action[type];
  }
  function knowledgeCheck(mTypes, mRarity){
      const type = {
          'aberration': ['occultism'],
          'animal': ['nature'],
          'astral': ['occultism'],
          'beast': ['arcana', 'nature'],
          'celestial': ['religion'],
          'construct': ['arcana', 'crafting'],
          'dragon': ['arana'],
          'dream': ['occultism'],
          'elemental': ['arcana', 'nature'],
          'ethereal': ['occultism'],
          'fey': ['nature'],
          'fiend': ['religion'],
          'fungus': ['nature'],
          'humanoid': ['society'],
          'monitor': ['religion'],
          'ooze': ['occultism'],
          'plant': ['nature'],
          'shade': ['religion'],
          'spirit': ['occultism'],
          'time': ['occultims'],
          'undead': ['religion']
      }
    let matchingTypes = mTypes.filter((value) => value in type);
    let knowledgeTypes = matchingTypes.map((mType) => type[mType]);
    mRarity = mRarity.toLowerCase()
    const rarity = {
        'common': 15,
        'uncommon': 17,
        'rare': 20,
        'unique': 25
    }
    return `${matchingTypes.join(', ')} (${knowledgeTypes.join(', ')}): DC ${rarity[mRarity]}`
  }
  const lores = items.filter(item => item.type === 'lore');
  const weapons = items.filter(item => item.type === 'weapon');
  const melees = items.filter(item => item.type === 'melee');
  const actionsItems = items.filter(item => item.type === 'action');
  const spells = items.filter(item => item.type === 'spell');
  const spellcastingEntry = items.filter(item => item.type === 'spellcastingEntry');


  return (
    <div className="monster-stat-block">
        <div className="header">
            <h1>{name.toUpperCase()}</h1>
            <h1>CREATURE {level.value}</h1>
        </div>
        {console.log(data)}
        <div className='misc-stats'>
            <div className="traits">
                <div className='traits-size'>{rarity.toUpperCase()}</div>
                <div className='traits-size'>{size.value.toUpperCase()}</div>
                {value?.map((t)=>{
                    return <div className='traits-misc' key={t} >{t.toUpperCase()}</div>
                })}
            </div>
            <div className="perception">
                <label>Perception</label>
                <div>{`+${mod}; `}</div>
                <div style={{paddingLeft: '5px'}}>
                    {details ? 
                        senses?.map(sense => sense.type).concat(details).join(', ')
                        :
                        senses?.map(sense => sense.type).join(', ')
                    }
                </div>
                
            </div>
            <div className="perception"><label>Recall Knowledge</label>{knowledgeCheck(value, rarity)}</div>
            {!!languages?.value.length && <div className="languages">
                <label>Languages</label>
                <ul className="languages-list">
                    {
                        languages.details ? 
                            languages?.value.map((language) => (
                                language.charAt(0).toLocaleUpperCase() + language.slice(1)
                            )).concat(languages.details).join(', ')
                        :
                        languages?.value.map((language) => (
                            language.charAt(0).toLocaleUpperCase() + language.slice(1)
                        )).join(', ')
                    }
                </ul>
            </div>}
            <div className="skills">
                <label>Skills</label>
                {lores.length ? 
                    Object.keys(skills)?.map((skill) => (
                        `${skill.charAt(0).toLocaleUpperCase() + skill.slice(1)} +${skills[skill].base}`
                    )).concat(lores.map(lore => `${lore.name} +${lore.system.mod.value}`)).join(', ')
                :
                    Object.keys(skills)?.map((skill) => (
                        `${skill.charAt(0).toLocaleUpperCase() + skill.slice(1)} +${skills[skill].base}`
                    )).join(', ')
                }
            </div>
            <div className="abilities">
                <div className='abilities-list'>
                    <div key={'Str'}><label>Str</label>{`${abilities['str'].mod >= 0 ? '+':''}${abilities['str'].mod},`}</div>
                    <div key={'Dex'}><label>Dex</label>{`${abilities['dex'].mod >= 0 ? '+':''}${abilities['dex'].mod},`}</div>
                    <div key={'Con'}><label>Con</label>{`${abilities['con'].mod >= 0 ? '+':''}${abilities['con'].mod},`}</div>
                    <div key={'Int'}><label>Int</label>{`${abilities['int'].mod >= 0 ? '+':''}${abilities['int'].mod},`}</div>
                    <div key={'Wis'}><label>Wis</label>{`${abilities['wis'].mod >= 0 ? '+':''}${abilities['wis'].mod},`}</div>
                    <div key={'Cha'}><label>Cha</label>{`${abilities['cha'].mod >= 0 ? '+':''}${abilities['cha'].mod}`}</div>
                </div>
            </div>
            <div className='special'>
                <label></label>
            </div>
            {
             !!weapons?.length &&<div className="items">
                <label>Items</label>
                {weapons.map((weapon) => weapon.system.baseItem).join(' ,')}
            </div>
            }
        </div>
        <div className="defense">
            <div className="defense-top-line">
                <li><label>AC</label>{`${ac.value};`}</li>
                <li><label>Fort</label>{`+${fortitude.value},`}</li>
                <li><label>Ref</label>{`+${reflex.value},`}</li> 
                <li><label>Will</label>{allSaves.value ? `+${will.value};` : `+${will.value}`}</li> 
                <li>{` ${allSaves.value}`}</li> 
            </div>
            <div className="defense-top-line">
                <div><label>HP</label>{`${hp.max}; `}</div>    
                {!!immunities?.length && <div className="immunities">
                    <ul className='immunities-list'>
                        <label>Immunities</label>
                        {immunities?.map((immunity) => (
                            immunity.type.split('-').join(' ')
                        )).join(', ')}
                    </ul>
                </div>}
            </div>
            {!!resistances?.length && <div className="resistances">
                <label>Resistances</label>
                <ul className='resistances-list'>
                {resistances?.map((resistance, index) => (
                    <li key={index}>{`${resistance.type} ${resistance.value}`}</li>
                ))}
                </ul>
            </div>}
            {!!weaknesses?.length && <div className="weaknesses">
                <label>Weaknesses</label>
                <ul className='weaknesses-list'>
                {weaknesses?.map((weakness, index) => (
                    <li key={index}>{`${weakness.type} ${weakness.value}`}</li>
                ))}
                </ul>
            </div>}
        </div>
        <div className='offense'>
            <div><label>Speed</label>{speed.value} feet,</div>
            <ul className='speeds-list'>
                {speed.otherSpeeds?.map((speed, index) => (
                    <li key={index}>{`${speed.type} ${speed.value} feet`}</li>
                ))}
            </ul>

        </div>
        <div className="items">
            <ul className="items-list">
                <div className="melee-list">
                    {!!melees.length && <label>Melee{actions(1)}</label>}
                    {melees?.map((melee, index)=>{
                        const {damageRolls} = melee.system;
                        return(
                            <div key={index}>
                                <div>
                                    {[melee.name.toLowerCase(), `+${melee.system.bonus.value}`].join(' ')
                                    .concat([' ('])
                                    .concat(melee.system.traits.value?.map(trait => trait.split('-').join(' ')).join(', '))
                                    .concat(['), '])}
                                    {Object.values(damageRolls)?.map((damageRoll, index) => 
                                        <div key={index}><label>Damage</label>{`${damageRoll.damage} ${damageRoll.damageType}`}</div>
                                    )}
                                </div>
                            </div>
                    )})}
                </div>
                <div className="spell-list">
                    {spellcastingEntry.map((spellcast)=> (
                        `${spellcast.name} DC${spellcast.system.spelldc.dc}`
                        ))
                        .concat(['; '])
                        .concat(spells.map((spell)=> (
                            `${spellNumber(spell.system.level.value)} ${spell.name.toLowerCase()}`)
                        ).join('; ')   
                    )}
                </div>
                {items?.map((item) => {
                    if(item.type === 'action'){
                        return (
                            <li key={item._id}>
                                <label>{item.name}</label>
                                {item.system.actions.value !== 'passive' && <div>{actions(item.system.actionType.value, item.system.actions?.value)}</div>}
                                <div dangerouslySetInnerHTML={{ __html:item.system.description.value}}></div>
                            </li>
                        )

                    }
                })}
            </ul>
        </div>
      <div className="section notes">
        <h2>Notes</h2>
        <p dangerouslySetInnerHTML={{ __html: publicNotes }}></p>
      </div>
    </div>
  );
};

export default MonsterStatBlock;
