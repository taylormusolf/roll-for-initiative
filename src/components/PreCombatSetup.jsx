import React, { useState, useContext, useEffect, useRef } from 'react';
import { generateRandomNumber } from '../util/random';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';
import MonsterDrawer from './MonsterDrawer';
import monsters from '../assets/data/monsters.json'
import { generateRandomID } from '../util/random';
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
      borderRadius: '5px',
      width: '300px',
      backgroundColor: 'var(--tan)',
      fontFamily: 'Taroca'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.10)',
    },
  };

const PreCombatSetup = ({ combatants, setCombatants, setIsPreCombat, addCombatant, updateCombatants, dupeCombatants, handleAddtoLibrary, libraryCombatants, handleRemoveFromLibrary, round, currentTurn, APL, setAPL, CR, setCR, XP, setXP }) => {
    const { id } = useParams();
    const { updateEncounter} = useContext(EncounterContext);
    const [showMonsterDrawer, setShowMonsterDrawer] = useState(false);
    const [showCombatantMenu, setShowCombatantMenu] = useState(false);
    const [selectedCombatantMenuIdx, setSelectCombatantMenuIdx] = useState(0);

    const [selectedCombatantIds, setSelectedCombatantIds] = useState([]);
    const [selectedLibraryIds, setSelectedLibraryIds] = useState([]);
    const [selectAll, setSelectAll] = useState(true);

    const checkboxContainerRef = useRef(null);

   
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
    
    const addCombatantsFromLibrary = () => {
        const combatantsToAdd = libraryCombatants.filter(combatant => selectedLibraryIds.includes(combatant.id)).map((comb) => {return {...comb, id: generateRandomID()}});
        setCombatants([...combatants, ...combatantsToAdd]);
    };
    const addMonster = (monster) => {
        setCombatants([...combatants, monster]);
    };

    const handleStart = () => {
        const sortedCombatants = [...combatants].sort((a, b) => b.initiative - a.initiative);
        setIsPreCombat(false);
        setCombatants(sortedCombatants);
        updateEncounter({id: Number(id), combatants: sortedCombatants, isPreCombat: false});
    };
    const handleAPLSave = () => {
        updateEncounter({id: Number(id), APL})
    }
    const handleCombatantCheckboxChange = e => {
        const {value, checked} = e.target;

        if(checked){
            setSelectedCombatantIds((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedCombatantIds((prev) => prev.filter((item) => item !== parseInt(value)));
        }
    }

    const handleLibraryCheckboxChange = e => {
        const {value, checked} = e.target;

        if(checked){
            setSelectedLibraryIds((prev) => [...prev, parseInt(value)]);
        } else {
            setSelectedLibraryIds((prev) => prev.filter((item) => item !== parseInt(value)));
        }
    }

    const handleSelectedCombatantMenuIdx = (index) => {
        setSelectCombatantMenuIdx(index);
        setShowCombatantMenu(true);
    }

    const npcInitiativeRoll = () => {
        const updatedCombatants = combatants.map((combatant)=> (
            !combatant.isPC ? { ...combatant, 'initiative': generateRandomNumber(20, combatant.perception || 0) } : combatant
        ))
        setCombatants(updatedCombatants);
    }
    const handleSelectAll = () => {
        const checkboxes = checkboxContainerRef.current.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = selectAll;
        });
        if(selectAll){
            setSelectedCombatantIds(combatants.map(combatant => Number(combatant.id)));
        }else {
            setSelectedCombatantIds([]);
        }
        setSelectAll(!selectAll);
    };
    const selectedInitiativeRoll = () => {
        const updatedCombatants = combatants.map((combatant)=> (
            selectedCombatantIds.includes(combatant.id) ? { ...combatant, 'initiative': generateRandomNumber(20, combatant.perception || 0) } : combatant
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
                if(cr === undefined) continue;
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
    const calculateXP = cr => {
        let pAPL = APL ? parseInt(APL) : 0;
        switch (cr) {
            case pAPL - 4:
                return  10;
            case pAPL - 3:
                return  15;
            case pAPL - 2:
                return  20;
            case pAPL - 1:
                return  30;
            case pAPL:
                return  40;
            case pAPL + 1:
                return  60;
            case pAPL + 2:
                return  80;
            case pAPL + 3:
                return  120;
            case pAPL + 4:
                return  160;
            default:
                if(cr > pAPL + 4){
                    return  180;
                } else { //less than APL - 40
                    return  5;
                }
        }
    }
    const handleRemoveCombatants = () => {
        const updatedCombatants = combatants.filter(combatant => !selectedCombatantIds.includes(combatant.id));
        updateCombatants(updatedCombatants);
        setSelectedCombatantIds([]);
    }
    const handleMultipleAddToLibrary = () => {
        const combatantsToAdd = combatants.filter(combatant => selectedCombatantIds.includes(combatant.id));
        handleAddtoLibrary(combatantsToAdd);
    }
    const handleDupeCombatants = () => {
        const combatantsToDupe = combatants.filter(combatant => selectedCombatantIds.includes(combatant.id));
        dupeCombatants(combatantsToDupe);
    }

    const handleLibraryRemoval = () => {
        handleRemoveFromLibrary(selectedLibraryIds)
        setSelectedLibraryIds([]);
    }

    return (
        <div className='precombat-container'>
            <div className='precombat-header-container'>
                <div className='precombat-rating-container'>
                    <div className='precombat-rating-apl'>
                        <label>APL:</label>
                        <input type="text" placeholder="Average Party Lvl" 
                            value={APL}
                            onChange={(e) => setAPL(e.target.value)}
                        />
                        <button onClick={handleAPLSave}>Save</button>
                    </div>
                    <div className='precombat-rating-cr'>
                        <label>CR: </label>
                        <div>{CR}</div>
                    </div>
                    <div className='precombat-rating-xp'>
                        <label>Total XP: </label>
                        <div>{XP}</div>
                    </div>
                </div>
                {!!warning && <div className='precombat-warning'>
                    Enemies are outside of recommended bounds of -4/+4 APL
                </div>}
            </div>
            <div className='precombat-subheader-container'>
                <h2>Set Up Combatants</h2>
                <div className='precombat-subheader-buttons'>
                    <button onClick={handleStart} disabled={combatants.length === 0}>
                        Start Encounter
                    </button>
                    {/* <button onClick={npcInitiativeRoll}>Roll Initiative for NPCs</button> */}
                </div>
            </div>
            <div className='precombat-combatant-add-buttons'>
                <button onClick={() => addCombatant(false)}>Add NPC</button>
                <button onClick={() => setShowMonsterDrawer(true)}>Add NPC with Statblock</button>
                <button onClick={() => addCombatant(true)}>Add PC</button>
            </div>
            <div className='precombat-combatant-special-buttons'>
                <button className="blue" onClick={handleSelectAll} style={{ marginLeft: '10px' }}>{selectAll ? 'Select All' : "Unselect All"}</button>
                <button className="blue" onClick={selectedInitiativeRoll} style={{ marginLeft: '10px' }}>Roll Initiative</button>
                <button className="blue" onClick={handleRemoveCombatants} style={{ marginLeft: '10px' }}>Remove</button>
                <button className="blue" onClick={handleDupeCombatants} style={{ marginLeft: '10px' }}>Duplicate</button>
                <button className="blue" onClick={handleMultipleAddToLibrary} style={{ marginLeft: '10px' }}>Add to Library</button>
            </div>
            <div className='precombat-combatant-container' ref={checkboxContainerRef}>

                {!combatants.length ? <div style={{width:'100%', textAlign:'center', margin:'15px'}}>Add Combatants to the Ecounter</div> : combatants.map((combatant, index) => (
                    <div key={combatant.id} className='precombat-combatant'>
                        <div className='precombat-combatant-name'>
                            <div className='precombat-combatant-name-inner'>
                                <input type='checkbox' value={combatant.id} onChange={handleCombatantCheckboxChange}/>
                                <p onClick={()=> handleSelectedCombatantMenuIdx(index)} style={{ marginRight: '10px', color: combatant.isPC ? 'var(--blue)' : 'var(--red)'  }}>{combatant.name.length ? combatant.name : 'Nameless'}</p>
                            </div>
                            
                        </div>
                        <div className='precombat-combatant-initiative'>
                            <label>Initiative{combatant.perception && `(+${combatant.perception})`}:</label>
                            <input
                                type="number"
                                placeholder="???"
                                value={combatant.initiative}
                                onChange={(e) => updateCombatant(index, 'initiative', Number(e.target.value))}
                                style={{ marginRight: '10px', width: '40px' }}
                            />
                        </div>
                        <div>
                            {!combatant.isPC && 
                            <div className='precombat-combatant-stats'>
                                
                                <div className='precombat-combatant-cr'>{combatant.cr !== undefined && `CR: ${combatant.cr}`}</div>
                                <div>{combatant.cr !== undefined && `(XP: ${calculateXP(combatant.cr)})`} </div>

                            </div>
                            }
                        </div>
                        <Modal
                            isOpen={showCombatantMenu}
                            onRequestClose={() => setShowCombatantMenu(false)}
                            style={combatantMenuStyles}
                            contentLabel="combatant-menu"
                        >
                            <div className='combatant-setup-modal'>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={combatants[selectedCombatantMenuIdx]?.name}
                                    onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'name', e.target.value)}
                                />
                                <div>
                                    <label>CR: </label>
                                    <input
                                            type="number"
                                            placeholder="CR"
                                            value={combatants[selectedCombatantMenuIdx]?.cr}
                                            onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'cr', Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label>Perception: </label>
                                    <input
                                            type="number"
                                            placeholder="Perc"
                                            value={combatants[selectedCombatantMenuIdx]?.perception}
                                            onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'perception', Number(e.target.value))}
                                    />
                                </div>
                                {combatants[selectedCombatantMenuIdx]?.useHealth && !combatants[selectedCombatantMenuIdx]?.isPC && (
                                    <>
                                        <div>
                                            <label>Current HP: </label>
                                            <input
                                                type="number"
                                                placeholder="HP"
                                                value={combatants[selectedCombatantMenuIdx]?.hp}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'hp', Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label>Max HP: </label>
                                            <input
                                                type="number"
                                                placeholder="Max HP"
                                                value={combatants[selectedCombatantMenuIdx]?.maxHp}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'maxHp', Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label>Temp HP: </label>
                                            <input
                                                type="number"
                                                placeholder="Temp HP"
                                                value={combatants[selectedCombatantMenuIdx]?.tempHp}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'tempHp', Number(e.target.value))}
                                            />
                                        </div>
                                    </>
                                )}
                                {/* <button onClick={() => updateCombatant(index, 'useHealth', !combatant.useHealth)}>Toggle Health</button> */}
                                {/* {console.log(combatant)} */}
                                <div>
                                    <div>
                                      <label>AC: </label>
                                      <input
                                                type="number"
                                                placeholder="AC"
                                                value={combatants[selectedCombatantMenuIdx]?.ac}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'ac', Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                      <label>Fortitude: </label>
                                      <input
                                                type="number"
                                                placeholder="Fort"
                                                value={combatants[selectedCombatantMenuIdx]?.fortitude.value}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'fortitude', {...combatants[selectedCombatantMenuIdx]?.fortitude, value: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                      <label>Reflex: </label>
                                      <input
                                                type="number"
                                                placeholder="Ref"
                                                value={combatants[selectedCombatantMenuIdx]?.reflex.value}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'reflex', {...combatants[selectedCombatantMenuIdx]?.reflex, value: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                      <label>Will: </label>
                                      <input
                                                type="number"
                                                placeholder="Will"
                                                value={combatants[selectedCombatantMenuIdx]?.will.value}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'will', {...combatants[selectedCombatantMenuIdx]?.will, value: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label>Speed: </label>
                                        <input
                                                type="number"
                                                placeholder="Speed"
                                                value={combatants[selectedCombatantMenuIdx]?.speed.value}
                                                onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'speed', {...combatants[selectedCombatantMenuIdx]?.speed, value: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Notes:</label>
                                        <textarea
                                            type="text"
                                            placeholder="Add combatant notes here"
                                            value={combatants[selectedCombatantMenuIdx]?.notes}
                                            onChange={(e) => updateCombatant(selectedCombatantMenuIdx, 'notes', e.target.value)}
                                        />
                                    </div>

                                    
                                </div>
                            
                            
                            </div>
                            
                        </Modal>

                    </div>
                ))}
            </div>
           
            
            <div className='library-container'>
                <h3>Combatant Library</h3>
                <div className='libary-buttons'>
                    <button onClick={addCombatantsFromLibrary}>Add to Encounter</button>
                    <button onClick={handleLibraryRemoval}>Remove From Library</button>
                </div>
                <div className='library-index'>
                    {libraryCombatants.map((combatant) => (
                    <div key={combatant.id}>
                        <div className='library-index-item'> 
                            <input type='checkbox' value={combatant.id} onChange={handleLibraryCheckboxChange}/>
                            <p style={{color: combatant.isPC ? 'var(--blue)': 'var(--red)'}}>{combatant.name}</p>
                        </div>
                    </div>
                    ))}
                </div>
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
