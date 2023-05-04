import { useState, useEffect, useContext } from 'react';
import { ReactComponent as BlockFriend } from "../img/Block.svg";
import { NavContext } from "../context/NavContext";
import { useNavigate } from "react-router-dom";
import { ModalContext } from '../context/ModalContext';
import AuthFetch from '../hooks/AuthFetch';
import { SocketContext } from '../context/SocketContext';
import { FriendsContext } from '../context/FriendsContext';

function Group({ _id, name, creator }) {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);
  const { ModalDispatch } = useContext(ModalContext);  
  const { navDispatch } = useContext(NavContext);
  const { groups } = useContext(FriendsContext);

  const navigate = useNavigate();

  const handleDeleteChatModalOpen = (event) => {
    event.stopPropagation();
    ModalDispatch({ type: "REMOVE_GROUP_OPEN", payload: { groupId: _id, name, isCreator: creator == user._id }  });
  }

  const handleFriendClick = () => {
    navDispatch({ type: "FRIEND" });
    navigate(`/channels/${_id}`);
  }

  return (
    <div onClick={handleFriendClick} className="relative flex mt-[2px] p-[6px] px-2 items-center w-full cursor-pointer rounded-md hover:bg-[#3c3f45] group">
        <div className="w-[32px] h-[32px] bg-[#202225] rounded-full text-white flex items-center justify-center">A</div>
        <p className="ml-[10px] text-[#6f757c] group-hover:text-white text-[15px]">{name}</p>
        <BlockFriend onClick={handleDeleteChatModalOpen} className="absolute right-3 text-white hidden group-hover:block font-bold w-4 h-4 z-index-4" />
    </div>
  )
}

export default Group;