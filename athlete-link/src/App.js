import React from "react";
import Header from "./Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./AthleteLinkCard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route path="/">
              <AthleteLinkCards/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;