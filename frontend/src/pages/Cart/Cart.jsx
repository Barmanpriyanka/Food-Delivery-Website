import { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart ,getTotalCartAmount,url} = useContext(StoreContext);
  const navigate=useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>ID</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            const total = item.price * cartItems[item._id];
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt={item.name} />
                  <p>{item.name}</p>
                  <p>₹{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹{total}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount()===0?0:getTotalCartAmount()+2}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
           <div>
            <p>If you have a promo code,enter it here </p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
