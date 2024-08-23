import React, { useEffect, useState } from 'react';
import './MonsterStatBlock.scss';

//selectedBestiary, selectedName, setStatblock will be used at NPC creation
//block will be used to look at stats after creation
const MonsterStatBlock = ({selectedBestiary, selectedName, setStatblock, block }) => {
    const [data, setData] = useState(block ? JSON.parse(block) : undefined);
    const [adjustment, setAdjustment] = useState('standard');
    useEffect(()=> {
        if(!block){
            const url = `https://taylormusolf.com/pf2e/packs/${selectedBestiary}/${selectedName}.json`
            fetch(url).then(res => res.json()).then(dat => setData(dat))
        }
    }, [selectedName])
    useEffect(()=> {
        if(!block){
            setStatblock(data)
        }
    }, [data])
    if(data === undefined) return null;
    const handleSelectAdjustment = (e) => {
        setAdjustment(e.target.value);
    }
  const {
    img,
    name,
    system: {
      abilities,
      attributes: { ac, hp, immunities, resistances, speed, allSaves, weaknesses, hardness },
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
    return <p><label>Recall Knowledge</label>{`${matchingTypes.join(', ')} (${knowledgeTypes.join(', ')}): DC ${rarity[mRarity]}, unspecific lore: DC ${rarity[mRarity] - 2}, specific lore: DC ${rarity[mRarity] - 5}`} </p>
  }
  const levelAdjustment = (level)=> {
    if(adjustment === 'standard'){
        return level;
    } else if(adjustment === 'weak'){
        if(level === 1){
            return level - 2;
        }else {
            return level - 1;
        }
    } else {
        if(level <= 0){
            return level + 2;
        } else {
            return level + 1;
        }
    }
  }
  const skillAdjustment = (value) => {
    if(adjustment === 'standard'){
        return value;
    } else if(adjustment === 'weak'){
        return value - 2;
    } else {
        return value + 2;
    }
  }
  const hpAdjustment = (hp, level) => {
    if(adjustment === 'standard'){
        return hp;
    } else if(adjustment === 'weak'){
        if(level <= 2){
            return hp - 10;
        } else if(level <= 5){
            return hp - 15;
        } else if(level <= 20){
            return hp - 20;
        } else {
            return hp - 30;
        }
    } else { //elite
        if(level <= 1){
            return hp + 10;
        } else if(level <= 4){
            return hp + 15;
        } else if(level <= 19){
            return hp + 20;
        } else {
            return hp + 30;
        }
    }
  }

  const ptagParse = (str) => {
    return str.replace(/<\/?p>/g, '');
  }

  const rituals = items.filter(item => item.type === 'ritual');
  const lores = items.filter(item => item.type === 'lore');
  const weapons = items.filter(item => item.type === 'weapon');
  const melees = items.filter(item => item.type === 'melee');
  const actionItems = items.filter(item => item.type === 'action');
  const spells = items.filter(item => item.type === 'spell');
  const spellcastingEntry = items.filter(item => item.type === 'spellcastingEntry');


  return (
    <div className="monster-stat-block">
        <div>
            <label htmlFor="options">Adjustment:</label>
            <select id="options" value={adjustment} onChange={handleSelectAdjustment}>
                <option value="elite">Elite</option>
                <option value="weak">Weak</option>
                <option value="standard">Standard</option>
            </select>
        </div>
        <div className="monster-name-line">
            <h1>{(adjustment === 'weak' ? 'WEAK ': adjustment === 'elite' ? 'ELITE ' : '') + name.toUpperCase()}</h1>
            <h1>CREATURE {levelAdjustment(level.value)}</h1>
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
                <div>{`+${skillAdjustment(mod)}; `}</div>
                <div style={{paddingLeft: '5px'}}>
                    {details ? 
                        senses?.map(sense => sense.type).concat(details).join(', ')
                        :
                        senses?.map(sense => sense.type).join(', ')
                    }
                </div>
                
            </div>
            <div className="perception">{knowledgeCheck(value, rarity)}</div>
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
                    )).concat(lores.map(lore => `${lore.name} +${skillAdjustment(lore.system.mod.value)}`)).join(', ')
                :
                    Object.keys(skills)?.map((skill) => (
                        `${skill.charAt(0).toLocaleUpperCase() + skill.slice(1)} +${skillAdjustment(skills[skill].base)}`
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
                <li><label>AC</label>
                    {!!ac.details.length ?
                    `${skillAdjustment(ac.value) + ' ' + ac.details};`
                    :
                    `${skillAdjustment(ac.value)};`
                    }
                    
                </li>
                <li><label>Fort</label>{`+${skillAdjustment(fortitude.value)},`}</li>
                <li><label>Ref</label>{`+${skillAdjustment(reflex.value)},`}</li> 
                <li><label>Will</label>{allSaves.value ? `+${skillAdjustment(will.value)};` : `+${skillAdjustment(will.value)}`}</li> 
                <li>{` ${allSaves.value}`}</li> 
            </div>
            <div className="defense-top-line">
                <div>
                    {hardness?.value ? 
                        <div><label>HP</label>{`${hpAdjustment(hp.max, level.value)}; `} <label>Hardness:</label>{`${hardness.value}`} </div>
                    :
                        <div><label>HP</label>{`${hpAdjustment(hp.max, level.value)}; `}</div>
                    }

                </div>    
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
            <div><label>Speed</label>{speed.value} feet{!!speed.otherSpeeds.length && ','}</div>
            <ul className='speeds-list'>
                {speed.otherSpeeds?.map((speed, index) => (
                    <li key={index}>{`${speed.type} ${speed.value} feet`}</li>
                ))}
            </ul>

        </div>
        <div className="items">
            <ul className="items-list">
                <div className="melee-list">
                    {melees?.map((melee, index)=>{
                        const {damageRolls} = melee.system;
                        return(
                            <div key={index}>
                                <div className='melee-item'>
                                    <label>Melee{actions(1)}</label>
                                    <p>
                                        {[melee.name.toLowerCase(), `+${skillAdjustment(melee.system.bonus.value)}`].join(' ')
                                        .concat([' ('])
                                        .concat(melee.system.traits.value?.map(trait => trait.split('-').join(' ')).join(', '))
                                        .concat(['), '])
                                    }
                                    </p>
                                    <label>Damage</label>
                                    {Object.values(damageRolls)?.map((damageRoll, index) => 
                                        <div key={index}>{`${damageRoll.damage}${adjustment === 'weak' ? '-2' : adjustment === 'elite' ? '+2' : ''} ${damageRoll.damageType}`}</div>
                                    )}
                                    {ptagParse(melee.system.description.value)}
                                </div>
                            </div>
                    )})}
                </div>
                {!!spellcastingEntry.length && <div className="spell-list">
                    {spellcastingEntry.map((spellcast)=> (
                        `${spellcast.name} DC ${spellcast.system.spelldc.dc}`
                        ))
                        .concat(['; '])
                        .concat(spells.map((spell)=> (
                            `${spellNumber(spell.system.level.value)} ${spell.name.toLowerCase()}`)
                        ).join('; ')   
                    )}
                </div>}
                <div className='actions'>
                    {actionItems?.map((actionItem) => {
                        return (
                            <p key={actionItem._id}>
                                <label style={{display:'inline-block', marginRight:'10px'}}>{actionItem.name}</label>
                                {actionItem.system.actions.value !== 'passive' && <div>{actions(actionItem.system.actionType.value, actionItem.system.actions?.value)}</div>}
                                <div style={{display:'inline-block'}} dangerouslySetInnerHTML={{ __html:actionItem.system.description.value}}></div>
                            </p>
                        )

                    })}
                </div>
            </ul>
        </div>
      <div className="notes">
        <label>Notes</label>
        <p dangerouslySetInnerHTML={{ __html: publicNotes }}></p>
      </div>
    </div>
  );
};

export default MonsterStatBlock;
