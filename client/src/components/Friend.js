import { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { NavContext } from "../features/NavContext";
import { useNavigate } from "react-router-dom";

function Friend({ _id, username, profilePic }) {
  const { navDispatch } = useContext(NavContext);
  const navigate = useNavigate();

  const handleFriendClick = () => {
    navDispatch({ type: "FRIEND" });
    navigate(`/${_id}`, {state: { _id, username }});
  }

  return (
    <div onClick={handleFriendClick} className="relative flex mt-[2px] p-[6px] px-2 items-center w-full cursor-pointer rounded-md hover:bg-[#3c3f45] group">
        <img src={profilePic} className="w-[32px] h-[32px] object-cover rounded-full" />
        <p className="ml-4 text-[#6f757c] text-[15px] group-hover:text-white">{username}</p>
        <FontAwesomeIcon className="absolute right-3 text-[#8a909c] hidden group-hover:block font-bold" fontSize={15} icon={faX} />
    </div>
  )
}

export default Friend;