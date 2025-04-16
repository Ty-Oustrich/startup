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

// Static files
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

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
