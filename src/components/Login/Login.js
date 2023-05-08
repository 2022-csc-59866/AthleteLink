import React from "react";
import "./Login.css";
import logo from "../../assets/logo-black.png";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    color: "#e75480",
  },
  button: {
    display: "flex",
    background: "#e75480",
    borderRadius: 3,
    border: "1px solid #e75480",
    color: "white",
    height: 48,
    marginBottom: "5%",
    fontSize: "1rem",
    padding: "0 30px",
    width: "100%",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    "&:hover": {
      background: "white",
      color: "#e75480",
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(1), // Add padding to the top
      paddingBottom: theme.spacing(1), // Add padding to the bottom
    },
  },
}));

function Login() {
  const classes = useStyles();

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="Athlete Link Logo" />
        <div className="login__text">
          <h1>Welcome to Athlete Link</h1>
        </div>

        <Link to="/signin">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
          >
            Sign In With Athlete Link
          </Button>
        </Link>

        <Link to="/signup">
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
          >
            Dont have an Account? Sign Up Here.
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
