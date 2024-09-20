import CriticalCard from './CriticalCard';

function Navbar() {
    
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
            <div className="logo">Roll for Initiative</div>
            <CriticalCard />
        </div>
    )


}




export default Navbar;