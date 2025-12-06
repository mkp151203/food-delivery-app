const { docClient } = require('../utils/dynamoClient');
const { GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.ORDERS_TABLE || 'FoodDelivery-Orders';

// Order statuses
const ORDER_STATUS = {
    PLACED: 'placed',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    OUT_FOR_DELIVERY: 'out-for-delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Create new order
const create = async (orderData) => {
    const order = {
        orderId: uuidv4(),
        userId: orderData.userId,
        restaurantId: orderData.restaurantId,
        restaurantName: orderData.restaurantName,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        deliveryAddress: orderData.deliveryAddress,
        status: ORDER_STATUS.PLACED,
        statusHistory: [
            {
                status: ORDER_STATUS.PLACED,
                timestamp: new Date().toISOString()
            }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: order
    });

    await docClient.send(command);
    return order;
};

// Get order by ID
const getById = async (orderId) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { orderId }
    });
    const response = await docClient.send(command);
    return response.Item;
};

// Get orders by user ID
const getByUser = async (userId) => {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'UserIndex',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false // Latest orders first
    });
    const response = await docClient.send(command);
    return response.Items || [];
};

// Update order status
const updateStatus = async (orderId, newStatus) => {
    const order = await getById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const statusUpdate = {
        status: newStatus,
        timestamp: new Date().toISOString()
    };

    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { orderId },
        UpdateExpression: 'SET #status = :status, statusHistory = list_append(statusHistory, :statusUpdate), updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': newStatus,
            ':statusUpdate': [statusUpdate],
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);
    return response.Attributes;
};

// Get all orders (admin)
const getAll = async () => {
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const command = new ScanCommand({
        TableName: TABLE_NAME
    });
    const response = await docClient.send(command);
    // Sort by createdAt descending
    return (response.Items || []).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );
};

module.exports = {
    create,
    getById,
    getByUser,
    updateStatus,
    getAll,
    ORDER_STATUS
};
