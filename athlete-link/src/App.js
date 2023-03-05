import React, { useState } from "react";
import Header from "./Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./AthleteLinkCard";
import "./App.css";
import SwipeButtons from "./SwipeButtons";
import Chats from "./Chats";
import ChatScreen from "./ChatScreen";
import Login from "./Login";
import { useStateValue } from "./StateProvider";


function App() {
  const [{ user }, dispatch] = useStateValue();

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <Switch>
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