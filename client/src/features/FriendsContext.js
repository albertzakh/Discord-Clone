import { createContext, useReducer } from "react";

export const FriendsContext = createContext();

function FriendsContextReducer(state, action) {
    switch(action.type) {
      case "FETCH_PENDING_FRIENDS":
        return {pendingFriends: action.payload, acceptedFriends:state.acceptedFriends, groups:state.groups};
      case "REMOVE_PENDING_FRIENDS":
        return {pendingFriends: []};
      case "FETCH_ACCEPTED_FRIENDS":
          return {acceptedFriends: action.payload, pendingFriends:state.pendingFriends, groups:state.groups};
      case "REMOVE_ACCEPTED_FRIENDS":
        return {acceptedFriends: []}
      case "FETCH_ACCEPTED_GROUPS":
        return {groups:action.payload, pendingFriends:state.pendingFriends, acceptedFriends:state.acceptedFriends}
      default:
        return state
    }
}

export const FriendsContextProvider = ({ children }) => {
  const [state, friendsDispatch] = useReducer(FriendsContextReducer, {
    pendingFriends: [],
    acceptedFriends: [],
    blockedFriends: [],
    groups: []
  });

  return (
    <FriendsContext.Provider value={{...state, friendsDispatch}}>
      {children}
    </FriendsContext.Provider>
  )
}