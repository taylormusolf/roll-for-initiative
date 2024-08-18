import React, { createContext, useState, useEffect } from 'react';

export const CombatantLibraryContext = createContext();

const CombatantLibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const savedLibrary = JSON.parse(localStorage.getItem('combatantLibrary')) || [];
    setLibrary(savedLibrary);
  }, []);

  useEffect(() => {
    localStorage.setItem('combatantLibrary', JSON.stringify(library));
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
