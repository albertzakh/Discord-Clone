import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as PlusIcon } from "../img/plus.svg";
import { ReactComponent as FileUpload } from "../img/Upload.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faPlus } from "@fortawesome/free-solid-svg-icons";  
import Wumpus from "../img/discord-wumpus.gif";
import GroupLogo from "../img/Group.png";
import AuthFetch from "../hooks/AuthFetch";
import { SocketContext } from "../context/SocketContext";
import GroupDM from "./GroupDM";
import useDate from "../hooks/useDate";
import LoadingSpinner from "./LoadingSpinner";
import { ModalContext } from "../context/ModalContext";

function GroupChat() {
  const { user } = AuthFetch();
  const { socket } = useContext(SocketContext);
  const { InviteOpen, ModalDispatch } = useContext(ModalContext);

  const [messages, setMessages] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [currentMessanger, setCurrentMessanger] = useState(false);

  const [room, setRoom] = useState("");
  
  const params = useParams();
  const navigate = useNavigate();

  const chatContainerRef = useRef();
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
      chatId: room
    };

    if(!loadingMessage) {
      socket.emit("send_group_message", { message, userId: user?._id, id, room, showOnlyMessage:currentMessanger, image: "" });

      setMessages(prev => [...prev, newMessage]);

      setCurrentMessanger(true);
      setLoadingMessage(true);
      setTimeout(() => setLoadingMessage(false), 250);
    } 
    inputRef.current.value = null;
  };

  const handleUploadPhoto = async (event, starterWave) => {
    event.preventDefault();

    if(!starterWave && !event.target.files[0]) return console.log("WILL NOT WORK");

    if(starterWave && !event.target.files) {
      const newMessage = {
        username: user.username,
        profilePic: user.profilePic,
        text: "",
        showOnlyMessage: false,
        image: WampusRef.current.src,
        senderId: user._id,
        createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
        chatId: room
      };

      socket.emit("add_photo_group", { image: WampusRef.current.src, userId: user._id, id, room });
      setMessages((prev) => [...prev, newMessage]);

      return;
    }

    const file = event.target.files[0];

    const res = await fetch('/api/auth/current-user');
    const data = await res.json();

    if(data == null) return navigate("/login");
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
        chatId: room
      };

      socket.emit("add_photo_group", { image: uploadPhoto, userId: user._id, id, room });
      setMessages((prev) => [...prev, newMessage]);

      uploadPhoto = null;
    }
  };

  useEffect(() => {
    if(!socket) return;

    socket.on("group_uploaded", (data) => {
      setMessages((prev) => [...prev, data]);
    })
  }, [socket]);

  useEffect(() => {
    if(!socket) return;
    socket.emit("fetch_group_title", { userId: user?._id, id });

    socket.on("recieve_group_title", (data) => {
      setFriendName(data.groupTitle);
    })
  }, [id]);

  useEffect(() => {
    setLoadingMessages(true);
  }, [id])

  useEffect(() => {
    if(!socket) return;

    socket.emit("fetch_groups_messages_all", { userId: user?._id, id });

    socket.on("recieve_group_messages_all", (data) => {
      setMessages(data.messageData);
      setGroupMembers(data.members);
      setRoom(data.groupId);
      setLoadingMessages(false)
    });
  }, [id]);

  useEffect(() => {
    if(!socket) return;

    socket.on("recieve_group_message", data => {
      setCurrentMessanger(false);
      setMessages([...messages, data]);
    });

    if(!chatContainerRef.current) return;

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; 

  }, [messages])

  useEffect(() => {
    if(!socket) return;

    socket.emit("get_group_id", { userId: user?._id, id });
    socket.on("recieve_group_id", (data) => setRoom(data));
  });

  useEffect(() => {
    if(!socket) return;

    socket.on("error_page", () => navigate("/"));
  });

  useEffect(() => {
    if(!socket) return;
    socket.on("deleted_group", () => navigate("/"));
  });

  useEffect(() => {
    if(!socket) return;

    socket.emit("join_chat", room);
  }, [room])

  return (
    <>
    {!loadingMessages ? (
      <div className="flex-1 bg-[#313338]">
        <div className="flex flex-row items-center w-full px-3 py-3 border-b border-[#27292c]">
          <p className="text-gray font-bold text-xl">@</p>
          <strong className="text-white ml-2 text-sm">{friendName}</strong>
          <div className="w-[10px] h-[10px] rounded-full border-[3px] border-gray ml-2" />
          <div onClick={() => ModalDispatch({ type: "INVITE_GROUP_OPEN", payload: { room, groupMembers } })} className="group absolute right-10 hover:cursor-pointer">
            <FontAwesomeIcon className="text-gray group-hover:text-white" icon={faUserGroup} />
            <FontAwesomeIcon className="text-gray ml-1 group-hover:text-white" icon={faPlus} fontSize={12} />
          </div>
        </div>

        <div ref={chatContainerRef} className="flex flex-col h-chat pt-5 pb-3 overflow-y-auto scrollbar-thumb-sidebar_bg scrollbar-thin scroll-smooth pr-4">

          <div className="px-5 mb-5">
            <img src={GroupLogo} className="w-20 h-20 rounded-full" />
            <h1 className="text-white font-bold text-2xl mt-2">{friendName}</h1>
            <p className="text-[#96979d]">This is the beginning the <span className="font-bold text-[#bbbcc1]">@{friendName}</span> group.</p>
            <hr className="mt-3 text-[#515050]" />
            <div className="w-[260px] flex flex-col items-center">
              <img ref={WampusRef} src={Wumpus} className="w-40 h-40 mb-8"  />
              <button onClick={(event) => handleUploadPhoto(event, true)} className="bg-[#5865f2] text-white w-60 h-10 rounded-sm text-sm hover:bg-[#4752c4]">Wave to {friendName}</button>
            </div>
          </div>
          
            {messages.length > 0 ? messages.map((message, index) => {
              return (
                <GroupDM key={index} {...message} />
              )
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

export default GroupChat;