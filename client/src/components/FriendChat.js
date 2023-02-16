import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../features/UserContext";
import { v4 as uuidv4 } from 'uuid';
import AuthFetch from "../hooks/AuthFetch";
import { SocketContext } from "../features/SocketContext";

function FriendChat() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [friendName, setFriendName] = useState("");

  const [loadingMessage, setLoadingMessage] = useState(false);

  const [room, setRoom] = useState("");
  
  const params = useParams();
  const navigate = useNavigate();

  const inputRef = useRef();
  const chatContainerRef = useRef(null);

  const id = params.id;

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const message = inputRef.current.value;

    if(!message) return;

    const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const Hours = new Date().getHours();
    const Minutes = new Date().getMinutes();
    const TimeFormat = Hours > 12 ? "PM" : "AM";

    const Day = Weekdays[new Date().getDay()];

    const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
    const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

    const messageSend = {
      username: user?.username,
      profilePic: user?.profilePic,
      text: message,
      _id: user?._id,
      createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`
    }

    if(!loadingMessage) {
      console.log("LOADING MESSAGE");
      socket.emit("add_message", { message, userId: user?._id, id, room });
      setMessages([...messages, messageSend]);

      setLoadingMessage(true);
      setTimeout(() => setLoadingMessage(false), 500);
    }
    
    inputRef.current.value = null;
  };

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_messages_all", { userId: user?._id, id });

    socket.on("recieve_messages_all", (data) => {
      setMessages(data.messages)
      setFriendName(data.friendName)
    });
  }, [id]); 

  useEffect(() => {
    if(!socket) return;

    socket.on("recieve_message", data => setMessages([...messages, data]));
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; 
  }, [messages]);

  useEffect(() => {
    if(!socket) return;
    socket.on("error_page", () => navigate("/"));
  })

  useEffect(() => {
    if(!socket) return;
    
    socket.emit("join_chat", room);
  }, [room])

  // Make chat so HTML doesn't re-render every (add another socket to handle on message sent)

  return (
    <div className="flex-1 bg-feed">
      <div className="flex flex-row items-center w-full px-3 py-3 border-b border-[#27292c]">
        <p className="text-xl text-gray font-bold">@</p>
        <strong className="text-white ml-2 text-sm">{friendName}</strong>
        <div className="w-[10px] h-[10px] rounded-full border-[3px] border-gray ml-2"  />
      </div>

      <div ref={chatContainerRef} className="flex flex-col h-chat gap-4 pt-5 overflow-y-auto scrollbar-thumb-sidebar_bg scrollbar-thin scroll-smooth pr-4">
        
          {messages.length > 0 ? messages.map(message => {
            return (
              <div key={uuidv4()} className="flex flex-row px-7 hover:bg-[#32353b] py-1">
                <img className="w-10 h-10 object-cover rounded-full" src={message.profilePic} />
                <div className="ml-3 mt-[-3px]">
                  <div><strong className="text-white text-[13px]">{message.username}</strong><span className="ml-3 text-gray text-[12px]">{message.createdAt}</span></div>
                  <p className="text-white text-[15px] break-all">{message.text}</p>
                </div>
              </div>  
            )
          }) : null}
      </div>

      <div className="flex justify-center">
        <div className="relative top-2 w-[96%] flex items-center bg-[#40444b] p-[10px] border-0 rounded-md">
          <FontAwesomeIcon className="py-[2px] px-[3px] bg-[#b9bbbe] text-lightGray rounded-full" icon={faPlus} />
          <form onSubmit={handleSendMessage} className="w-[96%]">
            <input ref={inputRef} className="bg-[#40444b] text-[15px] w-full flex-1 ml-4 text-md outline-none text-white" placeholder={`Message @${friendName}`} />
          </form>
        </div>
      </div>
    </div>
  )
}

export default FriendChat;