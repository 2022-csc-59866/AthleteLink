export const initialState = {
  user: null,
  userData: null,
  matches: new Set(),
  likes: new Set(),
  likesme: new Set(),
  dislikes: new Set(),
  newUserFlag: false,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_USER_DATA: "SET_USER_DATA",
  SET_MATCHES: "SET_MATCHES",
  SET_LIKES: "SET_LIKES",
  SET_DISLIKES: "SET_DISLIKES",
  SET_LIKESME: "SET_LIKESME",
  SET_NEW_USER_FLAG: "SET_NEW_USER_FLAG",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        userData: action.userData,
      };
    case actionTypes.SET_NEW_USER_FLAG:
      return {
        ...state,
        newUserFlag: action.newUserFlag,
      };
    case actionTypes.SET_LIKES:
      return {
        ...state,
        likes: action.likes,
      };
    case actionTypes.SET_LIKESME:
      return {
        ...state,
        likesme: action.likesme,
      };
    case actionTypes.SET_DISLIKES:
      return {
        ...state,
        dislikes: action.dislikes,
      };
    case actionTypes.SET_MATCHES:
      return {
        ...state,
        matches: action.matches,
      };
    default:
      return state;
  }
};

export default reducer;
