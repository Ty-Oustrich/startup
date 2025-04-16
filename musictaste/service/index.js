const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const fetch = require('node-fetch');
const querystring = require('querystring');

const authCookieName = 'token';
const client_id = '640a1bf34e8349a2b748b0e6c68dbec5';
const client_secret = 'd3e9df933cb448a6a9e73c558e543eb5';
const redirect_uri = 'https://startup.musictaste.click/callback';

// Middleware
app.use(express.json());
app.use(cookieParser());

// API routes
var apiRouter = express.Router();
app.use('/api', apiRouter);

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    extensions: ['html']
}));

function setAuthCookie(res, authToken) {
    const maxAgeInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days

    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: '.musictaste.click',
        maxAge: maxAgeInMilliseconds,
    });
}

// let users = [];
// let scores = []; , scores will be stored in the database eventually


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


async function initializeSuperUser() {
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


apiRouter.get('/spotify/me', async (req, res) => {
    const authToken = req.cookies[authCookieName];
  
    if (authToken && spotifyUsers[authToken]) {
      const sessionId = authToken;
      const accessToken = spotifyUsers[sessionId]?.spotifyToken;
  
      try {
        const response = await fetch('https://api.spotify.com/v1/me', { // Spotify API endpoint
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
            if(!response.ok) {
            console.error('Failed to fetch user profile from Spotify API:', response.status);
          return res.status(response.status).send('Failed to fetch Spotify profile');
        }
        const data = await response.json();
        res.json({ displayName: data.display_name, id: data.id });
      } catch (error) {
        console.error('Error fetching user profile from Spotify API:', error);
        res.status(500).send('Error fetching Spotify profile');
      }
    } 
    else {
      res.status(401).send('Unauthorized');
    }
  });

//spot Auth flow
app.get('/login', function (req, res) {
    const state = uuid.v4();
    const scope = 'user-read-private user-read-email user-top-read';

    // Clear any existing state cookie first
    res.clearCookie('spotifyState', {
        path: '/',
        domain: '.musictaste.click'
    });

    // Set new state cookie
    res.cookie('spotifyState', state, { 
        maxAge: 3600000, 
        httpOnly: true, 
        secure: true, 
        sameSite: 'lax',
        path: '/',
        domain: '.musictaste.click'
    });

    // Add show_dialog=true to force the consent screen
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state,
            show_dialog: true
        }));
});

//spot Auth flow
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies['spotifyState'] : null;

    // Enhanced logging
    console.log('Callback received:', {
        hasCode: !!code,
        receivedState: state,
        storedState: storedState,
        allCookies: req.cookies,
        headers: req.headers
    });

    if (state === null || state !== storedState) {
        console.error('State mismatch:', {
            received: state,
            stored: storedState,
            allCookies: req.cookies,
            url: req.url
        });
        return res.status(400).send('State mismatch. Please try logging in again.');
    }

    if (code) {
        const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

        try {
            console.log('Attempting token exchange with Spotify...');
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirect_uri,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Spotify API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData,
                    requestUrl: 'https://accounts.spotify.com/api/token',
                    redirectUri: redirect_uri
                });
                return res.status(response.status).send(`Spotify API error: ${errorData.error_description || response.statusText}`);
            }

            const data = await response.json();
            console.log('Token exchange successful:', {
                hasAccessToken: !!data.access_token,
                tokenType: data.token_type,
                scope: data.scope,
                expiresIn: data.expires_in
            });

            if (data.access_token) {
                const sessionId = uuid.v4();
                spotifyUsers[sessionId] = { spotifyToken: data.access_token };
                setAuthCookie(res, sessionId);
                res.clearCookie('spotifyState', {
                    path: '/',
                    domain: '.musictaste.click'
                });
                console.log('Authentication complete, redirecting to /analyze');
                res.redirect('/analyze');
            } else {
                console.error('Token exchange error - no access token:', data);
                return res.status(400).send('Failed to exchange code for token: No access token received');
            }

        } catch (error) {
            console.error('Error during token exchange:', {
                message: error.message,
                stack: error.stack,
                code: error.code,
                url: req.url,
                headers: req.headers
            });
            res.status(500).send('Internal error during Spotify authentication. Please try again.');
        }
    } else {
        console.error('No code received from Spotify:', {
            query: req.query,
            url: req.url
        });
        res.status(400).send('No authorization code received from Spotify');
    }
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
