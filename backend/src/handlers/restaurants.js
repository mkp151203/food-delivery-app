const restaurantService = require('../services/restaurantService');
const { success, error } = require('../utils/response');

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body } = event;

    try {
        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.id) {
                    const restaurant = await restaurantService.getById(pathParameters.id);
                    if (!restaurant) {
                        return error('Restaurant not found', 404);
                    }
                    return success(restaurant);
                }
                const restaurants = await restaurantService.getAll();
                return success(restaurants);

            case 'POST':
                const createData = JSON.parse(body);
                const newRestaurant = await restaurantService.create(createData);
                return success(newRestaurant, 201);

            case 'PUT':
                const updateData = JSON.parse(body);
                const updatedRestaurant = await restaurantService.update(pathParameters.id, updateData);
                return success(updatedRestaurant);

            case 'DELETE':
                await restaurantService.remove(pathParameters.id);
                return success({ message: 'Restaurant deleted' });

            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('Restaurant handler error:', err);
        return error(err.message || 'Internal server error', 500);
    }
};
