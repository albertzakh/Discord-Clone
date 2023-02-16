import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../features/UserContext";
import GroupChat from '../components/GroupChat';
import { GroupModalContext } from "../features/GroupModalContext";
import Sidebar from '../components/Sidebar';
import UserList from '../components/UserList';
import AuthFetch from "../hooks/AuthFetch";

function SingleGroup() {
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
      
      <GroupChat />
    </div>
  )
}

export default SingleGroup;