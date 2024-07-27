import React from 'react';

const Combatant = ({ id, name, initiative, health, isCurrent, delayTurn, moveUp, moveDown, updateHealth, updateName, returnToOrder, isDelayed }) => {
  return (
    <div style={{ border: isCurrent ? '2px solid green' : '1px solid black', margin: '10px' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => updateName(id, e.target.value)}
        style={{ fontWeight: isCurrent ? 'bold' : 'normal' }}
      />
      <p>Initiative: {initiative}</p>
      <p>
        Health: <input type="number" value={health} onChange={(e) => updateHealth(id, Number(e.target.value))} />
      </p>
      {!isDelayed && (
        <>
          <button onClick={() => moveUp(id)}>Move Up</button>
          <button onClick={() => moveDown(id)}>Move Down</button>
          <button onClick={() => delayTurn(id)}>Delay</button>
        </>
      )}
      {isDelayed && <button onClick={() => returnToOrder(id)}>Return to Order</button>}
    </div>
  );
};

export default Combatant;

