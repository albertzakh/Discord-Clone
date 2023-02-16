import { useContext, useEffect } from "react";
import { UserContext } from "./features/UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SingleFriend from "./pages/SingleFriend";
import GroupSingle from "./pages/SingleGroup";
import ResetPassword from "./pages/ResetPassword";
import Error from "./pages/Error";
import { io } from 'socket.io-client';
import { SocketContext } from "./features/SocketContext";

const data = io("http://localhost:4000");

function App() {
  const { socket, socketDispatch } = useContext(SocketContext);

  useEffect(() => {
  }, []);
  socketDispatch({ type: "CONNECT_SOCKET", payload: data })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<SingleFriend />} />
        <Route path="/channels/:id" element={<GroupSingle />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" exact element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
