import React, { useMemo, useState,} from "react";
import Combatant from "./Combatant";
function Encounter(){
    const [round, setRound] = useState(1); //encounter round
    const [currentIdx, setCurrentIdx] = useState(0); //current initiative in round
    const combatants = [{name: "Taylor", maxHP: 100, isPC: true, currentHP: 100}, {name: "Karisa", maxHP: 50, isPC: true, currentHP: 50}, {name: "Bugbear", maxHP: 200, isPC: false, currentHP: 50}];
    const memoizedCombatants = combatants.map((combatant, i) => <Combatant key={i} combatantName={combatant.name}/>);

    const [stateCombatants, setStateCombatants] = useState(memoizedCombatants);
    const [delayedCombatants, setDelayedCombatants] = useState([]);


    function handleNext(){
        let newIdx = currentIdx + 1;
        if(newIdx >= stateCombatants.length){
            newIdx = 0;
            setRound(round + 1);
        }
        setCurrentIdx(newIdx);
    }

    function handlePrevious(){
        let newIdx = currentIdx - 1;
        if(newIdx < 0){
            newIdx = stateCombatants.length - 1;
            setRound(round - 1);
        }
        setCurrentIdx(newIdx);
    }
    function handleDelay(idx){
        if(idx === stateCombatants.length - 1){
            setRound(round + 1);
            setCurrentIdx(0);
        }
        setDelayedCombatants((prev) =>[...prev, stateCombatants[idx]]);
        setStateCombatants((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1)));
    }
    function handleUndelay(idx){
        setStateCombatants((prev) => prev.slice(0, currentIdx).concat(delayedCombatants[idx], prev.slice(currentIdx)));
        setDelayedCombatants((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1))); //remove from delayed
    }
    function handleUp(idx){
        setStateCombatants((prev) => prev.slice(0, idx - 1).concat(stateCombatants[idx], stateCombatants[idx - 1], prev.slice(idx + 1)));
    }
    function handleDown(idx){
        setStateCombatants((prev) => prev.slice(0, idx).concat(stateCombatants[idx + 1], stateCombatants[idx], prev.slice(idx + 2)));
    }

    return(
        <>
            {delayedCombatants.map((delayedC, i)=> {
                return(
                    <div key={i}>
                        {delayedC}
                        <button onClick={() => handleUndelay(i)}>Act Now?</button>
                    </div>
                )
            })}
            <h1>Round {round}</h1>
            {stateCombatants.map((combatant, i) => {
                const isCurrent = currentIdx === i
                return(
                    <div key={i}>
                        {isCurrent && <strong>{'--> '}</strong>}
                        {combatant}
                        <button onClick={() => handleUp(i)} disabled={i === 0}>Up</button>
                        <button onClick={() => handleDown(i)} disabled={i === stateCombatants.length - 1}>Down</button>
                        {isCurrent && <button onClick={() => handleDelay(i)}>Delay?</button>}
                    </div>
                ) 
            })}
            <button onClick={handlePrevious} disabled={round === 1 && currentIdx === 0} >Previous</button>
            <button onClick={handleNext}>Next</button>
        </>
    )

}


export default Encounter;