import React, { useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./components/Cards/AthleteLinkCard";
import "./App.css";
import SwipeButtons from "./SwipeButtons";
import Chats from "./components/Chat/Chats";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import MyProfile from "./MyProfile";


function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <Switch>
            <Route path="/myprofile">
              <Header backButton="/" />
              <MyProfile />
            </Route>
            <Route path="/chat/:person">
              <Header backButton="/chat" />
              <ChatScreen />
            </Route>
            <Route path="/chat">
              <Header backButton="/" />
              <Chats />
            </Route>
            <Route path="/">
              <Header />
              <AthleteLinkCards/>
              <SwipeButtons />
            </Route>
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;