import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const GymCard = ({ gym }) => {
  return (
    <Card sx={{ maxWidth: 500, marginBottom: 2, padding: 10 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {gym && gym.name ? gym.name : "Name Not available"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {gym && gym.rating ? gym.rating : "Not Available"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {gym && gym.vicinity ? gym.vicinity : "Not Available"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          More Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default GymCard;
