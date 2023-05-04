import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import AuthFetch from '../../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';

function FeedGroup({ _id, name }) {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])

  const handleAcceptGroupRequest = () => {
    if(!socket) return;
    socket.emit("group_invite_accept", { userId: user?._id, groupId: _id } );
  }

  const handleDenyGroupRequest = () => {
    if(!socket) return;
    socket.emit("group_invite_decline", { userId: user?._id, groupId: _id } );
  }

  return (
    <div className="w-full border-b-[1px] p-[10px] flex flex-row hover:rounded-[8px] cursor-pointer border-[#40444b] justify-between">
      <div className="flex">
        <div className="w-[32px] h-[32px] bg-[#202225] rounded-full text-white flex items-center justify-center">A</div>
        <strong className="text-white text-sm ml-3">{name}</strong>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleAcceptGroupRequest} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faCheck} /></button>
        <button onClick={handleDenyGroupRequest} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faX} /></button>
      </div>
    </div>
  ) 
}

export default FeedGroup