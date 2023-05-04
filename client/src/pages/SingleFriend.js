import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FriendChat from '../components/FriendChat';
import { ModalContext } from "../context/ModalContext";
import Sidebar from '../components/Sidebar';
import UserList from '../components/UserList';
import AuthFetch from "../hooks/AuthFetch";
import BlockModal from "../components/BlockModal";
import InviteGroupModal from "../components/InviteGroupModal";

function SingleFriend() {
  const { user } = AuthFetch();
  const { GroupOpen, BlockOpen, ModalDispatch } = useContext(ModalContext);

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
      
      <FriendChat />
    </div>
  )
}

export default SingleFriend