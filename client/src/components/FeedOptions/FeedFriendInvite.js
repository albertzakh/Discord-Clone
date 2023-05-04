import { useEffect, useState, useContext } from 'react';
import AuthFetch from '../../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';

function FeedFriendInvite() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])

  const [inputValue, setInputValue] = useState("");
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    if(inputValue == "") {
      setButtonActive(false)
    } else {
      setButtonActive(true);
    }
  }, [inputValue]);

  const handleFriendRequest = async (e) => {
    e.preventDefault();
    
    socket.emit("friend_invite_sent", { userId: user?._id, friendInfo: inputValue });
    setInputValue("");
  }

  return (
    <div className="px-10">
      <strong className="text-white text-sm">ADD FRIEND</strong>
      <p className="text-[13px] text-gray mt-1">You can add a friend with their Discord Tag. Its' cAsE sEnSitivE</p>
      <div className="flex mt-5 bg-sidebar_bg p-2 border-[1px] border-black rounded-md">
        <input value={inputValue} type="text" className="flex-1 p-1 bg-sidebar_bg outline-none text-white text-sm" placeholder="Enter a Username#0000" onChange={(e) => setInputValue(e.target.value)} />
        <button onClick={handleFriendRequest} className={`${buttonActive ? "bg-[#5865f2] text-white" : "bg-inviteBtn text-[#848691]"} text-white rounded-sm px-4 text-[12px]`}>Send Friend Request</button>

      </div>
    </div>
  )
}

export default FeedFriendInvite