import React, { useEffect, useState, useRef } from 'react';
import MonsterStatBlock from './MonsterStatBlock';
import './MonsterDrawer.scss';
import { generateRandomID } from '../util/random';
import { FaWindowClose } from "react-icons/fa";

const MonsterDrawer = ({ monsters, addMonster, closeDrawer }) => {
  const [currentView, setCurrentView] = useState('folders');
  const [selectedBestiary, setSelectedBestiary] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [statblock, setStatblock] = useState(null);
  const scrollRef = useRef(null);


  useEffect(()=> {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0
      });
    }
  }, [selectedBestiary, selectedName, statblock])
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
        name,
        conditions: [],
        initiative: '',
        ac: ac.value,
        hp: hp.value,
        maxHp: hp.max,
        tempHp: hp.temp,
        speed,
        perception: mod,
        fortitude,
        reflex,
        will,
        useHealth: true,
        isPC: false,
        notes: '',
        stats: JSON.stringify(statblock),
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
    <div className="monster-drawer open"  ref={scrollRef}>
      <div className='monster-drawer-buttons'>
        <button onClick={closeDrawer}><FaWindowClose /></button>
        {currentView !== 'folders' && <button onClick={handleBackClick}>Back</button>}
        {currentView === 'preview' && selectedName && <button onClick={handleAddMonster}>Add NPC</button>}
      </div>
      {currentView === 'folders' && (
        <div className='monster-drawer-bestiary'>
          <h3>Select a Bestiary</h3>
          <ul>
            {Object.keys(monsters).map((bestiary) => (
              <li key={bestiary} onClick={() => handleBestiaryClick(bestiary)}>{textParse(bestiary)}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'files' && (
        <div className='monster-drawer-names'>
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
          <MonsterStatBlock selectedBestiary={selectedBestiary} selectedName={selectedName} setStatblock={setStatblock} />
        </div>
      )}
    </div>
  );
};

export default MonsterDrawer;

