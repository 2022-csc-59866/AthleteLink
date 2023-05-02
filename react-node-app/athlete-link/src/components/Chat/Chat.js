import React from "react";
import Avatar from "@material-ui/core/Avatar";
import "./Chat.css";
import { Link } from "react-router-dom";

function Chat({ name, message, timeStamp, profilePic, personUid }) {
  return (
    <Link
      to={{
        pathname: `/chat/${name}`,
        state: {
          personUid: personUid,
          name: name,
          profilePic: profilePic,
        },
      }}
    >
      <div className="chat">
        <Avatar className="chat__image" src={profilePic} />
        <div className="chat__details">
          <h2>{name}</h2>
          <p>{message}</p>
        </div>
        <p className="chat__timeStamp">{timeStamp}</p>
      </div>
    </Link>
  );
}

export default Chat;
