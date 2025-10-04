import './Orders.css';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from "axios";
import { assets } from "../../assets/assets"; // assuming you have parcel_icon

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        // Sort orders by latest first
        const sortedOrders = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message || "Error fetching orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Server not reachable");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`${url}/api/order/status`, { orderId, status: newStatus });
      if (response.data.success) {
        toast.success("Order status updated");
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Server not reachable");
    }
  };

  return (
    <div className='order-list'>
      {orders.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "12px" }}>No orders found</p>
      ) : (
        orders.map(order => {
          const totalQuantity = order.items
            ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
            : 0;

          return (
            <div key={order._id} className='order-item'>
              <img src={assets.parcel_icon} alt="parcel" />

              {/* Items + Customer Name + Address */}
              <div className='order-item-info'>
                {/* Items */}
                <div className='order-item-food'>
                  {order.items && order.items.length > 0
                    ? order.items
                        .map(item => `${item.name || "Unnamed Item"} X ${item.quantity || 1}`)
                        .join(", ")
                    : "No items"}
                </div>

                {/* Customer Name */}
                {order.address && (order.address.firstName || order.address.lastName) && (
                  <div className='order-item-name'>
                    {order.address.firstName || ""} {order.address.lastName || ""}
                  </div>
                )}

                {/* Address */}
                {order.address && (
                  <div className='order-item-address'>
                    {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.pincode}<br/>
                    Phone: {order.address.phone}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className='order-item-qty'>{totalQuantity}</div>

              {/* Amount */}
              <div className='order-item-amount'>₹{order.amount || 0}</div>

              {/* Status */}
              <div className='order-item-status'>
                <select
                  value={order.status || "Food Processing"}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
