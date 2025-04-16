import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const response = await fetch('/api/leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data = await response.json();
                setLeaderboardData(data);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Failed to load leaderboard');
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <div className="bg-dark text-light min-vh-100">
            <main className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                        <h2 className="h3">Leaderboard</h2>
                        {loading ? (
                            <p>Loading leaderboard...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <ul id="Leaderboard" className="list-unstyled">
                                {leaderboardData.map((entry, index) => (
                                    <li key={index} className="mb-2">
                                        {index + 1}. {entry.displayName}: {entry.score.toFixed(2)}%
                                    </li>
                                ))}
                                {leaderboardData.length === 0 && (
                                    <li>No scores yet. Be the first to analyze your music!</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}