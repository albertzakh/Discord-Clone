import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AuthFetch from '../../hooks/AuthFetch';
import { useNavigate } from 'react-router-dom';

function FeedFriends() {
  const { user } = AuthFetch();

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])

  return (
    <>
      <div className="w-full px-10">
        <div className="flex w-full h-10 bg-[#202225] items-center text-white px-3 rounded-md">
          <input className="flex-1 text-sm bg-[#202225] border-none outline-none" type="text" placeholder="Search" />
          <FontAwesomeIcon icon={faSearch} />
        </div>
      </div>

      <div className="mt-10 px-8 overflow-y-auto w-full scrollbar-thumb-sidebar_bg scrollbar-thin">
        <p className="text-center text-gray">Knowone is currently online</p>
      </div>
    </>
  )     
}

export default FeedFriends;