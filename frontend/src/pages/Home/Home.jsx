import React, { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

function Home() {
  const [currentForm, setCurrentForm] = useState("login");

  const toggleForm = () => {
    setCurrentForm(currentForm === "login" ? "register" : "login");
  };

  return (
    <div>
      <div>
        <img src="/mais-div-removebg-preview.png" className="logo" alt="logo" />
        <h1>Mais Dividendos</h1>
      </div>
      {currentForm === "login" ? (
        <div>
          <LoginForm />
          <button onClick={toggleForm}>Cadastre-se</button>
        </div>
      ) : (
        <div>
          <RegisterForm />
          <button onClick={toggleForm}>Faça Login</button>
        </div>
      )}
    </div>
  );
}

export default Home;
