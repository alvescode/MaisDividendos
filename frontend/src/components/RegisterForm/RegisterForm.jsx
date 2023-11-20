import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const banco = axios.create({
  baseURL: "http://localhost:3001/",
  timeout: 1000,
  headers: {},
});

const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: "",
    usuario:"",
    email: "",
    senha: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await banco.post("/register", formData);
      console.log("deu certo a conexão com o server");
      console.log('Register Form -> Resposta :',response)
      setFormData({
        nome: "",
        usuario: "",
        email: "",
        senha: "",
      });
      navigate("/");//renderizar "usuário cadastrado com sucesso"
    } catch (error){
      console.log("deu errado a conexão com o server, erro: ",error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Cadastre-se</h2>
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

export default RegisterForm;
