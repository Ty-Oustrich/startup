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
        <div className="bg-dark text-light min-vh-100">
        <header className="bg-dark text-light py-4 text-center">
          <h1 className="display-4">Is your music taste basic?</h1>
          <img
            src="musictaste.png"
            alt="musictaste.click logo"
            className="img-fluid rounded"
            style={{ maxWidth: '300px' }}
          />
          <nav className="navbar navbar-expand navbar-dark">
        <ul className="navbar-nav mx-auto gap-3">
          <li className="nav-item">
            <a href="/login" className="nav-link fs-3 fw-bold text-light">Login</a>
          </li>
          <li className="nav-item">
            <a href="/analyze" className="nav-link fs-3 fw-bold text-light">Analyze</a>
          </li>
          <li className="nav-item">
            <a href="/leaderboard" className="nav-link fs-3 fw-bold text-light">Leaderboard</a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link fs-3 fw-bold text-light">About</a>
          </li>
        </ul>
      </nav>
          </header>
          </div>
      );




}

