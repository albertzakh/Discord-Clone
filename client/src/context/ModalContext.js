import { createContext, useReducer } from "react";

export const ModalContext = createContext({});

function ModalReducer(state, action) {
    switch(action.type) {
      case "GROUP_OPEN":
        return {GroupOpen: true, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: state.blockedOptions, GroupRemoveOptions:state.GroupRemoveOptions}
      case "GROUP_CLOSE":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: state.blockedOptions, GroupRemoveOptions:state.GroupRemoveOptions}
      case "BLOCK_OPEN":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: { BlockOpen: true, friendInfo: action.payload }, GroupRemoveOptions: state.GroupRemoveOptions }
      case "BLOCK_CLOSE":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: { BlockOpen: false, friendInfo: action.payload }, GroupRemoveOptions: state.GroupRemoveOptions }
      case "REMOVE_GROUP_OPEN":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: { BlockOpen: false, friendInfo: {} }, GroupRemoveOptions: { GroupRemoveOpen: true, groupInfo: action.payload }}
      case "REMOVE_GROUP_CLOSE":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: { BlockOpen: false, friendInfo: {} }, GroupRemoveOptions: { GroupRemoveOpen: false, groupInfo: {} }}
      case "INVITE_GROUP_OPEN":
        return {GroupOpen: false, InviteOptions: { InviteOpen: true, GroupInviteInfo: action.payload }, BlockedOptions: { BlockOpen: false, friendInfo: {} }, GroupRemoveOptions: { GroupRemoveOpen: false, groupInfo: {} }}
      case "INVITE_GROUP_CLOSE":
        return {GroupOpen: false, InviteOptions: { InviteOpen: false, GroupInviteInfo: {} }, BlockedOptions: { BlockOpen: false, friendInfo: {} }, GroupRemoveOptions: { GroupRemoveOpen: false, groupInfo: {} }}
      default:
        return state
    }
}

export const ModalContextProvider = ({ children }) => {
  const [modal, ModalDispatch] = useReducer(ModalReducer, {
    GroupOpen: false,
    BlockedOptions: { BlockOpen: false, friendInfo: {} },
    GroupRemoveOptions: { GroupRemoveOpen: false, groupInfo: {} },
    InviteOptions: { InviteOpen: false, GroupInviteInfo: {} },
  });

  return (
    <ModalContext.Provider value={{...modal, ModalDispatch}}>{children}</ModalContext.Provider>
  )
}