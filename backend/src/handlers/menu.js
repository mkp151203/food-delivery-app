const menuService = require('../services/menuService');
const { success, error } = require('../utils/response');

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body, path } = event;

    try {
        switch (httpMethod) {
            case 'GET':
                // Path: /menu/restaurant/{id} - get menu by restaurant ID
                if (pathParameters && pathParameters.id) {
                    const menuItems = await menuService.getByRestaurant(pathParameters.id);
                    return success(menuItems);
                }
                return error('Restaurant ID required', 400);

            case 'POST':
                const createData = JSON.parse(body);
                const newMenuItem = await menuService.create(createData);
                return success(newMenuItem, 201);

            case 'PUT':
                // Path: /menu/item/{id} - update menu item
                const updateData = JSON.parse(body);
                const updatedMenuItem = await menuService.update(pathParameters.id, updateData);
                return success(updatedMenuItem);

            case 'DELETE':
                // Path: /menu/item/{id} - delete menu item
                await menuService.remove(pathParameters.id);
                return success({ message: 'Menu item deleted' });

            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Menu handler error:', err);
        return error(err.message || 'Internal server error', 500);
    }
};
