import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { useStateValue } from "../../StateProvider";
import { formatDistanceToNow } from "date-fns";
import "./Chats.css";

function Chats() {
  const [{ user, likes, matches, likesme, dislikes }, dispatch] =
    useStateValue();
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
    getUserChats(user);
  }, [user]);
  const getRelativeTime = (lastMessageCreatedAt) => {
    const dateObject = new Date(lastMessageCreatedAt._seconds * 1000);
    const relativeTime = formatDistanceToNow(dateObject, { addSuffix: true });

    return relativeTime;
  };
  return (
    <div className="chats">
      {chatList
        ? chatList.map((chat) => {
            console.log(chat);
            if (chat.lastMessage.createdAt) {
            }

            {
              // console.log(chat);
              if (chat != null && chat != undefined) {
                console.log(chat.lastMessage.createdAt);
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
        : null}
    </div>
  );
}

export default Chats;
