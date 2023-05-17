import React, { useState, useEffect, useRef } from "react";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase/compat/app";
import { auth } from "../../firebase";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SaveIcon from "@mui/icons-material/Save";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { actionTypes } from "../../reducer";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";

import "./UpdateUser.css";
import axios from "axios";
import debounce from "lodash/debounce";
import "firebase/storage"; // <----

const useStyles = makeStyles((theme) => ({
  root: {
    "&$focused $notchedOutline": {
      borderColor: "#e75480",
    },
    "&:hover $notchedOutline": {
      borderColor: "#e75480",
    },
    "&$disabled $notchedOutline": {
      borderColor: "#e75480",
    },
  },
  root2: {
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
  selectImg: {
    paddingTop: "1px",
    paddingBottom: "1px",
    marginTop: "1px",
  },
  button: {
    color: "white",
    backgroundColor: "#e75480",
    "&:hover": {
      color: "white",
      backgroundColor: "#e75480",
      fontSize: "1rem",
    },
  },
  buttonSave: {
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

  focused: {},
  disabled: {},
  notchedOutline: {},

  input: {
    display: "none",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  select: {
    "&:before": {
      borderColor: "#e75480",
    },
    "&:after": {
      borderColor: "#e75480",
    },
  },
  icon: {
    fill: "#e75480",
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Baseball",
  "Basketball",
  "Boxing",
  "Calisthenics",
  "Gymnastics",
  "Soccer",
  "Swimming",
  "Tennis",
  "Track and Field",
  "Volleyball",
  "Weightlifting",
  "Wrestling",
];

const genderNames = ["Male", "Female", "Other"];

function getStyles(name, sports, theme) {
  return {
    fontWeight:
      sports.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const UpdateUser = () => {
  const { addToast } = useToasts();
  const [{ user, userData }, dispatch] = useStateValue();
  const classes = useStyles();
  const [username, setUserName] = useState(null);
  const [bio, setBio] = useState(null);
  const [age, setAge] = useState(null);
  const [zipcode, setZipcode] = useState(null);
  const [selectedProfileImg, setSelectedProfileImg] = useState(null);
  const [selectedCardImg, setSelectedCardImg] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setlng] = useState(null);
  const [sports, setSports] = React.useState([]);
  const [gender, setGender] = React.useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [cardlImageURL, setCardImageURL] = useState("");
  const [profileImgURL, setProfileImageURL] = useState("");
  const formRef = useRef();

  const checkAvailability = debounce(async (usernameProp) => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/checkUsernameAvailability?username=${usernameProp}`
      )
      .then((result) => {
        setIsAvailable(result.data.isAvailable);
      });
  }, 500);

  const [redirect, setRedirect] = useState(false);

  const handleChangeSport = (event) => {
    setSports(event.target.value);
    console.log(sports);
  };

  const handleChangeGender = (event) => {
    setGender(event.target.value);
    console.log(gender);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSports(value);
  };

  const handleProfileImgUploadClick = (event) => {
    setSelectedProfileImg(event.target.files[0]);
    console.log(selectedProfileImg);
  };

  const handleCardImgUploadClick = (event) => {
    setSelectedCardImg(event.target.files[0]);
    console.log(selectedCardImg);
  };

  useEffect(() => {
    console.log(userData);
    if (username) {
      checkAvailability(username);
    }
    try {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setlng(position.coords.longitude);
      });
    } catch (error) {
      addToast(
        "Cannot get users geolocation - Setting default location to NYC",
        { appearance: "warning" }
      );
      setLat("40.7128");
      setlng("74.006");
    }
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode);
    if (zipcode && !isValidZip) {
      addToast("Invalid Zipcode", { appearance: "error" });
      return;
    }
    if (username && !isAvailable) {
      addToast("Username Taken, Please choose a different one", {
        appearance: "error",
      });
      return;
    }

    try {
      const formDataProfile = new FormData();

      var userLocation;
      if (isNaN(lat) || isNaN(lng)) {
        userLocation = new firebase.firestore.GeoPoint(40.7128, 74.006);
      } else {
        userLocation = new firebase.firestore.GeoPoint(
          parseInt(lat),
          parseInt(lng)
        );
      }
      const onboardingData = {
        userID: user,
        location: userLocation,
      };

      if (username) {
        onboardingData["username"] = username;
      }
      if (zipcode) {
        onboardingData["zipcode"] = zipcode;
      }
      if (gender) {
        onboardingData["gender"] = gender;
      }
      if (sports) {
        if (sports.length != 0) {
          onboardingData["sports"] = sports;
        }
      }
      if (bio) {
        onboardingData["bio"] = bio;
      }
      if (age) {
        onboardingData["age"] = age;
      }

      if (selectedProfileImg) {
        formDataProfile.append("userID", user);
        formDataProfile.append("image", selectedProfileImg);
        const profileImageResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/uploadProfileImage`,
          formDataProfile
        );
        onboardingData["profileImgUrl"] = profileImageResponse.data;
      }
      if (selectedCardImg) {
        const formDataCard = new FormData();
        formDataCard.append("image", selectedCardImg);
        formDataCard.append("userID", user);

        const cardImageResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/uploadCardImage`,
          formDataCard
        );
        onboardingData["cardImgUrl"] = cardImageResponse.data;
      }

      await submitOnboardingData(onboardingData);

      addToast("Successfully Saved Data", { appearance: "success" });
      formRef.current.reset();
    } catch (error) {
      addToast(error.message, { appearance: "error" });
    }
  };

  const submitOnboardingData = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/updateProfile`,
        data
      );
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ marginBottom: "20%" }}>
      {redirect ? <Redirect push to="/myprofile" /> : null}
      <div className="edit__outterContainer">
        <div className="edit__innerContainer">
          <form
            className={classes.root2}
            onSubmit={updateProfile}
            ref={formRef}
            style={{ marginBottom: "20px" }}
          >
            <Box m={2} pb={1}>
              <h1 className="edit__header">Welcome Back {userData.username}</h1>
            </Box>
            <TextField
              onChange={(e) => setUserName(e.target.value)}
              label="User Name"
              variant="outlined"
              inputProps={{ maxLength: 20, minLength: 5 }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
            />
            <TextField
              onChange={(e) => setBio(e.target.value)}
              label="Bio"
              variant="outlined"
              multiline
              inputProps={{ maxLength: 400, minLength: 15 }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
            />

            <TextField
              label="Age"
              variant="outlined"
              type={"number"}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setAge(e.target.value);
              }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
            />
            <TextField
              label="ZipCode"
              variant="outlined"
              type={"number"}
              onChange={(e) => {
                e.target.value < 0
                  ? (e.target.value = 0)
                  : setZipcode(e.target.value);
              }}
              InputProps={{
                classes: {
                  root: classes.root,
                  focused: classes.focused,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              InputLabelProps={{
                style: { color: "#e75480" },
              }}
            />
            <h4 className="edit__header">
              Select All of Your Sports Interests
            </h4>
            <FormControl className={classes.formControl}>
              <InputLabel
                id="demo-mutiple-checkbox-label"
                style={{ color: "#e75480" }}
              >
                Training
              </InputLabel>
              <Select
                autoWidth
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={sports}
                onChange={handleChangeSport}
                input={<Input />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                className={classes.select}
                inputProps={{
                  classes: {
                    icon: classes.icon,
                  },
                }}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sports.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <h4 className="edit__header">Select Gender</h4>
            <FormControl className={classes.formControl}>
              <InputLabel
                id="demo-mutiple-checkbox-label-2"
                style={{ color: "#e75480" }}
              >
                Genders
              </InputLabel>
              <Select
                autoWidth
                labelId="demo-mutiple-checkbox-label-2"
                id="demo-mutiple-checkbox-2"
                value={gender}
                onChange={handleChangeGender}
                input={<Input />}
                // renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
                className={classes.select}
                inputProps={{
                  classes: {
                    icon: classes.icon,
                  },
                }}
              >
                {genderNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={name == gender} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <CardContent className={classes.selectImg}>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleProfileImgUploadClick}
              />
              <label htmlFor="contained-button-file">
                <Fab
                  component="span"
                  className={classes.button}
                  variant="extended"
                >
                  <AddPhotoAlternateIcon />
                  {selectedProfileImg ? (
                    <h4>{"Profile Image: " + selectedProfileImg.name}</h4>
                  ) : (
                    <h4>Select Profile Image</h4>
                  )}
                </Fab>
              </label>
            </CardContent>
            <CardContent className={classes.selectImg}>
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file-card"
                multiple
                type="file"
                onChange={handleCardImgUploadClick}
              />
              <label htmlFor="contained-button-file-card">
                <Fab
                  component="span"
                  className={classes.button}
                  variant="extended"
                >
                  <AddPhotoAlternateIcon />
                  {selectedCardImg ? (
                    <h4>{"Card Image: " + selectedCardImg.name}</h4>
                  ) : (
                    <h4>Select Card Image</h4>
                  )}
                </Fab>
              </label>
            </CardContent>
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onSubmit={updateProfile}
                className={classes.buttonSave}
                startIcon={<SaveIcon />}
              >
                Update User Data
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="edit__outterContainer">
        <div className="edit__innerContainerButton">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            style={{
              width: "100%",
            }}
            fullWidth
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
