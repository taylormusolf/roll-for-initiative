import React, { useEffect, useState } from 'react';
import './MonsterStatBlock.scss'; // Create a CSS file for styles

const MonsterStatBlock = ({ url }) => {
    const [data, setData] = useState(undefined);
    useEffect(()=> {
        fetch(url).then(res => res.json()).then(dat => setData(dat))
    }, [])

    if(data === undefined) return null;
    console.log(data)
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
  function knowledgeCheck(mType, mRarity){
    mType = mType.toLowerCase()
    mRarity = mRarity.toLowerCase()
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
    const rarity = {
        'common': 15,
        'uncommon': 17,
        'rare': 20,
        'unique': 25
    }
    return `${mType} (${type[mType].join(', ')}): DC ${rarity[mRarity]}`
  }

  return (
    <div className="monster-stat-block">
        <div className="header">
            <h1>{name.toUpperCase()}</h1>
            <h1>CREATURE {level.value}</h1>
        </div>
        {/* add a recall knowledge */}
        {/* <div><label>Recall Knowledge</label>{knowledgeCheck()}</div> */}
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
                {senses?.map((t, i)=>{
                    return(
                        <React.Fragment key={t.type}> 
                            {!!i && ", "} 
                            <div> 
                                {t.type}
                            </div>
                        </React.Fragment>
                    ) 
                })}
                {' '}
                <div>{details}</div>
            </div>
            <div className="languages">
                <label>Languages</label>
                <ul className="languages-list">
                    {languages?.value.map((language, index) => (
                        <li key={index}>{language.charAt(0).toLocaleUpperCase() + language.slice(1)}</li>
                    ))}
                    {languages.details}
                </ul>
            </div>
            <div className="skills">
                <label>Skills</label>
                {Object.keys(skills)?.map((skill, index) => (
                    <li key={index}>{`${skill.charAt(0).toLocaleUpperCase() + skill.slice(1)} +${skills[skill].base}`}</li>
                ))}
            </div>
            <div className="abilities">
                <ul className='abilities-list'>
                    <li key={'Str'}><label>Str</label>{`${abilities['str'].mod > 0 ? '+':''}${abilities['str'].mod},`}</li>
                    <li key={'Dex'}><label>Dex</label>{`${abilities['dex'].mod > 0 ? '+':''}${abilities['dex'].mod},`}</li>
                    <li key={'Con'}><label>Con</label>{`${abilities['con'].mod > 0 ? '+':''}${abilities['con'].mod},`}</li>
                    <li key={'Int'}><label>Int</label>{`${abilities['int'].mod > 0 ? '+':''}${abilities['int'].mod},`}</li>
                    <li key={'Wis'}><label>Wis</label>{`${abilities['wis'].mod > 0 ? '+':''}${abilities['wis'].mod},`}</li>
                    <li key={'Cha'}><label>Cha</label>{`${abilities['cha'].mod > 0 ? '+':''}${abilities['cha'].mod}`}</li>
                </ul>
            </div>
            <div className='special'>
                <label></label>
            </div>
            {/* <div className="items">
                <label>Items</label>
            </div> */}
        </div>
        <div className="defense">
            <div className="defense-top-line">
                <li><label>AC</label>{ac.value};</li>
                <li><label>Fort</label>{`+${fortitude.value}`}</li>
                <li><label>Ref</label>{`+${reflex.value}`}</li> 
                <li><label>Will</label>{`+${will.value}`}</li> 
                <li>{`; ${allSaves.value}`}</li> 
            </div>
            <div className="defense-top-line">
                <div><label>HP</label>{hp.max};</div>    
                {immunities?.length && <div className="immunities">
                    <ul className='immunities-list'>
                        <label>Immunities</label>
                        {immunities?.map((immunity, index) => (
                            <li key={index}>{immunity.type}</li>
                        ))}
                    </ul>
                </div>}
            </div>
            {resistances?.length && <div className="resistances">
                <label>Resistances</label>
                <ul className='resistances-list'>
                {resistances?.map((resistance, index) => (
                    <li key={index}>{`${resistance.type} ${resistance.value}`}</li>
                ))}
                </ul>
            </div>}
            {weaknesses?.length && <div className="weaknesses">
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
            {console.log(items)}
            <ul className="items-list">
                {items?.map((item) => {
                    if(item.type === 'spell'){
                        return (
                        <li key={item._id}>
                        <p><label>{spellNumber(item.system.level.value)}</label>{item.name.toLowerCase()};</p>
                        {/* <p>{item.system.description.value}</p> */}

                        </li>
                        )

                    }else if(item.type === 'melee'){
                        const {damageRolls} = item.system;
                        return (
                            <li key={item._id}>
                                <label>Melee</label>
                                <p>{item.name.toLowerCase()}</p>
                                <p>+{item.system.bonus.value}</p>
                                <ul className='item-desc'>(
                                    {item.system.traits.value?.map((trait, index) => (
                                        <div key={index}>{trait}</div>
                                    ))}
                                )</ul>
                                <ul className='item-desc'>
                                    {Object.values(damageRolls)?.map((damageRoll, index) => (
                                        <div key={index}><label>Damage</label>{damageRoll.damage}{damageRoll.damageType}</div>
                                    ))}
                                </ul>
                            </li>
                        )

                    }else if(item.type === 'action'){
                        return (
                            <li key={item._id}>
                                <label>{item.name}</label>
                                {item.system.actions.value !== 'passive' && <div>{actions(item.system.actionType.value, item.system.actions?.value)}</div>}
                                <div dangerouslySetInnerHTML={{ __html:item.system.description.value}}></div>
                            </li>
                        )

                    }else if(item.type === 'spellcastingEntry'){
                        return (
                            <div className='item-list' key={item._id}>
                                <label>{item.name}</label>
                                <div>DC {item.system.spelldc.dc}</div>
                            </div>
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
