export const initialState = {
  user: null,
  newUserFlag: false
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_NEW_USER_FLAG: "SET_NEW_USER_FLAG"
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_NEW_USER_FLAG:
      return {
        ...state,
        newUserFlag: action.newUserFlag,
      };
    default:
      return state;
  }
};

export default reducer;