import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import Combatant from './Combatant';
import PreCombatSetup from './PreCombatSetup';

const Encounter = () => {
  const { id } = useParams();
  const { encounters, updateEncounter, encountersPulled } = useContext(EncounterContext);
  const encounter = encounters.find(enc => enc.id === Number(id));
  const combatants = encounter?.combatants;
  const [round, setRound] = useState(1);
  const [initiativeOrder, setInitiativeOrder] =  useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPreCombat, setIsPreCombat] = useState(true);
  const [playerNum, setPlayerNum] = useState(1);
  const [isModified, setIsModified] = useState(false);

  useEffect(()=> {
    if(combatants){
      setInitiativeOrder(combatants);
      setIsPreCombat(encounter.isPreCombat)
    }
  }, [combatants])

  const handleDataChange = (newData) => {
    setInitiativeOrder(newData);
    setIsModified(true);
  }
  useEffect(()=> {
    if(isModified){
      updateEncounter(Number(id), initiativeOrder, isPreCombat).then(()=> setIsModified(false));
    }
  }, [initiativeOrder, isModified])


  const addCombatant = () => {
    handleDataChange([...initiativeOrder, { id: Math.floor(Math.random()*1000), name: 'Player ' + (playerNum), initiative: 0, hp: 100, maxHp: 100, useHealth: true, isPC: true, notes: '', conditions: [] }])
    setPlayerNum(playerNum + 1);
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
    handleDataChange(newOrder);
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
      handleDataChange(newOrder);
    }
  };

  const moveDown = (id) => {
    const index = initiativeOrder.findIndex(c => c.id === id);
    if (index < initiativeOrder.length - 1) {
      const newOrder = [...initiativeOrder];
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
      handleDataChange(newOrder);
    }
  };

  const updateHealth = (id, newHealth) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, health: newHealth } : combatant
    );
    handleDataChange(newOrder);
  };

  const updateName = (id, newName) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, name: newName } : combatant
    );
    handleDataChange(newOrder);
  };

  const updateConditions = (id, conditions) => {
    const newOrder = initiativeOrder.map(combatant =>
      combatant.id === id ? { ...combatant, conditions } : combatant
    );
    handleDataChange(newOrder);
  };

  const removeCombatant = (index) => {
    const updatedCombatants = initiativeOrder.filter((_, i) => i !== index);
    console.log(updatedCombatants)
    handleDataChange(updatedCombatants);
    if (currentTurn >= updatedCombatants.length) {
      setCurrentTurn(updatedCombatants.length - 1);
    }
  };

  const endEncounter = () => {
    setIsPreCombat(true);
    updateEncounter(Number(id), initiativeOrder, true);
  };

  return (
    <div>
      <Link to="/">Back to Manager</Link>
      <h1>{encounter ? encounter.name : 'Loading...'}</h1>
      {isPreCombat ? (
        <PreCombatSetup setCombatants={handleDataChange} combatants = {initiativeOrder} setIsPreCombat ={setIsPreCombat} addCombatant={addCombatant} removeCombatant={removeCombatant}/>
      ): (
        <div>
          <h2>Round: {round}</h2>
          <button onClick={prevTurn}>Previous</button>
          <button onClick={nextTurn}>Next</button>
          {initiativeOrder.map((combatant, index) => {
            return <Combatant
              key={combatant.id}
              {...combatant}
              isCurrent={index === currentTurn}
              moveUp={moveUp}
              moveDown={moveDown}
              updateHealth={updateHealth}
              updateName={updateName}
              updateConditions={updateConditions}
              removeCombatant={() => removeCombatant(index)}
            />
})}
          <button onClick={addCombatant}>Add Combatant</button>
          <button onClick={endEncounter}>End Encounter</button>
        </div>

      )}
    </div>
  );
};

export default Encounter;
