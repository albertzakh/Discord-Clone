import { createContext, useReducer } from "react";

export const GroupModalContext = createContext();

function GroupModalReducer(state, action) {
    switch(action.type) {
      case "OPEN":
        return {open: true}
      case "CLOSE":
        return {open: false}
      default:
        return state
    }
}

export const GroupModalContextProvider = ({ children }) => {
  const [groupModal, GroupModalDispatch] = useReducer(GroupModalReducer, {
    open: false
  });

  return (
    <GroupModalContext.Provider value={{...groupModal, GroupModalDispatch}}>{children}</GroupModalContext.Provider>
  )
}