import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { SocketContext } from '../context/SocketContext';
import AuthFetch from '../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';

function BlockModal() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);
  const { BlockedOptions, GroupRemoveOptions, ModalDispatch } = useContext(ModalContext);

  const navigate = useNavigate();

  const handleBlockFriend = async () => {
    socket.emit("block_friend", { userId: user?._id, friendId: BlockedOptions?.friendInfo?._id, chatRoom: BlockedOptions?.friendInfo?.chatRoom } );
    ModalDispatch({ type: "BLOCK_CLOSE" });
    navigate("/");
  }

  const handleGroupRemove = () => {
    if(!socket) return;
    socket.emit("delete_leave_group", { userId: user?._id, groupRoom: GroupRemoveOptions?.groupInfo?.groupId } );
    ModalDispatch({ type: "REMOVE_GROUP_CLOSE" });
    navigate("/");
  }

  return (
    <>
    {BlockedOptions?.BlockOpen ? (
      <div className={`absolute w-full h-full z-10 bg-[rgba(9,9,9,0.71)] flex items-center justify-center`}>
      <div className="w-[30rem] bg-[#353940] rounded-[6px]">
        <h2 className="text-white font-bold text-[23px] m-3">Block {BlockedOptions?.friendInfo?.username}</h2>
        <p className="text-white font-medium m-3 mb-10">Are you sure you want to block this user? They will not be able to message you unless they are unblocked.</p>
        <div className="bg-[#303135] p-4 flex justify-end items-center gap-4 rounded-[6px]">
          <button onClick={() => ModalDispatch({ type: "BLOCK_CLOSE" })} className="bg-inherit text-white font-bold">Cancel</button>
          <button onClick={handleBlockFriend} className="bg-red text-white font-semibold px-4 py-2 rounded-[4px] hover:bg-[#9f2525]">Block User</button>
        </div>
      </div>
    </div>
    ) : GroupRemoveOptions.GroupRemoveOpen ? (
      <div className={`absolute w-full h-full z-10 bg-[rgba(9,9,9,0.71)] flex items-center justify-center`}>
      <div className="w-[30rem] bg-[#353940] rounded-[6px]">
        <h2 className="text-white font-bold text-[23px] m-3">{GroupRemoveOptions?.groupInfo?.isCreator ? "DELETE" : "LEAVE"} '{GroupRemoveOptions?.groupInfo?.name}'</h2>
        <p className="text-white font-medium mx-3 my-4 mb-10 bg-red p-2 rounded-[4px]">Are you sure you want to {GroupRemoveOptions?.groupInfo?.isCreator ? "delete" : "leave"} <strong>{GroupRemoveOptions?.groupInfo?.name}</strong><br />This action cannot be undone.</p>
        <div className="bg-[#303135] p-4 flex justify-end items-center gap-4 rounded-[6px]">
          <button onClick={() => ModalDispatch({ type: "REMOVE_GROUP_CLOSE" })} className="bg-inherit text-white font-bold">Cancel</button>
          <button onClick={handleGroupRemove} className="bg-[#d84040] text-white font-semibold px-4 py-2 rounded-[4px] hover:bg-[#9f2525]">{GroupRemoveOptions?.groupInfo?.isCreator ? "Delete" : "Leave"} Server</button>
        </div>
      </div>
    </div>
    ) : null}
    </>
    
    )
}

export default BlockModal