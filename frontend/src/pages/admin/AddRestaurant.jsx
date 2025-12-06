import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Upload } from 'lucide-react';
import { addRestaurant } from '../../services/api';
import './AdminForms.css';

const AddRestaurant = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        address: '',
        deliveryTime: '30-40 min',
        image: '',
        rating: 4.0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await addRestaurant(formData);
            setSuccess(true);
            setTimeout(() => navigate('/admin'), 1500);
        } catch (err) {
            setError(err.message || 'Failed to add restaurant');
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
                        <Store size={32} />
                        <h1>Add New Restaurant</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Restaurant Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter restaurant name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Cuisine Type *</label>
                            <input
                                type="text"
                                value={formData.cuisine}
                                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                                placeholder="e.g., Italian, Chinese, Indian"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Restaurant address"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Delivery Time</label>
                                <input
                                    type="text"
                                    value={formData.deliveryTime}
                                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    placeholder="e.g., 30-40 min"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rating</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                />
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
                        {success && <div className="success-message">Restaurant added successfully!</div>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Restaurant'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRestaurant;
