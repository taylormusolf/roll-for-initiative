import React from 'react';
import './MonsterStatBlock.scss'; // Create a CSS file for styles

const MonsterStatBlock = ({ data }) => {
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

  return (
    <div className="monster-stat-block">
      <div className="header">
        <h1>{name.toUpperCase()}</h1>
        <h1>CREATURE {level.value}</h1>
      </div>
      <div className='misc-stats'>
        <div className="traits">
            <div className='traits-size'>{size.value.toUpperCase()}</div>
            {value.map((t)=>{
                return <div className='traits-misc' key={t} >{t.toUpperCase()}</div>
            })}
        </div>
        <div className="perception">
            <label>Perception</label>
            <div>{`+${mod}; `}</div>
            {senses.map((t, i)=>{
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
                {languages.value.map((language, index) => (
                    <li key={index}>{language.charAt(0).toLocaleUpperCase() + language.slice(1)}</li>
                ))}
            </ul>
        </div>
        <div className="skills">
            <label>Skills</label>
            {Object.keys(skills).map((skill, index) => (
                <li key={index}>{`${skill.charAt(0).toLocaleUpperCase() + skill.slice(1)} +${skills[skill].base}`}</li>
            ))}
        </div>
        <div className="abilities">
            <ul className='abilities-list'>
                <li key={'Str'}>
                    <label>Str</label>
                    {console.log(abilities)}
                    {`+${abilities['str'].mod},`}
                </li>
                <li key={'Dex'}>
                    <label>Dex</label>
                    {console.log(abilities)}
                    {`+${abilities['dex'].mod},`}
                </li>
                <li key={'Con'}>
                    <label>Con</label>
                    {console.log(abilities)}
                    {`+${abilities['con'].mod},`}
                </li>
                <li key={'Int'}>
                    <label>Int</label>
                    {console.log(abilities)}
                    {`+${abilities['int'].mod},`}
                </li>
                <li key={'Wis'}>
                    <label>Wis</label>
                    {console.log(abilities)}
                    {`+${abilities['wis'].mod},`}
                </li>
                <li key={'Cha'}>
                    <label>Cha</label>
                    {console.log(abilities)}
                    {`+${abilities['cha'].mod}`}
                </li>
            </ul>
        </div>

      </div>
      <div className="section attributes">
        <h2>Attributes</h2>
        <p>AC: {ac.value}</p>
        <p>HP: {hp.max}</p>
        <p>Speed: {speed.value} ft.</p>
        <p>Fly Speed: {speed.otherSpeeds[0].value} ft.</p>
      </div>
      <div className="section immunities">
        <h2>Immunities</h2>
        <ul>
          {immunities.map((immunity, index) => (
            <li key={index}>{immunity.type}</li>
          ))}
        </ul>
      </div>
      <div className="section resistances">
        <h2>Resistances</h2>
        <ul>
          {resistances.map((resistance, index) => (
            <li key={index}>{`${resistance.type}: ${resistance.value}`}</li>
          ))}
        </ul>
      </div>
      <div className="section items">
        <h2>Items & Abilities</h2>
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
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
