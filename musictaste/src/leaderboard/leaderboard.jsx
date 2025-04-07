import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Leaderboard(){
    const [leaderboardData, setLeaderboardData] = useState(['Loading...']);
  // Placeholder for leaderboard data (from WebSocket/API)
  useEffect(() => {
    // Replace with actual data fetching logic
    // remove when done... setTimeout to simulate data loading
    setTimeout(() => {
      setLeaderboardData(['User1: 95%', 'User2: 90%', 'User3: 85%']); // Example data
    }, 2000); // Simulate 2 seconds loading
  }, []);
    

    return(
          <div className="bg-dark text-light">
            <header className="bg-dark text-light py-4 text-center">
              <h1 className="display-4">Music taste analyzer for Spotify</h1>
              <img src="/musictaste.png" alt="musictaste.click logo" className="img-fluid rounded" style={{ maxWidth: '300px' }} />
      
              
            </header>
            <main className="container my-5">
              <div className="row justify-content-center">
                <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                  <h2 className="h3">percentile placeholder</h2>
                  <h2 className="h3">Leaderboard</h2>
                  <ul id="Leaderboard" className="list-unstyled">
                  {leaderboardData.map((item, index) => ( //websocket placeholder?
                <li key={index}>{item}</li>
              ))}
            </ul>
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