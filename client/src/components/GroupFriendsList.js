import { useState, useEffect, useRef } from 'react';

function GroupFriendsList({ username, userHash, profilePic, groupChecked, setGroupChecked }) {
  const [groupFriendClicked, setGroupFriendClicked] = useState(false);
  const checkRef = useRef();

  const handleCheckFriend = () => {
    setGroupFriendClicked(!groupFriendClicked);
  }
  
  useEffect(() => {
    if(checkRef.current.checked && groupChecked.length < 8) {
      const user = `${username}#${userHash}`;
      setGroupChecked([...groupChecked, {user: user}]);
    } else {
      const user = `${username}#${userHash}`;
      const newGroupChecked = groupChecked.filter(friend => friend.user !== user);
      const removedFriend = groupChecked.filter(friend => friend.user == user);
      newGroupChecked.map(friend => delete removedFriend.user);
      setGroupChecked(newGroupChecked);
    }
  }, [groupFriendClicked]);

  return (
    <div onClick={handleCheckFriend} className="relative flex items-center hover:bg-[#3e4148] cursor-pointer py-1 px-2 rounded-[4px]">
      <img className="w-8 h-8 rounded-full object-cover" src={profilePic} />
      <span className="text-white text-sm ml-2">{username}</span>
      <p className="text-gray text-sm">#{userHash}</p>
      <input ref={checkRef} onChange={handleCheckFriend} className="absolute right-0 w-5 h-5 mr-2" type="checkbox" checked={groupFriendClicked} />
    </div>
  )
}

export default GroupFriendsList;