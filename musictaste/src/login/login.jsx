import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css'

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Spotify login
    const handleSpotifyLogin = () => {
        window.location.href = '/login';
    };

    const handleLogout = () => {
        localStorage.removeItem('spotifyToken');
        setUsername('');
        setPassword('');
        setError(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
              const response = await fetch('/api/auth/check-auth');
              if (response.ok) {
                    const data = await response.json();
                  if (data.authenticated) {
                        if (data.username) {
                            setUsername(data.username);
                        }
                  } else {
                        setUsername('');
                      setPassword('');
                    }
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
              setUsername('');
                setPassword('');
            }
        };
        checkAuth();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
          const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
              body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Login failed');
            }
            const data = await response.json();
            setUsername(data.username);
            navigate('/egg');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-dark text-light min-vh-100">
            <main className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                    <h2 className="h3">Analyze your music taste</h2>
                    <h2 className="h3">Compare with others</h2>                       <p className="lead">
                            An algorithm will determine how basic your music taste is based on the popularity of the songs you listen to.
                            To get started, click the button above to log in with your Spotify account.
                        </p>
                        {!username ? (
                            <button
                                id="login-btn"
                                className="btn btn-success btn-lg mb-4"
                                onClick={handleSpotifyLogin}
                            >
                                Login with Spotify
                            </button>
                        ) : (
                            <button
                                className="btn btn-danger btn-lg mb-4"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                        {error && <p className="text-danger">{error}</p>}
                        {username && <p className="lead">Welcome, {username}!</p>}

                        <hr className="border-dark" />

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}