import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

//remove dash from name
export function Analyze(){
    const [status, setStatus] = useState('Waiting for analysis..');
    const [score, setScore] = useState('---');
    const [taste, setTaste] = useState('basic/unique');
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch('/api/spotify/me');
                if (response.ok) {
                    const data = await response.json();
                    setAccessToken(data.accessToken);
                    setStatus('Ready to analyze');
                } else {
                    setError('Please log in to Spotify');
                    setStatus('Authentication required');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setError('Authentication error. Please try again.');
                setStatus('Error');
            }
        }
        checkAuth();
    }, []);

    const analyzeClick = async () => {
        console.log('analyzeClick triggered');
        setStatus('Analyzing...');
        setError(null);

        try {
            // Fetch Spotify data
            const spotData = await fetchSpotData();
            console.log('Fetched Spotify data:', spotData);

            // Calculate score based on popularity
            const calculatedScore = calcScore(spotData);
            console.log('Calculated score:', calculatedScore);

            // Determine taste based on score
            const tasteResult = determineTaste(calculatedScore);
            console.log('Determined taste:', tasteResult);

            // Update states
            setScore(calculatedScore.toFixed(2));
            setTaste(tasteResult);
            setStatus('Analysis complete!');

            // Submit to leaderboard
            try {
                const response = await fetch('/api/leaderboard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        score: calculatedScore,
                        displayName: 'Your Name'
                    }),
                });

                if (!response.ok) {
                    console.error('Failed to submit to leaderboard');
                }
            } catch (err) {
                console.error('Error submitting to leaderboard:', err);
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Failed to analyze music. Please try again.');
            setStatus('Error in analysis');
        }
    };
    

    //Frontend calls third party service endpoints
  async function fetchSpotData() {
    try {
        // Fetch user's top 50 tracks (short_term)
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
            throw new Error(`Failed to fetch Spotify data: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw Spotify data:', data);
        return data.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            popularity: track.popularity, // Spotify's popularity score (0-100)
        }));
    } catch (err) {
        console.error('Error in fetchSpotData:', err);
        throw new Error('Error fetching Spotify data: ' + err.message);
    }
}


  function calcScore(spotData) {
    if (!spotData || !spotData.length) {
        throw new Error('No tracks found');
    }

    // Simply return the average popularity (0-100)
    return spotData.reduce((sum, track) => sum + track.popularity, 0) / spotData.length;
  }
  
  function determineTaste(calculatedScore) {
    if (calculatedScore >= 90) return 'extremely popular';
    if (calculatedScore >= 75) return 'very popular';
    if (calculatedScore >= 50) return 'somewhat popular';
    if (calculatedScore >= 25) return 'somewhat niche';
    return 'very niche';
  }


    return(
    <div className="bg-dark text-light min-vh-100">
      <main className="container my-5">
        <div className="row justify-content-center"> 
          <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                <button id="analyze-btn" 
                className="btn btn-info btn-lg mb-4"
                onClick={analyzeClick}
                disabled={!accessToken}
                >Analyze my music
                </button>
                {error && <p className="text-danger">{error}</p>}
                
                <h2 id="status" className="h3">
                  {status}
                </h2>

                <h2 className="h3">
                Your Score: <span id="score">{score}</span>
                </h2>
                <p className="lead">
                Your music taste is: <span id="taste">{taste}</span>
                </p> 
          </div>
        </div>
      </main>
    </div>
    );

}