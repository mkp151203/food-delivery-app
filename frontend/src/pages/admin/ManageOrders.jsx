import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import './ManageOrders.css';

const ORDER_STATUSES = [
    'placed',
    'confirmed',
    'preparing',
    'out-for-delivery',
    'delivered',
    'cancelled'
];

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdating(orderId);
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev =>
                prev.map(o =>
                    o.orderId === orderId ? { ...o, status: newStatus } : o
                )
            );
        } catch (err) {
            console.error('Failed to update order:', err);
            alert('Failed to update order status');
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="manage-orders-loading">
                <LoadingSpinner size="large" text="Loading orders..." />
            </div>
        );
    }

    return (
        <div className="manage-orders-page">
            <div className="manage-orders-container">
                <div className="page-header">
                    <Link to="/admin" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <button className="refresh-btn" onClick={loadOrders}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                <h1>Manage Orders</h1>

                {orders.length === 0 ? (
                    <div className="no-orders">
                        <p>No orders to manage</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div key={order.orderId} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">#{order.orderId.slice(0, 8)}</span>
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="order-details">
                                    <div className="order-info">
                                        <h3>{order.restaurantName}</h3>
                                        <p className="order-items">
                                            {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                        </p>
                                        <p className="order-address">{order.deliveryAddress}</p>
                                    </div>
                                    <div className="order-amount">
                                        ₹{order.totalAmount?.toFixed(2)}
                                    </div>
                                </div>

                                <div className="order-actions">
                                    <span className="current-status">
                                        Current: <strong>{order.status}</strong>
                                    </span>
                                    <div className="status-buttons">
                                        {ORDER_STATUSES.map(status => (
                                            <button
                                                key={status}
                                                className={`status-btn ${order.status === status ? 'active' : ''}`}
                                                onClick={() => handleStatusUpdate(order.orderId, status)}
                                                disabled={updating === order.orderId || order.status === status}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
