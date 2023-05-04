import { createContext, useReducer } from "react";

export const SocketContext = createContext();

function SocketContextReducer(state, action) {
    switch(action.type) {
      case "CONNECT_SOCKET":
        return {socket: action.payload}
      case "DISCONNECT_SOCKET":
        return {socket: null}
      default:
        return state
    }
}

export const SocketContextProvider = ({ children }) => {
  const [state, socketDispatch] = useReducer(SocketContextReducer, {
    socket: null
  });

  return (
    <SocketContext.Provider value={{...state, socketDispatch}}>{children}</SocketContext.Provider>
  )
}