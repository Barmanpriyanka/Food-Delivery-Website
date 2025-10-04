import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { url, token } = useContext(StoreContext);

    const fetchOrders = useCallback(async () => {
        if (!token) {
            setError("Please login to view your orders");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `${url}/api/order/userorders`,
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    params: { _: Date.now() } // Prevent caching
                }
            );
            
            if (response.data.success && Array.isArray(response.data.orders)) {
                // Sort orders by date (latest first)
                const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setData(sortedOrders);
                setError(null);
            } else if (response.data.message) {
                setError(response.data.message);
            } else {
                setError("Received unexpected response format");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to fetch orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [url, token]);

    useEffect(() => {
        fetchOrders();
        const intervalId = setInterval(fetchOrders, 30000);
        return () => clearInterval(intervalId);
    }, [fetchOrders]);

    const handleRefresh = () => fetchOrders();

    return (
        <div className="my-orders">
            <div className="my-orders-header">
                <h2>My Orders</h2>
                <button 
                    onClick={handleRefresh}
                    disabled={loading}
                    className="refresh-btn"
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-orders'>
                        <img src={assets.parcel_icon} alt=""/>
                        <p>{order.items.map((item, i) => (
                            i === order.items.length - 1 
                            ? `${item.name} x ${item.quantity}` 
                            : `${item.name} x ${item.quantity}, `
                        ))}</p>
                        <p>${order.amount}.00</p>
                        <p>Items: {order.items.length}</p>
                        <p><b>{order.status}</b></p>
                        <button>Track Order</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
