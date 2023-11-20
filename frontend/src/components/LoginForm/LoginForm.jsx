import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

const banco = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 1000,
  headers: {},
});


const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', senha: '', });
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await banco.post("/login", formData);
      console.log('Login Form -> Resposta : ',data)
      //fazer todas as requisições com o uso do token
      
      
      const objeto = data.data.result
      console.log(objeto)
      if(data.msg === 'Autenticado com sucesso!'){
          Cookies.set('tokenMD', data.token, { expires: 1 }); // Expira em 1 dia (ajuste conforme necessário)
        // window.location.href = '/userarea'; //alternativa
        navigate(`/userarea`);
      }
    } catch(error){
      console.log("deu errado a conexão com o server, erro:",error.message);
    }
  };

  const refactoring_handleSubmit = (e) => {
    e.preventDefault();
    //1.pegar dados do form 2.mostrar na tela e enviar para o server na rota /login com POST
    //3.receber e armazenar o token
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Login</h2>
      <form
        onSubmit={(e) => handleSubmit(e)}
        style={{ flexDirection: "column" }}
      >
        <div style={{ flexDirection: "column" }}>
          <div>
            <label htmlFor="email">Email </label>
          </div>
          <input
            type="email"
            id="email"
            name={"email"}
            value={formData["email"]}
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>

        <div>
          <div>
            <label htmlFor="senha">Senha </label>
          </div>
          <input
            type="senha"
            id="senha"
            name={"senha"}
            value={formData["senha"]}
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default LoginForm;
