import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { FriendsContext } from '../context/FriendsContext'
import { ReactComponent as BlockFriend } from "../img/Block.svg";
import { ModalContext } from '../context/ModalContext';
import { SocketContext } from '../context/SocketContext';
import { UserContext } from '../context/UserContext';
import AuthFetch from '../hooks/AuthFetch';

function InviteGroupModal() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);
  const { acceptedFriends } = useContext(FriendsContext);
  const { InviteOptions, ModalDispatch } = useContext(ModalContext);

  const navigate = useNavigate();

  const handleGroupInvite = (friendId) => {
    if(!socket) return;
    socket.emit("group_invite_send", { userId: user._id, friendId,  groupId: InviteOptions?.GroupInviteInfo?.room  });

    navigate(`/${friendId}`);
    ModalDispatch({ type: "INVITE_GROUP_CLOSE" }); 
  }

  // Also option for getting user members in the payload, and only render friends that are not in the group
    
  return (
    <>
    {InviteOptions.InviteOpen ? (
    <div className={`absolute w-full h-full z-10 bg-[rgba(9,9,9,0.71)] flex items-center justify-center`}>
        <div className="w-[30rem] bg-[#313338] rounded-[6px]">
            <div className="flex items-center justify-between">
                <p className="text-white font-[13px] m-3">Invite friend to <strong>GROUP_NAME</strong></p>
                <BlockFriend onClick={() => ModalDispatch({ type: "INVITE_GROUP_CLOSE" })} className="m-3 text-[#71757b] hover:cursor-pointer" />
            </div>
            <div className="mt-3 border-t-[1px] p-3 max-h-[300px] overflow-auto scroll-px-6 scrollbar-thumb-sidebar_bg scrollbar-thin">
                {acceptedFriends.length > 0 ? acceptedFriends.map(friend => {
                  return (
                    <>
                      <div key={friend._id} onClick={() => handleGroupInvite(friend._id)} className="group flex relative items-center py-2 px-3 hover:bg-[#393c41] rounded-[5px] cursor-pointer">
                          <img src={friend.profilePic} className="w-[35px] h-[35px] rounded-full" />
                          <p className="ml-2 text-white">{friend.username}</p>
                          <button className="absolute right-2 border-[1px] py-1 px-4 text-[15px] text-white border-[#248046] group-hover:bg-[#34e718] rounded-[4px]">Invite</button>
                      </div>
                    </>
                  )
                }) : null}
            </div>
        </div>
    </div>
    ) : null}
    </>
    
  )
}

export default InviteGroupModal