import React, { useState } from 'react';
import server from '../../axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const CreateStock = () => {
  
  const navigate = useNavigate()

  const [ticker, setTicker] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorPago, setValorPago] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const token = Cookies.get('tokenMD')
      const response = await server.post('/addStock',{token,ticker,quantidade,valorPago})
      navigate('/user_area')
    }
    catch(err){
      console.log('erro: ',err)
    }
};

  return (
    <div className="stock-form-container">
      <form onSubmit={handleSubmit} className="stock-form" style={{ flexDirection: "column" }}>
      <div style={{ flexDirection: "column" }}>
        <label htmlFor="ticker">Ticker da Ação:</label>
        <input
          type="text"
          id="ticker"
          className='input-box'
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
        />
      </div>
      <div style={{ flexDirection: "column" }}>
        <label htmlFor="quantidade">Quantidade Comprada:</label>
        <input
          type="text"
          className='input-box'
          id="quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
      </div>
      <div style={{ flexDirection: "column" }}>
        <label htmlFor="valorPago">Valor Pago:</label>
        <input
          className='input-box'
          type="text"
          id="valorPago"
          value={valorPago}
          onChange={(e) => setValorPago(e.target.value)}
        />
      </div>
        <button type="submit" className='adicionar-btn'>Enviar</button>
      </form>
    </div>
  );
};

export default CreateStock;
