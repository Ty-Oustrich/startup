import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Analyze } from './analyze/analyze';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';


export default function App() {
    return (
        <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark">
            <div className="navbar-brand">
              Simon<sup>&reg;</sup>
            </div>
            <menu className="navbar-nav">
                <li className="nav-item">
                <NavLink className="nav-link" to="">
                    Login
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link" to="analyze">
                    Analyze
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link" to="leaderboard">
                    Leaderboard
                </NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link" to="about">
                    About
                </NavLink>
                </li>
            </menu>
          </nav>
        </header>
  
        <Routes>
            <Route path='/' element={<Login />} exact />
            <Route path='/analyze' element={<Analyze />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
        </Routes>  
        
        <footer className="bg-light text-black-50">
          <div className="container-fluid">
            <span className="text-reset">Ty Oustrich</span>
            <a className="text-reset" href="https://github.com/Ty-Oustrich/startup">
              Source
            </a>
          </div>
        </footer>
      </div>
      </BrowserRouter>

      
    );
    function NotFound() {
        return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
      }
  }













