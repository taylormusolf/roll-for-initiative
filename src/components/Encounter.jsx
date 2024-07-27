import React, { useMemo, useState,} from "react";
import Combatant from "./Combatant";
function Encounter(){
    const [round, setRound] = useState(1); //encounter round
    const [currentIdx, setCurrentIdx] = useState(0); //current initiative in round


    const players = [
        {name: "Taylor", maxHP: 100, isPC: true, currentHP: 100, int: 20}, 
        {name: "Karisa", maxHP: 50, isPC: true, currentHP: 50, int: 21}, 
        {name: "Bugbear", maxHP: 200, isPC: false, currentHP: 50, int: 5}
    ];
    players.sort((a, b)=> b.int - a.int);
    players.forEach((combatant, i) =>{
       combatant.ord = i;
       combatant.id = i; 
    } );
    const playerObj = Object.assign({}, players)
    // const memoizedCombatants = combatants.map((combatant, i) => <Combatant key={i} ord={i} combatantName={combatant.name}/>);
    const [combatantCount, setCombatantCount] = useState(players.length);
    const [combatants, setCombatants] = useState(playerObj);
    const [delayedCombatants, setDelayedCombatants] = useState({});

    function handleNext(){
        let newIdx = currentIdx + 1;
        if(newIdx >= combatantCount){
            newIdx = 0;
            setRound(round + 1);
        }
        setCurrentIdx(newIdx);
    }

    function handlePrevious(){
        let newIdx = currentIdx - 1;
        if(newIdx < 0){
            newIdx = combatantCount - 1;
            setRound(round - 1);
        }
        setCurrentIdx(newIdx);
    }
    function handleDelay(ord, id){
        if(ord === combatantCount - 1){
            setRound(round + 1);
            setCurrentIdx(0);
        }
        setCombatantCount(combatantCount - 1);
        setDelayedCombatants({...delayedCombatants, [id]: combatants[id]});
        // setStateCombatants((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1)));
        const otherCombatants = Object.assign({}, combatants);
        delete otherCombatants[id];
        setCombatants(otherCombatants)
    }
    function handleUndelay(id){
        setCombatantCount(combatantCount + 1);
        setCombatants({...combatants, [id]: {...combatants[id], ord: }}) //set delay to false
        // setStateCombatants((prev) => prev.slice(0, currentIdx).concat(delayedCombatants[idx], prev.slice(currentIdx)));
        // setDelayedCombatants((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1))); //remove from delayed
        const otherDelayedCombatants = Object.assign({}, delayedCombatants);
        delete otherDelayedCombatants[id];
        setDelayedCombatants(otherDelayedCombatants);
    }
    function handleUp(idx){
        // setStateCombatants((prev) => prev.slice(0, idx - 1).concat(stateCombatants[idx], stateCombatants[idx - 1], prev.slice(idx + 1)));
    }
    function handleDown(idx){
        // setStateCombatants((prev) => prev.slice(0, idx).concat(stateCombatants[idx + 1], stateCombatants[idx], prev.slice(idx + 2)));
    }
    console.log(combatants)
    console.log(delayedCombatants)
    return(
        <>
            {Object.values(delayedCombatants).map((combatant, i)=> {
                console.log(combatant)
                return(
                    <div key={combatant.id}>
                        <Combatant key={combatant.id} combatant={combatant}/>
                        <button onClick={() => handleUndelay(combatant.id)}>Act Now?</button>
                    </div>
                )
            })}
            <h1>Round {round}</h1>
            {Object.values(combatants).filter((combatant)=> !combatant.delay).map((combatant, i) => {
                const isCurrent = currentIdx === i
                return(
                    <div key={combatant.id}>
                        {isCurrent && <strong>{'--> '}</strong>}
                        <Combatant key={combatant.id} combatant={combatant} combatants={combatants} setCombatants={setCombatants}/>
                        <button onClick={() => handleUp(i)} disabled={i === 0}>Up</button>
                        <button onClick={() => handleDown(i)} disabled={i === combatantCount - 1}>Down</button>
                        {isCurrent && <button onClick={() => handleDelay(combatant.ord, combatant.id)}>Delay?</button>}
                    </div>
                ) 
            })}
            <button onClick={handlePrevious} disabled={round === 1 && currentIdx === 0} >Previous</button>
            <button onClick={handleNext}>Next</button>
        </>
    )

}


export default Encounter;