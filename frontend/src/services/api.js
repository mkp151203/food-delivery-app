const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
};

// Restaurant APIs
export const getRestaurants = () => apiCall('/restaurants');
export const getRestaurant = (id) => apiCall(`/restaurants/${id}`);

// Menu APIs
export const getMenu = (restaurantId) => apiCall(`/menu/restaurant/${restaurantId}`);

// Order APIs
export const createOrder = (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
});

export const getOrder = (orderId) => apiCall(`/orders/${orderId}`);
export const getUserOrders = (userId) => apiCall(`/orders/user/${userId}`);

// User APIs
export const registerUser = (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
});

export const loginUser = (email) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email })
});

// Admin APIs
export const addRestaurant = (data) => apiCall('/admin/restaurants', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const addMenuItem = (data) => apiCall('/admin/menu', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const getAllOrders = () => apiCall('/admin/orders');

export const updateOrderStatus = (orderId, status) => apiCall(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
});

export default {
    getRestaurants,
    getRestaurant,
    getMenu,
    createOrder,
    getOrder,
    getUserOrders,
    registerUser,
    loginUser,
    addRestaurant,
    addMenuItem,
    getAllOrders,
    updateOrderStatus
};
