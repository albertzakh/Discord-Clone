import { useEffect, useContext } from 'react'
import { SocketContext } from '../features/SocketContext';
import { UserContext } from '../features/UserContext'

function AuthFetch() {
  const { user, authDispatch } = useContext(UserContext);
  const { socket, socketDispatch } = useContext(SocketContext);

  useEffect(() => {
    let effectCleanup = true;
    
    async function FetchUser() {
      if(effectCleanup) {
        const res = await fetch('/api/auth/current-user');
        const data = await res.json();
  
        if(!res.ok) {
          authDispatch({ type: "LOGOUT" });
        }
        else {
          authDispatch({ type: "LOGIN", payload: data });
        }
      }
    }

    FetchUser();

    return () => effectCleanup = false;
  }, []);

  return { user }; 
}

export default AuthFetch;