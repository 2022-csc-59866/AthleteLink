import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase/compat/app";
import Box from "@material-ui/core/Box";

import { actionTypes } from "../../reducer";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./SignInWithAthleteLink.css";
import axios from "axios";
import { getUserData } from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "300px",
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  input: {
    display: "none",
  },
  header: {
    color: "#e75480",
  },
  buttonContinue: {
    background: "#e75480",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "white",
    height: 48,
    fontSize: "1rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "#e75480",
      fontSize: "1.2rem",
    },
  },
  buttonCancel: {
    background: "white",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "#e75480",
    height: 48,
    fontSize: "1rem",
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      fontSize: "1.2rem",
    },
  },
}));

function SignInWithAthleteLink() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [userID, setUserID] = useState(null);

  const signIn = (e) => {
    console.log("base url here", process.env.REACT_APP_API_BASE_URL);
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((userCredential) => {
        setUserID(userCredential.user.uid);
        dispatch({
          type: actionTypes.SET_USER,
          user: userCredential.user.uid,
        });
        return userCredential;
      })
      .then((data) => {
        console.log("data after login here", data);
        axios
          .get(
            `${process.env.REACT_APP_API_BASE_URL}/getNewUserFlag?uid=${data.user.uid}`
          )
          .then((response) => {
            const newUserFlag = response.data[0]["flagNewUser"];
            var regexPattern = new RegExp("true");
            const boolValueNewUserFlag = regexPattern.test(newUserFlag);

            dispatch({
              type: actionTypes.SET_NEW_USER_FLAG,
              newUserFlag: boolValueNewUserFlag,
            });
            console.log(`The user's newUserFlag is set to ${newUserFlag}`);
          })
          .then(() => {
            getUserData(data.user.uid).then((response) => {
              console.log("RESULT GET USER DATA", response.data);
              dispatch({
                type: actionTypes.SET_USER_DATA,
                userData: response.data,
              });
            });
          })
          .catch((error) => {
            console.error(error);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Incorrect Username And/or Password");
      });
  };

  return (
    <div>
      <div className="register__outterContainer">
        <div className="register__innerContainer">
          <form className={classes.root} onSubmit={signIn}>
            <Box m={4} pb={5}>
              <h1 className={classes.header}>Sign In</h1>
            </Box>

            <TextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              variant="outlined"
              type="email"
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <div>
              <Link to="/">
                <Button variant="contained" className={classes.buttonCancel}>
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onSubmit={signIn}
                className={classes.buttonContinue}
              >
                SignIn
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignInWithAthleteLink;
