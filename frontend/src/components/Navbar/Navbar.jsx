import React,{useState} from 'react' // eslint-disable-line no-unused-vars
import './Navbar.css'
import { assets } from '../../assets/assets'  // eslint-disable-line no-unused-vars
const Navbar = () => {
    const [menu,setMenu] = useState("menu"); // eslint-disable-line no-unused-vars
    
  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo"/>
        <ul className="navbar-menu">
            <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>home </li>
            <li onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>menu</li>
            <li onClick={() =>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>mobile-app</li>
            <li onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>contact us</li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt=""></img>
            <div className="navbar-search-icon">
                <img src={assets.basket_icon} alt=""></img>
                <div className="dot"></div>
            </div>
            <button>Sign In</button>
        </div>
        </div>
        
  )
}

export default Navbar