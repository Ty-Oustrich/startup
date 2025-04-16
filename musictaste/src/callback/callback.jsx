import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Callback() {
    const navigate = useNavigate();
    
    useEffect(() => {
        // The backend will handle the token exchange and redirect
        // We just need to wait for the redirect to /analyze
        console.log('Callback: Waiting for backend processing');
    }, [navigate]);

    return <div>Processing authentication...</div>;
}