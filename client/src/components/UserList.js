import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../features/UserContext";
import { NavContext } from "../features/NavContext";
import { GroupModalContext } from "../features/GroupModalContext";
import { v4 as uuidv4 } from 'uuid';
import Friend from "./Friend";
import Group from "./Group";
import CreateGroup from "./CreateGroup";
import { FriendsContext } from "../features/FriendsContext";
import { SocketContext } from "../features/SocketContext";
import { ReactComponent as WaveSVG } from "../img/Wave.svg";

function UserList() {
  const { user, authDispatch } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { friendsPage, navDispatch } = useContext(NavContext);
  const { open, GroupModalDispatch } = useContext(GroupModalContext);
  const { acceptedFriends, groups, friendsDispatch } = useContext(FriendsContext);

  const [DMwordHover, setDMWordHover] = useState(false);
  const [createDMHover, setCreateDMHover] = useState(false);

  const [friendHovered, setFriendHovered] = useState(false);

  const navigate = useNavigate();

  const handleFriendsClicked = () => {
    navDispatch({ type: "FRIENDS" });
    navigate("/");
  }

  const handleLogout = async () => {
    authDispatch({ type: "LOGOUT" });    
    const res = await fetch("/api/auth/logout");
  }

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_accepted_all", { userId: user?._id });

    socket.on("recieve_accepted_all", (data) => {
      friendsDispatch({ type: "FETCH_ACCEPTED_FRIENDS", payload:data });
    });
  }, [acceptedFriends])

  useEffect(() => {
    if(!socket) return;
    socket.emit("get_groups", { userId: user?._id })

    socket.on("display_group", (data) => {
      friendsDispatch({ type: "FETCH_ACCEPTED_GROUPS", payload: data })
    });
  }, [groups]);

  return (
    <>
    <div className="relative flex flex-col items-center w-[250px] h-screen bg-[#2f3136] pt-2">
      <input type="text" placeholder="Find or start a conversation" className="w-[90%] h-[27px] outline-none rounded-md bg-[#202225] text-[13px] px-2 text-white" />  
      <div className="flex flex-col gap-1 w-[92%] mt-2 pt-2">
        <div onClick={handleFriendsClicked} onMouseOver={() => setFriendHovered(true)} onMouseOut={() => setFriendHovered(false)} className={friendsPage ? `flex items-center w-full h-10 text-white px-2 rounded-[4px] cursor-pointer bg-[#3c3f45]` : "flex items-center w-full h-10 text-white px-2 rounded-[4px] cursor-pointer hover:bg-[#3c3f45]"}>
          <WaveSVG className={friendsPage ? "text-white" : "text-[#6f757c]"} />
          <p className={`${friendsPage ? "text-white" : "text-[#6f757c]"} mx-4 font-medium text-[16px]`}>Friends</p>
        </div>
        <div className="flex items-center w-full h-11 text-white px-2 rounded-[4px] cursor-pointer hover:bg-[#3c3f45]">
          <WaveSVG className={"text-[#6f757c]"} />
          <p className={`text-[#6f757c] mx-4 font-medium text-[16px]`}>Nitro</p>
        </div>
        <div className="flex justify-between mt-3 relative" onMouseOver={() => setDMWordHover(true)} onMouseOut={() => setDMWordHover(false)}>
          <p className={`${ DMwordHover ? "text-[#ffffff]" : "text-[#6f757c]"} font-bold text-[13px] mx-2`}>DIRECT MESSAGES</p>
          <div className={`${createDMHover ? "visible" : "hidden"} absolute right-[-32px] bottom-7 bg-black px-[8px] py-[6px] rounded-md`}><p className="text-white text-[13px]">Create DM</p></div>
          <FontAwesomeIcon 
            onClick={() => GroupModalDispatch({ type: "OPEN" })}
            onMouseOver={() => setCreateDMHover(true)} 
            onMouseOut={() => setCreateDMHover(false)} 
            icon={faPlus} 
            className="text-[#b9bbbe] cursor-pointer"
            fontSize={14} 
          />
          {open ? <CreateGroup friends={acceptedFriends} socket={socket} /> : null}
        </div>
        <div className="w-full my-2 overflow-y-auto scrollbar-thumb-sidebar_bg scrollbar-thin">
          {acceptedFriends.length > 0 ? acceptedFriends.map(friend => (
            <Friend key={friend._id} {...friend} />            
          )) : null}
          {groups.length > 0 ? groups.map(group => (
            <Group key={group._id} {...group} />
          )) : null}
        </div>
      </div>
      <div className="flex items-center px-2 absolute bottom-0 w-full h-16 bg-[#292b2f] justify-between pr-3">
        <div className="flex">
          <img src={user?.profilePic} className="w-[30px] h-[30px] rounded-full" />
          <div className="flex flex-col mx-2">
            <strong className="text-[13px] text-white">{user?.username}</strong>
            <p className="text-[11px] text-[#6f757c]">#{user?.hash}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red px-1 py-[3px] text-white rounded-md text-sm">Logout</button>
      </div>
    </div>
    </>
    
  )
}

export default UserList