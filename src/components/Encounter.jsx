import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { uniqueNamesGenerator, names } from 'unique-names-generator';
import { EncounterContext } from '../context/EncounterContext';
import { CombatantLibraryContext } from '../context/CombatantLibraryContext';
import { generateRandomID } from '../util/random';
import Combatant from './Combatant';
import PreCombatSetup from './PreCombatSetup';
import './Encounter.scss'
import { BsChevronDoubleDown } from "react-icons/bs";

const Encounter = () => {
  const { id } = useParams();
  const { encounters, updateEncounter} = useContext(EncounterContext);
  const { library, addCombatantToLibrary, removeCombatantFromLibrary } = useContext(CombatantLibraryContext);
  const encounter = encounters.find(enc => enc.id === Number(id));
  const combatants = encounter?.combatants;
  const [round, setRound] = useState(1);
  const [initiativeOrder, setInitiativeOrder] =  useState([]);
  const [libraryCombatants, setLibraryCombatants] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isPreCombat, setIsPreCombat] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const [APL, setAPL] = useState(0);
  const [CR, setCR] = useState('');
  const [XP, setXP] = useState(0);

  useEffect(()=> {
    if(combatants){ //update if combatants info is ready from local storage
      setInitiativeOrder(combatants); //this update to initiativeOrder does not cause an update to localStorage
      setCurrentTurn(encounter.currentTurn);
      setRound(encounter.round);
      setAPL(encounter.APL)
      setIsPreCombat(encounter.isPreCombat);
    }
  }, [combatants])
  useEffect(()=> {
    if(library.length){ 
      setLibraryCombatants(library);
    }
  }, [library])

  useEffect(()=> {
    window.scrollTo(0, 0)
  }, [isPreCombat])
  

  const handleDataChange = (newData) => { //handler that wraps updates to setInitiative that we want to update in localStorage
    setInitiativeOrder(newData);
    setIsModified(true);
  }
  useEffect(()=> {
    if(isModified){ //checks if the update to initiativeOrder is one that we want updated in localStorage
      updateEncounter(Number(id), initiativeOrder, isPreCombat, round, currentTurn, APL).then(()=> setIsModified(false));
    }
  }, [initiativeOrder, isModified])



  const addCombatant = async(isPC) => {
    const characterName = uniqueNamesGenerator({dictionaries: [names]});
    handleDataChange([...initiativeOrder, 
      { id: generateRandomID(),
        name: characterName,
        initiative: '', 
        ac: '',
        hp: 100, 
        maxHp: 100, 
        tempHP: 0,
        speed: '',
        perception: '',
        fortitude: '',
        reflex: '',
        will: '',
        useHealth: true, 
        isPC: isPC, 
        notes: '', 
        conditions: [] 
      }])
  };
  const dupeCombatant = (index) => {
    const newCombatant = {...initiativeOrder[index], id: generateRandomID()};
    handleDataChange([...initiativeOrder, newCombatant]);
    setPlayerNum(playerNum + 1);
  };
  const handleAddtoLibrary = (index) => {
    // const newCombatant = {...initiativeOrder[index], id: generateRandomID()};
    addCombatantToLibrary(initiativeOrder[index]);
  };
  const handleRemoveFromLibrary = (index) => {
    setLibraryCombatants(libraryCombatants.filter((_, i) => i !== index));
    removeCombatantFromLibrary(index)
  }

  const nextTurn = () => {
    const newOrder = [...initiativeOrder];
    const currentCombatant = newOrder[currentTurn];
    currentCombatant.conditions = currentCombatant.conditions.map(condition => {
      if (condition.name === 'Frightened' && condition.value > 0) {
        return { ...condition, value: condition.value - 1 };
      }
      return condition;
    });
    setCurrentTurn((currentTurn + 1) % initiativeOrder.length);
    if (currentTurn === initiativeOrder.length - 1) {
      setRound(round + 1);
    }
    handleDataChange(newOrder);
  };

  const prevTurn = () => {
    if (currentTurn !== 0 || round > 1) {
      setCurrentTurn((currentTurn - 1 + initiativeOrder.length) % initiativeOrder.length);
    }
    if (currentTurn === 0 && round > 1) {
      setRound(round - 1);
    }
    handleDataChange(initiativeOrder);
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
      combatant.id === id ? { ...combatant, hp: newHealth } : combatant
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
    handleDataChange(updatedCombatants);
    if (currentTurn >= updatedCombatants.length) {
      setCurrentTurn(updatedCombatants.length - 1);
    }
  };

  const endEncounter = () => {
    setIsPreCombat(true);
    updateEncounter(Number(id), initiativeOrder, true, APL);
  };

  return (
    <div className='encounter-container'>
      <div className='encounter-buttons'>
        <Link to="/"><button>Back to Manager</button></Link>
        {!isPreCombat && <button onClick={endEncounter}>End Encounter</button>}
        {/* <button onClick={addCombatant}>Add Combatant</button> */}
      </div>
        <h1 className='encounter-name'>{encounter ? encounter.name : 'Loading...'}</h1>
      {isPreCombat ? (
        <PreCombatSetup setCombatants={handleDataChange} 
          combatants = {initiativeOrder} 
          setIsPreCombat ={setIsPreCombat} 
          addCombatant={addCombatant} 
          removeCombatant={removeCombatant} 
          dupeCombatant={dupeCombatant}
          handleAddtoLibrary={handleAddtoLibrary}
          libraryCombatants={libraryCombatants}
          handleRemoveFromLibrary={handleRemoveFromLibrary}
          round={round}
          currentTurn={currentTurn}
          APL={APL}
          setAPL={setAPL}
          CR={CR}
          setCR={setCR}
          XP={XP}
          setXP={setXP}
        />
      ): (
        <div>
          <h2>Round: {round}</h2>
          
          <div className='encounter-combat-index'>
            {initiativeOrder.map((combatant, index) => {
              return(
                <div key={index}>
                  {index === currentTurn && 
                  <div className='encounter-next-bar-container'>
                    <div className='encounter-next-bar' onClick={nextTurn}>
                        <div className='encounter-next-bar-icon'><BsChevronDoubleDown /></div>
                        <div className='encounter-next-bar-text-container'>
                          <div>CURRENT COMBATANT</div>
                          <div>TAP TO ADVANCE</div>
                        </div>
                    </div>
                    <div className='encounter-previous' onClick={prevTurn}>
                      <div>Previous</div>
                    </div>
                  </div>}
                  <Combatant
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
                </div>

              ) 
            })}
          </div>
        </div>

      )}
    </div>
  );
};

export default Encounter;
