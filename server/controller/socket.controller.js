import mongoose from "mongoose";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";

export default class SocketController {
  constructor(socket, session) {
    this.socket = socket;
  }

  joinRoom = (data) => {
    this.socket.join(data);
  }

  addMessage = async ({ message, showOnlyMessage, image, userId, id, room }) => {
    if(!userId) console.log("NO USER");
      
    if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");
  
    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: id });
  
    if(!user) console.log("NO USER");
    if(!friend) console.log("NO FRIEND")
  
    const chat = await Chat.findOne({$or: [
            {people: [user._id, friend._id]},
            {people: [friend._id, user._id]}
        ]
    });
  
    const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
    const Day = Weekdays[new Date().getDay()];
  
    const Hours = new Date().getHours();
    const Minutes = new Date().getMinutes();
    const TimeFormat = Hours > 12 ? "PM" : "AM";
  
    const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
    const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

    const newMessage = await Message.create({
      username: user.username,
      profilePic: user.profilePic,
      text: message,
      showOnlyMessage: showOnlyMessage,
      image: image,
      senderId: user._id,
      createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
      chatId: chat._id
    });
  
    this.socket.to(room).emit("recieve_message", newMessage);
  }

  addPhoto = async ({ image, userId, id, room }) => {
    if(!userId) console.log("NO USER");
      
    if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");
  
    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: id });
  
    if(!user) return console.log("NO USER");
    if(!friend) return console.log("NO FRIEND")
  
    const chat = await Chat.findOne({$or: [
            {people: [user._id, friend._id]},
            {people: [friend._id, user._id]}
        ]
    });
  
    const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
    const Day = Weekdays[new Date().getDay()];
  
    const Hours = new Date().getHours();
    const Minutes = new Date().getMinutes();
    const TimeFormat = Hours > 12 ? "PM" : "AM";
  
    const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
    const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

    let uploadImage = image.toString("base64");
  
    const newMessage = await Message.create({
      username: user.username,
      profilePic: user.profilePic,
      text: "",
      showOnlyMessage: false,
      image: uploadImage,
      senderId: user._id,
      createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
      chatId: chat._id
    });

    this.socket.to(room).emit("uploaded", newMessage);
  }

  addPhotoGroup = async ({ image, userId, id, room }) => {
    if(!userId) console.log("NO USER");
      
    if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");
  
    const user = await User.findOne({ _id: userId });
    const group = await Group.findOne({ _id: id });
  
    if(!user) return console.log("NO USER");
    if(!group) return console.log("NO FRIEND")
  
    const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
    const Day = Weekdays[new Date().getDay()];
  
    const Hours = new Date().getHours();
    const Minutes = new Date().getMinutes();
    const TimeFormat = Hours > 12 ? "PM" : "AM";
  
    const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
    const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

    let uploadImage = image.toString("base64");
  
    const newMessage = await Message.create({
      username: user.username,
      profilePic: user.profilePic,
      text: "",
      showOnlyMessage: false,
      image: uploadImage,
      senderId: user._id,
      createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
      chatId: group._id
    });

    this.socket.to(room).emit("group_uploaded", newMessage);
  }

  fetchFriend = async ({ userId, id }) => {
      if(!userId) console.log("No user");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.exists({ _id: userId });
      const friend = await User.findOne({ _id: id }).select({ username: 1, profilePic: 1, userHash: 1 });

      if(!user) return;
      if(!friend) return;

      this.socket.emit("recieve_friend", { friendName: friend.username, profilePic:friend.profilePic })

  }

  fetchGroupTitle = async ({ userId, id }) => {
    if(!userId) console.log("No user");

    if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

    const user = await User.findOne({ _id: userId });
    const group = await Group.findOne({ _id: id }).select({ name: 1 });

    if(!user) return;
    if(!group) return;

    this.socket.emit("recieve_group_title", { groupTitle: group.name })
}

  fetchAllMessages = async ({ userId, id }) => {
      if(!userId) console.log("No user");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.findById(userId);
      const friend = await User.findById(id);

      if(!user) return;
      if(!friend) return;

      const chat = await Chat.findOne({$or: [
              {people: [user._id, friend._id]},
              {people: [friend._id, user._id]}
          ]
      });

      if(!chat) return console.log("CHAT_ERROR");
      
      const messageData = await Message.find({ chatId: chat._id });

      this.socket.emit("recieve_messages_all", {messages:messageData, chatId: chat._id});
  }

  sendFriendInvite = async ({ userId, friendInfo }) => {
    if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");

      if(!friendInfo.includes("#")) return;

      let username = friendInfo.split("#")[0];
      let userhash = friendInfo.split("#")[1];
      
      const friend = await User.findOne({ username: username, userHash: userhash });
      if(!friend) return console.log("User does not exist");
      if(friend._id == user._id) return console.log("This is you");

      if(user.acceptedFriends.includes(friend._id) && friend.acceptedFriends.includes(user._id)) {
        return console.log("Already friends");
      }
      
      if(!friend.pendingFriends.includes(user._id)) {
          await friend.updateOne({$push: { pendingFriends: user._id }});
      } else if(friend.pendingFriends.includes(user._id)) console.log("Already sent request to this person");
  }

  fetchAllPending = async ({ userId }) => {
    if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");

      let pendingFriendArr = [];

      for(let i = 0; i < user.pendingFriends.length; i++) {
          let pendingPerson = await User.findOne({ _id: user.pendingFriends[i] });
          if(!pendingPerson) return;
          pendingFriendArr.push({
              username: pendingPerson.username,
              profilePic: pendingPerson.profilePic,
              _id: pendingPerson._id
          });
      }

      this.socket.emit("recieve_pending_all", pendingFriendArr);
  }

  fetchAllBlocked = async ({ userId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    if(!user) return console.log("Weird login error");

    let blockedFriendsArr = [];

      for(let i = 0; i < user.blockedFriends.length; i++) {
          let blockedPerson = await User.findOne({ _id: user.blockedFriends[i] });
          if(!blockedPerson) return;

          blockedFriendsArr.push({username: blockedPerson.username, profilePic: blockedPerson.profilePic, _id: blockedPerson._id });
      }

      this.socket.emit("recieve_blocked_all", blockedFriendsArr);
  }

  acceptFriendInvite = async ({ friendInfo, userId }) => {
    if(!userId) return console.log("Not logged in");
      
      const user = await User.findOne({ _id: userId });
      const friend = await User.findOne({ _id: friendInfo });
      
      if(!user) return console.log("Weird login error");
      if(!friend) return console.log("friend not found");

      if(user.pendingFriends.includes(friend._id)) {
          await user.updateOne({$push: { acceptedFriends: friend._id }});
          await user.updateOne({$pull: { pendingFriends: friend._id }});

          await friend.updateOne({$push: { acceptedFriends: user._id }});
          await friend.updateOne({$pull: { pendingFriends: user._id }});
          const conversation = await Chat.create({people: [user._id, friend._id], messages: []});

      } else if(!user.pendingFriends.includes(friend._id)) return console.log("Already remove user");
  }

  removeFriendInvite = async ({ userId, friendInfo }) => {
    if(!userId) return console.log("Not logged in");
      
      const user = await User.findOne({ _id: userId });
      const friend = await User.findOne({ _id: friendInfo });
      
      if(!user) return console.log("Weird login error");
      if(!friend) return console.log("friend not found");

      if(user.pendingFriends.includes(friend._id)) {
          await user.updateOne({$pull: { pendingFriends: friend._id }});
      } else if(!user.pendingFriends.includes(friend._id)) return console.log("User already removed");
  }

  fetchAllAccepted = async ({ userId }) => {
    if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");
    
      let acceptedFriendsArr = [];

      for(let i = 0; i < user.acceptedFriends.length; i++) {
          let acceptedPerson = await User.findOne({ _id: user.acceptedFriends[i] }).select({ username: 1, profilePic: 1, userHash: 1 });

          acceptedFriendsArr.push(acceptedPerson);
      }

      this.socket.emit("recieve_accepted_all", acceptedFriendsArr);
  }

  createGroup = async ({ userId, groupMembers, title }) => {
      if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");

      if(!title || title.length > 16) return console.log("Group name must have a length of 1 - 16 characters"); 
      if(groupMembers.length <= 0) return console.log("No users listed");

      const memberIds = [];
      
      for(let i = 0; i < groupMembers.length; i++) {
          const username = groupMembers[i].user.split("#")[0];
          const userHash = groupMembers[i].user.split("#")[1];

          const friend = await User.findOne({ username: username, userHash: userHash });

          if(!user.acceptedFriends.includes(friend._id)) return console.log("Cannot create group with user");
          memberIds.push(friend._id);
      }

      const chatGroup = await Group.create({name: title, members: [user._id, ...memberIds], creator: userId });

      if(!user.groups.includes(chatGroup._id)) await user.updateOne({ $push: {groups: chatGroup._id} });
      else if(user.groups.includes(chatGroup._id)) return console.log("User already in this group");

      for(let i = 0; i < memberIds.length; i++) {
          const friend = await User.findOne({ _id: memberIds[i] });
          if(!friend.groups.includes(chatGroup._id)) {
              await friend.updateOne({ $push: {groups: chatGroup._id} });
          } else if(friend.groups.includes(chatGroup._id)) {
              return console.log("Friend already in group");
          }
      }
  }

  sendGroupMessage = async ({ message, userId, id, room, showOnlyMessage, image }) => {
      if(!userId) console.log("NO USER");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.findOne({ _id: userId });
      const group = await Group.findOne({ _id: id });

      if(!user.groups.includes(group._id)) return console.log("User not in group"); 

      if(!user) return console.log("NO USER");
      if(!group) return console.log("NO GROUP");
      if(!message) return console.log("NO MESSAGE");

      const Weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

      const Day = Weekdays[new Date().getDay()];

      const Hours = new Date().getHours();
      const Minutes = new Date().getMinutes();
      const TimeFormat = Hours > 12 ? "PM" : "AM";

      const HoursFormat = Hours < 10 ? "0" + Hours : Hours;
      const MinutesFormat = Minutes < 10 ? "0" + Minutes : Minutes;

      const newMessage = await Message.create({
        username: user.username,
        profilePic: user.profilePic,
        text: message,
        showOnlyMessage: showOnlyMessage,
        image: image,
        senderId: user._id,
        createdAt: `${Day} at ${HoursFormat}:${MinutesFormat} ${TimeFormat}`,
        chatId: group._id
      });

      this.socket.to(room).emit("recieve_group_message", newMessage);
  }

  fetchGroupMessages = async ({ userId, id }) => {
    if(!userId) console.log("No user");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.findOne({ _id: userId });
      const group = await Group.findOne({ _id: id }).select({ name: 1, members: 1 });

      if(!user) return;
      if(!group) return;

      const messageData = await Message.find({ chatId: group._id });

      this.socket.emit("recieve_group_messages_all", {messageData, groupId: group._id, members:group.members});
  }

  getGroups = async ({ userId, id }) => {
    if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");

      const groups = [];
      
      for(let i = 0; i < user.groups.length; i++) {
          const group = await Group.findOne({ _id: user.groups[i] });
          groups.push(group);
      }
      
      this.socket.emit("display_group", groups);
  }

  BlockFriend = async ({ userId, friendId, chatRoom }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    if(!user) return console.log("Weird login error");

    const friend = await User.findOne({ _id: friendId });

    this.socket.to(chatRoom).emit("removed_friend");
    
    if(user.acceptedFriends.includes(friend._id) && !user.blockedFriends.includes(friend._id)) {
      await user.updateOne({$pull: { acceptedFriends: friend._id }});
      await user.updateOne({$push: { blockedFriends: friend._id }});

      await friend.updateOne({$pull: { acceptedFriends: user._id }});

  } else if(!user.acceptedFriends.includes(friend._id)) {
      return console.log("Already remove user");
    }
  }

  removeConversation = async ({ userId, friendId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });
    
    if(!user) return console.log("Weird login error");
    if(!friend) return console.log("Friend not found");

    const chat = await Chat.findOneAndDelete({$or: [
        {people: [user._id, friend._id]},
        {people: [friend._id, user._id]}
      ]
    });

    if(user.blockedFriends.includes(friend._id)) {
      await user.updateOne({$pull: { blockedFriends: friend._id }});

      console.log("CANCELED BLOCKING OF FRIEND");

    } else if(!user.blockedFriends.includes(friend._id)) {
      return console.log("conversation already removed");
    }
  }

  cancelBlockFriend = async ({ userId, friendId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });

    if(!user) return console.log("Weird login error");
    if(!friend) return console.log("Friend not found");
    
    if(user.blockedFriends.includes(friend._id)) {
      await user.updateOne({$push: { acceptedFriends: friend._id }});
      await user.updateOne({$pull: { blockedFriends: friend._id }});

      await friend.updateOne({$push: { acceptedFriends: user._id }});
      
    } else if(!user.blockedFriends.includes(friend._id)) {
      return console.log("User not in blocked area");
    }    
  }

  DeleteGroup = async ({ userId, groupRoom }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const group = await Group.findOne({ _id: groupRoom });

    if(!user) return;
    if(!group) return;

    if(user._id == group.creator && user.groups.includes(group._id)) {
      for(let i = 0; i < group.members.length; i++) {
        const member = await User.findOne({ _id: group.members[i] });
        await member.updateOne({$pull: { groups: group._id }});
      }

      await group.remove();

    } else if(user._id !== group.creator && user.groups.includes(group._id)) {
      await user.updateOne({ $pull: { groups: group._id }});
      await group.updateOne({ $pull: { members: user._id }});
    } else {
      console.log("Not in group");
    }

    this.socket.to(groupRoom).emit("deleted_group");
  }

  InviteToGroup = async ({ userId, groupId, friendId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const friend = await User.findOne({ _id: friendId });
    const group = await Group.findOne({ _id: groupId });

    if(!user) return;
    if(!friend) return;
    if(!group) return;

    if(!friend.pendingGroups.includes(group._id) && !friend.groups.includes(group._id) && user.groups.includes(group._id)) {
      await friend.updateOne({ $push: { pendingGroups: group._id }});
    } else if(friend.groups.includes(group._id)) {
      return console.log("Already in group");
    } 
    else {
      return console.log("Something went wrong when sending group invite");
    }
  }

  fetchAllGroupPending = async ({ userId }) => {
    if(!userId) return console.log("Not logged in");

      const user = await User.findOne({ _id: userId });
      if(!user) return console.log("Weird login error");

      let pendingGroupArr = [];

      for(let i = 0; i < user.pendingGroups.length; i++) {
          let pendingGroup = await Group.findOne({ _id: user.pendingGroups[i] });
          if(!pendingGroup) return;
          pendingGroupArr.push({
            _id: pendingGroup._id,
            name: pendingGroup.name,
            members: pendingGroup.members,
            creator: pendingGroup.creator
          });
      }

      this.socket.emit("recieve_group_pending_all", pendingGroupArr);
  }

  JoinGroup = async ({ userId, groupId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const group = await Group.findOne({ _id: groupId });

    if(!user) return;
    if(!group) return;  

    if(!user.groups.includes(group._id) && user.pendingGroups.includes(group._id)) {
      await user.updateOne({ $push: { groups: group._id }});
      await user.updateOne({ $pull: { pendingGroups: group._id }});

      await group.updateOne({ $push: { members: user._id }});
    } else {
      return console.log("You dont have permission to accept this group invite");
    }
  }

  RemoveGroupPending = async ({ userId, groupId }) => {
    if(!userId) return console.log("Not logged in");

    const user = await User.findOne({ _id: userId });
    const group = await Group.findOne({ _id: groupId });

    if(!user) return;
    if(!group) return;  

    if(!user.groups.includes(group._id) && user.pendingGroups.includes(group._id)) {
      await user.updateOne({ $pull: { pendingGroups: group._id }});
    } else {
      return console.log("You dont have permission to deny this group invite");
    }
  }

  getChatRoomId = async ({ userId, id }) => {
    if(!userId) console.log("No user");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.findOne({ _id: userId });
      const friend = await User.findOne({ _id: id });

      if(!user) return;
      if(!friend) return;

      const chat = await Chat.findOne({$or: [
              {people: [user._id, friend._id]},
              {people: [friend._id, user._id]}
          ]
      });

      if(!chat) return this.socket.emit("error_page");

      this.socket.emit("recieve_chat_id", chat._id)
  }

  getGroupRoomId = async ({ userId, id }) => {
      if(!userId) console.log("No user");

      if(!mongoose.Types.ObjectId.isValid(id)) return this.socket.emit("error_page");

      const user = await User.findOne({ _id: userId });
      const group = await Group.findOne({ _id: id });

      if(!user) return;
      if(!group) return;

      this.socket.emit("recieve_group_id", group._id);
  }
} 