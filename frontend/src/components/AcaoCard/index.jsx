import React, { useEffect, useState } from 'react';
import './index.css'
import Cookies from 'js-cookie'
import server from '../../axios'

const AcaoCard = ({ acao }) => {
  const { nome, valorAtual, dividendYield,ticker, vpa, lucroLiquido } = acao;
  return (
    <div className="acao-card">
      <div className="acao-info">
        <h3>{nome + ' - '+ticker}</h3>
        <p>Valor Atual: {valorAtual}</p>
      </div>
      <div className="acao-metrics">
        <p>Dividend Yield: {dividendYield}%</p>
        <p>VPA: {vpa}</p>
        <p>Lucro Líquido (5 anos): {lucroLiquido}</p>
      </div>
    </div>
  );
};

export const CardAcao = ({acao}) =>{

  const [acaoInfo,setAcaoInfo] = useState(null)

  useEffect(()=>{console.log('info da acao mudou para: ',acaoInfo)},[acaoInfo])

  useEffect(()=>{
    const fetchData = async () =>{
        try{
          const token = Cookies.get('tokenMD')
          const response = await server.post('/stock2',{token:token,info:acao.id_acao})
          const infos = response.data.data
          setAcaoInfo(infos)
        }
        catch(err){
          console.log('Erro',err)
        }
      }
      fetchData();
},[])


  return(
    <div className="card">
  <div className="logo">
    <a>
      {/* colocar o site da empresa */}
      <img src={acaoInfo? acaoInfo['logourl']:null} alt="Logo da Empresa" />
    </a>
  </div>
  <div className="text">
    <div>
      <h2>{acaoInfo? acaoInfo['longName']:null}</h2>
      <h2 style={{color:'green'}}>{acaoInfo? acaoInfo['symbol']:null}</h2>
      <h4>Descrição ou informações adicionais da Empresa podem ser colocadas aqui.</h4>
    </div>
    <div>
      <h4>Preço Atual: R$<span>{acaoInfo? acaoInfo['regularMarketPrice']:null}</span></h4>
      <h4>Variação: <span>{acaoInfo? acaoInfo['regularMarketChangePercent']:null}</span>%</h4>
      {/* "priceEarnings": 3.49722289, // Preço da ação / Lucro por ação
      "earningsPerShare": 10.4968915, // Lucro por ação */}
    <button className="excluir-btn" onClick={()=>{
      try{
        const token = Cookies.get('tokenMD')
        server.post('/removeStock',{token:token,ticker:acaoInfo.symbol})
      }
      catch(err){
        console.log(err)
      }
    }}>Remover ação</button>
    </div>
  </div>
</div>

  )
}

export default AcaoCard;
