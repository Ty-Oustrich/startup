const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

let scoreCollection;
let userCollection;
let isConnected = false;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        isConnected = true;
        await initializeCollections();
    } catch (error) {
        console.error('Database connection failed:', error);
        isConnected = false;
        throw error;
    }
}

async function initializeCollections() {
    try {
        const db = client.db('startup');
        scoreCollection = db.collection('scores');
        userCollection = db.collection('users');
        console.log('Collections initialized');
    } catch (error) {
        console.error('Failed to initialize collections:', error);
        isConnected = false;
        throw error;
    }
}

// Initialize the database connection
connectToDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
});

// Store a user's score
async function addScore(score, username) {
    if (!isConnected) {
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
    if (!isConnected) {
        throw new Error('Database not connected');
    }
    try {
        const query = {};
        const options = {
            sort: { score: -1 },
            limit: 10
        };
        const cursor = await scoreCollection.find(query, options);
        const scores = await cursor.toArray();
        console.log('Retrieved scores:', scores);
        return scores;
    } catch (error) {
        console.error('Error getting the high scores:', error);
        throw error;
    }
}

// Store user creds
async function addUser(username, password) {
    if (!isConnected) {
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
    if (!isConnected) {
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

module.exports = { addScore, getHighScores, addUser, getUser };
