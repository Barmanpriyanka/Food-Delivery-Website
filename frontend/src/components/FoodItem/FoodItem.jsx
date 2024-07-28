import { useState } from 'react'; // Only import useState
import PropTypes from 'prop-types';
import './FoodItem.css';
import { assets } from '../../assets/assets';

const FoodItem = ({ name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(0);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={image} alt={name} />
        {!itemCount
          ? <img className='add' onClick={() => setItemCount(prev => prev + 1)} src={assets.add_icon_white} alt="Add item" />
          : <div className='food-item-counter'>
              {/* Counter component or logic here */}
              <button onClick={() => setItemCount(prev => prev - 1)}>-</button>
              <span>{itemCount}</span>
              <button onClick={() => setItemCount(prev => prev + 1)}>+</button>
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating stars" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default FoodItem;
