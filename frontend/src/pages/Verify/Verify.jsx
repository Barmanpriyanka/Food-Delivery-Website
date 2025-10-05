import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success") === "true"; // Convert to boolean
  const orderId = searchParams.get("orderId");

  const { url, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = useCallback(async () => {
    if (!orderId) {
      console.error("Order ID is missing.");
      navigate("/");
      return;
    }

    try {
      console.log("Verifying payment for Order ID:", orderId, "Success:", success);

      const response = await axios.post(`${url}/api/order/verify`, 
        { success, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data); // Debugging response

      if (response.data.success) {
        console.log("Payment successful. Navigating to /thankyou...");
        // Refresh token from localStorage in case it was updated
        const updatedToken = localStorage.getItem("token");
        if (updatedToken) {
          setToken(updatedToken);
        }
        navigate("/thankyou");
      } else {
        console.log("Payment failed. Navigating to /...");
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      navigate("/");
    }
  }, [url, navigate, success, orderId, token]);

  useEffect(() => {
    console.log("Order ID:", orderId); // Debug log
    if (orderId) {
      verifyPayment();
    }
  }, [verifyPayment, orderId]);

  return (
    <div className="verify">
      <h2>Verifying Payment...</h2>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
