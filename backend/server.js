require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Import routes
const restaurantRoutes = require('./src/routes/restaurants');
const menuRoutes = require('./src/routes/menu');
const orderRoutes = require('./src/routes/orders');
const userRoutes = require('./src/routes/users');
const adminRoutes = require('./src/routes/admin');

// Use routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        region: process.env.AWS_REGION || 'us-east-1'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Food Delivery API',
        version: '1.0.0',
        endpoints: {
            restaurants: '/api/restaurants',
            menu: '/api/menu/:restaurantId',
            orders: '/api/orders',
            users: '/api/users',
            admin: '/api/admin',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║     Food Delivery Backend API Server          ║
    ╠═══════════════════════════════════════════════╣
    ║  Status:  Running                             ║
    ║  Port:    ${PORT}                                ║
    ║  Region:  ${process.env.AWS_REGION || 'us-east-1'}                          ║
    ╚═══════════════════════════════════════════════╝
    
    API Endpoints:
    - GET  /api/restaurants       - List restaurants
    - GET  /api/restaurants/:id   - Get restaurant
    - GET  /api/menu/:restaurantId - Get menu
    - POST /api/orders            - Create order
    - GET  /api/orders/:id        - Get order
    - GET  /api/orders/user/:id   - Get user orders
    - POST /api/users/register    - Register user
    - POST /api/users/login       - Login user
    - POST /api/admin/restaurants - Add restaurant
    - POST /api/admin/menu        - Add menu item
    - GET  /api/admin/orders      - Get all orders
    `);
});
