import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Encounter from './components/Encounter';
import EncounterManager from './components/EncounterManager';
import EncounterProvider from './context/EncounterContext';
import MonsterStatBlock from './components/MonsterStatBlock';
import CombatantLibraryProvider from './context/CombatantLibraryContext';
import CombatantLibrary from './components/CombatantLibrary';

const monsterURL= 'https://taylormusolf.com/pf2e/packs/abomination-vaults-bestiary/afflicted-irnakurse.json'


const App = () => (
  <EncounterProvider>
    <CombatantLibraryProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" exact element={<EncounterManager />} />
            <Route path="/encounter/:id" element={<Encounter />} />
            <Route path="/monster" element={<MonsterStatBlock url={monsterURL}/>} />
            <Route path="/library" element={<CombatantLibrary/>} />
          </Routes>
        </div>
      </Router>
    </CombatantLibraryProvider>
  </EncounterProvider>
);

export default App
