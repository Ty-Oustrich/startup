const { MongoClient } = require('mongodb');
const config = require('./mydbConfig.json');

// Ensure proper URL encoding of credentials
const encodedUsername = encodeURIComponent(config.userName);
const encodedPassword = encodeURIComponent(config.password);
const url = `mongodb+srv://${encodedUsername}:${encodedPassword}@${config.hostname}/?retryWrites=true&w=majority`;

const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
});

let scoreCollection;
let userCollection;

// Connection state manager
const connectionState = {
    isConnected: false,
    getConnectionStatus: () => connectionState.isConnected,
    setConnectionStatus: (status) => {
        console.log(`Database connection status changed to: ${status}`);
        connectionState.isConnected = status;
    }
};

async function connectToDatabase() {
    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB successfully');
        
        const db = client.db('startup');
        scoreCollection = db.collection('scores');
        userCollection = db.collection('users');
        
        // Verify collections exist
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        connectionState.setConnectionStatus(true);
        console.log('Database connection established and collections initialized');
    } catch (error) {
        console.error('Database connection failed:', error);
        connectionState.setConnectionStatus(false);
        throw error;
    }
}

// Store a user's score
async function addScore(score, username) {
    if (!connectionState.getConnectionStatus()) {
        throw new Error('Database not connected');
    }
    try {
        const result = await scoreCollection.insertOne({
            score: score,
            username: username,
            date: new Date()
        });
        console.log('Score added successfully:', result);
        return result;
    } catch (error) {
        console.error('Error adding the score:', error);
        throw error;
    }
}

// Get top scores
async function getHighScores() {
    if (!connectionState.getConnectionStatus()) {
        throw new Error('Database not connected');
    }
    try {
        console.log('Querying scores collection...');
        const query = {};
        const options = {
            sort: { score: -1 },
            limit: 10
        };
        const cursor = await scoreCollection.find(query, options);
        const scores = await cursor.toArray();
        console.log(`Retrieved ${scores.length} scores from database`);
        return scores;
    } catch (error) {
        console.error('Error getting the high scores:', error);
        throw error;
    }
}

// Store user creds
async function addUser(username, password) {
    if (!connectionState.getConnectionStatus()) {
        throw new Error('Database not connected');
    }
    try {
        const result = await userCollection.insertOne({
            username: username,
            password: password,
            date: new Date()
        });
        return result;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}
// Get user by username
async function getUser(username) {
    if (!connectionState.getConnectionStatus()) {
        throw new Error('Database not connected');
    }
    try {
        const query = { username: username };
        const user = await userCollection.findOne(query);
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

module.exports = { 
    addScore, 
    getHighScores, 
    addUser, 
    getUser,
    connectionState,
    connectToDatabase
};
