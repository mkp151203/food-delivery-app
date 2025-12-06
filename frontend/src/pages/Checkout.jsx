import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, restaurantInfo, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        pincode: '',
        landmark: ''
    });

    const deliveryFee = 40;
    const taxes = cartTotal * 0.05;
    const grandTotal = cartTotal + deliveryFee + taxes;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!address.street || !address.city || !address.pincode) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const orderData = {
                userId: user.userId,
                restaurantId: restaurantInfo.restaurantId,
                restaurantName: restaurantInfo.name,
                items: cartItems.map(item => ({
                    menuItemId: item.menuItemId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalAmount: grandTotal,
                deliveryAddress: `${address.street}, ${address.landmark ? address.landmark + ', ' : ''}${address.city} - ${address.pincode}`
            };

            const order = await createOrder(orderData);
            clearCart();
            navigate(`/order/${order.orderId}`);
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h1>Checkout</h1>

                    <div className="form-section">
                        <h3>
                            <MapPin size={20} />
                            Delivery Address
                        </h3>
                        <div className="form-group">
                            <label>Street Address *</label>
                            <input
                                type="text"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                placeholder="Enter your street address"
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    placeholder="City"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    value={address.pincode}
                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    placeholder="Pincode"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Landmark (Optional)</label>
                            <input
                                type="text"
                                value={address.landmark}
                                onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                                placeholder="Near any landmark"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>
                            <CreditCard size={20} />
                            Payment Method
                        </h3>
                        <div className="payment-options">
                            <label className="payment-option selected">
                                <input type="radio" name="payment" defaultChecked />
                                <span className="option-content">
                                    <Check size={18} />
                                    Cash on Delivery
                                </span>
                            </label>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="place-order-btn" disabled={loading}>
                        {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal.toFixed(2)}`}
                    </button>
                </form>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-restaurant">
                        {restaurantInfo?.name}
                    </div>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={item.menuItemId} className="summary-item">
                                <span>{item.quantity}x {item.name}</span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>₹{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Taxes</span>
                            <span>₹{taxes.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
