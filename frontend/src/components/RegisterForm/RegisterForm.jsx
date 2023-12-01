import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import server from "../../axios"

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: "",
    usuario:"",
    email: "",
    senha: "",
  }); //refactoring: useReducer((state,action)=>{return{newobject}},initialState,function_init)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await server.post("/register", formData);
      if(data.msg === "Usuário cadastrado com sucesso!"){
        Cookies.set('tokenMD',data.token,{expires:1})
        navigate("/user_area");
      }
    } catch (error){
      console.log("Erro na conexão com o server, erro: ",error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h1>Cadastre-se</h1>
      <form
        onSubmit={(e) => handleSubmit(e)}
        style={{ flexDirection: "column" }}
      >
        <div style={{ flexDirection: "column" }}>
          <div>
            <label htmlFor="nome">Nome Completo </label>
          </div>
          <input
            type="text"
            id="nome"
            name={"nome"}
            className="input-box"
            value={formData["nome"]}
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>
        <div style={{ flexDirection: "column" }}>
          <div>
            <label htmlFor="usuario">Nome de Usuário </label>
          </div>
          <input
            type="text"
            id="usuario"
            name={"usuario"}
            value={formData["usuario"]}
            className="input-box"
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>

        <div>
          <div>
            <label htmlFor="email">Email </label>
          </div>
          <input
            type="email"
            className="input-box"
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
            type="password"
            id="senha"
            className="input-box"
            name={"senha"}
            value={formData["senha"]}
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>
        <button type="submit" className="enviar-btn">Enviar</button>
      </form>
    </div>
  );
};

export default RegisterForm;
