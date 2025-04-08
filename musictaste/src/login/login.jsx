import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import '../app.css'

export function Login(){
    const clientId = '640a1bf34e8349a2b748b0e6c68dbec5';
    //this url could be wrong
    const redirectUri = 'https://startup.musictaste.click/';
    const scopes = 'user-read-private user-read-email user-top-read'
    //login button click
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleSpotifyLogin = () => {
      const state = generateRandomString(16);
      localStorage.setItem('spotifyState', state); // Stores state... verification
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
      window.location = authUrl;
    }

    const handleLogout = () => {
      localStorage.removeItem('spotifyToken');
      setToken(null);
      setUserName('');
  };

    const generateRandomString = (length) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
  };


  useEffect(() => {
    const storedToken = localStorage.getItem('spotifyToken');
    if (storedToken && !token) {
        setToken(storedToken);
        fetchUserProfile(storedToken).catch(() => {
            localStorage.removeItem('spotifyToken');
            setToken(null);
            console.log('Token expired, please log in again.');
        });
    }
  }, [token]);



  const fetchUserProfile = async (accessToken) => {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUserName(data.display_name || data.id);
        setError(null); // Clear error on success
    } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to log in. Please try again.');
        throw error; // Rethrow
    }
};

    /*checks the URL hash for a Spotify
     access token (after redirect), 
     extracts it, logs it, stores it in 
     localStorage, then clears the hash.*/ 
     useEffect(() => {
      const getTokenFromUrl = () => {
          const hash = window.location.hash;
          if (hash) {
              const params = new URLSearchParams(hash.substring(1));
              const token = params.get('access_token');
              const state = params.get('state');
              const storedState = localStorage.getItem('spotifyState');

              if (state !== storedState) {
                  console.error('State mismatch. Possible CSRF attack.');
                  return;
              }

              if (token) {
                  console.log('Access Token:', token);
                  setToken(token);
                  localStorage.setItem('spotifyToken', token);
                  window.location.hash = '';
                  fetchUserProfile(token).then(() => {
                      navigate('/analyze'); // Redirect to analyze page
                  }).catch((error) => {
                      console.error('Login failed:', error);
                  });
              }
          }
      };
      getTokenFromUrl();
  }, [navigate]);

      return(
        <div className="bg-dark text-light min-vh-100">

            <main className="container my-5">
            <div className="row justify-content-center">
        <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
        {!token ? (
            <button
                id="login-btn"
                className="btn btn-success btn-lg mb-4"
                onClick={handleSpotifyLogin}
            >
                Login with Spotify
            </button>
        ) : (
            <button
                className="btn btn-danger btn-lg mb-4"
                onClick={handleLogout}
            >
                Logout
            </button>
        )}
          {error && <p className="text-danger">{error}</p>}
          {userName && <p className="lead">Welcome, {userName}!</p>}
          <h2 className="h3">Analyze your music taste</h2>
          <h2 className="h3">Compare with others</h2>
          <p className="lead">
            An algorithm will determine how basic your music taste is based on the popularity of the songs you listen to.
            To get started, click the button above to log in with your Spotify account.
          </p>
        </div>
      </div>
            </main>

            

            </div>
        );




}

