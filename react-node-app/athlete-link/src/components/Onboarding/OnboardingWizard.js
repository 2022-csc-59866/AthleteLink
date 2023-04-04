import React, { useState, useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';
import Box from "@material-ui/core/Box";
import "./OnboardingWizard.css"
import { AddressAutofill, AddressMinimap, useConfirmAddress, config } from '@mapbox/search-js-react';
import debounce from 'lodash/debounce';
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'auto',
    // marginTop: theme.spacing(5),
    width: '80%',
    maxWidth: 500,
    '& > *': {
      margin: theme.spacing(2),
      width: '100%'
    },
    position: 'absolute'
  },
  button: {
    marginTop: theme.spacing(2)
  }
}));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: theme.spacing(2),
//     "& .MuiTextField-root": {
//       margin: theme.spacing(1),
//       width: "300px",
//     },
//     "& .MuiButtonBase-root": {
//       margin: theme.spacing(2),
//     },
//   },
//   input: {
//     display: "none",
//   },
// }));

const OnboardingWizard = () => {
  const classes = useStyles();
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showFormExpanded, setShowFormExpanded] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [feature, setFeature] = useState();
  const [showValidationText, setShowValidationText] = useState(false);
  const [token, setToken] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [username, setUsername] = useState('');
  const [{ user }, dispatch] = useStateValue();

  const checkAvailability = debounce(async (username) => {
    axios.get(`http://localhost:3001/checkUsernameAvailability?username=${username}`).then((result) => {
       setIsAvailable(result.data.isAvailable);
    })
  }, 500);

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
    checkAvailability(value);
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: ''
  });

  // const handleLocationChange = (event) => {
  //   const location = event.target.value;
  //   setLocation(location);

  //   if (location.length > 2) {
  //     axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1Ijoia2h1emlhbWFyIiwiYSI6ImNsZzE0NG04bzAwbm0za3Fobnd1M2FwOXYifQ.w14t5U-b7oByuxBdZnD-bA`)
  //       .then(response => {
  //         const features = response.data.features;
  //         setSuggestions(features.slice(0, 5));
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   } else {
  //     setSuggestions([]);
  //   }
  // }
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const clearLocation = () => {
    setLatitude(null)
    setLongitude(null)
  }
  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.log(error);
        setLatitude(40.7128);
        setLongitude(74.0060);
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    formData["location"] = latitude + "," + longitude
    formData["username"] = username 
    formData["userID"] = user
    // console.log("user is here", form)
    
    try{
      const result = axios.post('http://localhost:3001/api/onboarding', {
        firstName: formData["firstName"],
        lastName: formData["lastName"],
        location: !(latitude || longitude) ? "40.7128,74.0060" :latitude + ","+longitude,
        age: formData["age"],
        gender:  formData["gender"],
        username: username.toLowerCase(),
        userID: user
      })
      console.log(result, "Successfulluy completed onboarding")
      dispatch({
            type: actionTypes.SET_NEW_USER_FLAG,
            newUserFlag: false,
          });
    }catch(error){
      console.log("Error while submitting onboarding", error)
    }
  };

   const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.place_name);
    setSuggestions([]);
  }

  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    skipConfirmModal: (feature) => {
    ['exact', 'high'].includes(feature.properties.match_code.confidence)
    }
  });

  useEffect(() => {
    const accessToken = process.env.REACT_APP_MAP_TOKEN;
    setToken(accessToken)
    config.accessToken = accessToken;
  }, [])
  const handleRetrieve = useCallback(
    (res) => {
    const feature = res.features[0];
    setFeature(feature);
    setShowMinimap(true);
    setShowFormExpanded(true);
    },
    [setFeature, setShowMinimap]
  );
 
  function handleSaveMarkerLocation(coordinate) {
    console.log(`Marker moved to ${JSON.stringify(coordinate)}.`)
  }
  function submitForm() {
    setShowValidationText(true);
    setTimeout(() => {
    resetForm();
    }, 2500);
  }

   const handleKeyPress = (event) => {
    const pattern = /^[a-z0-9]*$/; // Regular expression to match lowercase letters
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Prevent input of any character that is not a lowercase letter
    }
  };

  function resetForm() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
    setShowFormExpanded(false);
    setShowValidationText(false);
    setFeature(null);
  }


  return (

     <div>
      <div className="onboarding__outterContainer">
        <div className="onboarding__innerContainer">
         
          <form className={classes.form} onSubmit={handleSubmit}>
             <Box mb={0} mt={0} pt={0} pb={0}>
              <h1>Setup Your Account To Get Started!</h1>
            </Box>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              required
            />
            {isAvailable !== null && (
              <p>{isAvailable ? 'Username is available' : 'Username is not available'}</p>
            )} 
            <TextField
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              variant="outlined"
              type="number"
              InputProps={{
                inputProps: { min: 0 }
              }}
              required
            />
            <label className="txt-s txt-bold color-gray mb3">Address</label>
              <TextField
                label="Latitude"
                value={latitude}
                disabled
              />
              <TextField
                label="Longitude"
                value={longitude}
                disabled
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleLocation}
              >
                Get Location
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={clearLocation}
              >
                Clear Location
              </Button>
              {!(latitude && longitude) && (
                <>
                <AddressAutofill accessToken={token} onRetrieve={handleRetrieve}>
              <TextField    
              placeholder="Start typing your address, e.g. 123 Main..."
              autoComplete="address-line1"
              id="mapbox-autofill"
              variant="outlined"
              margin="normal"
              />
            </AddressAutofill>
            { !showFormExpanded && 
            <div
            id="manual-entry"
            className="w180 mt6 link txt-ms border-b color-gray color-black-on-hover"
            onClick={() => setShowFormExpanded(true)}
            >
            Enter an address manually
            </div>
            } 
            <div className="secondary-inputs" style={{ display: showFormExpanded ? 'block' : 'none' }}>
              <TextField
              
              label="Address Line 2"
              name="addressline2"
              placeholder="Apartment, suite, unit, building, floor, etc."
              autoComplete="address-line2"
              variant="outlined"
              margin="normal"
              />
              <TextField
              label="City"
              name="city"
              
              placeholder="City"
              autoComplete="address-level2"
              variant="outlined"
              margin="normal"
              />
          
              <TextField
              label="State/Region"
              name="stateregion"
              
              placeholder="State / Region"
              autoComplete="address-level1"
              variant="outlined"
              margin="normal"
              />
    
              <TextField
              label="Zipcode"
              name="zipcode"
              className="input"
              placeholder="ZIP / Postcode"
              autoComplete="postal-code"
              variant="outlined"
                margin="normal"
              />
            </div>

                </>
              )}
            
            <FormControl variant="outlined" required>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              <FormHelperText>Please select your gender</FormHelperText>
            </FormControl>
            <Button className={classes.button} variant="contained" color="primary" type="submit" disabled={!isAvailable || !username}>
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
    
  );
};

export default OnboardingWizard;
