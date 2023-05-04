import { createContext, useReducer, useEffect } from "react";
import AuthFetch from "../hooks/AuthFetch";

export const UserContext = createContext();

export const UserReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return { user: action.payload }
        case "LOGOUT":
            return { user: null }
        default:
            return state;
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, authDispatch] = useReducer(UserReducer, {user:null});

    return (
        <UserContext.Provider value={{...state, authDispatch}}>
            {children}
        </UserContext.Provider>
    )
}