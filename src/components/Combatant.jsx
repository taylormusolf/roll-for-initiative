import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
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

const combatantStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid black',
  margin: '10px',
  padding: '10px',
  borderRadius: '5px',
  backgroundColor: '#333',
  color: '#fff',
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
  health,
  hp,
  maxHp,
  conditions,
  isCurrent,
  moveUp,
  moveDown,
  updateHealth,
  updateName,
  updateConditions,
  removeCombatant,
  useHealth
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [healthAdjustment, setHealthAdjustment] = useState('');

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
      const newHealth = Math.min(maxHp, Math.max(0, health + adjustment));
      updateHealth(id, newHealth);
    }
    setHealthAdjustment('');
  };

  return (
    <div style={{ ...combatantStyle, border: isCurrent ? '2px solid green' : '1px solid black' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => updateName(id, e.target.value)}
        style={{ fontWeight: isCurrent ? 'bold' : 'normal', marginRight: '10px', width: '100px' }}
      />
      <p style={{ marginRight: '10px' }}>Initiative: {initiative}</p>
      {useHealth &&(
        <>
          <div style={healthBarContainerStyle}>
            <div style={healthBarStyle(hp, maxHp)} />
          </div>
          <p style={{ marginRight: '10px' }}>
            Health: {hp}/{maxHp}
          </p>
          <div style={{ marginRight: '10px' }}>
            <input
              type="text"
              value={healthAdjustment}
              onChange={(e) => setHealthAdjustment(e.target.value)}
              placeholder="+/-"
              style={{ width: '50px' }}
            />
            <button onClick={adjustHealth}>Adjust</button>
          </div>
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
      <button onClick={() => setModalIsOpen(true)} style={{ marginRight: '10px' }}>
        Conditions
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
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
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
        <>
          <button onClick={() => moveUp(id)} style={{ marginRight: '5px' }}>
            Move Up
          </button>
          <button onClick={() => moveDown(id)} style={{ marginRight: '5px' }}>
            Move Down
          </button>
          <button onClick={() => removeCombatant(id)} style={{ marginRight: '5px' }}>
            Remove
          </button>
        </>
    </div>
  );
};

export default Combatant;


