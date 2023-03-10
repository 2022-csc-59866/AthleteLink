import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "../../StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import NewUser from "../NewUser/NewUser";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function MyProfile() {
  const classes = useStyles();
  const [{ user }, dispatch] = useStateValue();
  return (
    <div className="myProfile__outterContainer">
      <div className="myProfile__innerContainer">
        <div className="myProfile__header">
          <h2>My Profile</h2>
          <Avatar
            alt={user.displayName}
            src={user.photoURL}
            className={classes.large}
          />
          <h2>Welcome, {user.displayName}</h2>
        </div>
        <div>
          <NewUser />
        </div>
      </div>
    </div>
  );
}

export default MyProfile;