import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { useStateValue } from "../../StateProvider";
import { formatDistanceToNow } from "date-fns";
import NoMatches from "../NoMatches/NoMatches";
import "./Chats.css";

function Chats() {
  const { user } = useStateValue();
  const [chatList, setChatList] = useState([]);
  const getUserChats = async (currentUserId) => {
    try {
      const response = await fetch("/api/getUserChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatList(data);
      } else {
        throw new Error("Failed to get user chats");
      }
    } catch (error) {
      console.error("Error getting user chats:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUserChats(user);
    }
  }, [user]);
  const getRelativeTime = (lastMessageCreatedAt) => {
    const dateObject = new Date(lastMessageCreatedAt._seconds * 1000);
    const relativeTime = formatDistanceToNow(dateObject, { addSuffix: true });

    return relativeTime;
  };
  return (
    <div className="chats">
      {chatList.length !== 0 ? (
        chatList.map((chat) => {
          {
            if (chat !== null && chat !== undefined) {
              const createdAt = chat.lastMessage.createdAt
                ? getRelativeTime(chat.lastMessage.createdAt)
                : "No messages yet";
              return (
                <Chat
                  key={chat.chatId}
                  chatId={chat.chatId}
                  personUid={chat.otherUserId}
                  name={chat.otherUsername}
                  message={chat.lastMessage.message}
                  timeStamp={createdAt}
                  profilePic={chat.otherUserProfileImgUrl}
                />
              );
            }
          }
        })
      ) : (
        <NoMatches />
      )}
    </div>
  );
}

export default Chats;
