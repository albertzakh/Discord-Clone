import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import { NavContext } from "../context/NavContext";
import { ModalContext } from "../context/ModalContext";
import Friend from "./Friend";
import Group from "./Group";
import CreateGroup from "./CreateGroup";
import { FriendsContext } from "../context/FriendsContext";
import { SocketContext } from "../context/SocketContext";
import { ReactComponent as WaveSVG } from "../img/Wave.svg";

function UserList() {
  const { user, authDispatch } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { friendsPage, singleFriendPage, navDispatch } = useContext(NavContext);
  const { GroupOpen, ModalDispatch } = useContext(ModalContext);
  const { acceptedFriends, friendPending, groupPending, blockedFriends, groups, friendsDispatch } = useContext(FriendsContext);

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

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_pending_all", { userId: user?._id });

    socket.on("recieve_pending_all", (data) => {
      friendsDispatch({ type: "FETCH_PENDING_FRIENDS", payload: data })
    });
  }, [friendPending]);

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_group_pending_all", { userId: user?._id })

    socket.on("recieve_group_pending_all", (data) => {
      friendsDispatch({ type: "FETCH_PENDING_GROUPS", payload: data })
    })
  }, [groupPending]);

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_blocked_all", { userId: user?._id });

    socket.on("recieve_blocked_all", (data) => {
      friendsDispatch({ type: "FETCH_BLOCKED_FRIENDS", payload: data })
    });
  }, [blockedFriends]);

  return (
    <>
    <div className="relative flex flex-col items-center w-[240px] max-h-screen bg-[#2b2d31] pt-2">
      <input type="text" placeholder="Find or start a conversation" className="w-[93%] py-1 m-1 outline-none rounded-sm bg-[#202225] text-[13px] px-2 text-white" />  
      <div className="flex flex-col gap-1 w-full mt-2 pt-2 h-[90%] px-2">
        <div onClick={handleFriendsClicked} onMouseOver={() => setFriendHovered(true)} onMouseOut={() => setFriendHovered(false)} className={friendsPage ? `flex items-center w-full h-10 text-white px-2 rounded-[4px] cursor-pointer bg-[#3c3f45]` : "flex items-center w-full h-10 text-white px-2 rounded-[4px] cursor-pointer hover:bg-[#3c3f45]"}>
          <WaveSVG className={!singleFriendPage ? "text-white" : friendHovered ? "text-white" : "text-[#6f757c]"} />
          <p className={`${!singleFriendPage ? "text-white" : friendHovered ? "text-white" : "text-[#6f757c]"} mx-4 font-medium text-[16px]`}>Friends</p>
        </div>
        <div className="flex items-center w-full h-11 text-white px-2 rounded-[4px] cursor-pointer hover:bg-[#3c3f45]">
          <WaveSVG className={"text-[#6f757c]"} />
          <p className={`text-[#6f757c] mx-4 font-medium text-[16px]`}>Nitro</p>
        </div>
        <div className="flex justify-between mt-3 relative" onMouseOver={() => setDMWordHover(true)} onMouseOut={() => setDMWordHover(false)}>
          <p className={`${ DMwordHover ? "text-[#cec9c9]" : "text-[#8a9099]"} font-bold text-[13px] mx-2`}>DIRECT MESSAGES</p>
          <div className={`${createDMHover ? "visible" : "hidden"} absolute right-[-32px] bottom-7 bg-black px-[8px] py-[6px] rounded-md`}><p className="text-white text-[13px]">Create DM</p></div>
          <FontAwesomeIcon 
            onClick={() => ModalDispatch({ type: "GROUP_OPEN" })}
            onMouseOver={() => setCreateDMHover(true)} 
            onMouseOut={() => setCreateDMHover(false)} 
            icon={faPlus} 
            className="text-white cursor-pointer mr-2"
            fontSize={14}   
          />
          {GroupOpen ? <CreateGroup friends={acceptedFriends} socket={socket} /> : null}
        </div>
        <div className="w-full my-2 flex-1 max-h-[500px] overflow-auto scroll-px-6 scrollbar-thumb-sidebar_bg scrollbar-thin">
          <div className="w-[93%]">
            {acceptedFriends.length > 0 ? acceptedFriends.map(friend => (
              <Friend key={friend._id} {...friend} />            
            )) : null}
            {groups.length > 0 ? groups.map(group => (
              <Group {...group} />
            )) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center px-2 w-full h-16 bg-[#232428] justify-between pr-3">
        <div className="flex">
          <img src={user?.profilePic} className="w-[30px] h-[30px] rounded-full" />
          <div className="flex flex-col mx-2">
            <strong className="text-[13px] text-white">{user?.username}</strong>
            <p className="text-[11px] text-[#6f757c]">#{user?.hash}</p>
          </div>
        </div>
        <FontAwesomeIcon 
          onClick={handleLogout}
          icon={faHouse} 
          className="text-gray cursor-pointer hover:text-white"
          fontSize={18} 
        />
      </div>
    </div>
    </>
    
  )
}

export default UserList