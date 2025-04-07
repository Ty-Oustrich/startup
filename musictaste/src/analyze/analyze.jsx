import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

//remove dash from name
export function Analyze(){
    const [status, setStatus] = useState('Waiting for analysis...');
    const [score, setScore] = useState('---');
    const [taste, setTaste] = useState('basic/unique');
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

  async function fetchSpotData(){
    //get data
    return [];
  }
  
  async function fetchChartData(){
    //the data to compare users listneing to
    return [];
  }

  function calcScore(spotData, chartData){
    //process score, return the score
    return 0;
  }
  
  function determineTaste(calculatedScore) {
    //basic/unique based on score
    return 'basic/unique';
  }


    return(
        <div className="bg-dark text-light min-vh-100">
        <header className="bg-dark text-light py-4 text-center">
          <h1 className="display-4">Is your music taste basic?</h1>
          <img src="/musictaste.png" alt="musictaste.click logo" className="img-fluid rounded" style={{ maxWidth: '300px' }}/>
            </header>

            <main className="container my-5">
        <div className="row justify-content-center"> 
            <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                <button id="analyze-btn" className="btn btn-info btn-lg mb-4">Analyze my music</button>
                <h2 id="status" className="h3">Waiting for analysis...</h2>
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