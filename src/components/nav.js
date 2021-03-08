import logo from '../assets/shield-2-xxl.png';
import './nav.css';

/**
 * Component for top Nav bar
 */
const NavComponent = () => {
    return (
        <nav className="row">
            <div className="col-4 col-lg-4 col-xl-5 logo">
                <img src={logo} alt="Stock Shield"></img>
            </div>
            <div className="col title">
                <h2>Upcoming Events Viewer</h2>
            </div>
        </nav>
    );
}

export default NavComponent;