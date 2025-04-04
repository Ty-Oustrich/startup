import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

//remove dash from name
export function explainStart(){
    const [status, setStatus] = useState('Waiting for analysis...');
    const [score, setScore] = useState('---');
    const [taste, setTaste] = useState('0-100');
    const [error, setError] = useState(null);

    const analyzeClick = async () => {
      setStatus('Analyzing...');
      setError(null);
    

    try {
        //fetch the data from spotify
        //process it
    } catch{
      //catch errrors
    }
  };

  


    return(
        <div className="bg-dark text-light min-vh-100">
        <header className="bg-dark text-light py-4 text-center">
          <h1 className="display-4">Is your music taste basic?</h1>
          <img src="/musictaste.png" alt="musictaste.click logo" className="img-fluid rounded" style={{ maxWidth: '300px' }}/>
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
                <button id="analyze-btn" class="btn btn-info btn-lg mb-4">Analyze my music</button>
                <h2 id="status" class="h3">Waiting for analysis...</h2>
                <h2 className="h3">Your Score: <span id="score">---</span></h2> 
                <p className="lead">Your music taste is: <span id="taste">basic/unique</span></p> 
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