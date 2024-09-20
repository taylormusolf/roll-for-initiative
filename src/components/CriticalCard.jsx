import { useState, useContext } from "react";
import { CriticalContext } from "../context/CriticalContext";
import { generateRandomNumber } from '../util/random';
import moment from 'moment';
import Modal from 'react-modal';
import { replaceReferences } from '../util/parse';
import './CriticalCard.scss'

Modal.setAppElement('#root');

function CriticalCard(){
    //history of crits
    const {critHistory, addCritToHistory, clearCritHistory} = useContext(CriticalContext);
    const [showCriticalModal, setShowCriticalModal] = useState(false);
    const [critCard, setCritCard] = useState(null)

    const handleCrit= async(type) => { //critical-fumble-deck-1.json or critical-hit-deck-1.json
        const num = generateRandomNumber(53);
        const res = await fetch(`https://taylormusolf.com/pf2e/packs/criticaldeck/critical-${type}-deck-${num}.json`)
        const card = await res.json();
        let parsedCard = await(replaceReferences(card.pages[0].text.content))
        addCritToHistory({type, date: Date.now(), card: parsedCard, num})
        setCritCard(parsedCard);
    }
    const handleClearHistory = () => {
        clearCritHistory()
        setCritCard(null);
    }

    return(
        <>
            <button className='crit-button' onClick={() =>setShowCriticalModal(true)}>Crits</button>
            <Modal
                isOpen={showCriticalModal}
                onRequestClose={() => setShowCriticalModal(false)}
                contentLabel="critical-modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="critcard-container">
                    <div className="critcard">
                        <div className="critcard-generation">
                            <button onClick={()=> handleCrit('hit')}>Critical Hit</button>
                            <button onClick={()=> handleCrit('fumble')}>Fumble</button>
                        </div>
                        <div className="critcard-display">
                            <div dangerouslySetInnerHTML={{__html: critCard}}/>
                        </div>
                    </div>
                    <div className="critcard-history">
                        <button onClick={handleClearHistory}>Clear History</button>
                        {critHistory.map((crit, i) => (
                            <div className='critcard-history-item' key={i} onClick={()=> setCritCard(crit.card)}>
                                <div>{moment(crit.date).format("HH:mm:ss YYYY-MMM-DD")}</div>
                                <div>{crit.type} #{crit.num}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    )



}

export default CriticalCard;