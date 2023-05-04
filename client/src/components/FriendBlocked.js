import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

function FriendBlocked({ username, profilePic, _id, user }) {
    const { socket } = useContext(SocketContext);

    const handleRemoveConversation = () => {
        if(!socket) return;
        socket.emit("remove_conversation", { userId: user?._id, friendId: _id  } );

    }

    const handleCancelBlocked = () => {
        if(!socket) return;        
        socket.emit("cancel_remove_conversation", { userId: user?._id, friendId: _id  } );
    }

  return (
    <div className="w-full border-b-[1px] p-[10px] flex flex-row hover:rounded-[8px] cursor-pointer border-[#40444b] justify-between">
        <div className="flex">
            <img className="w-9 h-9 object-cover rounded-full" src={profilePic} />
            <div className="ml-3">
                <strong className="text-white text-sm">{username}</strong>
                <p className="text-[13px] text-gray">Idle</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={handleRemoveConversation} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faCheck} /></button>
            <button onClick={handleCancelBlocked} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faX} /></button>
        </div>
    </div>

  )
}

export default FriendBlocked