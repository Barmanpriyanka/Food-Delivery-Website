import { useNavigate } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="thank-you">
      <h1>Thank You for Your Order!</h1>
      <p>Your order has been successfully placed and payment has been verified.</p>
      <p>You can now track your order status in My Orders.</p>
      <button onClick={() => navigate('/myorders')} className="check-orders-btn">
        Check My Orders
      </button>
    </div>
  );
};

export default ThankYou;
