import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [showSearch, setShowSearch] = useState(false);
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate=useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("token");
        setToken("");
       navigate("/")
    }

    return (
        <div className='navbar'>
            <Link to='/'><img src={assets.logo} alt="Logo" className="logo" /></Link> 
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a>
                <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
            </ul>
            <div className="navbar-right">
                <img src={assets.search_icon} alt="Search Icon" className="search-icon" onClick={() => setShowSearch(!showSearch)} />
                {showSearch && (
                    <input type="text" placeholder="Search for food..." className="search-input" />
                )}
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Basket Icon" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? (
                    <button onClick={() => setShowLogin(true)} className="navbar-button">Sign In</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="Profile Icon" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={()=>{ 
                                navigate('/myorders')
                            }}><img src={assets.bag_icon} alt="Bag Icon" /><p>Orders</p></li>
                            <hr />
                            <li onClick={handleLogout}><img src={assets.logout_icon} alt="Logout Icon" /><p>Logout</p></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// Define PropTypes for Navbar component
Navbar.propTypes = {
    setShowLogin: PropTypes.func.isRequired, // setShowLogin should be a required function
};

export default Navbar;
