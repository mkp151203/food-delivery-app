const express = require('express');
const router = express.Router();
const restaurantService = require('../services/restaurantService');

// GET /api/restaurants - Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await restaurantService.getAll();
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

// GET /api/restaurants/:id - Get restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await restaurantService.getById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
});

// POST /api/restaurants - Create new restaurant (admin)
router.post('/', async (req, res) => {
    try {
        const { name, cuisine, address, image, deliveryTime } = req.body;
        if (!name || !cuisine) {
            return res.status(400).json({ error: 'Name and cuisine are required' });
        }
        const restaurant = await restaurantService.create({
            name,
            cuisine,
            address,
            image,
            deliveryTime: deliveryTime || '30-40 min'
        });
        res.status(201).json(restaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
});

// PUT /api/restaurants/:id - Update restaurant (admin)
router.put('/:id', async (req, res) => {
    try {
        const restaurant = await restaurantService.update(req.params.id, req.body);
        res.json(restaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

// DELETE /api/restaurants/:id - Delete restaurant (admin)
router.delete('/:id', async (req, res) => {
    try {
        await restaurantService.remove(req.params.id);
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});

module.exports = router;
