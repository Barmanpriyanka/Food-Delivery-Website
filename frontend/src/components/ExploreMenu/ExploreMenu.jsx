import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {



  
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable array of dishes, our mission is to provide delightful culinary experiences.</p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div 
              key={index} 
              className='explore-menu-list-item' 
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            >
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
}

ExploreMenu.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired
};

export default ExploreMenu;
