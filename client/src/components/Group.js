import { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { NavContext } from "../features/NavContext";
import { useNavigate } from "react-router-dom";

function Friend({ _id, name }) {
  const { navDispatch } = useContext(NavContext);
  const navigate = useNavigate();

  const handleFriendClick = () => {
    navDispatch({ type: "FRIEND" });
    navigate(`/channels/${_id}`);
  }

  return (
    <div onClick={handleFriendClick} className="relative flex mt-[2px] p-[6px] px-2 items-center w-full cursor-pointer rounded-md hover:bg-[#3c3f45] group">
        <div className="w-[32px] h-[32px] bg-[#202225] rounded-full text-white flex items-center justify-center">A</div>
        <p className="ml-4 text-[#6f757c] group-hover:text-white text-[15px]">{name}</p>
        <FontAwesomeIcon className="absolute right-3 text-[#8a909c] hidden group-hover:block" fontSize={15} icon={faX} />
    </div>
  )
}

export default Friend;