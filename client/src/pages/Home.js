import { useEffect, useContext } from 'react';
import Feed from '../components/Feed';
import Sidebar from '../components/Sidebar';
import UserList from "../components/UserList";
import Status from '../components/Status';
import FeedHeader from '../components/FeedHeader';
import { useNavigate } from "react-router-dom";
import { ModalContext } from '../context/ModalContext';
import AuthFetch from '../hooks/AuthFetch';
import BlockModal from '../components/BlockModal';
import InviteGroupModal from '../components/InviteGroupModal';

function Home() {
  const { user } = AuthFetch();
  const { GroupOpen, BlockOpen, InviteOpen, ModalDispatch } = useContext(ModalContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user]); 
  
  return (
    <div onClick={GroupOpen ? () => ModalDispatch({ type: "GROUP_CLOSE" }) : null} className="flex">
      <BlockModal />
      <InviteGroupModal />
      
      <Sidebar /> 
      <UserList />

      <div className="flex flex-1 flex-col">
          <>
            <FeedHeader />
            <div className="flex flex-1 flex-row">
              <Feed />
              <Status />
            </div>
          </>        
      </div>
    </div>
  )
}

export default Home;