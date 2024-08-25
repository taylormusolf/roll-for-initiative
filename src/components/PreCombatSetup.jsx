import React, { useState, useContext, useEffect } from 'react';
import { generateRandomNumber } from '../util/random';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import MonsterDrawer from './MonsterDrawer';
import monsters from '../assets/data/monsters.json'
import './PreCombatSetup.scss'

Modal.setAppElement('#root');

const combatantMenuStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '10px',
      width: '300px',
      backgroundColor: 'rgb(51,51,51)',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
  };

const PreCombatSetup = ({ combatants, setCombatants, setIsPreCombat, addCombatant, removeCombatant, dupeCombatant, handleAddtoLibrary, libraryCombatants, handleRemoveFromLibrary, round, currentTurn, APL, setAPL, CR, setCR, XP, setXP }) => {
    const { id } = useParams();
    const { updateEncounter} = useContext(EncounterContext);
    const [showMonsterDrawer, setShowMonsterDrawer] = useState(false);
    const [showCombatantMenu, setShowCombatantMenu] = useState(false);
    const [selectedCombatant, setSelectedCombatant] = useState(null);
   
    const [warning, setWarning] = useState(false);

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
        setCombatants([...combatants, combatant]);
    };
    const addMonster = (monster) => {
        setCombatants([...combatants, monster]);
    };
    const handleCombatantMenu = (combatant) => {
        setSelectedCombatant(combatant);
        setShowCombatantMenu(true);
    }

    const handleStart = () => {
        const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
        setIsPreCombat(false);
        setCombatants(sortedCombatants);
        updateEncounter(Number(id), sortedCombatants, false, round, currentTurn, APL);
    };
    const handleAPLSave = () => {
        updateEncounter(Number(id), combatants, true, round, currentTurn, APL)
    }
    const npcInitiativeRoll = () => {
        const updatedCombatants = combatants.map((combatant)=> (
            !combatant.isPC ? { ...combatant, 'initiative': generateRandomNumber(20, combatant.perception || 0) } : combatant
        ))
        setCombatants(updatedCombatants);
    }
    const calculateEncounterRating = ()=> {
        let pcCount = 0;
        let xpCount = 0;
        let flag = false;
        for(const combatant of combatants){
            if(combatant.isPC){
                pcCount++;
            } else {
                const {cr} = combatant;
                let pAPL = APL ? parseInt(APL) : 0
                switch (cr) {
                    case pAPL - 4:
                        xpCount += 10;
                        break;
                    case pAPL - 3:
                        xpCount += 15;
                        break;
                    case pAPL - 2:
                        xpCount += 20;
                        break;
                    case pAPL - 1:
                        xpCount += 30;
                        break;
                    case pAPL:
                        xpCount += 40;
                        break;
                    case pAPL + 1:
                        xpCount += 60;
                        break;
                    case pAPL + 2:
                        xpCount += 80;
                        break;
                    case pAPL + 3:
                        xpCount += 120;
                        break;
                    case pAPL + 4:
                        xpCount += 160;
                        break;
                    default:
                        if(cr > pAPL + 4){
                            xpCount += 180;
                            flag = true;
                        } else { //less than APL - 40
                            xpCount += 5;
                            flag = true;
                        }
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
        setWarning(flag);
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
        <div className='precombat-container'>
            <div className='precombat-header-container'>
                <div className='precombat-rating-container'>
                    <div className='precombat-rating-apl'>
                        <label>APL</label>
                        <input type="text" placeholder="Average Party Lvl" 
                            value={APL}
                            onChange={(e) => setAPL(e.target.value)}
                        />
                        <button onClick={handleAPLSave}>Save</button>
                    </div>
                    <div className='precombat-rating-cr'>
                        <label>CR </label>
                        <div>{CR}</div>
                    </div>
                    <div className='precombat-rating-xp'>
                        <label>XP </label>
                        <div>{XP}</div>
                    </div>
                </div>
                {!!warning && <div className='precombat-warning'>
                    Enemies are outside of recommended bounds of -4/+4 APL
                </div>}
            </div>
            <div className='precombat-subheader-container'>
                <h2>Set Up Combatants</h2>
                <button onClick={handleStart} disabled={combatants.length === 0}>
                    Start Encounter
                </button>
            </div>

            {combatants.map((combatant, index) => (
                <div key={index} className='precombat-combatant'>
                    <div className='precombat-combatant-name'>
                        <input
                            type="text"
                            placeholder="Name"
                            value={combatant.name}
                            onChange={(e) => updateCombatant(index, 'name', e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <div className='precombat-combatant-cr'>{!combatant.isPC && !!combatant.cr &&`(CR: ${combatant.cr})`}</div>
                        
                    </div>
                    <div className='precombat-combatant-initiative'>
                        <label>Initiative:</label>
                        <input
                            type="number"
                            placeholder="???"
                            value={combatant.initiative}
                            onChange={(e) => updateCombatant(index, 'initiative', Number(e.target.value))}
                            style={{ marginRight: '10px', width: '40px' }}
                        />
                    </div>
                    <button onClick={()=> handleCombatantMenu(combatant)}>Menu</button>
                    <Modal
                        isOpen={showCombatantMenu}
                        onRequestClose={() => setShowCombatantMenu(false)}
                        style={combatantMenuStyles}
                        contentLabel="combatant-menu"
                    >
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
                    </Modal>

                </div>
            ))}
            <button onClick={() => addCombatant(false)}>Add NPC</button>
            <button onClick={() => setShowMonsterDrawer(true)}>Add NPC with Statblock</button>
            <button onClick={() => addCombatant(true)}>Add PC</button>
            <button onClick={npcInitiativeRoll}>Roll Initiative for NPCs</button>
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
