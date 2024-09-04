import React, { useEffect, useState, useRef } from 'react';
import MonsterStatBlock from './MonsterStatBlock';
import './MonsterDrawer.scss';
import { generateRandomID } from '../util/random';
import { FaWindowClose } from "react-icons/fa";

const MonsterDrawer = ({ monsters, addMonster, closeDrawer }) => {
  const [currentView, setCurrentView] = useState('bestiary-view');
  const [selectedBestiary, setSelectedBestiary] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [statblock, setStatblock] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [navigationStack, setNavigationStack] = useState([]);
  const scrollRef = useRef(null);


  useEffect(()=> {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0
      });
    }
  }, [selectedBestiary, selectedName, statblock])

  useEffect(()=> {
    if(search.length){
      if(currentView !== 'search-view') setCurrentView('search-view')
      const matches = [];
      Object.keys(monsters).forEach(bestiary => {
        const filtered = monsters[bestiary].filter(item => item.toLowerCase().includes(search.toLowerCase()))
        if(filtered.length){
          matches.push([bestiary, filtered])
        }
      })
      setSearchResults(matches);
    } else {
      setCurrentView('bestiary-view')
    }
  }, [search])

  const handleBestiaryClick = (bestiary) => {
    setNavigationStack(prev => [...prev, "bestiary-view"]);
    setSelectedBestiary(bestiary);
    setCurrentView('npc-names-view');
  };

  const handleNameClick = (name) => {
    setNavigationStack(prev => [...prev, "npc-names-view"]);
    setSelectedName(name);
    setCurrentView('statblock-view');
  };

  const handleSearchClick = (bestiary, name) => {
    setNavigationStack(prev => [...prev, "search-view"]);
    setSelectedBestiary(bestiary);
    setSelectedName(name);
    setCurrentView('statblock-view');
  }

  const handleBackClick = () => {
    const previous = navigationStack.pop();
    console.log(previous)
    if (previous === 'npc-names-view') {
      setCurrentView('npc-names-view');
      setSelectedName(null);
    } else if (previous === 'bestiary-view') {
      setCurrentView('bestiary-view');
      setSelectedBestiary(null);
    } else if (previous === 'search-view') {
      setCurrentView('search-view');
      setSelectedBestiary(null);
    } else {
      setCurrentView('bestiary-view');
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleClearSearch = () => {
    setSearch('');
    setSearchResults([]);
    setCurrentView('bestiary-view');
  }


  return (
    <div className="monster-drawer open"  ref={scrollRef}>
      <div className='monster-drawer-buttons'>
        <button onClick={closeDrawer}><FaWindowClose /></button>
        {currentView !== 'bestiary-view' && currentView !== 'search-view' && <button onClick={handleBackClick}>Back</button>}
        {currentView === 'statblock-view' && selectedName && <button onClick={handleAddMonster}>Add NPC</button>}
        {currentView !== 'statblock-view' && <input type='text' style={{backgroundColor: 'var(--tan)', width:'200px'}} value={search} onChange={handleSearch}/>}
        {currentView !== 'statblock-view' && <button onClick={handleClearSearch}>Clear Search</button> }
      </div>
      {currentView === 'search-view' &&
        <div className='monster-drawer-bestiary'>
          <h2>Search Results</h2>
          {!searchResults.length ? <div> No Results </div>: <div>
            {searchResults.map(([bestiary, mons], i)=> (
              <div className='monster-drawer-names' key={`${bestiary}-${i}`}>
                <h3>{textParse(bestiary)}</h3>
                  <ul> 
                    {mons.map(mon => (
                      <li key={`${mon}-${i}`} onClick={() => handleSearchClick(bestiary, mon)}>{textParse(mon)}</li>
                    ))}
                  </ul>
              </div>
            ))}
          </div>}
        </div>
      }
      {currentView === 'bestiary-view' && (
        <div className='monster-drawer-bestiary'>
          <h3>Select a Bestiary</h3>
          <ul>
            {Object.keys(monsters).map((bestiary) => (
              <li key={bestiary} onClick={() => handleBestiaryClick(bestiary)}>{textParse(bestiary)}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'npc-names-view' && (
        <div className='monster-drawer-names'>
          <h3>Select an NPC</h3>
          <ul>
            {monsters[selectedBestiary].map((name) => (
              <li key={name} onClick={() => handleNameClick(name)}>{textParse(name)}</li>
            ))}
          </ul>
        </div>
      )}
      {currentView === 'statblock-view' && selectedName && (
        <div>
          <MonsterStatBlock selectedBestiary={selectedBestiary} selectedName={selectedName} setStatblock={setStatblock} />
        </div>
      )}
    </div>
  );
};

export default MonsterDrawer;

