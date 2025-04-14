import React, { useState, useEffect } from 'react';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function EggPage() {
    return (
        <div className="bg-dark text-light min-vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="mb-4">Congratulations Superuser!</h1>
                <p className="lead">You have successfully logged in.</p>
            </div>
        </div>
    );
}