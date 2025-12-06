import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MenuItem.css';

const MenuItem = ({ item, restaurant }) => {
    const { cartItems, addToCart, updateQuantity } = useCart();
    const { menuItemId, name, description, price, image, category } = item;

    const cartItem = cartItems.find(i => i.menuItemId === menuItemId);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => {
        addToCart(item, {
            restaurantId: restaurant.restaurantId,
            name: restaurant.name
        });
    };

    return (
        <div className="menu-item">
            <div className="menu-item-image">
                <img
                    src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300'}
                    alt={name}
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300';
                    }}
                />
                {category && <span className="menu-item-category">{category}</span>}
            </div>
            <div className="menu-item-content">
                <h4 className="menu-item-name">{name}</h4>
                <p className="menu-item-description">{description}</p>
                <div className="menu-item-footer">
                    <span className="menu-item-price">₹{price}</span>
                    {quantity === 0 ? (
                        <button className="add-btn" onClick={handleAdd}>
                            <Plus size={18} />
                            Add
                        </button>
                    ) : (
                        <div className="quantity-controls">
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(menuItemId, quantity - 1)}
                            >
                                <Minus size={16} />
                            </button>
                            <span className="qty-value">{quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => updateQuantity(menuItemId, quantity + 1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuItem;
