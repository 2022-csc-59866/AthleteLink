import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import { useStateValue } from "../../StateProvider";
import { makeStyles } from "@material-ui/core/styles";
import NewUser from "../NewUser/NewUser";
import firebase from 'firebase/compat/app';



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

  const [profileImageUrl, setProfileImageUrl] = useState();

  // useEffect(() => {
  //   const unsubscribe = firebase
  //     .storage()
  //     .ref("users/" + user.uid + "/profile.jpg")
  //     .getDownloadURL()
  //     .then((imgUrl) => {
  //       console.log(imgUrl);
  //       setProfileImageUrl(imgUrl);
  //     });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <div className="myProfile__outterContainer">
      <div className="myProfile__innerContainer">
        <div className="myProfile__header">
          <h2>My Profile</h2>
          <Avatar
            alt={user.displayName}
            // src={profileImageUrl}
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