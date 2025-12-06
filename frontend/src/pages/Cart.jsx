import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, restaurantInfo, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <ShoppingBag size={80} strokeWidth={1} />
                <h2>Your cart is empty</h2>
                <p>Add some delicious food to get started!</p>
                <Link to="/" className="browse-btn">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    const deliveryFee = 40;
    const taxes = cartTotal * 0.05;
    const grandTotal = cartTotal + deliveryFee + taxes;

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-items-section">
                    <div className="cart-header">
                        <h1>Your Cart</h1>
                        <button className="clear-cart-btn" onClick={clearCart}>
                            <Trash2 size={18} />
                            Clear All
                        </button>
                    </div>

                    {restaurantInfo && (
                        <div className="restaurant-info">
                            <span>From: </span>
                            <strong>{restaurantInfo.name}</strong>
                        </div>
                    )}

                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <CartItem key={item.menuItemId} item={item} />
                        ))}
                    </div>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Taxes (5%)</span>
                        <span>₹{taxes.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>

                    {isAuthenticated ? (
                        <Link to="/checkout" className="checkout-btn">
                            Proceed to Checkout
                            <ArrowRight size={20} />
                        </Link>
                    ) : (
                        <Link to="/login" className="checkout-btn">
                            Login to Checkout
                            <ArrowRight size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
