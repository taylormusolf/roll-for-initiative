import React, { useState } from 'react';
import { generateRandomNumber } from '../util/random';

const PreCombatSetup = ({ startEncounter }) => {
  const [combatants, setCombatants] = useState([]);

  const addCombatant = () => {
    setCombatants([...combatants, { id: combatants.length, name: 'Player ' + (combatants.length + 1), initiative: 0, health: 100, maxHp: 100, useHealth: true, notes: '',conditions: [] }]);
  };

  const updateCombatant = (index, key, value) => {
    const updatedCombatants = combatants.map((combatant, i) =>
      i === index ? { ...combatant, [key]: value } : combatant
    );
    setCombatants(updatedCombatants);
  };
  const removeCombatant = (index) => {
    const updatedCombatants = combatants.filter((_, i) => i !== index);
    setCombatants(updatedCombatants);
  };

  const handleStart = () => {
    const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
    startEncounter(sortedCombatants);
  };

  return (
    <div>
      <h2>Set Up Combatants</h2>
      {combatants.map((combatant, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={combatant.name}
            onChange={(e) => updateCombatant(index, 'name', e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <label>Initiative: </label>
          <input
            type="number"
            placeholder="Initiative"
            value={combatant.initiative}
            onChange={(e) => updateCombatant(index, 'initiative', Number(e.target.value))}
            style={{ marginRight: '10px', width: '80px' }}
          />
          <button onClick={()=> updateCombatant(index, 'initiative', generateRandomNumber())}>Rand</button>
          {combatant.useHealth && (
            <>
                <label>Starting Health: </label>
                <input
                    type="number"
                    placeholder="Health"
                    value={combatant.health}
                    onChange={(e) => updateCombatant(index, 'health', Number(e.target.value))}
                    style={{ marginRight: '10px', width: '80px' }}
                />
                <label>Max Health: </label>
                <input
                    type="number"
                    placeholder="Max HP"
                    value={combatant.maxHp}
                    onChange={(e) => updateCombatant(index, 'maxHp', Number(e.target.value))}
                    style={{ marginRight: '10px', width: '80px' }}
                />
            </>
          )}
          <button onClick={() => updateCombatant(index, 'useHealth', !combatant.useHealth)}>Toggle Health</button>
          <button onClick={() => removeCombatant(index)} style={{ marginLeft: '10px' }}>Remove</button>
        </div>
      ))}
      <button onClick={addCombatant}>Add Combatant</button>
      <button onClick={handleStart} disabled={combatants.length === 0}>
        Start Encounter
      </button>
    </div>
  );
};

export default PreCombatSetup;
