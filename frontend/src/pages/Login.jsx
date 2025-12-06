import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, register, error: authError } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email);
            } else {
                if (!formData.name) {
                    setError('Name is required');
                    setLoading(false);
                    return;
                }
                await register({
                    email: formData.email,
                    name: formData.name,
                    phone: formData.phone
                });
            }
            navigate(-1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
                        <p>
                            {isLogin
                                ? 'Enter your email to continue'
                                : 'Sign up to start ordering'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <span className="input-icon">
                                    <User size={20} />
                                </span>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Full Name"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="input-group">
                            <span className="input-icon">
                                <Mail size={20} />
                            </span>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="input-group">
                                <span className="input-icon">
                                    <Phone size={20} />
                                </span>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone (Optional)"
                                />
                            </div>
                        )}

                        {(error || authError) && (
                            <div className="error-message">{error || authError}</div>
                        )}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    {isLogin && (
                        <div className="demo-accounts">
                            <p className="demo-title">Demo Accounts</p>
                            <div className="demo-list">
                                <button
                                    type="button"
                                    className="demo-btn"
                                    onClick={() => setFormData({ ...formData, email: 'admin@fooddelivery.com' })}
                                >
                                    <span className="demo-role">Admin</span>
                                    <span className="demo-email">admin@fooddelivery.com</span>
                                </button>
                                <button
                                    type="button"
                                    className="demo-btn"
                                    onClick={() => setFormData({ ...formData, email: 'demo@example.com' })}
                                >
                                    <span className="demo-role">User</span>
                                    <span className="demo-email">demo@example.com</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="login-footer">
                        <p>
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                type="button"
                                className="switch-btn"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>

                <Link to="/" className="back-home">Back to Home</Link>
            </div>
        </div>
    );
};

export default Login;
