import React, { useState, useEffect } from 'react';

const Reviews = () => {
    const [content, setContent] = useState('');
    const [tikr, setTikr] = useState('');
    const [reviews, setReviews] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [commentContent, setCommentContent] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            await fetchCurrentUser();
            await fetchReviews();
        };
        fetchData();
    }, []);

    const fetchReviews = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/reviews', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setReviews(result);
            } else {
                throw new Error('Error getting reviews.');
            }
        } catch (error) {
            setError("Error fetching reviews.");
            console.error("Error fetching reviews:", error);
        }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                setCurrentUserId(result.id);
            } else {
                throw new Error('Error fetching current user.');
            }
        } catch (error) {
            setError("Error fetching current user.");
            console.error("Error fetching current user:", error);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/users/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content, tikr })
            });

            if (response.ok) {
                setContent('');
                setTikr('');
                fetchReviews();
            } else {
                throw new Error('Error submitting review.');
            }
        } catch (error) {
            setError("Error submitting review.");
            console.error("Error submitting review:", error);
        }
    };

    const deleteReview = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/users/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchReviews();
            } else {
                throw new Error('Error deleting review.');
            }
        } catch (error) {
            setError("Error deleting review.");
            console.error("Error deleting review:", error);
        }
    };

    const submitComment = async (reviewId) => {
        const token = localStorage.getItem('token');
        const comment = commentContent[reviewId] || '';
        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: comment })
            });

            if (response.ok) {
                setCommentContent(prev => ({ ...prev, [reviewId]: '' }));
                fetchReviews(); 
            } else {
                throw new Error('Error submitting comment.');
            }
        } catch (error) {
            setError("Error submitting comment.");
            console.error("Error submitting comment:", error);
        }
    };

    const deleteComment = async (reviewId, commentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchReviews();
            } else {
                throw new Error('Error deleting comment.');
            }
        } catch (error) {
            setError("Error deleting comment.");
            console.error("Error deleting comment:", error);
        }
    };

    const handleCommentChange = (reviewId, value) => {
        setCommentContent(prev => ({ ...prev, [reviewId]: value }));
    };

    return (
        <div className='review'>
            <h2>Submit a Review</h2>
            <form onSubmit={submitReview}>
                <input 
                    type="text" 
                    placeholder="Enter Tikr" 
                    value={tikr} 
                    onChange={(e) => setTikr(e.target.value)} 
                    required 
                />
                <br />
                <textarea
                    placeholder='Enter Review' 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                />
                <br />
                <button type="submit">Submit Review</button>
            </form>
            <h2>Reviews</h2>
            {reviews.map((review) => (
                <div key={review.id} className="review-item">
                    {review.tikr && <p><strong>Tikr:</strong> {review.tikr}</p>}
                    <p>
                        <strong>{review.user ? review.user.username : 'Unknown User'}:</strong> {review.content}
                    </p>
                    {review.userId === currentUserId && (
                        <button onClick={() => deleteReview(review.id)} className="formbutton">
                            Delete Review
                        </button>
                    )}
                    <h3>Comments</h3>
                    {review.comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <strong>{comment.user ? comment.user.username : 'Unknown User'}:</strong> 
                            {comment.content}
                            <br />
                            {comment.userId === currentUserId && (
                                <button onClick={() => deleteComment(review.id, comment.id)} className="deletecomment">
                                    Delete Comment
                                </button>
                            )}
                        </div>
                    ))}
                    <form onSubmit={(e) => { e.preventDefault(); submitComment(review.id); }}>
                        <input 
                            type="text" 
                            placeholder="Add a comment" 
                            value={commentContent[review.id] || ''} 
                            onChange={(e) => handleCommentChange(review.id, e.target.value)} 
                            required 
                        />
                        <br />
                        <button type="submit" className='formbutton'>Comment</button>
                    </form>
                </div>
            ))}
        </div>
    );
};

export default Reviews;
