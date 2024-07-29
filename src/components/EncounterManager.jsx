import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EncounterContext } from '../context/EncounterContext';

const EncounterManager = () => {
    const { encounters, addEncounter, deleteEncounter } = useContext(EncounterContext);
    useEffect(()=> {

    }, [])

    return (
        <div>
        <h1>Encounter Manager</h1>
        <button onClick={addEncounter}>Create New Encounter</button>
        <div>
            <h2>Existing Encounters</h2>
            {encounters.map(encounter => (
            <div key={encounter.id}>
                <Link to={`/encounter/${encounter.id}`}>Encounter {encounter.id}</Link>
                <button onClick={() => deleteEncounter(encounter.id)}>Delete</button>
            </div>
            ))}
        </div>
        </div>
    );
};

export default EncounterManager;
