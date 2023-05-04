import { createContext, useReducer } from "react";

export const NavContext = createContext();

export const NavReducer = (state, action) => {
  switch(action.type) {
    case "FRIENDS":
      return { friendsPage: true, allPage: false, pendingPage: false, groupInvitePage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "ALL":
      return { friendsPage: false, allPage: true, pendingPage: false, groupInvitePage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "PENDING":
      return { friendsPage: false, allPage: false, pendingPage: true, groupInvitePage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "BLOCKED":
      return { friendsPage: false, allPage: false, pendingPage: false, groupInvitePage: false, blockedPage: true, friendInvitePage: false, singleFriendPage: false }
    case "INVITE":
      return { friendsPage: false, allPage: false, pendingPage: false, groupInvitePage: false, blockedPage: false, friendInvitePage: true, singleFriendPage: false }
    case "GROUP_INVITE":
      return { friendsPage: false, allPage: false, pendingPage: false, groupInvitePage: true, blockedPage: false, friendInvitePage: false, singleFriendPage: false }
    case "FRIEND": 
      return { friendsPage: false, allPage: false, pendingPage: false, groupInvitePage: false, blockedPage: false, friendInvitePage: false, singleFriendPage: true }
    default:
      return state;
  }
}

export const NavContextProvider = ({ children }) => {
  const [state, navDispatch] = useReducer(NavReducer, {
    friendsPage: false,
    allPage: false,
    pendingPage: false,
    groupInvitePage: false,
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