import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { addMenuItem, getRestaurants } from '../../services/api';
import './AdminForms.css';

const AddMenuItem = () => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        restaurantId: '',
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        image: ''
    });

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            const data = await getRestaurants();
            setRestaurants(data);
        } catch (err) {
            console.error('Failed to load restaurants:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await addMenuItem({
                ...formData,
                price: parseFloat(formData.price)
            });
            setSuccess(true);
            setFormData({
                ...formData,
                name: '',
                description: '',
                price: '',
                image: ''
            });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to add menu item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-form-page">
            <div className="admin-form-container">
                <Link to="/admin" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>

                <div className="form-card">
                    <div className="form-header">
                        <UtensilsCrossed size={32} />
                        <h1>Add Menu Item</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Restaurant *</label>
                            <select
                                value={formData.restaurantId}
                                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                                required
                            >
                                <option value="">Choose a restaurant</option>
                                {restaurants.map(r => (
                                    <option key={r.restaurantId} value={r.restaurantId}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Item Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter item name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Item description"
                                rows={3}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Appetizers">Appetizers</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Sides">Sides</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">Menu item added successfully!</div>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Menu Item'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMenuItem;
