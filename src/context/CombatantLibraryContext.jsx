import React, { createContext, useState, useEffect, useRef } from 'react';

export const CombatantLibraryContext = createContext();

const CombatantLibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const didMount = useRef(false);

  // Load library from local storage
  useEffect(() => {
    const savedLibrary = JSON.parse(localStorage.getItem('combatantLibrary')) || [];
    setLibrary(savedLibrary);
  }, []);


  //Save library to local storage
  useEffect(() => {
    if(didMount.current){ //makes useEffect calls to update local storage wait until at least second render
      localStorage.setItem('combatantLibrary', JSON.stringify(library));
    } else {
      didMount.current = true;
    }
  }, [library]);

  const addCombatantToLibrary = (combatant) => {
    setLibrary([...library, combatant]);
  };

  const removeCombatantFromLibrary = (index) => {
    setLibrary(library.filter((_, i) => i !== index));
  };

  return (
    <CombatantLibraryContext.Provider value={{ library, addCombatantToLibrary, removeCombatantFromLibrary }}>
      {children}
    </CombatantLibraryContext.Provider>
  );
};

export default CombatantLibraryProvider;
