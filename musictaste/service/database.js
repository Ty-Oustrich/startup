const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);


let scoreCollection;
let userCollection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Don't exit the process, just log the error
    }
}

async function initializeCollections() {
    try {
          scoreCollection = client.db('startup').collection('scores');
        userCollection = client.db('startup').collection('users');
        console.log('Collections initialized');
    } catch (error) {
      console.error('Failed to initialize collections:', error);
    }
}

connectToDatabase().then(initializeCollections);

// Store a user's score
async function addScore(score, username) {
    if (!scoreCollection) {
        throw new Error('Database not initialized');
    }
    try {
        const result = await scoreCollection.insertOne({
            score: score,
            spotifyUsername: username,
            date: new Date()
        });
        return result;
    } catch (error) {
        console.error('Error adding the score:', error);
        throw error;
    }
}

// Get top scores
async function getHighScores() {
    if (!scoreCollection) {
        throw new Error('Database not initialized');
    }
    try {
        const query = {};
        const options = {
              sort: { score: -1 },
            limit: 10
        };
        const cursor = await scoreCollection.find(query, options);
        return cursor.toArray();
    } catch (error) {
        console.error('Error getting the high scores:', error);
        throw error;
    }
}

// Store user creds
async function addUser(username, password) {
    if (!userCollection) {
        throw new Error('Database not initialized');
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
    if (!userCollection) {
        throw new Error('Database not initialized');
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
