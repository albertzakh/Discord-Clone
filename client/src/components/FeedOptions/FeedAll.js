import { useEffect, useContext } from 'react';
import FeedFriend from './FeedFriend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FriendsContext } from '../../features/FriendsContext';
import AuthFetch from '../../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';
import PendingLogo from  "../../img/Offline.svg";

function FeedAll() {
  const { user } = AuthFetch();
  const { acceptedFriends } = useContext(FriendsContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user]);
  
  return (
    <>
    <div className="w-full px-10">
      <div className="flex w-full h-9 bg-[#202225] items-center text-white px-3 rounded-[5px]">
        <input className="flex-1 text-sm bg-[#202225] border-none outline-none text-[15px]" type="text" placeholder="Search" />
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <p className="text-sm font-bold text-gray relative top-6">ALL FRIENDS - {acceptedFriends.length && acceptedFriends.length}</p>
    </div>
      
      {acceptedFriends.length > 0 ? (
        <div className="mt-10 px-8 overflow-y-auto w-full scrollbar-thumb-sidebar_bg scrollbar-thin">
            {acceptedFriends.map(friend => (<FeedFriend key={friend._id} {...friend} />))}
           </div>
      ) : (
        <div className="mt-10 h-full flex items-center justify-center flex-col">
          <img src={PendingLogo} />
          <span className="text-defaultText text-center mt-10 text-2sm">There have no friends. Here's Wumpus for now.</span>
        </div> 
      )}
     
    </>
  )
}

export default FeedAll