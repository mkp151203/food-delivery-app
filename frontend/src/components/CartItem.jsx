import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const { menuItemId, name, price, quantity, image } = item;

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img
                    src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                    alt={name}
                />
            </div>
            <div className="cart-item-details">
                <h4 className="cart-item-name">{name}</h4>
                <span className="cart-item-price">₹{price}</span>
            </div>
            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button
                        className="qty-btn"
                        onClick={() => updateQuantity(menuItemId, quantity - 1)}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                        className="qty-btn"
                        onClick={() => updateQuantity(menuItemId, quantity + 1)}
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <button
                    className="remove-btn"
                    onClick={() => removeFromCart(menuItemId)}
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="cart-item-total">
                ₹{(price * quantity).toFixed(2)}
            </div>
        </div>
    );
};

export default CartItem;
