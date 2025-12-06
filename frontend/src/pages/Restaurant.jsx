import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, MapPin } from 'lucide-react';
import MenuItem from '../components/MenuItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRestaurant, getMenu } from '../services/api';
import './Restaurant.css';

const Restaurant = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [restaurantData, menuData] = await Promise.all([
                getRestaurant(id),
                getMenu(id)
            ]);
            setRestaurant(restaurantData);
            setMenuItems(menuData);
        } catch (err) {
            setError('Failed to load restaurant. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="restaurant-loading">
                <LoadingSpinner size="large" text="Loading menu..." />
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="restaurant-error">
                <p>{error || 'Restaurant not found'}</p>
                <Link to="/" className="back-btn">← Back to Home</Link>
            </div>
        );
    }

    // Get unique categories
    const categories = ['All', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

    // Filter by category
    const filteredMenu = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    return (
        <div className="restaurant-page">
            <div className="restaurant-header">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back
                </Link>
                <div className="restaurant-banner">
                    <img
                        src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
                        alt={restaurant.name}
                    />
                    <div className="banner-overlay" />
                </div>
                <div className="restaurant-info-card">
                    <h1>{restaurant.name}</h1>
                    <p className="cuisine">{restaurant.cuisine}</p>
                    <div className="restaurant-meta">
                        <span className="rating">
                            <Star size={18} fill="#feca57" stroke="#feca57" />
                            {restaurant.rating?.toFixed(1) || '4.0'}
                        </span>
                        <span className="delivery-time">
                            <Clock size={18} />
                            {restaurant.deliveryTime || '30-40 min'}
                        </span>
                        {restaurant.address && (
                            <span className="address">
                                <MapPin size={18} />
                                {restaurant.address}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="menu-section">
                <div className="menu-header">
                    <h2>Menu</h2>
                    <div className="category-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredMenu.length === 0 ? (
                    <div className="no-items">
                        <p>No menu items available in this category.</p>
                    </div>
                ) : (
                    <div className="menu-grid">
                        {filteredMenu.map(item => (
                            <MenuItem key={item.menuItemId} item={item} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurant;
