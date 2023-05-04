import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./AthleteLinkCards.css";
import { database } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../reducer";
import { debounce } from "lodash";

const AthleteLinkCards = (props) => {
  const { data } = props;
  const [people, setPeople] = useState([]);
  const [lastDirection, setLastDirection] = useState();
  const [trigger, setTrigger] = useState(false);
  const [{ user, likes, dislikes, matches }, dispatch] = useStateValue();
  const [apiCallInProgress, setApiCallInProgress] = useState(false);
  const [isLikingUser, setIsLikingUser] = useState(false);
  const [isRequestInProgress, setRequestInProgress] = useState(false);

  const [currentPerson, setCurrentPerson] = useState({
    name: "initialName",
  });

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

  const swiped = debounce(async (direction, person) => {
    if (isLikingUser) {
      return; // Do not proceed if there's an ongoing likeUser request
    }

    setLastDirection(direction);
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

  // over here every single time the user swipes, we will invert the trigger state value and call useEffect,
  //we can check if the dislikes/likes store is > 5 and make an api call to save the likes and dislikes to the database
  // useEffect(() => {
  //   if(dislikes.length > 5 || likes.length > 5)
  // }, [trigger]);

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
      const response = await fetch("/api/likeUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserID,
          likedUserID,
        }),
      });

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
      const response = await fetch("/api/dislikeUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserID,
          dislikedUserID,
        }),
      });

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
    <div key={currentPerson.name}>
      <div className="athleteLinkCards__cardContainer">
        {data &&
          data.map((person) => (
            <TinderCard
              className="swipe"
              key={person.data.username}
              preventSwipe={
                isLikingUser ? ["up", "down", "left", "right"] : ["up", "down"]
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
                  <span style={textStyle}>{person.data.sports.join(", ")}</span>
                </p>
                <p>
                  <span style={textStyleBold}>Gender:</span>{" "}
                  <span style={textStyle}>Male</span>
                </p>
              </div>
            </TinderCard>
          ))}
      </div>
    </div>
  );
};

export default AthleteLinkCards;
