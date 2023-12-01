import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const Home = ()=> {
  const [currentForm, setCurrentForm] = useState("login");
  
  const toggleForm = () => {
    setCurrentForm(currentForm === "login" ? "register" : "login");
  };

  return (
    <div>
      <div>
        <img src="/mais-div-removebg-preview.png" className="logo" alt="logo" />
        <h1 style={{color:'#008CBA'}}>Mais Dividendos</h1>
      </div>
      {currentForm === "login" ? (
        <div>
          <LoginForm />
        </div>
      ) : (
        <div>
          <RegisterForm />
        </div>
      )}
      <button onClick={toggleForm} className={currentForm === "register"?"login-btn" : "cadastro-btn"}>{currentForm === "register"? " ou Faça Login" : "Cadastre-se Aqui"}</button>
    </div>
  );
}

export default Home;
