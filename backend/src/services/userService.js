const { docClient } = require('../utils/dynamoClient');
const { GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.USERS_TABLE || 'FoodDelivery-Users';

// Create new user
const create = async (userData) => {
    const user = {
        userId: uuidv4(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone || '',
        addresses: userData.addresses || [],
        isAdmin: userData.isAdmin || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: user
    });

    await docClient.send(command);
    return user;
};

// Get user by ID
const getById = async (userId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { userId }
    });
    const response = await docClient.send(command);
    return response.Item;
};

// Simple login (for demo - in production use Cognito)
const login = async (email) => {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        }
    });
    const response = await docClient.send(command);
    return response.Items?.[0] || null;
};

// Update user
const update = async (userId, updateData) => {
    const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
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
        Key: { userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

module.exports = {
    create,
    getById,
    login,
    update
};
