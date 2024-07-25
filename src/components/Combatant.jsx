import React, { useEffect, useState } from "react";


const Combatant = ({combatantName, isCurrent, isPC, maxHP, currentHP, combatants, setCombatants}) => {
    const [hp, setHp] = useState(100);
    const [maxHp, setMaxHp] = useState(maxHP);
    const [characterName, setCharacterName] = useState(combatantName);
    const [notes, setNotes] = useState('');

    function handleHpIncrease(){
        if(hp + 1 <= maxHp){
            setHp(hp + 1)
        }
    }
    function handleHpDecrease(){
        if(hp - 1 >= 0){
            setHp(hp - 1)
        }
    }
    return (
        <>
            <div>
                {/* <span>{combatantName}</span> */}
                <span><input type="text" value={characterName} onChange={(e) => setCharacterName(e.currentTarget.value)} /></span>
                {/* <span> {hp} HP</span>
                <span onClick={handleHpIncrease}>+ </span>
                <span onClick={handleHpDecrease}>- </span>
                <span>Notes:<input type="textarea" value={notes} onChange={(e)=> setNotes(e.currentTarget.value)} /></span> */}
            </div>
        </>
    )
}



export default Combatant;