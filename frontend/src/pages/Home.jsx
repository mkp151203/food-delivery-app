import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRestaurants } from '../services/api';
import './Home.css';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const data = await getRestaurants();
            setRestaurants(data);
        } catch (err) {
            setError('Failed to load restaurants. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Get unique cuisines
    const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];

    // Filter restaurants
    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.cuisine?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    if (loading) {
        return (
            <div className="home-loading">
                <LoadingSpinner size="large" text="Loading restaurants..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-error">
                <p>{error}</p>
                <button onClick={loadRestaurants}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Delicious Food,<br /><span>Delivered Fast</span></h1>
                    <p>Order from your favorite restaurants and get it delivered to your doorstep</p>
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search restaurants or cuisines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="restaurants-section">
                <div className="section-header">
                    <h2>Popular Restaurants</h2>
                    <div className="cuisine-filters">
                        {cuisines.map(cuisine => (
                            <button
                                key={cuisine}
                                className={`filter-btn ${selectedCuisine === cuisine ? 'active' : ''}`}
                                onClick={() => setSelectedCuisine(cuisine)}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredRestaurants.length === 0 ? (
                    <div className="no-results">
                        <p>No restaurants found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="restaurants-grid">
                        {filteredRestaurants.map(restaurant => (
                            <RestaurantCard key={restaurant.restaurantId} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
