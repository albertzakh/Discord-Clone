import { useState, useEffect, useContext } from "react";
import PendingLogo from  "../../img/Offline.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import AuthFetch from "../../hooks/AuthFetch";
import { useNavigate } from 'react-router-dom';
import { SocketContext } from "../../features/SocketContext";

function FeedPending() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);

  const [pendingFriends, setPendingFriends] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])

  const handleFriendAccept = async (friendInfo) => {
    socket.emit("accept_friend_invite", { userId: user?._id, friendInfo })
  }

  const handleFriendIgnore = async (friendInfo) => {
    socket.emit("decline_friend_invite", { userId: user?._id, friendInfo });
  }

  useEffect(() => {
    socket.emit("fetch_pending_all", { userId: user?._id });

    socket.on("recieve_pending_all", (data) => {
      setPendingFriends(data);
    });
  }, [pendingFriends]);

  return (
    <>
      {pendingFriends.length > 0 ? (
        <div className="px-8 overflow-y-auto w-full scrollbar-thumb-sidebar_bg scrollbar-thin">
          {pendingFriends.map(pendingFriend => (
             <div key={pendingFriend._id} className="w-full border-b-[1px] p-[10px] flex flex-row hover:rounded-[8px] cursor-pointer border-[#40444b] justify-between">
              <div className="flex">
                <img className="w-9 h-9 object-cover rounded-full" src={pendingFriend.profilePic} />
                <div className="ml-3">
                <strong className="text-white text-sm">{pendingFriend.username}</strong>
                <p className="text-[13px] text-gray">Idle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleFriendAccept(pendingFriend._id)} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faCheck} /></button>
                <button onClick={() => handleFriendIgnore(pendingFriend._id)} className="hover:bg-gray w-10 h-10 rounded-full"><FontAwesomeIcon icon={faX} /></button>
              </div>
             </div>
          ))}
        </div>
        ) : (
        <div className="mt-10 h-full flex items-center justify-center flex-col">
          <img src={PendingLogo} />
          <span className="text-defaultText text-center mt-10 text-2sm">There are no pending friend requests. Here's Wumpus for now.</span>
        </div> 
      )}
    </>
  )
}

export default FeedPending