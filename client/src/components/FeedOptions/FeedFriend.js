import { useState, useEffect } from 'react';
import AuthFetch from '../../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';

function FeedFriend({ _id, username, profilePic, userHash }) {
  const { user } = AuthFetch();
  const [hashVisible, setHashVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])

  return (
    <div onClick={() => navigate(`/${_id}`)} onMouseMove={() => setHashVisible(true)} onMouseOut={() => setHashVisible(false)} className="w-full border-b-[1px] border-gray px-[10px] py-[6px] flex flex-row hover:rounded-[8px] cursor-pointer hover:border-[#40444b] hover:bg-[#40444b]">
      <img className="w-9 h-9 object-cover rounded-full" src={profilePic} />
      <div className="ml-3 mt-[-2px]">
        <strong className="text-white text-[13px]">{username}<span className={`${hashVisible ? "visible" : "hidden"} text-[#b6b8bb] font-normal`}>#{userHash}</span></strong>
        <p className="text-[13px] mt-[-1px] text-gray">Idle</p>
      </div>
    </div>
  ) 
}

export default FeedFriend