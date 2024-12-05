import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Encounter from './components/Encounter';
import EncounterManager from './components/EncounterManager';
import EncounterProvider from './context/EncounterContext';
import CombatantLibraryProvider from './context/CombatantLibraryContext';
import CriticalProvider from './context/CriticalContext';
import CombatantLibrary from './components/CombatantLibrary';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// console.log('localstorage-encounters', localStorage.getItem('encounters'))
// console.log('localstorage-library', localStorage.getItem('combatantLibrary'))


const App = () => (
  <EncounterProvider>
    <CombatantLibraryProvider>
      <CriticalProvider>
        <div className='app-container'>
          <header className='navbar'>
            <Navbar />
          </header>
          <main className='content'>
            <Router basename='/roll-for-initiative'>
                <Routes>
                  <Route path="/" exact element={<EncounterManager/>} />
                  <Route path="/encounter/:id" element={<Encounter/>} />
                  <Route path="/library" element={<CombatantLibrary/>} />
                </Routes>
            </Router>
          </main>
          <footer className='footer'>
            <Footer />
          </footer>
        </div>
      </CriticalProvider>
    </CombatantLibraryProvider>
  </EncounterProvider>
);

export default App
