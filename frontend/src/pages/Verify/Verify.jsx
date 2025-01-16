
import './Verify.css';
import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react'; // Import `useContext`
import { StoreContext } from '../../StoreContext'; // Ensure StoreContext is imported from the correct location

const Verify = () => {
  const [searchParams] = useSearchParams(); // `setSearchParams` is removed if not used
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  // Ensure StoreContext is defined and properly imported

  // eslint-disable-next-line no-unused-vars
const { url } = useContext(StoreContext);

  

  console.log(success, orderId);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
