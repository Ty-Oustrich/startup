const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const scoreCollection = client.db('startup').collection('scores');
const userCollection = client.db('startup').collection('users');


async function connectToDatabase() {
    try {        await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection failed:', error);
     process.exit(1); // Exit cannot conect
    }
}

//call when server starts
connectToDatabase();

// Store a user's score
async function addScore(score, username) {
    try {
        const result = await scoreCollection.insertOne({
          score: score,
          spotifyUsername: spotifyUsername,
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
    try {
    const result = await userCollection.insertOne({
      username: username,
      password: password,
      date: new Date()
    });
        return result;
    } catch (error) {
        console.error('Error adding a user:', error);
        throw error;
    }
}
// Get user by username
async function getUser(username) {
  try {
    const query = { username: username };
    const user = await userCollection.findOne(query);    return user;
    } catch (error) {
      console.error('Error getting auser:', error);
        throw error;
    }
}

module.exports = { addScore, getHighScores, addUser, getUser };
