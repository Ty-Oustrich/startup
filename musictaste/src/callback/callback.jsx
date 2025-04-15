import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Callback() {
    const navigate = useNavigate();
    useEffect(() => {
        console.log('Callback: Processing hash');
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            console.log('Token:', token);
            if (token) {
                localStorage.setItem('spotifyToken', token);
                console.log('Stored spotifyToken:', token);
                window.location.hash = '';
                navigate('/analyze');
            } else {
                console.error('No token in hash');
                navigate('/login');
            }
        } else {
            console.error('No hash in URL');
            navigate('/login');
        }
    }, [navigate]);
    return <div>Redirecting...</div>;
}