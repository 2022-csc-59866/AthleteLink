import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { database } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import firebase from "firebase/compat/app";
import "./ChatScreen.css";

function ChatScreen() {
  const [input, setInput] = useState("");
  const { chatId } = useParams();
  const [{ userData }, dispatch] = useStateValue();
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    if (chatId) {
      const unsubscribe = database
        .collection("chats")
        .doc(chatId)
        .onSnapshot((snapshot) => {
          setMessages(snapshot.data()?.messages || []);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await database
        .collection("chats")
        .doc(chatId)
        .update({
          messages: [
            ...messages,
            {
              message: input,
              senderId: userData.uid,
              profileImgUrl: userData.profileImgUrl,
              username: userData.username,
              createdAt: firebase.firestore.Timestamp.now(),
            },
          ],
        });

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chatScreen">
      <p className="chatScreen__timeStamp">
        YOU MATCHED WITH ELLEN ON 8/6/2021
      </p>
      {messages &&
        messages.map((message) =>
          message.senderId !== userData.uid ? (
            <div className="chatScreen__message">
              <Avatar
                className="chatScreen__image"
                alt={message.username}
                src={message.profileImgUrl}
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
