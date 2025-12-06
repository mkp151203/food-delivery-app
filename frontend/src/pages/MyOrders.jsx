import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyOrders.css';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            const data = await getUserOrders(user.userId);
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return '#4ade80';
            case 'cancelled': return '#ff6b6b';
            case 'out-for-delivery': return '#feca57';
            default: return '#60a5fa';
        }
    };

    if (loading) {
        return (
            <div className="orders-loading">
                <LoadingSpinner size="large" text="Loading orders..." />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-empty">
                <Package size={80} strokeWidth={1} />
                <h2>No orders yet</h2>
                <p>When you place orders, they'll appear here</p>
                <Link to="/" className="browse-btn">Start Ordering</Link>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.map(order => (
                    <Link
                        key={order.orderId}
                        to={`/order/${order.orderId}`}
                        className="order-card"
                    >
                        <div className="order-card-header">
                            <span className="order-id">#{order.orderId.slice(0, 8)}</span>
                            <span
                                className="order-status"
                                style={{ color: getStatusColor(order.status) }}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="order-card-body">
                            <h3>{order.restaurantName}</h3>
                            <p>{order.items?.length} item(s)</p>
                        </div>
                        <div className="order-card-footer">
                            <span className="order-date">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="order-amount">₹{order.totalAmount?.toFixed(2)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
