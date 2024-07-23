import { useState } from "react";
import Combatant from "./Combatant";
function Encounter(){

    const [round, setRound] = useState(1); //encounter round
    const [currentIdx, setCurrentIdx] = useState(0); //current initiative in round
    const [combatants, setCombatants] = useState(["Taylor", "Kyle", "Karisa", "Jane", "Josh"]); //array of pcs and npcs
    const [delayedCombatants, setDelayedCombatants] = useState([]);


    function handleNext(){
        let newIdx = currentIdx + 1;
        if(newIdx >= combatants.length){
            newIdx = 0;
            setRound(round + 1);
        }
        setCurrentIdx(newIdx);
    }

    function handlePrevious(){
        let newIdx = currentIdx - 1;
        if(newIdx < 0){
            newIdx = combatants.length - 1;
            setRound(round - 1);
        }
        setCurrentIdx(newIdx);
    }

    return(
        <>
            <h1>Round {round}</h1>
            {combatants.map((combatant, i) => {
                const isCurrent = currentIdx === i
        
                //arrow pointing up
                //arrow pointing down
                //delay button
                return <Combatant key={i} isCurrent={isCurrent} name={combatant} isPC={false}/>
            })}
            <button onClick={handlePrevious} disabled={round === 1 && currentIdx === 0} >Previous</button>
            <button onClick={handleNext}>Next</button>
        </>
    )

}


export default Encounter;