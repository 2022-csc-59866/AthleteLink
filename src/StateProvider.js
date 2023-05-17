import React, { createContext, useContext, useReducer, useEffect } from "react";

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => {
  // Initialize state from localStorage or use initialState if not available
  const [state, dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("my-app-state")) || initialState
  );

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("my-app-state", JSON.stringify(state));
  }, [state]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
