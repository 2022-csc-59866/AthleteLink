import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import { useToasts } from "react-toast-notifications";
import Box from "@material-ui/core/Box";
import { actionTypes } from "../../reducer";
import { emphasize, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Registration.css";

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

function Registration() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  const [email, setEmail] = useState(null);
  const { addToast } = useToasts();

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
            addToast("Successfully Created User", { appearance: "success" });
            dispatch({
              type: actionTypes.SET_NEW_USER_FLAG,
              newUserFlag: boolValueNewUserFlag,
            });

            console.log(`The user's newUserFlag is set to ${newUserFlag}`);
          });
      })
      .catch((error) => {
        console.log(error);
        addToast(
          `Error Creating user: Email is taken OR Password is too short`,
          {
            appearance: "error",
          }
        );
      });
  };

  return (
    <div className="register__outterContainer">
      <div className="register__innerContainer">
        <form className={classes.root} onSubmit={signUp}>
          <Box m={4} pb={5}>
            <h1 className={classes.header}>Sign Up</h1>
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
              <Button variant="contained" className={classes.buttonCancel}>
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className={classes.buttonContinue}
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
