// // import React, { useState } from "react";
// // import FormControl from "@mui/material/FormControl";
// // import InputLabel from "@mui/material/InputLabel";
// // import MenuItem from "@mui/material/MenuItem";
// // import Select from "@mui/material/Select";
// // import Slider from "@mui/material/Slider";
// // import Button from "@mui/material/Button";
// // import Box from "@mui/material/Box";
// // import AppBar from "@mui/material/AppBar";
// // import Toolbar from "@mui/material/Toolbar";
// // import Typography from "@mui/material/Typography";
// // import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

// // const sportsList = [
// //   "Soccer",
// //   "Basketball",
// //   "Tennis",
// //   "Baseball",
// //   "Volleyball",
// //   "Swimming",
// // ];

// // const Filter = () => {
// //   const [selectedSports, setSelectedSports] = useState([]);
// //   const [distance, setDistance] = useState(10);

// //   const handleSportChange = (event) => {
// //     setSelectedSports(event.target.value);
// //   };

// //   const handleDistanceChange = (event, newValue) => {
// //     setDistance(newValue);
// //   };

// //   const applyFilters = () => {
// //     console.log("Selected sports:", selectedSports);
// //     console.log("Selected distance:", distance);
// //     // Call API to fetch users based on filters
// //   };

// //   return (
// //     <AppBar
// //       position="sticky"
// //       sx={{ backgroundColor: "transparent", boxShadow: "none" }}
// //     >
// //       <Toolbar>
// //         <Box sx={{ display: "flex", alignItems: "center", color: "black" }}>
// //           <FormControl sx={{ minWidth: 240, mr: 2 }}>
// //             <InputLabel>Sports</InputLabel>
// //             <Select
// //               multiple
// //               value={selectedSports}
// //               onChange={handleSportChange}
// //               renderValue={(selected) => (
// //                 <div>
// //                   {selected.map((sport) => (
// //                     <span key={sport}>
// //                       <SportsSoccerIcon /> {sport}
// //                     </span>
// //                   ))}
// //                 </div>
// //               )}
// //             >
// //               {sportsList.map((sport) => (
// //                 <MenuItem key={sport} value={sport}>
// //                   {sport}
// //                 </MenuItem>
// //               ))}
// //             </Select>
// //           </FormControl>

// //           <Box sx={{ width: 240 }}>
// //             <Typography variant="body1" color="black">
// //               Max distance: {distance} miles
// //             </Typography>
// //             <Slider
// //               value={distance}
// //               onChange={handleDistanceChange}
// //               aria-labelledby="distance-slider"
// //               step={1}
// //               min={1}
// //               max={20}
// //             />
// //           </Box>
// //         </Box>

// //         <Box sx={{ flexGrow: 1 }} />

// //         <Button onClick={applyFilters} variant="contained" color="primary">
// //           Apply
// //         </Button>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Filter;

// import React, { useState } from "react";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import Slider from "@mui/material/Slider";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
// import Grid from "@mui/material/Grid";

// const sportsList = [
//   "Soccer",
//   "Basketball",
//   "Tennis",
//   "Baseball",
//   "Volleyball",
//   "Swimming",
// ];

// const Filter = () => {
//   const [selectedSports, setSelectedSports] = useState([]);
//   const [distance, setDistance] = useState(10);

//   const handleSportChange = (event) => {
//     setSelectedSports(event.target.value);
//   };

//   const handleDistanceChange = (event, newValue) => {
//     setDistance(newValue);
//   };

//   const applyFilters = () => {
//     console.log("Selected sports:", selectedSports);
//     console.log("Selected distance:", distance);
//     // Call API to fetch users based on filters
//   };

//   return (
//     <AppBar
//       position="sticky"
//       sx={{ backgroundColor: "transparent", boxShadow: "none" }}
//     >
//       <Toolbar>
//         <Grid
//           container
//           alignItems="center"
//           justifyContent="space-between"
//           spacing={2}
//         >
//           <Grid item xs={12} sm={5}>
//             <FormControl fullWidth>
//               <InputLabel>Sports</InputLabel>
//               <Select
//                 multiple
//                 value={selectedSports}
//                 onChange={handleSportChange}
//                 renderValue={(selected) => (
//                   <div>
//                     {selected.map((sport) => (
//                       <span key={sport}>
//                         <SportsSoccerIcon /> {sport}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               >
//                 {sportsList.map((sport) => (
//                   <MenuItem key={sport} value={sport}>
//                     {sport}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={5}>
//             <Box sx={{ width: "100%" }}>
//               <Typography variant="body1" color="black">
//                 Max distance: {distance} miles
//               </Typography>
//               <Slider
//                 value={distance}
//                 onChange={handleDistanceChange}
//                 aria-labelledby="distance-slider"
//                 step={1}
//                 min={1}
//                 max={100}
//                 sx={{ width: "100%" }}
//               />
//             </Box>
//           </Grid>
//           <Grid item xs={12} sm={2}>
//             <Button
//               onClick={applyFilters}
//               variant="contained"
//               color="primary"
//               fullWidth
//             >
//               Apply
//             </Button>
//           </Grid>
//         </Grid>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Filter;

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

const sportsList = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Volleyball",
  "Swimming",
];

const Filter = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [distance, setDistance] = useState(10);
  const [showFilter, setShowFilter] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSportChange = (event) => {
    setSelectedSports(event.target.value);
  };

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };
  const applyFilters = () => {
    // Call API to fetch users based on filters
    // For example, let's assume the API returns the following data:

    console.log("Selected sports:", selectedSports);
    console.log("Selected distance:", distance);
    setShowFilter(false);
    setShowSnackbar(true);
    // Call API to fetch users based on filters

    const data = [
      // Array of filtered data
    ];

    // Pass the data to the parent component
    onApplyFilters(data);
  };

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
                    max={25}
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
