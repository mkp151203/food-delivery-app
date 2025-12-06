const orderService = require('../services/orderService');
const { success, error } = require('../utils/response');

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body, path } = event;

    try {
        // Check if it's a user orders request
        if (path && path.includes('/user/')) {
            const userId = pathParameters.userId;
            const orders = await orderService.getByUser(userId);
            return success(orders);
        }

        // Check if it's a status update request
        if (path && path.includes('/status')) {
            const { status } = JSON.parse(body);
            const order = await orderService.updateStatus(pathParameters.orderId, status);
            return success(order);
        }

        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.orderId) {
                    const order = await orderService.getById(pathParameters.orderId);
                    if (!order) {
                        return error('Order not found', 404);
                    }
                    return success(order);
                }
                // Admin: get all orders
                const orders = await orderService.getAll();
                return success(orders);

            case 'POST':
                const orderData = JSON.parse(body);
                const newOrder = await orderService.create(orderData);
                return success(newOrder, 201);

            case 'PUT':
                const { status } = JSON.parse(body);
                const updatedOrder = await orderService.updateStatus(pathParameters.orderId, status);
                return success(updatedOrder);

            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Order handler error:', err);
        return error(err.message || 'Internal server error', 500);
    }
};
