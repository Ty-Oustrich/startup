import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import '../app.css'

export function Login(){
    const clientId = '640a1bf34e8349a2b748b0e6c68dbec5';
    //this url could be wrong
    const redirectUri = 'https://startup.musictaste.click/callback';
    const scope = 'user-read-private user-read-email user-top-read'

    //login button click
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [superUsername, setSuperUsername] = useState('');
    const [superUserPassword, setSuperUserPassword] = useState('');
    const [isSuperUserLoggedIn, setIsSuperUserLoggedIn] = useState(false);
    const [superUserError, setSuperUserError] = useState(null);

    //spot auth flow
    const handleSpotifyLogin = () => {
        console.log('Initiating Spotify login via backend');
        const state = generateRandomString(16);
        localStorage.setItem('spotifyState', state); // Store state
        //pass in state
        window.location = `/login?state=${state}`;
    };

    const handleLogout = () => {
      localStorage.removeItem('spotifyToken');
      setToken(null);
      setUserName('');
      setError(null);
  };

    const generateRandomString = (length) => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
  };





  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check-auth');
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setToken(true); //bool of token state
            if (data.userName) {
              setUserName(data.userName);
            } else {
              fetchUserProfileFromBackend();
            }
          } 
          else {
            setToken(null);
            setUserName('');
          }
        } else {
          setToken(null);
          setUserName('');
          console.error('Failed to check authentication status');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setToken(null);
        setUserName('');
      }
    };
    checkAuth();
  }, []);


  const fetchUserProfileFromBackend = async () => {
    try {
      const response = await fetch('/api/spotify/me');
      if (response.ok) {
        const data = await response.json();
        setUserName(data.displayName || data.id);
        setError(null);
      } else {
        console.error('Failed to fetch user profile from backend');
        setError('Failed to load user info.');
      }
    } catch (error) {
      console.error('Error fetching user profile from backend:', error);
      setError('Failed to load user info.');
    }
  };


    const handleSuperUserLogin = async (event) => {
        console.log('super login function start')
        event.preventDefault(); //prevent page reload
        try{
            const response = await fetch('/api/auth/superuser-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: superUsername, password: superUserPassword }),
            });
            if (!response.ok) { //this is the backend response.
                throw new Error('Superuser login did not work');
            }
            //good login, navigate
            const data = await response.json();
            if (data.isSuperUser) {
            setIsSuperUserLoggedIn(true);
            navigate('/egg');
            }
            else{
                setSuperUserError('Invalid credentials...');
            }
        } catch (error){
            console.error('Superuser login error', error);
            setSuperUserError('Login failed :( ... are you a true superuser?')
        }
    };

    const handleSuperUserLogout = () => {
        setIsSuperUserLoggedIn(false);
        setSuperUsername('');
        setSuperUserPassword('');
        setSuperUserError(null);
    };

    /*checks the URL hash for a Spotify
     access token (after redirect), 
     extracts it, logs it, stores it in 
     localStorage, then clears the hash.*/ 
     

  useEffect(() => {
    if (token) {
        navigate('/analyze');
    }
}, [token, navigate]);//runs everytime token changes..

return(
    <div className="bg-dark text-light min-vh-100">

        <main className="container my-5">
        <div className="row justify-content-center">
    <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
    <h2 className="h3">Analyze your music taste</h2>
      <h2 className="h3">Compare with others</h2>
      <p className="lead">
        An algorithm will determine how basic your music taste is based on the popularity of the songs you listen to.
        To get started, click the button above to log in with your Spotify account.
      </p>
    {!token ? (
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
      {userName && <p className="lead">Welcome, {userName}!</p>}

      <hr className="border-dark" />


        <form onSubmit={handleSuperUserLogin} className="mt-4">
        <div className= "mb-0">
            <label className="form-label">Super Username</label>
            <input
                type="text"
                className="form-control"
                value={superUsername}
                onChange={(e) => setSuperUsername(e.target.value)}
            />
        </div>
        <div className="mb-2">
        <label className="form-label">Super Password</label>
        <input
            type="password"
            className="form-control"
            value={superUserPassword}
            onChange={(e) => setSuperUserPassword(e.target.value)}
        />
    </div>
    <button type="submit" className="btn btn-primary">Superuser Login</button>

        </form>

        
          <button className="btn btn-danger mt-4" onClick={handleSuperUserLogout}>
          Superuser Logout
          </button>
        

        {superUserError && <p className="text-danger mt-4">{superUserError}</p>}




    </div>
  </div>
        </main>


        </div>
    );
}