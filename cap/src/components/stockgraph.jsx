import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const StockGraph = ({ stockSymbol, showViewHeading = false, onSaveStock }) => {
  const [result, setResult] = useState([]);
  const [labels, setLabels] = useState([]);
  const API_KEY = '2TE5GNO48R9DOFJG';

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${API_KEY}&outputsize=compact`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const result = await response.json();
        const stockData = result['Time Series (Daily)'];
        if (!stockData) return;

        const dates = Object.keys(stockData);
        const prices = dates.map(date => parseFloat(stockData[date]['4. close']));

        if (prices.length > 0) {
          setLabels(dates.slice(0, 30).reverse());
          setResult(prices.slice(0, 30).reverse());
        }
      } catch (error) {
        console.error('Error fetching stock data for', stockSymbol, error);
      }
    };

    fetchStockData();
  }, [stockSymbol]);

  const handleSave = async () => {
    if (onSaveStock) {
      await onSaveStock(stockSymbol); 
      alert(`${stockSymbol} saved to watchlist!`);
    }
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: stockSymbol,
        data: result,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className='container2'>
      {showViewHeading && <h2>View</h2>}
      <h4>{stockSymbol}</h4>
      <Line data={chartData} />
      <button onClick={handleSave} className='formbutton'>Save Stock</button>
    </div>
  );
};

export default StockGraph;