import React, { useEffect, useState } from 'react';
import StockGraph from './stockgraph';

const Watchlist = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users/stocks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('couldnt load stocks');
        }
        const result = await response.json();
        setStocks(result);
      } catch (err) {
        setError(err.message || 'couldnt load stocks');
        console.error(err);
      }
    };

    fetchStocks();
  }, []);

  const handleDeleteStock = async (stockId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/stocks/${stockId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Error deleting stock');
      }

      setStocks(prevStocks => prevStocks.filter(stock => stock.id !== stockId));
      setSuccessMessage('Stock removed from watchlist!');
    } catch (error) {
      console.error('Failed to delete stock:', error);
      alert('Error deleting stock. Please try again.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <h2 className="title">Watchlist</h2>
      {successMessage && <div>{successMessage}</div>}
      <div className="container">
        {stocks.length > 0 ? (
          stocks.map(stock => (
            <div key={stock.id} className="stock-graph">
              <StockGraph 
                stockSymbol={stock.tikr} 
              />
              <button onClick={() => handleDeleteStock(stock.id)} className='deletebutton'>Delete Stock</button>
            </div>
          ))
        ) : (
          <p>No stocks in your watchlist.</p>
        )}
      </div>
    </>
  );
};

export default Watchlist;