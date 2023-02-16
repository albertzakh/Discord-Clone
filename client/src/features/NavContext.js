import { createContext, useReducer } from "react";

export const NavContext = createContext();

export const NavReducer = (state, action) => {
  switch(action.type) {
    case "FRIENDS":
      return { friendsPage: true, onlinePage: false, allPage: false, pendingPage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "ONLINE":
      return { friendsPage: false, onlinePage: true, allPage: false, pendingPage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "ALL":
      return { friendsPage: false, onlinePage: false, allPage: true, pendingPage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "PENDING":
      return { friendsPage: false, onlinePage: false, allPage: false, pendingPage: true, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "BLOCKED":
      return { friendsPage: false, onlinePage: false, allPage: false, pendingPage: false, blockedPage: true, friendInvitePage: false, singleFriendPage: false }
    case "INVITE":
      return { friendsPage: false, onlinePage: false, allPage: false, pendingPage: false, blockedPage: false, friendInvitePage: true, singleFriendPage: false }
    case "FRIEND": 
      return { friendsPage: false, onlinePage: false, allPage: false, pendingPage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: true }
    default:
      return state;
  }
}

export const NavContextProvider = ({ children }) => {
  const [state, navDispatch] = useReducer(NavReducer, {
    friendsPage: false,
    onlinePage: false,
    allPage: false,
    pendingPage: false,
    blockedPage: false,
    friendInvitePage: false,
    singleFriendPage: false,
  });

  return (
    <NavContext.Provider value={{...state, navDispatch}}>
      {children}
    </NavContext.Provider>
  )
}