import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import { firestore, geofirestore } from "../../firebase";
import firebase from "firebase/compat/app";
import "firebase/storage"; // <----
import { useStateValue } from "../../StateProvider";

import axios from "axios";

const sportsList = [
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

const Filter = ({ onApplyFilters }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [distance, setDistance] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [{ user }, dispatch] = useStateValue();

  const handleSportChange = (event) => {
    setSelectedSports(event.target.value);
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const hasCommonElement = (arr1, arr2) => {
    return arr1.some((item) => arr2.includes(item));
  };

  async function getUsersNearLocation(center, radius, sports) {
    const usersCollection = geofirestore.collection("users");
    const query = usersCollection.near({
      center: new firebase.firestore.GeoPoint(center.lat, center.lng),
      radius: radius,
    });

    const snapshot = await query.get();
    const users = [];

    snapshot.docs.forEach((doc) => {
      const user = doc.data();
      const userSports = user.sports || [];
      const commonSports = userSports.filter((sport) => sports.includes(sport));

      if (commonSports.length > 0) {
        users.push(user);
      }
    });

    return users;
  }

  const getUserLocation = async (userID) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/getUserLocation",
        { userID }
      );
      const { location } = response.data;
      return { location };
    } catch (error) {
      console.error("Error getting user location:", error);
      return null;
    }
  };

  async function filterUsersBySports(selectedSports, currentUserId) {
    if (selectedSports.length === 0) {
      return [];
    }
    try {
      const response = await axios.post("/api/filterUsersBySports", {
        selectedSports,
        currentUserId,
      });
      const filteredUsers = response.data;
      console.log("Filtered users:", filteredUsers);
      return filteredUsers;
    } catch (error) {
      console.error("Error filtering users by sports:", error.message);
      return [];
    }
  }

  const applyFilters = async () => {
    // Call API to fetch users based on filters
    // For example, let's assume the API returns the following data:

    console.log("Selected sports:", selectedSports);
    console.log("Selected distance:", distance);
    setShowFilter(false);
    setShowSnackbar(true);
    try {
      const filteredUsers = await filterUsersBySports(selectedSports, user);
      console.log(filteredUsers);

      if (filteredUsers.length === 0) {
        onApplyFilters([]);
      }
      onApplyFilters(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  function milesToKilometers(miles) {
    const kilometers = miles * 1.60934;
    return kilometers;
  }

  return (
    <>
      {!showFilter && (
        <Button
          onClick={() => setShowFilter(!showFilter)}
          variant="outlined"
          fullWidth
          sx={{ margin: "8px 0", padding: "8px 0" }}
        >
          {showFilter ? "Hide Filter" : "Show Filter"}
        </Button>
      )}

      {showFilter && (
        <AppBar
          position="sticky"
          sx={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>Sports</InputLabel>
                  <Select
                    multiple
                    value={selectedSports}
                    onChange={handleSportChange}
                    renderValue={(selected) => (
                      <div>
                        {selected.map((sport) => (
                          <span key={sport}>
                            <SportsSoccerIcon /> {sport}
                          </span>
                        ))}
                      </div>
                    )}
                  >
                    {sportsList.map((sport) => (
                      <MenuItem key={sport} value={sport}>
                        {sport}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="body1" color="black">
                    Max distance: {distance} miles
                  </Typography>
                  <Slider
                    value={distance}
                    onChange={handleDistanceChange}
                    aria-labelledby="distance-slider"
                    step={1}
                    min={1}
                    max={100}
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  onClick={applyFilters}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Filter;
