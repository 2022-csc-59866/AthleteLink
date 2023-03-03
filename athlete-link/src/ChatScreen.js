import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import "./ChatScreen.css";
function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      name: "Ellen",
      image: "...",
      message: "Whats Up",
    },
    {
      name: "Ellen",
      image: "...",
      message: "Hows it going!",
    },
    {
      message: "hiii how are you",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    setMessages([...messages, { message: input }]);
    setInput("");
  };

  return (
    <div className="chatScreen">
      <p className="chatScreen__timeStamp">
        YOU MATCHED WITH ELLEN ON 8/6/2021
      </p>
      {messages.map((message) =>
        message.name ? (
          <div className="chatScreen__message">
            <Avatar
              className="chatScreen__image"
              alt={message.name}
              src={message.image}
            />
            <p className="chatScreen__text"> {message.message}</p>
          </div>
        ) : (
          <div className="chatScreen__message">
            <p className="chatScreen__textUser"> {message.message}</p>
          </div>
        )
      )}
      <div>
        <form className="chatScreen__input">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="chatScreen__inputField"
            type="text"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="chatScreen__inputButton">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatScreen;