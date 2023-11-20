import {useEffect,useState} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import {Wallet} from '../Wallet';

const axiosb = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 1000,
  headers: {},
});

const UserArea = ()=>{
  const [userInfo,setUserInfo]  = useState({nome:''}) 
  const navigate = useNavigate()
  
  const botao_nova_carteira = ()=>{
    console.log('click')
    navigate("/newWallet") //deve ser uma nested route
  }

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const token = Cookies.get('tokenMD')
        // setToken(token); //é uma var local
        const response = await axiosb.post('/userArea',{token:token})
        const {data_from_db} = response.data.data 
        console.log('r',data_from_db)
        setUserInfo(data_from_db)
      }
      catch(err){
        console.log('erro',err)
      }
    }
    fetchData();
  },[])

  return(
    <div>
      <h1>
        Seja bem vindo, {userInfo.nome}.
      </h1>
      {
        userInfo.id_carteira ? 
        <div>
        <Wallet></Wallet>
        {/* <h2>Tem carteira</h2> //renderizar os cards com as ações da carteira */}
          </div>
        :
        <div>
        <button onClick={botao_nova_carteira}>Crie sua carteira</button> 
        </div>
      }
    </div>
  )
}

export default UserArea;