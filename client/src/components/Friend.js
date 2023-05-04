import { useState, useEffect, useContext } from 'react';
import { NavContext } from "../context/NavContext";
import { useNavigate } from "react-router-dom";
import { ModalContext } from '../context/ModalContext';
import { ReactComponent as BlockFriend } from "../img/Block.svg";
import AuthFetch from '../hooks/AuthFetch';
import { SocketContext } from '../context/SocketContext';

function Friend({ _id, username, profilePic }) {
  const { user } = AuthFetch();  
  const { socket } = useContext(SocketContext);
  const { BlockedOptions, ModalDispatch } = useContext(ModalContext);
  const { navDispatch } = useContext(NavContext);

  const [chatRoom, setChatRoom] = useState("");
  
  const navigate = useNavigate();

  const handleRemoveFriendModalOpen = (event) => {
    event.stopPropagation();
    ModalDispatch({ type: "BLOCK_OPEN", payload: { _id, username, chatRoom }  });
  }

  const handleFriendClick = () => {      
    navDispatch({ type: "FRIEND" });
    navigate(`/${_id}`);
  }

  useEffect(() => {
    if(!socket) return;
    socket.emit("get_chat_id", { userId: user?._id, id: _id });

    socket.on("recieve_chat_id", (data) => setChatRoom(data))
  }, []);

  return (
    <div onClick={handleFriendClick} className={`relative flex mt-[2px] p-[6px] px-2 items-center w-full cursor-pointer rounded-md hover:bg-[#3b3d44] group`}>
        <img src={profilePic} className="w-[32px] h-[32px] object-cover rounded-full" />
        <p className="ml-[10px] text-[#6f757c] text-[15px] group-hover:text-white">{username}</p>
        <BlockFriend onClick={handleRemoveFriendModalOpen} className="absolute right-3 text-white hidden group-hover:block font-bold w-4 h-4 z-index-4" />
    </div>
  )
}

export default Friend;