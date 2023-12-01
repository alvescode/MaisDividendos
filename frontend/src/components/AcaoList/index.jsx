import React from 'react';
import { CardAcao } from '../AcaoCard/index';

const AcaoList = ({ lista }) => {
  return(
    <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'center'}}>
      {
        lista.map((acao)=>{
          return(
            <CardAcao key={acao.id_acao} acao={acao}/>
          )
        })
      }
    </div>
  )

};

export default AcaoList;
