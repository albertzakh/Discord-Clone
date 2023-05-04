import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

export const SingleFriend = async (req, res) => {
  const { id } = req.params;
  
  if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});

  const user = await User.findOne({ _id: req.session.user._id });
  if(!user) return res.status(400).json({error: "Weird login error"});

  try {
    const friend = await User.findOne({ _id: id });
    if(!friend) return res.status(400).json({error: "Friend not found"});

    res.status(200).json(friend.username);
  }
  catch (error) {
    res.status(500).json(error);  
  }
}

export const AcceptedFriends = async (req, res) => {
    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});

    const user = await User.findOne({ _id: req.session.user._id });
    if(!user) return res.status(400).json({error: "Weird login error"});

    try {
      let acceptedFriendsArr = [];
    
      for(let i = 0; i < user.acceptedFriends.length; i++) {
        let acceptedPerson = await User.findOne({ _id: user.acceptedFriends[i] });
        acceptedFriendsArr.push(acceptedPerson);
      }
    
      res.status(200).json(acceptedFriendsArr);
    }
    catch(error) {
      res.status(500).json(error);
    }
};

export const PendingFriends = async (req, res) => {
    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});
  
    const user = await User.findOne({ _id: req.session.user._id });
    if(!user) return res.status(400).json({error: "Weird login error"});
  
    let pendingFriendArr = [];
  
    for(let i = 0; i < user.pendingFriends.length; i++) {
      let pendingPerson = await User.findOne({ _id: user.pendingFriends[i] });
      pendingFriendArr.push(pendingPerson);
    }
  
    res.status(200).json(pendingFriendArr);
};

export const PendingAdd = async (req, res) => {
    const { friendInfo } = req.body;
  
    if(!req.session.user) return res.status(400).json({error: "Not Logged in SESSION!"});
  
    const user = await User.findOne({ _id: req.session.user._id });
  
    if(!user) return res.status(400).json({error: "Weird login error"});
  
    if(!friendInfo.includes("#")) return;
  
    let username = friendInfo.split("#")[0];
    let userhash = friendInfo.split("#")[1];
    
    try {
      const friend = await User.findOne({ username: username, userHash: userhash });
      if(!friend) return res.status(400).json({error: "User does not exist"});
      if(friend._id == req.session.user._id) return res.status(400).json({error: "This is you!"})
    
      if(!friend.pendingFriends.includes(user._id)) {
        await friend.updateOne({$push: { pendingFriends: user._id }});
      } else if(friend.pendingFriends.includes(user._id)) return res.status(400).json({error: "Already sent request to this person"});
  
      res.status(200).json(friend);
    }
    catch {
      res.status(500).json(error);
    }
};

export const PendingRemove = async (req, res) => {
    const { friendInfo } = req.body;
    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});
    
    const user = await User.findOne({ _id: req.session.user._id });
    const friend = await User.findOne({ _id: friendInfo });
    
    if(!user) return res.status(400).json({error: "Weird login error"});
    if(!friend) return res.status(400).json({error: "friend not found"});
  
    try {
      if(user.pendingFriends.includes(friend._id)) {
        await user.updateOne({$pull: { pendingFriends: friend._id }});
      } else if(!user.pendingFriends.includes(friend._id)) return res.status(400).json({error: "Already remove user"});
  
      console.log(user);
    }
    catch(error) {
      res.status(500).json(error)
    }
};

export const FriendAccept = async (req, res) => {
    const { friendInfo } = req.body;
    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});
    
    const user = await User.findOne({ _id: req.session.user._id });
    const friend = await User.findOne({ _id: friendInfo });
    
    if(!user) return res.status(400).json({error: "Weird login error"});
    if(!friend) return res.status(400).json({error: "friend not found"});
  
    try {
      if(user.pendingFriends.includes(friend._id)) {
        await user.updateOne({$push: { acceptedFriends: friend._id }});
        await user.updateOne({$pull: { pendingFriends: friend._id }});
  
        await friend.updateOne({$push: { acceptedFriends: user._id }});
        await friend.updateOne({$pull: { pendingFriends: user._id }});
            
        // let objectName = friend.username + friend.userHash;

        // people: [Albert, Davit]
        // people: [Davit, Albert]

        const conversation = await Chat.create({people: [user._id, friend._id], messages: []});

      } else if(user.pendingFriends.includes(friend._id)) return res.status(400).json({error: "Already remove user"});  
    }
    catch(error) {
      res.status(500).json(error)
    }
};