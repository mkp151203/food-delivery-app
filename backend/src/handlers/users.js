const userService = require('../services/userService');
const { success, error } = require('../utils/response');

exports.handler = async (event) => {
    const { httpMethod, pathParameters, body, path } = event;

    try {
        // Handle login
        if (path && path.includes('/login')) {
            const { email } = JSON.parse(body);
            const user = await userService.login(email);
            if (!user) {
                return error('User not found', 404);
            }
            return success(user);
        }

        // Handle register
        if (path && path.includes('/register')) {
            const userData = JSON.parse(body);
            const existingUser = await userService.login(userData.email);
            if (existingUser) {
                return error('User already exists', 400);
            }
            const user = await userService.create(userData);
            return success(user, 201);
        }

        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.id) {
                    const user = await userService.getById(pathParameters.id);
                    if (!user) {
                        return error('User not found', 404);
                    }
                    return success(user);
                }
                return error('User ID required', 400);

            case 'PUT':
                const updateData = JSON.parse(body);
                const updatedUser = await userService.update(pathParameters.id, updateData);
                return success(updatedUser);

            default:
                return error('Method not allowed', 405);
        }
    } catch (err) {
        console.error('User handler error:', err);
        return error(err.message || 'Internal server error', 500);
    }
};
