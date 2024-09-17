import React, { createContext, useState, useEffect, useRef } from 'react';

export const CriticalContext = createContext();

const CriticalProvider = ({ children }) => {
  const [critHistory, setCritHistory] = useState([]);
  const didMount = useRef(false);

  // Load crits from local storage
  useEffect(() => {
    const savedCrits = JSON.parse(localStorage.getItem('critHistory')) || [];
    setCritHistory(savedCrits);
  }, []);


  //Save crits to local storage
  useEffect(() => {
    if(didMount.current){ //makes useEffect calls to update local storage wait until at least second render
      localStorage.setItem('critHistory', JSON.stringify(critHistory));
    } else {
      didMount.current = true;
    }
  }, [critHistory]);

  const addCritToHistory = (crit) => {
    setCritHistory([crit, ...critHistory]);
  };

  const clearCritHistory = () => {
    setCritHistory([]);
  };


  return (
    <CriticalContext.Provider value={{ critHistory, addCritToHistory, clearCritHistory}}>
      {children}
    </CriticalContext.Provider>
  );
};

export default CriticalProvider;
