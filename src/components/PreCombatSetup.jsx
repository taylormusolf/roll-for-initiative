import React, { useState, useContext, useEffect } from 'react';
import { generateRandomNumber } from '../util/random';
import { useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import MonsterDrawer from './MonsterDrawer';
import monsters from '../assets/data/monsters.json'
import './PreCombatSetup.scss'

const PreCombatSetup = ({ combatants, setCombatants, setIsPreCombat, addCombatant, removeCombatant, dupeCombatant, handleAddtoLibrary, libraryCombatants, handleRemoveFromLibrary, round, currentTurn }) => {
    const { id } = useParams();
    const { updateEncounter} = useContext(EncounterContext);
    const [showMonsterDrawer, setShowMonsterDrawer] = useState(false);
    const [APL, setAPL] = useState(0);
    const [CR, setCR] = useState('');
    const [XP, setXP] = useState(0);

    useEffect(()=> {
        calculateEncounterRating();
    }, [APL, combatants])
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
        updateEncounter(Number(id), sortedCombatants, false, round, currentTurn);
    };
    const npcInitiativeRoll = () => {
        const updatedCombatants = combatants.map((combatant)=> (
            !combatant.isPC ? { ...combatant, 'initiative': generateRandomNumber(20, combatant.perception || 0) } : combatant
        ))
        setCombatants(updatedCombatants);
    }
    const calculateEncounterRating = ()=> {
        let pcCount = 0;
        let xpCount = 0;
        for(const combatant of combatants){
            if(combatant.isPC){
                pcCount++;
            } else {
                const {cr} = combatant;
                console.log(cr)
                switch (cr) {
                    case APL - 4:
                        xpCount += 10;
                        break;
                    case APL - 3:
                        xpCount += 15;
                        break;
                    case APL - 2:
                        xpCount += 20;
                        break;
                    case APL - 1:
                        xpCount += 30;
                        break;
                    case APL:
                        xpCount += 40;
                        break;
                    case APL + 1:
                        xpCount += 60;
                        break;
                    case APL + 2:
                        xpCount += 80;
                        break;
                    case APL + 3:
                        xpCount += 120;
                        break;
                    case APL + 4:
                        xpCount += 160;
                        break;
                    default:
                        break;
                }
            }
        }
        const playerAdj = pcCount - 4;
        if(xpCount <= 40 + playerAdj*10){
            setCR('Trivial');
        } else if(xpCount <= 60 + playerAdj*20){
            setCR('Low');
        } else if(xpCount <= 80 + playerAdj*20){
            setCR('Moderate');
        } else if(xpCount <= 120 + playerAdj*30){
            setCR('Severe');
        }else { //160 + playerAdj*40
            setCR('Extreme');
        }
        console.log(xpCount)
        setXP(xpCount);
        // Boss and Lackeys (120 XP): One creature of party level + 2, four creatures of party level – 4
        // Boss and Lieutenant (120 XP): One creature of party level + 2, one creature of party level
        // Elite Enemies (120 XP): Three creatures of party level
        // Lieutenant and Lackeys (80 XP): One creature of party level, four creatures of party level – 4
        // Mated Pair (80 XP): Two creatures of party level
        // Troop (80 XP): One creature of party level, two creatures of party level – 2
        // Mook Squad (60 XP): Six creatures of party level – 4

    }
    return (
        <div>
            <label>APL</label>
            <input type="text" placeholder="APL" 
                value={APL}
                onChange={(e) => setAPL(e.target.value)}
                style={{ marginRight: '10px' }}
            />
            <label>CR </label>
            {CR}
            <label>XP </label>
            {XP}
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
                {!combatant.isPC && `(CR: ${combatant.cr})`}
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
