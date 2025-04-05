import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import '../app.css'

export function Login(){
    const clientId = '640a1bf34e8349a2b748b0e6c68dbec5';
    const redirectUri = 'https://startup.musictaste.click/explain-start.html';
    const scopes = 'user-read-private user-read-email user-top-read'
    //login button click
    const [userName, setUserName] = useState('');
    const handleSpotifyLogin = () => {
        //is authUrl endpoint proper????????
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
            <main className="container my-5">
            <div className="row justify-content-center">
        <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
          <button
            id="login-btn"
            className="btn btn-success btn-lg mb-4"
            onClick={handleSpotifyLogin}
          >Login with Spotify
          </button>
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
            <footer className="bg-light text-dark text-center py-3 fixed-bottom">
      <h3 className="h5">Creator: Tyler Oustrich</h3>
      <a
        href="https://github.com/Ty-Oustrich?tab=repositories"
        target="_blank"
        rel="noopener noreferrer"
        className="text-success fw-bold"
      >
        Github
      </a>
    </footer>
            </div>
        );




}

