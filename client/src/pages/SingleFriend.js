import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FriendChat from '../components/FriendChat';
import { GroupModalContext } from "../features/GroupModalContext";
import Sidebar from '../components/Sidebar';
import UserList from '../components/UserList';
import AuthFetch from "../hooks/AuthFetch";

function SingleFriend() {
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
      
      <FriendChat />
    </div>
  )
}

export default SingleFriend