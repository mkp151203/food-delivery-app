import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Settings, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { cartCount } = useCart();
    const { user, isAdmin, logout, isAuthenticated } = useAuth();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <Utensils size={22} />
                    </div>
                    <span className="logo-text">FoodieExpress</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAuthenticated && (
                        <Link to="/orders" className="nav-link">My Orders</Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="nav-link admin-link">
                            <Settings size={16} />
                            Admin
                        </Link>
                    )}
                </nav>

                <div className="header-actions">
                    <Link to="/cart" className="cart-btn">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-name">
                                <User size={18} />
                                {user.name}
                            </span>
                            <button onClick={logout} className="logout-btn">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            <User size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
