import React, { useState } from 'react';
import Combatant from './Combatant';
import PreCombatSetup from './PreCombatSetup';

const Encounter = () => {
  const [round, setRound] = useState(1);
  // const [initiativeOrder, setInitiativeOrder] = useState([
  //   { id: 1, name: "Taylor", maxHP: 100, isPC: true, maxHp: 100, health: 100, initiative: 20, conditions: []}, 
  //   { id: 2, name: "Karisa", maxHP: 50, isPC: true, maxHp: 100, health: 50, initiative: 21, conditions: []}, 
  //   { id: 3, name: "Bugbear", maxHP: 200, isPC: false, maxHp: 100, health: 50, initiative: 5, conditions: []}
  // ]);
  const [initiativeOrder, setInitiativeOrder] =  useState([]);

  const [currentTurn, setCurrentTurn] = useState(0);

  const addCombatant = () => {
    setInitiativeOrder([...initiativeOrder, { id: initiativeOrder.length, name: 'Player ' + (initiativeOrder.length + 1), initiative: 0, health: 100, maxHp: 100, useHealth: true, notes: '', conditions: [] }]);
  };
  const startEncounter = (sortedCombatants) => {
    setInitiativeOrder(sortedCombatants);
    setRound(1);
    setCurrentTurn(0);
  };

  const nextTurn = () => {
    const newOrder = [...initiativeOrder];
    const currentCombatant = newOrder[currentTurn];
    currentCombatant.conditions = currentCombatant.conditions.map(condition => {
      if (condition.name === 'Frightened' && condition.value > 0) {
        return { ...condition, value: condition.value - 1 };
      }
      return condition;
    });
    setInitiativeOrder(newOrder);
    setCurrentTurn((currentTurn + 1) % initiativeOrder.length);
    if (currentTurn === initiativeOrder.length - 1) {
      setRound(round + 1);
    }
  };

  const prevTurn = () => {
    setCurrentTurn((currentTurn - 1 + initiativeOrder.length) % initiativeOrder.length);
    if (currentTurn === 0) {
      setRound(round - 1);
    }
  };

  const moveUp = (id) => {
    const index = initiativeOrder.findIndex(c => c.id === id);
    if (index > 0) {
      const newOrder = [...initiativeOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setInitiativeOrder(newOrder);
    }
  };

  const moveDown = (id) => {
    const index = initiativeOrder.findIndex(c => c.id === id);
    if (index < initiativeOrder.length - 1) {
      const newOrder = [...initiativeOrder];
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
      setInitiativeOrder(newOrder);
    }
  };

  const updateHealth = (id, newHealth) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, health: newHealth } : combatant
    );
    setInitiativeOrder(newOrder);
  };

  const updateName = (id, newName) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, name: newName } : combatant
    );
    setInitiativeOrder(newOrder);
  };

  const updateConditions = (id, conditions) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, conditions } : combatant
    );
    setInitiativeOrder(newOrder);
  };

  const removeCombatant = (index) => {
    const updatedCombatants = initiativeOrder.filter((_, i) => i !== index);
    setInitiativeOrder(updatedCombatants);
    if (current >= updatedCombatants.length) {
      setCurrent(updatedCombatants.length - 1);
    }
  };

  //end combat function to go back to main menu again

  return (
    <div>
      {!initiativeOrder.length && <PreCombatSetup startEncounter={startEncounter} />}
      {!!initiativeOrder.length && (
        <div>
          <h2>Round: {round}</h2>
          <button onClick={prevTurn}>Previous</button>
          <button onClick={nextTurn}>Next</button>
          {initiativeOrder.map((combatant, index) => (
            <Combatant
              key={combatant.id}
              {...combatant}
              isCurrent={index === currentTurn}
              moveUp={moveUp}
              moveDown={moveDown}
              updateHealth={updateHealth}
              updateName={updateName}
              updateConditions={updateConditions}
              removeCombatant={removeCombatant}
            />
          ))}
          <button onClick={addCombatant}>Add Combatant</button>
        </div>
      )}
    </div>
  );
};

export default Encounter;
