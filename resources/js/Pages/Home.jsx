import React from 'react';

export default function Home({ message }) {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '2rem', color: '#333' }}>{message}</h1>
        </div>
    );
}