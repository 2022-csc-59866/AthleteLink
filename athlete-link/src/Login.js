import React from "react";
import { auth, provider } from "./firebase";
import "./Login.css";
import logo from "./assets/logo-black.png";
import { actionTypes } from "./reducer";
import { useStateValue } from "./StateProvider";

function Login() {
  const [{}, dispatch] = useStateValue();

  const signInGoogle = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="Athlete Link Logo" />
        <div className="login__text">
          <h1>Sign in to Athlete Link</h1>
        </div>

        <div className="login__withGoogle" onClick={signInGoogle}>
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="Google Logo"
          />
          <span>Sign in with Google</span>
        </div>
      </div>
    </div>
  );
}

export default Login;