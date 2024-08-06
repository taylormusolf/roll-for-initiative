// MonsterDrawer.js
import React, { useState } from 'react';
import MonsterStatBlock from './MonsterStatBlock';
import './MonsterDrawer.scss';

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
        name,
        ac,
        hp,
        maxHp: hp,
        speed,
        perception: mod,
        fortitude,
        reflex,
        will,
        initiative: 0,
        stats: JSON.stringify(statblock),
        npc: true
      };
      addMonster(monster);
      closeDrawer();
    }
  };
  return (
    <div className="monster-drawer">
      <button onClick={closeDrawer}>Close</button>
      {currentView !== 'folders' && <button onClick={handleBackClick}>Back</button>}
      {currentView === 'folders' && (
        <div>
          <h3>Select a Bestiary</h3>
          <ul>
            {Object.keys(monsters).map((bestiary) => (
              <li key={bestiary} onClick={() => handleBestiaryClick(bestiary)}>{bestiary}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'files' && (
        <div>
          <h3>Select an NPC</h3>
          <ul>
            {monsters[selectedBestiary].map((name) => (
              <li key={name} onClick={() => handleNameClick(name)}>{name}</li>
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

