import React, { useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./components/Cards/AthleteLinkCard";
import "./App.css";
import { ToastProvider } from "react-toast-notifications";

import SwipeButtons from "./SwipeButtons";
import Chats from "./components/Chat/Chats";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./components/Login/Login";
import { useStateValue } from "./StateProvider";
import MyProfile from "./components/MyProfile/MyProfile";
import NewUser from "./components/NewUser/NewUser";
import Registration from "./components/SignUp/Registration";
import SignInWithAthleteLink from "./components/SignIn/SignInWithAthleteLink";
// import OnboardingWizard from "./components/Onboarding/OnboardingWizard";
import Onboarding from "./components/Onboarding/Onboarding";
// import Map from "./components/MapContainer/MapContainer";
// import MapContainer from "./components/MapContainer/MapContainer";

function App() {
  const [{ user,  newUserFlag}, dispatch] = useStateValue();

  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
    // fetch("/api")
    //   .then((res) => res.json())
    //   .then((data) => setData(data.message));
  // }, []);

  return (
    <ToastProvider autoDismiss autoDismissTimeout="3000">

    <div className="App">
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
              {/* <OnboardingWizard/> */}
              <Onboarding/>
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>
      ) : (
        newUserFlag ? (
          <Onboarding/>
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
               {/* <AthleteLinkCards/> */}
               
               {/* <MapContainer/> */}
              <SwipeButtons />
            </Route>
          </Switch>
        </Router>
        )
        
      )}
    </div>
     </ToastProvider>
  );
}

export default App;