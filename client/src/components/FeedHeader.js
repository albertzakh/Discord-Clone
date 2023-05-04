import { faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavContext } from "../context/NavContext";
import { useContext } from "react"; 
import { ReactComponent as WaveSVG } from "../img/Wave.svg";

function FeedHeader() {
  const { navDispatch } = useContext(NavContext);
  const { groupInvitePage, allPage, pendingPage, blockedPage, friendInvitePage } = useContext(NavContext);

  return (
    <div className="w-full px-3 py-3 border-b border-[#27292c] bg-feed flex items-center">  
      <WaveSVG className="text-[#6f757c] text-sm" />   
      <strong className="text-white mx-2 text-[16px]">Friends</strong>
      <button onClick={() => navDispatch({type: "ALL"})} className={allPage ? `nav_btn bg-lightGray text-white ` : "nav_btn"}>All</button>
      <button onClick={() => navDispatch({type: "PENDING"})} className={pendingPage ? `nav_btn bg-lightGray text-white` : "nav_btn"}>Pending</button>
      <button onClick={() => navDispatch({type: "GROUP_INVITE"})} className={groupInvitePage ? `nav_btn bg-lightGray text-white` : "nav_btn"}>Group Invites</button>
      <button onClick={() => navDispatch({type: "BLOCKED"})} className={blockedPage ? `nav_btn bg-lightGray text-white ` : "nav_btn"}>Blocked</button>
      <button onClick={() => navDispatch({type: "INVITE"})} className={`${friendInvitePage ? "bg-feed text-[#42ab61]" : "bg-[#2d7d46] text-white"} text-sm bg-feed px-[10px] py-[2px] rounded-[4px] mx-2 font-bold`}>Add Friend</button>
    </div>
  )
}

export default FeedHeader;