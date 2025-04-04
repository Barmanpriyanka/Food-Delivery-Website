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
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log("Orders API Response:", response.data); // Debug log
            
            if (response.data.success && Array.isArray(response.data.orders)) {
                setData(response.data.orders);
            } else if (response.data.message) {
                setError(response.data.message);
            } else {
                setError("Received unexpected response format");
                console.warn("Unexpected response format:", response.data);
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
    }, [fetchOrders]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Date not available';
            }
            const options = { 
                day: 'numeric',
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            return date.toLocaleString('en-IN', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date not available';
        }
    };

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            {loading ? (
                <p>Loading your orders...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : data.length > 0 ? (
                <div className="container">
                    {data.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <img src={assets.parcel_icon} alt="Parcel Icon" />
                                <div>
                                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                    <p>Placed on: {formatDate(order.createdAt)}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Total: ₹{order.amount}</p>
                                </div>
                            </div>
                            <div className="order-items">
                                <h4>Items:</h4>
                                <ul>
                                    {order.items.map((item) => (
                                        <li key={`${item._id}-${item.name}-${item.quantity}`}>
                                            {item.name} x {item.quantity} (₹{item.price * item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default MyOrders;
