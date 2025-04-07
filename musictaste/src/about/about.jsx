import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function About(){



    return(
        <div className="bg-dark text-light min-vh-100">

        
            <main className="container my-5">
        <div className="row justify-content-center">
            <div className="col-md-8 bg-white text-dark rounded shadow p-4 text-center">
                <h2 className="h3">about</h2>
                <p> Your top 50 songs are compared to the top 50 songs on the current charts. For every song in both lists a point is added, meaning, you are more basic.
                    If your top genres are the most popular genres, points are added.
                    
                </p>
            </div>
        </div>
    </main>


    </div>
    );

}