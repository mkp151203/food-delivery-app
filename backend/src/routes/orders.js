const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
    try {
        const { userId, restaurantId, restaurantName, items, totalAmount, deliveryAddress } = req.body;

        if (!userId || !restaurantId || !items || items.length === 0) {
            return res.status(400).json({ error: 'User ID, restaurant ID, and items are required' });
        }

        const order = await orderService.create({
            userId,
            restaurantId,
            restaurantName,
            items,
            totalAmount: parseFloat(totalAmount),
            deliveryAddress
        });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/orders/:orderId - Get order by ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await orderService.getById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// GET /api/orders/user/:userId - Get orders by user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await orderService.getByUser(req.params.userId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PUT /api/orders/:orderId/status - Update order status
router.put('/:orderId/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const validStatuses = Object.values(orderService.ORDER_STATUS);
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
            });
        }

        const order = await orderService.updateStatus(req.params.orderId, status);
        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message || 'Failed to update order status' });
    }
});

module.exports = router;
