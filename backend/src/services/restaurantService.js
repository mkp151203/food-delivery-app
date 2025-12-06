const { docClient } = require('../utils/dynamoClient');
const { GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.RESTAURANTS_TABLE || 'FoodDelivery-Restaurants';

// Get all restaurants
const getAll = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'isActive = :active',
        ExpressionAttributeValues: {
            ':active': true
        }
    });
    const response = await docClient.send(command);
    return response.Items || [];
};

// Get restaurant by ID
const getById = async (restaurantId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { restaurantId }
    });
    const response = await docClient.send(command);
    return response.Item;
};

// Create new restaurant
const create = async (restaurantData) => {
    const restaurant = {
        restaurantId: uuidv4(),
        ...restaurantData,
        isActive: true,
        rating: restaurantData.rating || 4.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: restaurant
    });

    await docClient.send(command);
    return restaurant;
};

// Update restaurant
const update = async (restaurantId, updateData) => {
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
        Key: { restaurantId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

// Delete restaurant (soft delete)
const remove = async (restaurantId) => {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { restaurantId },
        UpdateExpression: 'SET isActive = :inactive, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
            ':inactive': false,
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
