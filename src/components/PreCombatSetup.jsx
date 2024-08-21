import React, { useState, useContext, useEffect } from 'react';
import { generateRandomNumber } from '../util/random';
import { useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import MonsterDrawer from './MonsterDrawer';
import monsters from '../assets/data/monsters.json'
import './PreCombatSetup.scss'

const PreCombatSetup = ({ combatants, setCombatants, setIsPreCombat, addCombatant, removeCombatant, dupeCombatant, handleAddtoLibrary, libraryCombatants, handleRemoveFromLibrary }) => {
    const { id } = useParams();
    const { updateEncounter} = useContext(EncounterContext);
    const [showMonsterDrawer, setShowMonsterDrawer] = useState(false);


    const updateCombatant = (index, key, value) => {
        const updatedCombatants = combatants.map((combatant, i) =>
        i === index ? { ...combatant, [key]: value } : combatant
        );
        setCombatants(updatedCombatants);
    };
    
    const addCombatantFromLibrary = (combatant) => {
        const newCombatant = {}
        setCombatants([...combatants, combatant]);
    };
    const addMonster = (monster) => {
        setCombatants([...combatants, monster]);
    };

    const handleStart = () => {
        const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
        setIsPreCombat(false);
        setCombatants(sortedCombatants);
        updateEncounter(Number(id), sortedCombatants, false);
    };
    const npcInitiativeRoll = () => {
        const updatedCombatants = combatants.map((combatant)=> (
            !combatant.isPC ? { ...combatant, 'initiative': generateRandomNumber(20, combatant.perception || 0) } : combatant
        ))
        setCombatants(updatedCombatants);
    }
    return (
        <div>
            <h2>Set Up Combatants</h2>
            {combatants.map((combatant, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={combatant.name}
                    onChange={(e) => updateCombatant(index, 'name', e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <label>Initiative: </label>
                <input
                    type="number"
                    placeholder="Initiative"
                    value={combatant.initiative}
                    onChange={(e) => updateCombatant(index, 'initiative', Number(e.target.value))}
                    style={{ marginRight: '10px', width: '80px' }}
                />
                {combatant.useHealth && !combatant.isPC && (
                    <>
                        <label>Starting Health: </label>
                        <input
                            type="number"
                            placeholder="HP"
                            value={combatant.hp}
                            onChange={(e) => updateCombatant(index, 'hp', Number(e.target.value))}
                            style={{ marginRight: '10px', width: '80px' }}
                        />
                        <label>Max Health: </label>
                        <input
                            type="number"
                            placeholder="Max HP"
                            value={combatant.maxHp}
                            onChange={(e) => updateCombatant(index, 'maxHp', Number(e.target.value))}
                            style={{ marginRight: '10px', width: '80px' }}
                        />
                    </>
                )}
                {/* <button onClick={() => updateCombatant(index, 'useHealth', !combatant.useHealth)}>Toggle Health</button> */}
                <button onClick={() => removeCombatant(index)} style={{ marginLeft: '10px' }}>Remove</button>
                <button onClick={() => dupeCombatant(index)} style={{ marginLeft: '10px' }}>Duplicate</button>
                <button onClick={() => handleAddtoLibrary(index)} style={{ marginLeft: '10px' }}>Add to Library</button>

                </div>
            ))}
            <button onClick={() => addCombatant(false)}>Add NPC</button>
            <button onClick={() => setShowMonsterDrawer(true)}>Add NPC with Statblock</button>
            <button onClick={() => addCombatant(true)}>Add PC</button>
            <button onClick={npcInitiativeRoll}>Roll Initiative for NPCs</button>
            <button onClick={handleStart} disabled={combatants.length === 0}>
                Start Encounter
            </button>
            <div>
                <h3>Combatant Library</h3>
                {libraryCombatants.map((combatant, index) => (
                <div key={index}>
                    <div className='library-index'> 
                        <p>{combatant.name}</p>
                        <button onClick={() => addCombatantFromLibrary(combatant)}>Add to Encounter</button>
                        <button onClick={() => handleRemoveFromLibrary(index)}>Remove From Library</button>
                    </div>
                </div>
                ))}
            </div>
            <div>
            </div>
            {showMonsterDrawer && (
                <MonsterDrawer
                monsters={monsters}
                addMonster={addMonster}
                closeDrawer={() => setShowMonsterDrawer(false)}
                />
            )}
        </div>
    );
};

export default PreCombatSetup;
