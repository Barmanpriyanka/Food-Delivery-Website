import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const [data, setData] = useState([]);
    const { url, token } = useContext(StoreContext);

    const fetchOrders = useCallback(async () => {
        if (!token) {
            console.log("Token found:", token); // Added logging to verify token
            console.error("No token found. User is not authorized."); 



            return;
        }

        try {
const response = await axios.get(

                `${url}/api/order/userorders`, 

                { headers: { Authorization: `Bearer ${token}` } } // ✅ Correct token format
            );
            console.log("API Response:", response.data); // Debugging log
            if (response.data && response.data.data && response.data.success) {
                setData(response.data.data);
            } else {
                console.error("Unexpected API response:", response.data); // Debugging log for unexpected response
                console.log("Full response:", response); // Log the full response for debugging
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [url, token]); // ✅ Correct dependency array

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.length > 0 ? (
                    data.map((order, index) => (
                        <div key={index} className="my-order-order">  {/* ✅ Added key */}
                            <img src={assets.parcel_icon} alt="Parcel Icon" /> {/* ✅ Ensured valid import */}
                            <p>
                                {order.items.map((item,index)=>{
                                    if(index=== order.items.length-1){
                                        return item.name+" x " + item.quantity
                                    }
                                })}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
