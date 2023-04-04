import React, { useState, useEffect } from "react";
import { auth, provider } from "../../firebase";
import "./Login.css";
import logo from "../../assets/logo-black.png"
import { actionTypes } from "../../reducer";
import { useStateValue } from "../../StateProvider";
import { Link, useHistory } from "react-router-dom";
import {database} from "../../firebase";



function Login() {
  const [{}, dispatch] = useStateValue();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  
  // const signInGoogle = () => {
  //   auth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       dispatch({
  //         type: actionTypes.SET_USER,
  //         user: result.user,
  //       });
  //     })
  //     .catch((error) => alert(error.message));
  // };


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
        {/* <div className="login__withGoogle" onClick={signInGoogle}> */}
          {/* <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt="Google Logo"
          />
        <span>Sign In with Google</span> */}
        {/* </div> */}
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