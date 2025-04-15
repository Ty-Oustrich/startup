import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Analyze } from './analyze/analyze';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';
import { EggPage } from './egg/egg';


 function App() {
    return (
        <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
        <header className="bg-dark text-light py-4 text-center">
          <h1 className="display-4">Is your music taste basic?</h1>
          <img
            src="musictaste.png"
            alt="musictaste.click logo"
            className="img-fluid rounded"
            style={{ maxWidth: '300px' }}
          />
          
        </header>
        <nav className="navbar navbar-expand navbar-dark">
                 <ul className="navbar-nav mx-auto gap-3">
                 <li className="nav-item">
                       <NavLink to="/" className="nav-link fs-3 fw-bold text-light">
                         Login
                       </NavLink>
                     </li>
                     <li className="nav-item">
                       <NavLink to="/analyze" className="nav-link fs-3 fw-bold text-light">
                         Analyze
                       </NavLink>
                     </li>
                     <li className="nav-item">
                       <NavLink to="/leaderboard" className="nav-link fs-3 fw-bold text-light">
                         Leaderboard
                       </NavLink>
                     </li>
                     <li className="nav-item">
                       <NavLink to="/about" className="nav-link fs-3 fw-bold text-light">
                         About
                       </NavLink>
                     </li>
                 </ul>
               </nav>
        </header>
  
        <Routes>
            <Route path='/' element={<Login />} exact />
            <Route path='/analyze' element={<Analyze />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
            <Route path="/egg" element={<EggPage />} />
        </Routes>  
        
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
      </BrowserRouter>

      
    );
    function NotFound() {
        return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
      }
  }


  export default App