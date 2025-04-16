const { MongoClient } = require('mongodb');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName || !password || !hostname) {
    throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;
const client = new MongoClient(url);
const scoreCollection = client.db('startup').collection('scores');
const userCollection = client.db('startup').collection('users');

// Store a user's score
async function addScore(score, username) {
    try {
        const result = await scoreCollection.insertOne({
            score: score,
            username: username,
            date: new Date()
        });
        return result;
    } catch (error) {
        console.error('Error adding score:', error);
        throw error;
    }
}

// Get top scores
async function getHighScores() {
    try {
        const query = {};
        const options = {
            sort: { score: -1 },
            limit: 10
        };
        const cursor = await scoreCollection.find(query, options);
        return cursor.toArray();
    } catch (error) {
        console.error('Error getting high scores:', error);
        throw error;
    }
}

// Store user credentials
async function addUser(username, password) {
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
