// CombatantLibrary.js
import React, { useContext, useState } from 'react';
import { CombatantLibraryContext } from '../context/CombatantLibraryContext';

const CombatantLibrary = () => {
  const { library, addCombatantToLibrary, removeCombatantFromLibrary } = useContext(CombatantLibraryContext);
  const [newCombatant, setNewCombatant] = useState({ name: '', initiative: 0, health: 0, maxHealth: 0 });

  const handleAddCombatant = () => {
    addCombatantToLibrary(newCombatant);
    setNewCombatant({ name: '', initiative: 0, health: 0, maxHealth: 0 });
  };

  return (
    <div>
      <h2>Combatant Library</h2>
      {library.map((combatant, index) => (
        <div key={index}>
          <p>Name: {combatant.name}</p>
          <p>Initiative: {combatant.initiative}</p>
          <p>Health: {combatant.health} / {combatant.maxHealth}</p>
          <button onClick={() => removeCombatantFromLibrary(index)}>Remove</button>
        </div>
      ))}
      <div>
        <h3>Add New Combatant</h3>
        <input
          type="text"
          placeholder="Name"
          value={newCombatant.name}
          onChange={(e) => setNewCombatant({ ...newCombatant, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Initiative"
          value={newCombatant.initiative}
          onChange={(e) => setNewCombatant({ ...newCombatant, initiative: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Health"
          value={newCombatant.health}
          onChange={(e) => setNewCombatant({ ...newCombatant, health: parseInt(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Max Health"
          value={newCombatant.maxHealth}
          onChange={(e) => setNewCombatant({ ...newCombatant, maxHealth: parseInt(e.target.value) })}
        />
        <button onClick={handleAddCombatant}>Add to Library</button>
      </div>
    </div>
  );
};

export default CombatantLibrary;
