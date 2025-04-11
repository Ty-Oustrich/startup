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

// let users = [];
// let scores = []; , scores need to be stored in the database eventually


const spotifyUsers = {};
let leaderboard = [];

const superUsername = 'invincible';
const superUserPassword = 'maulertwins';
let superUser = null;


async function initializeSuperUser(){
    const passwordHash = await bcrypt.hash(superUserPassword, 10);
    superUser = {
        email: superUsername,
        password: passwordHash,
        token: null,
    };
}
initializeSuperUser();

apiRouter.post('/auth/superuser-login', async (req, res) => {
    if (req.body.email === superUser.email) {
        //check if password is right
      if (await bcrypt.compare(req.body.password, superUser.password)) {
        superUser.token = uuid.v4();
        setAuthCookie(res, superUser.token);
        res.send({ email: superUser.email, isSuperUser: true });
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