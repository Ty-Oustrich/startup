import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Leaderboard(){
    const [leaderboardData, setLeaderboardData] = useState(['Loading...']);
  // Placeholder for leaderboard data (from WebSocket/API)
  useEffect(() => {
    // actual data fetching logic

    //mocked out here
    // remove when done... setTimeout to simulate data loading
    setTimeout(() => {
      setLeaderboardData(['User1: 95%', 'User2: 90%', 'User3: 85%']); // Example data
    }, 2000); // Simulate 2 seconds loading
  }, []);
    

    return(
          <div className="bg-dark text-light min-vh-100">

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
      

          </div>
        );

}