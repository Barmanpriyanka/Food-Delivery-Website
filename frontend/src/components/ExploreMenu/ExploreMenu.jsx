import React from 'react' // eslint-disable-line no-unused-vars
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets' 
const ExploreMenu = () => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delecturing array of dishes,Our mission is to </p>
      <div className="div explore-menu-list">
        {menu_list.map(()=>{
          return(
            <div key={index} className='explore-menu-list-item'>
              <img src={item.menu_image} alt=""></img>
              <p>{items.menu_name}</p>
            </div>
          )
            
          
        })}
      </div>
    </div>
  )
}

export default ExploreMenu
