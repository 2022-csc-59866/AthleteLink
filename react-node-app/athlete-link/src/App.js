import React, { useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./components/Cards/AthleteLinkCard";
import "./App.css";
import SwipeButtons from "./SwipeButtons";
import Chats from "./components/Chat/Chats";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./components/Login/Login";
import { useStateValue } from "./StateProvider";
import MyProfile from "./components/MyProfile/MyProfile";
import NewUser from "./components/NewUser/NewUser";
import Registration from "./components/SignUp/Registration";
import SignInWithAthleteLink from "./components/SignIn/SignInWithAthleteLink";
import OnboardingWizard from "./components/Onboarding/OnboardingWizard";
function App() {
  const [{ user,  newUserFlag}, dispatch] = useStateValue();

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      {console.log(data)}
      {!user ? (
        <Router>
          <Switch>
            <Route path="/signin">
              <SignInWithAthleteLink />
            </Route>
            <Route path="/signup">
              <Registration />
            </Route>
            <Route path="/onboarding">
              <OnboardingWizard/>
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>
      ) : (
        newUserFlag ? (
          <OnboardingWizard/>
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
            <Route path="signup">
              <Registration />
            </Route>
            <Route path="/">
              <Header />
              <AthleteLinkCards/>
              <SwipeButtons />
            </Route>
          </Switch>
        </Router>
        )
        
      )}
    </div>
  );
}

export default App;