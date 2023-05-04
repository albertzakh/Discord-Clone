import { useState, useEffect, useRef, useContext  } from "react";
import GroupFriendsList from "./GroupFriendsList";
import { UserContext } from "../context/UserContext";
import { ModalContext } from "../context/ModalContext";
import { SocketContext } from "../context/SocketContext";
import { FriendsContext } from "../context/FriendsContext";

function CreateGroup() {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { acceptedFriends } = useContext(FriendsContext);
  const { ModalDispatch } = useContext(ModalContext);

  const [groupChecked, setGroupChecked] = useState([]);
  const titleRef = useRef();

  const handleGroupCreate = () => {
    const title = titleRef.current.value;
    if(!title) return alert("No title");
    if(title.length > 16) return alert("Must not be max length of 16 characters");

    if(groupChecked.length <= 0) return alert("No user selected");

    socket.emit("create_group", {userId: user?._id, groupMembers: [...groupChecked], title });
    ModalDispatch({ type: "GROUP_CLOSE" });
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="absolute w-[425px] h-[400px] left-52 top-7 bg-feed border-[1px] border-black z-10 shadow-sidebar_popup py-4 rounded-md flex flex-col flex-wrap">
      <strong className="text-white text-[19px] ml-4">Select Friends</strong>
      <p className="text-[11px] text-gray ml-4">You can add {acceptedFriends.length} more people.</p>
      <div className="w-full px-3 py-1 mt-2"><input ref={titleRef} className="w-full bg-[#202225] text-[15px] text-white py-1 px-2 outline-none rounded-[4px]" type="text" placeholder="Enter group name" /></div>
      <div className="flex flex-col scrollbar-thumb-sidebar_bg scrollbar-thin flex-1 mt-4 px-2 h-[200px] gap-2">
        {acceptedFriends.length > 0 && acceptedFriends.map(friend => (
          <>
          <GroupFriendsList key={friend._id} {...friend} groupChecked={groupChecked} setGroupChecked={setGroupChecked} />
          </>
        ))}
      </div>
      <div className="w-[90%] mx-auto mt-6">
        <button onClick={handleGroupCreate} className="bg-[#5865f2] hover:bg-[#4752c4] transition-all duration-150 ease-linear w-full h-9 text-white text-[13px] rounded-[4px]">Create Group DM</button>
      </div>
    </div>
  )
}

export default CreateGroup