import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Encounter from './components/Encounter';
import EncounterManager from './components/EncounterManager';
import EncounterProvider from './context/EncounterContext';
import MonsterStatBlock from './components/MonsterStatBlock';

const monsterURL= 'https://taylormusolf.com/pf2e/packs/abomination-vaults-bestiary/afflicted-irnakurse.json'


const App = () => (
  <EncounterProvider>
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<EncounterManager />} />
          <Route path="/encounter/:id" element={<Encounter />} />
          <Route path="/monster" element={<MonsterStatBlock url={monsterURL}/>} />
        </Routes>
      </div>
    </Router>
  </EncounterProvider>
);

export default App
