// Load env from backend folder
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

// Sample Restaurants
const restaurants = [
    {
        restaurantId: uuidv4(),
        name: 'Pizza Paradise',
        cuisine: 'Italian',
        address: '123 Food Street, Delhi',
        deliveryTime: '30-40 min',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        isActive: true
    },
    {
        restaurantId: uuidv4(),
        name: 'Dragon Palace',
        cuisine: 'Chinese',
        address: '456 Noodle Lane, Mumbai',
        deliveryTime: '25-35 min',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
        isActive: true
    },
    {
        restaurantId: uuidv4(),
        name: 'Spice Garden',
        cuisine: 'Indian',
        address: '789 Curry Road, Bangalore',
        deliveryTime: '35-45 min',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
        isActive: true
    },
    {
        restaurantId: uuidv4(),
        name: 'Burger Barn',
        cuisine: 'American',
        address: '321 Patty Avenue, Chennai',
        deliveryTime: '20-30 min',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        isActive: true
    },
    {
        restaurantId: uuidv4(),
        name: 'Sushi Master',
        cuisine: 'Japanese',
        address: '654 Tokyo Street, Hyderabad',
        deliveryTime: '40-50 min',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
        isActive: true
    }
];

// Menu Items for each restaurant
const getMenuItems = (restaurantId, restaurantName) => {
    const menus = {
        'Pizza Paradise': [
            { name: 'Margherita Pizza', description: 'Classic cheese pizza with fresh basil and tomato sauce', price: 299, category: 'Main Course', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300' },
            { name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni and mozzarella', price: 399, category: 'Main Course', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300' },
            { name: 'Garlic Bread', description: 'Crispy bread with garlic butter', price: 149, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=300' },
            { name: 'Tiramisu', description: 'Italian coffee-flavored dessert', price: 199, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98c6e4a99?w=300' }
        ],
        'Dragon Palace': [
            { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts', price: 349, category: 'Main Course', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300' },
            { name: 'Vegetable Fried Rice', description: 'Wok-tossed rice with fresh vegetables', price: 199, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300' },
            { name: 'Spring Rolls', description: 'Crispy vegetable rolls with sweet chili sauce', price: 149, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1548507200-ffe3946892e8?w=300' },
            { name: 'Hot & Sour Soup', description: 'Traditional Chinese soup', price: 129, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300' }
        ],
        'Spice Garden': [
            { name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken', price: 379, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300' },
            { name: 'Paneer Tikka', description: 'Grilled cottage cheese with spices', price: 299, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300' },
            { name: 'Biryani', description: 'Fragrant basmati rice with aromatic spices', price: 329, category: 'Main Course', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300' },
            { name: 'Gulab Jamun', description: 'Sweet milk dumplings in sugar syrup', price: 99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1666190097315-28e0da5a05fc?w=300' }
        ],
        'Burger Barn': [
            { name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheese and fresh veggies', price: 249, category: 'Main Course', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300' },
            { name: 'Chicken Burger', description: 'Crispy fried chicken with special sauce', price: 229, category: 'Main Course', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300' },
            { name: 'French Fries', description: 'Golden crispy fries with seasoning', price: 99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300' },
            { name: 'Chocolate Shake', description: 'Rich and creamy chocolate milkshake', price: 149, category: 'Beverages', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300' }
        ],
        'Sushi Master': [
            { name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 399, category: 'Main Course', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300' },
            { name: 'Salmon Nigiri', description: 'Fresh salmon over seasoned rice', price: 349, category: 'Main Course', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300' },
            { name: 'Miso Soup', description: 'Traditional Japanese soup with tofu', price: 129, category: 'Appetizers', image: 'https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=300' },
            { name: 'Green Tea Ice Cream', description: 'Authentic matcha ice cream', price: 149, category: 'Desserts', image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=300' }
        ]
    };

    return (menus[restaurantName] || []).map(item => ({
        menuItemId: uuidv4(),
        restaurantId,
        ...item,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

// Admin User
const adminUser = {
    userId: uuidv4(),
    email: 'admin@fooddelivery.com',
    name: 'Admin User',
    phone: '9999999999',
    isAdmin: true,
    addresses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// Demo User
const demoUser = {
    userId: uuidv4(),
    email: 'demo@example.com',
    name: 'Demo User',
    phone: '8888888888',
    isAdmin: false,
    addresses: ['123 Demo Street, Demo City - 123456'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

async function seedData() {
    console.log('🌱 Starting seed data...\n');

    // Seed Restaurants
    console.log('📍 Adding restaurants...');
    for (const restaurant of restaurants) {
        await docClient.send(new PutCommand({
            TableName: 'FoodDelivery-Restaurants',
            Item: {
                ...restaurant,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }));
        console.log(`   ✓ ${restaurant.name}`);

        // Seed Menu Items for each restaurant
        const menuItems = getMenuItems(restaurant.restaurantId, restaurant.name);
        for (const item of menuItems) {
            await docClient.send(new PutCommand({
                TableName: 'FoodDelivery-MenuItems',
                Item: item
            }));
        }
        console.log(`     → Added ${menuItems.length} menu items`);
    }

    // Seed Users
    console.log('\n👥 Adding users...');
    await docClient.send(new PutCommand({
        TableName: 'FoodDelivery-Users',
        Item: adminUser
    }));
    console.log(`   ✓ Admin: ${adminUser.email}`);

    await docClient.send(new PutCommand({
        TableName: 'FoodDelivery-Users',
        Item: demoUser
    }));
    console.log(`   ✓ Demo: ${demoUser.email}`);

    console.log('\n✅ Seed data complete!');
    console.log('\n📋 Test Accounts:');
    console.log('   Admin: admin@fooddelivery.com');
    console.log('   Demo:  demo@example.com');
}

seedData().catch(console.error);
