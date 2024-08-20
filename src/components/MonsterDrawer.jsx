// MonsterDrawer.js
import React, { useState } from 'react';
import MonsterStatBlock from './MonsterStatBlock';
import './MonsterDrawer.scss';
import { generateRandomID } from '../util/random';

const MonsterDrawer = ({ monsters, addMonster, closeDrawer }) => {
  const [currentView, setCurrentView] = useState('folders');
  const [selectedBestiary, setSelectedBestiary] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [statblock, setStatblock] = useState(null);

  const handleBestiaryClick = (bestiary) => {
    setSelectedBestiary(bestiary);
    setCurrentView('files');
  };

  const handleNameClick = (name) => {
    setSelectedName(name);
    setCurrentView('preview');
  };

  const handleBackClick = () => {
    if (currentView === 'preview') {
      setCurrentView('files');
      setSelectedName(null);
    } else if (currentView === 'files') {
      setCurrentView('folders');
      setSelectedBestiary(null);
    }
  };

  const handleAddMonster = () => {
    if (statblock) {
        const {
            img,
            name,
            system: {
              abilities,
              attributes: { ac, hp, immunities, resistances, speed, allSaves, weaknesses },
              details: { languages, level, publicNotes },
              initiative: {statistic},
              perception: {details, mod, senses},
              resources: {focus},
              saves: {fortitude, reflex, will},
              skills,
              traits: {rarity, size, value},
              type
            },
            items,
          } = statblock;

      const monster = {
        id: generateRandomID(),
        conditions: [],
        name,
        ac: ac.value,
        hp: hp.value,
        maxHp: hp.max,
        tempHp: hp.temp,
        speed,
        perception: mod,
        fortitude,
        reflex,
        will,
        initiative: null,
        stats: JSON.stringify(statblock),
        isPC: false,
        notes: '',
        useHealth: true,
        cr: level.value
      };
      addMonster(monster);
      closeDrawer();
    }
  };

  const textParse = (text) => {
    const arr = text.split('-');
    const preps = ['of', 'the'];
    for(let i = 0; i < arr.length; i++){
      if(i === 0){
        arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
      } else {
        if(!preps.includes(arr[i])){
          arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
        }
      }
    }
    return arr.join(' ');
  }


  return (
    <div className="monster-drawer">
      <button onClick={closeDrawer}>Close</button>
      {currentView !== 'folders' && <button onClick={handleBackClick}>Back</button>}
      {currentView === 'folders' && (
        <div>
          <h3>Select a Bestiary</h3>
          <ul>
            {Object.keys(monsters).map((bestiary) => (
              <li key={bestiary} onClick={() => handleBestiaryClick(bestiary)}>{textParse(bestiary)}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'files' && (
        <div>
          <h3>Select an NPC</h3>
          <ul>
            {monsters[selectedBestiary].map((name) => (
              <li key={name} onClick={() => handleNameClick(name)}>{textParse(name)}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'preview' && selectedName && (
        <div>
          <button onClick={handleAddMonster}>Add NPC</button>
          <MonsterStatBlock selectedBestiary={selectedBestiary} selectedName={selectedName} setStatblock={setStatblock} />
        </div>
      )}
    </div>
  );
};

export default MonsterDrawer;

