const express = require('express');
const router = express.Router();
const menuService = require('../services/menuService');

// GET /api/menu/restaurant/:restaurantId - Get menu items for a restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
    try {
        const menuItems = await menuService.getByRestaurant(req.params.restaurantId);
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// GET /api/menu/item/:id - Get single menu item
router.get('/item/:id', async (req, res) => {
    try {
        const menuItem = await menuService.getById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ error: 'Failed to fetch menu item' });
    }
});

// POST /api/menu - Create new menu item (admin)
router.post('/', async (req, res) => {
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

// PUT /api/menu/item/:id - Update menu item (admin)
router.put('/item/:id', async (req, res) => {
    try {
        const menuItem = await menuService.update(req.params.id, req.body);
        res.json(menuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// DELETE /api/menu/item/:id - Delete menu item (admin)
router.delete('/item/:id', async (req, res) => {
    try {
        await menuService.remove(req.params.id);
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

module.exports = router;
