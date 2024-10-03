import Navbar from './components/navbar';
import Watchlist from './components/watchlist';
import Reviews from './components/review';
import Register from './components/register';
import Login from './components/login';
import Account from './components/account';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './components/auth';
import StockView from './components/stockview';
import ProtectedRoute from './components/protected';

function App() {
    const stockSymbols = ['SPY', 'NDX', 'AAPL', 'TSLA', 'ARKK', 'AMZN', 'NFLX', 'GOOGL', ];

    const handleSaveStock = async (stockSymbol) => {
        console.log(`Saving stock: ${stockSymbol}`);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/users/stocks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ tikr: stockSymbol }),
            });

            if (!response.ok) {
                throw new Error('Failed to save stock');
            }

            const result = await response.json();
            console.log('Stock saved successfully:', result);
        } catch (error) {
            console.error('Failed to save stock:', error);
            alert('Error saving stock. Please try again.');
        }
    };

    return (
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route 
                    path='/view' 
                    element={<StockView stockSymbols={stockSymbols} onSaveStock={handleSaveStock} />} 
                />
                <Route 
                    path='/watchlist' 
                    element={<ProtectedRoute element={<Watchlist onSaveStock={handleSaveStock} />} />} 
                />
                <Route 
                    path='/reviews' 
                    element={<ProtectedRoute element={<Reviews />} />} 
                />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route 
                    path='/account' 
                    element={<ProtectedRoute element={<Account />} />} 
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;