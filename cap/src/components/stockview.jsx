import React from 'react';
import StockGraph from './stockgraph';

const StockView = ({ stockSymbols, onSaveStock }) => {
  return (
    <div>
      <h2 className='title'>View</h2>
      <div className='container'>
        {stockSymbols.map((symbol) => (
          <StockGraph 
            key={symbol} 
            stockSymbol={symbol} 
            onSaveStock={onSaveStock} 
          />
        ))}
      </div>
    </div>
  );
};

export default StockView;
