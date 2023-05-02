import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { useStateValue } from "../../StateProvider";
import "./Chats.css";

function Chats() {
  const [{ user, likes, matches, likesme, dislikes }, dispatch] =
    useStateValue();
  const [chatMatches, setChatMatches] = useState([]);
  const fetchMatchedUsers = async (currentUserID) => {
    try {
      const response = await fetch(`/api/getMatchedUsers/${currentUserID}`);
      const matchedUsers = await response.json();

      if (response.status === 200) {
        // Process the matchedUsers array here
        console.log(matchedUsers);
        setChatMatches(matchedUsers);
      } else {
        console.error("Error fetching matched users:", matchedUsers.error);
      }
    } catch (error) {
      console.error("Error fetching matched users:", error);
    }
  };

  // Call the function with the actual UID of the current user

  useEffect(() => {
    fetchMatchedUsers(user);
  }, []);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  return (
    <div className="chats">
      {chatMatches
        ? chatMatches.map((person) => {
            {
              if (person != null && person != undefined) {
                return (
                  <Chat
                    key={person.uid}
                    personUid={person.uid}
                    name={person.username}
                    message={`I'm ${person.username}, nice to meet you`}
                    timeStamp={`${randomIntFromInterval(1, 60)} minutes ago`}
                    profilePic={person.profileImgUrl}
                  />
                );
              }
            }
          })
        : null}
    </div>
  );
}

export default Chats;
