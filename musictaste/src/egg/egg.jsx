import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function EggPage() {
    return (
        <div className="bg-dark text-light min-vh-100 d-flex justify-content-center align-items-start">
            <div className="text-center p-4 rounded" style={{ backgroundColor: 'gold' }}>
            <h1 className="mb-4">Congratulations Superuser!</h1>
                <p className="lead">You have successfully logged in.</p>
            </div>
        </div>
    );
}