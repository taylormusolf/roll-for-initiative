import React, { useState } from 'react';
import Combatant from './Combatant2';

const Encounter = () => {
  const [round, setRound] = useState(1);
  const [initiativeOrder, setInitiativeOrder] = useState([
    { id: 1, name: 'Player 1', initiative: 15, health: 100 },
    { id: 2, name: 'NPC 1', initiative: 12, health: 50 },
  ]);
  const [delayedCombatants, setDelayedCombatants] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const nextTurn = () => {
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

  const delayTurn = (id) => {
    const index = initiativeOrder.findIndex(c => c.id === id);
    const [combatant] = initiativeOrder.splice(index, 1);
    setInitiativeOrder([...initiativeOrder]);
    setDelayedCombatants([...delayedCombatants, combatant]);
  };

  const returnToOrder = (id) => {
    const index = delayedCombatants.findIndex(c => c.id === id);
    const [combatant] = delayedCombatants.splice(index, 1);
    combatant.initiative = initiativeOrder[currentTurn].initiative;
    setDelayedCombatants([...delayedCombatants]);
    setInitiativeOrder([...initiativeOrder, combatant]);
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

  return (
    <div>
      <h1>Round: {round}</h1>
      <div>
        <h2>Delayed Combatants</h2>
        {delayedCombatants.map(combatant => (
          <Combatant
            key={combatant.id}
            {...combatant}
            returnToOrder={returnToOrder}
            isDelayed
          />
        ))}
      </div>
      <button onClick={prevTurn}>Previous</button>
      <button onClick={nextTurn}>Next</button>
      {initiativeOrder.map((combatant, index) => (
        <Combatant
          key={combatant.id}
          {...combatant}
          isCurrent={index === currentTurn}
          delayTurn={delayTurn}
          moveUp={moveUp}
          moveDown={moveDown}
          updateHealth={updateHealth}
          updateName={updateName}
        />
      ))}
    </div>
  );
};

export default Encounter;
