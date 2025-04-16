const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
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

// Frontend served up using Express static middleware
app.use(express.static(path.join(__dirname, 'public')));

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

// Helper function to generate state
function generateState() {
    return crypto.randomBytes(16).toString('hex');
}

//spot Auth flow
app.get('/login', function (req, res) {
    const state = generateState();
    const scope = 'user-read-private user-read-email user-top-read';

    // Store state
    res.cookie('spotifyState', state, { 
        maxAge: 3600000, 
        httpOnly: true, 
        secure: true, 
        sameSite: 'lax',
        path: '/',
        domain: '.musictaste.click'
    });

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: true
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

//spot Auth flow
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies['spotifyState'] : null;

    console.log('Callback received:', {
        hasCode: !!code,
        receivedState: state,
        storedState: storedState
    });

    if (state === null || state !== storedState) {
        console.error('State mismatch');
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
                    redirect_uri: redirect_uri
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Spotify API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                return res.status(response.status).send(`Spotify API error: ${errorData.error_description || response.statusText}`);
            }

            const data = await response.json();
            console.log('Token exchange successful');

            if (data.access_token) {
                const sessionId = uuid.v4();
                spotifyUsers[sessionId] = { spotifyToken: data.access_token };
                setAuthCookie(res, sessionId);
                
                // Clear auth cookie
                res.clearCookie('spotifyState', {
                    path: '/',
                    domain: '.musictaste.click'
                });
                
                res.redirect('/analyze');
            } else {
                console.error('Token exchange error - no access token');
                return res.status(400).send('Failed to exchange code for token');
            }

        } catch (error) {
            console.error('Error during token exchange:', error);
            res.status(500).send('Internal error during Spotify authentication. Please try again.');
        }
    } else {
        console.error('No code received from Spotify');
        res.status(400).send('No authorization code received from Spotify');
    }
});

// User storage
const users = new Map();

// Helper function to find a user by a specific field
function findUser(field, value) {
    return Array.from(users.values()).find(user => user[field] === value);
}

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// User login/account creation endpoint
apiRouter.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
        if (!username || !password) {
         return res.status(400).json({ error: 'Username and password are required' });
    }
    let user = users.get(username);
    
    // If user doesn't existcreate new account
    if (!user) {
        user = {
            username,
            password,
            token: null
        };
        users.set(username, user);
    }
    
    // Check password
    if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate session token
        user.token = uuid.v4();
        setAuthCookie(res, user.token);
        res.json({ username: user.username });
});

// Check authentication status
apiRouter.get('/auth/check-auth', (req, res) => {
    const authToken = req.cookies[authCookieName];
    
    // Check for regular user
    const user = findUser('token', authToken);
    if (user) {
        return res.status(200).json({ authenticated: true, username: user.username });
    }
    //check  for Spotify user
    if (authToken && spotifyUsers[authToken]) {
        return res.status(200).json({ authenticated: true });
    }
    
    res.status(401).json({ authenticated: false });
});

// Logout endpoint
apiRouter.delete('/auth/logout', (req, res) => {
    const authToken = req.cookies[authCookieName];
    const user = findUser('token', authToken);
    
    if (user) {
        user.token = null;
        }

res.clearCookie(authCookieName);
    res.status(204).end();
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

apiRouter.get('/spotify/me', async (req, res) => {
    const authToken = req.cookies[authCookieName];
  
    if (authToken && spotifyUsers[authToken]) {
      const sessionId = authToken;
      const accessToken = spotifyUsers[sessionId]?.spotifyToken;
  
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          console.error('Failed to fetch user profile from Spotify API:', response.status);
          return res.status(response.status).send('Failed to fetch Spotify profile');
        }
        const data = await response.json();
        res.json({ 
          displayName: data.display_name, 
          id: data.id,
          accessToken: accessToken // Include the access token in the response
        });
      } catch (error) {
        console.error('Error fetching user profile from Spotify API:', error);
        res.status(500).send('Error fetching Spotify profile');
      }
    } else {
      res.status(401).send('Unauthorized');
    }
});

// Store a users score
apiRouter.post('/leaderboard', async (req, res) => {
    const authToken = req.cookies[authCookieName];
    
    // Check for either Spotify user or regular user
    const spotifyUser = spotifyUsers[authToken];
    const regularUser = findUser('token', authToken);
    
    if (!spotifyUser && !regularUser) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { score, displayName } = req.body;
    if (!score || !displayName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add or update the users score
    const existingIndex = leaderboard.findIndex(entry => entry.displayName === displayName);
    if (existingIndex >= 0) {
        leaderboard[existingIndex].score = score;
    } else {
        leaderboard.push({ displayName, score });
    }

    // descending sort
    leaderboard.sort((a, b) => b.score - a.score);

    // top 10 scores
    leaderboard = leaderboard.slice(0, 10);

    res.json({ success: true });
});

// Get the leaderboard
apiRouter.get('/leaderboard', (req, res) => {
    res.json(leaderboard);
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

async function fetchSpotData(accessToken) {
    try {
        const response = await fetch(
            'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch Spotify data: ${response.status}`);
        }

        const data = await response.json();
        return data.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            popularity: track.popularity,
        }));
    } catch (err) {
        console.error('Error in fetchSpotData:', err);
        throw new Error('Error fetching Spotify data: ' + err.message);
    }
}

function calcScore(spotData) {
    if (!spotData || !spotData.length) {
        throw new Error('No tracks found');
    }

    // Simply return the average popularity (0-100)
    return spotData.reduce((sum, track) => sum + track.popularity, 0) / spotData.length;
}
