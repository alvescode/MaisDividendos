import React from 'react';

function Card({ longName, symbol, regularMarketPrice }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Card Título</h2>
      </div>
      <div className="card-body">
        <p>Informação A: {longName}</p>
        <p>Informação B: {symbol}</p>
        <p>Informação C: {regularMarketPrice}</p>
      </div>
    </div>
  );
}

export default Card;
