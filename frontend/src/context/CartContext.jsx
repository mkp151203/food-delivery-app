import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [restaurantInfo, setRestaurantInfo] = useState(() => {
        const saved = localStorage.getItem('cartRestaurant');
        return saved ? JSON.parse(saved) : null;
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (restaurantInfo) {
            localStorage.setItem('cartRestaurant', JSON.stringify(restaurantInfo));
        } else {
            localStorage.removeItem('cartRestaurant');
        }
    }, [restaurantInfo]);

    const addToCart = (item, restaurant) => {
        // If cart has items from different restaurant, ask to clear
        if (restaurantInfo && restaurantInfo.restaurantId !== restaurant.restaurantId) {
            const confirmed = window.confirm(
                `Your cart has items from ${restaurantInfo.name}. Do you want to clear the cart and add items from ${restaurant.name}?`
            );
            if (!confirmed) return false;
            setCartItems([]);
        }

        setRestaurantInfo(restaurant);

        setCartItems(prev => {
            const existing = prev.find(i => i.menuItemId === item.menuItemId);
            if (existing) {
                return prev.map(i =>
                    i.menuItemId === item.menuItemId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        return true;
    };

    const removeFromCart = (menuItemId) => {
        setCartItems(prev => {
            const newItems = prev.filter(i => i.menuItemId !== menuItemId);
            if (newItems.length === 0) {
                setRestaurantInfo(null);
            }
            return newItems;
        });
    };

    const updateQuantity = (menuItemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(menuItemId);
            return;
        }
        setCartItems(prev =>
            prev.map(i =>
                i.menuItemId === menuItemId ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setRestaurantInfo(null);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartRestaurant');
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartCount = cartItems.reduce(
        (count, item) => count + item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cartItems,
            restaurantInfo,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
