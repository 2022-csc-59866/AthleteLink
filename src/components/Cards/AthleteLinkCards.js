import React, { useState, useRef } from "react";
import TinderCard from "react-tinder-card";
import "./AthleteLinkCards.css";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { debounce } from "lodash";
import "../SwipeButtons/SwipeButtons.css";

import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@material-ui/core";
import Box from "@mui/material/Box";

const AthleteLinkCards = (props) => {
  const { data } = props;
  const [trigger, setTrigger] = useState(false);
  const [{ user, likes, dislikes, userData }, dispatch] = useStateValue();
  const [isLikingUser, setIsLikingUser] = useState(false);
  const [isRequestInProgress, setRequestInProgress] = useState(false);
  const currentPersonRef = useRef(null);
  const tinderCardRef = useRef();

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
    padding: "1rem",
    marginTop: "5px",
    backgroundColor: "white",
    opacity: 1,
  };

  const textStyle = {
    fontWeight: "normal",
    fontSize: "16px",
    margin: "0",
  };

  const textStyleBold = {
    fontWeight: "bold",
    fontSize: "16px",
    margin: "0",
  };

  const titleStyle = {
    fontWeight: "bold",
    fontSize: "24px",
    margin: "0",
  };

  const swipe = (direction) => {
    if (tinderCardRef.current) {
      const tinderCardInstance = tinderCardRef.current;
      tinderCardInstance.swipe(direction);
    }
  };
  const swiped = debounce(async (direction, person) => {
    console.log("person here", person);
    if (isLikingUser) {
      return; // Do not proceed if there's an ongoing likeUser request
    }

    setTrigger(!trigger);
    if (direction === "left") {
      dispatch({
        type: actionTypes.SET_DISLIKES,
        dislikes: dislikes.add(person),
      });

      const response = await dislikeUser(user, person);
      console.log("DISLIKED USER", response);
    } else if (direction === "right") {
      setIsLikingUser(true); // Set flag to true before calling likeUser

      dispatch({
        type: actionTypes.SET_LIKES,
        likes: likes.add(person),
      });
      const response = await likeUser(user, person);
      console.log("LIKED USER", response);

      setIsLikingUser(false); // Set flag back to false after likeUser is done
    }
  }, 500);

  const likeUser = async (currentUserID, likedUserID) => {
    // Check if a request is already in progress
    if (isRequestInProgress) {
      console.log("Request in progress. Skipping this request.");
      return;
    }

    // Set request status to in progress
    setRequestInProgress(true);

    console.log(currentUserID, likedUserID);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/likeUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserID,
            likedUserID,
          }),
        }
      );
      if (response.ok) {
        console.log("User liked successfully");
      } else {
        throw new Error("Failed to like user");
      }
    } catch (error) {
      console.error("Error liking user:", error);
    } finally {
      // Set request status to not in progress
      setRequestInProgress(false);
    }
  };

  const dislikeUser = async (currentUserID, dislikedUserID) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/dislikeUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentUserID,
            dislikedUserID,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User disliked successfully:", data);
      } else {
        throw new Error("Failed to dislike user");
      }
    } catch (error) {
      console.error("Error disliking user:", error);
    }
  };

  return (
    <div>
      <div className="athleteLinkCards__cardContainer">
        {data.length != 0
          ? data.map((person) => {
              currentPersonRef.current = person;
              return (
                <TinderCard
                  ref={tinderCardRef}
                  className="swipe"
                  key={person.data.uid}
                  preventSwipe={
                    isLikingUser
                      ? ["up", "down", "left", "right"]
                      : ["up", "down"]
                  }
                  onSwipe={(dir) => swiped(dir, person.data.uid)}
                >
                  <div
                    style={
                      person.data.cardImgUrl
                        ? { backgroundImage: `url(${person.data.cardImgUrl})` }
                        : {
                            background: "hsla(46, 95%, 56%, 1)",
                            background:
                              "linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                            background:
                              "-moz-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                            background:
                              "-webkit-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                            filter:
                              "progid: DXImageTransform.Microsoft.gradient( startColorstr='#F9C823', endColorstr='#FC506E', GradientType=1 )",
                          }
                    }
                    className="card"
                  ></div>
                  <div style={contentStyle} className="card_bottom">
                    <h2 style={titleStyle}>{person.data.username}</h2>
                    <p>
                      <span style={textStyleBold}>About Me:</span>{" "}
                      <span style={textStyle}>{person.data.bio}</span>
                    </p>
                    <p>
                      <span style={textStyleBold}>Sports:</span>{" "}
                      <span style={textStyle}>
                        {person.data.sports.join(", ")}
                      </span>
                    </p>
                    <p>
                      <span style={textStyleBold}>Gender:</span>{" "}
                      <span style={textStyle}>Malee</span>
                    </p>
                  </div>
                </TinderCard>
              );
            })
          : userData && (
              <TinderCard
                className="swipe"
                key={userData.uid}
                preventSwipe={["up", "down", "left", "right"]}
              >
                <div
                  style={
                    userData.cardImgUrl
                      ? { backgroundImage: `url(${userData.cardImgUrl})` }
                      : {
                          background: "hsla(46, 95%, 56%, 1)",
                          background:
                            "linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                          background:
                            "-moz-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                          background:
                            "-webkit-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                          filter:
                            "progid: DXImageTransform.Microsoft.gradient( startColorstr='#F9C823', endColorstr='#FC506E', GradientType=1 )",
                        }
                  }
                  className="card"
                ></div>
                <div style={contentStyle} className="card_bottom">
                  <h2 style={titleStyle} color="red">
                    Hey {userData.username}, please modify the filter to find
                    users near you!
                  </h2>
                  <p>
                    <span style={textStyleBold}>About Me:</span>{" "}
                    <span style={textStyle}>{userData.bio}</span>
                  </p>
                  <p>
                    <span style={textStyleBold}>Sports:</span>{" "}
                    <span style={textStyle}>{userData.sports.join(", ")}</span>
                  </p>
                  <p>
                    <span style={textStyleBold}>Gender:</span>{" "}
                    <span style={textStyle}>Male</span>
                  </p>
                </div>
              </TinderCard>
            )}
      </div>
      <Box className="swipeButtons">
        <IconButton
          className="swipeButtons__repeat"
          disabled={data.length === 0 ? true : false}
        >
          <ReplayIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="swipeButtons__left"
          disabled={data.length === 0 ? true : false}
          onClick={() => {
            if (currentPersonRef.current) {
              if (
                likes.has(currentPersonRef.current.data.uid) ||
                dislikes.has(currentPersonRef.current.data.uid)
              ) {
                return;
              }
              swipe("left");
              swiped("left", currentPersonRef.current.data.uid);
            }
          }}
        >
          <CloseIcon fontSize="large" />
        </IconButton>

        <IconButton
          className="swipeButtons__right"
          disabled={data.length === 0 ? true : false}
          onClick={() => {
            if (currentPersonRef.current) {
              if (
                likes.has(currentPersonRef.current.data.uid) ||
                dislikes.has(currentPersonRef.current.data.uid)
              ) {
                return;
              }
              swipe("right");
              swiped("right", currentPersonRef.current.data.uid);
            }
          }}
        >
          <FavoriteIcon fontSize="large" />
        </IconButton>
      </Box>
    </div>
  );
};

export default AthleteLinkCards;
