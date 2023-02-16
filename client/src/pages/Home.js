import { useState, useEffect, useContext, useRef } from 'react';
import Feed from '../components/Feed';
import Sidebar from '../components/Sidebar';
import UserList from "../components/UserList";
import Status from '../components/Status';
import FeedHeader from '../components/FeedHeader';
import { useNavigate } from "react-router-dom";
import { GroupModalContext } from '../features/GroupModalContext';
import AuthFetch from '../hooks/AuthFetch';
import { SocketContext } from '../features/SocketContext';

function Home() {
  const { user } = AuthFetch();
  const { open, GroupModalDispatch } = useContext(GroupModalContext);

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user]);
  
  return (
    <div onClick={open ? () => GroupModalDispatch({ type: "CLOSE" }) : null} className="flex">
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