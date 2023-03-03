import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./AthleteLinkCard";
import "./App.css";
import SwipeButtons from "./SwipeButtons";


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/chat">
            <Header backButton="/"/>
          </Route>
          <Route path="/">
              <Header />
              <AthleteLinkCards/>
              <SwipeButtons />

          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;