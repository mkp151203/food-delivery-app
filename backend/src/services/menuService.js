const { docClient } = require('../utils/dynamoClient');
const { GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.MENU_TABLE || 'FoodDelivery-MenuItems';

// Get all menu items for a restaurant
const getByRestaurant = async (restaurantId) => {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'RestaurantIndex',
        KeyConditionExpression: 'restaurantId = :restaurantId',
        FilterExpression: 'isAvailable = :available',
        ExpressionAttributeValues: {
            ':restaurantId': restaurantId,
            ':available': true
        }
    });
    const response = await docClient.send(command);
    return response.Items || [];
};

// Get menu item by ID
const getById = async (menuItemId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { menuItemId }
    });
    const response = await docClient.send(command);
    return response.Item;
};

// Create new menu item
const create = async (menuData) => {
    const menuItem = {
        menuItemId: uuidv4(),
        ...menuData,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: menuItem
    });

    await docClient.send(command);
    return menuItem;
};

// Update menu item
const update = async (menuItemId, updateData) => {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updateData).forEach((key, index) => {
        updateExpressions.push(`#field${index} = :value${index}`);
        expressionAttributeNames[`#field${index}`] = key;
        expressionAttributeValues[`:value${index}`] = updateData[key];
    });

    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    updateExpressions.push('updatedAt = :updatedAt');

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { menuItemId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

// Delete menu item (soft delete)
const remove = async (menuItemId) => {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { menuItemId },
        UpdateExpression: 'SET isAvailable = :unavailable, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
            ':unavailable': false,
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

module.exports = {
    getByRestaurant,
    getById,
    create,
    update,
    remove
};
