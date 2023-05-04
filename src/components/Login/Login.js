import React from "react";
import "./Login.css";
import logo from "../../assets/logo-black.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="Athlete Link Logo" />
        <div className="login__text">
          <h1>Sign in</h1>
        </div>

        <Link to="/signin">
          <div className="login__withGoogle">
            <img src={logo} alt="AthleteLink Logo" />
            <span>Sign In with Athlete Link</span>
          </div>
        </Link>

        <Link to="/signup">
          <div className="login__withGoogle">
            <div>Dont have an Account? Sign Up Here.</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Login;
