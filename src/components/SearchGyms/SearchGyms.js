import { useState } from "react";
import GymCard from "./GymCard";
import "./SearchGyms.css";
import { TextField, Button, CircularProgress, Avatar } from "@mui/material";

import LocationAutoComplete from "./LocationAutoComplete";

function SearchGyms() {
  const [gymData, setGymData] = useState([]);
  const [enteredLat, setEnteredLat] = useState("");
  const [enteredLong, setEnteredLong] = useState("");

  const handlePlaceSelect = async (coordinates) => {
    console.log("Selected coordinates:", coordinates.lat);
    console.log("Selected coordinates:", coordinates.lng);
    try {
      const nearbyGyms = await fetchNearbyGyms(
        Number(coordinates.lat),
        Number(coordinates.lng)
      ).then(async () => {
        console.log("List of gym loaded successfully.");
      });
    } catch (error) {
      console.error("Error getting gyms near user:", error);
    }
  };

  const fetchNearbyGyms = async (latitude, longitude) => {
    console.log(latitude, longitude);

    const url = `${process.env.REACT_APP_API_BASE_URL}/api/searchGyms?lat=${latitude}&long=${longitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGymData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const nearbyGyms = await fetchNearbyGyms(
        Number(enteredLat),
        Number(enteredLong)
      );
      console.log(nearbyGyms);
    } catch (error) {
      console.error("Error getting gyms near user:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="heading" style={{ fontSize: "25px" }}>
            Search for gyms in the area!
          </div>
          <div className="textField" style={{ margin: "2%" }}>
            <LocationAutoComplete onSelect={handlePlaceSelect} />
          </div>
        </div>
      </form>
      <div className="container">
        {gymData &&
          gymData.map((gym, index) => <GymCard key={index} gym={gym} />)}
      </div>
    </>
  );
}

export default SearchGyms;
