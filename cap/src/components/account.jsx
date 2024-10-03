import React, { useEffect, useState } from 'react';

export default function Account() {
    const [user, setUser] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            console.log(token);
            try {
                const response = await fetch('http://localhost:3000/api/users/me', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user details.');
                }

                const result = await response.json();
                setUser(result);
                await fetchUserStocks(result.id);
                await fetchUserReviews(result.id);
            } catch (err) {
                setError(err.message || 'Failed to fetch user details.');
            }
        };

        fetchUserDetails();
    }, []);

    const fetchUserStocks = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/users/stocks`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stocks.');
            }

            const result = await response.json();
            setStocks(result);
        } catch (err) {
            setError(err.message || 'Failed to fetch stocks.');
        }
    };

    const fetchUserReviews = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/reviews`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reviews.');
            }

            const result = await response.json();
            setReviews(result);
        } catch (err) {
            setError(err.message || 'Failed to fetch reviews.');
        }
    };

    const handleLogout = () => {
        window.location.reload();
    };

    return (
        <>
            <h2 className="title">Account</h2>
            {error && <p className="error">{error}</p>}
            {user && <h3 className='title'>Welcome, {user.username}</h3>}
            <div className='account-details'>    

                <h3>Your Stocks</h3>
                {stocks.length === 0 ? (
                    <p>No stocks saved.</p>
                ) : (
                    <ul>
                        {stocks.map(stock => (
                            <li key={stock.id}>
                                {stock.tikr}
                            </li>
                        ))}
                    </ul>
                )}

                <h3>Your Reviews</h3>
                {reviews.length === 0 ? (
                    <p>No reviews found.</p>
                ) : (
                    <ul>
                        {reviews.map(review => (
                            <li key={review.id}>
                                <strong>{review.tikr}</strong>: {review.content}
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={handleLogout}
                className='logoutbutton'>Logout</button>
            </div>
        </>
    );
}
