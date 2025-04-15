const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const fetch = require('node-fetch');

const authCookieName = 'token';

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);


function setAuthCookie(res, authToken) {
    const maxAgeInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days

    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        path: '/', 
        maxAge: maxAgeInMilliseconds,
    });
}

// let users = [];
// let scores = []; , scores need to be stored in the database eventually


const spotifyUsers = {};
let leaderboard = [];

const superUsername = 'invincible';
const superUserPassword = 'maulertwins';
let superUser = null;




apiRouter.post('/auth/spotify-login', (req, res) => {
    const spotifyToken = req.body.spotifyToken;
    if (spotifyToken) {
    const sessionId = uuid.v4();
        spotifyUsers[sessionId] = { spotifyToken: spotifyToken };
        setAuthCookie(res, sessionId);
        res.send({ message: 'Spotify login successful', isSuperUser: false });
    } else {
        res.status(401).send({ msg: 'Spotify login failed' });
    }
});



//start of my logout endpoint
apiRouter.delete('/auth/logout', async (req, res) => {
    // ... my logout logic (clearing cookies, tokens, sessions)
    res.clearCookie(authCookieName);
    res.status(204).end();
});





async function initializeSuperUser(){
    const passwordHash = await bcrypt.hash(superUserPassword, 10);
    superUser = {
        username: superUsername,
        password: passwordHash,
        token: null,
    };
}
initializeSuperUser();

apiRouter.post('/auth/superuser-login', async (req, res) => {
    if (req.body.username === superUser.username) {
        //check if password is right
      if (await bcrypt.compare(req.body.password, superUser.password)) {
        superUser.token = uuid.v4();
        setAuthCookie(res, superUser.token);
        res.send({ username: superUser.username, isSuperUser: true });
        return;
      }
    }
    res.status(401).send({ msg: '*ERRRRR* WRONG!' });
  });










const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/*const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.use(express.static('public'));


const express = require('express');
const app = express();

app.listen(8080);*/