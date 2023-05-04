import { createContext, useReducer } from "react";

export const FriendsContext = createContext();

function FriendsContextReducer(state, action) {
    switch(action.type) {
      case "FETCH_ACCEPTED_FRIENDS":
          return {acceptedFriends: action.payload, blockedFriends:state.blockedFriends, groups:state.groups, groupPending: state.groupPending, friendPending: state.friendPending};
      case "FETCH_ACCEPTED_GROUPS":
        return {groups:action.payload, blockedFriends:state.blockedFriends, acceptedFriends:state.acceptedFriends, groupPending: state.groupPending, friendPending: state.friendPending}
      case "FETCH_BLOCKED_FRIENDS":
        return {groups:state.groups, blockedFriends:action.payload, acceptedFriends:state.acceptedFriends, groupPending: state.groupPending, friendPending: state.friendPending}
      case "FETCH_PENDING_GROUPS":
        return {groups:state.groups, blockedFriends:state.blockedFriends, acceptedFriends:state.acceptedFriends, groupPending: action.payload, friendPending: state.friendPending}
      case "FETCH_PENDING_FRIENDS":
        return {groups:state.groups, blockedFriends:state.blockedFriends, acceptedFriends:state.acceptedFriends, groupPending: state.groupPending, friendPending: action.payload}
      default:
        return state
    }
}

export const FriendsContextProvider = ({ children }) => {
  const [state, friendsDispatch] = useReducer(FriendsContextReducer, {
    acceptedFriends: [],
    blockedFriends: [],
    groupPending: [],
    friendPending: [],
    groups: []
  });

  return (
    <FriendsContext.Provider value={{...state, friendsDispatch}}>
      {children}
    </FriendsContext.Provider>
  )
}