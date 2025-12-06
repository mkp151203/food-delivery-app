import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
    const { restaurantId, name, cuisine, rating, deliveryTime, image } = restaurant;

    return (
        <Link to={`/restaurant/${restaurantId}`} className="restaurant-card">
            <div className="restaurant-image">
                <img
                    src={image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                    alt={name}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
                    }}
                />
                <div className="restaurant-overlay">
                    <span className="view-menu">View Menu →</span>
                </div>
            </div>
            <div className="restaurant-info">
                <h3 className="restaurant-name">{name}</h3>
                <p className="restaurant-cuisine">{cuisine}</p>
                <div className="restaurant-meta">
                    <span className="rating">
                        <Star size={16} fill="#feca57" stroke="#feca57" />
                        {rating?.toFixed(1) || '4.0'}
                    </span>
                    <span className="delivery-time">
                        <Clock size={16} />
                        {deliveryTime || '30-40 min'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
