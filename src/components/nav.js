import logo from '../assets/shield-2-xxl.png';
import './nav.css';

const NavComponent = () => {
    return (
        <nav className="row">
            <div className="col-3 logo">
                <img src={logo} alt="Stock Shield"></img>
            </div>
            <div className="col">
                <h1>Upcoming Events Viewer</h1>
            </div>
        </nav>
    );
}

export default NavComponent;