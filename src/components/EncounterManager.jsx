import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';

const EncounterManager = () => {
    const { encounters, addEncounter, deleteEncounter } = useContext(EncounterContext);
    const [newEncounterName, setNewEncounterName] = useState('');

    const handleAddEncounter = () => {
        addEncounter(newEncounterName);
        setNewEncounterName('');
    };
    
    return (
        <div>
        <h1>Encounter Manager</h1>
        <input
            type="text"
            placeholder="Enter encounter name"
            value={newEncounterName}
            onChange={(e) => setNewEncounterName(e.target.value)}
        />
        <button onClick={handleAddEncounter}>Create New Encounter</button>
        <div>
            <h2>Existing Encounters</h2>
            {encounters.map(encounter => (
            <div key={encounter.id}>
                <Link to={`/encounter/${encounter.id}`}>{encounter.name}</Link>
                <button onClick={() => deleteEncounter(encounter.id)}>Delete</button>
            </div>
            ))}
        </div>
        </div>
    );
};

export default EncounterManager;
