import React from "react";
import { useStateValue } from "./StateProvider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

function valuetext(value) {
  return `${value}°C`;
}

function MyProfile() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  return (
    <div>
      <h1>My Profile</h1>
      <Avatar
        alt={user.displayName}
        src={user.photoURL}
        className={classes.large}
      />

      <h2>Welcome, {user.displayName}</h2>
    </div>
  );
}

export default MyProfile;