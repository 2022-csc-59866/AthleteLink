import React, { useState } from "react";
import Header from "./components/Header/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AthleteLinkCards from "./components/Cards/AthleteLinkCards";
import "./App.css";
import { ToastProvider } from "react-toast-notifications";
import Filter from "./components/Filter/Filter";
import SwipeButtons from "./SwipeButtons";
import Chats from "./components/Chat/Chats";
import ChatScreen from "./components/Chat/ChatScreen";
import Login from "./components/Login/Login";
import { useStateValue } from "./StateProvider";
import Registration from "./components/SignUp/Registration";
import SignInWithAthleteLink from "./components/SignIn/SignInWithAthleteLink";
import Onboarding from "./components/Onboarding/Onboarding";
import UpdateUser from "./components/UpdateUser/UpdateUser";
function App() {
  const [{ user, newUserFlag }, dispatch] = useStateValue();
  const [filteredData, setFilteredData] = useState([]);

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
                <Onboarding />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </Router>
        ) : newUserFlag ? (
          <Onboarding />
        ) : (
          <Router>
            <Switch>
              <Route path="/myprofile">
                <Header backButton="/" />
                <UpdateUser />
              </Route>
              <Route path="/chat/:chatId">
                <Header backButton="/chat" />
                <ChatScreen />
              </Route>
              <Route path="/chat">
                <Header backButton="/" />
                <Chats />
              </Route>

              <Route path="/">
                <Header />
                <Filter onApplyFilters={setFilteredData} />

                <AthleteLinkCards data={filteredData} />
                <SwipeButtons />
              </Route>
            </Switch>
          </Router>
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
