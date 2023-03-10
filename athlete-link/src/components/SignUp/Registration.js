import React, { useState, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from 'firebase/compat/app';
import {database} from "../../firebase";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { auth } from "../../firebase";
import { provider } from "../../firebase";
import { actionTypes } from "../../reducer";
import { emphasize, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-black.png";
import "./Registration.css";
import { func } from "prop-types";

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
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [age, setAge] = useState(null);
  const [pass, setPass] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [file, setFile] = useState(null);

  const handleUploadClick = (event) => {
    console.log(file);
    setFile(event.target.files[0]);
    console.log(file);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    console.log("signup");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then((auth) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: auth.user,
        });
        firebase
          .storage()
          .ref("users/" + auth.user.uid + "/profilejpg")
          .put(file)
          .then(function () {
            console.log("successfully uploaded image");
          })
          .catch((error) => {
            console.log(error.message);
          });
        database
          .collection("people")
          .doc(auth.user.uid)
          .set({
            firstName: firstName,
            lastName: lastName,
            age: age,
            location: {
              lat: lat,
              long: long,
            },
          })
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      });
  };
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
  const signInWithGymLink = () => {};
  return (
    <div className="register__outterContainer">
      <div className="register__innerContainer">
        <form className={classes.root} onSubmit={signUp}>
          <Box m={4} pb={5}>
            <h1>Sign Up</h1>
          </Box>
          <TextField
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            label="First Name"
            variant="outlined"
            required
          />
          <TextField
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            variant="outlined"
            required
          />
          <TextField
            onChange={(e) => setAge(e.target.value)}
            label="Age"
            variant="outlined"
            required
          />
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
          <h3>Select Profile Image</h3>
          <CardContent>
            <input
              accept="image/*"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleUploadClick}
            />
            <label htmlFor="contained-button-file">
              <Fab component="span" className={classes.button}>
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
            {file ? <h4>{file.name}</h4> : <br></br>}
          </CardContent>

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