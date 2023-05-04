import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthFetch from "../hooks/AuthFetch";
import { SocketContext } from "../context/SocketContext";
import { ReactComponent as PlusIcon } from "../img/plus.svg";
import { ReactComponent as FileUpload } from "../img/Upload.svg";
import Wumpus from "../img/discord-wumpus.gif";
import FriendDM from "./FriendDM";
import useDate from "../hooks/useDate";
import LoadingSpinner from "./LoadingSpinner";

function FriendChat() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [friendProfilePic, setFriendProfilePic] = useState("");
  const [chatId, setChatId] = useState("");
  const [room, setRoom] = useState("");

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [currentMessanger, setCurrentMessanger] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const chatContainerRef = useRef(null);
  const inputRef = useRef();
  const WampusRef = useRef();

  const { Day, HoursFormat, MinutesFormat, TimeFormat } = useDate();

  const id = params.id;

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/current-user');
    const data = await res.json();

    if(data == null) return navigate("/login");

    const message = inputRef.current.value;
    if(!message) return;

    const newMessage = {
      username: user.username,
      profilePic: user.profilePic,
      text: message,
      showOnlyMessage: currentMessanger,
      image: "",
      senderId: user._id,
      createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
      chatId: chatId
    };

    if(!loadingMessage) {
      socket.emit("add_message", 
        { message, userId: user?._id, id, room, showOnlyMessage:currentMessanger, image: "" }
      );

      setMessages(prev => [...prev, newMessage]);

      setCurrentMessanger(true);
      setLoadingMessage(true);

      setTimeout(() => setLoadingMessage(false), 250);
    }
    
    inputRef.current.value = null;
  };

  const handleUploadPhoto = async (event, starterWave) => {
    event.preventDefault();

    if(!starterWave && !event.target.files[0]) return console.log("HEY");

    if(starterWave && !event.target.files) {
      const newMessage = {
        username: user.username,
        profilePic: user.profilePic,
        text: "",
        showOnlyMessage: false,
        image: WampusRef.current.src,
        senderId: user._id,
        createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
        chatId: chatId
      };

      socket.emit("add_photo", { image: WampusRef.current.src, userId: user._id, id, room });
      setMessages((prev) => [...prev, newMessage]);

      return;
    }

    const file = event.target.files[0];

    const res = await fetch('/api/auth/current-user');
    const data = await res.json();

    if(data == null) return navigate("/login");
    if(!file && starterWave) return alert("COOL")
    if(!file) return;

    if(!file.type.match("image.*")) return alert("Only photos are allowed");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      let uploadPhoto = reader.result;

      const newMessage = {
        username: user.username,
        profilePic: user.profilePic,
        text: "",
        showOnlyMessage: false,
        image: uploadPhoto.toString("base64"),
        senderId: user._id,
        createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
        chatId: chatId
      };

      socket.emit("add_photo", { image: uploadPhoto, userId: user._id, id, room });
      setMessages((prev) => [...prev, newMessage]);

      uploadPhoto = null;
    }
  };

  useEffect(() => {
    if(!socket) return;

    socket.on("uploaded", (data) => {
      setMessages((prev) => [...prev, data]);
    })
  }, [socket]);

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_friend", { userId: user?._id, id });

    socket.on("recieve_friend", (data) => {
      setFriendName(data.friendName);
      setFriendProfilePic(data.profilePic);
    })
  }, [id]);

  useEffect(() => {
    setLoadingMessages(true);
  }, [id])

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_messages_all", { userId: user?._id, id });

    socket.on("recieve_messages_all", (data) => {
      setMessages(data.messages);
      setChatId(data.chatId);
      setLoadingMessages(false);
    });

  }, [id]);
  
  useEffect(() => {
    if(!socket) return;
    socket.emit("get_chat_id", { userId: user?._id, id });
    socket.on("recieve_chat_id", (data) => setRoom(data));
  });

  useEffect(() => {
    if(!socket) return;

    socket.on("recieve_message", data => {
      setCurrentMessanger(false);
      setMessages([...messages, data])
    });

    if(!chatContainerRef.current) return; 

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

    return () => socket.off("recieve_message"); 

  }, [messages]);

  useEffect(() => {
    if(!socket) return;
    socket.on("error_page", () => navigate("/"));
  })

  useEffect(() => {
    if(!socket) return;
    socket.on("removed_friend", () => navigate("/"));
  });

  useEffect(() => {
    if(!socket) return;
    socket.emit("join_chat", room);
  }, [room]);

  return (
    <>
    {!loadingMessages ? (
      <div className="flex-1 bg-feed">
        <div className="flex flex-row items-center w-full px-3 py-3 border-b border-[#27292c]">
          <p className="text-xl text-gray font-bold">@</p>
          <strong className="text-white ml-2 text-sm">{friendName}</strong>
          <div className="w-[10px] h-[10px] rounded-full border-[3px] border-gray ml-2"  />
        </div>

        <div ref={chatContainerRef} className="flex flex-col h-chat pt-5 pb-3 overflow-y-auto scrollbar-thumb-sidebar_bg scrollbar-thin scroll-smooth pr-4">

          <div className="px-6 pb-4">
            <img src={friendProfilePic} className="w-20 h-20 rounded-full" />
            <h1 className="text-white font-bold text-3xl mt-2">{friendName}</h1>
            <p className="text-[#96979d]">This is the beginning of your direct message history with <span className="font-bold text-[#bbbcc1]">@{friendName}</span></p>
            <div className="w-[260px] flex flex-col items-center">
              <img ref={WampusRef} src={Wumpus} className="w-40 h-40 mb-8"  />
              <button onClick={(event) => handleUploadPhoto(event, true)} className="bg-[#5865f2] text-white w-60 h-10 rounded-sm text-sm hover:bg-[#4752c4]">Wave to {friendName}</button>
            </div>
          </div>

          {messages && messages.length > 0 ? messages.map((message, index) => {
            return <FriendDM key={index} {...message} />  
          }) : null}

        </div>

        <div className="flex justify-center">
          <div className="relative top-2 w-[96%] flex items-center bg-[#383a40] p-[10px] border-0 rounded-md">
            <PlusIcon className="text-[#b8b9bf] hover:text-[#e8e8e8] cursor-pointer ml-2" />
            <form onSubmit={handleSendMessage} className="flex flex-row w-[96%]">
              <input ref={inputRef} className="bg-[#383a40] text-[15px] flex-1 ml-2 text-md outline-none text-white placeholder-[#62656d]" placeholder={`Message @${friendName}`} />
              <label onChange={(event) => handleUploadPhoto(event, false)}>
                <input type="file" name="photo" className="hidden" accept="image/gif, image/jpeg, image/png, image/webp" />
                <FileUpload name="upload" className="mx-1 text-gray hover:text-white cursor-pointer" />
              </label>
            </form> 
          </div>
        </div>
      </div>
    ) : <LoadingSpinner />}
    </>
  )
}

export default FriendChat;