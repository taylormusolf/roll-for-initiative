// EncounterContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';

export const EncounterContext = createContext();

const EncounterProvider = ({ children }) => {
  const [encounters, setEncounters] = useState([]);
  // const [encountersPulled, setEncountersPulled] = useState(false);
  const didMount = useRef(false);

  // Load encounters from local storage
  useEffect(() => {
    const savedEncounters = JSON.parse(localStorage.getItem('encounters')) || [];
    setEncounters(savedEncounters);
  }, []);
  
  // Save encounters to local storage
  useEffect(() => {
    if(didMount.current){ //makes useEffect calls to update local storage wait until at least second render
      localStorage.setItem('encounters', JSON.stringify(encounters));
      // setEncountersPulled(true);
    } else {
      didMount.current = true;
    }
  }, [encounters]);

  const addEncounter = (name) => {
    const newEncounter = { id: Date.now(), name: name || new Date().toLocaleString(), combatants: [], isPreCombat: true, round: 1, currentTurn: 0, APL: 0 };
    setEncounters([...encounters, newEncounter]);
  };

  const updateEncounter = async ({id, combatants, isPreCombat, round, currentTurn, APL, name}) => {
    const updatedEncounters = encounters.map(enc =>
      enc.id === id ? { 
        ...enc,
        name: name !== undefined ? name : enc.name, 
        combatants: combatants !== undefined ? combatants : enc.combatants, 
        isPreCombat: isPreCombat !== undefined ? isPreCombat : enc.isPreCombat, 
        round: round !== undefined ? round : enc.round, 
        currentTurn: currentTurn !== undefined ? currentTurn : enc.currentTurn, 
        APL : APL !== undefined ? APL : enc.APL
      } : enc
    )
    setEncounters(updatedEncounters);
  };

  const deleteEncounter = (id) => {
    setEncounters(encounters.filter(encounter => encounter.id !== id));
  };

  return (
    <EncounterContext.Provider value={{ encounters, addEncounter, updateEncounter, deleteEncounter}}>
      {children}
    </EncounterContext.Provider>
  );
};

export default EncounterProvider;
