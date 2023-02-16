import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

export const GetMessages = async (req, res) => {
    const { id } = req.params;

    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});

    try {
        const user = await User.findOne({ _id: req.session.user._id });
        const friend = await User.findOne({ _id: id });

        if(!user) return res.status(400).json({error: "Weird login error"});
        if(!friend) return res.status(400).json({error: "Friend not found"});

        const chat = await Chat.findOne({$or: [
                {people: [user._id, friend._id]},
                {people: [friend._id, user._id]}
            ]
        });

        res.status(200).json({messages: chat.messages, friendName: friend.username});
    }
    catch (error) {
        res.status(500).json(error)
    }
}

export const MessageAdd = async (req, res) => {
    const { message } = req.body;
    const { id } = req.params;

    if(!req.session.loggedIn && !req.session.user) return res.status(400).json({error: "Not logged in"});

    try {
        const user = await User.findOne({ _id: req.session.user._id });
        const friend = await User.findOne({ _id: id });

        if(!user) return res.status(400).json({error: "Weird login error"});
        if(!friend) return res.status(400).json({error: "Friend not found"});

        const chat = await Chat.findOne({$or: [
                {people: [user._id, friend._id]},
                {people: [friend._id, user._id]}
            ]
        });

        await chat.updateOne({$push: {messages: {username:user.username, profilePic: user.profilePic, text:message}}})

        res.status(200).json("Awesome");
    }
    catch (error) {
        res.status(500).json(error)
    }
}