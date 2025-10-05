import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [food_list, setFoodList] = useState([]);
  const url = "https://food-delivery-backend-wlo9.onrender.com";

  // Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data if token is available
  const loadCartData = async (token) => {
    if (!token) return;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const response = await axios.post(
        `${url}/api/cart/get`,
        { userId: decoded.id },
        { headers: { token } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) await loadCartData(token);
    };
    loadData();
  }, [token]);

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        await axios.post(
          `${url}/api/cart/add`,
          { itemId, userId: decoded.id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId, userId: decoded.id },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () =>
    Object.entries(cartItems).reduce((total, [itemId, qty]) => {
      const itemInfo = food_list.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * qty : total;
    }, 0);

  // Context value
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
