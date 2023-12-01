import {useEffect,useState} from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import {Wallet} from '../Wallet';
import server from '../../axios'

const UserArea = ()=>{
  const [userInfo,setUserInfo]  = useState({nome:''}) 
  const navigate = useNavigate()
  
  const botao_nova_carteira = async ()=>{
    try{
      const token = Cookies.get('tokenMD')
      const response = await server.post('/newWallet',{token:token})
      navigate('/')
    }
    catch(err){
      console.log('ERROO')
    }
  }

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const token = Cookies.get('tokenMD')
        const response = await server.post('/userArea',{token:token})
        const {data_from_db} = response.data.data 
        setUserInfo(data_from_db)
      }
      catch(err){
        console.log('erro',err)
      }
    }
    fetchData();
  },[])

  useEffect(()=>{
    console.log('User information: ',userInfo)
  },[userInfo])

  return( //PAREI AQUI FAZENDO UM LOAD PARA EVITAR A QUE USERINFO SEJA UNDEFINED
    <div>
      <h1>
        Seja bem vindo (a), {userInfo['nome']}.
        {/* //pegar apenas primeiro nome com maiuscula */}
      </h1>
      {
        userInfo['id_carteira'] ?
        <div>
          <Wallet id_carteira={userInfo['id_carteira']}></Wallet>
          {/* passar lista de acoes e fazer um map com cards */}
        </div>
         :
        <div>
          <button onClick={botao_nova_carteira} className="cadastro-btn">
            Crie sua carteira
          </button>
        </div>
      } 
      {/* exibir carteira */}
     
    </div>
  )
}

export default UserArea;