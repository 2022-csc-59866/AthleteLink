import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase/compat/app";
import { database } from "../../firebase";
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
import "./Onboarding.css";
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

const Onboarding = () => {
  const { addToast } = useToasts();
  const [{ user }, dispatch] = useStateValue();
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

  const checkAvailability = debounce(async (usernameProp) => {
    axios
      .get(
        `http://localhost:3001/checkUsernameAvailability?username=${usernameProp}`
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

  const checkImg = () => {
    if (!selectedCardImg && !selectedProfileImg) {
      addToast("Please select Profile and Card Images", {
        appearance: "error",
      });
    } else if (!selectedCardImg) {
      addToast("Please select Card Image", { appearance: "error" });
    } else if (!selectedProfileImg) {
      addToast("Please select Profile Image", { appearance: "error" });
    }
  };

  useEffect(() => {
    checkAvailability(user);
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
    if (!isValidZip) {
      addToast("Invalid Zipcode", { appearance: "error" });
      return;
    }
    if (!isAvailable) {
      addToast("Username Taken, Please choose a different one", {
        appearance: "error",
      });
      return;
    }

    try {
      const formDataProfile = new FormData();
      formDataProfile.append("image", selectedProfileImg);
      formDataProfile.append("userID", user);
      console.log("USER ID FROM FRONT END", user);

      const profileImageResponse = await axios.post(
        "http://localhost:3001/uploadProfileImage",
        formDataProfile
      );

      const formDataCard = new FormData();
      formDataCard.append("image", selectedCardImg);
      formDataCard.append("userID", user);

      const cardImageResponse = await axios.post(
        "http://localhost:3001/uploadCardImage",
        formDataCard
      );
      const imageUrl2 = cardImageResponse.data;
      const userLocation = new firebase.firestore.GeoPoint(
        parseInt(lat),
        parseInt(lng)
      );

      const onboardingData = {
        userID: user,
        username: username,
        bio: bio,
        age: age,
        gender: gender,
        zipcode: zipcode,
        profileImgUrl: profileImageResponse.data,
        cardImgUrl: cardImageResponse.data,
        sports: sports,
        location: userLocation,
        profilesLiked: [],
        profilesLikedMe: [],
        matches: [],
      };
      console.log("profile image url", profileImgURL, cardlImageURL);
      console.log("onboarding data", onboardingData);

      await submitOnboardingData(onboardingData);
      await disableNewUserFlag(user);

      dispatch({
        type: actionTypes.SET_NEW_USER_FLAG,
        newUserFlag: false,
      });

      addToast("Successfully Saved Data", { appearance: "success" });
    } catch (error) {
      addToast(error.message, { appearance: "error" });
    }
  };

  const disableNewUserFlag = async (userID) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/disableNewUserFlag",
        { userID }
      );
      console.log(response.data.message); // You can use the response data as needed
    } catch (error) {
      console.error("Error disabling new user flag:", error);
    }
  };

  const submitOnboardingData = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/onboarding",
        data
      );
      // Handle the response as needed
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
    }
  };

  return (
    <div>
      {redirect ? <Redirect push to="/myprofile" /> : null}
      <div className="edit__outterContainer">
        <div className="edit__innerContainer">
          <form className={classes.root2} onSubmit={updateProfile}>
            <Box m={2} pb={1}>
              <h1 className="edit__header">Welcome To Athlete Link</h1>
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
              required
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
              required
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
              required
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
              required
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
                required
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
                required
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
                onClick={checkImg}
                onSubmit={updateProfile}
                className={classes.buttonSave}
                startIcon={<SaveIcon />}
              >
                Start Using Athlete Link
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
