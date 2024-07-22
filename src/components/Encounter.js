function Encounter(){

    const [round, setRound] = useState(1); //encounter round
    const [currentIdx, setCurrentIdx] = useState(0); //current initiative in round
    const [combatants, setCombatants] = useState(["Taylor", "Kyle"]); //array of pcs and npcs
    const [delayedCombatants, setDelayedCombatants] = useState([]);

    return(
        <>
            <h1>Round {round}</h1>
            {combatants.map((combatant, i) => {
                if(currentIdx === i){
                    //arrow pointing to line
                }
                //arrow pointing up
                //arrow pointing down
                //delay button
                return combatant
            })}
            <button>Previous</button>
            <button>Next</button>
        </>
    )

}


export default Encounter;