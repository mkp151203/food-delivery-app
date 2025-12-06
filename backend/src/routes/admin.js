const express = require('express');
const router = express.Router();
const restaurantService = require('../services/restaurantService');
const menuService = require('../services/menuService');
const orderService = require('../services/orderService');
const userService = require('../services/userService');

// Middleware to check admin (simplified - in production use proper auth)
const checkAdmin = async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await userService.getById(userId);
    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
};

// ==================== RESTAURANT ADMIN ====================

// POST /api/admin/restaurants - Add restaurant
router.post('/restaurants', async (req, res) => {
    try {
        const restaurant = await restaurantService.create(req.body);
        res.status(201).json(restaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
});

// PUT /api/admin/restaurants/:id - Update restaurant
router.put('/restaurants/:id', async (req, res) => {
    try {
        const restaurant = await restaurantService.update(req.params.id, req.body);
        res.json(restaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

// DELETE /api/admin/restaurants/:id - Delete restaurant
router.delete('/restaurants/:id', async (req, res) => {
    try {
        await restaurantService.remove(req.params.id);
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});

// ==================== MENU ADMIN ====================

// POST /api/admin/menu - Add menu item
router.post('/menu', async (req, res) => {
    try {
        const { restaurantId, name, description, price, category, image } = req.body;
        if (!restaurantId || !name || !price) {
            return res.status(400).json({ error: 'Restaurant ID, name, and price are required' });
        }
        const menuItem = await menuService.create({
            restaurantId,
            name,
            description,
            price: parseFloat(price),
            category: category || 'Main Course',
            image
        });
        res.status(201).json(menuItem);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
});

// PUT /api/admin/menu/:id - Update menu item
router.put('/menu/:id', async (req, res) => {
    try {
        const menuItem = await menuService.update(req.params.id, req.body);
        res.json(menuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// DELETE /api/admin/menu/:id - Delete menu item
router.delete('/menu/:id', async (req, res) => {
    try {
        await menuService.remove(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

// ==================== ORDER ADMIN ====================

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await orderService.getAll();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PUT /api/admin/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }
        const order = await orderService.updateStatus(req.params.id, status);
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: error.message || 'Failed to update order' });
    }
});

module.exports = router;
