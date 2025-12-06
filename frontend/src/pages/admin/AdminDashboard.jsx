import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, UtensilsCrossed, Package, Plus, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getRestaurants, getAllOrders } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        restaurants: 0,
        orders: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const [restaurants, orders] = await Promise.all([
                getRestaurants(),
                getAllOrders()
            ]);

            setStats({
                restaurants: restaurants.length,
                orders: orders.length,
                pendingOrders: orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <LoadingSpinner size="large" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button className="refresh-btn" onClick={loadStats}>
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon restaurants">
                        <Store size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.restaurants}</span>
                        <span className="stat-label">Restaurants</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders">
                        <Package size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.orders}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <UtensilsCrossed size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{stats.pendingOrders}</span>
                        <span className="stat-label">Pending Orders</span>
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/restaurant" className="action-card">
                        <Plus size={24} />
                        <span>Add Restaurant</span>
                    </Link>
                    <Link to="/admin/menu" className="action-card">
                        <Plus size={24} />
                        <span>Add Menu Item</span>
                    </Link>
                    <Link to="/admin/orders" className="action-card">
                        <Package size={24} />
                        <span>Manage Orders</span>
                    </Link>
                </div>
            </div>

            <div className="recent-orders">
                <h2>Recent Orders</h2>
                {recentOrders.length === 0 ? (
                    <p className="no-orders">No orders yet</p>
                ) : (
                    <div className="orders-table">
                        {recentOrders.map(order => (
                            <div key={order.orderId} className="order-row">
                                <span className="order-id">#{order.orderId.slice(0, 8)}</span>
                                <span className="order-restaurant">{order.restaurantName}</span>
                                <span className={`order-status ${order.status}`}>{order.status}</span>
                                <span className="order-amount">₹{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
