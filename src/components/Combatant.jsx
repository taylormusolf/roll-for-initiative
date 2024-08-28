import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import MonsterStatBlock from './MonsterStatBlock';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import './Combatant.scss'
import data from '../assets/data/other.json'
import { height } from '@fortawesome/free-regular-svg-icons/faAddressBook';



Modal.setAppElement('#root');

const conditionsMenuStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    backgroundColor: 'var(--tan)',
    border: '2px solid var(--gold)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};
const statBlockStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    height: '75%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'white',
    overflow: 'auto'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const hpMenuStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    backgroundColor: 'var(--tan)',
    border: '2px solid var(--gold)',
    overflow: 'auto',
    height: '20vh'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const pcStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  border: '5px solid var(--blue)',
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: '#e1dcef',
  color: 'black',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};
const npcStyle = {
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  alignItems: 'flex-start',
  border: '5px solid var(--red)',
  margin: '10px',
  padding: '10px',
  borderRadius: '10px',
  backgroundColor: '#e7cccc',
  color: 'black',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const healthBarContainerStyle = {
  height: '10px',
  width: '100px',
  backgroundColor: '#555',
  borderRadius: '5px',
  overflow: 'hidden',
  marginRight: '10px',
};

const healthBarStyle = (health, maxHp) => ({
  height: '100%',
  width: `${(health / maxHp) * 100}%`,
  backgroundColor: '#0f0',
});

const Combatant = ({
  id,
  name,
  initiative,
  ac,
  hp,
  maxHp,
  tempHp,
  speed,
  perception,
  fortitude,
  reflex,
  will,
  useHealth,
  isPC,
  notes,
  stats,
  cr,
  conditions,
  isCurrent,
  moveUp,
  moveDown,
  updateHealth,
  updateTempHealth,
  updateName,
  updateConditions,
  removeCombatant
}) => {
  //modals
  const [conditionsModalIsOpen, setConditionsModalIsOpen] = useState(false);
  const [statBlockModalIsOpen, setStatBlockModalIsOpen] = useState(false);
  const [hpModalIsOpen, setHpModalIsOpen] = useState(false);
  
  const [toggleAdditionalButtonsMenu, setToggleAdditionalButtonsMenu] = useState(false);
  

  //conditions
  const [selectedCondition, setSelectedCondition] = useState('custom');
  const [customCondition, setCustomCondition] = useState('');
  
  const handleConditionChange = (conditionName, value) => {
    const updatedConditions = conditions.map((condition) =>
      condition.name === conditionName ? { ...condition, value } : condition
    );
    updateConditions(id, updatedConditions);
  };
  const addCondition = () => {
    const conditionsWithValues = ['clumsy', 'doomed', 'drained', 'dying', 'frightened','enfeebled', 'persistant-damage', 'slowed', 'stunned','wounded,'];
    if(selectedCondition === 'custom'){
      updateConditions(id, [...conditions, { name: customCondition, value: 0 }])
    }else {
      updateConditions(id, [...conditions, { name: selectedCondition, value: conditionsWithValues.includes(selectedCondition) ? 1 : null }])
    }
  }
  const removeCondition = (conditionName) => {
    updateConditions(id, conditions.filter((condition) => condition.name !== conditionName));
  }

  const handleConditionOptions = (e) => {
    setSelectedCondition(e.target.value);
  }


  //tooltip
  const [tooltipContent, setTooltipContent] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltipSubject, setTooltipSubject] = useState('')
  
    useEffect(() => {
      if(showTooltip){
        setLoading(true);
        const url = `https://taylormusolf.com/pf2e/packs/conditions/${tooltipSubject}.json`
        fetch(url)
          .then(res => res.json())
          .then(data => {
            setTooltipContent(data.system.description.value);
            setLoading(false);
          })
          .catch(err => {
            console.error('Error fetching content for tooltip', err);
            setTooltipContent('Error fetching');
            setLoading(false);
          })
      }
  
    }, [showTooltip])
  
    const tooltipMouseEnter = (condition) => {
      if(data.conditions.includes(condition)){
        setTooltipSubject(condition);
        setShowTooltip(true);
      }
    }
    const toolTipMouseExit = () => {
      setTooltipSubject('');
      setShowTooltip(false);
    }

  //health
  const [healthAdjustment, setHealthAdjustment] = useState(null);
  const [tempHealthAdjustment, setTempHealthAdjustment] = useState(null);

  const adjustHealth = () => {
    const adjustment = parseInt(healthAdjustment, 10);
    if (!isNaN(adjustment)) {
      const newHealth = Math.min(maxHp, Math.max(0, hp + adjustment));
      updateHealth(id, newHealth);
    }
    setHealthAdjustment('');
  };

  const adjustTempHealth = () => {
    const adjustment = parseInt(tempHealthAdjustment, 10);
    if (!isNaN(adjustment)) {
      const newHealth = Math.min(maxHp, Math.max(0, tempHp + adjustment));
      updateTempHealth(id, newHealth);
    }
    setTempHealthAdjustment('');
  };


  const styleToUse = isPC ? pcStyle : npcStyle;
  return (
    <div className='e-combatant-container' style={{ ...styleToUse}}>
      <div className='e-combatant-sections-container'style={{display:'flex', alignItems:'center', justifyContent: 'space-between', width: '100%'}}>
        <div className='e-combatant-title-conditions' style={{display:'flex', alignItems:'center'}}>
          <div className='e-combatant-title' style={{display:'flex', alignItems:'center'}}>
            <p style={{ marginRight: '10px' }}>{initiative}</p>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(id, e.target.value)}
              style={{ fontWeight: isCurrent ? 'bold' : 'normal', marginRight: '10px', width: '200px' }}
            />
          </div>
          {!isPC && useHealth &&(
            <div className='e-combatant-health'>
              <div style={{cursor:'pointer'}} onClick={() => setHpModalIsOpen(!hpModalIsOpen)}>
                <p style={{ marginRight: '10px' }}>
                  HP: {hp}/{maxHp}
                </p>
                {!!tempHp &&<p style={{ marginRight: '10px' }}>
                  Temp HP: {tempHp}
                </p>}
                <div style={healthBarContainerStyle}>
                  <div style={healthBarStyle(hp, maxHp)} />
                </div>
              </div>
              <Modal
                isOpen={hpModalIsOpen}
                onRequestClose={() => setHpModalIsOpen(false)}
                style={hpMenuStyles}
                contentLabel="hp"
              >
                <div style={{ marginRight: '10px' }}>
                  <h2 style={{ marginRight: '10px' }}>
                    HP: {hp}/{maxHp}
                  </h2>
                  <div style={healthBarContainerStyle}>
                    <div style={healthBarStyle(hp, maxHp)} />
                  </div>
                  <input
                    type="number"
                    value={healthAdjustment}
                    onChange={(e) => setHealthAdjustment(e.target.value)}
                    placeholder="+/-"
                    style={{ width: '50px' }}
                  />
                  <button onClick={adjustHealth}>Adjust</button>
                </div>
                <div style={{marginTop: '10px'}}>
                  <h2 style={{ marginRight: '10px' }}>
                    Temp HP: {tempHp}
                  </h2>
                  <input
                    type="number"
                    value={tempHealthAdjustment}
                    onChange={(e) => setTempHealthAdjustment(e.target.value)}
                    placeholder="+/-"
                    style={{ width: '50px' }}
                  />
                  <button onClick={adjustTempHealth}>Adjust</button>
                </div>
              </Modal>
            </div>
          )}
          <div className='e-combatant-conditions' onClick={()=> setConditionsModalIsOpen(true)}>
            <strong>Conditions:</strong>
            {conditions.map((condition, i) => (
              <span key={`${condition.name}-${i}`} onMouseEnter={() => tooltipMouseEnter(condition.name)} onMouseLeave={toolTipMouseExit} style={{cursor: 'pointer' }}>
                {condition.name}
                {condition.value !== null ? ` (${condition.value})` : ''}
                {showTooltip && (
                  <div className="conditions-tooltip">
                    {loading ? 'Loading...' : tooltipContent}
                  </div>
                )}
              </span>
            ))}
          </div>
        </div>
        <button onClick={()=> setToggleAdditionalButtonsMenu(!toggleAdditionalButtonsMenu)}>{toggleAdditionalButtonsMenu ? <FaChevronUp /> : <FaChevronDown />}</button>
      </div>
        <Modal
          isOpen={conditionsModalIsOpen}
          onRequestClose={() => setConditionsModalIsOpen(false)}
          style={conditionsMenuStyles}
          contentLabel="Conditions"
        >
          <div className='conditions-container'>
            <label htmlFor="condition-options">Conditions:</label>
            <select id="condition-options" value={selectedCondition} onChange={handleConditionOptions}>
              <option key={`custom`} value='custom'>custom</option>
              <option key={`delay`} value='delay'>delay</option>
                {data.conditions.map((condition, i) => (
                  <option key={`${condition}-${i}`} value={condition}>{condition}</option>
                ))}
            </select>
            {selectedCondition === 'custom' && <input type='text' value={customCondition} placeholder='custom' onChange={e => setCustomCondition(e.target.value)}/>}
            <button onClick={addCondition}>Add</button>
          </div>

          {conditions.map((condition, i) => (
            <div key={`${condition}-${i}`} className='conditions-index'>
              <span>
                      {condition.name}
              </span>
              {condition.value !== null && (
                <input
                  type="number"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(condition.name, Number(e.target.value))}
                />
              )}
              <button onClick={() => removeCondition(condition.name)}>X</button>
            </div>
          ))}
          <button onClick={() => setConditionsModalIsOpen(false)}>Close</button>
        </Modal>
        {toggleAdditionalButtonsMenu && (<div>
          <>
            {stats && (<button onClick={() => setStatBlockModalIsOpen(true)}>SB</button>)}
            <button onClick={() => moveUp(id)} style={{ marginRight: '5px' }}>
              <FaArrowUp />
            </button>
            <button onClick={() => moveDown(id)} style={{ marginRight: '5px' }}>
              <FaArrowDown />
            </button>
            <button onClick={() => removeCombatant(id)} style={{ marginRight: '5px' }}>
              <IoCloseSharp />
            </button>
          </>
          <Modal
          isOpen={statBlockModalIsOpen}
          onRequestClose={() => setStatBlockModalIsOpen(false)}
          style={statBlockStyles}
          contentLabel="Stat-block"
          >
            <MonsterStatBlock block={stats}/>
            <button onClick={() => setStatBlockModalIsOpen(false)}>Close</button>
          </Modal>
      </div>)}
    </div>
  );
};

export default Combatant;


