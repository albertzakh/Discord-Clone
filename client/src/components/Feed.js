import { useEffect, useContext } from "react"; 
import { NavContext } from "../features/NavContext";
import { UserContext } from "../features/UserContext";
import { useNavigate } from "react-router-dom";
import FeedOnline from './FeedOptions/FeedOnline';
import FeedPending from './FeedOptions/FeedPending';
import FeedAll from './FeedOptions/FeedAll';
import FeedBlocked from './FeedOptions/FeedBlocked';
import FeedFriendInvite from './FeedOptions/FeedFriendInvite';
import AuthFetch from "../hooks/AuthFetch";

function Feed() {
  const { user } = AuthFetch();
  const { friendsPage, onlinePage, allPage, pendingPage, blockedPage, friendInvitePage } = useContext(NavContext);

  const navigate = useNavigate();

  return (
    <div className="w-[70%] h-almost flex flex-col py-5 border-r border-[#1e293b] bg-feed">
      {friendsPage ? <FeedOnline /> : onlinePage ? <FeedOnline /> : allPage ? <FeedAll /> : pendingPage ? <FeedPending /> : blockedPage ? <FeedBlocked /> : friendInvitePage ? <FeedFriendInvite /> : <FeedOnline />
      }
    </div>
  )
}

export default Feed