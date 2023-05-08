import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
// import firebase from 'firebase/compat/app';
// import {database} from "../../firebase";
import Box from "@material-ui/core/Box";
// import CardContent from "@material-ui/core/CardContent";
// import Fab from "@material-ui/core/Fab";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// import { auth } from "../../firebase";
// import { provider } from "../../firebase";
import { actionTypes } from "../../reducer";
import { emphasize, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
// import logo from "../../assets/logo-black.png";
import "./Registration.css";
// import { func } from "prop-types";

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
}));

function Registration() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);

  const [password, setPassword] = useState(null);

  const signUp = (e) => {
    e.preventDefault();
    return axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/api/create-user`, {
        email,
        password,
      })
      .then((auth) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: auth.data.uid,
        });
        return auth.data;
      })
      .then((data) => {
        axios
          .get(
            `${process.env.REACT_APP_API_BASE_URL}/getNewUserFlag?uid=${data.uid}`
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
          });
      })
      .catch((error) => console.error("Error while creating user", error));
  };

  return (
    <div className="register__outterContainer">
      <div className="register__innerContainer">
        <form className={classes.root} onSubmit={signUp}>
          <Box m={4} pb={5}>
            <h1>Sign Up</h1>
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
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div>
            <Link to="/">
              <Button variant="contained">Cancel</Button>
            </Link>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              // onClick={signUp}
              onSubmit={signUp}
            >
              Signup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
