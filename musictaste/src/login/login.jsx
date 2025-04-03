import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import './app.css'

export function Login(){
    const clientId = '640a1bf34e8349a2b748b0e6c68dbec5';
    const redirectUri = 'https://startup.musictaste.click/explain-start.html';
    const scopes = 'user-read-private user-read-email user-top-read'
    //login button click
    const handleSpotifyLogin = () => {
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes}`;
        window.location = authUrl;
    }

    /*checks the URL hash for a Spotify
     access token (after redirect), 
     extracts it, logs it, stores it in 
     localStorage, then clears the hash.*/ 
    useEffect(() => {
        const getTokenFromUrl = () => {
          const hash = window.location.hash;
          if (hash) {
            const token = hash.split('&')[0].split('=')[1];
            console.log('Access Token:', token);
            // Store token (e.g., in localStorage or state) for later use
            localStorage.setItem('spotifyToken', token);
            // Optionally clear the hash from URL
            window.location.hash = '';
          }
        };
        getTokenFromUrl();
      }, []);

      return(

      );




}

