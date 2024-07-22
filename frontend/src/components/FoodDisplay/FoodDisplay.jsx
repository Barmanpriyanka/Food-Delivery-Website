import React, { useContext } from 'react';// eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    const filteredFoodList = category 
        ? food_list.filter(food => food.category === category) 
        : food_list;

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            {filteredFoodList.map(food => (
                <div key={food.id}>{food.name}</div>
            ))}
        </div>
    );
};

FoodDisplay.propTypes = {
    category: PropTypes.string
};

export default FoodDisplay;
