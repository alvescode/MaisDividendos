import { useEffect, useState } from "react"
import server from '../../axios'
import Cookies from "js-cookie"
import CardLista from  '../../components/AcaoList'
import { useNavigate } from "react-router-dom";

export const Wallet = (props)=>{
    const navigate = useNavigate()

    const [ListaDeAcoes,setListaDeAcoes] = useState([])
    const {id_carteira} = props

    useEffect(()=>{
        console.log(ListaDeAcoes)
    },[ListaDeAcoes])

    useEffect(()=>{
        const fetchData = async () =>{
            try{
              const token = Cookies.get('tokenMD')
              const response = await server.post('/wallet',{token:token,info:{id_carteira}})
              const lista = response.data.data
              setListaDeAcoes(lista)
            }
            catch(err){
              console.log('Erro',err)
            }
          }
          fetchData();
    },[])

    return(
        <div>
            <h2 style={{color:"green"}}>Controle Sua Carteira de Investimentos:</h2>
            <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems: 'center'}}>
                <button className="adicionar-btn" onClick={()=>{navigate("/create_stock")}}>Adicionar ação</button>
                <button className="editar-btn">Editar ação</button>
            </div>
            <CardLista lista={ListaDeAcoes}></CardLista>
        </div>
    )
}

export function NewWallet (){
    return(
        <div>

        </div>
    )
}

export default Wallet;