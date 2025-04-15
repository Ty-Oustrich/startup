import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

//remove dash from name
export function Analyze(){
    const [status, setStatus] = useState('Waiting for analysis...');
    const [score, setScore] = useState('---');
    const [taste, setTaste] = useState('basic/unique');
    const [error, setError] = useState(null);


    const accessToken = '...ACCESS_TOKEN...'; // Replace token

    const analyzeClick = async () => {
      setStatus('Analyzing...');
      setError(null);

      try {
          // Fetch Spotify data and chart data
          const spotData = await fetchSpotData();

          const calculatedScore = calcScore(spotData, chartData);
          const tasteResult = determineTaste(calculatedScore);

          // update states
          setScore(calculatedScore.toFixed(2));
          setTaste(tasteResult);
          setStatus('Analysis complete!');
      } catch (err) {
          setError('Failed to analyze music. try again.');
          setStatus('Error');
          console.error(err);
      }
  };
    


  async function fetchSpotData() {
    try {
        // Fetch user's top 50 tracks (short_term for recent listening)
        const response = await fetch(
            'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50',
            {
              //headers could be wrong
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch Spotify data');
        }
        const data = await response.json();
        return data.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            popularity: track.popularity, // Spotify's popularity score (0-100)
        }));
    } catch (err) {
        throw new Error('Error fetching Spotify data: ' + err.message);
    }
}


  function calcScore(spotData, chartData){
    if (!spotData.length) return 0;

    const avgPopularity = spotData.reduce((sum, track) => sum + track.popularity, 0) /
    spotData.length;
    return 100 - avgPopularity;
  }
  
  function determineTaste(calculatedScore) {
        if (calculatedScore >= 90) return 'extremely unique';
        if (calculatedScore >= 75) return 'very unique';
        if (calculatedScore >= 50) return 'somewhat basic unique';
        if (calculatedScore >= 25) return 'pretty basic basic';
        return 'very basic';  
  }


    return(
    <div className="bg-dark text-light min-vh-100">
      <main className="container my-5">
        <div className="row justify-content-center"> 
          <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                <button id="analyze-btn" 
                className="btn btn-info btn-lg mb-4"
                onClick={analyzeClick}
                >Analyze my music</button>
                <h2 id="status" className="h3">Waiting for analysis...</h2>
                <h2 className="h3">Your Score: <span id="score">---</span></h2> 
                <p className="lead">Your music taste is: <span id="taste">basic/unique</span></p> 
          </div>
        </div>
      </main>



    </div>
    );

}