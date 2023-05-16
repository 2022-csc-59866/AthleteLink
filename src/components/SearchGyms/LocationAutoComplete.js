import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import "./SearchGyms.css";

const LocationAutoComplete = ({ onSelect }) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const { lat, lng } = place.geometry.location;
        onSelect({ lat: lat(), lng: lng() });
        console.log({ lat: lat(), lng: lng() });
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  return (
    <>
      {typeof google !== "undefined" && (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            className="input"
            type="text"
            placeholder="Enter Location..."
          />
        </Autocomplete>
      )}
    </>
  );
};

export default LocationAutoComplete;
