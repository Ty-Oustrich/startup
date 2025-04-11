const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const authCookieName = 'token';

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// let users = [];
// let scores = [];

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