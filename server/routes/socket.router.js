import SocketController from "../controller/socket.controller.js";

const Sockets = (socket) => {
  const socketController = new SocketController(socket);

  socket.on("join_chat", socketController.joinRoom);
  socket.on("add_message", socketController.addMessage);
  socket.on("add_photo", socketController.addPhoto);
  socket.on("add_photo_group", socketController.addPhotoGroup);
  socket.on("fetch_friend", socketController.fetchFriend);
  socket.on("fetch_group_title", socketController.fetchGroupTitle);
  socket.on("fetch_messages_all", socketController.fetchAllMessages);
  socket.on("friend_invite_sent", socketController.sendFriendInvite);
  socket.on("fetch_pending_all", socketController.fetchAllPending);
  socket.on("fetch_group_pending_all", socketController.fetchAllGroupPending);
  socket.on("fetch_blocked_all", socketController.fetchAllBlocked);
  socket.on("accept_friend_invite", socketController.acceptFriendInvite);
  socket.on("decline_friend_invite", socketController.removeFriendInvite);
  socket.on("fetch_accepted_all", socketController.fetchAllAccepted);
  socket.on("create_group", socketController.createGroup);
  socket.on("send_group_message", socketController.sendGroupMessage);
  socket.on("fetch_groups_messages_all", socketController.fetchGroupMessages);
  socket.on("get_groups", socketController.getGroups);
  socket.on("block_friend", socketController.BlockFriend);
  socket.on("remove_conversation", socketController.removeConversation);
  socket.on("cancel_remove_conversation", socketController.cancelBlockFriend);
  socket.on("delete_leave_group", socketController.DeleteGroup);
  socket.on("group_invite_send", socketController.InviteToGroup);
  socket.on("group_invite_accept", socketController.JoinGroup);
  socket.on("group_invite_decline", socketController.RemoveGroupPending);
  socket.on("get_chat_id", socketController.getChatRoomId);
  socket.on("get_group_id", socketController.getGroupRoomId);
};

export default Sockets;