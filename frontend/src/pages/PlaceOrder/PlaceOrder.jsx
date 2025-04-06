import { useContext, useState, useEffect } from "react";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value || "" }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    // Prepare items array with required fields
    let orderItems = [];
    for (const itemId in cartItems) {
      const foodItem = food_list.find((item) => item._id === itemId);
      if (foodItem && cartItems[itemId] > 0) {
        orderItems.push({
          _id: foodItem._id,
          name: foodItem.name,
          price: foodItem.price,
          quantity: cartItems[itemId]
        });
      }
    }

    if (orderItems.length === 0) {
      alert("Your cart is empty! Please add items to your cart before placing an order.");
      return;
    }

    // Decode token to get user ID
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded.id;

    // Calculate total amount including delivery fee
    const subtotal = getTotalCartAmount();
    const deliveryFee = 200; // ₹2 in paise
    const totalAmount = subtotal + deliveryFee;

    // Format order data for backend
    let orderData = {
      userId,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zipcode: data.zipcode,
        country: data.country,
        contact: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone
        }
      },
      items: orderItems,
      amount: totalAmount
    };

    try {
      let response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Order placement error:", {
        error: error.response?.data || error.message,
        requestData: orderData
      });
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
          required
        />
      </div>

      <div className="place-order-right">
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
              <p>₹200</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount() + 200}</p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
