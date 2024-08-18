import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Encounter from './components/Encounter';
import EncounterManager from './components/EncounterManager';
import EncounterProvider from './context/EncounterContext';
import CombatantLibraryProvider from './context/CombatantLibraryContext';
import CombatantLibrary from './components/CombatantLibrary';

console.log('localstorage-encounters', localStorage.getItem('encounters'))

const App = () => (
  <EncounterProvider>
    <CombatantLibraryProvider>
      <h1>Roll for Initiative</h1>
      <Router>
          <Routes>
            <Route path="/" exact element={<EncounterManager/>} />
            <Route path="/encounter/:id" element={<Encounter/>} />
            <Route path="/library" element={<CombatantLibrary/>} />
          </Routes>
      </Router>
    </CombatantLibraryProvider>
  </EncounterProvider>
);

export default App
