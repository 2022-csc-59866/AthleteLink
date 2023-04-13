import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import { database } from "../../firebase";

import SaveIcon from "@mui/icons-material/Save";
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
  button: {
    margin: theme.spacing(1),
  },
}));

const NewUser = () => {
  const [{ user }, dispatch] = useStateValue();
  const classes = useStyles();
  // create state variables for each input
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [age, setAge] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(firstName, lastName, email, password);
    if (firstName && lastName && age && lat && long) {
      database
        .collection("people")
        .doc(user.uid)
        .set({
          firstName: firstName,
          lastName: lastName,
          age: age,
          lat: lat,
          long: long,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } else {
      alert("invalid input fields");
    }
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      }
    });
  }, []);

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <TextField
        label="First Name"
        variant="outlined"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label="Last Name"
        variant="outlined"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label="Age"
        variant="outlined"
        required
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<SaveIcon />}
        >
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default NewUser;
