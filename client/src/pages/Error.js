import { useEffect, useContext } from 'react'
import { UserContext } from '../features/UserContext'
import { useNavigate } from 'react-router-dom';
import AuthFetch from '../hooks/AuthFetch';

function Error() {
  const { user } = AuthFetch();

  const navigate = useNavigate();

  useEffect(() => {
    if(!user) navigate("/login");
  }, [user])
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[#5865f2] text-[44px] font-extrabold">WRONG TURN?</h1>
      <p className="px-[450px] text-md text-center">
        You look lost, stranger. You know what helps when you’re lost? A piping hot bowl of noodles. Take a seat, we’re frantically at work here cooking up something good. Oh, you need something to read? These might help you:
      </p>
      <button onClick={() => navigate("/")} className="bg-[#5865f2] text-white px-3 py-2 rounded-full text-sm cursor-pointer mt-5">
        Open Discord
      </button>

    </div>
  )
}

export default Error