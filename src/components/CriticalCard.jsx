import { useState, useContext } from "react";
import { CriticalContext } from "../context/CriticalContext";
import { generateRandomNumber } from '../util/random';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CriticalCard(){
    //history of crits
    const {critHistory, addCritToHistory, clearCriticalHistory} = useContext(CriticalContext);
    const [showCriticalModal, setShowCriticalModal] = useState(false);
    const [critCard, setCritCard] = useState(null)

    console.log(critCard);
    const handleCrit= async(type) => { //critical-fumble-deck-1.json or critical-hit-deck-1.json
        const num = generateRandomNumber(53);
        const res = await fetch(`https://taylormusolf.com/pf2e/packs/criticaldeck/critical-${type}-deck-${num}.json`)
        const card = await res.json();
        setCritCard(card.pages[0].text.content);
    }

    return(
        <>
            <button onClick={() =>setShowCriticalModal(true)}>Crits</button>
            <Modal
                isOpen={showCriticalModal}
                onRequestClose={() => setShowCriticalModal(false)}
                contentLabel="critical-modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div>
                    <div className="card">
                        <div className="card-generation">
                            <button onClick={()=> handleCrit('hit')}>Critical Hit</button>
                            <button onClick={()=> handleCrit('fumble')}>Fumble</button>
                        </div>
                        <div className="card-display"></div>
                    </div>
                    <div className="card-history">
                        {critHistory.map(crit => (
                            <div>

                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )



}

export default CriticalCard;