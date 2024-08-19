import React, { useState, useContext, useEffect } from 'react';
import { generateRandomNumber } from '../util/random';
import { useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import { CombatantLibraryContext } from '../context/CombatantLibraryContext';
import MonsterDrawer from './MonsterDrawer';
import monsters from '../assets/data/monsters.json'

const PreCombatSetup = ({ combatants, setCombatants, setIsPreCombat, addCombatant, removeCombatant, dupeCombatant }) => {
    const { id } = useParams();
    const { library } = useContext(CombatantLibraryContext);
    const { updateEncounter} = useContext(EncounterContext);
    const [showMonsterDrawer, setShowMonsterDrawer] = useState(false);


    const updateCombatant = (index, key, value) => {
        const updatedCombatants = combatants.map((combatant, i) =>
        i === index ? { ...combatant, [key]: value } : combatant
        );
        setCombatants(updatedCombatants);
    };
    
    const addCombatantFromLibrary = (combatant) => {
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
                {/* <button onClick={()=> updateCombatant(index, 'initiative', generateRandomNumber())}>Rand</button> */}
                {combatant.useHealth && (
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
                <button onClick={() => updateCombatant(index, 'useHealth', !combatant.useHealth)}>Toggle Health</button>
                <button onClick={() => removeCombatant(index)} style={{ marginLeft: '10px' }}>Remove</button>
                <button onClick={() => dupeCombatant(index)} style={{ marginLeft: '10px' }}>Duplicate</button>

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
                <h3>Add from Library</h3>
                {library.map((combatant, index) => (
                <div key={index}>
                    <p>{combatant.name}</p>
                    <button onClick={() => addCombatantFromLibrary(combatant)}>Add to Encounter</button>
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
