import { useContext, useState } from 'react'; // Import only useState
import PropTypes from 'prop-types'; // Import PropTypes
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("menu");
    const {getTotalCartAmount} =useContext(StoreContext);

    return (
        <div className='navbar'>
           <Link to='/'><img src={assets.logo} alt="Logo" className="logo" /></Link> 
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
                <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="Search Icon" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link>
                    <div className={getTotalCartAmount()===0?"":"dot"}></div>
                </div>
                <button onClick={() => setShowLogin(true)} className="navbar-button">Sign In</button>
            </div>
        </div>
    );
};

// Define PropTypes for Navbar component
Navbar.propTypes = {
    setShowLogin: PropTypes.func.isRequired, // setShowLogin should be a required function
};

export default Navbar;
