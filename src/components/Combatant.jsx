import { useState } from "react";


function Combatant({name, isCurrent, isPC}){

    const [hp, setHp] = useState(100);

    return (
        <>
            <div>
                {isCurrent && <strong>{'--> '}</strong>}
                <span>{name}</span>
                <span> {hp} HP</span>
                <span onClick={()=> setHp(hp + 1)}>+</span>
                <span onClick={()=> setHp(hp - 1)}>-</span>
            </div>
        </>
    )
}



export default Combatant;