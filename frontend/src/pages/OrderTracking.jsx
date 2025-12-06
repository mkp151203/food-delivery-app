import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import OrderStatusComponent from '../components/OrderStatus';
import LoadingSpinner from '../components/LoadingSpinner';
import { getOrder } from '../services/api';
import './OrderTracking.css';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrder();
        // Poll for updates every 30 seconds
        const interval = setInterval(loadOrder, 30000);
        return () => clearInterval(interval);
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const data = await getOrder(orderId);
            setOrder(data);
            setError(null);
        } catch (err) {
            setError('Failed to load order details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="order-tracking-loading">
                <LoadingSpinner size="large" text="Loading order..." />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-tracking-error">
                <p>{error || 'Order not found'}</p>
                <Link to="/" className="back-link">← Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="order-tracking-page">
            <div className="order-tracking-container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="order-header">
                    <div>
                        <h1>Order #{order.orderId.slice(0, 8)}</h1>
                        <p className="order-date">
                            Placed on {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="order-total">
                        <span>Total</span>
                        <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                    </div>
                </div>

                <OrderStatusComponent
                    status={order.status}
                    statusHistory={order.statusHistory}
                />

                <div className="order-details-grid">
                    <div className="detail-card">
                        <h3>
                            <MapPin size={20} />
                            Delivery Address
                        </h3>
                        <p>{order.deliveryAddress}</p>
                    </div>

                    <div className="detail-card">
                        <h3>
                            <Clock size={20} />
                            Estimated Delivery
                        </h3>
                        <p>30-45 minutes</p>
                    </div>
                </div>

                <div className="order-items-card">
                    <h3>Order Items</h3>
                    <p className="restaurant-name">{order.restaurantName}</p>
                    <div className="items-list">
                        {order.items?.map((item, index) => (
                            <div key={index} className="order-item">
                                <span className="item-qty">{item.quantity}x</span>
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
