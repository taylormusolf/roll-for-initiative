import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import MonsterStatBlock from './MonsterStatBlock';
import '../../node_modules/nouislider/dist/nouislider.css';
import Nouislider from 'nouislider-react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import './Combatant.scss'



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
    borderRadius: '10px',
    width: '300px',
    backgroundColor: 'rgb(51,51,51)',
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
    backgroundColor: 'white',
    overflow: 'auto'
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
  updateName,
  updateConditions,
  removeCombatant
}) => {
  const [conditionsModalIsOpen, setConditionsModalIsOpen] = useState(false);
  const [statBlockModalIsOpen, setStatBlockModalIsOpen] = useState(false);
  const [hpModalIsOpen, setHpModalIsOpen] = useState(false);
  const [toggleAdditionalButtonsMenu, setToggleAdditionalButtonsMenu] = useState(false);

  // Calculate the width of the health, damage, and healing bars
  const [healthAdjustment, setHealthAdjustment] = useState('');
  const [damage, setDamage] = useState(0); // Damage taken
  const [healing, setHealing] = useState(0); // Healing done
  const healthPercentage = ((hp - damage + healing) / maxHp) * 100;
  const damagePercentage = (damage / maxHp) * 100;
  const healingPercentage = (healing / maxHp) * 100;

  const [value, setValue] = useState([20, 80]); // Initial slider values

  const handleChange = (render, handle, value) => {
    console.log('change')
    setValue(value); // Update state on slider change
  };


  const toggleCondition = (conditionName) => {
    const existingCondition = conditions.find((condition) => condition.name === conditionName);
    if (existingCondition) {
      updateConditions(id, conditions.filter((condition) => condition.name !== conditionName));
    } else {
      const conditionsWithValues = ['Clumsy', 'Doomed', 'Drained', 'Dying', 'Frightened','Enfeebled', 'Persistant Damage', 'Slowed', 'Stunned','Wounded,']
      updateConditions(id, [...conditions, { name: conditionName, value: conditionsWithValues.includes(conditionName) ? 1 : null }]);
    }
  };

  const handleConditionChange = (conditionName, value) => {
    const updatedConditions = conditions.map((condition) =>
      condition.name === conditionName ? { ...condition, value } : condition
    );
    updateConditions(id, updatedConditions);
  };

  const adjustHealth = () => {
    const adjustment = parseInt(healthAdjustment, 10);
    if (!isNaN(adjustment)) {
      const newHealth = Math.min(maxHp, Math.max(0, hp + adjustment));
      updateHealth(id, newHealth);
    }
    setHealthAdjustment('');
  };
  const styleToUse = isPC ? pcStyle : npcStyle;
  return (
    <div style={{ ...styleToUse}}>
      <div style={{display:'flex', alignItems:'center', justifyContent: 'space-between', width: '100%'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <p style={{ marginRight: '10px' }}>{initiative}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => updateName(id, e.target.value)}
            style={{ fontWeight: isCurrent ? 'bold' : 'normal', marginRight: '10px', width: '200px' }}
          />
          {!isPC && useHealth &&(
            <>
              <div style={{cursor:'pointer'}} onClick={() => setHpModalIsOpen(!hpModalIsOpen)}>
                <p style={{ marginRight: '10px' }}>
                  HP: {hp}/{maxHp}
                </p>
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
                  <p style={{ marginRight: '10px' }}>
                    HP: {hp}/{maxHp}
                  </p>
                  <div style={healthBarContainerStyle}>
                    <div style={healthBarStyle(hp, maxHp)} />
                  </div>
                  <input
                    type="text"
                    value={healthAdjustment}
                    onChange={(e) => setHealthAdjustment(e.target.value)}
                    placeholder="+/-"
                    style={{ width: '50px' }}
                  />
                  <button onClick={adjustHealth}>Adjust</button>
                  <div>
                    <h2>React NoUiSlider Example</h2>
                    <Nouislider
                      range={{ min: 0, max: 100 }}
                      start={value}
                      connect
                      onSlide={handleChange}
                    />
                    <p>Selected Range: {value.join(' - ')}</p>
                  </div>
                </div>
              </Modal>
            </>
          )}
          <div style={{ marginRight: '10px' }}>
            <strong>Conditions:</strong>
            {conditions.map((condition) => (
              <span key={condition.name} style={{ marginLeft: '5px' }}>
                {condition.name}
                {condition.value !== null ? ` (${condition.value})` : ''}
              </span>
            ))}
          </div>
        </div>
        <button onClick={()=> setToggleAdditionalButtonsMenu(!toggleAdditionalButtonsMenu)}>{toggleAdditionalButtonsMenu ? <FaChevronUp /> : <FaChevronDown />}</button>
      </div>
      {toggleAdditionalButtonsMenu && (<div>
        <button onClick={() => setConditionsModalIsOpen(true)} style={{ marginRight: '10px' }}>
          Conditions
        </button>
        <Modal
          isOpen={conditionsModalIsOpen}
          onRequestClose={() => setConditionsModalIsOpen(false)}
          style={conditionsMenuStyles}
          contentLabel="Conditions"
        >
          <h2>Conditions</h2>
          <button onClick={() => toggleCondition('Blinded')}>Blinded</button>
          {/* <button onClick={() => toggleCondition('Broken')}>Broken</button> */}
          <button onClick={() => toggleCondition('Clumsy')}>Clumsy</button>
          {/* <button onClick={() => toggleCondition('Concealed')}>Concealed</button> */}
          <button onClick={() => toggleCondition('Confused')}>Confused</button>
          {/* <button onClick={() => toggleCondition('Controlled')}>ontrolled</button> */}
          <button onClick={() => toggleCondition('Dazzled')}>Dazzled</button>
          <button onClick={() => toggleCondition('Deafened')}>Deafened</button>
          <button onClick={() => toggleCondition('Delayed')}>Delayed</button>
          <button onClick={() => toggleCondition('Doomed')}>Doomed</button>
          <button onClick={() => toggleCondition('Drained')}>Drained</button>
          <button onClick={() => toggleCondition('Dying')}>Dying</button>
          {/* <button onClick={() => toggleCondition('Encumbered')}>Encumbered</button> */}
          <button onClick={() => toggleCondition('Enfeebled')}>Enfeebled</button>
          <button onClick={() => toggleCondition('Fascinated')}>Fascinated</button>
          <button onClick={() => toggleCondition('Fatigued')}>Fatigued</button>
          <button onClick={() => toggleCondition('Fleeing')}>Fleeing</button>
          {/* <button onClick={() => toggleCondition('Friendly')}>Friendly</button> */}
          <button onClick={() => toggleCondition('Frightened')}>Frightened</button>
          <button onClick={() => toggleCondition('Grabbed')}>Grabbed</button>
          {/* <button onClick={() => toggleCondition('Helpful')}>Helpful</button> */}
          {/* <button onClick={() => toggleCondition('Hidden')}>Hidden</button> */}
          {/* <button onClick={() => toggleCondition('Hostile')}>Hostile</button> */}
          <button onClick={() => toggleCondition('Immobilized')}>Immobilized</button>
          <button onClick={() => toggleCondition('Indifferent')}>Indifferent</button>
          <button onClick={() => toggleCondition('Invisible')}>Invisible</button>
          {/* <button onClick={() => toggleCondition('Observed')}>Observed</button> */}
          <button onClick={() => toggleCondition('Off-Guard')}>Off-Guard</button>
          <button onClick={() => toggleCondition('Paralyzed')}>Paralyzed</button>
          <button onClick={() => toggleCondition('Persistent Damage')}>Persistent Damage</button>
          <button onClick={() => toggleCondition('Petrified')}>Petrified</button>
          <button onClick={() => toggleCondition('Prone')}>Prone</button>
          <button onClick={() => toggleCondition('Quickened')}>Quickened</button>
          <button onClick={() => toggleCondition('Restrained')}>Restrained</button>
          <button onClick={() => toggleCondition('Sickened')}>Sickened</button>
          <button onClick={() => toggleCondition('Slowed')}>Slowed</button>
          <button onClick={() => toggleCondition('Stunned')}>Stunned</button>
          <button onClick={() => toggleCondition('Stupefied')}>Stupefied</button>
          <button onClick={() => toggleCondition('Unconscious')}>Unconscious</button>
          {/* <button onClick={() => toggleCondition('Undetected')}>Undetected</button> */}
          {/* <button onClick={() => toggleCondition('Unfriendly')}>Unfriendly</button> */}
          {/* <button onClick={() => toggleCondition('Unnoticed')}>Unnoticed</button> */}
          <button onClick={() => toggleCondition('Wounded')}>Wounded</button>
          <button onClick={() => toggleCondition('Special 1')}>Special 1</button>
          <button onClick={() => toggleCondition('Special 2')}>Special 2</button>
          <button onClick={() => toggleCondition('Special 3')}>Special 3</button>

          {conditions.map((condition) => (
            <div key={condition.name}>
              <span>{condition.name}</span>
              {condition.value !== null && (
                <input
                  type="number"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(condition.name, Number(e.target.value))}
                />
              )}
            </div>
          ))}
          <button onClick={() => setConditionsModalIsOpen(false)}>Close</button>
        </Modal>
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


